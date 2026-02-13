/* src/components/ui/IndustrialButton.tsx */
import React from 'react';
import Link from 'next/link';

interface ButtonProps {
  children: React.ReactNode;
  href?: string;
  variant?: 'primary' | 'ghost';
  onClick?: () => void;
  className?: string;
}

export const IndustrialButton = ({ children, href, variant = 'primary', onClick, className = '' }: ButtonProps) => {
  const baseStyles = "inline-flex items-center justify-center font-bold px-8 py-4 rounded-sm uppercase tracking-widest text-sm transition-all duration-300";
  
  const variants = {
    primary: "bg-neon-teal text-bg-app hover:shadow-[0_0_20px_rgba(45,212,191,0.5)] hover:-translate-y-1",
    ghost: "border border-white/20 text-text-muted hover:border-text-main hover:text-text-main hover:bg-white/5"
  };

  const combinedClasses = `${baseStyles} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={combinedClasses}>
        {children}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={combinedClasses}>
      {children}
    </button>
  );
};