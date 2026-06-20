


interface BulletItem {
  text: string;
  why?: string;
  issue?: string;
  suggestion?: string;
}

interface ImpactData {
  strongBullets: BulletItem[];
  weakBullets: BulletItem[];
}

interface ImpactAnalysisProps {
  data: ImpactData;
}

export function ImpactAnalysis({ data }: ImpactAnalysisProps) {
  return (
    <div className="p-6">
      <div className="mb-6 border-b border-hairline pb-4">
        <h3 className="text-display-sm text-ink">Impact Analysis</h3>
        <p className="text-body-sm text-mute mt-1">
          How well do your bullet points demonstrate measurable impact?
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Strong Bullets */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-emerald-600">
                <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-body-sm-strong text-emerald-700">Strong Bullets</span>
            <span className="text-caption text-mute ml-auto">{data.strongBullets?.length || 0} found</span>
          </div>

          <div className="flex flex-col gap-3">
            {data.strongBullets && data.strongBullets.length > 0 ? (
              data.strongBullets.map((bullet, i) => (
                <div key={i} className="p-3 rounded-lg border border-emerald-200 bg-emerald-50/50">
                  <p className="text-body-sm text-ink mb-2 leading-relaxed">"{bullet.text}"</p>
                  {bullet.why && (
                    <div className="flex items-start gap-1.5 text-caption text-emerald-700">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="mt-0.5 shrink-0">
                        <path d="M13 10V3L4 14h7v7l9-11h-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      {bullet.why}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-body-sm text-mute italic p-4 text-center bg-canvas-soft rounded-lg">
                No strong impact bullets found — this is an area to improve.
              </div>
            )}
          </div>
        </div>

        {/* Weak Bullets */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-red-600">
                <path d="M12 8v4m0 4h.01" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-body-sm-strong text-red-700">Needs Improvement</span>
            <span className="text-caption text-mute ml-auto">{data.weakBullets?.length || 0} found</span>
          </div>

          <div className="flex flex-col gap-3">
            {data.weakBullets && data.weakBullets.length > 0 ? (
              data.weakBullets.map((bullet, i) => (
                <div key={i} className="p-3 rounded-lg border border-red-200 bg-red-50/50">
                  <p className="text-body-sm text-ink mb-2 leading-relaxed">"{bullet.text}"</p>
                  {bullet.issue && (
                    <div className="flex items-start gap-1.5 text-caption text-red-700 mb-1">
                      <span className="shrink-0 mt-0.5">⚠</span>
                      <span><strong>Issue:</strong> {bullet.issue}</span>
                    </div>
                  )}
                  {bullet.suggestion && (
                    <div className="flex items-start gap-1.5 text-caption text-blue-700">
                      <span className="shrink-0 mt-0.5">💡</span>
                      <span><strong>Fix:</strong> {bullet.suggestion}</span>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-body-sm text-emerald-600 italic p-4 text-center bg-emerald-50/30 rounded-lg border border-emerald-100">
                All bullets have strong impact — great work!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
