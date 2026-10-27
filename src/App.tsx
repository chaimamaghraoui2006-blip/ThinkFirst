import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { ProblemInput } from './components/ProblemInput';
import { ProblemExplanationView } from './components/ProblemExplanationView';
import { StudentWorkspace } from './components/StudentWorkspace';
import { AttemptReviewView } from './components/AttemptReviewView';
import { AboutModal } from './components/AboutModal';
import {
  Language,
  ProblemExplanation,
  ReviewResult,
  ProgrammingLanguage,
} from './types';
import { SampleProblem, SAMPLE_PROBLEMS } from './data/sampleProblems';
import { Loader2, AlertCircle, ArrowLeft } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<
    'home' | 'input' | 'explanation' | 'workspace' | 'review' | 'about'
  >('home');

  const [language, setLanguage] = useState<Language>('en');
  const [problemStatement, setProblemStatement] = useState<string>('');
  const [explanation, setExplanation] = useState<ProblemExplanation | null>(null);
  const [isLoadingExplanation, setIsLoadingExplanation] = useState(false);
  const [explanationError, setExplanationError] = useState<string | null>(null);

  // Review states
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [currentReview, setCurrentReview] = useState<ReviewResult | null>(null);
  const [reviewHistory, setReviewHistory] = useState<ReviewResult[]>([]);

  // About modal
  const [showAboutModal, setShowAboutModal] = useState(false);

  // Draft persistence check
  const [hasSavedDraft, setHasSavedDraft] = useState(false);

  // Sync RTL layout for Arabic
  useEffect(() => {
    if (language === 'ar') {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = 'ar';
    } else {
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = language;
    }
  }, [language]);

  // Check stored draft on mount
  useEffect(() => {
    const stored = localStorage.getItem('think_first_active_draft_v1');
    if (stored) {
      setHasSavedDraft(true);
    }
    const storedProblem = localStorage.getItem('think_first_current_problem');
    if (storedProblem) {
      try {
        const parsed = JSON.parse(storedProblem);
        if (parsed.statement) setProblemStatement(parsed.statement);
        if (parsed.explanation) setExplanation(parsed.explanation);
      } catch (e) {
        console.warn(e);
      }
    }
  }, []);

  // Fetch problem breakdown
  const fetchProblemExplanation = async (statement: string, lang: Language) => {
    setIsLoadingExplanation(true);
    setExplanationError(null);

    try {
      const response = await fetch('/api/explain-problem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemText: statement,
          language: lang,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate problem breakdown.');
      }

      setExplanation(data);
      // Persist to session/local storage
      localStorage.setItem(
        'think_first_current_problem',
        JSON.stringify({
          statement,
          explanation: data,
        })
      );
      setCurrentTab('explanation');
    } catch (err: any) {
      setExplanationError(err?.message || 'Error communicating with breakdown engine.');
    } finally {
      setIsLoadingExplanation(false);
    }
  };

  const handleProblemConfirmed = (statement: string, selectedLang: Language) => {
    setProblemStatement(statement);
    setLanguage(selectedLang);
    fetchProblemExplanation(statement, selectedLang);
  };

  const handleSelectSampleProblem = (sample: SampleProblem) => {
    setProblemStatement(sample.statement);
    fetchProblemExplanation(sample.statement, language);
  };

  const handleExplanationLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
    if (problemStatement) {
      fetchProblemExplanation(problemStatement, newLang);
    }
  };

  // Attempt Review Submission
  const handleReviewSubmit = async (submission: {
    attemptType: 'code' | 'algorithm' | 'explanation';
    content: string;
    language: ProgrammingLanguage;
  }) => {
    if (!problemStatement) {
      alert('Please provide or confirm a problem statement first.');
      return;
    }

    setIsEvaluating(true);

    try {
      const response = await fetch('/api/evaluate-attempt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemStatement,
          attemptType: submission.attemptType,
          codeOrText: submission.content,
          language: submission.language,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Review evaluation service failed.');
      }

      const newReview: ReviewResult = {
        id: `rev-${Date.now()}`,
        timestamp: Date.now(),
        attemptNumber: reviewHistory.length + 1,
        attemptType: submission.attemptType,
        submittedContent: submission.content,
        language: submission.language,
        status: data.status,
        issues: data.issues || [],
        disclaimer: data.disclaimer || '',
        closingMessage: data.closingMessage || '',
        submittedLineCount: data.submittedLineCount || submission.content.split('\n').length,
      };

      setCurrentReview(newReview);
      setReviewHistory((prev) => [newReview, ...prev]);
      setCurrentTab('review');
    } catch (err: any) {
      alert(err?.message || 'Failed to complete review. Your code has been kept safe.');
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-[#e2e8f0] flex flex-col font-sans selection:bg-sky-500/30">
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          if (tab === 'about') {
            setShowAboutModal(true);
          } else {
            setCurrentTab(tab);
          }
        }}
        language={language}
        setLanguage={setLanguage}
        hasActiveProblem={Boolean(problemStatement)}
        hasSavedDraft={hasSavedDraft}
        onOpenAbout={() => setShowAboutModal(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Loading Problem Breakdown overlay */}
        {isLoadingExplanation && (
          <div className="py-24 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center mx-auto text-sky-400 animate-pulse">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
            <h2 className="text-xl font-bold text-white font-mono">
              Breaking Down Problem Statement...
            </h2>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Analyzing constraints, defining conceptual terminology, and synthesizing a safe conceptual example in {language.toUpperCase()}.
            </p>
          </div>
        )}

        {/* Error state */}
        {!isLoadingExplanation && explanationError && (
          <div className="p-6 rounded-2xl border border-rose-500/30 bg-rose-500/10 text-rose-300 max-w-xl mx-auto space-y-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-rose-400" />
              <h3 className="font-bold text-sm">Unable to generate breakdown</h3>
            </div>
            <p className="text-xs">{explanationError}</p>
            <button
              onClick={() => setCurrentTab('input')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-semibold"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Input</span>
            </button>
          </div>
        )}

        {/* View Routing */}
        {!isLoadingExplanation && !explanationError && (
          <>
            {currentTab === 'home' && (
              <LandingPage
                onUnderstandClick={() => setCurrentTab('input')}
                onWorkspaceClick={() => {
                  if (problemStatement && explanation) {
                    setCurrentTab('workspace');
                  } else {
                    setCurrentTab('input');
                  }
                }}
                onSelectSampleProblem={handleSelectSampleProblem}
                hasExistingDraft={hasSavedDraft || Boolean(problemStatement)}
                onOpenAbout={() => setShowAboutModal(true)}
              />
            )}

            {currentTab === 'input' && (
              <ProblemInput
                onProblemConfirmed={handleProblemConfirmed}
                language={language}
                setLanguage={setLanguage}
                initialText={problemStatement}
              />
            )}

            {currentTab === 'explanation' && explanation && (
              <ProblemExplanationView
                originalStatement={problemStatement}
                explanation={explanation}
                onOpenWorkspace={() => setCurrentTab('workspace')}
                language={language}
                onLanguageChange={handleExplanationLanguageChange}
                isLoadingNewLanguage={isLoadingExplanation}
              />
            )}

            {currentTab === 'workspace' && (
              <StudentWorkspace
                problemStatement={problemStatement || 'No problem statement loaded yet. You can paste notes or go to "Understand a Problem".'}
                explanation={explanation || undefined}
                onReviewSubmit={handleReviewSubmit}
                isEvaluating={isEvaluating}
                onBackToExplanation={() => {
                  if (explanation) setCurrentTab('explanation');
                  else setCurrentTab('input');
                }}
              />
            )}

            {currentTab === 'review' && currentReview && (
              <AttemptReviewView
                currentReview={currentReview}
                history={reviewHistory}
                onReturnToWorkspace={() => setCurrentTab('workspace')}
              />
            )}
          </>
        )}
      </div>

      {/* About Modal */}
      <AboutModal
        isOpen={showAboutModal}
        onClose={() => setShowAboutModal(false)}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#090d16] py-6 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-400">THINK//FIRST</span>
            <span>&bull;</span>
            <span className="text-slate-400">Cognitive Independence Workspace</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Strict Non-Correction Policy Enforced &bull; Zero AI Solution Generation
          </p>
        </div>
      </footer>
    </div>
  );
}
