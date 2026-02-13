/* src/components/ui/FeatureCard.tsx */
import React from 'react';
import Link from 'next/link';

interface CardProps {
  title: string;
  description: string;
  linkText: string;
  href: string;
  color: 'cyan' | 'purple'; // Enforcing brand colors
}

export const FeatureCard = ({ title, description, linkText, href, color }: CardProps) => {
  const colorClasses = {
    cyan: "group-hover:text-neon-cyan group-hover:border-neon-cyan/50",
    purple: "group-hover:text-neon-purple group-hover:border-neon-purple/50"
  };

  return (
    <Link href={href} className="group relative p-12 md:p-16 border border-white/5 bg-bg-panel/50 hover:bg-bg-panel transition-all duration-500 overflow-hidden">
      {/* Hover Gradient Background */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-br from-${color === 'cyan' ? 'neon-cyan' : 'neon-purple'} to-transparent`} />
      
      <div className="relative z-10">
        <h3 className={`text-3xl font-bold mb-4 text-text-main transition-colors ${colorClasses[color]}`}>
          {title}
        </h3>
        <p className="text-text-muted text-lg mb-8 leading-relaxed max-w-md">
          {description}
        </p>
        <span className={`inline-flex items-center text-sm font-mono uppercase tracking-widest border-b border-transparent transition-all ${colorClasses[color]}`}>
          {linkText} <span className="ml-2 transform group-hover:translate-x-1 transition-transform">→</span>
        </span>
      </div>
    </Link>
  );
};