import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  FileText,
  Upload,
  AlertCircle,
  Search,
  Filter,
  Eye,
  RefreshCw,
  Sparkles,
  BookOpen,
  CameraOff,
} from 'lucide-react';
import { bioApi } from '../../services/api';

export default function AdminVerificationView() {
  const [queue, setQueue] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedObs, setSelectedObs] = useState(null);
  const [actionNotes, setActionNotes] = useState('');
  const [activeTab, setActiveTab] = useState('queue'); // 'queue' | 'rag_docs'

  // RAG doc creation form state
  const [newDoc, setNewDoc] = useState({
    title: '',
    category: 'Ecology Manual',
    content: '',
    source_url: '',
  });
  const [ragDocs, setRagDocs] = useState([]);
  const [isSubmittingDoc, setIsSubmittingDoc] = useState(false);
  const [docFeedback, setDocFeedback] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [queueRes, statsRes, docsRes] = await Promise.all([
        bioApi.getVerificationQueue(),
        bioApi.getAdminStats(),
        bioApi.getRagDocuments(),
      ]);
      setQueue(queueRes?.items || []);
      setStats(statsRes || null);
      setRagDocs(docsRes?.items || []);
    } catch (err) {
      console.warn('Failed to load admin verification data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (obsId) => {
    try {
      await bioApi.verifyObservation(obsId, actionNotes || 'Verified by campus ecologist peer review');
      // Update local state
      setQueue((prev) => prev.filter((item) => item.id !== obsId));
      if (stats) {
        setStats({
          ...stats,
          pending_count: Math.max(0, stats.pending_count - 1),
          verified_count: (stats.verified_count || 0) + 1,
        });
      }
      setSelectedObs(null);
      setActionNotes('');
    } catch (err) {
      console.error('Failed to verify observation:', err);
      alert('Error verifying observation. Please try again.');
    }
  };

  const handleReject = async (obsId) => {
    const reason = actionNotes || prompt('Reason for rejection (e.g. Unclear morphology, duplicate record):');
    if (!reason) return;
    try {
      await bioApi.rejectObservation(obsId, reason);
      setQueue((prev) => prev.filter((item) => item.id !== obsId));
      if (stats) {
        setStats({
          ...stats,
          pending_count: Math.max(0, stats.pending_count - 1),
          rejected_count: (stats.rejected_count || 0) + 1,
        });
      }
      setSelectedObs(null);
      setActionNotes('');
    } catch (err) {
      console.error('Failed to reject observation:', err);
      alert('Error rejecting observation. Please try again.');
    }
  };

  const handleAddDoc = async (e) => {
    e.preventDefault();
    if (!newDoc.title || !newDoc.content) {
      alert('Please provide at least a Title and Content');
      return;
    }
    setIsSubmittingDoc(true);
    try {
      const res = await bioApi.addRagDocument(newDoc);
      setRagDocs((prev) => [res, ...prev]);
      setDocFeedback('Document successfully indexed into RAG vector knowledge base!');
      setNewDoc({ title: '', category: 'Ecology Manual', content: '', source_url: '' });
      setTimeout(() => setDocFeedback(null), 4000);
    } catch (err) {
      console.error('Error adding RAG document:', err);
      alert('Failed to upload document.');
    } finally {
      setIsSubmittingDoc(false);
    }
  };

  const filteredQueue = queue.filter((item) => {
    const matchesCategory =
      filterCategory === 'ALL' ||
      (item.species?.category || '').toLowerCase() === filterCategory.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      (item.species?.common_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.location_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.user?.name || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700 font-bold">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-900">
              Admin & Peer Verification Console
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Review community citizen science observations, calibrate AI classifications, and curate the RAG knowledge corpus.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('queue')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'queue'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            Review Queue ({queue.length})
          </button>
          <button
            onClick={() => setActiveTab('rag_docs')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'rag_docs'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            RAG Knowledge Base ({ragDocs.length})
          </button>
          <button
            onClick={loadData}
            className="p-2 bg-white border border-slate-200 text-slate-600 hover:text-slate-900 rounded-xl transition-colors shadow-2xs"
            title="Refresh"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Pending Review</span>
            <Clock className="h-4 w-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono">
            {stats ? stats.pending_count : queue.length}
          </div>
          <span className="text-[10px] text-amber-600 font-medium">Requires peer signoff</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Research Grade</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono">
            {stats ? stats.verified_count : 320}
          </div>
          <span className="text-[10px] text-emerald-600 font-medium">Validated observations</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Flagged / Rejected</span>
            <XCircle className="h-4 w-4 text-rose-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono">
            {stats ? stats.rejected_count : 12}
          </div>
          <span className="text-[10px] text-rose-600 font-medium">Blurry / unidentifiable</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Knowledge Corpus</span>
            <BookOpen className="h-4 w-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono">
            {ragDocs.length}
          </div>
          <span className="text-[10px] text-indigo-600 font-medium">RAG grounded sources</span>
        </div>
      </div>

      {/* TAB 1: VERIFICATION QUEUE */}
      {activeTab === 'queue' && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter by species, zone, or observer..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-emerald-500"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto">
              <span className="text-xs font-semibold text-slate-500 shrink-0">Taxa:</span>
              {['ALL', 'BIRDS', 'BUTTERFLIES', 'PLANTS', 'INSECTS', 'REPTILES'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all shrink-0 ${
                    filterCategory === cat
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Queue Items */}
          {filteredQueue.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
              <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto mb-2" />
              <h3 className="font-bold text-slate-800 text-base">Review Queue Clear!</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                No pending observations match your current filter. All citizen sightings have been vetted.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredQueue.map((item) => {
                const confPercent = Math.round(
                  (item.ai_confidence <= 1.0 ? item.ai_confidence * 100 : item.ai_confidence) || 75
                );
                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between hover:shadow-md transition-all"
                  >
                    <div>
                      {/* Image Thumbnail */}
                      <div className="h-44 w-full rounded-xl overflow-hidden bg-slate-100 mb-3 relative">
                        {item.image_url ? (
                          <img
                            src={item.image_url}
                            alt={item.species?.common_name || 'Observation'}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 text-xs">
                            <CameraOff className="h-6 w-6 mb-1 text-slate-300" />
                            <span>No Photo Attached</span>
                          </div>
                        )}
                        <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-black/60 text-white font-mono text-[10px] font-bold backdrop-blur-xs">
                          {confPercent}% AI Match
                        </span>
                      </div>

                      {/* Details */}
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          {item.species?.category || 'Wildlife'}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          ID #{item.id}
                        </span>
                      </div>

                      <h3 className="font-bold text-slate-900 text-sm leading-snug">
                        {item.species?.common_name || 'Unknown Candidate'}
                      </h3>
                      <p className="text-xs text-slate-400 italic font-mono mb-2">
                        {item.species?.scientific_name || 'N/A'}
                      </p>

                      <div className="space-y-1 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                        <div><span className="font-medium text-slate-400">Zone:</span> {item.location_name}</div>
                        <div><span className="font-medium text-slate-400">Habitat:</span> {item.habitat || 'Campus Forest'}</div>
                        <div><span className="font-medium text-slate-400">Observer:</span> {item.user?.name || 'Citizen Contributor'}</div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-3 mt-3 border-t border-slate-100 flex items-center gap-2">
                      <button
                        onClick={() => handleVerify(item.id)}
                        className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors shadow-xs flex items-center justify-center gap-1.5"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" /> Verify
                      </button>
                      <button
                        onClick={() => handleReject(item.id)}
                        className="py-2 px-3 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1"
                      >
                        <XCircle className="h-3.5 w-3.5" /> Reject
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: RAG KNOWLEDGE CORPUS MANAGEMENT */}
      {activeTab === 'rag_docs' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Ingest New Document Form */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-indigo-100 text-indigo-700 font-bold">
                <Upload className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Add RAG Reference Document</h3>
                <p className="text-[11px] text-slate-500">
                  Ingest scientific manuals, flora surveys, and conservation protocols.
                </p>
              </div>
            </div>

            {docFeedback && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                {docFeedback}
              </div>
            )}

            <form onSubmit={handleAddDoc} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Document Title</label>
                <input
                  type="text"
                  required
                  value={newDoc.title}
                  onChange={(e) => setNewDoc({ ...newDoc, title: e.target.value })}
                  placeholder="e.g., Campus Avifauna Nesting Survey (2024)"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-emerald-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Category</label>
                <select
                  value={newDoc.category}
                  onChange={(e) => setNewDoc({ ...newDoc, category: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-emerald-500"
                >
                  <option value="Ecology Manual">Ecology Manual</option>
                  <option value="Scientific Literature">Scientific Literature</option>
                  <option value="Campus Biodiversity Survey">Campus Biodiversity Survey</option>
                  <option value="Restoration Protocol">Restoration Protocol</option>
                  <option value="IUCN Status Report">IUCN Status Report</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Source / Citation</label>
                <input
                  type="text"
                  value={newDoc.source_url}
                  onChange={(e) => setNewDoc({ ...newDoc, source_url: e.target.value })}
                  placeholder="e.g., Dept. of Environmental Science, Technical Report #14"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-emerald-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Content / Excerpt</label>
                <textarea
                  rows={6}
                  required
                  value={newDoc.content}
                  onChange={(e) => setNewDoc({ ...newDoc, content: e.target.value })}
                  placeholder="Paste reference text, empirical observations, or restoration recommendations that the RAG assistant should cite..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-emerald-500 leading-relaxed font-sans"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingDoc}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2"
              >
                <Sparkles className="h-4 w-4" />
                {isSubmittingDoc ? 'Vectorizing Document...' : 'Index Into RAG Assistant'}
              </button>
            </form>
          </div>

          {/* Currently Indexed Documents List */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Indexed Reference Documents</h3>
                <p className="text-[11px] text-slate-500">
                  Grounded evidence corpus used for [Observed Fact] citations in AI chat.
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md">
                {ragDocs.length} Documents Active
              </span>
            </div>

            <div className="max-h-[550px] overflow-y-auto space-y-2.5 pr-1">
              {ragDocs.map((doc) => (
                <div
                  key={doc.id}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-indigo-300 transition-all text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-indigo-800 bg-indigo-100/70 px-2 py-0.5 rounded">
                      {doc.category || 'Reference Document'}
                    </span>
                    <span className="font-mono text-[10px] text-slate-400">
                      ID #{doc.id}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">{doc.title}</h4>
                  <p className="text-slate-600 line-clamp-3 leading-relaxed">
                    {doc.content}
                  </p>
                  {doc.source_url && (
                    <div className="text-[10px] text-slate-400 font-mono pt-1">
                      Source: {doc.source_url}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
