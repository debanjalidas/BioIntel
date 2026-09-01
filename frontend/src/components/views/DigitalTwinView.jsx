import React, { useState } from 'react';
import { Box, Layers, Radio, Activity, ShieldCheck, Thermometer, Wind, Droplets, Zap } from 'lucide-react';

export default function DigitalTwinView() {
  const [selectedNode, setSelectedNode] = useState(1);
  const [simRunning, setSimRunning] = useState(true);

  const sensorNodes = [
    { id: 1, name: 'Core Canopy Tower Alpha', type: 'PAM + Weather Station', temp: '24.2°C', humidity: '82%', status: 'ONLINE', acoustic_db: '48 dB', health: '99%' },
    { id: 2, name: 'Riparian River Station R-3', type: 'Continuous eDNA Flow Cell', temp: '21.8°C', humidity: '94%', status: 'ONLINE', acoustic_db: '32 dB', health: '97%' },
    { id: 3, name: 'Western Ridge Edge Sensor', type: 'Camera Trap Array', temp: '28.1°C', humidity: '65%', status: 'ONLINE', acoustic_db: '52 dB', health: '94%' },
    { id: 4, name: 'Mangrove Mudflat Node M-08', type: 'Hydrological & Acoustic', temp: '26.9°C', humidity: '89%', status: 'ONLINE', acoustic_db: '41 dB', health: '98%' },
  ];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-100 text-indigo-700">
              <Box className="h-5 w-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-900">Ecosystem Digital Twin & 3D Sensor Mesh</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time multi-layer physical-digital ecosystem synchronization with acoustic mesh nodes & automated telemetry
          </p>
        </div>

        <button
          onClick={() => setSimRunning(!simRunning)}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-colors shadow-xs ${
            simRunning ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-slate-200 text-slate-700'
          }`}
        >
          <Activity className={`h-4 w-4 ${simRunning ? 'animate-pulse' : ''}`} />
          {simRunning ? 'Simulation Engine Active' : 'Simulation Paused'}
        </button>
      </div>

      {/* 3D Topographic Sensor Grid Simulation Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-slate-950 rounded-2xl border border-slate-800 p-6 shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[460px]">
          {/* Background Topo Lines */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#6366f1" strokeWidth="0.5" />
              </pattern>
              <rect width="100%" height="100%" fill="url(#grid)" />
              <circle cx="45%" cy="50%" r="140" fill="none" stroke="#10b981" strokeWidth="1.5" strokeDasharray="6 6" className="animate-spin" style={{ animationDuration: '40s' }} />
              <circle cx="45%" cy="50%" r="220" fill="none" stroke="#06b6d4" strokeWidth="1" strokeDasharray="8 8" />
            </svg>
          </div>

          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-slate-900/80 border border-slate-700 px-3 py-1.5 rounded-lg">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              MESH PROTOCOL: LORA-WAN / SATLINK ACTIVE
            </div>
            <div className="text-xs font-mono text-slate-400">LAT: 10.8524° N • LON: 76.7019° E</div>
          </div>

          {/* Interactive Simulated Node Overlays */}
          <div className="relative z-10 my-auto grid grid-cols-2 md:grid-cols-4 gap-4 py-8">
            {sensorNodes.map((node) => {
              const isSelected = selectedNode === node.id;
              return (
                <div
                  key={node.id}
                  onClick={() => setSelectedNode(node.id)}
                  className={`p-4 rounded-xl cursor-pointer transition-all border ${
                    isSelected
                      ? 'bg-indigo-900/50 border-indigo-400 shadow-lg shadow-indigo-500/20'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-bold text-indigo-400">NODE #{node.id}</span>
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  </div>
                  <div className="text-xs font-bold text-white leading-snug">{node.name}</div>
                  <div className="text-[10px] text-slate-400 mt-1">{node.type}</div>
                  <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono">
                    <span className="text-slate-400">{node.temp}</span>
                    <span className="text-cyan-400">{node.acoustic_db}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="relative z-10 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-3">
            <div>Sensor Node Density: 4 Nodes / 100 sq.km</div>
            <div className="font-mono text-emerald-400">Sync Rate: 1.0 Hz</div>
          </div>
        </div>

        {/* Selected Node Telemetry Box */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div>
            <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">Node Telemetry Panel</span>
            <h3 className="text-base font-bold text-slate-900 mt-0.5">
              {sensorNodes.find((n) => n.id === selectedNode)?.name}
            </h3>
            <p className="text-xs text-slate-500 font-mono">ID: DT-NODE-00{selectedNode} • Hardware: ESP32-S3 + Audio PAM</p>
          </div>

          <div className="space-y-3 pt-2">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Thermometer className="h-5 w-5 text-rose-500" />
                <div>
                  <div className="text-[10px] text-slate-400 font-semibold">Temperature</div>
                  <div className="text-sm font-bold text-slate-900">{sensorNodes.find((n) => n.id === selectedNode)?.temp}</div>
                </div>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">Calibrated</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Droplets className="h-5 w-5 text-cyan-500" />
                <div>
                  <div className="text-[10px] text-slate-400 font-semibold">Relative Humidity</div>
                  <div className="text-sm font-bold text-slate-900">{sensorNodes.find((n) => n.id === selectedNode)?.humidity}</div>
                </div>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">Optimal</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Wind className="h-5 w-5 text-emerald-500" />
                <div>
                  <div className="text-[10px] text-slate-400 font-semibold">Acoustic Sound Floor</div>
                  <div className="text-sm font-bold text-slate-900">{sensorNodes.find((n) => n.id === selectedNode)?.acoustic_db}</div>
                </div>
              </div>
              <span className="text-[10px] text-emerald-600 font-mono font-bold">Quiet Forest</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-indigo-500" />
                <div>
                  <div className="text-[10px] text-slate-400 font-semibold">System Reliability</div>
                  <div className="text-sm font-bold text-slate-900">{sensorNodes.find((n) => n.id === selectedNode)?.health}</div>
                </div>
              </div>
              <span className="text-[10px] text-indigo-600 font-mono font-bold">100% Uptime</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
