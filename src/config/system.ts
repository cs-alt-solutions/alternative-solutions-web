/* src/config/system.ts */

export const SYSTEM_CONFIG = {
  RATES: {
    LABOR: 50,
    FOUNDER: 5,     
    PUBLIC: 49      
  },
  FEES: {
    PLATFORM_CUT: 0.15 
  },
  TAX_RESERVE_RATE: 0.25, 
  
  PAYROLL_MATRIX: {
    PERSONAL: 0.50,
    BUSINESS: 0.30,
    Warehouse: 0.20
  },
  SURVIVAL_BUDGET: {
    RENT: 0.60,      
    UTILITIES: 0.20, 
    GROCERIES: 0.15, 
    MISC: 0.05       
  },
  LEDGER_CATEGORIES: {
    INCOME: [
      { id: 'W2', label: 'W-2 Wage (Taxes Paid)', color: 'text-emerald-400' },
      { id: '1099', label: '1099/Contract (Needs Tax)', color: 'text-orange-400' },
      { id: 'SUPPORT', label: 'External Support (Non-Tax)', color: 'text-fuchsia-400' }
    ],
    EXPENSE: [
      { id: 'SURVIVAL', label: 'Survival (Rent/Utilities)', color: 'text-white' },
      { id: 'DEPENDENT', label: 'Dependent Care (School/Camp)', color: 'text-purple-400' },
      { id: 'BUSINESS', label: 'Business Fuel (Tech/Supplies)', color: 'text-brand-primary' }
    ]
  }
};

export interface AppTool { id: string; name: string; cost: number; category: 'PROJECT' | 'INVENTORY' | 'FINANCE'; }
export interface HourTier { label: string; value: number; }

export interface StrategicGoal { id: string; label: string; color: string; description: string; }

export const STRATEGIC_GOALS: Record<string, StrategicGoal> = { 
  WEBSITE: { id: 'goal_website', label: 'Alternative Solutions Brand', color: '#00D1FF', description: 'The digital face.' }, 
  COMMAND_CENTER: { id: 'goal_command', label: 'Lead Architect Dashboard', color: '#7000FF', description: 'Internal engine.' }, 
  SHIFT_STUDIO: { id: 'goal_shift', label: 'Shift Studio (Beta)', color: '#FF007A', description: 'Command center.' } 
};

export interface Directive { id: number; goalId: string; title: string; priority: 'high' | 'medium' | 'low'; status: 'pending' | 'completed'; classification: string; }