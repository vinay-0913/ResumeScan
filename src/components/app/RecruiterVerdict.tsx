import { useEffect, useState } from 'react';

interface RecruiterVerdictProps {
  matchScore: number;
  shortlistProbability: string;
  shortlistReasoning: string;
  overallSummary: string;
  topRecommendations: string[];
}

export function RecruiterVerdict({
  matchScore,
  shortlistProbability,
  shortlistReasoning,
  overallSummary,
  topRecommendations,
}: RecruiterVerdictProps) {
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const stepTime = duration / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const easeProgress = currentStep === steps ? 1 : 1 - Math.pow(2, -10 * progress);
      setDisplayScore(Math.round(easeProgress * matchScore));

      if (currentStep >= steps) {
        clearInterval(timer);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [matchScore]);

  // Probability color mapping
  const probConfig: Record<string, { color: string; bg: string; border: string; icon: string }> = {
    'Highly Likely': { color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', icon: '🟢' },
    'Likely': { color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', icon: '🔵' },
    'Maybe': { color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', icon: '🟡' },
    'Unlikely': { color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', icon: '🔴' },
  };

  const prob = probConfig[shortlistProbability] || probConfig['Maybe'];

  // Score color
  let scoreColor = '#ee0000';
  let scoreLabel = 'Needs Work';
  if (displayScore >= 85) {
    scoreColor = '#059669';
    scoreLabel = 'Excellent Match';
  } else if (displayScore >= 70) {
    scoreColor = '#0070f3';
    scoreLabel = 'Strong Match';
  } else if (displayScore >= 50) {
    scoreColor = '#f59e0b';
    scoreLabel = 'Moderate Match';
  }

  const radius = 64;
  const strokeWidth = 10;
  const normalizedRadius = radius - strokeWidth;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (displayScore / 100) * circumference;

  return (
    <div className="flex flex-col gap-6">
      {/* Score + Shortlist Row */}
      <div className="bg-canvas border border-hairline rounded-xl shadow-level-2 p-6">
        <div className="flex flex-col sm:flex-row items-center gap-8">
          {/* Score Gauge */}
          <div className="flex flex-col items-center shrink-0">
            <div className="relative flex items-center justify-center">
              <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
                <circle
                  stroke="#f5f5f5"
                  fill="transparent"
                  strokeWidth={strokeWidth}
                  r={normalizedRadius}
                  cx={radius}
                  cy={radius}
                />
                <circle
                  stroke={scoreColor}
                  fill="transparent"
                  strokeWidth={strokeWidth}
                  strokeDasharray={circumference + ' ' + circumference}
                  style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.1s linear' }}
                  strokeLinecap="round"
                  r={normalizedRadius}
                  cx={radius}
                  cy={radius}
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-3xl font-bold tracking-tight" style={{ color: scoreColor }}>
                  {displayScore}
                </span>
                <span className="text-caption text-mute">/ 100</span>
              </div>
            </div>
            <span className="text-body-sm-strong text-ink mt-2">{scoreLabel}</span>
          </div>

          {/* Shortlist Verdict */}
          <div className="flex-1 text-center sm:text-left">
            <div className="text-caption-mono text-mute mb-2">RECRUITER SHORTLIST VERDICT</div>
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${prob.bg} ${prob.border} mb-3`}>
              <span>{prob.icon}</span>
              <span className={`text-body-md-strong ${prob.color}`}>{shortlistProbability}</span>
            </div>
            <p className="text-body-sm text-body mt-2">{shortlistReasoning}</p>
          </div>
        </div>
      </div>

      {/* Overall Summary */}
      <div className="bg-canvas border border-hairline rounded-xl shadow-level-2 p-6">
        <div className="flex items-center gap-2 mb-3">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-link">
            <path d="M15.5 3.5a2.121 2.121 0 113 3L7.5 17.5H4.5v-3L15.5 3.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <h3 className="text-body-md-strong text-ink">Recruiter's Assessment</h3>
        </div>
        <p className="text-body-md text-body leading-relaxed">{overallSummary}</p>
      </div>

      {/* Top Recommendations */}
      {topRecommendations && topRecommendations.length > 0 && (
        <div className="bg-canvas border border-hairline rounded-xl shadow-level-2 p-6">
          <div className="flex items-center gap-2 mb-4">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-warning">
              <path d="M13 10V3L4 14h7v7l9-11h-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <h3 className="text-body-md-strong text-ink">Top Recommendations</h3>
          </div>
          <div className="flex flex-col gap-3">
            {topRecommendations.map((rec, i) => (
              <div key={i} className="flex items-start gap-3 pl-1">
                <span className="shrink-0 w-6 h-6 rounded-full bg-ink text-on-primary text-caption flex items-center justify-center font-medium mt-0.5">
                  {i + 1}
                </span>
                <p className="text-body-sm text-body">{rec}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
