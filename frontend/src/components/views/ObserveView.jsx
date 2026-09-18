import React, { useState } from 'react';
import {
  UploadCloud,
  Camera,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Info,
  MapPin,
  HelpCircle,
  RefreshCw,
  Eye,
} from 'lucide-react';
import { bioApi } from '../../services/api';

const SAMPLE_DEMO_IMAGES = [
  {
    name: 'Common Myna (Bird)',
    filename: 'common_myna.jpg',
    url: '/images/species/common_myna.jpg',
    category: 'birds',
    species_id: 1,
    default_zone: 'Zone A — Botanical Garden',
    habitat: 'Botanical Garden Shrubs',
  },
  {
    name: 'Plain Tiger (Butterfly)',
    filename: 'plain_tiger_butterfly.jpg',
    url: '/images/species/plain_tiger_butterfly.jpg',
    category: 'butterflies',
    species_id: 21,
    default_zone: 'Zone A — Botanical Garden',
    habitat: 'Flower Garden Beds',
  },
  {
    name: 'Lantana Camara (Invasive Flora)',
    filename: 'lantana_camara.jpg',
    url: '/images/species/lantana_camara.jpg',
    category: 'plants',
    species_id: 42,
    default_zone: 'Zone B — Lotus Pond & Wetland',
    habitat: 'Disturbed Shoreline Soil',
  },
  {
    name: 'Indian Peafowl (Woodland)',
    filename: 'indian_peafowl.jpg',
    url: '/images/species/indian_peafowl.jpg',
    category: 'birds',
    species_id: 6,
    default_zone: 'Zone D — Dense Woodland & Arboretum',
    habitat: 'Arboretum Understory',
  },
  {
    name: 'Indian Flapshell Turtle (Reptile)',
    filename: 'indian_flapshell_turtle.jpg',
    url: '/images/species/indian_flapshell_turtle.jpg',
    category: 'reptiles',
    species_id: 48,
    default_zone: 'Zone B — Lotus Pond & Wetland',
    habitat: 'Submerged Marsh Log',
  },
  {
    name: 'Indian Bullfrog (Amphibian)',
    filename: 'indian_bullfrog.jpg',
    url: '/images/species/indian_bullfrog.jpg',
    category: 'amphibians',
    species_id: 50,
    default_zone: 'Zone B — Lotus Pond & Wetland',
    habitat: 'Lotus Pond Shallows',
  },
  {
    name: 'Blurry / Ambiguous Specimen',
    filename: 'blurry_unclear_specimen.jpg',
    url: '/images/species/blurry_unclear_specimen.jpg',
    category: 'other',
    species_id: 1,
    default_zone: 'Zone C — Central Lawn & Meadows',
    habitat: 'Uncertain',
  },
];

export default function ObserveView({ onObservationCreated }) {
  const [selectedImage, setSelectedImage] = useState(SAMPLE_DEMO_IMAGES[0]);
  const [customImageFile, setCustomImageFile] = useState(null);
  const [customPreviewUrl, setCustomPreviewUrl] = useState(null);

  // Form State
  const [selectedZone, setSelectedZone] = useState('Zone A — Botanical Garden');
  const [habitat, setHabitat] = useState('Botanical Garden Shrubs');
  const [notes, setNotes] = useState('Specimen observed actively foraging in morning sunlight. Good lighting conditions.');
  const [latitude, setLatitude] = useState(28.5462);
  const [longitude, setLongitude] = useState(77.1930);

  // AI Inference State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submittedObs, setSubmittedObs] = useState(null);

  const handleSelectSample = (sample) => {
    setSelectedImage(sample);
    setCustomImageFile(null);
    setCustomPreviewUrl(null);
    setSelectedZone(sample.default_zone);
    setHabitat(sample.habitat);
    setAiResult(null);
    setSubmitSuccess(false);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setCustomImageFile(file);
      const url = URL.createObjectURL(file);
      setCustomPreviewUrl(url);
      setSelectedImage({
        name: file.name,
        filename: file.name,
        url: url,
        category: 'other',
        species_id: 1,
        default_zone: 'Zone A — Botanical Garden',
        habitat: 'Campus Garden',
      });
      setAiResult(null);
      setSubmitSuccess(false);
    }
  };

  const handleRunAiIdentification = async () => {
    setIsAnalyzing(true);
    try {
      const filename = selectedImage.filename || 'observation.jpg';
      const res = await bioApi.identifyImage(filename, selectedImage.category);
      setAiResult(res);
    } catch (err) {
      console.error('Identification failed:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmitObservation = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const speciesId = selectedImage.species_id || 1;
      const confidenceVal = aiResult ? aiResult.confidence : 0.94;
      const payload = {
        species_id: speciesId,
        location_name: selectedZone,
        habitat: habitat,
        latitude: parseFloat(latitude) || 28.5450,
        longitude: parseFloat(longitude) || 77.1926,
        notes: notes,
        image_url: customPreviewUrl || selectedImage.url,
        ai_confidence: confidenceVal,
      };

      const res = await bioApi.createObservation(payload);
      setSubmitSuccess(true);
      setSubmittedObs(res.observation);
      if (onObservationCreated) {
        onObservationCreated(res.observation);
      }
    } catch (err) {
      console.error('Submit observation error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-12">
      {/* Title & Context Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-800 rounded-3xl p-6 md:p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-700/80 text-emerald-100 mb-3 border border-emerald-500/30 font-mono">
            <Sparkles className="h-3.5 w-3.5 text-emerald-300" /> Pipeline: Image → AI Identification → Ecosystem Insight
          </span>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Record Biodiversity Observation
          </h1>
          <p className="text-emerald-100/90 text-xs md:text-sm mt-2 leading-relaxed">
            Upload a wildlife photograph from your campus survey. Our vision model provides candidate species identification
            with transparent confidence scoring and uncertainty warnings.
          </p>
        </div>
      </div>

      {/* Success Banner */}
      {submitSuccess && submittedObs && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">
                Observation Successfully Recorded (#{submittedObs.id})
              </h4>
              <p className="text-xs text-slate-600">
                Species: <strong>{submittedObs.common_name}</strong> ({submittedObs.scientific_name}) • Location: {submittedObs.location_name} • Status: Pending Expert Verification
              </p>
            </div>
          </div>
          <button
            onClick={() => setSubmitSuccess(false)}
            className="text-xs font-bold text-emerald-800 hover:text-emerald-950 px-3 py-1.5 bg-white border border-emerald-200 rounded-lg"
          >
            Record Another
          </button>
        </div>
      )}

      {/* Main Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Image Selector & AI Identification (Col 7) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Quick Demo Preset Selector */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-slate-900 text-sm">
                Select Demonstration Specimen OR Upload Image
              </h3>
              <span className="text-[11px] font-medium text-slate-400">
                One-Click Demo Photos
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
              {SAMPLE_DEMO_IMAGES.map((sample, idx) => {
                const isSelected = selectedImage.name === sample.name && !customImageFile;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectSample(sample)}
                    className={`p-2 rounded-xl border text-left transition-all flex flex-col items-center text-center ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/50 shadow-xs ring-2 ring-emerald-500/20'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                    }`}
                  >
                    <img
                      src={sample.url}
                      alt={sample.name}
                      className="h-14 w-full object-cover rounded-lg mb-1.5"
                    />
                    <span className="text-[11px] font-bold text-slate-800 line-clamp-1 leading-tight">
                      {sample.name}
                    </span>
                    <span className="text-[10px] text-slate-400 uppercase font-mono mt-0.5">
                      {sample.category}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Custom Upload Dropzone */}
            <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <label className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors">
                <UploadCloud className="h-4 w-4 text-slate-500" />
                <span>Upload Custom Image from Device</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              <button
                type="button"
                onClick={() => {
                  // Trigger browser camera if supported
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = 'image/*';
                  input.capture = 'environment';
                  input.onchange = handleFileUpload;
                  input.click();
                }}
                className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold hover:underline"
              >
                <Camera className="h-4 w-4" /> Use Device Camera
              </button>
            </div>
          </div>

          {/* Active Specimen Preview & AI Classification Action */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Specimen Optical Analysis</h3>
                <p className="text-[11px] text-slate-500">Image preprocessing and vision classifier</p>
              </div>
              <button
                type="button"
                onClick={handleRunAiIdentification}
                disabled={isAnalyzing}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs disabled:opacity-50"
              >
                <Sparkles className={`h-3.5 w-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
                {isAnalyzing ? 'Analyzing Image...' : 'Run AI Species Identification'}
              </button>
            </div>

            {/* Image Preview */}
            <div className="h-64 w-full rounded-2xl overflow-hidden bg-slate-100 relative flex items-center justify-center border border-slate-200">
              <img
                src={customPreviewUrl || selectedImage.url}
                alt="Selected Specimen"
                className="h-full w-full object-cover"
              />
              <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-xl font-mono">
                {selectedImage.name}
              </div>
            </div>

            {/* AI Results Output Card */}
            {aiResult && (
              <div
                className={`p-4 rounded-2xl border transition-all ${
                  aiResult.is_low_confidence
                    ? 'bg-amber-50/70 border-amber-300'
                    : 'bg-emerald-50/60 border-emerald-300'
                }`}
              >
                {aiResult.is_low_confidence ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
                      <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
                      <span>Low Confidence Warning</span>
                    </div>
                    <p className="text-xs text-amber-900 leading-relaxed font-medium">
                      {aiResult.warning_message}
                    </p>
                    <div className="text-[11px] text-amber-700">
                      Recommendation: <strong>{aiResult.verification_recommendation}</strong>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 font-mono">
                          AI Identification Result
                        </span>
                        <h4 className="text-base font-bold text-slate-900">
                          Likely Species: <span className="text-emerald-800">{aiResult.likely_species}</span>
                        </h4>
                        <p className="text-xs text-slate-500 italic font-mono">
                          {aiResult.scientific_name}
                        </p>
                      </div>

                      <div className="text-right">
                        <div className="text-2xl font-bold font-mono text-emerald-700">
                          {(aiResult.confidence * 100).toFixed(0)}%
                        </div>
                        <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                          {aiResult.evidence_quality} Evidence
                        </span>
                      </div>
                    </div>

                    <div className="text-xs text-slate-600 bg-white/80 p-2.5 rounded-xl border border-emerald-200">
                      <strong>Verification Note:</strong> {aiResult.verification_recommendation}
                    </div>

                    {/* Top Candidates Breakdown */}
                    {aiResult.candidates && aiResult.candidates.length > 0 && (
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[11px] font-bold text-slate-700">Top Diagnostic Candidates:</span>
                        {aiResult.candidates.map((cand, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between text-xs py-1 px-2.5 rounded-lg bg-white/60 border border-slate-200/60"
                          >
                            <div>
                              <span className="font-semibold text-slate-800">{cand.common_name}</span>
                              <span className="text-[11px] text-slate-400 italic ml-2">({cand.scientific_name})</span>
                            </div>
                            <span className="font-mono font-bold text-emerald-700">
                              {(cand.confidence * 100).toFixed(0)}%
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Observation Metadata Form (Col 5) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Observation Details</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Tag spatial zone, environmental microhabitat, and survey notes
            </p>
          </div>

          <form onSubmit={handleSubmitObservation} className="space-y-4 text-xs">
            {/* Campus Zone Picker */}
            <div>
              <label className="font-semibold text-slate-700 block mb-1.5">
                Campus Monitoring Zone
              </label>
              <select
                value={selectedZone}
                onChange={(e) => setSelectedZone(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-emerald-500"
              >
                <option value="Zone A — Botanical Garden">Zone A — Botanical Garden (Flora & Butterflies)</option>
                <option value="Zone B — Lotus Pond & Wetland">Zone B — Lotus Pond & Wetland (Aquatics & Shoreline)</option>
                <option value="Zone C — Central Lawn & Meadows">Zone C — Central Lawn & Meadows (Grasslands)</option>
                <option value="Zone D — Dense Woodland & Arboretum">Zone D — Dense Woodland & Arboretum (Core Refuge)</option>
                <option value="Zone E — Academic & Administrative Area">Zone E — Academic & Administrative Area (Anthropogenic)</option>
              </select>
            </div>

            {/* Coordinates Lat / Lng */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Latitude</label>
                <input
                  type="number"
                  step="0.0001"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-800"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Longitude</label>
                <input
                  type="number"
                  step="0.0001"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-800"
                />
              </div>
            </div>

            {/* Microhabitat */}
            <div>
              <label className="font-semibold text-slate-700 block mb-1.5">
                Microhabitat / Substrate
              </label>
              <input
                type="text"
                value={habitat}
                onChange={(e) => setHabitat(e.target.value)}
                placeholder="e.g. Flowering shrub, pond mud, deadwood log"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-emerald-500"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="font-semibold text-slate-700 block mb-1.5">
                Field Observation Notes
              </label>
              <textarea
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Describe behavior, flock size, floral host, or disturbance..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-emerald-500 resize-none leading-relaxed"
              />
            </div>

            {/* Scientific Notice */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-500 leading-relaxed flex items-start gap-2">
              <Info className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
              <span>
                Observations are initially classified with AI confidence and queued for human verification by
                faculty researchers. Sensitive endangered species locations are protected automatically.
              </span>
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 text-sm disabled:opacity-50"
            >
              <CheckCircle2 className={`h-4 w-4 ${isSubmitting ? 'animate-spin' : ''}`} />
              {isSubmitting ? 'Recording Observation...' : 'Confirm & Submit Observation'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
