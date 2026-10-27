import React from 'react';
import { Terminal, BookOpen, Code2, Info, Globe, Sparkles, CheckCircle2 } from 'lucide-react';
import { Language } from '../types';

interface NavbarProps {
  currentTab: 'home' | 'input' | 'explanation' | 'workspace' | 'review' | 'about';
  setCurrentTab: (tab: 'home' | 'input' | 'explanation' | 'workspace' | 'review' | 'about') => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  hasActiveProblem: boolean;
  hasSavedDraft: boolean;
  onOpenAbout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  language,
  setLanguage,
  hasActiveProblem,
  hasSavedDraft,
  onOpenAbout,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#0b0f19]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Tagline */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentTab('home')}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
            >
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500/20 to-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400 group-hover:border-sky-400/60 transition-all shadow-[0_0_15px_rgba(56,189,248,0.15)]">
                <Terminal className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 font-mono font-bold text-lg tracking-wider text-slate-100 group-hover:text-sky-300 transition-colors">
                  <span>THINK</span>
                  <span className="text-sky-400">//</span>
                  <span>FIRST</span>
                </div>
                <p className="hidden md:block text-[11px] text-slate-400 font-sans tracking-tight">
                  Understand the problem. Test your thinking. Own your solution.
                </p>
              </div>
            </button>
          </div>

          {/* Nav links */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setCurrentTab('home')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                currentTab === 'home'
                  ? 'bg-slate-800 text-sky-400 border border-slate-700 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => setCurrentTab('input')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                currentTab === 'input' || currentTab === 'explanation'
                  ? 'bg-slate-800 text-sky-400 border border-slate-700 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              Understand a Problem
            </button>
            <button
              onClick={() => setCurrentTab('workspace')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                currentTab === 'workspace' || currentTab === 'review'
                  ? 'bg-slate-800 text-sky-400 border border-slate-700 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              My Workspace
              {hasSavedDraft && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-emerald-400/20 animate-pulse" />
              )}
            </button>
            <button
              onClick={onOpenAbout}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/50 transition-all"
            >
              <Info className="w-3.5 h-3.5" />
              About THINK//FIRST
            </button>
          </nav>

          {/* Right actions: Language selector & Mobile toggle */}
          <div className="flex items-center gap-2.5">
            {/* Language Selector */}
            <div className="flex items-center gap-1 bg-slate-900/80 px-2.5 py-1.5 rounded-lg border border-slate-800">
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer font-medium pr-1"
                aria-label="Select explanation language"
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

            {/* Quick Workspace indicator */}
            {hasActiveProblem && (
              <button
                onClick={() => setCurrentTab('workspace')}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-sky-500/10 text-sky-300 border border-sky-500/30 hover:bg-sky-500/20 transition-all"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
                <span>Active Problem</span>
              </button>
            )}

            {/* Mobile Nav Menu Buttons */}
            <div className="lg:hidden flex items-center gap-1">
              <button
                onClick={() => setCurrentTab('input')}
                className={`p-2 rounded-lg text-xs ${
                  currentTab === 'input' || currentTab === 'explanation'
                    ? 'bg-sky-500/20 text-sky-400'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Understand a Problem"
              >
                <BookOpen className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentTab('workspace')}
                className={`p-2 rounded-lg text-xs relative ${
                  currentTab === 'workspace' || currentTab === 'review'
                    ? 'bg-sky-500/20 text-sky-400'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="My Workspace"
              >
                <Code2 className="w-4 h-4" />
                {hasSavedDraft && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-400" />
                )}
              </button>
              <button
                onClick={onOpenAbout}
                className="p-2 rounded-lg text-xs text-slate-400 hover:text-white"
                title="About"
              >
                <Info className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
