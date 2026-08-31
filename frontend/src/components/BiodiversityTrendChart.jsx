import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { ChevronDown } from 'lucide-react';

const data = [
  { day: '12 May', value: 20 },
  { day: '13 May', value: 48 },
  { day: '14 May', value: 35 },
  { day: '15 May', value: 62 },
  { day: '16 May', value: 54 },
  { day: '17 May', value: 76 },
  { day: '18 May', value: 78 },
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-emerald-900 text-white px-2.5 py-1 rounded-lg text-xs font-bold shadow-lg border border-emerald-700">
        <div className="text-sm font-extrabold">{payload[0].value}</div>
        <div className="text-[10px] text-emerald-300 font-normal">{payload[0].payload.day}</div>
      </div>
    );
  }
  return null;
};

export default function BiodiversityTrendChart() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
      {/* Header with Period Dropdown */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-slate-900 tracking-tight">
          Biodiversity Trend
        </h3>
        <button className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-600 border border-slate-200/80 transition-colors">
          <span>This Month</span>
          <ChevronDown className="h-3 w-3 text-slate-400" />
        </button>
      </div>

      {/* Chart Canvas */}
      <div className="h-48 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
          >
            <defs>
              <linearGradient id="bioGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f1f5f9"
            />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 500 }}
            />
            <YAxis
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 500 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#10b981"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#bioGradient)"
              activeDot={{
                r: 6,
                fill: '#10b981',
                stroke: '#ffffff',
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>

        {/* Current Pin Pill Marker */}
        <div className="absolute top-2 right-4 bg-emerald-900 text-white px-2 py-0.5 rounded text-[10px] font-bold shadow-md hidden sm:block">
          78 <span className="font-normal text-emerald-300">18 May</span>
        </div>
      </div>
    </div>
  );
}
