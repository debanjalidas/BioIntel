import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Layers,
  Maximize2,
  Minimize2,
  TreePine,
  Shield,
  Lock,
  Unlock,
  Eye,
  Filter,
  RefreshCw,
  MapPin,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { bioApi } from '../services/api';

// Campus Center coordinates
const CAMPUS_CENTER = [28.5460, 77.1930];

// Category color mappings
const CATEGORY_COLORS = {
  birds: { bg: '#0284c7', border: '#38bdf8', glyph: '🦅', name: 'Birds' },
  butterflies: { bg: '#d97706', border: '#fcd34d', glyph: '🦋', name: 'Butterflies' },
  plants: { bg: '#15803d', border: '#86efac', glyph: '🌿', name: 'Plants' },
  insects: { bg: '#7c3aed', border: '#c4b5fd', glyph: '🐝', name: 'Insects' },
  reptiles: { bg: '#c2410c', border: '#fdba74', glyph: '🦎', name: 'Reptiles' },
  mammals: { bg: '#475569', border: '#cbd5e1', glyph: '🐾', name: 'Mammals' },
  other: { bg: '#10b981', border: '#6ee7b7', glyph: '🌱', name: 'Other' },
};

export default function EcosystemMap({ onSelectSite }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersGroupRef = useRef(null);
  const zonesGroupRef = useRef(null);
  const tileLayerRef = useRef(null);

  const [activeLayer, setActiveLayer] = useState('Satellite');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [selectedZone, setSelectedZone] = useState(null);
  const [pointsData, setPointsData] = useState([]);
  const [zonesData, setZonesData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const tileProviders = {
    Satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    Topographic: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
    Streets: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
  };

  useEffect(() => {
    fetchMapData();
  }, [isAuthorized, selectedCategory]);

  const fetchMapData = async () => {
    setIsLoading(true);
    try {
      const res = await bioApi.getMapObservations({
        is_authorized: isAuthorized,
        category: selectedCategory === 'all' ? undefined : selectedCategory,
      });
      setPointsData(res?.points || []);
      setZonesData(res?.campus_zones || []);
    } catch (err) {
      console.warn('Failed to fetch map points:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize Map Instance once
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: CAMPUS_CENTER,
        zoom: 16,
        zoomControl: true,
        attributionControl: false,
      });

      tileLayerRef.current = L.tileLayer(tileProviders[activeLayer], {
        maxZoom: 19,
        subdomains: ['a', 'b', 'c'],
      }).addTo(map);

      zonesGroupRef.current = L.featureGroup().addTo(map);
      markersGroupRef.current = L.featureGroup().addTo(map);
      mapInstanceRef.current = map;
    }

    return () => {
      // Keep map alive
    };
  }, []);

  // Update Base Tile Layer when activeLayer changes
  useEffect(() => {
    if (mapInstanceRef.current && tileLayerRef.current) {
      mapInstanceRef.current.removeLayer(tileLayerRef.current);
      tileLayerRef.current = L.tileLayer(tileProviders[activeLayer], {
        maxZoom: 19,
        subdomains: ['a', 'b', 'c'],
      }).addTo(mapInstanceRef.current);
    }
  }, [activeLayer]);

  // Render Campus Zones and Observation Markers
  useEffect(() => {
    if (!mapInstanceRef.current || !zonesGroupRef.current || !markersGroupRef.current) return;

    // Clear old layers
    zonesGroupRef.current.clearLayers();
    markersGroupRef.current.clearLayers();

    // 1. Draw Campus Zones (semi-transparent circles with dashed rings)
    zonesData.forEach((zone) => {
      if (!zone.center) return;
      const [lat, lng] = zone.center;
      const zoneRadius = (zone.area_hectares || 2.5) * 45; // scale for visualization

      const circle = L.circle([lat, lng], {
        radius: zoneRadius,
        color: zone.health_score > 80 ? '#10b981' : '#f59e0b',
        weight: 2,
        dashArray: '5, 5',
        fillColor: zone.health_score > 80 ? '#10b981' : '#f59e0b',
        fillOpacity: 0.18,
      });

      circle.on('click', () => {
        setSelectedZone(zone);
        setSelectedPoint(null);
        if (onSelectSite) onSelectSite(zone);
      });

      // Add text label marker for zone
      const labelIcon = L.divIcon({
        className: 'zone-label-icon',
        html: `
          <div style="
            background: rgba(15, 23, 42, 0.85);
            color: #ffffff;
            font-size: 10px;
            font-weight: 700;
            padding: 3px 8px;
            border-radius: 9999px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            white-space: nowrap;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            text-align: center;
          ">
            ${zone.name} • ${Math.round(zone.health_score)}/100
          </div>
        `,
        iconAnchor: [60, 10],
      });

      L.marker([lat, lng], { icon: labelIcon }).addTo(zonesGroupRef.current);
      circle.addTo(zonesGroupRef.current);
    });

    // 2. Draw Observation Point Markers
    pointsData.forEach((pt) => {
      const catInfo = CATEGORY_COLORS[pt.category?.toLowerCase()] || CATEGORY_COLORS.other;
      const isFuzzed = pt.is_location_obfuscated;

      const markerHtml = `
        <div style="
          position: relative;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        ">
          <!-- Outer Aura -->
          <div style="
            position: absolute;
            inset: 0;
            border-radius: 9999px;
            background-color: ${catInfo.bg}33;
            border: 2px solid ${isFuzzed ? '#e11d48' : catInfo.border};
            ${isFuzzed ? 'border-style: dashed;' : ''}
          "></div>
          <!-- Inner Core -->
          <div style="
            position: relative;
            width: 24px;
            height: 24px;
            border-radius: 9999px;
            background-color: ${catInfo.bg};
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            box-shadow: 0 2px 6px rgba(0,0,0,0.35);
          ">
            ${catInfo.glyph}
          </div>
          ${
            isFuzzed
              ? `<div style="
                  position: absolute;
                  top: -3px;
                  right: -3px;
                  width: 12px;
                  height: 12px;
                  background: #e11d48;
                  border-radius: 9999px;
                  border: 2px solid white;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-size: 7px;
                  color: white;
                  font-weight: bold;
                ">🔒</div>`
              : ''
          }
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-obs-pin',
        html: markerHtml,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const marker = L.marker([pt.latitude, pt.longitude], { icon: customIcon });

      marker.on('click', () => {
        setSelectedPoint(pt);
        setSelectedZone(null);
      });

      marker.addTo(markersGroupRef.current);
    });
  }, [pointsData, zonesData]);

  return (
    <div className="relative w-full h-full min-h-[500px] rounded-2xl overflow-hidden border border-slate-200 shadow-xs bg-slate-900 flex flex-col">
      {/* Top Map Controls Overlay */}
      <div className="absolute top-4 left-4 right-4 z-[1000] flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Left: Category Filter Pills */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200 shadow-md pointer-events-auto overflow-x-auto max-w-full">
          {['all', 'birds', 'butterflies', 'plants', 'insects', 'reptiles', 'mammals'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold capitalize transition-all shrink-0 ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Right: Sensitive Species Privacy Toggle & Layer Selector */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Privacy Toggle */}
          <button
            onClick={() => setIsAuthorized(!isAuthorized)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-md transition-all backdrop-blur-md border ${
              isAuthorized
                ? 'bg-rose-600 text-white border-rose-500'
                : 'bg-white/95 text-slate-700 border-slate-200 hover:bg-white'
            }`}
            title="Toggle endangered species exact coordinates vs fuzzed public view"
          >
            {isAuthorized ? <Unlock className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5 text-emerald-600" />}
            <span>{isAuthorized ? 'Ecologist Mode' : 'Public Safe View'}</span>
          </button>

          {/* Tile layer selector */}
          <div className="flex rounded-xl bg-white/95 backdrop-blur-md border border-slate-200 shadow-md p-1">
            {Object.keys(tileProviders).map((lyr) => (
              <button
                key={lyr}
                onClick={() => setActiveLayer(lyr)}
                className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-all ${
                  activeLayer === lyr
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {lyr}
              </button>
            ))}
          </div>

          <button
            onClick={fetchMapData}
            className="p-2 rounded-xl bg-white/95 backdrop-blur-md border border-slate-200 shadow-md text-slate-600 hover:text-slate-900 transition-colors"
            title="Refresh Map Points"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Actual Leaflet Map Canvas */}
      <div ref={mapContainerRef} className="w-full flex-1 z-0" />

      {/* Selected Observation Modal Card (Bottom Left Overlay) */}
      {selectedPoint && (
        <div className="absolute bottom-4 left-4 z-[1000] max-w-sm w-full bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 p-4 shadow-xl text-xs animate-fadeIn space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[10px] uppercase tracking-wider text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded">
              {selectedPoint.category}
            </span>
            <button
              onClick={() => setSelectedPoint(null)}
              className="text-slate-400 hover:text-slate-600 text-sm font-bold"
            >
              ✕
            </button>
          </div>

          <div className="flex gap-3 items-center">
            {selectedPoint.image_url && (
              <img
                src={selectedPoint.image_url}
                alt={selectedPoint.common_name}
                className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
              />
            )}
            <div>
              <h4 className="font-bold text-slate-900 text-sm leading-snug">
                {selectedPoint.common_name}
              </h4>
              <p className="text-[11px] text-slate-500 italic font-mono">
                {selectedPoint.scientific_name}
              </p>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-mono">
                  IUCN: {selectedPoint.conservation_status}
                </span>
                <span className="text-[10px] font-bold text-emerald-700 font-mono">
                  {selectedPoint.ai_confidence}% AI Match
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-1 text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <div><span className="font-semibold text-slate-400">Zone:</span> {selectedPoint.location_name}</div>
            <div><span className="font-semibold text-slate-400">Habitat:</span> {selectedPoint.habitat}</div>
            <div>
              <span className="font-semibold text-slate-400">Coordinates:</span>{' '}
              <span className="font-mono">{selectedPoint.latitude}° N, {selectedPoint.longitude}° E</span>
            </div>
            {selectedPoint.is_location_obfuscated && (
              <div className="flex items-center gap-1 text-rose-700 font-semibold text-[10px] mt-1 pt-1 border-t border-slate-200">
                <Lock className="h-3 w-3 shrink-0" />
                {selectedPoint.privacy_notice}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Selected Campus Zone Card (Bottom Left Overlay) */}
      {selectedZone && !selectedPoint && (
        <div className="absolute bottom-4 left-4 z-[1000] max-w-sm w-full bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 p-4 shadow-xl text-xs animate-fadeIn space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[10px] uppercase tracking-wider text-indigo-700 bg-indigo-100/70 px-2 py-0.5 rounded">
              Campus Biosphere Zone
            </span>
            <button
              onClick={() => setSelectedZone(null)}
              className="text-slate-400 hover:text-slate-600 text-sm font-bold"
            >
              ✕
            </button>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 text-sm leading-snug">
              {selectedZone.name}
            </h4>
            <p className="text-[11px] text-slate-500 font-mono mt-0.5">
              {selectedZone.habitat_type}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <div>
              <span className="text-slate-400 block text-[10px]">Health Index</span>
              <span className="font-bold text-emerald-600 text-sm font-mono">
                {selectedZone.health_score}/100
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Canopy Cover</span>
              <span className="font-bold text-slate-800 text-sm font-mono">
                {selectedZone.canopy_cover_pct}%
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Species Count</span>
              <span className="font-bold text-slate-800 font-mono">
                {selectedZone.species_count} Taxa
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Risk State</span>
              <span className="font-bold text-amber-600 font-mono">
                {selectedZone.risk_level}
              </span>
            </div>
          </div>
          <div className="text-[10px] text-slate-500 italic">
            Dominant taxa: {selectedZone.dominant_taxa}
          </div>
        </div>
      )}

      {/* Map Legend (Bottom Right Overlay) */}
      <div className="absolute bottom-4 right-4 z-[1000] p-3 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200 shadow-md text-xs space-y-1.5 pointer-events-auto">
        <div className="font-bold text-[10px] uppercase tracking-wider text-slate-400 mb-1">
          Campus Flora & Fauna Legend
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px] text-slate-700">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500" /> Avian (Birds)
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Lepidoptera (Butterflies)
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" /> Native Flora (Plants)
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-600" /> Arthropods (Insects)
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-600" /> Herpetofauna (Reptiles)
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600 border border-white" /> Sensitive (Fuzzed)
          </div>
        </div>
      </div>
    </div>
  );
}
