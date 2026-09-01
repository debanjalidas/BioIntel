import React, { useState } from 'react';
import { FileText, Download, Printer, CheckCircle2, Sparkles, Calendar, MapPin } from 'lucide-react';
import { bioApi } from '../../services/api';

export default function ReportsView() {
  const [siteFocus, setSiteFocus] = useState('All Monitored Protected Areas');
  const [timeRange, setTimeRange] = useState('Last 30 Days');
  const [report, setReport] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    try {
      const res = await bioApi.generateReport({
        title: `BioIntel Biodiversity & Ecological Brief (${siteFocus})`,
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
    element.download = `BioIntel_Executive_Report_${Date.now()}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-teal-100 text-teal-700">
              <FileText className="h-5 w-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-900">Executive Intelligence Reports & Compliance Export</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Automated PDF/Markdown environmental compliance briefs, IUCN status summaries, and ML early warning forecasts
          </p>
        </div>

        {report && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
            >
              <Download className="h-4 w-4" /> Download Markdown
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50 transition-colors shadow-2xs"
            >
              <Printer className="h-4 w-4" /> Print
            </button>
          </div>
        )}
      </div>

      {/* Generator Control Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-wrap flex-1">
          <div className="space-y-1 min-w-[200px]">
            <label className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-slate-400" /> Target Biosphere Site
            </label>
            <select
              value={siteFocus}
              onChange={(e) => setSiteFocus(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-semibold focus:outline-emerald-500"
            >
              <option value="All Monitored Protected Areas">All Monitored Protected Areas</option>
              <option value="Sundarbans Mangrove Biosphere">Sundarbans Mangrove Biosphere</option>
              <option value="Kaziranga Floodplain Sanctuary">Kaziranga Floodplain Sanctuary</option>
              <option value="Western Ghats Rainforest Corridor">Western Ghats Rainforest Corridor</option>
              <option value="Jim Corbett Himalayan Foothills">Jim Corbett Foothills</option>
            </select>
          </div>

          <div className="space-y-1 min-w-[160px]">
            <label className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-slate-400" /> Time Horizon
            </label>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-semibold focus:outline-emerald-500"
            >
              <option value="Last 7 Days">Last 7 Days</option>
              <option value="Last 30 Days">Last 30 Days</option>
              <option value="Last Quarter (90 Days)">Last Quarter (90 Days)</option>
              <option value="Full Year 2025-2026">Full Year 2025-2026</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleGenerateReport}
          disabled={isGenerating}
          className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs transition-colors shadow-xs flex items-center gap-2"
        >
          <Sparkles className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
          {isGenerating ? 'Compiling Report...' : 'Generate Executive Report'}
        </button>
      </div>

      {/* Rendered Report Preview */}
      {report ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm prose prose-slate max-w-none text-slate-800 space-y-4">
          <pre className="whitespace-pre-wrap font-sans text-xs leading-relaxed bg-slate-50 p-6 rounded-xl border border-slate-200 font-medium">
            {report.content_markdown}
          </pre>
        </div>
      ) : (
        <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center text-slate-400 text-xs">
          Select target site and click <strong>"Generate Executive Report"</strong> to compile multi-modal intelligence brief.
        </div>
      )}
    </div>
  );
}
