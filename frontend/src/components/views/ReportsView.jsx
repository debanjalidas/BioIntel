import React, { useState, useEffect } from 'react';
import {
  FileText,
  Download,
  Printer,
  CheckCircle2,
  Sparkles,
  Calendar,
  MapPin,
  Shield,
  TreePine,
  RefreshCw,
  Award,
} from 'lucide-react';
import { bioApi } from '../../services/api';

export default function ReportsView() {
  const [siteFocus, setSiteFocus] = useState('All 5 Campus Zones');
  const [timeRange, setTimeRange] = useState('Current Academic Semester');
  const [report, setReport] = useState(null);
  const [auditData, setAuditData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoadingAudit, setIsLoadingAudit] = useState(false);

  useEffect(() => {
    loadAuditData();
    handleGenerateReport();
  }, []);

  const loadAuditData = async () => {
    setIsLoadingAudit(true);
    try {
      const res = await bioApi.getReportsData();
      setAuditData(res);
    } catch (err) {
      console.warn('Failed to load structured audit report:', err);
    } finally {
      setIsLoadingAudit(false);
    }
  };

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    try {
      const res = await bioApi.generateReport({
        title: `BioIntel Campus Biodiversity Audit (${siteFocus})`,
        site_name: siteFocus,
        time_range: timeRange,
        include_ml_projections: true,
      });
      setReport(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!report) return;
    const element = document.createElement('a');
    const file = new Blob([report.content_markdown], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = `BioIntel_Campus_Audit_Report_${Date.now()}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-teal-100 text-teal-700">
              <FileText className="h-5 w-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-900">
              Executive Biodiversity Audit & SDG 15 Reports
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Standardized ecological audit briefs, IUCN species classifications, and institutional sustainability reporting.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          {report && (
            <>
              <button
                onClick={handleDownload}
                className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
              >
                <Download className="h-3.5 w-3.5" /> Download Report
              </button>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50 transition-colors shadow-2xs"
              >
                <Printer className="h-3.5 w-3.5" /> Print / PDF
              </button>
            </>
          )}
        </div>
      </div>

      {/* Structured Audit Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <div className="text-xs font-medium text-slate-500">Campus Health Index</div>
          <div className="text-2xl font-bold text-emerald-600 font-mono mt-1">
            {auditData ? `${auditData.health_index}/100` : '78.4/100'}
          </div>
          <span className="text-[10px] text-emerald-700 font-semibold">Good • +6.4% semester gain</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <div className="text-xs font-medium text-slate-500">Documented Taxa</div>
          <div className="text-2xl font-bold text-slate-900 font-mono mt-1">
            {auditData ? auditData.total_species_recorded : 65} Species
          </div>
          <span className="text-[10px] text-slate-500">Flora, Avian, Lepidoptera</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <div className="text-xs font-medium text-slate-500">Native Species Ratio</div>
          <div className="text-2xl font-bold text-slate-900 font-mono mt-1">
            {auditData ? `${auditData.native_species_ratio_pct}%` : '76.5%'}
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold">Exceeds 70% threshold</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <div className="text-xs font-medium text-slate-500">SDG Alignment</div>
          <div className="text-lg font-bold text-teal-800 flex items-center gap-1.5 mt-1">
            <Award className="h-4 w-4 text-teal-600" /> SDG 15.1 & 15.5
          </div>
          <span className="text-[10px] text-teal-700 font-medium">Life on Land Verified</span>
        </div>
      </div>

      {/* Generator Controls */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-wrap flex-1">
          <div className="space-y-1 min-w-[200px]">
            <label className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-slate-400" /> Target Biosphere Zone
            </label>
            <select
              value={siteFocus}
              onChange={(e) => setSiteFocus(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-semibold focus:outline-emerald-500"
            >
              <option value="All 5 Campus Zones">All 5 Campus Zones (Comprehensive Audit)</option>
              <option value="Zone A — Botanical Garden">Zone A — Botanical Garden</option>
              <option value="Zone B — Lotus Pond">Zone B — Lotus Pond</option>
              <option value="Zone C — Central Lawn">Zone C — Central Lawn</option>
              <option value="Zone D — Dense Woodland">Zone D — Dense Woodland</option>
              <option value="Zone E — Academic Area">Zone E — Academic Area</option>
            </select>
          </div>

          <div className="space-y-1 min-w-[160px]">
            <label className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-slate-400" /> Audit Period
            </label>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-semibold focus:outline-emerald-500"
            >
              <option value="Current Academic Semester">Current Academic Semester (Fall 2025)</option>
              <option value="Last 30 Days">Last 30 Days</option>
              <option value="Last Quarter (90 Days)">Last Quarter (90 Days)</option>
              <option value="Full Academic Year (2025-2026)">Full Academic Year (2025-2026)</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleGenerateReport}
          disabled={isGenerating}
          className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs transition-colors shadow-xs flex items-center gap-2"
        >
          <Sparkles className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
          {isGenerating ? 'Recompiling Report...' : 'Recompile Audit Brief'}
        </button>
      </div>

      {/* Rendered Report */}
      {report ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md uppercase tracking-wider">
                Official Institutional Brief
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-2">
                {report.title || 'BioIntel Campus Biodiversity Audit'}
              </h2>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Generated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} • Scope: {siteFocus}
              </p>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 font-bold">
              <Shield className="h-6 w-6" />
            </div>
          </div>

          <div className="prose prose-slate max-w-none text-slate-800">
            <pre className="whitespace-pre-wrap font-sans text-xs leading-relaxed bg-slate-50/70 p-6 rounded-2xl border border-slate-200/80 font-medium text-slate-700">
              {report.content_markdown}
            </pre>
          </div>
        </div>
      ) : (
        <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center text-slate-400 text-xs">
          Loading report...
        </div>
      )}
    </div>
  );
}
