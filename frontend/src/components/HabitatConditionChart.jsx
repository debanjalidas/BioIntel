import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { ChevronDown } from 'lucide-react';

const data = [
  { name: 'Good', value: 68, color: '#22c55e' },
  { name: 'Moderate', value: 20, color: '#f59e0b' },
  { name: 'Poor', value: 8, color: '#f43f5e' },
  { name: 'Critical', value: 4, color: '#e11d48' },
];

export default function HabitatConditionChart() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
      {/* Header with Filter Dropdown */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-slate-900 tracking-tight">
          Habitat Condition
        </h3>
        <button className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-600 border border-slate-200/80 transition-colors">
          <span>By Area</span>
          <ChevronDown className="h-3 w-3 text-slate-400" />
        </button>
      </div>

      {/* Donut & Legend Split */}
      <div className="flex items-center justify-between gap-2">
        {/* Semi Donut Ring Canvas */}
        <div className="h-44 w-44 relative shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={48}
                outerRadius={68}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(val) => [`${val}%`, 'Coverage']}
                contentStyle={{
                  borderRadius: '0.75rem',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  backgroundColor: '#0f172a',
                  color: '#fff',
                  border: 'none',
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Center Metric Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-base font-extrabold text-slate-900 leading-tight">
              68%
            </span>
            <span className="text-[10px] font-bold text-emerald-600">
              Good
            </span>
          </div>
        </div>

        {/* Legend Breakdown */}
        <div className="space-y-1.5 flex-1 pl-2">
          {data.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-slate-600 font-medium">
                  {item.name}
                </span>
              </div>
              <span className="font-bold text-slate-800 font-mono">
                {item.value}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
