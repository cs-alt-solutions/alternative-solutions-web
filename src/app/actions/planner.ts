'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/utils/supabase/server'; 
import { Directive } from '@/utils/glossary';
import { logPulse } from './pulse';

export async function logDirective(directive: Omit<Directive, 'id' | 'status'>) {
  const supabase = await createClient();
  const { error } = await supabase.from('ideas_ledger').insert([{
    title: directive.title,
    goal_id: directive.goalId,
    priority: directive.priority,
    classification: directive.classification,
    status: 'IN_PROGRESS'
  }]);

  if (!error) {
    await logPulse('BUILD_UPDATE', `New Directive: ${directive.title}`);
    revalidatePath('/dashboard');
    revalidatePath('/dashboard/tasks');
  }
  return { success: !error };
}

export async function getActiveDirectives() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('ideas_ledger')
    .select('*')
    .eq('status', 'IN_PROGRESS') 
    .order('created_at', { ascending: false });
    
  if (error) return [];
  return data;
}

export async function getActiveProjects() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('status', 'ACTIVE')
    .order('created_at', { ascending: false });
    
  if (error) return [];
  return data;
}

export async function createNewClient(formData: FormData) {
  const supabase = await createClient();
  const clientName = formData.get('clientName') as string;
  
  const clientId = clientName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  const { error } = await supabase.from('clients').insert([{
    id: clientId,
    name: clientName,
    status: 'ACTIVE'
  }]);

  if (!error) {
    await logPulse('NEW_CLIENT', `Provisioned HQ for: ${clientName}`);
    revalidatePath('/dashboard'); 
  }
  
  return { success: !error, clientId, error: error?.message };
}