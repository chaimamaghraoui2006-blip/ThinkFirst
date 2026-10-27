import React, { useState, useEffect, useRef } from 'react';
import {
  Code2,
  BookOpen,
  Save,
  RotateCcw,
  Copy,
  Trash2,
  Plus,
  Play,
  FileCode,
  ShieldCheck,
  PanelLeftClose,
  PanelLeftOpen,
  Check,
  AlertTriangle,
  Lightbulb,
  ExternalLink,
  ChevronDown,
  Sparkles,
  HelpCircle,
  Clock,
  ArrowRight,
  Layers,
} from 'lucide-react';
import {
  ProgrammingLanguage,
  TestCase,
  StudentDraft,
  ProblemExplanation,
} from '../types';

interface StudentWorkspaceProps {
  problemStatement: string;
  explanation?: ProblemExplanation;
  onReviewSubmit: (
    submission: {
      attemptType: 'code' | 'algorithm' | 'explanation';
      content: string;
      language: ProgrammingLanguage;
    }
  ) => void;
  isEvaluating: boolean;
  onBackToExplanation: () => void;
}

export const StudentWorkspace: React.FC<StudentWorkspaceProps> = ({
  problemStatement,
  explanation,
  onReviewSubmit,
  isEvaluating,
  onBackToExplanation,
}) => {
  // Persistence state
  const DRAFT_KEY = 'think_first_active_draft_v1';

  const [sidePanelOpen, setSidePanelOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'code' | 'approach' | 'understanding' | 'tests'>('code');

  // Form states
  const [understanding, setUnderstanding] = useState('');
  const [approach, setApproach] = useState('');
  const [code, setCode] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<ProgrammingLanguage>('python');
  const [testCases, setTestCases] = useState<TestCase[]>([
    { id: '1', input: '', expectedOutput: '', notes: 'Initial sanity test' },
  ]);

  const [lastSaved, setLastSaved] = useState<number | null>(null);
  const [isSaved, setIsSaved] = useState(true);
  const [copiedCode, setCopiedCode] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [submissionType, setSubmissionType] = useState<'code' | 'algorithm' | 'explanation'>('code');

  const editorTextareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Load draft on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(DRAFT_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.code) setCode(parsed.code);
        if (parsed.understanding) setUnderstanding(parsed.understanding);
        if (parsed.approach) setApproach(parsed.approach);
        if (parsed.selectedLanguage) setSelectedLanguage(parsed.selectedLanguage);
        if (parsed.testCases) setTestCases(parsed.testCases);
        if (parsed.lastSaved) setLastSaved(parsed.lastSaved);
      }
    } catch (e) {
      console.warn('Failed to restore draft from localStorage:', e);
    }
  }, []);

  // Auto-save debounced
  useEffect(() => {
    const timer = setTimeout(() => {
      const dataToSave = {
        code,
        understanding,
        approach,
        selectedLanguage,
        testCases,
        lastSaved: Date.now(),
      };
      localStorage.setItem(DRAFT_KEY, JSON.stringify(dataToSave));
      setLastSaved(dataToSave.lastSaved);
      setIsSaved(true);
    }, 1500);

    setIsSaved(false);
    return () => clearTimeout(timer);
  }, [code, understanding, approach, selectedLanguage, testCases]);

  const handleManualSave = () => {
    const dataToSave = {
      code,
      understanding,
      approach,
      selectedLanguage,
      testCases,
      lastSaved: Date.now(),
    };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(dataToSave));
    setLastSaved(dataToSave.lastSaved);
    setIsSaved(true);
  };

  const handleClearEditor = () => {
    setCode('');
    setIsSaved(false);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleResetWorkspace = () => {
    setCode('');
    setUnderstanding('');
    setApproach('');
    setTestCases([{ id: '1', input: '', expectedOutput: '', notes: '' }]);
    localStorage.removeItem(DRAFT_KEY);
    setShowResetModal(false);
    setIsSaved(true);
    setLastSaved(Date.now());
  };

  const handleAddTestCase = () => {
    setTestCases([
      ...testCases,
      {
        id: String(Date.now()),
        input: '',
        expectedOutput: '',
        notes: '',
      },
    ]);
  };

  const handleRemoveTestCase = (id: string) => {
    if (testCases.length <= 1) return;
    setTestCases(testCases.filter((tc) => tc.id !== id));
  };

  const handleUpdateTestCase = (id: string, field: keyof TestCase, val: string) => {
    setTestCases(
      testCases.map((tc) => (tc.id === id ? { ...tc, [field]: val } : tc))
    );
  };

  // Support Tab key indentation in editor
  const handleEditorKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;

      const newCode = code.substring(0, start) + '    ' + code.substring(end);
      setCode(newCode);

      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 4;
      }, 0);
    }
  };

  // Compute line numbers for editor
  const codeLines = code.split('\n');
  const lineCount = Math.max(codeLines.length, 18);

  const handleSubmit = () => {
    let contentToSubmit = '';
    if (submissionType === 'code') {
      contentToSubmit = code.trim();
    } else if (submissionType === 'algorithm') {
      contentToSubmit = approach.trim();
    } else {
      contentToSubmit = understanding.trim();
    }

    if (!contentToSubmit) {
      alert(`Please enter your ${submissionType} before submitting for review.`);
      return;
    }

    onReviewSubmit({
      attemptType: submissionType,
      content: contentToSubmit,
      language: selectedLanguage,
    });
  };

  return (
    <div className="space-y-4 py-4">
      {/* Top Bar with Status, Language Selector, and Save Status */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-3 sm:p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidePanelOpen(!sidePanelOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-xs text-slate-300 border border-slate-700 cursor-pointer"
            title={sidePanelOpen ? 'Collapse problem panel' : 'Open problem panel'}
          >
            {sidePanelOpen ? <PanelLeftClose className="w-3.5 h-3.5 text-sky-400" /> : <PanelLeftOpen className="w-3.5 h-3.5 text-sky-400" />}
            <span className="hidden sm:inline">{sidePanelOpen ? 'Hide Problem' : 'Show Problem'}</span>
          </button>

          <button
            onClick={onBackToExplanation}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Problem Overview</span>
          </button>
        </div>

        {/* Persistence indicator and actions */}
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-[11px]">
              {isSaved
                ? lastSaved
                  ? `Saved locally at ${new Date(lastSaved).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                  : 'Draft saved'
                : 'Saving changes...'}
            </span>
          </div>

          <button
            onClick={handleManualSave}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 cursor-pointer text-xs"
            title="Save draft now"
          >
            <Save className="w-3.5 h-3.5 text-sky-400" />
            <span>Save</span>
          </button>

          <button
            onClick={() => setShowResetModal(true)}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800/80 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 border border-slate-700 text-xs cursor-pointer"
            title="Reset workspace"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Main Split Layout: Left Problem Reference Panel + Right Workspace Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Problem Reference Panel (Collapsible) */}
        {sidePanelOpen && (
          <aside className="lg:col-span-4 space-y-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4 max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-mono font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  Problem Statement
                </span>
              </div>

              <div className="font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800/90 max-h-64 overflow-y-auto">
                {problemStatement}
              </div>

              {/* Quick Specs summary */}
              {explanation?.structuredSpecs && (
                <div className="space-y-2 text-xs">
                  <span className="text-[11px] font-mono text-slate-400 font-semibold uppercase block">
                    Constraints:
                  </span>
                  <ul className="space-y-1">
                    {explanation.structuredSpecs.constraints.map((c, i) => (
                      <li key={i} className="text-[11px] font-mono text-slate-400 bg-slate-950/70 p-1.5 rounded border border-slate-850">
                        &bull; {c}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Quick teaching example reminder */}
              {explanation?.teachingExample && (
                <div className="p-3 rounded-xl border border-indigo-500/20 bg-indigo-950/20 space-y-1 text-xs">
                  <span className="font-mono text-[10px] uppercase text-indigo-400 font-semibold block">
                    Conceptual Example (Not Solution):
                  </span>
                  <p className="text-slate-300 font-sans text-[11px]">
                    {explanation.teachingExample.situation}
                  </p>
                </div>
              )}
            </div>
          </aside>
        )}

        {/* Right Main Workspace */}
        <main className={`${sidePanelOpen ? 'lg:col-span-8' : 'lg:col-span-12'} space-y-5`}>
          {/* Workspace Tabs: My Code, My Approach, My Understanding, My Test Cases */}
          <div className="flex items-center justify-between border-b border-slate-800">
            <div className="flex space-x-1 sm:space-x-3">
              <button
                onClick={() => setActiveTab('code')}
                className={`flex items-center gap-1.5 py-2.5 px-3.5 text-xs sm:text-sm font-medium border-b-2 transition-all cursor-pointer ${
                  activeTab === 'code'
                    ? 'border-sky-400 text-sky-400 bg-sky-500/5'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Code2 className="w-4 h-4" />
                <span>My Code</span>
              </button>

              <button
                onClick={() => setActiveTab('approach')}
                className={`flex items-center gap-1.5 py-2.5 px-3.5 text-xs sm:text-sm font-medium border-b-2 transition-all cursor-pointer ${
                  activeTab === 'approach'
                    ? 'border-sky-400 text-sky-400 bg-sky-500/5'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Lightbulb className="w-4 h-4" />
                <span>My Approach</span>
              </button>

              <button
                onClick={() => setActiveTab('understanding')}
                className={`flex items-center gap-1.5 py-2.5 px-3.5 text-xs sm:text-sm font-medium border-b-2 transition-all cursor-pointer ${
                  activeTab === 'understanding'
                    ? 'border-sky-400 text-sky-400 bg-sky-500/5'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileCode className="w-4 h-4" />
                <span>My Understanding</span>
              </button>

              <button
                onClick={() => setActiveTab('tests')}
                className={`flex items-center gap-1.5 py-2.5 px-3.5 text-xs sm:text-sm font-medium border-b-2 transition-all cursor-pointer ${
                  activeTab === 'tests'
                    ? 'border-sky-400 text-sky-400 bg-sky-500/5'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>My Test Cases</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                  {testCases.length}
                </span>
              </button>
            </div>
          </div>

          {/* TAB 1: MY CODE */}
          {activeTab === 'code' && (
            <div className="space-y-3">
              {/* Editor Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-900/90 border border-slate-800 px-3.5 py-2 rounded-xl text-xs">
                {/* Language selector */}
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-mono">Language:</span>
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value as ProgrammingLanguage)}
                    className="bg-slate-950 border border-slate-750 text-sky-400 font-mono text-xs px-2.5 py-1 rounded-md focus:outline-none focus:border-sky-500 cursor-pointer"
                  >
                    <option value="python">Python 3</option>
                    <option value="cpp">C++ (std=c++17)</option>
                    <option value="c">C (c11)</option>
                    <option value="java">Java 17</option>
                    <option value="javascript">JavaScript (Node.js)</option>
                    <option value="csharp">C# (.NET)</option>
                  </select>
                </div>

                {/* Editor utility buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyCode}
                    className="flex items-center gap-1 text-slate-300 hover:text-white px-2 py-1 rounded hover:bg-slate-800"
                    title="Copy code to clipboard"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                  </button>

                  <button
                    onClick={handleClearEditor}
                    className="flex items-center gap-1 text-slate-400 hover:text-rose-400 px-2 py-1 rounded hover:bg-rose-500/10"
                    title="Clear editor"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear</span>
                  </button>
                </div>
              </div>

              {/* Code Editor Container with Line Numbers */}
              <div className="relative rounded-2xl border border-slate-800 bg-[#070b13] overflow-hidden shadow-2xl flex focus-within:border-sky-500/50 transition-all">
                {/* Line numbers column */}
                <div
                  className="select-none py-4 px-3 text-right bg-[#05080e] border-r border-slate-850 text-slate-600 font-mono text-xs leading-6"
                  aria-hidden="true"
                >
                  {Array.from({ length: lineCount }).map((_, i) => (
                    <div key={i}>{i + 1}</div>
                  ))}
                </div>

                {/* Actual Editor Textarea */}
                <textarea
                  ref={editorTextareaRef}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  onKeyDown={handleEditorKeyDown}
                  rows={20}
                  spellCheck={false}
                  placeholder={`// Write your ${selectedLanguage} solution independently here...
// No starter logic or AI autocompletion will interfere with your thinking.`}
                  className="w-full bg-transparent p-4 text-xs sm:text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none font-mono resize-y leading-6 selection:bg-sky-500/30"
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono px-1">
                <span>Indentation: 4 spaces (Tab key supported)</span>
                <span>{codeLines.length} lines &bull; {code.length} chars</span>
              </div>
            </div>
          )}

          {/* TAB 2: MY APPROACH */}
          {activeTab === 'approach' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-2">
                <h3 className="text-xs font-mono font-bold text-sky-400 uppercase">
                  Develop Your Reasoning & Strategy
                </h3>
                <p className="text-xs text-slate-400">
                  Outline your logic, identify edge cases, and define assumptions before coding. Neutral prompts below help frame your independent reasoning:
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <span className="text-[11px] bg-slate-800/80 text-slate-300 px-2 py-1 rounded border border-slate-700/80">
                    &bull; What assumptions are you making?
                  </span>
                  <span className="text-[11px] bg-slate-800/80 text-slate-300 px-2 py-1 rounded border border-slate-700/80">
                    &bull; What invariants must hold true?
                  </span>
                  <span className="text-[11px] bg-slate-800/80 text-slate-300 px-2 py-1 rounded border border-slate-700/80">
                    &bull; What edge cases or boundaries exist?
                  </span>
                </div>
              </div>

              <div className="relative rounded-2xl border border-slate-800 bg-[#070b13] p-1">
                <textarea
                  value={approach}
                  onChange={(e) => setApproach(e.target.value)}
                  rows={14}
                  placeholder="Record your algorithmic strategy, observations, or pseudocode here in your own words..."
                  className="w-full bg-transparent p-4 text-xs sm:text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none font-mono resize-y leading-relaxed"
                />
              </div>
            </div>
          )}

          {/* TAB 3: MY UNDERSTANDING */}
          {activeTab === 'understanding' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-1 text-xs">
                <h3 className="font-mono font-bold text-sky-400 uppercase">
                  Your Personal Notes & Interpretation
                </h3>
                <p className="text-slate-400">
                  Write what the problem means to you in your own terminology. This space is purely for your private reference and is never rewritten or judged.
                </p>
              </div>

              <div className="relative rounded-2xl border border-slate-800 bg-[#070b13] p-1">
                <textarea
                  value={understanding}
                  onChange={(e) => setUnderstanding(e.target.value)}
                  rows={14}
                  placeholder="Explain the problem in your own words here..."
                  className="w-full bg-transparent p-4 text-xs sm:text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none font-sans resize-y leading-relaxed"
                />
              </div>
            </div>
          )}

          {/* TAB 4: MY TEST CASES */}
          {activeTab === 'tests' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-white font-mono">
                    Custom Test Scenarios
                  </h3>
                  <p className="text-xs text-slate-400">
                    Create your own test inputs and expected outputs to mentally trace or verify your solution.
                  </p>
                </div>

                <button
                  onClick={handleAddTestCase}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/30 hover:bg-sky-500/20 text-xs font-medium cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Test Case</span>
                </button>
              </div>

              <div className="space-y-3">
                {testCases.map((tc, idx) => (
                  <div
                    key={tc.id}
                    className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-slate-300">
                        Test Case #{idx + 1}
                      </span>
                      {testCases.length > 1 && (
                        <button
                          onClick={() => handleRemoveTestCase(tc.id)}
                          className="text-xs text-slate-500 hover:text-rose-400"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block text-[11px] font-mono text-slate-400 mb-1">
                          Test Input:
                        </label>
                        <textarea
                          value={tc.input}
                          onChange={(e) => handleUpdateTestCase(tc.id, 'input', e.target.value)}
                          rows={3}
                          placeholder="e.g. nums = [2, 7, 11, 15], target = 9"
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 font-mono text-xs text-slate-200 focus:outline-none focus:border-sky-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono text-slate-400 mb-1">
                          Expected Output:
                        </label>
                        <textarea
                          value={tc.expectedOutput}
                          onChange={(e) =>
                            handleUpdateTestCase(tc.id, 'expectedOutput', e.target.value)
                          }
                          rows={3}
                          placeholder="e.g. [0, 1]"
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 font-mono text-xs text-slate-200 focus:outline-none focus:border-sky-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-slate-400 mb-1">
                        What does this test verify? (Notes):
                      </label>
                      <input
                        type="text"
                        value={tc.notes}
                        onChange={(e) => handleUpdateTestCase(tc.id, 'notes', e.target.value)}
                        placeholder="e.g. Verifies negative numbers, empty input, single element boundary..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-sky-500 font-sans"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SUBMISSION / ATTEMPT REVIEW SECTION */}
          <div className="rounded-2xl border-2 border-sky-500/30 bg-gradient-to-b from-sky-950/20 via-slate-900/80 to-slate-950 p-6 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-sky-500/20 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-sky-400" />
                <h3 className="text-base font-bold text-white">
                  Review My Attempt — No Corrections
                </h3>
              </div>

              {/* Submission type toggle */}
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
                <button
                  onClick={() => setSubmissionType('code')}
                  className={`px-2.5 py-1 rounded font-medium transition-all ${
                    submissionType === 'code'
                      ? 'bg-sky-500 text-slate-950'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Code Attempt
                </button>
                <button
                  onClick={() => setSubmissionType('algorithm')}
                  className={`px-2.5 py-1 rounded font-medium transition-all ${
                    submissionType === 'algorithm'
                      ? 'bg-sky-500 text-slate-950'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Written Algorithm
                </button>
                <button
                  onClick={() => setSubmissionType('explanation')}
                  className={`px-2.5 py-1 rounded font-medium transition-all ${
                    submissionType === 'explanation'
                      ? 'bg-sky-500 text-slate-950'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Explanation
                </button>
              </div>
            </div>

            {/* Required Mandated Disclosure */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed space-y-1">
              <p className="font-semibold text-sky-400 font-mono text-[11px] uppercase">
                Academic Integrity & Evaluation Rule:
              </p>
              <p>
                &ldquo;Your attempt will be checked for potential errors. THINK//FIRST will identify suspicious lines or sections but will not rewrite your work, explain how to correct it, or suggest a solution. Your reasoning remains yours.&rdquo;
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-1">
              <div className="text-xs text-slate-400">
                Submitting:{' '}
                <span className="font-mono text-sky-400 font-semibold uppercase">
                  {submissionType}
                </span>{' '}
                ({submissionType === 'code' ? `${codeLines.length} lines in ${selectedLanguage}` : 'Text'})
              </div>

              <button
                onClick={handleSubmit}
                disabled={isEvaluating}
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-7 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-slate-950 font-bold text-sm transition-all shadow-[0_0_20px_rgba(56,189,248,0.3)] cursor-pointer"
              >
                {isEvaluating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>Evaluating Suspicious Lines...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Review My Attempt</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* Confirmation Reset Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-base font-bold text-white">
                Reset Workspace Draft?
              </h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              This will clear your current code, written approach, understanding notes, and test cases stored in this browser session. This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                onClick={() => setShowResetModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleResetWorkspace}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold"
              >
                Yes, Reset Workspace
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
