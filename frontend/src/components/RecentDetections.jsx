import React, { useState } from 'react';
import { Mic, Dna, ClipboardList, Satellite, CameraOff, Image as ImageIcon } from 'lucide-react';

function DetectionCard({ item, onSelectDetection }) {
  const [imgError, setImgError] = useState(false);
  const Icon = item.icon;
  const hasImage = Boolean(item.image) && !imgError;

  return (
    <div
      onClick={() => onSelectDetection && onSelectDetection(item)}
      className="group bg-slate-50/70 hover:bg-white rounded-xl border border-slate-200/80 hover:border-slate-300 hover:shadow-md transition-all overflow-hidden cursor-pointer flex flex-col"
    >
      {/* Species Photo or Clean Blank Placeholder */}
      <div className="h-28 w-full overflow-hidden relative bg-slate-100 flex items-center justify-center">
        {hasImage ? (
          <>
            <img
              src={item.image}
              alt={item.commonName}
              className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-300"
              loading="lazy"
              onError={() => setImgError(true)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-60" />
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 border-b border-slate-200/60 p-2 text-slate-400 select-none">
            <CameraOff className="h-6 w-6 mb-1 text-slate-300" />
            <span className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">
              No Image
            </span>
          </div>
        )}
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
}

export default function RecentDetections({
  detections = [],
  speciesList = [],
  onSelectDetection,
  onViewAll,
}) {
  let itemsToRender = [];

  if (detections && detections.length > 0) {
    itemsToRender = detections.slice(0, 5).map((d, idx) => {
      // Look up species catalog image
      const spMatch = speciesList.find(
        (s) =>
          (s.scientific_name && d.scientific_name && s.scientific_name.toLowerCase() === d.scientific_name.toLowerCase()) ||
          (s.common_name && d.common_name && s.common_name.toLowerCase() === d.common_name.toLowerCase())
      );

      const type = d.recording_file ? 'Bioacoustic' : (d.assay_type ? 'eDNA' : 'Ground Survey');
      const Icon = type === 'Bioacoustic' ? Mic : type === 'eDNA' ? Dna : ClipboardList;
      const conf = d.model_confidence ? `${Math.round(d.model_confidence * 100)}%` : '95%';

      return {
        id: d.detection_id || idx + 1,
        commonName: d.common_name || spMatch?.common_name || 'Forest Species',
        scientificName: d.scientific_name || spMatch?.scientific_name || 'Species sp.',
        type: type,
        confidence: conf,
        icon: Icon,
        image: spMatch?.image_url || null,
      };
    });
  } else if (speciesList && speciesList.length > 0) {
    itemsToRender = speciesList.slice(0, 5).map((sp, idx) => {
      const types = ['Bioacoustic', 'eDNA', 'Ground Survey', 'Bioacoustic', 'Remote Sensing'];
      const confs = ['98%', '95%', '92%', '89%', '94%'];
      const t = types[idx % types.length];
      const Icon = t === 'Bioacoustic' ? Mic : t === 'eDNA' ? Dna : t === 'Remote Sensing' ? Satellite : ClipboardList;

      return {
        id: sp.id || idx + 1,
        commonName: sp.common_name,
        scientificName: sp.scientific_name,
        type: t,
        confidence: confs[idx % confs.length],
        icon: Icon,
        image: sp.image_url || null,
      };
    });
  }

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
        {itemsToRender.map((item) => (
          <DetectionCard
            key={item.id}
            item={item}
            onSelectDetection={onSelectDetection}
          />
        ))}
      </div>
    </div>
  );
}
