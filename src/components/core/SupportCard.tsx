import React from 'react';
import { WEBSITE_COPY } from '@/utils/glossary';

export default function SupportCard() {
  const { TITLE, DESC, STRIPE_LINK, BTN_TEXT } = WEBSITE_COPY.SUPPORT_MODULE;

  return (
    <div className="bg-zinc-950 border border-zinc-800 p-8 rounded-lg max-w-md mx-auto text-center shadow-lg">
      <h3 className="text-xl font-bold text-white mb-3 tracking-wide">
        {TITLE}
      </h3>
      <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
        {DESC}
      </p>
      <a 
        href={STRIPE_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block w-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-3 px-6 rounded transition-colors duration-200"
      >
        {BTN_TEXT}
      </a>
    </div>
  );
}