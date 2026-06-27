import { useState } from 'react';
import { UploadZone } from './UploadZone';
import { RecruiterVerdict } from './RecruiterVerdict';
import { SkillGapAnalysis } from './SkillGapAnalysis';
import { ReadabilityAssessment } from './ReadabilityAssessment';
import { ImpactAnalysis } from './ImpactAnalysis';
import { RecruiterVisibility } from './RecruiterVisibility';
import { BulletImprovements } from './BulletImprovements';
import { ResumeTailor } from './ResumeTailor';

type AppState = 'upload' | 'analyzing' | 'results' | 'improving' | 'suggestions';

interface AnalysisResult {
  matchScore: number;
  shortlistProbability: string;
  shortlistReasoning: string;
  skillGapAnalysis: {
    strongMatches: any[];
    partialMatches: any[];
    missingCritical: any[];
    bonusSkills: any[];
  };
  readabilityAssessment: {
    score: string;
    formatting: string;
    issues: string[];
    strengths: string[];
  };
  impactAnalysis: {
    strongBullets: any[];
    weakBullets: any[];
  };
  bulletImprovements: any[];
  recruiterSearchVisibility: {
    score: number;
    titleAlignment: string;
    keyPhrases: string[];
    recommendations: string[];
  };
  overallSummary: string;
  topRecommendations: string[];
}

export function ResumeScanner() {
  const [appState, setAppState] = useState<AppState>('upload');
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [structuredResume, setStructuredResume] = useState<any>(null);
  const [extractedText, setExtractedText] = useState<string>('');
  const [jobDesc, setJobDesc] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'skills' | 'readability' | 'impact' | 'visibility'>('skills');

  // Handlers
  const handleUpload = async (resumeFile: File, jdText: string) => {
    setAppState('analyzing');
    setJobDesc(jdText);
    
    try {
      const formData = new FormData();
      formData.append('resume', resumeFile);
      formData.append('jd', jdText);

      const res = await fetch('/api/scan', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Failed to analyze resume');

      const data = await res.json();
      setAnalysis(data.analysis);
      setExtractedText(data.extractedResumeText);
      setAppState('results');
    } catch (error) {
      console.error(error);
      alert('An error occurred while analyzing your resume. Check console for details.');
      setAppState('upload');
    }
  };

  const handleGetSuggestions = async () => {
    setAppState('improving');
    
    try {
      const res = await fetch('/api/tailor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText: extractedText,
          jdText: jobDesc
        })
      });

      if (!res.ok) throw new Error('Failed to generate suggestions');

      const data = await res.json();
      setSuggestions(data.suggestions);
      setStructuredResume(data.structuredResume);
      setAppState('suggestions');
    } catch (error) {
      console.error(error);
      alert('An error occurred while generating suggestions.');
      setAppState('results');
    }
  };

  const handleStartOver = () => {
    setAppState('upload');
    setAnalysis(null);
    setSuggestions([]);
    setStructuredResume(null);
    setExtractedText('');
    setJobDesc('');
    setActiveTab('skills');
  };

  const tabs = [
    { key: 'skills' as const, label: 'Skill Gaps', icon: '🎯' },
    { key: 'readability' as const, label: 'Readability', icon: '📄' },
    { key: 'impact' as const, label: 'Impact', icon: '💪' },
    { key: 'visibility' as const, label: 'Visibility', icon: '🔍' },
  ];

  // Full-screen tailor view (covers entire viewport including navbar)
  if (appState === 'suggestions' && analysis && structuredResume) {
    return (
      <div className="fixed inset-0 z-50 animate-in fade-in duration-300">
        <ResumeTailor
          analysis={analysis}
          suggestions={suggestions}
          structuredResume={structuredResume}
          onStartOver={handleStartOver}
        />
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-8 px-6 py-10">
      {/* Stepper */}
      <div className="flex items-center justify-center mb-8 w-full max-w-3xl mx-auto">
        <StepIndicator step={1} current={appState} label="Upload" activeStates={['upload', 'analyzing', 'results', 'improving', 'suggestions']} />
        <StepLine active={['results', 'improving', 'suggestions'].includes(appState)} />
        <StepIndicator step={2} current={appState} label="Evaluate" activeStates={['results', 'improving', 'suggestions']} />
        <StepLine active={['suggestions'].includes(appState)} />
        <StepIndicator step={3} current={appState} label="Improve" activeStates={['suggestions']} />
      </div>

      {/* Main Content Area */}
      <div className="min-h-[500px]">
        {appState === 'upload' && (
          <UploadZone onUpload={handleUpload} />
        )}

        {appState === 'analyzing' && (
          <div className="flex flex-col items-center justify-center h-[400px] animate-in fade-in zoom-in-95">
            <div className="relative mb-8">
              <div className="w-20 h-20 border-4 border-hairline border-t-link rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl">👤</span>
              </div>
            </div>
            <h3 className="text-display-md text-ink">Evaluating your resume...</h3>
            <p className="text-body-md text-mute mt-2 text-center max-w-md">
              Our AI recruiter is reviewing your resume against the job description — analyzing skills, readability, impact, and more.
            </p>
            <div className="flex gap-2 mt-6">
              {['Checking skills', 'Analyzing impact', 'Assessing readability'].map((text, i) => (
                <span key={i} className="badge bg-canvas-soft border border-hairline text-mute animate-pulse" style={{ animationDelay: `${i * 300}ms` }}>
                  {text}
                </span>
              ))}
            </div>
          </div>
        )}

        {appState === 'results' && analysis && (
          <div className="flex flex-col gap-8 animate-in slide-in-from-bottom-8 fade-in duration-500">
            {/* Recruiter Verdict (full width) */}
            <RecruiterVerdict
              matchScore={analysis.matchScore}
              shortlistProbability={analysis.shortlistProbability}
              shortlistReasoning={analysis.shortlistReasoning}
              overallSummary={analysis.overallSummary}
              topRecommendations={analysis.topRecommendations}
            />

            {/* Tabbed Detail Panels */}
            <div className="bg-canvas border border-hairline rounded-xl shadow-level-2 overflow-hidden">
              <div className="flex border-b border-hairline overflow-x-auto">
                {tabs.map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex items-center gap-2 px-6 py-4 text-body-sm-strong whitespace-nowrap transition-colors border-b-2 -mb-px ${
                      activeTab === tab.key
                        ? 'border-ink text-ink bg-canvas'
                        : 'border-transparent text-mute hover:text-body hover:bg-canvas-soft'
                    }`}
                  >
                    <span>{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </div>
              <div className="p-0">
                {activeTab === 'skills' && analysis.skillGapAnalysis && (
                  <div className="animate-in fade-in"><SkillGapAnalysis data={analysis.skillGapAnalysis} /></div>
                )}
                {activeTab === 'readability' && analysis.readabilityAssessment && (
                  <div className="animate-in fade-in"><ReadabilityAssessment data={analysis.readabilityAssessment} /></div>
                )}
                {activeTab === 'impact' && analysis.impactAnalysis && (
                  <div className="animate-in fade-in"><ImpactAnalysis data={analysis.impactAnalysis} /></div>
                )}
                {activeTab === 'visibility' && analysis.recruiterSearchVisibility && (
                  <div className="animate-in fade-in"><RecruiterVisibility data={analysis.recruiterSearchVisibility} /></div>
                )}
              </div>
            </div>

            {/* CTA: Get Improvement Suggestions */}
            <div className="bg-canvas p-6 rounded-xl border border-hairline shadow-level-2">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-body-md-strong text-ink mb-1">Ready to improve your resume?</h3>
                  <p className="text-body-sm text-body">Get AI-powered rewrite suggestions with before → after comparisons and reasoning.</p>
                </div>
                <button onClick={handleGetSuggestions} className="btn-primary shadow-level-2 shrink-0">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="mr-1">
                    <path d="M13 10V3L4 14h7v7l9-11h-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Get Improvement Suggestions
                </button>
              </div>
            </div>
          </div>
        )}

        {appState === 'improving' && (
          <div className="flex flex-col items-center justify-center h-[400px] animate-in fade-in zoom-in-95">
            <div className="mesh-gradient w-24 h-24 rounded-full mb-8 animate-pulse shadow-level-4 flex items-center justify-center">
               <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-white animate-bounce"><path d="M13 10V3L4 14h7v7l9-11h-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <h3 className="text-display-md text-ink">Crafting improvement suggestions...</h3>
            <p className="text-body-md text-mute mt-2 text-center max-w-md">Our AI is writing recruiter-quality rewrites for your weakest bullet points using the STAR method.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Stepper Helpers
function StepIndicator({ step, label, current, activeStates }: { step: number, label: string, current: string, activeStates: string[] }) {
  const isActive = activeStates.includes(current);
  const stepsReached: Record<string, number> = {
    'upload': 1, 'analyzing': 1, 'results': 2, 'improving': 2, 'suggestions': 3
  };
  const isPast = stepsReached[current] > step;
  
  return (
    <div className="flex flex-col items-center gap-2 relative z-10">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-body-sm-strong transition-colors duration-300 ${
        isActive 
          ? 'bg-ink text-canvas shadow-level-2' 
          : 'bg-canvas border border-hairline text-mute'
      }`}>
        {isPast ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        ) : step}
      </div>
      <span className={`text-caption-mono ${isActive ? 'text-ink font-medium' : 'text-mute'}`}>{label}</span>
    </div>
  );
}

function StepLine({ active }: { active: boolean }) {
  return (
    <div className="flex-1 h-[2px] mx-2 -mt-6 bg-hairline relative overflow-hidden">
      <div className={`absolute top-0 left-0 h-full bg-ink transition-all duration-700 ease-in-out ${active ? 'w-full' : 'w-0'}`}></div>
    </div>
  );
}
