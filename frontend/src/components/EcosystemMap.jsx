import React, { useState } from 'react';
import {
  Layers,
  ListFilter,
  Maximize2,
  Minimize2,
  MoreHorizontal,
  ChevronDown,
} from 'lucide-react';

export default function EcosystemMap({ onSelectSite }) {
  const [activeLayer, setActiveLayer] = useState('Topographic');
  const [showLegend, setShowLegend] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedPin, setSelectedPin] = useState(null);

  // Exact pins layout matching the reference screenshot
  const sites = [
    {
      id: 1,
      name: 'Western Core Sanctuary (Beta-1)',
      type: 'Flora & Fauna Census',
      species: 'Optimal Biomass Index',
      status: 'Optimal Health',
      haloColor: 'bg-emerald-500/25 ring-emerald-500/40',
      coreColor: 'bg-emerald-500 text-white',
      top: '36%',
      left: '28%',
      icon: (
        <svg className="w-3.5 h-3.5 fill-current text-white" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12c0 3.31 1.61 6.24 4.09 8.04L12 14l5.91 6.04C20.39 18.24 22 15.31 22 12c0-5.52-4.48-10-10-10zm-1 14.59L7.41 13 6 14.41l5 5 9-9-1.41-1.41L11 16.59z"/>
        </svg>
      ),
      glyph: '🌿',
    },
    {
      id: 2,
      name: 'South-West Buffer Station',
      type: 'Bioacoustic Monitor',
      species: 'Acoustic Decline Warning',
      status: 'Moderate Threat',
      haloColor: 'bg-amber-500/25 ring-amber-500/40',
      coreColor: 'bg-amber-500 text-white',
      top: '51%',
      left: '29%',
      glyph: '⚠️',
    },
    {
      id: 3,
      name: 'Western Threat Sector (High Risk)',
      type: 'Satellite Change Detection',
      species: 'Habitat Degradation Flagged',
      status: 'Critical Alert Zone',
      haloColor: 'bg-rose-500/30 ring-rose-500/50 animate-pulse',
      coreColor: 'bg-rose-500 text-white',
      top: '47%',
      left: '43%',
      glyph: '⚠️',
    },
    {
      id: 4,
      name: 'North River Patrol Outpost',
      type: 'Camera Trap Grid',
      species: 'Panthera tigris Detected',
      status: 'Moderate Threat',
      haloColor: 'bg-amber-500/25 ring-amber-500/40',
      coreColor: 'bg-amber-500 text-white',
      top: '33%',
      left: '53%',
      glyph: '📷',
    },
    {
      id: 5,
      name: 'Central Habitat Watchtower',
      type: 'IoT Canopy Node',
      species: 'Canopy Density 78%',
      status: 'Moderate Threat',
      haloColor: 'bg-amber-500/25 ring-amber-500/40',
      coreColor: 'bg-amber-500 text-white',
      top: '43%',
      left: '52%',
      glyph: '🌲',
    },
    {
      id: 6,
      name: 'Core Sanctuary River Bed',
      type: 'Riparian Ecosystem Station',
      species: 'Native Flora Recovered',
      status: 'Optimal Health',
      haloColor: 'bg-emerald-500/25 ring-emerald-500/40',
      coreColor: 'bg-emerald-500 text-white',
      top: '53%',
      left: '50%',
      glyph: '🌿',
    },
    {
      id: 7,
      name: 'River Basin eDNA Sampler',
      type: 'Automated Filtration Robot',
      species: 'Tor putitora (Golden Mahseer)',
      status: 'Optimal Health',
      haloColor: 'bg-emerald-500/25 ring-emerald-500/40',
      coreColor: 'bg-emerald-500 text-white',
      top: '33%',
      left: '64%',
      glyph: '🧬',
    },
    {
      id: 8,
      name: 'Eastern Marshland Laboratory',
      type: 'Metabarcoding Station',
      species: 'Microbial Diversity High',
      status: 'Moderate Threat',
      haloColor: 'bg-amber-500/25 ring-amber-500/40',
      coreColor: 'bg-amber-500 text-white',
      top: '46%',
      left: '61%',
      glyph: '🔬',
    },
    {
      id: 9,
      name: 'Eastern PAM Acoustic Array',
      type: 'Directional Hydrophone/Mic',
      species: 'Bioacoustic Species Verified',
      status: 'Optimal Health',
      haloColor: 'bg-emerald-500/25 ring-emerald-500/40',
      coreColor: 'bg-emerald-500 text-white',
      top: '42%',
      left: '71%',
      glyph: '🎙️',
    },
  ];

  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden flex flex-col ${
        isFullscreen ? 'fixed inset-4 z-50 shadow-2xl' : 'h-full min-h-[420px]'
      }`}
    >
      {/* Top Map Action Bar */}
      <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
        <div className="flex items-center gap-3">
          {/* Green Title Badge matching reference */}
          <div className="bg-[#10b981] text-slate-950 font-black text-sm px-2.5 py-1 rounded-md tracking-tight">
            Ecosystem Map
          </div>

          {/* Layer Selector */}
          <div className="relative group">
            <button className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500 text-slate-950 text-xs font-bold transition-all shadow-xs">
              <Layers className="h-3.5 w-3.5" />
              <span>Layers</span>
              <ChevronDown className="h-3 w-3" />
            </button>
            <div className="hidden group-hover:block absolute top-full left-0 mt-1 w-44 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-30 text-xs font-medium">
              {['Topographic / Biomes', 'Satellite Sentinel-2', 'Risk Polygons (PostGIS)', 'Acoustic Heatmap'].map((l, i) => (
                <button
                  key={i}
                  onClick={() => setActiveLayer(l)}
                  className="w-full text-left px-3 py-1.5 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 font-semibold transition-colors"
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowLegend(!showLegend)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
              showLegend
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <ListFilter className="h-3.5 w-3.5" />
            <span>Legend</span>
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-lg bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 transition-colors shadow-2xs"
            title="Toggle fullscreen"
          >
            {isFullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
          </button>

          <button className="p-2 rounded-lg bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 transition-colors shadow-2xs">
            <MoreHorizontal className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Map Graphic Canvas */}
      <div className="relative flex-1 bg-[#dbeee0] overflow-hidden min-h-[340px] select-none">
        {/* Soft Organic Biome Blobs, Elevation Curves, and Snaking River */}
        <div className="absolute inset-0 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 1000 580" preserveAspectRatio="none">
            {/* Base Terrain Shading Layer 1 */}
            <path d="M0,0 C300,100 600,0 1000,80 L1000,580 L0,580 Z" fill="#d2e8d7" opacity="0.6"/>
            <path d="M0,280 C250,220 700,340 1000,240 L1000,580 L0,580 Z" fill="#c7e2cd" opacity="0.5"/>

            {/* Circular Biome Patches matching screenshot */}
            {/* Top-Left Biome */}
            <ellipse cx="340" cy="220" rx="160" ry="120" fill="#bcdbbd" opacity="0.5" />
            {/* Bottom-Left Biome */}
            <circle cx="270" cy="460" r="90" fill="#bcdbbd" opacity="0.5" />
            {/* Top-Right Biome */}
            <ellipse cx="680" cy="240" rx="140" ry="100" fill="#bcdbbd" opacity="0.5" />

            {/* Topographic Contour Dashed Lines */}
            <path d="M120,80 C320,240 600,150 900,240" stroke="#a2c8a2" strokeWidth="1.2" fill="none" strokeDasharray="3 3"/>
            <path d="M50,420 C360,290 680,480 1000,380" stroke="#a2c8a2" strokeWidth="1.2" fill="none" strokeDasharray="4 3"/>

            {/* Realistic Snaking River Tributary */}
            <path
              d="M520,0 C500,130 470,220 500,270 C530,320 620,380 640,460 C660,510 700,580 700,580"
              stroke="#9ec4db"
              strokeWidth="15"
              fill="none"
              strokeLinecap="round"
            />
            {/* River highlight line */}
            <path
              d="M520,0 C500,130 470,220 500,270 C530,320 620,380 640,460 C660,510 700,580 700,580"
              stroke="#b5d6ec"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              opacity="0.8"
            />
          </svg>
        </div>

        {/* High Risk Perimeter Polygon (Red Dashed + Soft Mint Green Fill) */}
        <div className="absolute inset-0 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 1000 580" preserveAspectRatio="none">
            <polygon
              points="388,272 505,225 530,285 522,312 426,350 388,272"
              fill="rgba(167, 243, 208, 0.55)"
              stroke="#ef4444"
              strokeWidth="2.5"
              strokeDasharray="6 3"
              className="transition-all"
            />
          </svg>
        </div>

        {/* Interactive Double-Ringed Site Pins matching reference */}
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
            {/* Outer Soft Glow Halo Ring */}
            <div className={`h-9 w-9 rounded-full ${site.haloColor} ring-4 flex items-center justify-center transition-transform group-hover:scale-125`}>
              {/* Inner Solid Circle */}
              <div className={`h-6 w-6 rounded-full ${site.coreColor} shadow-md flex items-center justify-center text-[11px] font-bold`}>
                <span>{site.glyph}</span>
              </div>
            </div>

            {/* Quick Hover Name Badge */}
            <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-slate-900 text-white text-[11px] font-semibold py-1 px-2.5 rounded-lg whitespace-nowrap shadow-xl z-30 pointer-events-none">
              {site.name}
              <div className="text-[9px] text-emerald-400 font-medium">{site.type}</div>
            </div>
          </div>
        ))}

        {/* Pin Details Drawer Popup Bubble */}
        {selectedPin && (
          <div
            style={{ top: selectedPin.top, left: selectedPin.left }}
            className="absolute -translate-x-1/2 translate-y-6 z-40 bg-white rounded-2xl border border-slate-200 shadow-2xl p-4 w-72 text-left animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <h4 className="text-xs font-bold text-slate-900 leading-tight">
                  {selectedPin.name}
                </h4>
                <p className="text-[10px] font-medium text-slate-500 mt-0.5">
                  {selectedPin.type}
                </p>
              </div>
              <button
                onClick={() => setSelectedPin(null)}
                className="text-slate-400 hover:text-slate-700 text-xs font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-1.5 text-[11px] bg-slate-50 p-2.5 rounded-xl border border-slate-100 mb-2.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Status:</span>
                <span className="font-semibold text-slate-800">{selectedPin.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Telemetry:</span>
                <span className="font-semibold text-emerald-700 truncate max-w-[140px]">{selectedPin.species}</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedPin(null)}
              className="w-full py-1.5 text-center text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-xs"
            >
              Inspect Sensor Stream
            </button>
          </div>
        )}

        {/* Map Legend Floating Card matching screenshot */}
        {showLegend && (
          <div className="absolute top-4 left-4 bg-white rounded-2xl p-4 border border-slate-200/90 shadow-md text-xs font-medium space-y-2.5 z-20 w-48 animate-in fade-in duration-200">
            <div className="font-extrabold text-slate-900 text-[11px] uppercase tracking-wider">
              MAP LEGEND
            </div>

            {/* Optimal Health */}
            <div className="flex items-center gap-2.5 text-slate-800">
              <span className="h-3.5 w-3.5 rounded-full bg-emerald-500 ring-4 ring-emerald-500/25 shrink-0" />
              <span className="font-semibold text-[11.5px]">Optimal Health</span>
            </div>

            {/* Moderate Threat */}
            <div className="flex items-center gap-2.5 text-slate-800">
              <span className="h-3.5 w-3.5 rounded-full bg-amber-500 ring-4 ring-amber-500/25 shrink-0" />
              <span className="font-semibold text-[11.5px]">Moderate Threat</span>
            </div>

            {/* Critical Alert Zone */}
            <div className="flex items-center gap-2.5 text-slate-800">
              <span className="h-3.5 w-3.5 rounded-full bg-rose-500 ring-4 ring-rose-500/30 shrink-0" />
              <span className="font-semibold text-[11.5px]">Critical Alert Zone</span>
            </div>

            {/* High Risk Perimeter */}
            <div className="flex items-center gap-2.5 text-slate-800 pt-1.5 border-t border-slate-100">
              <span className="h-3 w-4 border-2 border-dashed border-rose-500 bg-emerald-300/40 rounded-xs shrink-0" />
              <span className="font-semibold text-[11px] text-slate-700">High Risk Perimeter</span>
            </div>
          </div>
        )}

        {/* Bottom Left Scale Indicator */}
        <div className="absolute bottom-4 left-4 bg-white px-3 py-1.5 rounded-xl text-[11px] font-mono font-bold text-slate-800 border border-slate-200 shadow-sm flex items-center gap-2.5">
          <span>2 km</span>
          <div className="w-14 h-1.5 bg-slate-900 rounded-xs" />
        </div>

        {/* Bottom Right Floating Map Zoom & Layer Controls */}
        <div className="absolute bottom-4 right-4 flex flex-col gap-1.5 z-20">
          <button className="h-8 w-8 rounded-xl bg-white hover:bg-slate-50 text-slate-900 font-bold text-base shadow-md border border-slate-200 flex items-center justify-center transition-transform hover:scale-105">
            +
          </button>
          <button className="h-8 w-8 rounded-xl bg-white hover:bg-slate-50 text-slate-900 font-bold text-base shadow-md border border-slate-200 flex items-center justify-center transition-transform hover:scale-105">
            −
          </button>
          <button className="h-8 w-8 rounded-xl bg-white hover:bg-slate-50 text-slate-900 shadow-md border border-slate-200 flex items-center justify-center text-xs transition-transform hover:scale-105" title="Layer protection status">
            🛡️
          </button>
        </div>
      </div>
    </div>
  );
}
