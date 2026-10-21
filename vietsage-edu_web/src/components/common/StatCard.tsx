import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtext?: string;
  icon: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  colorScheme?: 'blue' | 'emerald' | 'amber' | 'indigo' | 'rose' | 'purple';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtext,
  icon,
  trend,
  colorScheme = 'blue'
}) => {
  const colorMap = {
    blue: 'bg-blue-50 text-blue-600 ring-blue-500/10',
    emerald: 'bg-emerald-50 text-emerald-600 ring-emerald-500/10',
    amber: 'bg-amber-50 text-amber-600 ring-amber-500/10',
    indigo: 'bg-indigo-50 text-indigo-600 ring-indigo-500/10',
    rose: 'bg-rose-50 text-rose-600 ring-rose-500/10',
    purple: 'bg-purple-50 text-purple-600 ring-purple-500/10'
  };

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {title}
          </p>
          <h3 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
            {value}
          </h3>
        </div>
        <div className={`rounded-xl p-3 ring-1 ${colorMap[colorScheme]}`}>
          {icon}
        </div>
      </div>

      {(subtext || trend) && (
        <div className="mt-3 flex items-center gap-2 text-xs">
          {trend && (
            <span
              className={`font-semibold ${
                trend.isPositive ? 'text-emerald-600' : 'text-rose-600'
              }`}
            >
              {trend.value}
            </span>
          )}
          {subtext && <span className="text-slate-500">{subtext}</span>}
        </div>
      )}
    </div>
  );
};
