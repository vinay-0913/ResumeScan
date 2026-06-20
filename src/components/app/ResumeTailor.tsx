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

  const handleResumeUpdate = (updatedResume: StructuredResume) => {
    setCurrentResume(updatedResume);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-140px)] min-h-[800px] w-full max-w-[1600px] mx-auto overflow-hidden">

      {/* Left Panel - Tabs & Controls (40%) */}
      <div className="flex flex-col w-full lg:w-[40%] xl:w-[35%] bg-canvas border border-hairline rounded-xl shadow-level-2 overflow-hidden shrink-0">

        {/* Tab Navigation */}
        <div className="flex border-b border-hairline bg-canvas-soft">
          <button
            onClick={() => setActiveTab('report')}
            className={`flex-1 py-4 text-body-sm-strong transition-colors border-b-2 ${activeTab === 'report' ? 'border-link text-link bg-canvas' : 'border-transparent text-mute hover:text-ink hover:bg-canvas-soft-2'
              }`}
          >
            Report
          </button>
          <button
            onClick={() => setActiveTab('editor')}
            className={`flex-1 py-4 text-body-sm-strong transition-colors border-b-2 ${activeTab === 'editor' ? 'border-link text-link bg-canvas' : 'border-transparent text-mute hover:text-ink hover:bg-canvas-soft-2'
              }`}
          >
            Editor
          </button>
          <button
            onClick={() => setActiveTab('style')}
            className={`flex-1 py-4 text-body-sm-strong transition-colors border-b-2 ${activeTab === 'style' ? 'border-link text-link bg-canvas' : 'border-transparent text-mute hover:text-ink hover:bg-canvas-soft-2'
              }`}
          >
            Style
          </button>
        </div>

        {/* Tab Content Area (Scrollable) */}
        <div className="flex-1 overflow-y-auto custom-scrollbar relative">
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

      {/* Right Panel - Live Preview (60%) */}
      <div className="flex-1 bg-canvas-soft-2 border border-hairline rounded-xl overflow-hidden shadow-inner flex flex-col">
        {/* Preview Toolbar */}
        <div className="h-14 bg-canvas border-b border-hairline flex items-center justify-between px-6 shrink-0">
          <h3 className="text-body-sm-strong text-ink">Live Preview</h3>
          <div className="flex items-center gap-2">
            <span className="text-caption text-mute">Template: {selectedTemplate.charAt(0).toUpperCase() + selectedTemplate.slice(1)}</span>
            {/* Zoom controls could go here */}
          </div>
        </div>

        {/* Preview Document Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 flex justify-center custom-scrollbar bg-gray-100">
          <ResumePreview resume={currentResume} templateId={selectedTemplate} />
        </div>

        {/* Download Bar */}
        <DownloadBar resume={currentResume} templateId={selectedTemplate} />
      </div>

    </div>
  );
}
