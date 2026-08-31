import React from 'react';
import {
  LayoutDashboard,
  Compass,
  PawPrint,
  Mic,
  Dna,
  Satellite,
  ClipboardList,
  ShieldAlert,
  BarChart3,
  Box,
  FileText,
  UploadCloud,
  Users,
  Settings,
  TreePine,
  TrendingUp,
} from 'lucide-react';

export const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'map', label: 'Map Explorer', icon: Compass },
  { id: 'species', label: 'Species', icon: PawPrint },
  { id: 'bioacoustics', label: 'Bioacoustics', icon: Mic },
  { id: 'edna', label: 'eDNA Samples', icon: Dna },
  { id: 'remote_sensing', label: 'Remote Sensing', icon: Satellite },
  { id: 'ground_surveys', label: 'Ground Surveys', icon: ClipboardList },
  { id: 'alerts', label: 'Alerts & Risks', icon: ShieldAlert, badge: 3 },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'digital_twin', label: 'Digital Twin', icon: Box },
  { id: 'reports', label: 'Reports', icon: FileText },
  { id: 'data_upload', label: 'Data Upload', icon: UploadCloud },
  { id: 'users', label: 'Users & Roles', icon: Users },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ activeTab, setActiveTab, onOpenHealthDetails }) {
  return (
    <aside className="w-64 bg-white border-r border-slate-200/90 flex flex-col justify-between shrink-0 select-none shadow-[2px_0_12px_-4px_rgba(0,0,0,0.03)] z-30">
      {/* Top Section: Logo & Nav List */}
      <div className="flex flex-col flex-1 min-h-0 overflow-y-auto">
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-100">
          <div className="h-10 w-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/20">
            <TreePine className="h-6 w-6 stroke-[2.2]" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 leading-tight">
              BioIntel
            </h1>
            <p className="text-[11px] font-medium text-slate-400">
              Biodiversity Intelligence
            </p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[13.5px] font-medium transition-all ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-800 font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`h-[18px] w-[18px] transition-colors ${
                      isActive ? 'text-emerald-600 stroke-[2.2]' : 'text-slate-400 stroke-[1.8]'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Ecosystem Health Card & Forest Backdrop */}
      <div className="p-3 border-t border-slate-100 relative overflow-hidden bg-gradient-to-b from-white to-emerald-50/40">
        <div className="rounded-2xl bg-white border border-slate-200/80 p-4 shadow-sm relative z-10">
          <div className="text-xs font-semibold text-slate-700 mb-2">Ecosystem Health</div>
          
          <div className="flex items-center gap-3 mb-2">
            {/* Circular Gauge */}
            <div className="relative h-14 w-14 flex items-center justify-center shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                {/* Background Ring */}
                <path
                  className="text-slate-100"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                {/* Value Ring */}
                <path
                  className="text-emerald-500 transition-all duration-1000 ease-out"
                  strokeDasharray="78, 100"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-sm font-bold text-slate-900 leading-none">78</span>
                <span className="text-[9px] font-medium text-slate-400">/100</span>
              </div>
            </div>

            <div>
              <div className="text-xs font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md inline-block">
                Good
              </div>
              <div className="text-[11px] font-medium text-emerald-600 flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3" />
                <span>6.4% vs last month</span>
              </div>
            </div>
          </div>

          <button
            onClick={onOpenHealthDetails}
            className="w-full mt-2 py-1.5 px-3 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200/80 transition-colors shadow-2xs"
          >
            View Details
          </button>
        </div>

        {/* Lush Green Pine Forest Vector Base Illustration */}
        <div className="h-14 mt-1 opacity-70 flex items-end justify-center pointer-events-none">
          <svg viewBox="0 0 200 40" className="w-full h-full text-emerald-800/40 fill-current">
            <path d="M0,40 L10,25 L15,30 L25,18 L35,32 L45,15 L55,28 L65,12 L75,26 L85,16 L95,30 L105,10 L115,28 L125,18 L135,32 L145,12 L155,26 L165,14 L175,30 L185,20 L195,28 L200,40 Z" opacity="0.6"/>
            <path d="M0,40 L15,30 L28,15 L40,32 L52,18 L68,30 L80,14 L95,28 L110,8 L125,25 L140,16 L158,32 L172,12 L188,28 L200,40 Z" className="text-emerald-900/60 fill-current"/>
          </svg>
        </div>
      </div>
    </aside>
  );
}
