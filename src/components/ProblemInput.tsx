import React, { useState, useRef, ChangeEvent } from 'react';
import {
  Type,
  Camera,
  UploadCloud,
  FileText,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Trash2,
  ArrowRight,
  Eye,
  Edit3,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { Language } from '../types';

interface ProblemInputProps {
  onProblemConfirmed: (statement: string, language: Language) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  initialText?: string;
}

export const ProblemInput: React.FC<ProblemInputProps> = ({
  onProblemConfirmed,
  language,
  setLanguage,
  initialText = '',
}) => {
  const [activeTab, setActiveTab] = useState<'type' | 'camera' | 'upload'>('type');
  const [typedText, setTypedText] = useState(initialText);

  // Image / Camera state
  const [selectedImage, setSelectedImage] = useState<{
    file: File;
    dataUrl: string;
    mimeType: string;
  } | null>(null);

  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrError, setOcrError] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [uncertainSections, setUncertainSections] = useState<string[]>([]);
  const [isEditingExtracted, setIsEditingExtracted] = useState(true);

  // File input refs
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);

  // Validation
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

  const handleFileSelection = (file: File) => {
    setOcrError(null);
    setExtractedText(null);
    setUncertainSections([]);

    if (!ALLOWED_TYPES.includes(file.type)) {
      setOcrError('Unsupported format. Please upload a JPEG, PNG, or WEBP image.');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setOcrError('File too large. Maximum image file size is 10 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage({
        file,
        dataUrl: reader.result as string,
        mimeType: file.type,
      });
    };
    reader.onerror = () => {
      setOcrError('Failed to read image file from your device.');
    };
    reader.readAsDataURL(file);
  };

  const onFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const handleReadProblem = async () => {
    if (!selectedImage) return;

    setOcrLoading(true);
    setOcrError(null);

    try {
      const response = await fetch('/api/ocr-problem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: selectedImage.dataUrl,
          mimeType: selectedImage.mimeType,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to extract text from image.');
      }

      setExtractedText(data.extractedText);
      setUncertainSections(data.uncertainSections || []);
      setIsEditingExtracted(true);
    } catch (err: any) {
      setOcrError(err?.message || 'An error occurred while reading the problem image.');
    } finally {
      setOcrLoading(false);
    }
  };

  const handleConfirm = () => {
    const finalStatement = extractedText !== null ? extractedText.trim() : typedText.trim();
    if (!finalStatement) {
      setOcrError('Problem statement cannot be empty.');
      return;
    }
    onProblemConfirmed(finalStatement, language);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6">
      {/* Title & Description */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Submit a Problem
        </h1>
        <p className="text-sm text-slate-400">
          Enter the problem statement, take a photo of your exercise, or upload a screenshot. THINK//FIRST will break down the requirements without revealing the solution.
        </p>
      </div>

      {/* Input Methods Navigation Tabs */}
      <div className="flex border-b border-slate-800 space-x-1 sm:space-x-4">
        <button
          onClick={() => {
            setActiveTab('type');
            setOcrError(null);
          }}
          className={`flex items-center gap-2 py-3 px-4 text-xs sm:text-sm font-medium border-b-2 transition-all cursor-pointer ${
            activeTab === 'type'
              ? 'border-sky-400 text-sky-400 bg-sky-500/5'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Type className="w-4 h-4" />
          <span>Type or Paste Problem</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('camera');
            setOcrError(null);
          }}
          className={`flex items-center gap-2 py-3 px-4 text-xs sm:text-sm font-medium border-b-2 transition-all cursor-pointer ${
            activeTab === 'camera'
              ? 'border-sky-400 text-sky-400 bg-sky-500/5'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>Take a Photo</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('upload');
            setOcrError(null);
          }}
          className={`flex items-center gap-2 py-3 px-4 text-xs sm:text-sm font-medium border-b-2 transition-all cursor-pointer ${
            activeTab === 'upload'
              ? 'border-sky-400 text-sky-400 bg-sky-500/5'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <UploadCloud className="w-4 h-4" />
          <span>Upload Image / Screenshot</span>
        </button>
      </div>

      {/* Method A: Type a Problem */}
      {activeTab === 'type' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Problem Description, Constraints, and Examples</span>
            <span>{typedText.length} characters</span>
          </div>

          <div className="relative rounded-2xl border border-slate-800 bg-slate-900/70 focus-within:border-sky-500/60 focus-within:ring-1 focus-within:ring-sky-500/30 transition-all">
            <textarea
              value={typedText}
              onChange={(e) => {
                setTypedText(e.target.value);
                if (ocrError) setOcrError(null);
              }}
              rows={14}
              placeholder="Paste or type your complete problem statement here...

Include:
- The task description
- Mathematical expressions and constraints (e.g. 1 <= N <= 10^5)
- Input & Output specifications
- Sample cases and explanations"
              className="w-full bg-transparent p-5 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none font-mono resize-y leading-relaxed"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>Explain in:</span>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="bg-slate-900 border border-slate-800 text-slate-200 px-2.5 py-1.5 rounded-lg text-xs focus:outline-none focus:border-sky-500"
              >
                <option value="en">English</option>
                <option value="fr">Français (French)</option>
                <option value="ar">العربية (Arabic - RTL)</option>
              </select>
            </div>

            <button
              onClick={handleConfirm}
              disabled={!typedText.trim()}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-semibold text-sm transition-all shadow-[0_0_15px_rgba(56,189,248,0.25)] cursor-pointer"
            >
              <span>Confirm & Understand Problem</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Method B: Take a Photo (Camera) */}
      {activeTab === 'camera' && (
        <div className="space-y-6">
          <div className="rounded-2xl border-2 border-dashed border-slate-800 bg-slate-900/40 p-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center mx-auto">
              <Camera className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-semibold text-white">
                Take a Photo of Your Problem Statement
              </h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                On mobile devices, this will launch your device camera. On desktop, select a photo from your camera roll or webcam capture.
              </p>
            </div>

            <input
              type="file"
              ref={cameraInputRef}
              accept="image/*"
              capture="environment"
              onChange={onFileInputChange}
              className="hidden"
            />

            <button
              onClick={() => cameraInputRef.current?.click()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-medium text-xs sm:text-sm transition-all cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              <span>Open Device Camera / Photo</span>
            </button>
          </div>
        </div>
      )}

      {/* Method C: Upload an Image */}
      {activeTab === 'upload' && (
        <div className="space-y-6">
          <div className="rounded-2xl border-2 border-dashed border-slate-800 bg-slate-900/40 p-8 text-center space-y-4 hover:border-slate-700 transition-colors">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
              <UploadCloud className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-semibold text-white">
                Upload Problem Image or Screenshot
              </h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Supports JPEG, PNG, or WEBP up to 10 MB. Mathematical notation and code blocks will be extracted verbatim.
              </p>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              accept="image/png,image/jpeg,image/webp"
              onChange={onFileInputChange}
              className="hidden"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium text-xs sm:text-sm transition-all cursor-pointer"
            >
              <UploadCloud className="w-4 h-4 text-sky-400" />
              <span>Choose Image File</span>
            </button>
          </div>
        </div>
      )}

      {/* Image Preview & OCR Trigger (for Camera or Upload tab) */}
      {(activeTab === 'camera' || activeTab === 'upload') && selectedImage && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-sky-400" />
              <span className="text-xs font-semibold text-slate-200">
                Selected Image ({selectedImage.file.name || 'Photo'}) — {(selectedImage.file.size / 1024).toFixed(1)} KB
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (activeTab === 'camera') cameraInputRef.current?.click();
                  else fileInputRef.current?.click();
                }}
                className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 px-2 py-1 rounded hover:bg-slate-800"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Replace</span>
              </button>

              <button
                onClick={() => {
                  setSelectedImage(null);
                  setExtractedText(null);
                  setUncertainSections([]);
                }}
                className="flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300 px-2 py-1 rounded hover:bg-rose-500/10"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove</span>
              </button>
            </div>
          </div>

          <div className="max-h-80 overflow-hidden rounded-xl border border-slate-800 bg-slate-950 flex items-center justify-center p-2">
            <img
              src={selectedImage.dataUrl}
              alt="Problem statement preview"
              className="max-h-72 max-w-full object-contain rounded-lg"
            />
          </div>

          {/* Read Problem Button */}
          {!extractedText && (
            <div className="pt-2 flex justify-end">
              <button
                onClick={handleReadProblem}
                disabled={ocrLoading}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-slate-950 font-semibold text-sm transition-all cursor-pointer shadow-[0_0_15px_rgba(56,189,248,0.2)]"
              >
                {ocrLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Extracting Problem Statement...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Read Problem (Vision OCR)</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Error state */}
      {ocrError && (
        <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-300 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
          <div className="space-y-1">
            <p className="font-semibold">Notice</p>
            <p>{ocrError}</p>
          </div>
        </div>
      )}

      {/* Extracted Text Editor */}
      {(activeTab === 'camera' || activeTab === 'upload') && extractedText !== null && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-semibold text-white">
                Extracted Problem Text (Review & Edit)
              </h3>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <button
                onClick={() => setIsEditingExtracted(!isEditingExtracted)}
                className="flex items-center gap-1 text-slate-300 hover:text-white px-2.5 py-1 rounded bg-slate-800 border border-slate-700"
              >
                <Edit3 className="w-3.5 h-3.5 text-sky-400" />
                <span>{isEditingExtracted ? 'Viewing as Editable' : 'Edit Text'}</span>
              </button>
            </div>
          </div>

          {/* Flag uncertain sections */}
          {uncertainSections.length > 0 && (
            <div className="p-3 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-200 text-xs space-y-1">
              <p className="font-semibold flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                {uncertainSections.length} uncertain or blurry section(s) flagged:
              </p>
              <ul className="list-disc pl-5 space-y-0.5 text-slate-300">
                {uncertainSections.map((sec, idx) => (
                  <li key={idx} className="font-mono text-[11px]">
                    {sec}
                  </li>
                ))}
              </ul>
              <p className="text-[11px] text-amber-300/80 pt-1">
                Please verify and correct the flagged text below before continuing.
              </p>
            </div>
          )}

          <div className="relative rounded-xl border border-slate-700 bg-slate-950 p-1">
            <textarea
              value={extractedText}
              onChange={(e) => setExtractedText(e.target.value)}
              rows={12}
              className="w-full bg-transparent p-4 text-sm text-slate-200 font-mono focus:outline-none resize-y leading-relaxed"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>Explain in:</span>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="bg-slate-900 border border-slate-800 text-slate-200 px-2.5 py-1.5 rounded-lg text-xs focus:outline-none focus:border-sky-500"
              >
                <option value="en">English</option>
                <option value="fr">Français (French)</option>
                <option value="ar">العربية (Arabic - RTL)</option>
              </select>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={() => {
                  if (activeTab === 'camera') cameraInputRef.current?.click();
                  else fileInputRef.current?.click();
                }}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-medium cursor-pointer"
              >
                Replace Image
              </button>

              <button
                onClick={handleConfirm}
                disabled={!extractedText.trim()}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-xs sm:text-sm transition-all shadow-[0_0_15px_rgba(56,189,248,0.25)] cursor-pointer"
              >
                <span>Confirm & Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
