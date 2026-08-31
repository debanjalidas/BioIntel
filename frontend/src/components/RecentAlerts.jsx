import React from 'react';
import {
  AlertCircle,
  AlertTriangle,
  Info,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';

export const alertsList = [
  {
    id: 1,
    severity: 'Critical',
    severityColor: 'bg-rose-50 text-rose-700 border-rose-200/80',
    iconColor: 'text-rose-600 bg-rose-100',
    title: 'Habitat Degradation Detected',
    location: 'Western Zone',
    time: '2h ago',
    icon: AlertCircle,
    description: 'Automated satellite Sentinel-2 change detection flagged 14% sudden NDVI drop in sector W-4.',
  },
  {
    id: 2,
    severity: 'High Risk',
    severityColor: 'bg-amber-50 text-amber-800 border-amber-200/80',
    iconColor: 'text-amber-600 bg-amber-100',
    title: 'Possible Invasive Species',
    location: 'Northern Zone',
    time: '5h ago',
    icon: AlertTriangle,
    description: 'eDNA sequence alignment matched Gambusia affinis with 99.2% confidence in Northern riparian zone.',
  },
  {
    id: 3,
    severity: 'Warning',
    severityColor: 'bg-amber-50/70 text-amber-700 border-amber-200/60',
    iconColor: 'text-amber-500 bg-amber-50',
    title: 'Acoustic Activity Decline',
    location: 'Central Zone',
    time: '1d ago',
    icon: AlertTriangle,
    description: 'Avian bioacoustic call frequencies dropped below 2-sigma seasonal baseline over 48 hours.',
  },
  {
    id: 4,
    severity: 'Info',
    severityColor: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
    iconColor: 'text-emerald-600 bg-emerald-100',
    title: 'eDNA Sample Processed',
    location: 'Eastern Zone',
    time: '1d ago',
    icon: Info,
    description: 'Batch #EDNA-2024-0518 sequencing pipeline completed: 48 species detected.',
  },
];

export default function RecentAlerts({ onSelectAlert, onViewAll }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between h-full min-h-[380px]">
      {/* Card Header */}
      <div className="flex items-center justify-between mb-3.5 pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            Recent Alerts
          </h3>
          <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
        </div>
        <button
          onClick={onViewAll}
          className="text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline transition-all"
        >
          View All
        </button>
      </div>

      {/* Alert Items List */}
      <div className="space-y-2.5 flex-1 flex flex-col justify-between">
        {alertsList.map((alert) => {
          const Icon = alert.icon;
          return (
            <div
              key={alert.id}
              onClick={() => onSelectAlert && onSelectAlert(alert)}
              className="p-3 rounded-xl bg-slate-50/70 hover:bg-slate-100/80 border border-slate-200/70 hover:border-slate-300/80 transition-all cursor-pointer flex items-center justify-between group"
            >
              <div className="flex items-start gap-3 min-w-0 pr-2">
                {/* Severity Icon */}
                <div
                  className={`h-9 w-9 rounded-xl ${alert.iconColor} flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform`}
                >
                  <Icon className="h-4 w-4" />
                </div>

                {/* Details */}
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${alert.severityColor}`}
                    >
                      {alert.severity}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 truncate">
                    {alert.title}
                  </h4>
                  <p className="text-[11px] font-medium text-slate-500 mt-0.5">
                    {alert.location} <span className="text-slate-300">•</span> {alert.time}
                  </p>
                </div>
              </div>

              {/* Chevron Link */}
              <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-0.5 transition-all shrink-0" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
