import React, { useState, useEffect } from 'react';
import {
  Box,
  Sliders,
  Sparkles,
  TreePine,
  Droplets,
  AlertTriangle,
  RefreshCw,
  TrendingUp,
  ShieldCheck,
  Zap,
  ArrowRight,
} from 'lucide-react';
import { bioApi } from '../../services/api';

export default function DigitalTwinView() {
  const [zones, setZones] = useState([]);
  const [selectedZoneCode, setSelectedZoneCode] = useState('ALL');
  const [isLoading, setIsLoading] = useState(false);

  // Simulation Sliders State
  const [params, setParams] = useState({
    target_zone: 'ALL',
    native_flora_increase_pct: 25,
    invasive_weed_removal_pct: 40,
    human_disturbance_reduction_pct: 30,
    waterbody_restoration_pct: 20,
  });

  const [simulationResult, setSimulationResult] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);

  useEffect(() => {
    loadZones();
    runSimulation(params);
  }, []);

  const loadZones = async () => {
    setIsLoading(true);
    try {
      const res = await bioApi.getDigitalTwinZones();
      const zItems = res?.zones || [];
      setZones(zItems);
    } catch (err) {
      console.warn('Failed to load digital twin zones:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const runSimulation = async (simParams) => {
    setIsSimulating(true);
    try {
      const res = await bioApi.simulateScenario(simParams);
      setSimulationResult(res);
    } catch (err) {
      console.warn('Simulation failed:', err);
    } finally {
      setIsSimulating(false);
    }
  };

  const handleSliderChange = (key, value) => {
    const updated = { ...params, [key]: Number(value) };
    setParams(updated);
    runSimulation(updated);
  };

  const handleZoneChange = (zCode) => {
    setSelectedZoneCode(zCode);
    const updated = { ...params, target_zone: zCode };
    setParams(updated);
    runSimulation(updated);
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-100 text-indigo-700">
              <Box className="h-5 w-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-900">
              Campus Ecosystem Digital Twin & 'What-if' Scenario Simulator
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time digital replica of 5 campus biosphere zones paired with an ecological restoration projection engine.
          </p>
        </div>

        <button
          onClick={loadZones}
          className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50 transition-colors shadow-2xs self-start md:self-auto"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} /> Refresh Telemetry
        </button>
      </div>

      {/* 5 Campus Zones Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {zones.map((zone) => {
          const isSelected = selectedZoneCode === zone.code;
          return (
            <div
              key={zone.id}
              onClick={() => handleZoneChange(zone.code)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-indigo-50/60 border-indigo-400 ring-2 ring-indigo-500/20 shadow-md'
                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    zone.risk_level === 'LOW'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {zone.status || zone.risk_level}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-slate-400">
                    {zone.area_hectares} ha
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm leading-tight">
                  {zone.name}
                </h3>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                  {zone.habitat_type}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">Health Index</span>
                  <span className="font-extrabold text-emerald-600 font-mono text-sm">
                    {Math.round(zone.health_score)}/100
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Canopy</span>
                  <span className="font-bold text-slate-700 font-mono text-sm">
                    {zone.canopy_cover_pct}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Restoration Simulator Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Interactive Intervention Sliders */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-indigo-100 text-indigo-700">
                <Sliders className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Restoration Action Levers</h2>
                <p className="text-xs text-slate-500">Adjust intervention parameters to project ecological recovery</p>
              </div>
            </div>

            {/* Target Zone Selector */}
            <select
              value={params.target_zone}
              onChange={(e) => handleZoneChange(e.target.value)}
              className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-slate-700 focus:outline-emerald-500"
            >
              <option value="ALL">All Campus Zones</option>
              <option value="ZONE_A">Zone A — Botanical Garden</option>
              <option value="ZONE_B">Zone B — Lotus Pond</option>
              <option value="ZONE_C">Zone C — Central Lawn</option>
              <option value="ZONE_D">Zone D — Dense Woodland</option>
              <option value="ZONE_E">Zone E — Academic Area</option>
            </select>
          </div>

          {/* Slider 1: Native Flora Reforestation */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                <TreePine className="h-4 w-4 text-emerald-600" /> Native Flora Planting & Micro-Forests
              </span>
              <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                +{params.native_flora_increase_pct}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={params.native_flora_increase_pct}
              onChange={(e) => handleSliderChange('native_flora_increase_pct', e.target.value)}
              className="w-full accent-emerald-600 h-2 bg-slate-100 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>0% (Status Quo)</span>
              <span>50% (Active Miyawaki)</span>
              <span>100% (Dense Canopy)</span>
            </div>
          </div>

          {/* Slider 2: Invasive Weed Eradication */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-amber-600" /> Invasive Weed Eradication (Lantana, Parthenium)
              </span>
              <span className="font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                -{params.invasive_weed_removal_pct}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={params.invasive_weed_removal_pct}
              onChange={(e) => handleSliderChange('invasive_weed_removal_pct', e.target.value)}
              className="w-full accent-amber-600 h-2 bg-slate-100 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>0%</span>
              <span>50% (Mechanical Removal)</span>
              <span>100% (Total Eradication)</span>
            </div>
          </div>

          {/* Slider 3: Human Disturbance Reduction */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                <Zap className="h-4 w-4 text-indigo-600" /> Human Footprint & Night Noise Reduction
              </span>
              <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                -{params.human_disturbance_reduction_pct}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={params.human_disturbance_reduction_pct}
              onChange={(e) => handleSliderChange('human_disturbance_reduction_pct', e.target.value)}
              className="w-full accent-indigo-600 h-2 bg-slate-100 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>0% (Full Traffic)</span>
              <span>50% (Quiet Corridors)</span>
              <span>100% (Strict Ecological Buffer)</span>
            </div>
          </div>

          {/* Slider 4: Waterbody Restoration */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                <Droplets className="h-4 w-4 text-sky-600" /> Wetland & Lotus Pond Reed Bed Filtration
              </span>
              <span className="font-mono font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded">
                +{params.waterbody_restoration_pct}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={params.waterbody_restoration_pct}
              onChange={(e) => handleSliderChange('waterbody_restoration_pct', e.target.value)}
              className="w-full accent-sky-600 h-2 bg-slate-100 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>0%</span>
              <span>50% (Aeration + Reeds)</span>
              <span>100% (Full Bio-Remediation)</span>
            </div>
          </div>
        </div>

        {/* Right: Projected Outcome Card */}
        <div className="lg:col-span-6 bg-gradient-to-b from-white to-indigo-50/30 rounded-2xl border border-indigo-200/80 p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-xs">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Projected Ecological Outcome</h3>
                <p className="text-xs text-slate-500">BioIntel Mathematical Projection Model</p>
              </div>
            </div>
            {isSimulating && (
              <span className="text-xs text-indigo-600 font-semibold animate-pulse">
                Recalculating...
              </span>
            )}
          </div>

          {simulationResult && (
            <div className="space-y-5 animate-fadeIn">
              {/* Big Score Comparison */}
              <div className="bg-white rounded-2xl border border-indigo-100 p-5 shadow-xs flex items-center justify-around text-center">
                <div>
                  <span className="text-xs text-slate-400 font-medium block">Baseline Score</span>
                  <span className="text-3xl font-extrabold text-slate-700 font-mono">
                    {simulationResult.baseline_health_score}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Current state</span>
                </div>

                <div className="text-emerald-500 flex flex-col items-center">
                  <ArrowRight className="h-6 w-6 stroke-[2.5]" />
                  <span className="text-xs font-bold text-emerald-600 font-mono mt-1">
                    +{simulationResult.score_delta > 0 ? simulationResult.score_delta : '0.0'}
                  </span>
                </div>

                <div>
                  <span className="text-xs text-indigo-600 font-medium block">Projected Score</span>
                  <span className="text-3xl font-extrabold text-emerald-600 font-mono">
                    {simulationResult.projected_health_score}
                  </span>
                  <span className="text-[10px] text-emerald-700 font-bold block mt-0.5">
                    {simulationResult.projected_status}
                  </span>
                </div>
              </div>

              {/* Metric Gains Breakdown */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                  <span className="text-[11px] text-slate-500 block">Species Richness Gain</span>
                  <span className="text-xl font-bold text-slate-900 font-mono">
                    +{simulationResult.projected_species_gain || 6} Taxa
                  </span>
                  <span className="text-[10px] text-emerald-600 block mt-0.5">
                    Anticipated pollinators & passerines
                  </span>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                  <span className="text-[11px] text-slate-500 block">Canopy Recovery</span>
                  <span className="text-xl font-bold text-slate-900 font-mono">
                    +{Math.round(params.native_flora_increase_pct * 0.35)}%
                  </span>
                  <span className="text-[10px] text-indigo-600 block mt-0.5">
                    Thermal microclimate buffering
                  </span>
                </div>
              </div>

              {/* Narrative Impact Summary */}
              <div className="bg-white p-4 rounded-xl border border-indigo-100 space-y-1.5">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <TreePine className="h-3.5 w-3.5 text-emerald-600" />
                  Ecosystem Restoration Trajectory
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {simulationResult.summary ||
                    `Simulating a ${params.native_flora_increase_pct}% increase in indigenous vegetation and ${params.invasive_weed_removal_pct}% weed clearing triggers a substantial surge in native pollinator corridors. Lotus Pond water clarity improves, lifting the overall Campus Health Index by +${simulationResult.score_delta || 6.8} points.`}
                </p>
              </div>

              {/* Disclaimer */}
              <div className="text-[10px] text-slate-400 italic bg-slate-50 p-2.5 rounded-lg border border-slate-200/70">
                <span className="font-bold text-slate-500">Notice:</span> Model projections are simulated based on empirical biodiversity restoration curves. Actual recovery timelines require 6–18 months of continuous field observation.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
