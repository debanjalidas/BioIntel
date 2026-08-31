import React from 'react';
import { Mic, Dna, ClipboardList, Satellite, ChevronRight } from 'lucide-react';

export const detectionsList = [
  {
    id: 1,
    commonName: 'Green Bee-eater',
    scientificName: 'Merops orientalis',
    type: 'Bioacoustic',
    confidence: '98%',
    typeColor: 'text-emerald-700 bg-emerald-50 border-emerald-200/80',
    icon: Mic,
    image: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=500&auto=format&fit=crop&q=80',
    audioSample: 'https://cdn.freesound.org/previews/512/512134_7037-lq.mp3',
  },
  {
    id: 2,
    commonName: 'Chital Deer',
    scientificName: 'Axis axis',
    type: 'eDNA',
    confidence: '95%',
    typeColor: 'text-indigo-700 bg-indigo-50 border-indigo-200/80',
    icon: Dna,
    image: 'https://images.unsplash.com/photo-1547970810-dc1eac8161a7?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 3,
    commonName: 'Indian Tree Frog',
    scientificName: 'Polypedates maculatus',
    type: 'Ground Survey',
    confidence: '90%',
    typeColor: 'text-sky-700 bg-sky-50 border-sky-200/80',
    icon: ClipboardList,
    image: 'https://images.unsplash.com/photo-1579380656108-328e1a387cb0?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 4,
    commonName: 'Common Mormon',
    scientificName: 'Papilio polytes',
    type: 'Bioacoustic',
    confidence: '92%',
    typeColor: 'text-emerald-700 bg-emerald-50 border-emerald-200/80',
    icon: Mic,
    image: 'https://images.unsplash.com/photo-1535083783855-76ae62b2914e?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 5,
    commonName: 'Sacred Fig',
    scientificName: 'Ficus religiosa',
    type: 'Remote Sensing',
    confidence: '85%',
    typeColor: 'text-amber-700 bg-amber-50 border-amber-200/80',
    icon: Satellite,
    image: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=500&auto=format&fit=crop&q=80',
  },
];

export default function RecentDetections({ onSelectDetection, onViewAll }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
      {/* Header with View All */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-slate-900 tracking-tight">
          Recent Detections
        </h3>
        <button
          onClick={onViewAll}
          className="text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline transition-all"
        >
          View All
        </button>
      </div>

      {/* 5 Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {detectionsList.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              onClick={() => onSelectDetection && onSelectDetection(item)}
              className="group bg-slate-50/70 hover:bg-white rounded-xl border border-slate-200/80 hover:border-slate-300 hover:shadow-md transition-all overflow-hidden cursor-pointer flex flex-col"
            >
              {/* Species Photo with Zoom on Hover */}
              <div className="h-28 w-full overflow-hidden relative bg-slate-200">
                <img
                  src={item.image}
                  alt={item.commonName}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-60" />
              </div>

              {/* Card Meta Content */}
              <div className="p-3 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors truncate">
                    {item.commonName}
                  </h4>
                  <p className="text-[10px] text-slate-400 italic font-mono truncate">
                    {item.scientificName}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-200/60">
                  <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-600">
                    <Icon className="h-3 w-3 text-emerald-600" />
                    <span className="truncate max-w-[65px]">{item.type}</span>
                  </div>
                  <span className="text-xs font-extrabold text-slate-900 font-mono">
                    {item.confidence}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
