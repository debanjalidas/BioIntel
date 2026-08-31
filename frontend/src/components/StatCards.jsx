import React from 'react';
import {
  Sprout,
  PawPrint,
  MapPin,
  ShieldAlert,
  Bell,
  TrendingUp,
} from 'lucide-react';

export default function StatCards({ onCardClick }) {
  const cards = [
    {
      id: 'ecosystem',
      title: 'Ecosystem Health',
      value: '78',
      denom: '/100',
      tag: 'Good',
      tagColor: 'text-emerald-700 bg-emerald-50 border border-emerald-200/60',
      trend: '6.4% vs last month',
      trendPositive: true,
      icon: Sprout,
      iconBg: 'bg-emerald-50 text-emerald-600',
    },
    {
      id: 'species',
      title: 'Species Richness',
      value: '342',
      denom: '',
      tag: 'High',
      tagColor: 'text-sky-700 bg-sky-50 border border-sky-200/60',
      trend: '12.7% vs last month',
      trendPositive: true,
      icon: PawPrint,
      iconBg: 'bg-sky-50 text-sky-600',
    },
    {
      id: 'sites',
      title: 'Active Sites',
      value: '12',
      denom: '',
      tag: 'Monitoring',
      tagColor: 'text-indigo-700 bg-indigo-50 border border-indigo-200/60',
      trend: '2 vs last month',
      trendPositive: true,
      icon: MapPin,
      iconBg: 'bg-indigo-50 text-indigo-600',
    },
    {
      id: 'risks',
      title: 'High Risk Zones',
      value: '3',
      denom: '',
      tag: 'Critical',
      tagColor: 'text-rose-700 bg-rose-50 border border-rose-200/60',
      trend: '1 vs last month',
      trendPositive: false,
      icon: ShieldAlert,
      iconBg: 'bg-rose-50 text-rose-600',
    },
    {
      id: 'alerts',
      title: 'Recent Alerts',
      value: '5',
      denom: '',
      tag: 'New',
      tagColor: 'text-emerald-700 bg-emerald-50 border border-emerald-200/60',
      trend: '3 vs last month',
      trendPositive: true,
      icon: Bell,
      iconBg: 'bg-emerald-50 text-emerald-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            onClick={() => onCardClick && onCardClick(card.id)}
            className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-slate-300/80 transition-all cursor-pointer flex items-center gap-4 group"
          >
            {/* Circular Icon Avatar */}
            <div
              className={`h-12 w-12 rounded-2xl ${card.iconBg} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}
            >
              <Icon className="h-6 w-6 stroke-[2]" />
            </div>

            {/* Metric Content */}
            <div className="min-w-0 flex-1">
              <div className="text-[11.5px] font-medium text-slate-500 truncate mb-0.5">
                {card.title}
              </div>
              <div className="flex items-baseline gap-1.5 flex-wrap">
                <span className="text-xl font-extrabold text-slate-900 tracking-tight leading-none">
                  {card.value}
                </span>
                {card.denom && (
                  <span className="text-xs font-semibold text-slate-400">
                    {card.denom}
                  </span>
                )}
                {card.tag && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md leading-none ${card.tagColor}`}
                  >
                    {card.tag}
                  </span>
                )}
              </div>
              <div
                className={`text-[10.5px] font-semibold flex items-center gap-1 mt-1.5 ${
                  card.trendPositive ? 'text-emerald-600' : 'text-rose-600'
                }`}
              >
                <TrendingUp
                  className={`h-3 w-3 ${!card.trendPositive ? 'rotate-180' : ''}`}
                />
                <span className="truncate">{card.trend}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
