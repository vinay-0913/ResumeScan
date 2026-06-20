import { useEffect, useState } from 'react';
import type { AnalysisResult } from '../../../../lib/types';

interface ReportTabProps {
  analysis: AnalysisResult;
  onStartOver: () => void;
}

type ExpandedSection = 'searchability' | 'hardSkills' | 'formatting' | 'tips' | null;

export function ReportTab({ analysis, onStartOver }: ReportTabProps) {
  const [displayScore, setDisplayScore] = useState(0);
  const [expanded, setExpanded] = useState<ExpandedSection>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayScore(analysis.matchScore);
    }, 100);
    return () => clearTimeout(timer);
  }, [analysis.matchScore]);

  const toggle = (section: ExpandedSection) => {
    setExpanded(prev => prev === section ? null : section);
  };

  // Derived metrics
  const searchability = analysis.recruiterSearchVisibility?.score || 50;
  const hardSkillsCount = analysis.skillGapAnalysis?.strongMatches?.length || 0;
  const hardSkillsMissing = analysis.skillGapAnalysis?.missingCritical?.length || 0;
  const hardSkillsTotal = hardSkillsCount + hardSkillsMissing;
  const formattingScore = analysis.readabilityAssessment?.score === 'A' ? 100 : analysis.readabilityAssessment?.score === 'B' ? 80 : 60;
  const tipsCount = analysis.topRecommendations?.length || 0;

  const scoreMessage = analysis.matchScore >= 80 ? 'Great Match!' : analysis.matchScore >= 60 ? 'Good Start' : 'Keep improving!';

  return (
    <div className="flex flex-col h-full bg-canvas">
      <div className="p-6 flex-1 overflow-y-auto">
        {/* Score Ring Section */}
        <div className="flex items-center gap-6 mb-8 p-4 border border-hairline rounded-xl bg-canvas-soft shadow-level-1">
          <div className="relative flex items-center justify-center shrink-0 w-24 h-24">
            <svg height="96" width="96" className="transform -rotate-90">
              <circle stroke="#ebebeb" fill="transparent" strokeWidth="8" r="44" cx="48" cy="48" />
              <circle
                stroke={displayScore >= 80 ? '#059669' : displayScore >= 60 ? '#0070f3' : '#f59e0b'}
                fill="transparent"
                strokeWidth="8"
                strokeDasharray="276.46 276.46"
                style={{ strokeDashoffset: 276.46 - (displayScore / 100) * 276.46, transition: 'stroke-dashoffset 1s ease-out' }}
                strokeLinecap="round"
                r="44"
                cx="48"
                cy="48"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-display-md text-ink">{displayScore}</span>
            </div>
          </div>
          <div>
            <h3 className="text-body-md-strong text-ink">{scoreMessage}</h3>
            <p className="text-caption text-mute mt-1">Make recommended updates to reach a score of 75% or more.</p>
          </div>
        </div>

        {/* Categories - Expandable Accordion */}
        <div className="flex flex-col gap-3">

          {/* ─── Searchability ─── */}
          <AccordionSection
            label="Searchability"
            score={searchability}
            detail={`${searchability}% optimized`}
            color="blue"
            isExpanded={expanded === 'searchability'}
            onToggle={() => toggle('searchability')}
          >
            {/* Title Alignment */}
            {analysis.recruiterSearchVisibility?.titleAlignment && (
              <div className="mb-4">
                <h5 className="text-caption-mono text-mute mb-2 uppercase tracking-wider">Title Alignment</h5>
                <p className="text-body-sm text-ink">{analysis.recruiterSearchVisibility.titleAlignment}</p>
              </div>
            )}

            {/* Missing Key Phrases */}
            {analysis.recruiterSearchVisibility?.keyPhrases?.length > 0 && (
              <div className="mb-4">
                <h5 className="text-caption-mono text-mute mb-2 uppercase tracking-wider">Missing Key Phrases</h5>
                <div className="flex flex-wrap gap-2">
                  {analysis.recruiterSearchVisibility.keyPhrases.map((phrase: string, i: number) => (
                    <span key={i} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-caption font-medium bg-red-50 text-red-700 border border-red-200">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      {phrase}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            {analysis.recruiterSearchVisibility?.recommendations?.length > 0 && (
              <div>
                <h5 className="text-caption-mono text-mute mb-2 uppercase tracking-wider">Recommendations</h5>
                <ul className="flex flex-col gap-2">
                  {analysis.recruiterSearchVisibility.recommendations.map((rec: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-body-sm text-body">
                      <span className="shrink-0 mt-0.5 text-amber-500">💡</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </AccordionSection>

          {/* ─── Hard Skills ─── */}
          <AccordionSection
            label="Hard Skills"
            score={(hardSkillsCount / Math.max(hardSkillsTotal, 1)) * 100}
            detail={`${hardSkillsMissing} of ${hardSkillsTotal} skills are missing`}
            color="red"
            isExpanded={expanded === 'hardSkills'}
            onToggle={() => toggle('hardSkills')}
          >
            {/* Present / Strong Matches */}
            {analysis.skillGapAnalysis?.strongMatches?.length > 0 && (
              <div className="mb-4">
                <h5 className="text-caption-mono text-mute mb-2 uppercase tracking-wider">Present Skills</h5>
                <div className="flex flex-wrap gap-2">
                  {analysis.skillGapAnalysis.strongMatches.map((item: any, i: number) => (
                    <span key={i} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-caption font-medium bg-emerald-50 text-emerald-700 border border-emerald-200" title={item.evidence}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      {item.skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Partial Matches */}
            {analysis.skillGapAnalysis?.partialMatches?.length > 0 && (
              <div className="mb-4">
                <h5 className="text-caption-mono text-mute mb-2 uppercase tracking-wider">Partial Matches</h5>
                <div className="flex flex-wrap gap-2">
                  {analysis.skillGapAnalysis.partialMatches.map((item: any, i: number) => (
                    <span key={i} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-caption font-medium bg-amber-50 text-amber-700 border border-amber-200" title={item.gap}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" /><path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                      {item.skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Missing Critical */}
            {analysis.skillGapAnalysis?.missingCritical?.length > 0 && (
              <div className="mb-4">
                <h5 className="text-caption-mono text-mute mb-2 uppercase tracking-wider">Missing Critical Skills</h5>
                <div className="flex flex-wrap gap-2">
                  {analysis.skillGapAnalysis.missingCritical.map((item: any, i: number) => (
                    <span key={i} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-caption font-medium bg-red-50 text-red-700 border border-red-200" title={item.importance}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      {item.skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Bonus Skills */}
            {analysis.skillGapAnalysis?.bonusSkills?.length > 0 && (
              <div>
                <h5 className="text-caption-mono text-mute mb-2 uppercase tracking-wider">Bonus Skills</h5>
                <div className="flex flex-wrap gap-2">
                  {analysis.skillGapAnalysis.bonusSkills.map((item: any, i: number) => (
                    <span key={i} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-caption font-medium bg-blue-50 text-blue-700 border border-blue-200" title={item.note}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      {item.skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </AccordionSection>

          {/* ─── Formatting ─── */}
          <AccordionSection
            label="Formatting"
            score={formattingScore}
            detail={`Grade: ${analysis.readabilityAssessment?.score || 'N/A'}`}
            color="green"
            isExpanded={expanded === 'formatting'}
            onToggle={() => toggle('formatting')}
          >
            {/* Overall Assessment */}
            {analysis.readabilityAssessment?.formatting && (
              <div className="mb-4">
                <h5 className="text-caption-mono text-mute mb-2 uppercase tracking-wider">Overall Assessment</h5>
                <p className="text-body-sm text-ink">{analysis.readabilityAssessment.formatting}</p>
              </div>
            )}

            {/* Strengths (Present) */}
            {analysis.readabilityAssessment?.strengths?.length > 0 && (
              <div className="mb-4">
                <h5 className="text-caption-mono text-mute mb-2 uppercase tracking-wider">Present</h5>
                <div className="flex flex-col gap-2">
                  {analysis.readabilityAssessment.strengths.map((item: string, i: number) => (
                    <div key={i} className="flex items-start gap-2 text-body-sm">
                      <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </span>
                      <span className="text-ink">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Issues (Missing) */}
            {analysis.readabilityAssessment?.issues?.length > 0 && (
              <div>
                <h5 className="text-caption-mono text-mute mb-2 uppercase tracking-wider">Issues Found</h5>
                <div className="flex flex-col gap-2">
                  {analysis.readabilityAssessment.issues.map((item: string, i: number) => (
                    <div key={i} className="flex items-start gap-2 text-body-sm">
                      <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </span>
                      <span className="text-body">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </AccordionSection>

          {/* ─── Recruiter Tips ─── */}
          <AccordionSection
            label="Recruiter Tips"
            score={0}
            detail={`${tipsCount} areas to improve`}
            color="blue"
            isProgress={false}
            isExpanded={expanded === 'tips'}
            onToggle={() => toggle('tips')}
          >
            {analysis.topRecommendations?.length > 0 && (
              <div className="flex flex-col gap-3">
                {analysis.topRecommendations.map((tip: string, i: number) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-canvas-soft border border-hairline">
                    <span className="shrink-0 w-6 h-6 rounded-full bg-link/10 text-link flex items-center justify-center text-caption-mono font-bold">{i + 1}</span>
                    <p className="text-body-sm text-ink leading-relaxed">{tip}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Overall Summary */}
            {analysis.overallSummary && (
              <div className="mt-4 p-3 rounded-lg bg-amber-50/50 border border-amber-200/50">
                <h5 className="text-caption-mono text-amber-700 mb-1 uppercase tracking-wider">Recruiter Summary</h5>
                <p className="text-body-sm text-body leading-relaxed">{analysis.overallSummary}</p>
              </div>
            )}
          </AccordionSection>

        </div>
      </div>

      <div className="p-6 border-t border-hairline bg-canvas-soft shrink-0">
        <button onClick={onStartOver} className="btn-secondary w-full">
          New Scan
        </button>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────── */
/*  AccordionSection — click-to-expand metric  */
/* ──────────────────────────────────────────── */
function AccordionSection({
  label, score, detail, color = 'blue', isProgress = true, isExpanded, onToggle, children
}: {
  label: string;
  score: number;
  detail: string;
  color?: 'blue' | 'red' | 'green';
  isProgress?: boolean;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  const colorMap = {
    blue: 'bg-link',
    red: 'bg-error',
    green: 'bg-success'
  };

  const borderHighlight = {
    blue: 'border-link/30',
    red: 'border-red-300',
    green: 'border-emerald-300'
  };

  return (
    <div className={`rounded-xl border transition-all duration-300 ${isExpanded ? `${borderHighlight[color]} shadow-level-1 bg-canvas` : 'border-hairline bg-canvas hover:bg-canvas-soft'
      }`}>
      {/* Clickable Header */}
      <button
        onClick={onToggle}
        className="w-full flex flex-col gap-2 p-4 cursor-pointer text-left group"
      >
        <div className="flex justify-between items-center">
          <span className={`text-body-sm-strong transition-colors ${isExpanded ? 'text-ink' : 'text-ink group-hover:text-link'}`}>
            {label}
          </span>
          <svg
            width="16" height="16" viewBox="0 0 24 24" fill="none"
            className={`text-mute transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`}
          >
            <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <span className="text-caption text-mute">{detail}</span>
        {isProgress && (
          <div className="h-1.5 w-full bg-hairline rounded-full overflow-hidden mt-1">
            <div className={`h-full ${colorMap[color]} rounded-full transition-all duration-700`} style={{ width: `${Math.max(score, 5)}%` }} />
          </div>
        )}
        {!isProgress && (
          <div className="h-1.5 w-full bg-transparent mt-1" />
        )}
      </button>

      {/* Expandable Content */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
          }`}
      >
        <div className="px-4 pb-4 pt-1 border-t border-hairline">
          {children}
        </div>
      </div>
    </div>
  );
}
