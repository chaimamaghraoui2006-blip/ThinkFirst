import React, { useState } from 'react';
import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  ListOrdered,
  Lightbulb,
  CheckSquare,
  ArrowRight,
  Code2,
  FileText,
  AlertCircle,
  Copy,
  Check,
  Globe,
} from 'lucide-react';
import { ProblemExplanation, Language } from '../types';

interface ProblemExplanationViewProps {
  originalStatement: string;
  explanation: ProblemExplanation;
  onOpenWorkspace: () => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  isLoadingNewLanguage?: boolean;
}

export const ProblemExplanationView: React.FC<ProblemExplanationViewProps> = ({
  originalStatement,
  explanation,
  onOpenWorkspace,
  language,
  onLanguageChange,
  isLoadingNewLanguage = false,
}) => {
  const [statementExpanded, setStatementExpanded] = useState(false);
  const [copiedOriginal, setCopiedOriginal] = useState(false);

  // Self-assessment checklist states
  const [checklist, setChecklist] = useState({
    understandsGiven: false,
    understandsOutput: false,
    understandsTerms: false,
    understandsConstraints: false,
  });

  const isRTL = language === 'ar';

  const handleCopyOriginal = () => {
    navigator.clipboard.writeText(originalStatement);
    setCopiedOriginal(true);
    setTimeout(() => setCopiedOriginal(false), 2000);
  };

  return (
    <div className={`max-w-4xl mx-auto space-y-8 py-6 ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header with Title and Language Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 text-sky-400 text-xs font-mono mb-2 border border-sky-500/20">
            <BookOpen className="w-3.5 h-3.5" />
            <span>PHASE 1: UNDERSTAND</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Problem Understanding & Requirements
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Carefully review what the challenge requires. The algorithm and code are entirely yours to invent.
          </p>
        </div>

        {/* Change explanation language */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl self-start sm:self-center">
          <Globe className="w-4 h-4 text-slate-400" />
          <span className="text-xs text-slate-400">Language:</span>
          <select
            value={language}
            onChange={(e) => onLanguageChange(e.target.value as Language)}
            disabled={isLoadingNewLanguage}
            className="bg-transparent text-xs text-sky-400 font-medium focus:outline-none cursor-pointer"
          >
            <option value="en" className="bg-slate-900 text-slate-100">
              English
            </option>
            <option value="fr" className="bg-slate-900 text-slate-100">
              Français
            </option>
            <option value="ar" className="bg-slate-900 text-slate-100">
              العربية
            </option>
          </select>
        </div>
      </div>

      {/* SECTION 1: THE ORIGINAL STATEMENT (Collapsible) */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden transition-all">
        <div
          onClick={() => setStatementExpanded(!statementExpanded)}
          className="flex items-center justify-between p-4 sm:p-5 bg-slate-900/90 cursor-pointer hover:bg-slate-850 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <FileText className="w-4 h-4 text-sky-400" />
            <h2 className="text-sm font-bold text-slate-200">
              Section 1: Original Problem Statement
            </h2>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
              {statementExpanded ? 'Click to collapse' : 'Click to expand'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCopyOriginal();
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-xs flex items-center gap-1"
              title="Copy original statement"
            >
              {copiedOriginal ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline text-[11px]">Copy</span>
            </button>
            {statementExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </div>
        </div>

        {statementExpanded && (
          <div className="p-5 border-t border-slate-800/80 bg-slate-950 font-mono text-xs sm:text-sm text-slate-300 whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto">
            {originalStatement}
          </div>
        )}
      </section>

      {/* SECTION 2: SIMPLE EXPLANATION */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3">
          <HelpCircle className="w-4 h-4 text-sky-400" />
          <h2 className="text-base font-bold text-white font-sans">
            Section 2: Plain Language Explanation
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
          {/* What is given */}
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/80 space-y-1.5">
            <span className="text-sky-400 font-semibold font-mono text-xs block uppercase tracking-wider">
              1. What Information is Given?
            </span>
            <p className="text-slate-300 leading-relaxed font-sans">
              {explanation.simpleExplanation.whatIsGiven}
            </p>
          </div>

          {/* What is asked */}
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/80 space-y-1.5">
            <span className="text-emerald-400 font-semibold font-mono text-xs block uppercase tracking-wider">
              2. What Are You Asked to Determine?
            </span>
            <p className="text-slate-300 leading-relaxed font-sans">
              {explanation.simpleExplanation.whatIsAsked}
            </p>
          </div>

          {/* Output representation */}
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/80 space-y-1.5">
            <span className="text-violet-400 font-semibold font-mono text-xs block uppercase tracking-wider">
              3. What Must the Final Output Represent?
            </span>
            <p className="text-slate-300 leading-relaxed font-sans">
              {explanation.simpleExplanation.outputRepresentation}
            </p>
          </div>

          {/* Stated conditions */}
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/80 space-y-1.5">
            <span className="text-amber-400 font-semibold font-mono text-xs block uppercase tracking-wider">
              4. Stated Conditions & Constraints
            </span>
            <p className="text-slate-300 leading-relaxed font-sans">
              {explanation.simpleExplanation.conditionsAndConstraintsSummary}
            </p>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 text-[11px] text-slate-400 flex items-center gap-2">
          <AlertCircle className="w-3.5 h-3.5 text-sky-400 shrink-0" />
          <span>Notice: This breakdown describes the question itself. No algorithms or data structures are proposed.</span>
        </div>
      </section>

      {/* SECTION 3: KEY TERMS */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3">
          <BookOpen className="w-4 h-4 text-indigo-400" />
          <h2 className="text-base font-bold text-white font-sans">
            Section 3: Key Terminology & Concepts
          </h2>
        </div>

        <p className="text-xs text-slate-400">
          Conceptual, neutral definitions of terminology used in the problem statement.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {explanation.keyTerms.map((term, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl border border-slate-800/90 bg-slate-900/90 space-y-1 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-sky-300 bg-sky-950/60 px-2 py-0.5 rounded border border-sky-800/50">
                  {term.term}
                </span>
                {term.originalTerm && term.originalTerm !== term.term && (
                  <span className="text-[11px] font-mono text-slate-400">
                    ({term.originalTerm})
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans pt-1">
                {term.definition}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 4: INPUT, OUTPUT AND CONSTRAINTS */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3">
          <ListOrdered className="w-4 h-4 text-sky-400" />
          <h2 className="text-base font-bold text-white font-sans">
            Section 4: Input, Output & Constraints
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/80 space-y-2">
            <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider block">
              Input Format:
            </span>
            <p className="text-xs text-slate-300 font-mono bg-slate-950 p-2.5 rounded-lg border border-slate-800/80 leading-relaxed whitespace-pre-wrap">
              {explanation.structuredSpecs.inputFormat}
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/80 space-y-2">
            <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider block">
              Expected Output Format:
            </span>
            <p className="text-xs text-slate-300 font-mono bg-slate-950 p-2.5 rounded-lg border border-slate-800/80 leading-relaxed whitespace-pre-wrap">
              {explanation.structuredSpecs.expectedOutput}
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/80 space-y-2">
            <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider block">
              Constraints:
            </span>
            <ul className="space-y-1.5">
              {explanation.structuredSpecs.constraints.map((constraint, idx) => (
                <li
                  key={idx}
                  className="text-xs text-slate-300 font-mono bg-slate-950 px-2.5 py-1.5 rounded border border-slate-800/80 flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0" />
                  <span>{constraint}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/80 space-y-2">
            <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider block">
              Important Conditions:
            </span>
            <ul className="space-y-1.5">
              {explanation.structuredSpecs.importantConditions.map((condition, idx) => (
                <li
                  key={idx}
                  className="text-xs text-slate-300 font-mono bg-slate-950 px-2.5 py-1.5 rounded border border-slate-800/80 flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                  <span>{condition}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* SECTION 5: A SMALL TEACHING EXAMPLE */}
      <section className="rounded-2xl border-2 border-indigo-500/30 bg-gradient-to-b from-indigo-950/20 to-slate-900/60 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-indigo-500/20 pb-3">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base font-bold text-white font-sans">
              Section 5: Conceptual Learning Example
            </h2>
          </div>

          <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-[11px] font-mono border border-indigo-500/30 font-medium">
            Learning Example — Not the Solution
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed font-sans">
          This small example illustrates the underlying concept in a different situation so you can grasp the fundamental behavior without having your actual challenge solved.
        </p>

        <div className="rounded-xl border border-indigo-500/20 bg-slate-950 p-4 space-y-3">
          <h4 className="text-sm font-bold text-indigo-300 font-mono">
            {explanation.teachingExample.title}
          </h4>

          <div className="space-y-2 text-xs">
            <div>
              <span className="text-slate-400 font-mono font-semibold block text-[11px] uppercase">
                Situation:
              </span>
              <p className="text-slate-200 font-sans mt-0.5 leading-relaxed">
                {explanation.teachingExample.situation}
              </p>
            </div>

            <div>
              <span className="text-slate-400 font-mono font-semibold block text-[11px] uppercase">
                Observable Result:
              </span>
              <p className="text-emerald-300 font-mono mt-0.5 bg-emerald-950/30 border border-emerald-800/40 px-2.5 py-1.5 rounded">
                {explanation.teachingExample.observableResult}
              </p>
            </div>

            <div>
              <span className="text-slate-400 font-mono font-semibold block text-[11px] uppercase">
                Conceptual Explanation (Why):
              </span>
              <p className="text-slate-300 font-sans mt-0.5 leading-relaxed">
                {explanation.teachingExample.conceptualWhy}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: READY TO WORK? CHECKLIST */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-5">
        <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3">
          <CheckSquare className="w-4 h-4 text-sky-400" />
          <h2 className="text-base font-bold text-white font-sans">
            Section 6: Ready to Work? (Self-Assessment Checklist)
          </h2>
        </div>

        <p className="text-xs text-slate-400">
          Take a moment to self-assess your comprehension. Checking these boxes is optional and purely for your own confidence before you begin writing your approach.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-800 bg-slate-950 cursor-pointer hover:border-slate-700 transition-colors">
            <input
              type="checkbox"
              checked={checklist.understandsGiven}
              onChange={(e) =>
                setChecklist({ ...checklist, understandsGiven: e.target.checked })
              }
              className="w-4 h-4 rounded text-sky-500 focus:ring-sky-500 bg-slate-900 border-slate-700 cursor-pointer"
            />
            <span className="text-slate-300">I understand what information the problem gives me.</span>
          </label>

          <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-800 bg-slate-950 cursor-pointer hover:border-slate-700 transition-colors">
            <input
              type="checkbox"
              checked={checklist.understandsOutput}
              onChange={(e) =>
                setChecklist({ ...checklist, understandsOutput: e.target.checked })
              }
              className="w-4 h-4 rounded text-sky-500 focus:ring-sky-500 bg-slate-900 border-slate-700 cursor-pointer"
            />
            <span className="text-slate-300">I understand what I must produce.</span>
          </label>

          <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-800 bg-slate-950 cursor-pointer hover:border-slate-700 transition-colors">
            <input
              type="checkbox"
              checked={checklist.understandsTerms}
              onChange={(e) =>
                setChecklist({ ...checklist, understandsTerms: e.target.checked })
              }
              className="w-4 h-4 rounded text-sky-500 focus:ring-sky-500 bg-slate-900 border-slate-700 cursor-pointer"
            />
            <span className="text-slate-300">I understand the relevant terminology.</span>
          </label>

          <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-800 bg-slate-950 cursor-pointer hover:border-slate-700 transition-colors">
            <input
              type="checkbox"
              checked={checklist.understandsConstraints}
              onChange={(e) =>
                setChecklist({ ...checklist, understandsConstraints: e.target.checked })
              }
              className="w-4 h-4 rounded text-sky-500 focus:ring-sky-500 bg-slate-900 border-slate-700 cursor-pointer"
            />
            <span className="text-slate-300">I understand the stated constraints.</span>
          </label>
        </div>

        {/* Action Button: Open Workspace */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-400">
            {Object.values(checklist).filter(Boolean).length} of 4 items self-assessed.
          </p>

          <button
            onClick={onOpenWorkspace}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-sm transition-all shadow-[0_0_20px_rgba(56,189,248,0.3)] cursor-pointer"
          >
            <Code2 className="w-4 h-4" />
            <span>Open My Workspace</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};
