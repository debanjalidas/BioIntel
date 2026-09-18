import React, { useState, useEffect } from 'react';
import {
  Activity,
  Sparkles,
  Info,
  ShieldCheck,
  AlertTriangle,
  TrendingUp,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { bioApi } from '../../services/api';

export default function HealthScoreView() {
  const [healthData, setHealthData] = useState(null);
  const [insights, setInsights] = useState([]);
  const [showFormulaDetails, setShowFormulaDetails] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadHealthAndInsights();
  }, []);

  const loadHealthAndInsights = async () => {
    setIsLoading(true);
    try {
      const [hRes, inRes] = await Promise.all([
        bioApi.getHealthScore(),
        bioApi.getAiInsights(),
      ]);
      setHealthData(hRes);
      setInsights(inRes?.insights || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const score = healthData?.overall_score || 78.0;
  const status = healthData?.status_label || 'GOOD';

  return (
    <div className="space-y-8 max-w-[1500px] mx-auto pb-12">
      {/* Title Header */}
      <div>
        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full font-mono uppercase tracking-wider">
          Decision Support System
        </span>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight mt-2">
          Ecosystem Health Score & AI Insights
        </h1>
        <p className="text-xs md:text-sm text-slate-500 mt-1 max-w-3xl leading-relaxed">
          Composite ecological indicator aggregating species diversity, native floral ratios, satellite canopy indices,
          and active environmental threat triggers into an explainable decision score.
        </p>
      </div>

      {/* Health Score Main Showcase Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Big Score Gauge Card (Col 4) */}
        <div className="lg:col-span-4 bg-gradient-to-b from-white to-emerald-50/40 rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between text-center relative overflow-hidden">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider font-mono">
              Composite Health Index
            </span>
            <h3 className="font-bold text-slate-900 text-lg">
              BioIntel Ecosystem Health Score
            </h3>
            <p className="text-[11px] text-slate-400 italic">Prototype Indicator — College Campus</p>
          </div>

          <div className="my-6 flex flex-col items-center justify-center">
            <div className="relative h-44 w-44 flex items-center justify-center">
              <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-100"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-emerald-500 transition-all duration-1000 ease-out"
                  strokeDasharray={`${score}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-4xl font-extrabold text-slate-900 font-mono tracking-tight">
                  {score}
                </span>
                <span className="text-xs text-slate-400 font-medium font-mono">out of 100</span>
              </div>
            </div>

            <div className="mt-2 inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Status: {status}</span>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 p-3 bg-white rounded-xl border border-slate-100 leading-tight">
            Recalculated continuously upon every verified field observation and satellite telemetry pass.
          </div>
        </div>

        {/* 5-Component Breakdown Card (Col 8) */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Weighted Component Indices</h3>
              <p className="text-xs text-slate-500">Each sub-index normalized to 0–100 before weighting</p>
            </div>
            <button
              onClick={() => setShowFormulaDetails(!showFormulaDetails)}
              className="flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800"
            >
              <span>{showFormulaDetails ? 'Hide Calculation' : 'How is this calculated?'}</span>
              {showFormulaDetails ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            </button>
          </div>

          {/* Progress Bars */}
          <div className="space-y-4 text-xs">
            {/* 1. Species Diversity (30%) */}
            <div>
              <div className="flex items-center justify-between font-medium mb-1">
                <span className="text-slate-800 font-semibold">1. Species Diversity (Shannon-Wiener Richness)</span>
                <span className="font-mono font-bold text-emerald-700">
                  {healthData?.diversity_score || 92} / 100 <span className="text-slate-400 text-[10px]">(Weight: 30%)</span>
                </span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                  style={{ width: `${healthData?.diversity_score || 92}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                Evaluates total species richness across avifauna, insects, plants, and reptiles.
              </span>
            </div>

            {/* 2. Native Species Ratio (20%) */}
            <div>
              <div className="flex items-center justify-between font-medium mb-1">
                <span className="text-slate-800 font-semibold">2. Native Species Ratio</span>
                <span className="font-mono font-bold text-emerald-700">
                  {healthData?.native_ratio_score || 84} / 100 <span className="text-slate-400 text-[10px]">(Weight: 20%)</span>
                </span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-teal-500 rounded-full transition-all duration-700"
                  style={{ width: `${healthData?.native_ratio_score || 84}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                Proportion of indigenous campus flora & fauna vs introduced or invasive taxa.
              </span>
            </div>

            {/* 3. Habitat Condition (20%) */}
            <div>
              <div className="flex items-center justify-between font-medium mb-1">
                <span className="text-slate-800 font-semibold">3. Habitat Condition (Sentinel-2 NDVI & Water Clarity)</span>
                <span className="font-mono font-bold text-emerald-700">
                  {healthData?.habitat_condition_score || 80} / 100 <span className="text-slate-400 text-[10px]">(Weight: 20%)</span>
                </span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-sky-500 rounded-full transition-all duration-700"
                  style={{ width: `${healthData?.habitat_condition_score || 80}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                Canopy greenness index (NDVI 0.76) and pond wetland dissolved oxygen levels.
              </span>
            </div>

            {/* 4. Population Stability (15%) */}
            <div>
              <div className="flex items-center justify-between font-medium mb-1">
                <span className="text-slate-800 font-semibold">4. Population Stability</span>
                <span className="font-mono font-bold text-emerald-700">
                  {healthData?.population_stability_score || 76} / 100 <span className="text-slate-400 text-[10px]">(Weight: 15%)</span>
                </span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all duration-700"
                  style={{ width: `${healthData?.population_stability_score || 76}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                Inter-month variance of keystone indicator sighting frequency.
              </span>
            </div>

            {/* 5. Risk Indicators (15%) */}
            <div>
              <div className="flex items-center justify-between font-medium mb-1">
                <span className="text-slate-800 font-semibold">5. Threat & Risk Indicators (Inverse Penalty)</span>
                <span className="font-mono font-bold text-emerald-700">
                  {healthData?.risk_indicator_score || 68} / 100 <span className="text-slate-400 text-[10px]">(Weight: 15%)</span>
                </span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-rose-400 rounded-full transition-all duration-700"
                  style={{ width: `${healthData?.risk_indicator_score || 68}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                Deductions applied for active invasive weed spreads and habitat disturbances.
              </span>
            </div>
          </div>

          {/* Collapsible "How is this calculated?" Section */}
          {showFormulaDetails && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2 animate-fadeIn">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <Info className="h-4 w-4 text-emerald-600" />
                <span>How is the BioIntel Health Score Calculated?</span>
              </div>
              <p className="leading-relaxed">
                The score combines 5 standardized ecological factors into a single composite metric:
              </p>
              <div className="p-2.5 rounded-xl bg-white border border-slate-200 font-mono text-[11px] text-slate-800">
                Health Score = (0.30 × Diversity) + (0.20 × Native Ratio) + (0.20 × Habitat) + (0.15 × Stability) + (0.15 × Risk)
              </div>
              <p className="text-[11px] text-slate-500 italic">
                <strong>Important Notice:</strong> Labeled as <em>BioIntel Ecosystem Health Score — Prototype Indicator</em>.
                It is designed to track relative changes over time and does NOT represent an official government-certified ecological index.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Structured AI Insights Cards */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-emerald-600 text-white shadow-xs">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Explainable AI Insights Engine</h2>
            <p className="text-xs text-slate-500">
              Structured ecological hypotheses synthesized from observation streams, environmental sensors, and RAG knowledge
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {insights.map((ins, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase font-mono">
                    {ins.category || 'INSIGHT'}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      ins.confidence === 'High'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    Confidence: {ins.confidence}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-sm leading-tight">{ins.title}</h3>

                {/* Section 1: What we observed */}
                <div className="text-xs space-y-1">
                  <strong className="text-slate-800 block text-[11px] uppercase tracking-wider text-slate-500 font-mono">
                    What We Observed:
                  </strong>
                  <p className="text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    {ins.what_we_observed}
                  </p>
                </div>

                {/* Section 2: Evidence */}
                {ins.evidence && ins.evidence.length > 0 && (
                  <div className="text-xs space-y-1">
                    <strong className="text-slate-800 block text-[11px] uppercase tracking-wider text-slate-500 font-mono">
                      Evidence:
                    </strong>
                    <ul className="list-disc list-inside text-slate-600 space-y-0.5 pl-1">
                      {ins.evidence.map((ev, i) => (
                        <li key={i} className="text-[11px] leading-relaxed">{ev}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Section 3: What it may mean */}
                <div className="text-xs space-y-1">
                  <strong className="text-slate-800 block text-[11px] uppercase tracking-wider text-slate-500 font-mono">
                    What It May Mean:
                  </strong>
                  <p className="text-slate-600 leading-relaxed italic">
                    "{ins.what_it_may_mean}"
                  </p>
                </div>

                {/* Section 4: What we cannot conclude */}
                <div className="text-xs space-y-1 p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/80">
                  <strong className="text-amber-900 block text-[11px] uppercase tracking-wider font-mono">
                    What We Cannot Conclude:
                  </strong>
                  <p className="text-amber-800 text-[11px] leading-relaxed">
                    {ins.what_we_cannot_conclude}
                  </p>
                </div>
              </div>

              {/* Section 5: Recommended next step */}
              <div className="pt-3 border-t border-slate-100 text-xs">
                <strong className="text-emerald-900 block text-[11px] uppercase tracking-wider font-mono mb-1">
                  Recommended Next Step:
                </strong>
                <p className="text-slate-700 text-xs font-medium">
                  {ins.recommended_next_step}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
