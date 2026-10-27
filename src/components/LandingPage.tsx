import React from 'react';
import {
  BookOpen,
  Code2,
  CheckCircle,
  ShieldAlert,
  ArrowRight,
  Terminal,
  Zap,
  Sparkles,
  Lock,
  Layers,
  HelpCircle,
  FileCode,
} from 'lucide-react';
import { SAMPLE_PROBLEMS, SampleProblem } from '../data/sampleProblems';

interface LandingPageProps {
  onUnderstandClick: () => void;
  onWorkspaceClick: () => void;
  onSelectSampleProblem: (sample: SampleProblem) => void;
  hasExistingDraft: boolean;
  onOpenAbout: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onUnderstandClick,
  onWorkspaceClick,
  onSelectSampleProblem,
  hasExistingDraft,
  onOpenAbout,
}) => {
  return (
    <div className="space-y-16 py-8 md:py-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-800/80 bg-gradient-to-b from-slate-900/90 via-slate-950 to-[#0b0f19] p-8 md:p-14 text-center shadow-2xl">
        {/* Glow ambient background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/80 text-sky-400 text-xs font-mono tracking-wide">
            <Terminal className="w-3.5 h-3.5" />
            <span>THINK//FIRST WORKSPACE &bull; COGNITIVE INTEGRITY PLATFORM</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white font-sans">
            THINK<span className="text-sky-400">//</span>FIRST
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl font-medium text-slate-200 leading-snug max-w-3xl mx-auto">
            &ldquo;You don&apos;t need someone to solve the problem for you. You need to understand it well enough to solve it yourself.&rdquo;
          </p>

          <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl mx-auto font-normal">
            Translate the problem. Understand the requirements. Explore a simple conceptual example. Then develop and test your own solution. No generated answers. No corrected code. Your thinking stays yours.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={onUnderstandClick}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-sm transition-all shadow-[0_0_20px_rgba(56,189,248,0.3)] hover:shadow-[0_0_25px_rgba(56,189,248,0.45)] cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>Understand a Problem</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onWorkspaceClick}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 border border-slate-700 font-semibold text-sm transition-all cursor-pointer"
            >
              <Code2 className="w-4 h-4 text-sky-400" />
              <span>{hasExistingDraft ? 'Return to My Workspace' : 'Open Workspace'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* The Three Principles */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-white">
            The Three Principles of THINK//FIRST
          </h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Engineered to empower genuine cognitive growth and algorithmic independence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* UNDERSTAND */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 space-y-3.5 hover:border-slate-700 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-mono font-bold text-sm">
              01
            </div>
            <h3 className="text-lg font-bold text-white font-mono tracking-wide flex items-center gap-2">
              UNDERSTAND
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Make difficult statements understandable. Break down cryptic constraints, mathematical symbols, and unfamiliar terminology into plain, accessible explanations without giving away algorithmic strategies.
            </p>
            <div className="pt-2 text-xs text-indigo-400 flex items-center gap-1">
              <span>Includes safe conceptual teaching examples</span>
            </div>
          </div>

          {/* ATTEMPT */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 space-y-3.5 hover:border-slate-700 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center font-mono font-bold text-sm">
              02
            </div>
            <h3 className="text-lg font-bold text-white font-mono tracking-wide flex items-center gap-2">
              ATTEMPT
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Work independently in your own space. Record your mental model, formulate assumptions, draft test cases, and write code in C, C++, Java, Python, or JavaScript with zero AI autocompletion or template hints.
            </p>
            <div className="pt-2 text-xs text-sky-400 flex items-center gap-1">
              <span>Your reasoning remains 100% yours</span>
            </div>
          </div>

          {/* VERIFY */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 space-y-3.5 hover:border-slate-700 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center font-mono font-bold text-sm">
              03
            </div>
            <h3 className="text-lg font-bold text-white font-mono tracking-wide flex items-center gap-2">
              VERIFY
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Discover which parts of your submission may contain errors without being handed a correction. Receive exact line markers with neutral category labels — no code rewrites, no hints, no hand-holding.
            </p>
            <div className="pt-2 text-xs text-violet-400 flex items-center gap-1">
              <span>Strictly no corrected code or answers</span>
            </div>
          </div>
        </div>
      </section>

      {/* Academic Integrity & Philosophy Banner */}
      <section className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6 md:p-8 space-y-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-base font-bold text-amber-200">
              Academic Integrity & Cognitive Philosophy
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              THINK//FIRST is built specifically for students competing in algorithmic contests, university computer science courses, and technical interviews. Our strict policy ensures the system never generates answers, rewrites solutions, or provides progressive hints. We believe genuine mastery comes from identifying your own mistakes and testing your own logic.
            </p>
            <p className="text-xs text-slate-400 pt-1">
              * Note: While THINK//FIRST will never write your code or suggest solutions, this educational tool does not certify or guarantee the absence of plagiarism for academic submissions.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Start: Sample Problems Library */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-sky-400" />
              Try an Example Problem
            </h2>
            <p className="text-xs text-slate-400">
              Select a classic contest problem to see the non-solution understanding breakdown and error verification in action.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {SAMPLE_PROBLEMS.map((problem) => (
            <div
              key={problem.id}
              className="group flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-900/60 p-5 hover:border-sky-500/40 hover:bg-slate-900 transition-all cursor-pointer"
              onClick={() => onSelectSampleProblem(problem)}
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-slate-800 text-sky-400 border border-slate-700">
                    {problem.category}
                  </span>
                  <span className="text-[11px] font-medium text-slate-400">
                    {problem.difficulty}
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-slate-100 group-hover:text-sky-300 transition-colors">
                  {problem.title}
                </h4>
                <p className="text-xs text-slate-400 line-clamp-3">
                  {problem.statement}
                </p>
              </div>

              <div className="pt-4 flex items-center justify-between text-xs font-medium text-sky-400 group-hover:text-sky-300">
                <span>Explore Problem</span>
                <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
