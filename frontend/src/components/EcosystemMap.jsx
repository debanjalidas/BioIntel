import React, { useState } from 'react';
import {
  Layers,
  ListFilter,
  Maximize2,
  Minimize2,
  MoreHorizontal,
  MapPin,
  ShieldAlert,
  TreePine,
  Volume2,
  Dna,
  Camera,
  ChevronDown,
  Info,
} from 'lucide-react';

export default function EcosystemMap({ onSelectSite }) {
  const [activeLayer, setActiveLayer] = useState('Topographic');
  const [showLegend, setShowLegend] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedPin, setSelectedPin] = useState(null);

  // Monitored sites corresponding to the design
  const sites = [
    {
      id: 1,
      name: 'Site Alpha-1 (Core Sanctuary)',
      type: 'Bioacoustic PAM',
      species: 'Green Bee-eater, Asian Elephant',
      status: 'Normal / Good',
      color: 'bg-emerald-500 ring-emerald-200 text-white',
      top: '32%',
      left: '28%',
      icon: '🌿',
    },
    {
      id: 2,
      name: 'Western Zone (Deforestation Alert)',
      type: 'Satellite & Ground Patrol',
      species: 'Habitat Degradation Detected',
      status: 'Critical Alert',
      color: 'bg-rose-500 ring-rose-200 text-white animate-pulse',
      top: '44%',
      left: '43%',
      icon: '⚠️',
    },
    {
      id: 3,
      name: 'Site Gamma-4 (River Basin)',
      type: 'eDNA Water Sampler',
      species: 'Golden Mahseer (Tor putitora)',
      status: 'Normal / High Biomass',
      color: 'bg-emerald-500 ring-emerald-200 text-white',
      top: '28%',
      left: '64%',
      icon: '🧬',
    },
    {
      id: 4,
      name: 'Northern Ridge Sector',
      type: 'Camera Trap Array',
      species: 'Bengal Tiger (Panthera tigris)',
      status: 'Active Monitoring',
      color: 'bg-amber-500 ring-amber-200 text-white',
      top: '28%',
      left: '53%',
      icon: '📷',
    },
    {
      id: 5,
      name: 'Eastern Wetland Marsh',
      type: 'Acoustic Grid',
      species: 'Indian Tree Frog',
      status: 'Normal',
      color: 'bg-emerald-500 ring-emerald-200 text-white',
      top: '39%',
      left: '71%',
      icon: '🎙️',
    },
    {
      id: 6,
      name: 'Central Buffer Station',
      type: 'Bioacoustic Sensor',
      species: 'Acoustic Decline Detected',
      status: 'Moderate Risk',
      color: 'bg-amber-500 ring-amber-200 text-white',
      top: '49%',
      left: '29%',
      icon: '⚠️',
    },
    {
      id: 7,
      name: 'Southern Eco-Corridor',
      type: 'Field Patrol & Camera',
      species: 'Chital Deer Herd (34)',
      status: 'Normal',
      color: 'bg-emerald-500 ring-emerald-200 text-white',
      top: '52%',
      left: '50%',
      icon: '🌿',
    },
    {
      id: 8,
      name: 'Canopy Tower Delta',
      type: 'Multi-Sensor IoT',
      species: 'Great Hornbill Nesting',
      status: 'Active',
      color: 'bg-amber-500 ring-amber-200 text-white',
      top: '41%',
      left: '52%',
      icon: '🌲',
    },
    {
      id: 9,
      name: 'South-East Outpost',
      type: 'eDNA Station',
      species: 'Microbiome Monitoring',
      status: 'Moderate',
      color: 'bg-amber-500 ring-amber-200 text-white',
      top: '44%',
      left: '61%',
      icon: '🔬',
    },
  ];

  return (
    <div className={`bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col ${isFullscreen ? 'fixed inset-4 z-50 shadow-2xl' : 'h-full min-h-[380px]'}`}>
      {/* Map Card Header */}
      <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
        <div className="flex items-center gap-3">
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            Ecosystem Map
          </h2>
          
          {/* Layer Selector Dropdown */}
          <div className="relative group">
            <button className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 border border-slate-200 transition-colors">
              <Layers className="h-3.5 w-3.5 text-slate-500" />
              <span>Layers</span>
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </button>
            <div className="hidden group-hover:block absolute top-full left-0 mt-1 w-40 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-30 text-xs font-medium">
              {['Topographic / Terrain', 'Satellite Imagery', 'Protected Zones (Polygons)', 'Acoustic Density Heatmap'].map((layer, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveLayer(layer)}
                  className="w-full text-left px-3 py-1.5 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 transition-colors"
                >
                  {layer}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Map Control Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowLegend(!showLegend)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors ${
              showLegend ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <ListFilter className="h-3.5 w-3.5" />
            <span>Legend</span>
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 transition-colors"
            title="Toggle fullscreen"
          >
            {isFullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
          </button>

          <button className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 transition-colors">
            <MoreHorizontal className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Map Visual Stage Area */}
      <div className="relative flex-1 bg-[#e8f2e6] overflow-hidden min-h-[300px] select-none">
        {/* Topographic Waterways & Terrain Vector Simulation Pattern */}
        <div className="absolute inset-0 opacity-80 mix-blend-multiply pointer-events-none">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" viewBox="0 0 1000 600">
            {/* Contours & Elevation Lines */}
            <path d="M0,150 Q250,50 500,180 T1000,120 L1000,0 L0,0 Z" fill="#d9e9d6" opacity="0.6"/>
            <path d="M0,320 Q200,240 450,380 T1000,290 L1000,600 L0,600 Z" fill="#d0e5cd" opacity="0.5"/>
            <path d="M120,0 Q300,220 520,140 T900,220" stroke="#b9d6b5" strokeWidth="1.5" fill="none" strokeDasharray="3 3"/>
            <path d="M50,450 Q380,300 700,520 T1000,420" stroke="#b9d6b5" strokeWidth="1.5" fill="none" strokeDasharray="4 2"/>
            {/* River Tributary */}
            <path d="M520,0 C510,120 480,180 510,250 C540,320 620,380 640,480 C650,530 680,600 700,600" stroke="#90bde6" strokeWidth="9" fill="none" opacity="0.85" strokeLinecap="round"/>
            <path d="M510,250 C460,280 410,320 380,390" stroke="#a3c8ed" strokeWidth="4" fill="none" opacity="0.7"/>
            {/* Soft Green Protected Forest Patches */}
            <circle cx="340" cy="180" r="140" fill="#c3dec0" opacity="0.6"/>
            <circle cx="680" cy="220" r="110" fill="#c3dec0" opacity="0.6"/>
            <circle cx="220" cy="460" r="130" fill="#c3dec0" opacity="0.5"/>
          </svg>
        </div>

        {/* High Risk Monitored Zone Polygon (Red Boundary + Soft Green Fill) */}
        <div className="absolute inset-0 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 1000 600" preserveAspectRatio="none">
            <polygon
              points="385,275 510,215 530,270 515,310 425,355 385,275"
              fill="rgba(134, 239, 172, 0.45)"
              stroke="#ef4444"
              strokeWidth="2.5"
              strokeDasharray="6 3"
              className="animate-pulse-subtle"
            />
          </svg>
        </div>

        {/* Interactive Site Pins */}
        {sites.map((site) => (
          <div
            key={site.id}
            style={{ top: site.top, left: site.left }}
            className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 group"
            onClick={() => {
              setSelectedPin(site);
              onSelectSite && onSelectSite(site);
            }}
          >
            <div
              className={`h-7 w-7 rounded-full ${site.color} ring-4 shadow-md flex items-center justify-center text-xs font-bold transition-all transform group-hover:scale-125 group-hover:z-20`}
            >
              {site.icon}
            </div>

            {/* Quick Hover Tooltip */}
            <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-slate-900 text-white text-[11px] font-semibold py-1 px-2.5 rounded-lg whitespace-nowrap shadow-xl z-30 pointer-events-none">
              {site.name}
              <div className="text-[9px] text-slate-400 font-normal">{site.type}</div>
            </div>
          </div>
        ))}

        {/* Clicked Pin Details Popup Bubble */}
        {selectedPin && (
          <div
            style={{ top: selectedPin.top, left: selectedPin.left }}
            className="absolute -translate-x-1/2 translate-y-4 z-40 bg-white rounded-2xl border border-slate-200 shadow-2xl p-4 w-72 text-left animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <h4 className="text-xs font-bold text-slate-900 leading-tight">
                  {selectedPin.name}
                </h4>
                <p className="text-[10px] font-medium text-slate-500 mt-0.5">
                  Modality: {selectedPin.type}
                </p>
              </div>
              <button
                onClick={() => setSelectedPin(null)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold px-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-1.5 text-[11px] bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <div className="flex justify-between">
                <span className="text-slate-500">Status:</span>
                <span className="font-semibold text-slate-800">{selectedPin.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Key Detections:</span>
                <span className="font-semibold text-emerald-700 truncate max-w-[130px]">{selectedPin.species}</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedPin(null)}
              className="w-full mt-2.5 py-1.5 text-center text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-xs"
            >
              Open Site Telemetry
            </button>
          </div>
        )}

        {/* Map Legend Overlay (Toggleable) */}
        {showLegend && (
          <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md rounded-xl p-3 border border-slate-200/90 shadow-md text-xs font-medium space-y-2 z-20 max-w-[170px]">
            <div className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">
              Map Legend
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-200" />
              <span>Optimal Health</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500 ring-2 ring-amber-200" />
              <span>Moderate Threat</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-rose-200 animate-ping" />
              <span>Critical Alert Zone</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700 pt-1 border-t border-slate-100">
              <span className="h-2 w-4 border-2 border-dashed border-rose-500 bg-emerald-300/40 rounded-xs" />
              <span className="text-[10px]">High Risk Perimeter</span>
            </div>
          </div>
        )}

        {/* Bottom Left Scale Indicator */}
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-md text-[10px] font-mono font-bold text-slate-700 border border-slate-200/80 shadow-xs flex items-center gap-2">
          <span>2 km</span>
          <div className="w-12 h-1 bg-slate-800 border-l-2 border-r-2 border-slate-900" />
        </div>

        {/* Bottom Right Map Navigation Controls */}
        <div className="absolute bottom-3 right-3 flex flex-col gap-1.5 z-20">
          <button className="h-7 w-7 rounded-lg bg-white/95 hover:bg-white text-slate-800 font-bold text-sm shadow-md border border-slate-200 flex items-center justify-center">
            +
          </button>
          <button className="h-7 w-7 rounded-lg bg-white/95 hover:bg-white text-slate-800 font-bold text-sm shadow-md border border-slate-200 flex items-center justify-center">
            −
          </button>
          <button className="h-7 w-7 rounded-lg bg-white/95 hover:bg-white text-slate-800 shadow-md border border-slate-200 flex items-center justify-center text-xs">
            🛡️
          </button>
        </div>
      </div>
    </div>
  );
}
