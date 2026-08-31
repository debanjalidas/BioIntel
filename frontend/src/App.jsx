import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import StatCards from './components/StatCards';
import EcosystemMap from './components/EcosystemMap';
import RecentAlerts, { alertsList } from './components/RecentAlerts';
import BiodiversityTrendChart from './components/BiodiversityTrendChart';
import DataSourcesChart from './components/DataSourcesChart';
import HabitatConditionChart from './components/HabitatConditionChart';
import RecentDetections, { detectionsList } from './components/RecentDetections';
import QuickActions from './components/QuickActions';
import ActionModal from './components/ActionModal';
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
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalActionType, setModalActionType] = useState('upload_audio');
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [selectedDetection, setSelectedDetection] = useState(null);
  const [selectedSite, setSelectedSite] = useState(null);

  // Quick Action Handler
  const handleQuickAction = (actionId) => {
    setModalActionType(actionId);
    setIsModalOpen(true);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#f8fafc] text-slate-900 font-sans antialiased">
      {/* Left Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenHealthDetails={() => handleQuickAction('generate_report')}
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

        {/* Scrollable Dashboard Viewport */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          {/* Main Dashboard View */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 max-w-[1600px] mx-auto">
              {/* Row 1: 5 Core Metric Cards */}
              <StatCards onCardClick={(cardId) => {
                if (cardId === 'alerts' || cardId === 'risks') setActiveTab('alerts');
                else if (cardId === 'species') setActiveTab('species');
                else if (cardId === 'sites') setActiveTab('map');
              }} />

              {/* Row 2: Ecosystem Map & Recent Alerts Split */}
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

              {/* Row 3: 3 Analytics Visualizations */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <BiodiversityTrendChart />
                <DataSourcesChart />
                <HabitatConditionChart />
              </div>

              {/* Row 4: Recent Detections (L) & Quick Actions (R) */}
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

          {/* Sub-View: Map Explorer */}
          {activeTab === 'map' && (
            <div className="space-y-6 max-w-[1600px] mx-auto">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Spatial Telemetry & GIS Explorer</h2>
                  <p className="text-xs text-slate-500">PostGIS Polygon Zones & Spatial Sensor Networks</p>
                </div>
                <button
                  onClick={() => handleQuickAction('add_observation')}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
                >
                  + Add Sensor Site
                </button>
              </div>
              <div className="h-[750px] w-full">
                <EcosystemMap onSelectSite={(site) => setSelectedSite(site)} />
              </div>
            </div>
          )}

          {/* Sub-View: Species Catalog */}
          {activeTab === 'species' && (
            <div className="space-y-6 max-w-[1600px] mx-auto">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Species Catalog & Detections</h2>
                  <p className="text-xs text-slate-500">Taxonomic inventory with IUCN conservation ratings and AI confidence</p>
                </div>
                <button
                  onClick={() => handleQuickAction('add_observation')}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
                >
                  + Record Species Detection
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {detectionsList.map((item) => (
                  <div key={item.id} className="bg-white rounded-2xl border border-slate-200 p-3 shadow-xs hover:shadow-md transition-all">
                    <img src={item.image} alt={item.commonName} className="h-36 w-full object-cover rounded-xl mb-3" />
                    <h3 className="font-bold text-slate-900 text-sm">{item.commonName}</h3>
                    <p className="text-xs text-slate-400 italic font-mono mb-2">{item.scientificName}</p>
                    <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                      <span className="font-semibold text-emerald-700">{item.type}</span>
                      <span className="font-mono font-bold text-slate-800">{item.confidence}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sub-View: Bioacoustics PAM */}
          {activeTab === 'bioacoustics' && (
            <div className="space-y-6 max-w-[1600px] mx-auto">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Passive Acoustic Monitoring (PAM)</h2>
                  <p className="text-xs text-slate-500">Autonomous bioacoustic recorders & deep learning species classifiers</p>
                </div>
                <button
                  onClick={() => handleQuickAction('upload_audio')}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors shadow-xs flex items-center gap-2"
                >
                  <Mic className="h-4 w-4" /> Upload PAM Audio
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <BiodiversityTrendChart />
                <div className="md:col-span-2 bg-white rounded-2xl border border-slate-200 p-5">
                  <h3 className="text-base font-bold text-slate-900 mb-4">Bioacoustic Inferences</h3>
                  <div className="space-y-3">
                    {[
                      { name: 'Green Bee-eater', file: 'PAM_REC_20240518_0630.wav', conf: '98%', time: '06:32 AM', site: 'Canopy Tower Delta' },
                      { name: 'Common Mormon', file: 'PAM_REC_20240518_0712.wav', conf: '92%', time: '07:15 AM', site: 'Western Buffer W-2' },
                      { name: 'Great Hornbill', file: 'PAM_REC_20240518_0910.wav', conf: '94%', time: '09:12 AM', site: 'Core Sanctuary Station 1' },
                    ].map((row, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-xs">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                            <Mic className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">{row.name}</div>
                            <div className="text-[11px] text-slate-500 font-mono">{row.file} • {row.site}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-emerald-700 font-mono">{row.conf} Match</div>
                          <div className="text-[10px] text-slate-400">{row.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Sub-View: Alerts & Risks */}
          {activeTab === 'alerts' && (
            <div className="space-y-6 max-w-[1600px] mx-auto">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Early Warning Threat Intelligence & Alerts</h2>
                  <p className="text-xs text-slate-500">Automated perimeter security, deforestation change detection, and poaching sensors</p>
                </div>
                <button
                  onClick={() => handleQuickAction('create_alert')}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
                >
                  + Dispatch Threat Alert
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {alertsList.map((alert) => (
                  <div key={alert.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${alert.severityColor}`}>
                          {alert.severity}
                        </span>
                        <h3 className="text-sm font-bold text-slate-900 mt-2">{alert.title}</h3>
                        <p className="text-xs text-slate-500 mt-1">{alert.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-100 font-medium text-slate-500">
                      <span>{alert.location}</span>
                      <span>{alert.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
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
