import React from 'react';
import {
  Sprout,
  PawPrint,
  MapPin,
  ShieldAlert,
  Bell,
  TrendingUp,
} from 'lucide-react';

export default function StatCards({ stats = {}, onCardClick }) {
  const healthVal = stats?.ecosystem_health_index !== undefined ? stats.ecosystem_health_index : '--';
  const speciesVal = stats?.species_monitored !== undefined ? stats.species_monitored : '--';
  const sitesVal = stats?.active_sites !== undefined ? stats.active_sites : '--';
  const riskVal = stats?.high_risk_zones !== undefined ? stats.high_risk_zones : '--';
  const alertsVal = stats?.active_alerts_count !== undefined ? stats.active_alerts_count : '--';

  const healthStatus = stats?.health_status || 'Good';
  const healthTagColor =
    healthStatus === 'Optimal'
      ? 'text-emerald-700 bg-emerald-50 border border-emerald-200/60'
      : healthStatus === 'Good'
      ? 'text-teal-700 bg-teal-50 border border-teal-200/60'
      : healthStatus === 'Moderate'
      ? 'text-amber-700 bg-amber-50 border border-amber-200/60'
      : 'text-rose-700 bg-rose-50 border border-rose-200/60';

  const cards = [
    {
      id: 'ecosystem',
      title: 'Ecosystem Health',
      value: healthVal,
      denom: '/100',
      tag: healthStatus,
      tagColor: healthTagColor,
      trend: stats?.health_change_pct || '+4.2% vs last month',
      trendPositive: stats?.health_trend_positive !== false,
      icon: Sprout,
      iconBg: 'bg-emerald-50 text-emerald-600',
    },
    {
      id: 'species',
      title: 'Species Richness',
      value: speciesVal,
      denom: '',
      tag: 'Cataloged',
      tagColor: 'text-sky-700 bg-sky-50 border border-sky-200/60',
      trend: `${stats?.field_observations || 150} field observations`,
      trendPositive: true,
      icon: PawPrint,
      iconBg: 'bg-sky-50 text-sky-600',
    },
    {
      id: 'sites',
      title: 'Active Sites',
      value: sitesVal,
      denom: '',
      tag: 'Protected Reserves',
      tagColor: 'text-indigo-700 bg-indigo-50 border border-indigo-200/60',
      trend: 'Sentinel-2 Telemetry',
      trendPositive: true,
      icon: MapPin,
      iconBg: 'bg-indigo-50 text-indigo-600',
    },
    {
      id: 'risks',
      title: 'High Risk Zones',
      value: riskVal,
      denom: '',
      tag: 'Monitored',
      tagColor: 'text-rose-700 bg-rose-50 border border-rose-200/60',
      trend: `${stats?.critical_alerts_count || 0} critical alerts`,
      trendPositive: (stats?.critical_alerts_count || 0) === 0,
      icon: ShieldAlert,
      iconBg: 'bg-rose-50 text-rose-600',
    },
    {
      id: 'alerts',
      title: 'Active Alerts',
      value: alertsVal,
      denom: '',
      tag: 'Live Threat Engine',
      tagColor: 'text-amber-700 bg-amber-50 border border-amber-200/60',
      trend: `${stats?.acoustic_detections || 0} PAM acoustic logs`,
      trendPositive: true,
      icon: Bell,
      iconBg: 'bg-amber-50 text-amber-600',
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

