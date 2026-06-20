import { useEffect, useState } from 'react';

interface VisibilityData {
  score: number;
  titleAlignment: string;
  keyPhrases: string[];
  recommendations: string[];
}

interface RecruiterVisibilityProps {
  data: VisibilityData;
}

export function RecruiterVisibility({ data }: RecruiterVisibilityProps) {
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    const duration = 1200;
    const steps = 50;
    const stepTime = duration / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const easeProgress = currentStep === steps ? 1 : 1 - Math.pow(2, -10 * progress);
      setDisplayScore(Math.round(easeProgress * data.score));

      if (currentStep >= steps) {
        clearInterval(timer);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [data.score]);

  let barColor = 'bg-red-500';
  if (displayScore >= 80) barColor = 'bg-emerald-500';
  else if (displayScore >= 60) barColor = 'bg-blue-500';
  else if (displayScore >= 40) barColor = 'bg-amber-500';

  return (
    <div className="p-6">
      <div className="mb-6 border-b border-hairline pb-4">
        <h3 className="text-display-sm text-ink">Recruiter Search Visibility</h3>
        <p className="text-body-sm text-mute mt-1">
          How likely is a recruiter to find your profile when searching for candidates?
        </p>
      </div>

      {/* Score Bar */}
      <div className="mb-6">
        <div className="flex items-baseline justify-between mb-2">
          <span className="text-body-sm-strong text-ink">Visibility Score</span>
          <span className="text-display-sm font-bold text-ink">{displayScore}<span className="text-body-sm text-mute font-normal"> / 100</span></span>
        </div>
        <div className="w-full h-3 bg-canvas-soft-2 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ease-out ${barColor}`}
            style={{ width: `${displayScore}%` }}
          />
        </div>
      </div>

      {/* Title Alignment */}
      <div className="mb-6 p-4 bg-canvas-soft rounded-lg border border-hairline">
        <div className="text-caption-mono text-mute mb-2">TITLE ALIGNMENT</div>
        <p className="text-body-sm text-body">{data.titleAlignment}</p>
      </div>

      {/* Missing Key Phrases */}
      {data.keyPhrases && data.keyPhrases.length > 0 && (
        <div className="mb-6">
          <div className="text-caption-mono text-mute mb-3">MISSING KEY PHRASES</div>
          <div className="flex flex-wrap gap-2">
            {data.keyPhrases.map((phrase, i) => (
              <span key={i} className="badge bg-amber-50 text-amber-700 border border-amber-200">
                {phrase}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {data.recommendations && data.recommendations.length > 0 && (
        <div>
          <div className="text-caption-mono text-mute mb-3">RECOMMENDATIONS</div>
          <div className="flex flex-col gap-2">
            {data.recommendations.map((rec, i) => (
              <div key={i} className="flex items-start gap-2 text-body-sm text-body">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-link shrink-0 mt-0.5">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {rec}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
