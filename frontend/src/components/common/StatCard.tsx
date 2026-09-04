import React from 'react';
import { LucideIcon, ArrowUpRight } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  trend: string;
  comparisonText?: string;
  icon: LucideIcon;
  iconBgColor: 'blue' | 'red';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  trend,
  comparisonText = 'vs hier',
  icon: Icon,
  iconBgColor,
}) => {
  const isBlue = iconBgColor === 'blue';

  // Format value to separate number and currency if FCFA is present
  const isFCFA = value.includes('FCFA');
  const numberPart = isFCFA ? value.replace('FCFA', '').trim() : value;

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-4.5 border border-gray-100/90 shadow-xs flex flex-col justify-between gap-3 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 min-w-0">
      {/* Header: Title + Icon Badge */}
      <div className="flex items-start justify-between gap-2">
        <span className="text-xs font-bold text-gray-600 leading-snug min-w-0">{title}</span>
        <div
          className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0 text-white shadow-2xs ${
            isBlue ? 'bg-[#0942a6]' : 'bg-[#d91f26]'
          }`}
        >
          <Icon className="w-4 h-4 stroke-[2.2]" />
        </div>
      </div>

      {/* Main Metric Value */}
      <div className="my-0.5">
        <div className="flex items-baseline flex-wrap gap-x-1.5">
          <span className="text-lg sm:text-xl font-black text-gray-900 tracking-tight leading-none">
            {numberPart}
          </span>
          {isFCFA && (
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              FCFA
            </span>
          )}
        </div>
      </div>

      {/* Footer: Trend Badge & Comparison */}
      <div className="flex items-center gap-1.5 pt-2 border-t border-gray-100/80">
        <span className="inline-flex items-center gap-0.5 text-[11px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100/80 shrink-0">
          <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
          {trend}
        </span>
        <span className="text-[11px] text-gray-400 font-medium truncate">{comparisonText}</span>
      </div>
    </div>
  );
};

