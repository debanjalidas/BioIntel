import React, { useState } from 'react';
import { Settings, Database, Server, Bell, Key, Save, CheckCircle2 } from 'lucide-react';

export default function SettingsView() {
  const [saved, setSaved] = useState(false);
  const [config, setConfig] = useState({
    apiBaseUrl: 'http://127.0.0.1:8000/api/v1',
    postgresHost: 'localhost',
    postgresPort: '5432',
    postgresDb: 'biointel_db',
    alertConfidenceThreshold: 0.85,
    autoTrainIntervalDays: 7,
    enableAcousticStream: true,
    enableSatelliteFeed: true,
  });

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-8">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-slate-200 text-slate-700">
              <Settings className="h-5 w-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-900">System Settings & Sensor Architecture</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Configure PostGIS telemetry connections, ML inference thresholds, API endpoints & automated polling cadences
          </p>
        </div>
      </div>

      {saved && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          Settings successfully persisted to BioIntel environment!
        </div>
      )}

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Backend & DB Config */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Database className="h-4 w-4 text-slate-500" />
            <h3 className="font-bold text-slate-900 text-sm">Database & PostGIS Credentials</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">FastAPI Backend Endpoint</label>
              <input
                type="text"
                value={config.apiBaseUrl}
                onChange={(e) => setConfig({ ...config, apiBaseUrl: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">PostgreSQL Host</label>
                <input
                  type="text"
                  value={config.postgresHost}
                  onChange={(e) => setConfig({ ...config, postgresHost: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Port</label>
                <input
                  type="text"
                  value={config.postgresPort}
                  onChange={(e) => setConfig({ ...config, postgresPort: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Spatial Database Name</label>
              <input
                type="text"
                value={config.postgresDb}
                onChange={(e) => setConfig({ ...config, postgresDb: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono"
              />
            </div>
          </div>
        </div>

        {/* ML & Alert Thresholds */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Server className="h-4 w-4 text-slate-500" />
            <h3 className="font-bold text-slate-900 text-sm">ML Model Hyperparameters & Polling</h3>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex items-center justify-between font-semibold text-slate-700 mb-1">
                <span>Threat Alert Confidence Cutoff</span>
                <span className="font-mono text-emerald-700">{(config.alertConfidenceThreshold * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0.50"
                max="0.99"
                step="0.01"
                value={config.alertConfidenceThreshold}
                onChange={(e) => setConfig({ ...config, alertConfidenceThreshold: parseFloat(e.target.value) })}
                className="w-full accent-emerald-600"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Auto-Retraining Cycle (Days)</label>
              <input
                type="number"
                value={config.autoTrainIntervalDays}
                onChange={(e) => setConfig({ ...config, autoTrainIntervalDays: parseInt(e.target.value) || 7 })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono"
              />
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="flex items-center gap-2 font-medium text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.enableAcousticStream}
                  onChange={(e) => setConfig({ ...config, enableAcousticStream: e.target.checked })}
                  className="rounded text-emerald-600"
                />
                <span>Enable Real-time Acoustic Waveform Streaming</span>
              </label>

              <label className="flex items-center gap-2 font-medium text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.enableSatelliteFeed}
                  onChange={(e) => setConfig({ ...config, enableSatelliteFeed: e.target.checked })}
                  className="rounded text-emerald-600"
                />
                <span>Enable Sentinel-2 5-Day Revisit Webhook</span>
              </label>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors shadow-xs"
          >
            <Save className="h-4 w-4" /> Save System Configuration
          </button>
        </div>
      </form>
    </div>
  );
}
