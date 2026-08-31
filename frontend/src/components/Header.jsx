import React, { useState } from 'react';
import {
  Search,
  Bell,
  Sun,
  Moon,
  Calendar,
  SlidersHorizontal,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

export default function Header({ searchQuery, setSearchQuery, onOpenFilters, onOpenNotifications }) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <header className="bg-white border-b border-slate-200/80 px-8 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 sticky top-0 z-20 shadow-2xs">
      {/* Left: Greeting & Welcome Subtext */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          Good morning, Researcher
          <span className="inline-block text-emerald-600 text-xl">🌿</span>
        </h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          Here's what's happening in your ecosystem today.
        </p>
      </div>

      {/* Right Controls: Search, Notifications, Theme, Profile & Date Picker */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search Bar */}
        <div className="relative">
          <Search className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search species, locations, alerts..."
            className="bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-full pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 w-64 lg:w-72 transition-all"
          />
        </div>

        {/* Notification Bell */}
        <button
          onClick={onOpenNotifications}
          className="relative p-2.5 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200/80 transition-colors"
          title="3 unread alerts"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-1 right-1 h-3.5 w-3.5 bg-emerald-500 text-white text-[9px] font-extrabold rounded-full flex items-center justify-center border-2 border-white">
            3
          </span>
        </button>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleDarkMode}
          className="p-2.5 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200/80 transition-colors"
          title="Toggle theme"
        >
          {isDarkMode ? <Moon className="h-4 w-4 text-indigo-400" /> : <Sun className="h-4 w-4 text-amber-500" />}
        </button>

        {/* User Profile Pill */}
        <div className="flex items-center gap-2.5 pl-2 pr-1 py-1 rounded-full bg-slate-50 border border-slate-200/80 hover:bg-slate-100/70 transition-colors cursor-pointer">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
            alt="Dr. Ananya Sharma"
            className="h-8 w-8 rounded-full object-cover ring-2 ring-emerald-500/40"
          />
          <div className="text-left pr-2 hidden sm:block">
            <div className="text-xs font-bold text-slate-900 leading-tight">
              Dr. Ananya Sharma
            </div>
            <div className="text-[10px] font-medium text-slate-500">
              Researcher
            </div>
          </div>
        </div>

        {/* Date Range Selector Pill */}
        <button className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-slate-200/90 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs">
          <Calendar className="h-3.5 w-3.5 text-slate-500" />
          <span>12 May – 18 May, 2024</span>
          <ChevronDown className="h-3 w-3 text-slate-400" />
        </button>

        {/* Filters Button */}
        <button
          onClick={onOpenFilters}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-slate-200/90 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
        >
          <SlidersHorizontal className="h-3.5 w-3.5 text-slate-500" />
          <span>Filters</span>
        </button>
      </div>
    </header>
  );
}
