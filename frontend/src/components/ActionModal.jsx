import React, { useState } from 'react';
import {
  X,
  Upload,
  Mic,
  Dna,
  ClipboardList,
  PlusSquare,
  AlertTriangle,
  FileText,
  CheckCircle,
  FileCheck,
} from 'lucide-react';

export default function ActionModal({ isOpen, onClose, actionType, initialData }) {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    site: 'Site Alpha-1 (Core Sanctuary)',
    species: '',
    notes: '',
    severity: 'MEDIUM',
    alertType: 'HABITAT_DEGRADATION',
    reportFormat: 'PDF',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [fileName, setFileName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccessMessage('Action processed successfully!');
      setTimeout(() => {
        setSuccessMessage('');
        onClose();
      }, 1200);
    }, 800);
  };

  const getModalHeader = () => {
    switch (actionType) {
      case 'upload_edna':
        return {
          title: 'Upload eDNA Metabarcoding Data',
          desc: 'Submit FASTQ sequencing runs or OTU/ASV taxonomy count CSVs',
          icon: Dna,
          iconColor: 'text-indigo-600 bg-indigo-50',
        };
      case 'upload_audio':
        return {
          title: 'Upload Passive Bioacoustic Audio',
          desc: 'Submit WAV or MP3 field recordings for automated ML species identification',
          icon: Mic,
          iconColor: 'text-emerald-600 bg-emerald-50',
        };
      case 'add_observation':
        return {
          title: 'Add Field Observation',
          desc: 'Record GPS point observation, species count, and verification state',
          icon: PlusSquare,
          iconColor: 'text-sky-600 bg-sky-50',
        };
      case 'create_alert':
        return {
          title: 'Dispatch Early Warning Threat Alert',
          desc: 'Trigger instant perimeter security or ecological team notification',
          icon: AlertTriangle,
          iconColor: 'text-rose-600 bg-rose-50',
        };
      case 'generate_report':
        return {
          title: 'Generate Ecological Intelligence Report',
          desc: 'Export Shannon-Wiener biodiversity index, threat analysis & spatial maps',
          icon: FileText,
          iconColor: 'text-emerald-600 bg-emerald-50',
        };
      default:
        return {
          title: 'Quick Field Action',
          desc: 'BioIntel telemetry and sensor operations',
          icon: ClipboardList,
          iconColor: 'text-emerald-600 bg-emerald-50',
        };
    }
  };

  const header = getModalHeader();
  const Icon = header.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className={`h-10 w-10 rounded-xl ${header.iconColor} flex items-center justify-center`}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 leading-tight">
                {header.title}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">{header.desc}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {successMessage ? (
            <div className="py-8 text-center space-y-2">
              <CheckCircle className="h-12 w-12 text-emerald-500 mx-auto animate-bounce" />
              <div className="text-base font-bold text-slate-900">{successMessage}</div>
              <p className="text-xs text-slate-500">Database & telemetry updated.</p>
            </div>
          ) : (
            <>
              {/* File Upload Dropzone for Audio & eDNA */}
              {(actionType === 'upload_edna' || actionType === 'upload_audio') && (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">
                    Select Data File (.wav, .mp3, .csv, .fastq)
                  </label>
                  <div className="border-2 border-dashed border-slate-200 hover:border-emerald-500 rounded-xl p-6 text-center bg-slate-50/60 hover:bg-emerald-50/30 transition-all cursor-pointer">
                    <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-xs font-semibold text-slate-700">
                      Drag & drop file here, or{' '}
                      <span className="text-emerald-600 underline">browse</span>
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1">
                      Max file size 250MB per batch
                    </p>
                    <input
                      type="file"
                      className="hidden"
                      id="file-upload"
                      onChange={(e) => setFileName(e.target.files[0]?.name || '')}
                    />
                  </div>
                  {fileName && (
                    <div className="mt-2 text-xs font-bold text-emerald-700 flex items-center gap-1.5 bg-emerald-50 px-3 py-1.5 rounded-lg">
                      <FileCheck className="h-4 w-4" /> Selected: {fileName}
                    </div>
                  )}
                </div>
              )}

              {/* Site Selection */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Monitoring Site / Sector
                </label>
                <select
                  value={formData.site}
                  onChange={(e) => setFormData({ ...formData, site: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                >
                  <option>Site Alpha-1 (Core Sanctuary)</option>
                  <option>Western Zone (Buffer Sector 4)</option>
                  <option>Site Gamma-4 (River Basin)</option>
                  <option>Northern Ridge Sector</option>
                  <option>Eastern Wetland Marsh</option>
                </select>
              </div>

              {/* Alert Severity & Type */}
              {actionType === 'create_alert' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Severity Tier
                    </label>
                    <select
                      value={formData.severity}
                      onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                    >
                      <option value="CRITICAL">CRITICAL</option>
                      <option value="HIGH">HIGH</option>
                      <option value="MEDIUM">MEDIUM</option>
                      <option value="LOW">LOW</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Alert Category
                    </label>
                    <select
                      value={formData.alertType}
                      onChange={(e) => setFormData({ ...formData, alertType: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                    >
                      <option value="DEFORESTATION">Deforestation Anomaly</option>
                      <option value="POACHING">Acoustic Gunshot / Chainsaw</option>
                      <option value="INVASIVE_SPECIES">Invasive Species Spike</option>
                      <option value="WATER_STRESS">Riparian Water Stress</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Observation Species Name */}
              {actionType === 'add_observation' && (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Taxon / Species Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Panthera tigris (Bengal Tiger)"
                    value={formData.species}
                    onChange={(e) => setFormData({ ...formData, species: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    required
                  />
                </div>
              )}

              {/* Notes */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Field Notes & Observations
                </label>
                <textarea
                  rows={3}
                  placeholder="Enter context, sensor readings, or telemetry notes..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
                >
                  {isSubmitting ? 'Processing...' : 'Submit & Synchronize'}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
