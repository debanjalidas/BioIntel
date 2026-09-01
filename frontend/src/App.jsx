import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import StatCards from './components/StatCards';
import EcosystemMap from './components/EcosystemMap';
import RecentAlerts, { alertsList } from './components/RecentAlerts';
import BiodiversityTrendChart from './components/BiodiversityTrendChart';
import DataSourcesChart from './components/DataSourcesChart';
import HabitatConditionChart from './components/HabitatConditionChart';
import RecentDetections from './components/RecentDetections';
import QuickActions from './components/QuickActions';
import ActionModal from './components/ActionModal';

// Dedicated Sub-Views for All 14 Navigation Tabs
import EdnaView from './components/views/EdnaView';
import RemoteSensingView from './components/views/RemoteSensingView';
import GroundSurveysView from './components/views/GroundSurveysView';
import AnalyticsView from './components/views/AnalyticsView';
import DigitalTwinView from './components/views/DigitalTwinView';
import ReportsView from './components/views/ReportsView';
import DataUploadView from './components/views/DataUploadView';
import UsersRolesView from './components/views/UsersRolesView';
import SettingsView from './components/views/SettingsView';

import {
  TreePine,
  Activity,
  Mic,
  Dna,
  ShieldAlert,
  BarChart3,
  MapPin,
  CheckCircle2,
  Filter,
  Search,
  RefreshCw,
  Sparkles,
  Volume2,
} from 'lucide-react';
import { bioApi } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalActionType, setModalActionType] = useState('upload_audio');
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [selectedDetection, setSelectedDetection] = useState(null);
  const [selectedSite, setSelectedSite] = useState(null);

  // Dynamic Live Data States for Species and Acoustics
  const [speciesList, setSpeciesList] = useState([]);
  const [acousticList, setAcousticList] = useState([]);
  const [alertsData, setAlertsData] = useState([]);
  const [isLoadingMain, setIsLoadingMain] = useState(false);

  // Live PAM Acoustic ML Predictor State
  const [pamInputs, setPamInputs] = useState({
    min_frequency_hz: 650,
    max_frequency_hz: 2400,
    duration_seconds: 4.5,
  });
  const [pamPrediction, setPamPrediction] = useState(null);
  const [isPredictingPam, setIsPredictingPam] = useState(false);

  useEffect(() => {
    loadGlobalData();
  }, []);

  const loadGlobalData = async () => {
    setIsLoadingMain(true);
    try {
      const [spRes, acRes, alRes] = await Promise.all([
        bioApi.getSpecies({ limit: 100 }),
        bioApi.getAcousticDetections({ limit: 100 }),
        bioApi.getAlerts(),
      ]);
      setSpeciesList(spRes.items || []);
      setAcousticList(acRes.items || []);
      setAlertsData(alRes.items || alertsList);
    } catch (err) {
      console.warn('API error, using defaults:', err);
    } finally {
      setIsLoadingMain(false);
    }
  };

  // Quick Action Handler
  const handleQuickAction = (actionId) => {
    setModalActionType(actionId);
    setIsModalOpen(true);
  };

  const handleRunPamPredictor = async (e) => {
    e.preventDefault();
    setIsPredictingPam(true);
    try {
      const res = await bioApi.predictAcoustic(pamInputs);
      setPamPrediction(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsPredictingPam(false);
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#f8fafc] text-slate-900 font-sans antialiased">
      {/* Left Sidebar Navigation (All 14 Tabs) */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenHealthDetails={() => setActiveTab('analytics')}
      />

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-[#f8fafc]">
        {/* Sticky Header Bar */}
        <Header
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onOpenFilters={() => handleQuickAction('add_survey')}
          onOpenNotifications={() => setActiveTab('alerts')}
        />

        {/* Scrollable Main Viewport */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          {/* TAB 1: MAIN DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 max-w-[1600px] mx-auto">
              <StatCards
                onCardClick={(cardId) => {
                  if (cardId === 'alerts' || cardId === 'risks') setActiveTab('alerts');
                  else if (cardId === 'species') setActiveTab('species');
                  else if (cardId === 'sites') setActiveTab('map');
                }}
              />

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
                <div className="lg:col-span-2 min-h-[400px]">
                  <EcosystemMap onSelectSite={(site) => setSelectedSite(site)} />
                </div>
                <div className="min-h-[400px]">
                  <RecentAlerts
                    onSelectAlert={(alert) => {
                      setSelectedAlert(alert);
                      setModalActionType('create_alert');
                      setIsModalOpen(true);
                    }}
                    onViewAll={() => setActiveTab('alerts')}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <BiodiversityTrendChart />
                <DataSourcesChart />
                <HabitatConditionChart />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                <div className="lg:col-span-8">
                  <RecentDetections
                    onSelectDetection={(item) => setSelectedDetection(item)}
                    onViewAll={() => setActiveTab('species')}
                  />
                </div>
                <div className="lg:col-span-4">
                  <QuickActions onActionClick={handleQuickAction} />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MAP EXPLORER */}
          {activeTab === 'map' && (
            <div className="space-y-6 max-w-[1600px] mx-auto">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Spatial Telemetry & PostGIS GIS Explorer</h2>
                  <p className="text-xs text-slate-500">8 Protected Biosphere Hotspots with Sensor Nodes & Geocoded Occurrences</p>
                </div>
                <button
                  onClick={() => handleQuickAction('add_observation')}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
                >
                  + Add Spatial Sensor
                </button>
              </div>
              <div className="h-[750px] w-full">
                <EcosystemMap onSelectSite={(site) => setSelectedSite(site)} />
              </div>
            </div>
          )}

          {/* TAB 3: SPECIES CATALOG (Connected to 65+ Species Dataset) */}
          {activeTab === 'species' && (
            <div className="space-y-6 max-w-[1600px] mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Taxonomic Species Catalog ({speciesList.length} Species)</h2>
                  <p className="text-xs text-slate-500">
                    Comprehensive catalog with IUCN Red List categories (CR, EN, VU, NT, LC) & bio-indicator flags
                  </p>
                </div>
                <button
                  onClick={() => handleQuickAction('add_observation')}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors shadow-xs self-start sm:self-auto"
                >
                  + Record Field Sighting
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {speciesList.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl border border-slate-200 p-3.5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <img
                        src={item.image_url || `https://images.unsplash.com/photo-1549608276-5786777e6587?auto=format&fit=crop&w=400&q=80`}
                        alt={item.common_name}
                        className="h-36 w-full object-cover rounded-xl mb-3 bg-slate-100"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=400&q=80';
                        }}
                      />
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${
                          item.conservation_status === 'CR' ? 'bg-rose-100 text-rose-700' :
                          item.conservation_status === 'EN' ? 'bg-orange-100 text-orange-700' :
                          item.conservation_status === 'VU' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          IUCN: {item.conservation_status}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-400">{item.taxonomic_group}</span>
                      </div>
                      <h3 className="font-bold text-slate-900 text-sm leading-tight mt-1">{item.common_name}</h3>
                      <p className="text-xs text-slate-400 italic font-mono mb-2">{item.scientific_name}</p>
                      <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">{item.description}</p>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-3 mt-3 border-t border-slate-100">
                      <span className="text-[10px] font-semibold text-slate-500">
                        {item.is_indicator_species ? 'Bio-Indicator' : (item.is_invasive ? 'Invasive Flag' : 'Native')}
                      </span>
                      <span className="font-mono text-[11px] font-bold text-slate-700">ID #{item.id}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: BIOACOUSTICS PAM */}
          {activeTab === 'bioacoustics' && (
            <div className="space-y-6 max-w-[1600px] mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Passive Acoustic Monitoring (PAM) & Bioacoustics</h2>
                  <p className="text-xs text-slate-500">
                    Continuous wildlife soundscape telemetry, spectrogram frequencies & live acoustic species classifier
                  </p>
                </div>
                <button
                  onClick={() => handleQuickAction('upload_audio')}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors shadow-xs self-start sm:self-auto"
                >
                  <Mic className="h-4 w-4" /> Upload Audio Waveform
                </button>
              </div>

              {/* Grid: ML Acoustic Classifier (L) & PAM Telemetry Stream (R) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left: ML Species Sound Classifier Widget */}
                <div className="lg:col-span-5 bg-gradient-to-b from-white to-emerald-50/30 rounded-2xl border border-emerald-200/80 p-5 shadow-sm space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-emerald-600 text-white shadow-xs">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">ML Acoustic Species Identifier</h3>
                      <p className="text-[11px] text-slate-500">Trained Random Forest BioNet Classifier</p>
                    </div>
                  </div>

                  <form onSubmit={handleRunPamPredictor} className="space-y-3 text-xs">
                    <div>
                      <label className="font-medium text-slate-700 block mb-1">Min Frequency (Hz)</label>
                      <input
                        type="number"
                        value={pamInputs.min_frequency_hz}
                        onChange={(e) => setPamInputs({ ...pamInputs, min_frequency_hz: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 font-mono focus:outline-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="font-medium text-slate-700 block mb-1">Max Frequency (Hz)</label>
                      <input
                        type="number"
                        value={pamInputs.max_frequency_hz}
                        onChange={(e) => setPamInputs({ ...pamInputs, max_frequency_hz: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 font-mono focus:outline-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="font-medium text-slate-700 block mb-1">Call Duration (seconds)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={pamInputs.duration_seconds}
                        onChange={(e) => setPamInputs({ ...pamInputs, duration_seconds: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 font-mono focus:outline-emerald-500"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isPredictingPam}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2 mt-2"
                    >
                      <Volume2 className={`h-4 w-4 ${isPredictingPam ? 'animate-spin' : ''}`} />
                      {isPredictingPam ? 'Classifying Acoustic Signal...' : 'Identify Vocalizing Species'}
                    </button>
                  </form>

                  {pamPrediction && (
                    <div className="mt-3 p-3.5 rounded-xl bg-white border border-emerald-200 shadow-2xs space-y-2 animate-fadeIn">
                      <div className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Classification Output</div>
                      <div className="flex items-center justify-between">
                        <div className="font-bold text-slate-900 text-sm">{pamPrediction.predicted_species}</div>
                        <div className="font-mono font-bold text-emerald-700 text-xs">
                          {(pamPrediction.confidence * 100).toFixed(1)}% Confidence
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right: PAM Vocalization Detections Table */}
                <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">Acoustic Detections Feed ({acousticList.length})</h3>
                      <p className="text-[11px] text-slate-500">Autonomous sensor arrays across forest canopy</p>
                    </div>
                    <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                      44.1 kHz • 16-bit PAM
                    </span>
                  </div>

                  <div className="max-h-[460px] overflow-y-auto space-y-2.5 pr-1">
                    {acousticList.map((item) => (
                      <div
                        key={item.detection_id}
                        className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-emerald-50/50 border border-slate-200/70 transition-all text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shrink-0">
                            <Mic className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">{item.common_name}</div>
                            <div className="text-[11px] text-slate-500 font-mono">
                              {item.site_name} • {item.min_frequency_hz}-{item.max_frequency_hz} Hz ({item.duration_seconds}s)
                            </div>
                          </div>
                        </div>
                        <div className="text-right font-mono">
                          <div className="font-bold text-emerald-700">{(item.model_confidence * 100).toFixed(0)}% Match</div>
                          <div className="text-[10px] text-slate-400">{item.verification_status}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: eDNA METABARCODING */}
          {activeTab === 'edna' && <EdnaView />}

          {/* TAB 6: REMOTE SENSING & CANOPY */}
          {activeTab === 'remote_sensing' && <RemoteSensingView />}

          {/* TAB 7: GROUND SURVEYS & FIELD NOTES */}
          {activeTab === 'ground_surveys' && <GroundSurveysView />}

          {/* TAB 8: ALERTS & RISKS */}
          {activeTab === 'alerts' && (
            <div className="space-y-6 max-w-[1600px] mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Early Warning Threat Intelligence & Alerts</h2>
                  <p className="text-xs text-slate-500">
                    Autonomous multi-modal event dispatch: chainsaw incursions, invasive outbreaks & canopy degradation
                  </p>
                </div>
                <button
                  onClick={() => handleQuickAction('create_alert')}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-colors shadow-xs self-start sm:self-auto"
                >
                  + Dispatch Threat Alert
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {alertsData.map((alert) => (
                  <div
                    key={alert.id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md border font-mono ${alert.severity_color || alert.severityColor}`}>
                          {alert.severity}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400">{alert.time}</span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 mt-2.5">{alert.title}</h3>
                      <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{alert.description}</p>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-4 mt-4 border-t border-slate-100 text-slate-500 font-medium">
                      <span className="flex items-center gap-1 font-mono text-[11px]">
                        <MapPin className="h-3.5 w-3.5 text-slate-400" /> {alert.location}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-400">{alert.source || 'Automated Telemetry'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 9: ANALYTICS & ML PIPELINE */}
          {activeTab === 'analytics' && <AnalyticsView />}

          {/* TAB 10: DIGITAL TWIN & 3D SIMULATION */}
          {activeTab === 'digital_twin' && <DigitalTwinView />}

          {/* TAB 11: REPORTS GENERATOR */}
          {activeTab === 'reports' && <ReportsView />}

          {/* TAB 12: DATA UPLOAD & INGESTION */}
          {activeTab === 'data_upload' && <DataUploadView />}

          {/* TAB 13: USERS, ROLES & RBAC */}
          {activeTab === 'users' && <UsersRolesView />}

          {/* TAB 14: SYSTEM SETTINGS */}
          {activeTab === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Interactive Action & Upload Modal */}
      <ActionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        actionType={modalActionType}
      />
    </div>
  );
}
