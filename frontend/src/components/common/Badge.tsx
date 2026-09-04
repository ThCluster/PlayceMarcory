import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'payee' | 'recu' | 'warning' | 'danger' | 'neutral';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  className = '',
}) => {
  const variantStyles = {
    payee: 'bg-emerald-50 text-emerald-600 font-semibold border border-emerald-100',
    recu: 'bg-blue-50 text-[#0942a6] font-semibold border border-blue-100',
    warning: 'bg-amber-50 text-amber-600 font-semibold border border-amber-100',
    danger: 'bg-red-50 text-[#d91f26] font-semibold border border-red-100',
    neutral: 'bg-gray-50 text-gray-600 font-semibold border border-gray-100',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs transition-colors whitespace-nowrap ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
