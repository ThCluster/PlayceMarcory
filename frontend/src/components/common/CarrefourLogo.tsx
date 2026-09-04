import React from 'react';

interface CarrefourLogoProps {
  className?: string;
  variant?: 'full' | 'icon-only';
  lightText?: boolean;
}

export const CarrefourLogo: React.FC<CarrefourLogoProps> = ({
  className = '',
  variant = 'full',
  lightText = false,
}) => {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Carrefour 'C' SVG Icon */}
      <svg
        viewBox="0 0 100 100"
        className="w-9 h-9 shrink-0 drop-shadow-xs"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Left Red Diamond Component */}
        <path
          d="M 50,20 C 40,20 28,30 20,40 L 45,50 L 20,60 C 28,70 40,80 50,80 C 42,72 38,62 38,50 C 38,38 42,28 50,20 Z"
          fill="#d91f26"
        />
        {/* Right Blue Arrow Component */}
        <path
          d="M 50,20 C 58,28 62,38 62,50 C 62,62 58,72 50,80 C 60,80 72,70 80,60 L 55,50 L 80,40 C 72,30 60,20 50,20 Z"
          fill="#0b44a7"
        />
      </svg>

      {variant === 'full' && (
        <div className="flex flex-col leading-none select-none">
          <span className={`font-black text-xl tracking-tight ${lightText ? 'text-white' : 'text-[#0b44a7]'}`}>
            Carrefour
          </span>
          <span className="font-bold text-xs text-[#d91f26] tracking-wider uppercase mt-0.5">
            Supermarché
          </span>
        </div>
      )}
    </div>
  );
};
