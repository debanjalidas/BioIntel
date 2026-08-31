import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Layers,
  ListFilter,
  Maximize2,
  Minimize2,
  MoreHorizontal,
  ChevronDown,
  Volume2,
  Dna,
  Camera,
  TreePine,
  ShieldAlert,
  MapPin,
} from 'lucide-react';

// Real forest coordinates: Kaziranga Tiger Reserve & Nilgiri Biosphere Forest
const FOREST_CENTER = [26.585, 93.175];

export default function EcosystemMap({ onSelectSite }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const polygonLayerRef = useRef(null);
  const tileLayerRef = useRef(null);

  const [activeLayer, setActiveLayer] = useState('Satellite Forest');
  const [showLegend, setShowLegend] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedSite, setSelectedSite] = useState(null);

  // Available real forest tile sources
  const tileProviders = {
    'Satellite Forest': 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    'Topographic Forest': 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
    'OpenTopoMap': 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    'CartoDB Voyager': 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
  };

  // Real Monitoring Sites with GPS coordinates
  const sites = [
    {
      id: 1,
      name: 'Western Core Sanctuary (Beta-1)',
      type: 'Bioacoustic PAM & Camera Trap',
      species: 'Asian Elephant, Green Bee-eater',
      status: 'Optimal Health',
      severity: 'optimal',
      lat: 26.592,
      lng: 93.148,
      glyph: '🌿',
      haloColor: 'rgba(16, 185, 129, 0.35)',
      coreColor: '#10b981',
      details: 'Acoustic activity 98% normal. 42 distinct avian species registered in the last 24h.',
    },
    {
      id: 2,
      name: 'South-West Buffer Outpost',
      type: 'Acoustic Activity Grid',
      species: 'Acoustic Frequency Decline',
      status: 'Moderate Threat',
      severity: 'moderate',
      lat: 26.568,
      lng: 93.152,
      glyph: '⚠️',
      haloColor: 'rgba(245, 158, 11, 0.35)',
      coreColor: '#f59e0b',
      details: 'Warning: 22% dip in twilight chorus calling. IoT humidity sensor recalibrated.',
    },
    {
      id: 3,
      name: 'Western Threat Sector (High Risk Perimeter)',
      type: 'Satellite Sentinel-2 & Ground Patrol',
      species: 'Deforestation & Canopy Loss',
      status: 'Critical Alert Zone',
      severity: 'critical',
      lat: 26.582,
      lng: 93.171,
      glyph: '⚠️',
      haloColor: 'rgba(239, 68, 68, 0.45)',
      coreColor: '#ef4444',
      details: 'Critical: Sudden NDVI drop (-14%) detected by Sentinel-2 band 8 analysis. Ranger unit dispatched.',
    },
    {
      id: 4,
      name: 'North River Patrol Station',
      type: 'Camera Trap Array (AI Nightvision)',
      species: 'Bengal Tiger (Panthera tigris)',
      status: 'Moderate Threat',
      severity: 'moderate',
      lat: 26.605,
      lng: 93.185,
      glyph: '📷',
      haloColor: 'rgba(245, 158, 11, 0.35)',
      coreColor: '#f59e0b',
      details: 'Adult female tiger with 2 cubs logged via YOLOv8 inference at 03:14 AM.',
    },
    {
      id: 5,
      name: 'Central Habitat Watchtower',
      type: 'IoT Canopy Micro-Climate Node',
      species: 'Canopy Density 78%',
      status: 'Moderate Threat',
      severity: 'moderate',
      lat: 26.586,
      lng: 93.182,
      glyph: '🌲',
      haloColor: 'rgba(245, 158, 11, 0.35)',
      coreColor: '#f59e0b',
      details: 'Microclimate metrics: Temperature 24.2°C, Humidity 82%, Solar radiation 4.2 kWh/m².',
    },
    {
      id: 6,
      name: 'Core Sanctuary Riverbed Station',
      type: 'Riparian Ecosystem Hydrophone',
      species: 'Smooth-coated Otter, Native Flora',
      status: 'Optimal Health',
      severity: 'optimal',
      lat: 26.574,
      lng: 93.178,
      glyph: '🌿',
      haloColor: 'rgba(16, 185, 129, 0.35)',
      coreColor: '#10b981',
      details: 'River flow velocity optimal. Dissolved oxygen 7.8 mg/L.',
    },
    {
      id: 7,
      name: 'Brahmaputra Basin eDNA Station',
      type: 'Automated Filtration Robot',
      species: 'Golden Mahseer (Tor putitora)',
      status: 'Optimal Health',
      severity: 'optimal',
      lat: 26.602,
      lng: 93.205,
      glyph: '🧬',
      haloColor: 'rgba(16, 185, 129, 0.35)',
      coreColor: '#10b981',
      details: 'Illumina 12S amplicon sequencing verified 99.8% match for endangered Tor putitora.',
    },
    {
      id: 8,
      name: 'Eastern Marshland Laboratory',
      type: 'eDNA Metabarcoding Array',
      species: 'Microbiome & Wetland Census',
      status: 'Moderate Threat',
      severity: 'moderate',
      lat: 26.581,
      lng: 93.198,
      glyph: '🔬',
      haloColor: 'rgba(245, 158, 11, 0.35)',
      coreColor: '#f59e0b',
      details: 'Seasonal algal bloom risk under evaluation. Nitrate levels within safe limits.',
    },
    {
      id: 9,
      name: 'Eastern PAM Bioacoustic Grid',
      type: 'Bioacoustic Directional Array',
      species: 'Great Hornbill, Common Mormon',
      status: 'Optimal Health',
      severity: 'optimal',
      lat: 26.589,
      lng: 93.218,
      glyph: '🎙️',
      haloColor: 'rgba(16, 185, 129, 0.35)',
      coreColor: '#10b981',
      details: 'BirdNET AI recognized 36 distinct vocalization calls in the canopy canopy layer.',
    },
  ];

  // High Risk Zone Polygon Coordinates in the forest
  const highRiskPolygon = [
    [26.589, 93.162],
    [26.593, 93.184],
    [26.584, 93.192],
    [26.576, 93.188],
    [26.572, 93.169],
  ];

  // Initialize and update real Leaflet map instance
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Create Leaflet Map Instance
      const map = L.map(mapContainerRef.current, {
        center: FOREST_CENTER,
        zoom: 13,
        zoomControl: false,
        attributionControl: false,
      });

      // Add Base Tile Layer
      const tileLayer = L.tileLayer(tileProviders[activeLayer], {
        maxZoom: 18,
        subdomains: ['a', 'b', 'c'],
      }).addTo(map);
      tileLayerRef.current = tileLayer;

      // Add High-Risk Perimeter Polygon (Red Dashed + Mint Tint Fill)
      const polygon = L.polygon(highRiskPolygon, {
        color: '#ef4444',
        weight: 2.5,
        dashArray: '6, 6',
        fillColor: '#10b981',
        fillOpacity: 0.25,
      }).addTo(map);
      polygonLayerRef.current = polygon;

      // Add Custom Glowing Halo Markers
      sites.forEach((site) => {
        const customIcon = L.divIcon({
          className: 'custom-forest-marker',
          html: `
            <div style="
              position: relative;
              width: 36px;
              height: 36px;
              display: flex;
              align-items: center;
              justify-content: center;
              cursor: pointer;
            ">
              <!-- Outer Glowing Halo -->
              <div style="
                position: absolute;
                inset: 0;
                border-radius: 9999px;
                background-color: ${site.haloColor};
                box-shadow: 0 0 12px ${site.haloColor};
                animation: ${site.severity === 'critical' ? 'pulse 1.5s infinite' : 'none'};
              "></div>
              <!-- Inner Solid Circle -->
              <div style="
                position: relative;
                width: 24px;
                height: 24px;
                border-radius: 9999px;
                background-color: ${site.coreColor};
                color: #ffffff;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 11px;
                font-weight: bold;
                border: 2px solid #ffffff;
                box-shadow: 0 2px 6px rgba(0,0,0,0.3);
              ">
                ${site.glyph}
              </div>
            </div>
          `,
          iconSize: [36, 36],
          iconAnchor: [18, 18],
        });

        const marker = L.marker([site.lat, site.lng], { icon: customIcon }).addTo(map);

        // Click handler
        marker.on('click', () => {
          setSelectedSite(site);
          if (onSelectSite) onSelectSite(site);
        });

        // Hover tooltip
        marker.bindTooltip(
          `<strong>${site.name}</strong><br/><span style="color:#10b981;font-size:10px">${site.type}</span>`,
          { direction: 'top', offset: [0, -18], opacity: 0.95 }
        );
      });

      mapInstanceRef.current = map;
    } else {
      // Update Tile Layer if changed
      if (tileLayerRef.current) {
        tileLayerRef.current.setUrl(tileProviders[activeLayer]);
      }
    }
  }, [activeLayer]);

  // Handle Zoom In / Out Controls
  const handleZoomIn = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomIn();
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomOut();
  };

  const handleRecenter = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.setView(FOREST_CENTER, 13);
  };

  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden flex flex-col ${
        isFullscreen ? 'fixed inset-4 z-50 shadow-2xl' : 'h-full min-h-[420px]'
      }`}
    >
      {/* Top Map Header Bar */}
      <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between bg-white shrink-0 z-10">
        <div className="flex items-center gap-3">
          {/* Green Title Badge */}
          <div className="bg-[#10b981] text-slate-950 font-black text-sm px-2.5 py-1 rounded-md tracking-tight">
            Ecosystem Map
          </div>

          {/* Layer Selector Dropdown */}
          <div className="relative group">
            <button className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500 text-slate-950 text-xs font-bold transition-all shadow-xs">
              <Layers className="h-3.5 w-3.5" />
              <span>Layers</span>
              <ChevronDown className="h-3 w-3" />
            </button>
            <div className="hidden group-hover:block absolute top-full left-0 mt-1 w-52 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-30 text-xs font-medium">
              {Object.keys(tileProviders).map((layerName) => (
                <button
                  key={layerName}
                  onClick={() => setActiveLayer(layerName)}
                  className={`w-full text-left px-3 py-1.5 transition-colors font-semibold flex items-center justify-between ${
                    activeLayer === layerName
                      ? 'bg-emerald-50 text-emerald-700 font-bold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{layerName}</span>
                  {activeLayer === layerName && <span className="text-[10px] bg-emerald-200/60 px-1.5 py-0.5 rounded">Active</span>}
                </button>
              ))}
            </div>
          </div>

          <span className="text-[11px] font-semibold text-slate-500 hidden sm:inline-block">
            Kaziranga Biosphere Forest • 26.58° N, 93.17° E
          </span>
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

          <button
            onClick={handleRecenter}
            className="p-2 rounded-lg bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 transition-colors shadow-2xs"
            title="Recenter Map"
          >
            <MoreHorizontal className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Real Interactive Leaflet Forest Map Container */}
      <div className="relative flex-1 bg-slate-900 overflow-hidden min-h-[350px]">
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Floating Map Legend Card */}
        {showLegend && (
          <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md rounded-2xl p-4 border border-slate-200/90 shadow-lg text-xs font-medium space-y-2.5 z-10 w-52 animate-in fade-in duration-200">
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

        {/* Selected Sensor Station Drawer Details */}
        {selectedSite && (
          <div className="absolute bottom-4 left-4 z-20 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 shadow-2xl p-4 max-w-sm w-full text-left animate-in slide-in-from-bottom-4 duration-200">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <h4 className="text-xs font-bold text-slate-900 leading-tight">
                  {selectedSite.name}
                </h4>
                <p className="text-[10px] font-semibold text-emerald-600 mt-0.5">
                  {selectedSite.type}
                </p>
              </div>
              <button
                onClick={() => setSelectedSite(null)}
                className="text-slate-400 hover:text-slate-700 text-xs font-bold p-1 rounded-md"
              >
                ✕
              </button>
            </div>

            <p className="text-[11px] text-slate-600 mb-2.5 bg-slate-50 p-2 rounded-lg border border-slate-100">
              {selectedSite.details}
            </p>

            <div className="flex items-center justify-between text-[11px] pt-1">
              <span className="font-bold text-slate-500">Status:</span>
              <span
                className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                  selectedSite.severity === 'critical'
                    ? 'bg-rose-100 text-rose-700'
                    : selectedSite.severity === 'moderate'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                {selectedSite.status}
              </span>
            </div>
          </div>
        )}

        {/* Bottom Left Scale Indicator */}
        <div className="absolute bottom-4 left-4 z-10 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-xl text-[11px] font-mono font-bold text-slate-800 border border-slate-200 shadow-sm flex items-center gap-2.5">
          <span>2 km</span>
          <div className="w-14 h-1.5 bg-slate-900 rounded-xs" />
        </div>

        {/* Bottom Right Zoom & Control Buttons */}
        <div className="absolute bottom-4 right-4 flex flex-col gap-1.5 z-10">
          <button
            onClick={handleZoomIn}
            className="h-8 w-8 rounded-xl bg-white/95 hover:bg-white text-slate-900 font-bold text-base shadow-md border border-slate-200 flex items-center justify-center transition-transform hover:scale-105"
            title="Zoom In"
          >
            +
          </button>
          <button
            onClick={handleZoomOut}
            className="h-8 w-8 rounded-xl bg-white/95 hover:bg-white text-slate-900 font-bold text-base shadow-md border border-slate-200 flex items-center justify-center transition-transform hover:scale-105"
            title="Zoom Out"
          >
            −
          </button>
          <button
            onClick={handleRecenter}
            className="h-8 w-8 rounded-xl bg-white/95 hover:bg-white text-slate-900 shadow-md border border-slate-200 flex items-center justify-center text-xs transition-transform hover:scale-105"
            title="Center Forest Reserve"
          >
            🛡️
          </button>
        </div>
      </div>
    </div>
  );
}
