import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { RefreshCw } from 'lucide-react';
import { bioApi } from '../services/api';

export default function HabitatConditionChart({ conditionData: propConditionData }) {
  const [breakdown, setBreakdown] = useState([]);
  const [dominantCondition, setDominantCondition] = useState('Good');
  const [dominantPercent, setDominantPercent] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (propConditionData && propConditionData.breakdown) {
      setBreakdown(propConditionData.breakdown);
      setDominantCondition(propConditionData.dominant_condition || 'Good');
      setDominantPercent(propConditionData.dominant_percent || 0);
    } else {
      fetchConditions();
    }
  }, [propConditionData]);

  const fetchConditions = async () => {
    setIsLoading(true);
    try {
      const res = await bioApi.getHabitatConditions();
      if (res && res.breakdown) {
        setBreakdown(res.breakdown);
        setDominantCondition(res.dominant_condition || 'Good');
        setDominantPercent(res.dominant_percent || 0);
      }
    } catch (err) {
      console.warn('Error fetching real habitat conditions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
      {/* Header with Refresh */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-slate-900 tracking-tight">
          Habitat Condition
        </h3>
        <button
          onClick={fetchConditions}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-600 border border-slate-200/80 transition-colors"
        >
          <span>Sentinel-2</span>
          <RefreshCw className={`h-3 w-3 text-slate-400 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Donut & Legend Split */}
      <div className="flex items-center justify-between gap-2">
        {/* Semi Donut Ring Canvas */}
        <div className="h-44 w-44 relative shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={breakdown}
                cx="50%"
                cy="50%"
                innerRadius={48}
                outerRadius={68}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
              >
                {breakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(val, name, props) => [`${val}%`, props.payload.name]}
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
              {dominantPercent}%
            </span>
            <span
              className={`text-[10px] font-bold ${
                dominantCondition === 'Good' || dominantCondition === 'Optimal'
                  ? 'text-emerald-600'
                  : dominantCondition === 'Moderate'
                  ? 'text-amber-600'
                  : 'text-rose-600'
              }`}
            >
              {dominantCondition}
            </span>
          </div>
        </div>

        {/* Legend Breakdown */}
        <div className="space-y-1.5 flex-1 pl-2">
          {breakdown.map((item, idx) => (
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

