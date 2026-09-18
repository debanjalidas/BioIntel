import React, { useState } from 'react';
import {
  Shield,
  Eye,
  CheckCircle2,
  Lock,
  Unlock,
  AlertTriangle,
  Scale,
  FileCheck,
  Cpu,
  HelpCircle,
  Sparkles,
  Info,
  MapPin,
  Flame,
  ArrowRight,
} from 'lucide-react';

export default function ResponsibleAiView() {
  const [isAuthorizedView, setIsAuthorizedView] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);

  // Quality score metrics
  const qualityMetrics = [
    { label: 'Species Verification Rate', value: '88.4%', target: '>85%', status: 'Optimal' },
    { label: 'GPS Geolocation Accuracy', value: '94.2%', target: '>90%', status: 'Optimal' },
    { label: 'Temporal Metadata Integrity', value: '99.1%', target: '>98%', status: 'Optimal' },
    { label: 'Observation Completeness', value: '79.6%', target: '>75%', status: 'Good' },
    { label: 'Citizen Bias Correction Factor', value: 'Active', target: 'Applied', status: 'Optimal' },
  ];

  // Bias mitigation points
  const biasMitigations = [
    {
      title: 'Effort Bias in Citizen Science',
      problem: 'Higher observation density near walking trails, campus lawns, and during daylight hours creates artificial clustering.',
      solution: 'BioIntel applies an observation-per-visit normalization and calculates effort-weighted biodiversity indices rather than raw counts.',
    },
    {
      title: 'Taxonomic Charismatic Bias',
      problem: 'Users disproportionately photograph colorful birds and butterflies while overlooking soil micro-arthropods, lichens, and grasses.',
      solution: 'AI confidence thresholds are stratified by taxonomic complexity, and the campus health score assigns equal ecological weight to underrepresented taxa.',
    },
    {
      title: 'Temporal Nocturnal Detection Gap',
      problem: 'Human observers are rarely active after dusk, missing nocturnal owls, amphibians, and flying foxes.',
      solution: 'Passive acoustic monitoring (PAM) and camera trap sensor meshes bridge the nocturnal gap, feeding continuous nighttime telemetry into the digital twin.',
    },
    {
      title: 'Uncertainty & Hallucination Prevention',
      problem: 'Generative models can confabulate species ranges or assert false certainty about blurred specimens.',
      solution: 'RAG strict prompt gating categorizes all output into [Observed Fact], [Inference], and [Unknown]. Multi-class vision models always provide top-3 candidates with confidence percentages and low-confidence warnings.',
    },
  ];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
            <Shield className="h-3.5 w-3.5" />
            UN SDG 15 • Ethical AI & Governance
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Responsible AI & Conservation Integrity
          </h1>
          <p className="text-emerald-100/80 text-sm max-w-3xl leading-relaxed">
            BioIntel adheres to stringent scientific standards. We do not claim 100% certainty, we do not make unsupported causal claims, and we protect vulnerable wildlife with automated location fuzzing and human-in-the-loop verification.
          </p>
        </div>
      </div>

      {/* Grid: 3 Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Pillar 1 */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
          <div className="h-10 w-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
            <Scale className="h-5 w-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">Confidence Calibration</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Vision classifications below 70% automatically display a prominent <span className="font-bold text-amber-700">"Requires field verification"</span> warning. Predictions are explicitly labeled as <span className="font-semibold italic">"Likely species"</span> rather than absolute truth.
          </p>
        </div>

        {/* Pillar 2 */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
          <div className="h-10 w-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
            <Lock className="h-5 w-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">Endangered Species Privacy</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Observations of Critically Endangered (CR) and Endangered (EN) taxa have their GPS coordinates automatically fuzzed by ~400 meters on public portals to protect wildlife from poaching and disturbance.
          </p>
        </div>

        {/* Pillar 3 */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">Human-in-the-Loop Pipeline</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            AI serves as an assistant, not the sole arbiter. All sightings enter a verification queue where student leaders, botanists, or campus ecologists review evidence before reaching Research-Grade status.
          </p>
        </div>
      </div>

      {/* Interactive Feature Demo: Sensitive Species Coordinate Privacy */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-emerald-600" />
              <h2 className="text-base font-bold text-slate-900">
                Interactive Demo: Location Obfuscation Protocol
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Toggle between Public View and Authorized Researcher View to see how BioIntel protects vulnerable species.
            </p>
          </div>

          <button
            onClick={() => setIsAuthorizedView(!isAuthorizedView)}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all shadow-xs ${
              isAuthorizedView
                ? 'bg-rose-600 text-white hover:bg-rose-700'
                : 'bg-emerald-600 text-white hover:bg-emerald-700'
            }`}
          >
            {isAuthorizedView ? <Unlock className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}
            {isAuthorizedView ? 'Viewing as Authorized Ecologist' : 'Viewing as Public Guest'}
          </button>
        </div>

        {/* Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={`p-4 rounded-xl border transition-all ${
            !isAuthorizedView ? 'bg-emerald-50/50 border-emerald-300 ring-2 ring-emerald-500/20' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                <Lock className="h-3 w-3" /> Public View (Protected)
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 font-bold">
                Fuzzed (~400m Offset)
              </span>
            </div>
            <div className="space-y-1.5 text-xs text-slate-700 font-mono bg-white p-3 rounded-lg border border-slate-200">
              <div><span className="text-slate-400">Species:</span> Indian Pangolin (Manis crassicaudata) [EN]</div>
              <div><span className="text-slate-400">Display Lat:</span> 28.5482° N <span className="text-amber-600">(± 0.0035° blur)</span></div>
              <div><span className="text-slate-400">Display Lng:</span> 77.1951° E <span className="text-amber-600">(± 0.0028° blur)</span></div>
              <div><span className="text-slate-400">Zone:</span> Zone D — Dense Woodland</div>
              <div><span className="text-slate-400">Notice:</span> "Location fuzzed for endangered species protection"</div>
            </div>
          </div>

          <div className={`p-4 rounded-xl border transition-all ${
            isAuthorizedView ? 'bg-rose-50/50 border-rose-300 ring-2 ring-rose-500/20' : 'bg-slate-50 border-slate-200 opacity-60'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-rose-800 uppercase tracking-wider flex items-center gap-1.5">
                <Unlock className="h-3 w-3" /> Authorized Researcher View
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-100 text-rose-700 font-bold">
                Exact Coordinates
              </span>
            </div>
            <div className="space-y-1.5 text-xs text-slate-700 font-mono bg-white p-3 rounded-lg border border-slate-200">
              <div><span className="text-slate-400">Species:</span> Indian Pangolin (Manis crassicaudata) [EN]</div>
              <div><span className="text-slate-400">Exact Lat:</span> 28.54751° N <span className="text-emerald-600">(Raw GPS fix)</span></div>
              <div><span className="text-slate-400">Exact Lng:</span> 77.19122° E <span className="text-emerald-600">(± 3.2m RTK precision)</span></div>
              <div><span className="text-slate-400">Telemetry:</span> Trail camera station TC-04 under root burrow</div>
              <div><span className="text-slate-400">Audit Log:</span> Access recorded for researcher compliance log</div>
            </div>
          </div>
        </div>
      </div>

      {/* Human-in-the-Loop Verification Lifecycle Diagram */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <FileCheck className="h-4 w-4 text-emerald-600" />
          <h2 className="text-base font-bold text-slate-900">
            Observation Lifecycle: From Raw Photo to Verified Record
          </h2>
        </div>
        <p className="text-xs text-slate-500">
          How BioIntel balances crowdsourced enthusiasm with rigorous peer review.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-700">Stage 1</span>
              <span className="text-slate-400 text-xs font-mono">Mobile / Web</span>
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Citizen Observation</h4>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Student or faculty captures photo with GPS timestamp and habitat notes across the 5 campus zones.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">Stage 2</span>
              <span className="text-emerald-600 text-xs font-mono">MobileNetV3 / ResNet</span>
            </div>
            <h4 className="font-bold text-emerald-950 text-sm">AI Assistance</h4>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Vision classifier identifies top 3 candidate taxa with confidence %. Flags low confidence or blurry captures.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">Stage 3</span>
              <span className="text-amber-700 text-xs font-mono">Admin Queue</span>
            </div>
            <h4 className="font-bold text-amber-950 text-sm">Human Verification</h4>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Campus botanist or student verifier reviews AI candidate, morphologic details, and accepts or corrects identification.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-teal-50/50 border border-teal-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-100 text-teal-800">Stage 4</span>
              <span className="text-teal-700 text-xs font-mono">Ecosystem Twin</span>
            </div>
            <h4 className="font-bold text-teal-950 text-sm">Research Grade</h4>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Verified record enters the BioIntel Biodiversity Ledger, updates Health Scores, and grounds RAG assistant answers.
            </p>
          </div>
        </div>
      </div>

      {/* Bias Mitigation and Limitations */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <h2 className="text-base font-bold text-slate-900">
            Known Limitations & Mitigation Strategies
          </h2>
        </div>
        <p className="text-xs text-slate-500">
          Transparent disclosure of data biases inherent to ecological monitoring and how BioIntel addresses them.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {biasMitigations.map((item, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <span className="h-5 w-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-xs">
                  {idx + 1}
                </span>
                {item.title}
              </h4>
              <div className="space-y-1.5 text-xs">
                <p className="text-rose-700 bg-rose-50 p-2 rounded-lg border border-rose-200/60">
                  <span className="font-bold">Challenge:</span> {item.problem}
                </p>
                <p className="text-emerald-800 bg-emerald-50 p-2 rounded-lg border border-emerald-200/60">
                  <span className="font-bold">BioIntel Mitigation:</span> {item.solution}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Data Quality & Integrity Scorecard */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Dataset Health & Quality Score</h2>
            <p className="text-xs text-slate-500">Automated quality validation against biodiversity data standards</p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-extrabold text-emerald-600 font-mono">88.2%</span>
            <span className="text-[11px] text-slate-400 block">Overall Quality Score</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 pt-2">
          {qualityMetrics.map((qm, i) => (
            <div key={i} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <div className="text-xs font-semibold text-slate-600 mb-1">{qm.label}</div>
              <div className="text-lg font-bold text-slate-900 font-mono">{qm.value}</div>
              <div className="text-[10px] text-emerald-700 font-medium mt-1">
                Target: {qm.target} ({qm.status})
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
