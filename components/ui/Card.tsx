import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glow' | 'accent' | 'danger';
  children: React.ReactNode;
}

export function Card({ variant = 'default', className = '', children, ...props }: CardProps) {
  const base = 'rounded-xl border transition-all duration-200';
  
  const variants = {
    default: 'bg-[#12141c] border-[#1e2230] text-neutral-100 shadow-sm',
    glow: 'bg-[#12141c] border-[#f7931a]/30 shadow-[0_0_20px_rgba(247,147,26,0.12)] text-neutral-100',
    accent: 'bg-gradient-to-br from-[#161a26] to-[#12141c] border-[#252b3d] text-neutral-100',
    danger: 'bg-[#181116] border-red-500/30 text-neutral-100',
  };

  return (
    <div className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ className = '', children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`p-5 pb-3 border-b border-[#1e2230]/60 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className = '', children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={`text-base font-semibold text-neutral-100 tracking-tight flex items-center gap-2 ${className}`} {...props}>
      {children}
    </h3>
  );
}

export function CardDescription({ className = '', children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={`text-xs text-neutral-400 mt-1 ${className}`} {...props}>
      {children}
    </p>
  );
}

export function CardContent({ className = '', children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`p-5 ${className}`} {...props}>
      {children}
    </div>
  );
}
