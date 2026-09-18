import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Bell,
  Sun,
  Moon,
  ChevronDown,
  Sparkles,
  TreePine,
  CheckCircle2,
  Lock,
  Unlock,
  Shield,
  MapPin,
  PawPrint,
} from 'lucide-react';
import { bioApi } from '../services/api';

export default function Header({
  searchQuery,
  setSearchQuery,
  onOpenNotifications,
  userRole = 'ecologist',
  setUserRole,
  onNavigateTab,
}) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const searchRef = useRef(null);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowAutocomplete(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Live search query matching
  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setSearchResults([]);
      setShowAutocomplete(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await bioApi.getSpecies({ search: searchQuery, limit: 6 });
        const items = res?.items || [];
        setSearchResults(items);
        setShowAutocomplete(true);
      } catch (err) {
        console.warn('Search autocomplete error:', err);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSelectSpecies = (sp) => {
    setShowAutocomplete(false);
    if (onNavigateTab) {
      onNavigateTab('species', sp);
    }
  };

  return (
    <header className="bg-white border-b border-slate-200/80 px-6 md:px-8 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 sticky top-0 z-20 shadow-2xs">
      {/* Left: Greeting & SDG 15 Badge */}
      <div className="flex items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              Campus Biodiversity Hub
              <span className="inline-block text-emerald-600 text-xl">🌿</span>
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200 font-mono">
              UN SDG 15
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Real-time telemetry across 5 college campus biosphere zones.
          </p>
        </div>
      </div>

      {/* Right Controls: Search, Notifications, Role Switcher, Theme */}
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Search Bar with Live Autocomplete */}
        <div ref={searchRef} className="relative">
          <Search className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => {
              if (searchResults.length > 0) setShowAutocomplete(true);
            }}
            placeholder="Search 65+ species, zones, alerts..."
            className="bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-full pl-9 pr-4 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 w-56 sm:w-64 lg:w-72 transition-all"
          />

          {/* Autocomplete Dropdown */}
          {showAutocomplete && searchResults.length > 0 && (
            <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-2xl border border-slate-200 shadow-xl p-2 z-50 animate-fadeIn space-y-1">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
                Matching Species
              </div>
              {searchResults.map((sp) => (
                <div
                  key={sp.id}
                  onClick={() => handleSelectSpecies(sp)}
                  className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-emerald-50/70 cursor-pointer transition-colors"
                >
                  <div className="h-8 w-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0">
                    <PawPrint className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-slate-900 truncate">
                      {sp.common_name}
                    </div>
                    <div className="text-[10px] text-slate-400 italic font-mono truncate">
                      {sp.scientific_name}
                    </div>
                  </div>
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                    {sp.conservation_status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Notification Bell */}
        <button
          onClick={onOpenNotifications}
          className="relative p-2 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200/80 transition-colors"
          title="Active Ecological Alerts"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-0.5 right-0.5 h-3.5 w-3.5 bg-rose-500 text-white text-[9px] font-extrabold rounded-full flex items-center justify-center border-2 border-white">
            3
          </span>
        </button>

        {/* Role Switcher Pill Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowRoleDropdown(!showRoleDropdown)}
            className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full bg-slate-50 border border-slate-200/80 hover:bg-slate-100/70 transition-colors cursor-pointer"
          >
            <div className="h-7 w-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
              {userRole === 'ecologist' ? '🌿' : '🔍'}
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-xs font-bold text-slate-900 leading-tight">
                {userRole === 'ecologist' ? 'Dr. Ananya Sharma' : 'Student Observer'}
              </div>
              <div className="text-[10px] font-medium text-emerald-700 capitalize">
                {userRole === 'ecologist' ? 'Campus Ecologist' : 'Citizen Scientist'}
              </div>
            </div>
            <ChevronDown className="h-3 w-3 text-slate-400" />
          </button>

          {showRoleDropdown && (
            <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl border border-slate-200 shadow-xl p-2 z-50 animate-fadeIn space-y-1 text-xs">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
                Switch Role Profile
              </div>
              <button
                onClick={() => {
                  if (setUserRole) setUserRole('ecologist');
                  setShowRoleDropdown(false);
                }}
                className={`w-full text-left p-2 rounded-xl transition-colors flex items-center justify-between ${
                  userRole === 'ecologist' ? 'bg-emerald-50 text-emerald-800 font-bold' : 'hover:bg-slate-50'
                }`}
              >
                <div>
                  <div>Campus Ecologist (Admin)</div>
                  <span className="text-[10px] text-slate-400 font-normal">Full verification & raw GPS</span>
                </div>
                {userRole === 'ecologist' && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />}
              </button>
              <button
                onClick={() => {
                  if (setUserRole) setUserRole('citizen');
                  setShowRoleDropdown(false);
                }}
                className={`w-full text-left p-2 rounded-xl transition-colors flex items-center justify-between ${
                  userRole === 'citizen' ? 'bg-emerald-50 text-emerald-800 font-bold' : 'hover:bg-slate-50'
                }`}
              >
                <div>
                  <div>Citizen Scientist (Student)</div>
                  <span className="text-[10px] text-slate-400 font-normal">Submit observations</span>
                </div>
                {userRole === 'citizen' && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />}
              </button>
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200/80 transition-colors"
          title="Toggle theme"
        >
          {isDarkMode ? <Moon className="h-4 w-4 text-indigo-400" /> : <Sun className="h-4 w-4 text-amber-500" />}
        </button>
      </div>
    </header>
  );
}
