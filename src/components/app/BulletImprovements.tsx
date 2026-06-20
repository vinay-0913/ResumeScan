


interface Improvement {
  original: string;
  improved: string;
  reasoning: string;
  section?: string;
  type?: string;
  impact?: string;
}

interface BulletImprovementsProps {
  improvements: Improvement[];
}

export function BulletImprovements({ improvements }: BulletImprovementsProps) {
  if (!improvements || improvements.length === 0) return null;

  const impactColor: Record<string, { bg: string; text: string; border: string }> = {
    'high': { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
    'medium': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
    'low': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  };

  return (
    <div className="bg-canvas border border-hairline rounded-xl shadow-level-2 p-6 flex flex-col">
      <div className="mb-6 border-b border-hairline pb-4 flex justify-between items-end">
        <div>
          <h3 className="text-display-sm text-ink">Resume Improvement Suggestions</h3>
          <p className="text-body-sm text-mute mt-1">
            Recruiter-quality rewrites to strengthen your resume. Each suggestion includes reasoning.
          </p>
        </div>
        <div className="flex items-center gap-3 text-caption shrink-0">
          <div className="flex items-center gap-1"><span className="w-3 h-3 bg-red-100 border border-red-200 rounded-sm"></span> High Impact</div>
          <div className="flex items-center gap-1"><span className="w-3 h-3 bg-amber-100 border border-amber-200 rounded-sm"></span> Medium</div>
          <div className="flex items-center gap-1"><span className="w-3 h-3 bg-blue-100 border border-blue-200 rounded-sm"></span> Low</div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar flex flex-col gap-5">
        {improvements.map((item, idx) => {
          const impact = impactColor[item.impact || 'medium'] || impactColor['medium'];
          return (
            <div key={idx} className="border border-hairline rounded-lg overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-2 bg-canvas-soft border-b border-hairline">
                <div className="flex items-center gap-2">
                  {item.section && (
                    <span className="text-caption-mono text-mute">{item.section}</span>
                  )}
                  {item.type && (
                    <span className="badge bg-canvas border border-hairline text-mute">
                      {item.type.replace(/_/g, ' ')}
                    </span>
                  )}
                </div>
                <span className={`badge ${impact.bg} ${impact.text} border ${impact.border}`}>
                  {item.impact || 'medium'} impact
                </span>
              </div>

              {/* Before / After */}
              <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Original */}
                <div className="p-4 border-b md:border-b-0 md:border-r border-hairline">
                  <div className="text-caption-mono text-red-600 mb-2 flex items-center gap-1">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    Before
                  </div>
                  <p className="text-body-sm text-body leading-relaxed">{item.original}</p>
                </div>

                {/* Improved */}
                <div className="p-4 bg-emerald-50/30">
                  <div className="text-caption-mono text-emerald-600 mb-2 flex items-center gap-1">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    After
                  </div>
                  <p className="text-body-sm text-ink leading-relaxed font-medium">{item.improved}</p>
                </div>
              </div>

              {/* Reasoning */}
              <div className="px-4 py-3 bg-canvas-soft border-t border-hairline">
                <div className="flex items-start gap-2 text-caption text-body">
                  <span className="shrink-0 mt-0.5">💡</span>
                  <span>{item.reasoning}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
