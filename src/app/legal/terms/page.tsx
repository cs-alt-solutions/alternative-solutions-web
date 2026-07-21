import React from 'react';
import { promises as fs } from 'fs';
import path from 'path';
import ReactMarkdown from 'react-markdown';

export default async function TermsOfServicePage() {
  let content = 'Document currently unavailable.';
  
  try {
    // We use path.join with process.cwd() which is the standard Next.js way to reliably find the root folder
    const filePath = path.join(process.cwd(), 'docs', 'TERMS_OF_SERVICE.md');
    content = await fs.readFile(filePath, 'utf8');
  } catch (error) {
    console.error('Error reading Terms of Service:', error);
    // You'll see this error in your VS Code terminal if the file still isn't found!
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-24 text-zinc-300">
      <div className="prose prose-invert prose-cyan max-w-none">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  );
}