import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { RefreshCw } from 'lucide-react';
import { bioApi } from '../services/api';

export default function DataSourcesChart({ dataSources: propDataSources }) {
  const [data, setData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (propDataSources && propDataSources.items) {
      setData(propDataSources.items);
      setTotalRecords(propDataSources.total_records || 0);
    } else {
      fetchBreakdown();
    }
  }, [propDataSources]);

  const fetchBreakdown = async () => {
    setIsLoading(true);
    try {
      const res = await bioApi.getDataSourcesBreakdown();
      if (res && res.items) {
        setData(res.items);
        setTotalRecords(res.total_records || 0);
      }
    } catch (err) {
      console.warn('Error fetching real data sources breakdown:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
      {/* Header with Refresh Button */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-slate-900 tracking-tight">
          Data Sources Overview
        </h3>
        <button
          onClick={fetchBreakdown}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-600 border border-slate-200/80 transition-colors"
        >
          <span>Live Ingestion</span>
          <RefreshCw className={`h-3 w-3 text-slate-400 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Donut & Legend Split */}
      <div className="flex items-center justify-between gap-2">
        {/* Donut Canvas */}
        <div className="h-44 w-44 relative shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={48}
                outerRadius={68}
                paddingAngle={4}
                dataKey="value"
                strokeWidth={0}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(val, name, props) => [`${val}% (${props.payload.count || ''} records)`, props.payload.name]}
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
              {totalRecords.toLocaleString()}
            </span>
            <span className="text-[10px] font-medium text-slate-400">
              Total Records
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
                <span className="text-slate-600 font-medium truncate max-w-[90px]">
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

