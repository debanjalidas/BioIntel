import React, { useState, useEffect } from 'react';
import { Satellite, Trees, AlertTriangle, TrendingDown, Thermometer, ShieldAlert, Sparkles, RefreshCw, BarChart2 } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { bioApi } from '../../services/api';

export default function RemoteSensingView() {
  const [timeseries, setTimeseries] = useState([]);
  const [stats, setStats] = useState(null);
  const [selectedSiteName, setSelectedSiteName] = useState('Western Ghats Rainforest Corridor');
  const [isLoading, setIsLoading] = useState(true);

  // Live ML Deforestation Risk Predictor State
  const [mlInputs, setMlInputs] = useState({
    ndvi_mean: 0.78,
    evi_mean: 0.52,
    ndre_mean: 0.41,
    canopy_cover_percent: 82.0,
    surface_temperature_c: 26.5,
    monthly_precipitation_mm: 120.0,
  });
  const [mlResult, setMlResult] = useState(null);
  const [isPredicting, setIsPredicting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [tRes, sRes] = await Promise.all([
        bioApi.getSatelliteTimeseries({ limit: 120 }),
        bioApi.getSatelliteStats(),
      ]);
      setTimeseries(tRes.items || []);
      setStats(sRes);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRunPredictor = async (e) => {
    e.preventDefault();
    setIsPredicting(true);
    try {
      const res = await bioApi.predictCanopy(mlInputs);
      setMlResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsPredicting(false);
    }
  };

  // Filter for selected site chart
  const siteData = timeseries.filter((row) =>
    (row.site_name || '').toLowerCase() === selectedSiteName.toLowerCase()
  );

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-violet-100 text-violet-700">
              <Satellite className="h-5 w-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-900">Satellite Remote Sensing & Canopy Telemetry</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Sentinel-2 MSI Level-2A 10m multi-spectral vegetation indices (NDVI, EVI, NDRE), surface temperature & deforestation alerts
          </p>
        </div>

        <button
          onClick={loadData}
          className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50 transition-colors shadow-2xs self-start md:self-auto"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} /> Refresh Satellite Feed
        </button>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500">Mean Habitat NDVI</div>
          <div className="text-2xl font-bold text-emerald-700 font-mono mt-1">{stats?.mean_ndvi || '0.814'}</div>
          <div className="text-[10px] text-emerald-600 font-medium mt-1">Dense, Healthy Photosynthesis</div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500">Mean Canopy Cover</div>
          <div className="text-2xl font-bold text-slate-900 font-mono mt-1">{stats?.mean_canopy_cover || '84.6'}%</div>
          <div className="text-[10px] text-slate-400 mt-1">Crown closure & continuous canopy</div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500">Deforestation Alerts</div>
          <div className="text-2xl font-bold text-rose-600 font-mono mt-1">
            {stats?.total_deforestation_alerts || '8'} <span className="text-xs text-slate-400 font-normal">events</span>
          </div>
          <div className="text-[10px] text-rose-500 font-medium mt-1">Automated Change Vector Trigger</div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500">Sensor Constellation</div>
          <div className="text-base font-bold text-violet-700 mt-1">Sentinel-2A/2B</div>
          <div className="text-[10px] text-slate-400 mt-1">5-day revisit cadence • 10m GSD</div>
        </div>
      </div>

      {/* Grid: Interactive Recharts Timeseries (L) & ML Deforestation Predictor (R) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Col: NDVI / EVI Multi-Spectral Time-series */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Multi-Temporal Vegetation Indices (15 Months)</h3>
              <p className="text-[11px] text-slate-500">Track chlorophyll vigor, seasonal monsoon greenup & dry-season dips</p>
            </div>
            <select
              value={selectedSiteName}
              onChange={(e) => setSelectedSiteName(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-semibold focus:outline-emerald-500"
            >
              <option value="Western Ghats Rainforest Corridor">Western Ghats Corridor</option>
              <option value="Sundarbans Mangrove Biosphere">Sundarbans Biosphere</option>
              <option value="Kaziranga Floodplain Sanctuary">Kaziranga Sanctuary</option>
              <option value="Jim Corbett Himalayan Foothills">Jim Corbett Foothills</option>
              <option value="Namdapha Eastern Himalayan Wilderness">Namdapha Wilderness</option>
            </select>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={siteData.length > 0 ? siteData : [
                { observation_date: '2025-01', ndvi_mean: 0.82, evi_mean: 0.58, canopy_cover_percent: 88 },
                { observation_date: '2025-03', ndvi_mean: 0.76, evi_mean: 0.51, canopy_cover_percent: 84 },
                { observation_date: '2025-06', ndvi_mean: 0.89, evi_mean: 0.64, canopy_cover_percent: 91 },
                { observation_date: '2025-09', ndvi_mean: 0.91, evi_mean: 0.67, canopy_cover_percent: 93 },
                { observation_date: '2025-12', ndvi_mean: 0.84, evi_mean: 0.59, canopy_cover_percent: 87 }
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="observation_date" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis domain={[0.4, 1.0]} tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="ndvi_mean" name="NDVI (Vigor)" stroke="#10b981" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="evi_mean" name="EVI (Atmospheric Corrected)" stroke="#8b5cf6" strokeWidth={2} strokeDasharray="4 4" />
                <Line type="monotone" dataKey="ndre_mean" name="NDRE (Red-Edge)" stroke="#06b6d4" strokeWidth={1.8} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Col: ML Deforestation & Canopy Degradation Early Warning Predictor */}
        <div className="lg:col-span-5 bg-gradient-to-b from-white to-violet-50/30 rounded-2xl border border-violet-200/80 p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-violet-600 text-white shadow-xs">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">ML Deforestation Early Warning Predictor</h3>
              <p className="text-[11px] text-slate-500">Trained on Sentinel-2 multi-band spectral anomalies</p>
            </div>
          </div>

          <form onSubmit={handleRunPredictor} className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-medium text-slate-700 block mb-1">NDVI (0.0 - 1.0)</label>
                <input
                  type="number"
                  step="0.02"
                  value={mlInputs.ndvi_mean}
                  onChange={(e) => setMlInputs({ ...mlInputs, ndvi_mean: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 font-mono focus:outline-emerald-500"
                />
              </div>
              <div>
                <label className="font-medium text-slate-700 block mb-1">EVI (0.0 - 1.0)</label>
                <input
                  type="number"
                  step="0.02"
                  value={mlInputs.evi_mean}
                  onChange={(e) => setMlInputs({ ...mlInputs, evi_mean: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 font-mono focus:outline-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-medium text-slate-700 block mb-1">Canopy Cover (%)</label>
                <input
                  type="number"
                  step="1"
                  value={mlInputs.canopy_cover_percent}
                  onChange={(e) => setMlInputs({ ...mlInputs, canopy_cover_percent: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 font-mono focus:outline-emerald-500"
                />
              </div>
              <div>
                <label className="font-medium text-slate-700 block mb-1">Surface Temp (°C)</label>
                <input
                  type="number"
                  step="0.5"
                  value={mlInputs.surface_temperature_c}
                  onChange={(e) => setMlInputs({ ...mlInputs, surface_temperature_c: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 font-mono focus:outline-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isPredicting}
              className="w-full py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2 mt-2"
            >
              <Satellite className={`h-4 w-4 ${isPredicting ? 'animate-spin' : ''}`} />
              {isPredicting ? 'Forecasting Degradation Risk...' : 'Run Deforestation Risk Forecast'}
            </button>
          </form>

          {/* ML Output */}
          {mlResult && (
            <div className="mt-4 p-4 rounded-xl bg-white border border-violet-200 shadow-2xs space-y-3 animate-fadeIn">
              <div className="text-[11px] font-bold text-violet-800 flex items-center justify-between">
                <span>FORECASTED CANOPY THREAT</span>
                <span className="text-[10px] bg-violet-100 px-2 py-0.5 rounded text-violet-700 font-mono">{mlResult.status}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="text-[10px] text-slate-400">Predicted Alert Count</div>
                  <div className="text-xl font-bold text-rose-600 font-mono mt-0.5">
                    {mlResult.predicted_deforestation_alerts} <span className="text-xs font-normal">threats</span>
                  </div>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="text-[10px] text-slate-400">Ecosystem Stability</div>
                  <div className="text-xl font-bold text-emerald-700 font-mono mt-0.5">
                    {mlResult.ecological_stability_score} <span className="text-xs font-normal">/100</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-600 font-medium">Canopy Stress Category:</span>
                <span className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                  mlResult.canopy_stress_level === 'CRITICAL' ? 'bg-rose-100 text-rose-700' :
                  mlResult.canopy_stress_level === 'HIGH' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                }`}>
                  {mlResult.canopy_stress_level}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
