import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Activity, 
  MapPin, 
  Layers, 
  Mic, 
  Dna, 
  TreePine, 
  AlertTriangle, 
  CheckCircle2, 
  Compass, 
  RefreshCw,
  Search,
  Bell,
  Cpu,
  BarChart3
} from 'lucide-react';

export default function App() {
  const [backendHealth, setBackendHealth] = useState({ status: 'checking', message: 'Connecting to API...' });
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetch('/health')
      .then(res => res.json())
      .then(data => {
        setBackendHealth({ status: 'online', message: 'FastAPI Backend Online' });
      })
      .catch(err => {
        // Direct port 8000 fallback test
        fetch('http://127.0.0.1:8000/health')
          .then(res => res.json())
          .then(() => setBackendHealth({ status: 'online', message: 'FastAPI (127.0.0.1:8000) Online' }))
          .catch(() => setBackendHealth({ status: 'offline', message: 'Backend Offline (Run uvicorn main:app)' }));
      });
  }, []);

  const stats = [
    { label: 'Active Zones', value: '14', change: '+2 new', icon: Layers, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Monitoring Sites', value: '48', change: '100% active', icon: MapPin, color: 'text-sky-400', bg: 'bg-sky-500/10' },
    { label: 'Bioacoustic Detections', value: '1,280', change: '+18% this wk', icon: Mic, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { label: 'eDNA Samples', value: '312', change: '99.4% identity', icon: Dna, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  ];

  const alerts = [
    { id: 1, title: 'Unusual Chainsaw Frequency Detected', site: 'Site Alpha-7 (Zone C)', time: '12m ago', severity: 'CRITICAL', type: 'ACOUSTIC' },
    { id: 2, title: 'Invasive Fish eDNA Spike', site: 'River Basin North', time: '1h ago', severity: 'HIGH', type: 'eDNA' },
    { id: 3, title: 'Canopy Density Drop (-14%)', site: 'Buffer Sector 3', time: '3h ago', severity: 'MEDIUM', type: 'SATELLITE' },
  ];

  const observations = [
    { species: 'Panthera tigris', common: 'Bengal Tiger', type: 'Camera Trap', confidence: 0.98, status: 'VERIFIED_EXPERT', location: 'Site Alpha-2', time: '22m ago' },
    { species: 'Buceros bicornis', common: 'Great Hornbill', type: 'Bioacoustic AI', confidence: 0.94, status: 'VERIFIED_AI', location: 'Canopy Station 4', time: '45m ago' },
    { species: 'Tor putitora', common: 'Golden Mahseer', type: 'eDNA Metabarcoding', confidence: 0.99, status: 'VERIFIED_AI', location: 'River Basin South', time: '2h ago' },
    { species: 'Elephas maximus', common: 'Asian Elephant', type: 'Field Manual', confidence: 1.0, status: 'VERIFIED_EXPERT', location: 'Salt Lick Corridor', time: '3h ago' },
  ];

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800/80 bg-slate-900/60 backdrop-blur-xl flex flex-col justify-between p-4">
        <div>
          <div className="flex items-center gap-3 px-2 py-3 mb-6">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-bio-600 to-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <TreePine className="h-6 w-6 text-slate-950 font-bold" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                BioIntel
                <span className="text-[10px] font-semibold uppercase tracking-wider bg-bio-500/20 text-bio-400 px-1.5 py-0.5 rounded">v0.1</span>
              </h1>
              <p className="text-xs text-slate-400">Biodiversity & Early Warning</p>
            </div>
          </div>

          <nav className="space-y-1">
            {[
              { id: 'overview', label: 'Command Center', icon: Activity },
              { id: 'spatial', label: 'Spatial & GIS Map', icon: Compass },
              { id: 'acoustic', label: 'Bioacoustic PAM', icon: Mic },
              { id: 'edna', label: 'eDNA Metabarcode', icon: Dna },
              { id: 'alerts', label: 'Threat Alerts', icon: AlertTriangle, badge: '3' },
              { id: 'analytics', label: 'Ecological Health', icon: BarChart3 },
            ].map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive 
                      ? 'bg-bio-500 text-slate-950 font-semibold shadow-md shadow-bio-500/25' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full ${isActive ? 'bg-slate-950 text-white' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Backend Connectivity Status Widget */}
        <div className="rounded-xl p-3 border border-slate-800 bg-slate-950/60">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Cpu className="h-3.5 w-3.5" /> API Service
            </span>
            <span className={`h-2 w-2 rounded-full ${backendHealth.status === 'online' ? 'bg-bio-400 shadow-[0_0_8px_#4ade80]' : 'bg-amber-400 animate-pulse'}`} />
          </div>
          <p className="text-xs font-mono font-medium text-slate-300 truncate">{backendHealth.message}</p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        {/* Top Header */}
        <header className="h-16 border-b border-slate-800/80 px-6 flex items-center justify-between bg-slate-900/30 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-semibold text-slate-100">Live Ecological Intelligence Monitor</h2>
            <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">WGS84 EPSG:4326</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search species, sites, tags..."
                className="bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-bio-500 w-64"
              />
            </div>
            <button className="relative p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500" />
            </button>
          </div>
        </header>

        {/* Dashboard Body */}
        <div className="p-6 space-y-6 max-w-7xl w-full mx-auto">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80 hover:border-slate-700 transition-all shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium text-slate-400">{stat.label}</span>
                    <div className={`p-2 rounded-lg ${stat.bg} ${stat.color}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-bold text-slate-100 tracking-tight">{stat.value}</span>
                    <span className="text-xs text-bio-400 font-medium">{stat.change}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Center Split: Spatial Map Preview & Early Warning Alerts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Live Spatial Overview */}
            <div className="lg:col-span-2 rounded-xl bg-slate-900/50 border border-slate-800/80 p-5 flex flex-col justify-between min-h-[380px]">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                    <Compass className="h-4 w-4 text-bio-400" />
                    Spatial PostGIS Telemetry & Sensor Density
                  </h3>
                  <p className="text-xs text-slate-400">PostgreSQL PostGIS layers: Zones (Polygon), Sites (Point), PAM Hydrophones</p>
                </div>
                <span className="text-xs font-mono text-bio-400 bg-bio-500/10 border border-bio-500/20 px-2 py-1 rounded">
                  Live Sync
                </span>
              </div>

              {/* Map Canvas Placeholder Card */}
              <div className="flex-1 bg-slate-950/80 rounded-lg border border-slate-800 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden group">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#22c55e_1px,transparent_1px)] [background-size:16px_16px]" />
                <div className="relative z-10 space-y-3">
                  <div className="h-12 w-12 rounded-full bg-bio-500/10 border border-bio-500/30 flex items-center justify-center mx-auto text-bio-400">
                    <MapPin className="h-6 w-6 animate-bounce" />
                  </div>
                  <p className="text-sm font-semibold text-slate-200">Interactive Leaflet GIS Map Layer Ready</p>
                  <p className="text-xs text-slate-400 max-w-sm">
                    Connecting to PostgreSQL PostGIS endpoints: <code className="text-bio-400">/api/v1/spatial/sites</code> and <code className="text-bio-400">/api/v1/spatial/zones</code>.
                  </p>
                </div>
              </div>
            </div>

            {/* Critical Early Warning Alerts */}
            <div className="rounded-xl bg-slate-900/50 border border-slate-800/80 p-5 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 text-rose-400" />
                  Active Threat Alerts
                </h3>
                <span className="text-[11px] font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-full">
                  3 Critical
                </span>
              </div>

              <div className="space-y-3 flex-1 overflow-y-auto">
                {alerts.map(alert => (
                  <div key={alert.id} className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-colors">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded ${
                        alert.severity === 'CRITICAL' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                        alert.severity === 'HIGH' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                        'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                      }`}>
                        {alert.severity}
                      </span>
                      <span className="text-[11px] text-slate-500 font-mono">{alert.time}</span>
                    </div>
                    <h4 className="text-xs font-semibold text-slate-200">{alert.title}</h4>
                    <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {alert.site}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Multi-modal Observations Table */}
          <div className="rounded-xl bg-slate-900/50 border border-slate-800/80 p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                  <Activity className="h-4 w-4 text-emerald-400" />
                  Recent Multi-Modal Species Observations
                </h3>
                <p className="text-xs text-slate-400">Aggregated from Camera Traps, PAM Acoustic Models, and eDNA Sequencers</p>
              </div>
              <button className="text-xs text-bio-400 hover:text-bio-300 flex items-center gap-1">
                <RefreshCw className="h-3.5 w-3.5" /> Refresh Live Feed
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="pb-3 font-medium">Species</th>
                    <th className="pb-3 font-medium">Modality / Source</th>
                    <th className="pb-3 font-medium">Location</th>
                    <th className="pb-3 font-medium">AI Confidence</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium text-right">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {observations.map((obs, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3">
                        <div className="font-semibold text-slate-200">{obs.common}</div>
                        <div className="text-[11px] text-slate-500 italic font-mono">{obs.species}</div>
                      </td>
                      <td className="py-3 text-slate-300">{obs.type}</td>
                      <td className="py-3 text-slate-400">{obs.location}</td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-emerald-500 to-bio-400 rounded-full" 
                              style={{ width: `${obs.confidence * 100}%` }}
                            />
                          </div>
                          <span className="font-mono text-slate-300">{(obs.confidence * 100).toFixed(0)}%</span>
                        </div>
                      </td>
                      <td className="py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium ${
                          obs.status === 'VERIFIED_EXPERT' 
                            ? 'bg-bio-500/10 text-bio-400 border border-bio-500/20' 
                            : 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                        }`}>
                          <CheckCircle2 className="h-3 w-3" />
                          {obs.status === 'VERIFIED_EXPERT' ? 'Expert Verified' : 'AI Verified'}
                        </span>
                      </td>
                      <td className="py-3 text-right text-slate-400 font-mono">{obs.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
