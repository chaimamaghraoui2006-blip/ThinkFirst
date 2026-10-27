import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  HelpCircle,
  AlertOctagon,
  ArrowLeft,
  Clock,
  History,
  Code2,
  FileText,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { ReviewResult } from '../types';

interface AttemptReviewViewProps {
  currentReview: ReviewResult;
  history: ReviewResult[];
  onReturnToWorkspace: () => void;
}

export const AttemptReviewView: React.FC<AttemptReviewViewProps> = ({
  currentReview,
  history,
  onReturnToWorkspace,
}) => {
  const [selectedReviewId, setSelectedReviewId] = useState(currentReview.id);

  const activeReview = history.find((r) => r.id === selectedReviewId) || currentReview;

  const getStatusBadge = (status: ReviewResult['status']) => {
    switch (status) {
      case 'potential_issues_detected':
        return {
          icon: <ShieldAlert className="w-5 h-5 text-amber-400" />,
          title: 'Potential Issue Detected',
          bgColor: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
        };
      case 'no_obvious_issue':
        return {
          icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
          title: 'No Obvious Issue Detected',
          bgColor: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300',
        };
      case 'unable_to_evaluate':
      default:
        return {
          icon: <AlertOctagon className="w-5 h-5 text-slate-400" />,
          title: 'Unable to Evaluate Reliably',
          bgColor: 'bg-slate-800 border-slate-700 text-slate-300',
        };
    }
  };

  const statusConfig = getStatusBadge(activeReview.status);

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6">
      {/* Return Action & History Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <button
          onClick={onReturnToWorkspace}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-sky-400" />
          <span>Return to Workspace and Revise</span>
        </button>

        {/* History of attempts */}
        {history.length > 1 && (
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            <span className="text-xs text-slate-500 flex items-center gap-1 mr-1">
              <History className="w-3.5 h-3.5" />
              Attempts:
            </span>
            {history.map((rev, idx) => (
              <button
                key={rev.id}
                onClick={() => setSelectedReviewId(rev.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
                  rev.id === activeReview.id
                    ? 'bg-sky-500 text-slate-950 font-bold'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                #{idx + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Review Status Header */}
      <section className={`rounded-2xl border p-6 space-y-4 ${statusConfig.bgColor}`}>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3">
            {statusConfig.icon}
            <div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400 block">
                Attempt #{activeReview.attemptNumber} Report
              </span>
              <h1 className="text-xl sm:text-2xl font-extrabold text-white">
                {statusConfig.title}
              </h1>
            </div>
          </div>

          <div className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>{new Date(activeReview.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
          {activeReview.disclaimer}
        </p>
      </section>

      {/* Identified Issues List — Line References & Verbatim Student Text */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <h2 className="text-sm font-bold font-mono text-white uppercase tracking-wider flex items-center gap-2">
            <Code2 className="w-4 h-4 text-sky-400" />
            Identified Line References
          </h2>
          <span className="text-xs text-slate-400 font-mono">
            {activeReview.issues.length} flagged line(s)
          </span>
        </div>

        {activeReview.issues.length === 0 ? (
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-8 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <h3 className="text-sm font-semibold text-slate-200">
              No Specific Lines Flagged
            </h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              No obvious syntax, type, boundary, or requirement violations were detected on specific lines. You can test additional cases or proceed with your reasoning.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {activeReview.issues.map((issue, idx) => {
              const lineLabel =
                issue.lineStart === issue.lineEnd
                  ? `Line ${issue.lineStart}`
                  : `Lines ${issue.lineStart}–${issue.lineEnd}`;

              return (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-800 bg-slate-900/80 overflow-hidden shadow-lg space-y-3 p-4 sm:p-5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-amber-300 bg-amber-950/60 border border-amber-800/60 px-2.5 py-0.5 rounded">
                        {lineLabel} — Potential issue detected
                      </span>
                    </div>

                    <span className="text-xs font-mono font-medium px-2.5 py-0.5 rounded bg-slate-800 text-sky-300 border border-slate-700 self-start sm:self-center">
                      Category: {issue.category}
                    </span>
                  </div>

                  {/* Verbatim Original Line — Unchanged */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                      Original Submitted Line(s) [Unchanged]:
                    </span>
                    <div className="rounded-lg bg-[#070b13] border border-slate-800 p-3 font-mono text-xs sm:text-sm text-slate-200 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                      {issue.originalText}
                    </div>
                  </div>

                  {/* Anti-hint notice */}
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 font-sans">
                    <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>No corrected line or guidance is provided to preserve your cognitive independence.</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Mandatory Closing Message Box */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 space-y-3">
        <h3 className="text-xs font-mono font-bold text-sky-400 uppercase tracking-wider">
          Review Status Summary
        </h3>
        <p className="text-sm text-slate-200 leading-relaxed font-sans">
          &ldquo;{activeReview.closingMessage}&rdquo;
        </p>

        <div className="pt-3">
          <button
            onClick={onReturnToWorkspace}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-[0_0_15px_rgba(56,189,248,0.25)] cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to My Workspace and Revise</span>
          </button>
        </div>
      </section>
    </div>
  );
};
