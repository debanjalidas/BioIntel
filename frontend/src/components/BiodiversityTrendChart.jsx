import React, { useState, useEffect } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { ChevronDown, RefreshCw } from 'lucide-react';
import { bioApi } from '../services/api';

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

export default function BiodiversityTrendChart({ trendData: propTrendData }) {
  const [trendData, setTrendData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (propTrendData && propTrendData.length > 0) {
      setTrendData(propTrendData);
    } else {
      fetchTrend();
    }
  }, [propTrendData]);

  const fetchTrend = async () => {
    setIsLoading(true);
    try {
      const res = await bioApi.getBiodiversityTrends();
      if (res && res.daily_trend && res.daily_trend.length > 0) {
        setTrendData(res.daily_trend);
      } else if (res && res.months && res.months.length > 0) {
        const formatted = res.months.slice(-7).map((m, idx) => ({
          day: m,
          value: Math.round((res.shannon_diversity_index[idx] || 3.5) * 20),
        }));
        setTrendData(formatted);
      }
    } catch (err) {
      console.warn('Error fetching real biodiversity trend:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const latestVal = trendData.length > 0 ? trendData[trendData.length - 1].value : '--';
  const latestDay = trendData.length > 0 ? trendData[trendData.length - 1].day : '';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
      {/* Header with Period Dropdown */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-slate-900 tracking-tight">
          Biodiversity Trend
        </h3>
        <button
          onClick={fetchTrend}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-600 border border-slate-200/80 transition-colors"
        >
          <span>Live Index</span>
          <RefreshCw className={`h-3 w-3 text-slate-400 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Chart Canvas */}
      <div className="h-48 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={trendData}
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
        {latestDay && (
          <div className="absolute top-2 right-4 bg-emerald-900 text-white px-2 py-0.5 rounded text-[10px] font-bold shadow-md hidden sm:block">
            {latestVal} <span className="font-normal text-emerald-300">{latestDay}</span>
          </div>
        )}
      </div>
    </div>
  );
}

