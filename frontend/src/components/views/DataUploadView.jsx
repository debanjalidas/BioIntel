import React, { useState } from 'react';
import { UploadCloud, FileSpreadsheet, Music, Image, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

export default function DataUploadView() {
  const [selectedCategory, setSelectedCategory] = useState('edna');
  const [uploadedFiles, setUploadedFiles] = useState([
    { name: 'edna_metabarcoding_samples.csv', size: '9.2 KB', type: 'eDNA CSV', status: 'INGESTED', time: 'Today, 08:12' },
    { name: 'pam_acoustic_detections.csv', size: '14.8 KB', type: 'Bioacoustic CSV', status: 'INGESTED', time: 'Today, 08:12' },
    { name: 'vegetation_canopy_timeseries.csv', size: '18.4 KB', type: 'Sentinel-2 CSV', status: 'INGESTED', time: 'Today, 08:12' },
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);

  const handleSimulatedUpload = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setSuccessMsg(null);
    setTimeout(() => {
      setUploadedFiles([
        { name: `Field_Telemetry_${Date.now().toString().slice(-4)}.csv`, size: '24.1 KB', type: `${selectedCategory.toUpperCase()} Ingestion`, status: 'INGESTED', time: 'Just now' },
        ...uploadedFiles
      ]);
      setIsProcessing(false);
      setSuccessMsg('Dataset successfully ingested, schema validated, and indexed into BioIntel catalog!');
    }, 1200);
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-100 text-blue-700">
              <UploadCloud className="h-5 w-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-900">Multi-Modal Data Ingestion & Sync Hub</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Upload eDNA sequence abundance matrices, bioacoustic WAV audio recordings, Sentinel GeoTIFFs, or GBIF CSVs
          </p>
        </div>
      </div>

      {successMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          {successMsg}
        </div>
      )}

      {/* Upload Zone Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
          {[
            { id: 'edna', label: 'eDNA OTU Tables', icon: FileSpreadsheet },
            { id: 'acoustic', label: 'PAM Audio WAV/MP3', icon: Music },
            { id: 'satellite', label: 'Satellite Rasters & CSVs', icon: Image },
          ].map((cat) => {
            const Icon = cat.icon;
            const isSel = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isSel
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-slate-600 hover:bg-slate-50 border border-transparent'
                }`}
              >
                <Icon className="h-4 w-4" />
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Drag Drop Area */}
        <div
          onClick={handleSimulatedUpload}
          className="border-2 border-dashed border-slate-200 hover:border-blue-400 bg-slate-50/70 hover:bg-blue-50/20 rounded-2xl p-10 text-center cursor-pointer transition-all space-y-3"
        >
          <div className="h-12 w-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto shadow-2xs">
            <UploadCloud className="h-6 w-6" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-800">
              {isProcessing ? 'Processing & Validating Schema...' : 'Click to Upload or Drag & Drop File'}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Supports .CSV, .TSV, .WAV, .MP3, .GeoTIFF, .JSON (Up to 250MB per file)
            </p>
          </div>
        </div>
      </div>

      {/* Recent Ingestions Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm">Recent File Ingestion Activity</h3>
          <span className="text-xs text-slate-400 font-mono">{uploadedFiles.length} files logged</span>
        </div>
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
            <tr>
              <th className="p-3">File Name</th>
              <th className="p-3">Data Modality</th>
              <th className="p-3">Size</th>
              <th className="p-3">Ingested At</th>
              <th className="p-3 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {uploadedFiles.map((file, idx) => (
              <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                <td className="p-3 font-mono font-semibold text-slate-800">{file.name}</td>
                <td className="p-3 text-slate-600">{file.type}</td>
                <td className="p-3 font-mono text-slate-400">{file.size}</td>
                <td className="p-3 text-slate-500">{file.time}</td>
                <td className="p-3 text-right">
                  <span className="font-bold px-2 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-700">
                    {file.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
