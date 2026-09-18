import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import StatCards from './components/StatCards';
import EcosystemMap from './components/EcosystemMap';
import RecentAlerts from './components/RecentAlerts';
import BiodiversityTrendChart from './components/BiodiversityTrendChart';
import DataSourcesChart from './components/DataSourcesChart';
import HabitatConditionChart from './components/HabitatConditionChart';
import RecentDetections from './components/RecentDetections';
import QuickActions from './components/QuickActions';
import ActionModal from './components/ActionModal';

// Dedicated Sub-Views for All 12 Navigation Tabs
import ObserveView from './components/views/ObserveView';
import SpeciesExplorerView from './components/views/SpeciesExplorerView';
import HealthScoreView from './components/views/HealthScoreView';
import AiAssistantView from './components/views/AiAssistantView';
import ResponsibleAiView from './components/views/ResponsibleAiView';
import AdminVerificationView from './components/views/AdminVerificationView';
import DigitalTwinView from './components/views/DigitalTwinView';
import ReportsView from './components/views/ReportsView';
import AnalyticsView from './components/views/AnalyticsView';

// Legacy / Specialized Views
import EdnaView from './components/views/EdnaView';
import RemoteSensingView from './components/views/RemoteSensingView';
import GroundSurveysView from './components/views/GroundSurveysView';
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
  CameraOff,
  Shield,
  Camera,
} from 'lucide-react';
import { bioApi } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [userRole, setUserRole] = useState('ecologist'); // 'ecologist' | 'citizen'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalActionType, setModalActionType] = useState('add_observation');
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [selectedDetection, setSelectedDetection] = useState(null);
  const [selectedSite, setSelectedSite] = useState(null);

  // Dynamic Live Data States from API
  const [speciesList, setSpeciesList] = useState([]);
  const [acousticList, setAcousticList] = useState([]);
  const [alertsData, setAlertsData] = useState([]);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [trendData, setTrendData] = useState([]);
  const [dataSourcesData, setDataSourcesData] = useState(null);
  const [habitatData, setHabitatData] = useState(null);
  const [isLoadingMain, setIsLoadingMain] = useState(false);

  useEffect(() => {
    loadGlobalData();
  }, []);

  const loadGlobalData = async () => {
    setIsLoadingMain(true);
    try {
      const [spRes, acRes, alRes, statsRes, trendRes, dsRes, habRes] = await Promise.all([
        bioApi.getSpecies({ limit: 100 }),
        bioApi.getAcousticDetections({ limit: 100 }),
        bioApi.getAlerts(),
        bioApi.getDashboardStats(),
        bioApi.getBiodiversityTrends(),
        bioApi.getDataSourcesBreakdown(),
        bioApi.getHabitatConditions(),
      ]);
      setSpeciesList(spRes?.items || []);
      setAcousticList(acRes?.items || []);
      setAlertsData(alRes?.items || []);
      setDashboardStats(statsRes || null);
      if (trendRes?.daily_trend) {
        setTrendData(trendRes.daily_trend);
      }
      setDataSourcesData(dsRes || null);
      setHabitatData(habRes || null);
    } catch (err) {
      console.warn('API error fetching global dataset:', err);
    } finally {
      setIsLoadingMain(false);
    }
  };

  // Quick Action Handler
  const handleQuickAction = (actionId) => {
    if (actionId === 'add_observation') {
      setActiveTab('observe');
      return;
    }
    setModalActionType(actionId);
    setIsModalOpen(true);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#f8fafc] text-slate-900 font-sans antialiased">
      {/* Left Sidebar Navigation (12 Unified Tabs) */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenHealthDetails={() => setActiveTab('health_score')}
      />

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-[#f8fafc]">
        {/* Sticky Header Bar with Autocomplete Search & Role Switcher */}
        <Header
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          userRole={userRole}
          setUserRole={setUserRole}
          onOpenNotifications={() => setActiveTab('alerts')}
          onNavigateTab={(tab, targetItem) => {
            setActiveTab(tab);
          }}
        />

        {/* Scrollable Main Viewport */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          {/* TAB 1: MAIN DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 max-w-[1600px] mx-auto">
              <StatCards
                stats={dashboardStats}
                onCardClick={(cardId) => {
                  if (cardId === 'alerts' || cardId === 'risks') setActiveTab('alerts');
                  else if (cardId === 'species') setActiveTab('species');
                  else if (cardId === 'sites') setActiveTab('map');
                  else if (cardId === 'health') setActiveTab('health_score');
                }}
              />

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
                <div className="lg:col-span-2 min-h-[440px]">
                  <EcosystemMap onSelectSite={(site) => setSelectedSite(site)} />
                </div>
                <div className="min-h-[440px]">
                  <RecentAlerts
                    alerts={alertsData}
                    onSelectAlert={(alert) => {
                      setSelectedAlert(alert);
                      setActiveTab('alerts');
                    }}
                    onViewAll={() => setActiveTab('alerts')}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <BiodiversityTrendChart trendData={trendData} />
                <DataSourcesChart dataSources={dataSourcesData} />
                <HabitatConditionChart conditionData={habitatData} />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                <div className="lg:col-span-8">
                  <RecentDetections
                    detections={acousticList}
                    speciesList={speciesList}
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

          {/* TAB 2: OBSERVE & IDENTIFY (Optical AI Lens) */}
          {activeTab === 'observe' && (
            <ObserveView
              onObservationCreated={() => {
                loadGlobalData();
              }}
            />
          )}

          {/* TAB 3: TAXONOMIC SPECIES CATALOG */}
          {activeTab === 'species' && <SpeciesExplorerView />}

          {/* TAB 4: INTERACTIVE ECOSYSTEM MAP */}
          {activeTab === 'map' && (
            <div className="space-y-4 max-w-[1600px] mx-auto h-full min-h-[750px] flex flex-col">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Campus Spatial Telemetry & Protected Habitat Zones
                  </h2>
                  <p className="text-xs text-slate-500">
                    5 Protected Biosphere Zones with multi-class observation clusters & privacy safeguards.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('observe')}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors shadow-xs self-start sm:self-auto"
                >
                  <Camera className="h-3.5 w-3.5" /> + Record Observation
                </button>
              </div>
              <div className="flex-1 w-full min-h-[650px]">
                <EcosystemMap onSelectSite={(site) => setSelectedSite(site)} />
              </div>
            </div>
          )}

          {/* TAB 5: ANALYTICS & EFFORT-BIASED TRENDS */}
          {activeTab === 'analytics' && <AnalyticsView />}

          {/* TAB 6: HEALTH SCORE & STRUCTURED AI INSIGHTS */}
          {activeTab === 'health_score' && <HealthScoreView />}

          {/* TAB 7: DIGITAL TWIN & WHAT-IF RESTORATION SIMULATOR */}
          {activeTab === 'digital_twin' && <DigitalTwinView />}

          {/* TAB 8: ALERTS & THREAT INTELLIGENCE */}
          {activeTab === 'alerts' && (
            <div className="space-y-6 max-w-[1600px] mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Early Warning Threat Intelligence & Risk Alerts
                  </h2>
                  <p className="text-xs text-slate-500">
                    Automated multi-factor risk monitoring: invasive weed encroachment, night noise disturbance, and canopy degradation.
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
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-md border font-mono ${
                            alert.severity_color || alert.severityColor || 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}
                        >
                          {alert.severity}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400">
                          {alert.time || 'Logged recently'}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 mt-2.5">
                        {alert.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                        {alert.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-4 mt-4 border-t border-slate-100 text-slate-500 font-medium">
                      <span className="flex items-center gap-1 font-mono text-[11px]">
                        <MapPin className="h-3.5 w-3.5 text-slate-400" /> {alert.location}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-400">
                        {alert.source || 'Automated Telemetry'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 9: RAG GENERATIVE AI ASSISTANT */}
          {activeTab === 'ai_assistant' && <AiAssistantView />}

          {/* TAB 10: RESPONSIBLE AI & CONSERVATION INTEGRITY */}
          {activeTab === 'responsible_ai' && <ResponsibleAiView />}

          {/* TAB 11: EXECUTIVE REPORTS & SDG 15 AUDIT */}
          {activeTab === 'reports' && <ReportsView />}

          {/* TAB 12: ADMIN PEER VERIFICATION & RAG INGESTION */}
          {activeTab === 'admin' && <AdminVerificationView />}

          {/* FALLBACK / SECONDARY SPECIALIZED VIEWS */}
          {activeTab === 'edna' && <EdnaView />}
          {activeTab === 'remote_sensing' && <RemoteSensingView />}
          {activeTab === 'ground_surveys' && <GroundSurveysView />}
          {activeTab === 'data_upload' && <DataUploadView />}
          {activeTab === 'users' && <UsersRolesView />}
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
