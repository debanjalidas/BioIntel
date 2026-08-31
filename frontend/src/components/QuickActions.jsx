import React from 'react';
import {
  Upload,
  Mic,
  ClipboardList,
  PlusSquare,
  BellRing,
  FileSpreadsheet,
} from 'lucide-react';

export default function QuickActions({ onActionClick }) {
  const actions = [
    {
      id: 'upload_edna',
      title: 'Upload eDNA Data',
      icon: Upload,
      iconColor: 'text-emerald-700',
      bgColor: 'bg-emerald-50 hover:bg-emerald-100/80 border-emerald-200/80',
    },
    {
      id: 'upload_audio',
      title: 'Upload Audio',
      icon: Mic,
      iconColor: 'text-emerald-700',
      bgColor: 'bg-emerald-50 hover:bg-emerald-100/80 border-emerald-200/80',
    },
    {
      id: 'add_survey',
      title: 'Add Survey',
      icon: ClipboardList,
      iconColor: 'text-emerald-700',
      bgColor: 'bg-emerald-50 hover:bg-emerald-100/80 border-emerald-200/80',
    },
    {
      id: 'add_observation',
      title: 'Add Observation',
      icon: PlusSquare,
      iconColor: 'text-emerald-700',
      bgColor: 'bg-emerald-50 hover:bg-emerald-100/80 border-emerald-200/80',
    },
    {
      id: 'create_alert',
      title: 'Create Alert',
      icon: BellRing,
      iconColor: 'text-rose-600',
      bgColor: 'bg-rose-50 hover:bg-rose-100/80 border-rose-200/80',
    },
    {
      id: 'generate_report',
      title: 'Generate Report',
      icon: FileSpreadsheet,
      iconColor: 'text-emerald-700',
      bgColor: 'bg-emerald-50 hover:bg-emerald-100/80 border-emerald-200/80',
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
      <h3 className="text-base font-bold text-slate-900 tracking-tight mb-4">
        Quick Actions
      </h3>

      {/* 2x3 Action Tiles Grid */}
      <div className="grid grid-cols-3 gap-2.5 flex-1">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              onClick={() => onActionClick && onActionClick(action.id)}
              className={`p-3 rounded-xl border ${action.bgColor} flex flex-col items-center justify-center text-center gap-2 transition-all hover:shadow-xs group`}
            >
              <div
                className={`h-8 w-8 rounded-lg flex items-center justify-center ${action.iconColor} group-hover:scale-110 transition-transform`}
              >
                <Icon className="h-5 w-5 stroke-[2]" />
              </div>
              <span className="text-[11px] font-bold text-slate-800 leading-tight">
                {action.title}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
