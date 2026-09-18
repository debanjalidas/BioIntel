import React, { useState } from 'react';
import {
  Send,
  Sparkles,
  Bot,
  User,
  BookOpen,
  HelpCircle,
  ShieldCheck,
  AlertTriangle,
  Lightbulb,
  FileText,
} from 'lucide-react';
import { bioApi } from '../../services/api';

const SUGGESTED_QUERIES = [
  'Why is biodiversity declining?',
  'Which species should we monitor on campus?',
  'What can improve pollinator habitat?',
  'Explain the ecosystem health score.',
  'What are the major risks in Zone B?',
  'Why is this observation considered anomalous?',
];

export default function AiAssistantView() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: (
        "Hello! I am **BioIntel AI**, your conversational biodiversity intelligence assistant.\n\n"
        + "I synthesize campus observations, environmental telemetry, and peer-reviewed ecological literature under **UN SDG 15 (Life on Land)**.\n\n"
        + "To ensure scientific rigor and prevent hallucination, my answers strictly separate **[Observed Facts]**, **[Inferences]**, and **[Unknown Variables]** with verified citations."
      ),
      observed_facts: [
        "5 designated campus zones are currently monitored across avifauna, insects, flora, and wetlands.",
        "65+ species and 360+ observations are cataloged in the local database.",
      ],
      inferences: [
        "Continuous citizen science data provides an early warning buffer against habitat degradation.",
      ],
      unknowns: [
        "Long-term decadal microclimate impacts require multi-year continuous sensor collection.",
      ],
      citations: [
        { title: "Campus Biodiversity Framework & UN SDG 15 Alignment", source: "UNEP & 1M1B Initiative" },
      ],
    },
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isAsking, setIsAsking] = useState(false);

  const handleSendQuery = async (queryText) => {
    const q = queryText || inputQuery;
    if (!q.trim()) return;

    // Append user message
    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: q,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsAsking(true);

    try {
      const res = await bioApi.askAiAssistant(q);
      const aiMsg = {
        id: Date.now() + 1,
        sender: 'ai',
        text: res.answer,
        observed_facts: res.observed_facts || [],
        inferences: res.inferences || [],
        unknowns: res.unknowns || [],
        citations: res.citations || [],
        recommendations: res.recommendations || [],
        confidence: res.confidence || 'Moderate',
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
      const errorMsg = {
        id: Date.now() + 1,
        sender: 'ai',
        text: "I encountered an error retrieving data from the campus knowledge base. Please verify that the backend API is running.",
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsAsking(false);
    }
  };

  return (
    <div className="space-y-6 max-w-[1300px] mx-auto pb-12">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-600 text-white">
              <Bot className="h-5 w-5" />
            </span>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              BioIntel Conversational AI Assistant
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Grounded RAG architecture distinguishing between Observed Facts, Inferences, and Unknowns (Sections 20 & 21).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full font-bold">
            RAG Grounded • IBM Granite Compatible
          </span>
        </div>
      </div>

      {/* Suggested Query Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="font-semibold text-slate-400 shrink-0">Try Asking:</span>
        {SUGGESTED_QUERIES.map((sq, i) => (
          <button
            key={i}
            onClick={() => handleSendQuery(sq)}
            className="px-3 py-1.5 bg-white hover:bg-emerald-50 hover:border-emerald-300 border border-slate-200 rounded-xl text-slate-700 font-medium transition-all shrink-0 shadow-2xs"
          >
            {sq}
          </button>
        ))}
      </div>

      {/* Chat Transcript Area */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs min-h-[500px] flex flex-col justify-between space-y-6">
        <div className="space-y-6 overflow-y-auto max-h-[600px] pr-2">
          {messages.map((msg) => {
            const isAi = msg.sender === 'ai';
            return (
              <div
                key={msg.id}
                className={`flex items-start gap-3 text-xs leading-relaxed ${
                  isAi ? 'justify-start' : 'justify-end'
                }`}
              >
                {isAi && (
                  <div className="h-8 w-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    <Sparkles className="h-4 w-4" />
                  </div>
                )}

                <div
                  className={`max-w-2xl rounded-2xl p-4 shadow-2xs space-y-3 ${
                    isAi
                      ? 'bg-slate-50 border border-slate-200/80 text-slate-800'
                      : 'bg-emerald-600 text-white font-medium ml-auto'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>

                  {/* Mandatory Fact / Inference / Unknown Breakdown */}
                  {isAi && (msg.observed_facts?.length > 0 || msg.inferences?.length > 0 || msg.unknowns?.length > 0) && (
                    <div className="pt-2 border-t border-slate-200 space-y-2.5 text-[11.5px]">
                      {/* Observed Facts */}
                      {msg.observed_facts?.length > 0 && (
                        <div className="p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-200/80">
                          <strong className="text-emerald-900 block font-mono uppercase tracking-wider text-[10px] mb-1">
                            ✓ [Observed Fact]
                          </strong>
                          <ul className="list-disc list-inside text-emerald-800 space-y-0.5">
                            {msg.observed_facts.map((fact, idx) => (
                              <li key={idx}>{fact}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Scientific Inferences */}
                      {msg.inferences?.length > 0 && (
                        <div className="p-2.5 rounded-xl bg-sky-50/80 border border-sky-200/80">
                          <strong className="text-sky-900 block font-mono uppercase tracking-wider text-[10px] mb-1">
                            ℹ [Scientific Inference]
                          </strong>
                          <ul className="list-disc list-inside text-sky-800 space-y-0.5">
                            {msg.inferences.map((inf, idx) => (
                              <li key={idx}>{inf}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Unknown Variables */}
                      {msg.unknowns?.length > 0 && (
                        <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/80">
                          <strong className="text-amber-900 block font-mono uppercase tracking-wider text-[10px] mb-1">
                            ⚠ [Unknown / Insufficient Evidence]
                          </strong>
                          <ul className="list-disc list-inside text-amber-800 space-y-0.5">
                            {msg.unknowns.map((unk, idx) => (
                              <li key={idx}>{unk}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Citations Grounding */}
                      {msg.citations?.length > 0 && (
                        <div className="pt-1 text-[10px] text-slate-500 flex flex-wrap items-center gap-2">
                          <span className="font-semibold text-slate-400">Sources:</span>
                          {msg.citations.map((c, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded-md bg-white border border-slate-200 font-mono text-slate-600"
                            >
                              {c.title} ({c.source})
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {!isAi && (
                  <div className="h-8 w-8 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isAsking && (
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <div className="h-8 w-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center animate-pulse">
                <Sparkles className="h-4 w-4" />
              </div>
              <span>Searching knowledge base and formulating grounded response...</span>
            </div>
          )}
        </div>

        {/* Query Input Box */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendQuery();
          }}
          className="flex items-center gap-3 pt-4 border-t border-slate-100"
        >
          <input
            type="text"
            placeholder="Ask anything about campus biodiversity, species trends, or habitat management..."
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            disabled={isAsking}
            className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 font-medium focus:outline-emerald-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isAsking || !inputQuery.trim()}
            className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-2xl transition-all shadow-sm flex items-center gap-2 disabled:opacity-40"
          >
            <Send className="h-4 w-4" />
            <span>Ask AI</span>
          </button>
        </form>
      </div>
    </div>
  );
}
