import React from 'react';
import { promises as fs } from 'fs';
import path from 'path';
import ReactMarkdown from 'react-markdown';

export default async function PrivacyPolicyPage() {
  let content = 'Document currently unavailable.';
  
  try {
    const filePath = path.join(process.cwd(), 'docs', 'PRIVACY_POLICY.md');
    content = await fs.readFile(filePath, 'utf8');
  } catch (error) {
    console.error('Error reading Privacy Policy:', error);
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-24 text-zinc-300">
      <div className="prose prose-invert prose-cyan max-w-none">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  );
}