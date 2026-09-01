import React, { useState, useEffect } from 'react';
import { ClipboardList, Camera, Radio, Search, MapPin, ShieldAlert, CheckCircle2, RefreshCw, UserCheck } from 'lucide-react';
import { bioApi } from '../../services/api';

export default function GroundSurveysView() {
  const [surveys, setSurveys] = useState([]);
  const [stats, setStats] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [methodFilter, setMethodFilter] = useState('');
  const [threatOnly, setThreatOnly] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [methodFilter, threatOnly]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [sRes, stRes] = await Promise.all([
        bioApi.getSurveys({
          method: methodFilter || undefined,
          threat_only: threatOnly || undefined,
          limit: 150,
        }),
        bioApi.getSurveyStats(),
      ]);
      setSurveys(sRes.items || []);
      setStats(stRes);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const filtered = surveys.filter((item) => {
    const s = searchQuery.toLowerCase();
    return (
      (item.common_name || '').toLowerCase().includes(s) ||
      (item.scientific_name || '').toLowerCase().includes(s) ||
      (item.site_name || '').toLowerCase().includes(s) ||
      (item.observer || '').toLowerCase().includes(s)
    );
  });

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-100 text-amber-800">
              <ClipboardList className="h-5 w-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-900">Ground Surveys & Field Wildlife Records</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Standardized GBIF/DarwinCore geolocated camera-trap, acoustic, eDNA assay, and ranger patrol telemetry
          </p>
        </div>

        <button
          onClick={loadData}
          className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50 transition-colors shadow-2xs self-start md:self-auto"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} /> Refresh Observations
        </button>
      </div>

      {/* Metric Counters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500">Total Observations</div>
          <div className="text-2xl font-bold text-slate-900 font-mono mt-1">{stats?.total_observations || surveys.length}</div>
          <div className="text-[10px] text-slate-400 mt-1">Geocoded Occurrence Points</div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500">Individual Count</div>
          <div className="text-2xl font-bold text-emerald-700 font-mono mt-1">
            {stats?.total_individuals_counted || '642'} <span className="text-xs text-slate-400 font-normal">animals</span>
          </div>
          <div className="text-[10px] text-emerald-600 font-medium mt-1">Verified Bio-inventory</div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500">Threat Alerts Flagged</div>
          <div className="text-2xl font-bold text-rose-600 font-mono mt-1">{stats?.threat_alerts_count || '38'}</div>
          <div className="text-[10px] text-rose-500 font-medium mt-1">Endangered / Invasive Taxa</div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500">Patrol Teams & Observers</div>
          <div className="text-base font-bold text-slate-800 mt-1">7 Field Networks</div>
          <div className="text-[10px] text-slate-400 mt-1">Ranger Alpha & Eco-Teams</div>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-[260px]">
          <div className="relative flex-1">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by species, sanctuary, or observer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-emerald-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-medium focus:outline-emerald-500"
          >
            <option value="">All Observation Methods</option>
            <option value="CAMERA_TRAP">Camera Trap Array</option>
            <option value="HUMAN_OBSERVATION">Ranger Patrol Observation</option>
            <option value="PASSIVE_ACOUSTIC">Passive Acoustic Telemetry</option>
            <option value="EDNA_ASSAY">eDNA Metabarcode Assay</option>
            <option value="DRONE_SURVEY">Drone LiDAR / Aerial Survey</option>
          </select>

          <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer select-none px-3 py-2 rounded-xl bg-slate-50 border border-slate-200">
            <input
              type="checkbox"
              checked={threatOnly}
              onChange={(e) => setThreatOnly(e.target.checked)}
              className="rounded text-rose-600 focus:ring-rose-500 h-3.5 w-3.5"
            />
            <span>Show Threat Alerts Only</span>
          </label>
        </div>
      </div>

      {/* Observations Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200/80">
              <tr>
                <th className="p-3">ID & Date</th>
                <th className="p-3">Species Name</th>
                <th className="p-3">IUCN Status</th>
                <th className="p-3">Protected Site</th>
                <th className="p-3">Coordinates</th>
                <th className="p-3">Method</th>
                <th className="p-3">Observer</th>
                <th className="p-3 text-right">Confidence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.slice(0, 50).map((row) => (
                <tr key={row.occurrence_id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-3">
                    <div className="font-mono text-slate-800 font-semibold">{row.occurrence_id}</div>
                    <div className="text-[10px] text-slate-400">{row.observed_at}</div>
                  </td>
                  <td className="p-3">
                    <div className="font-bold text-slate-900">{row.common_name}</div>
                    <div className="text-[10px] text-slate-400 italic font-mono">{row.scientific_name}</div>
                  </td>
                  <td className="p-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      row.conservation_status === 'CR' ? 'bg-rose-100 text-rose-700' :
                      row.conservation_status === 'EN' ? 'bg-orange-100 text-orange-700' :
                      row.conservation_status === 'VU' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {row.conservation_status}
                    </span>
                  </td>
                  <td className="p-3 font-medium text-slate-700">{row.site_name}</td>
                  <td className="p-3 font-mono text-slate-500 text-[11px]">
                    {row.latitude}, {row.longitude}
                  </td>
                  <td className="p-3">
                    <span className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                      {row.observation_method}
                    </span>
                  </td>
                  <td className="p-3 text-slate-600 font-medium">{row.observer}</td>
                  <td className="p-3 text-right font-mono font-bold text-emerald-700">
                    {(row.confidence_score * 100).toFixed(0)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
