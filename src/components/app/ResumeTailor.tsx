import { useState } from 'react';
import type { AnalysisResult, Improvement, StructuredResume } from '../../../lib/types';
import { ReportTab } from './editor/ReportTab';
import { EditorTab } from './editor/EditorTab';
import { StyleTab } from './editor/StyleTab';
import { DownloadBar } from './editor/DownloadBar';
import { ResumePreview } from './preview/ResumePreview';

interface ResumeTailorProps {
  analysis: AnalysisResult;
  suggestions: Improvement[];
  structuredResume: StructuredResume;
  onStartOver: () => void;
}

type TabType = 'report' | 'editor' | 'style';

export function ResumeTailor({ analysis, suggestions, structuredResume, onStartOver }: ResumeTailorProps) {
  const [activeTab, setActiveTab] = useState<TabType>('report');
  const [currentResume, setCurrentResume] = useState<StructuredResume>(structuredResume);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('professional');
  const [zoomLevel, setZoomLevel] = useState<number>(80);

  const zoomIn  = () => setZoomLevel(z => Math.min(z + 10, 150));
  const zoomOut = () => setZoomLevel(z => Math.max(z - 10, 40));
  const zoomReset = () => setZoomLevel(80);

  const handleResumeUpdate = (updatedResume: StructuredResume) => {
    setCurrentResume(updatedResume);
  };

  const resumeName = currentResume.contactInfo?.name || 'Resume';
  const resumeTitle = currentResume.contactInfo?.title || '';
  
  // Use a derived initial filename if none is set yet. We'll use a lazy initializer to set it once.
  const [fileName, setFileName] = useState(() => {
    return resumeName + (resumeTitle ? ` - ${resumeTitle}` : '');
  });

  return (
    <div className="flex flex-col h-full w-full overflow-hidden bg-canvas-soft">

      {/* ═══ Top Action Bar (single combined header) ═══ */}
      <div className="h-14 bg-canvas border-b border-hairline flex items-center justify-between px-5 shrink-0 z-10">
        {/* Left: Logo + Resume identity */}
        <div className="flex items-center gap-3 min-w-0">
          {/* Resumescan logo */}
          <a href="/" className="flex items-center gap-2 text-ink no-underline shrink-0">
            <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="#171717"/>
              <path d="M8 10h16M8 16h12M8 22h8" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>
              <circle cx="24" cy="22" r="4" fill="#007cf0" stroke="#171717" strokeWidth="1"/>
              <path d="M22.5 22l1 1 2-2" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-body-sm-strong text-ink hidden sm:inline">Resumescan</span>
          </a>
          <div className="h-5 w-px bg-hairline shrink-0" />
          <button
            onClick={onStartOver}
            className="text-mute hover:text-ink transition-colors shrink-0"
            title="Start Over"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          
          <input
            type="text"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            className="text-body-sm-strong text-ink bg-transparent border border-transparent hover:border-hairline focus:border-link focus:ring-1 focus:ring-link rounded px-2 py-1 outline-none transition-colors truncate min-w-[150px] max-w-[300px]"
            placeholder="Resume Filename"
            title="Click to edit filename"
          />
        </div>

        {/* Center: Doc type pill */}
        <div className="hidden md:flex items-center gap-1 bg-canvas-soft rounded-lg p-0.5">
          <span className="px-3 py-1.5 text-caption font-semibold bg-canvas rounded-md shadow-sm text-ink">Resume</span>
        </div>

        {/* Right: Download buttons */}
        <div className="flex items-center gap-2">
          <DownloadBar resume={currentResume} templateId={selectedTemplate} fileName={fileName} />
        </div>
      </div>

      {/* ═══ Main Body: Sidebar + Preview ═══ */}
      <div className="flex flex-1 overflow-hidden">

        {/* Left Sidebar */}
        <div className="flex flex-col w-[360px] xl:w-[400px] shrink-0 bg-canvas border-r border-hairline overflow-hidden">

          {/* Report/Editor/Style Tab Navigation */}
          <div className="flex border-b border-hairline shrink-0">
            {(['report', 'editor', 'style'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 text-caption font-semibold transition-colors border-b-2 ${
                  activeTab === tab
                    ? 'border-link text-link bg-canvas'
                    : 'border-transparent text-mute hover:text-ink hover:bg-canvas-soft'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Tab Content (scrollable) */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {activeTab === 'report' && (
              <ReportTab analysis={analysis} onStartOver={onStartOver} />
            )}
            {activeTab === 'editor' && (
              <EditorTab
                resume={currentResume}
                suggestions={suggestions}
                onUpdate={handleResumeUpdate}
              />
            )}
            {activeTab === 'style' && (
              <StyleTab
                selectedTemplate={selectedTemplate}
                onSelectTemplate={setSelectedTemplate}
              />
            )}
          </div>
        </div>

        {/* Right: Resume Preview with floating zoom controls */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#eaeaea] relative flex justify-center p-6">
          <ResumePreview resume={currentResume} templateId={selectedTemplate} zoomLevel={zoomLevel} onUpdate={handleResumeUpdate} />

          {/* Floating zoom pill — bottom center, no layout space taken */}
          <div className="fixed bottom-6 right-8 flex items-center gap-1 bg-canvas/90 backdrop-blur-sm border border-hairline rounded-full shadow-level-3 px-2 py-1 z-20">
            <button
              onClick={zoomOut}
              disabled={zoomLevel <= 40}
              className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-canvas-soft-2 transition-colors text-mute hover:text-ink disabled:opacity-30 disabled:cursor-not-allowed"
              title="Zoom out"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            </button>
            <button
              onClick={zoomReset}
              className="px-2 py-0.5 text-xs font-mono text-mute hover:text-ink transition-colors min-w-[40px] text-center"
              title="Reset zoom"
            >
              {zoomLevel}%
            </button>
            <button
              onClick={zoomIn}
              disabled={zoomLevel >= 150}
              className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-canvas-soft-2 transition-colors text-mute hover:text-ink disabled:opacity-30 disabled:cursor-not-allowed"
              title="Zoom in"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}

