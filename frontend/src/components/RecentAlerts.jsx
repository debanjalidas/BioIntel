import React from 'react';
import {
  AlertCircle,
  AlertTriangle,
  Info,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';

export default function RecentAlerts({ alerts = [], onSelectAlert, onViewAll }) {
  const displayAlerts = alerts.length > 0 ? alerts.slice(0, 4) : [];

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
          View All ({alerts.length})
        </button>
      </div>

      {/* Alert Items List */}
      <div className="space-y-2.5 flex-1 flex flex-col justify-between">
        {displayAlerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-slate-400 text-xs">
            <ShieldAlert className="h-8 w-8 text-emerald-500 mb-2 opacity-80" />
            <span>All monitored sectors operating nominally</span>
          </div>
        ) : (
          displayAlerts.map((alert) => {
            const isCrit = (alert.severity || '').toUpperCase() === 'CRITICAL';
            const isWarn = (alert.severity || '').toUpperCase() === 'WARNING' || (alert.severity || '').toUpperCase() === 'HIGH RISK';
            
            const Icon = isCrit ? AlertCircle : isWarn ? AlertTriangle : Info;
            const iconColor = isCrit
              ? 'text-rose-600 bg-rose-100'
              : isWarn
              ? 'text-amber-600 bg-amber-100'
              : 'text-emerald-600 bg-emerald-100';

            const severityColor = isCrit
              ? 'bg-rose-50 text-rose-700 border-rose-200/80'
              : isWarn
              ? 'bg-amber-50 text-amber-800 border-amber-200/80'
              : 'bg-emerald-50 text-emerald-800 border-emerald-200/80';

            return (
              <div
                key={alert.id}
                onClick={() => onSelectAlert && onSelectAlert(alert)}
                className="p-3 rounded-xl bg-slate-50/70 hover:bg-slate-100/80 border border-slate-200/70 hover:border-slate-300/80 transition-all cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-start gap-3 min-w-0 pr-2">
                  {/* Severity Icon */}
                  <div
                    className={`h-9 w-9 rounded-xl ${iconColor} flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>

                  {/* Details */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${severityColor}`}
                      >
                        {alert.severity}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 truncate">
                      {alert.title}
                    </h4>
                    <p className="text-[11px] font-medium text-slate-500 mt-0.5 truncate">
                      {alert.location || alert.site_code} <span className="text-slate-300">•</span> {alert.time || 'Recently'}
                    </p>
                  </div>
                </div>

                {/* Chevron Link */}
                <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-0.5 transition-all shrink-0" />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

