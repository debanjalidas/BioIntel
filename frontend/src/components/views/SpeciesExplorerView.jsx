import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  CameraOff,
  Sparkles,
  Info,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
  TreePine,
  X,
} from 'lucide-react';
import { bioApi } from '../../services/api';

const CATEGORY_TABS = [
  { id: 'all', label: 'All Species' },
  { id: 'birds', label: 'Birds' },
  { id: 'butterflies', label: 'Butterflies' },
  { id: 'insects', label: 'Insects' },
  { id: 'plants', label: 'Flora / Plants' },
  { id: 'mammals', label: 'Mammals' },
  { id: 'reptiles', label: 'Reptiles' },
  { id: 'amphibians', label: 'Amphibians' },
];

export default function SpeciesExplorerView({ onSelectSpeciesForObservation }) {
  const [speciesList, setSpeciesList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isLoading, setIsLoading] = useState(false);
  const [activeModalSpecies, setActiveModalSpecies] = useState(null);

  useEffect(() => {
    loadSpecies();
  }, [selectedCategory, statusFilter, searchQuery]);

  const loadSpecies = async () => {
    setIsLoading(true);
    try {
      const params = { limit: 120 };
      if (selectedCategory !== 'all') params.category = selectedCategory;
      if (statusFilter !== 'ALL') params.status = statusFilter;
      if (searchQuery.trim()) params.search = searchQuery.trim();

      const res = await bioApi.getSpecies(params);
      setSpeciesList(res?.items || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Taxonomic Species Explorer
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Browse flora and fauna cataloged across campus habitats with IUCN Red List classifications and observation history.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-bold px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl">
            {speciesList.length} Species Cataloged
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {CATEGORY_TABS.map((tab) => {
            const isActive = selectedCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl font-semibold transition-all shrink-0 ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Search input and IUCN filter */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-2 border-t border-slate-100">
          <div className="md:col-span-8 relative">
            <Search className="h-4 w-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search by common name, scientific name, or family..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-emerald-500 font-medium"
            />
          </div>

          <div className="md:col-span-4 flex items-center gap-2">
            <label className="text-xs font-semibold text-slate-500 whitespace-nowrap">
              IUCN Status:
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:outline-emerald-500"
            >
              <option value="ALL">All Threat Levels</option>
              <option value="CR">Critically Endangered (CR)</option>
              <option value="EN">Endangered (EN)</option>
              <option value="VU">Vulnerable (VU)</option>
              <option value="NT">Near Threatened (NT)</option>
              <option value="LC">Least Concern (LC)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Species Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200 p-4 h-72 animate-pulse" />
          ))}
        </div>
      ) : speciesList.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-3">
          <div className="h-12 w-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <CameraOff className="h-6 w-6" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">No Species Found</h3>
          <p className="text-xs text-slate-500">
            No cataloged species match your current category and search criteria.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setStatusFilter('ALL');
              setSearchQuery('');
            }}
            className="text-xs font-bold text-emerald-700 bg-emerald-50 px-4 py-2 rounded-xl"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {speciesList.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveModalSpecies(item)}
              className="bg-white rounded-2xl border border-slate-200 p-3.5 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between cursor-pointer group"
            >
              <div>
                <div className="h-40 w-full overflow-hidden rounded-xl mb-3 bg-slate-100 relative flex items-center justify-center">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.common_name}
                      className="h-full w-full object-cover rounded-xl transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 text-slate-400">
                      <CameraOff className="h-6 w-6 text-slate-300 mb-1" />
                      <span className="text-[10px] font-semibold uppercase">No Image</span>
                    </div>
                  )}

                  {/* Native / Invasive Badge Overlay */}
                  <div className="absolute top-2 left-2">
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-md shadow-2xs font-mono uppercase tracking-wider ${
                        item.native_status === 'invasive' || item.is_invasive
                          ? 'bg-rose-600 text-white'
                          : item.native_status === 'potential_invasive'
                          ? 'bg-amber-500 text-white'
                          : 'bg-emerald-700/90 text-white'
                      }`}
                    >
                      {item.native_status || 'Native'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${
                      item.conservation_status === 'CR'
                        ? 'bg-rose-100 text-rose-700'
                        : item.conservation_status === 'EN'
                        ? 'bg-orange-100 text-orange-700'
                        : item.conservation_status === 'VU'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}
                  >
                    IUCN: {item.conservation_status}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded capitalize">
                    {item.category || item.taxonomic_group}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-sm leading-tight mt-1 group-hover:text-emerald-700 transition-colors">
                  {item.common_name}
                </h3>
                <p className="text-xs text-slate-400 italic font-mono mb-1.5">{item.scientific_name}</p>
                <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-100 space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>Observations:</span>
                  <strong className="text-slate-800 font-mono">{item.observation_count || 12} sightings</strong>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>Habitat:</span>
                  <span className="truncate max-w-[120px]">{item.habitat || 'Greenspace'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Species Detail Modal */}
      {activeModalSpecies && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-2xl w-full p-6 shadow-2xl space-y-5 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setActiveModalSpecies(null)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-900"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex flex-col sm:flex-row gap-5">
              <div className="h-48 w-full sm:w-48 shrink-0 rounded-2xl overflow-hidden bg-slate-100">
                <img
                  src={activeModalSpecies.image_url}
                  alt={activeModalSpecies.common_name}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md font-mono ${
                      activeModalSpecies.conservation_status === 'CR'
                        ? 'bg-rose-100 text-rose-700'
                        : activeModalSpecies.conservation_status === 'EN'
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}
                  >
                    IUCN: {activeModalSpecies.conservation_status}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded uppercase">
                    {activeModalSpecies.native_status}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-slate-900">{activeModalSpecies.common_name}</h2>
                <p className="text-xs text-slate-400 italic font-mono">{activeModalSpecies.scientific_name}</p>
                <p className="text-xs text-slate-600 leading-relaxed pt-2">
                  {activeModalSpecies.description}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
              <div>
                <span className="text-[10px] font-medium text-slate-400 block">Category</span>
                <strong className="text-slate-800 capitalize">{activeModalSpecies.category}</strong>
              </div>
              <div>
                <span className="text-[10px] font-medium text-slate-400 block">Preferred Habitat</span>
                <strong className="text-slate-800">{activeModalSpecies.habitat}</strong>
              </div>
              <div>
                <span className="text-[10px] font-medium text-slate-400 block">Campus Observations</span>
                <strong className="text-slate-800 font-mono">{activeModalSpecies.observation_count || 12} records</strong>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
              <span className="text-slate-400 font-mono">Taxon ID #{activeModalSpecies.id}</span>
              <button
                onClick={() => {
                  setActiveModalSpecies(null);
                  if (onSelectSpeciesForObservation) {
                    onSelectSpeciesForObservation(activeModalSpecies);
                  }
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all shadow-xs"
              >
                Record Observation of this Species
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
