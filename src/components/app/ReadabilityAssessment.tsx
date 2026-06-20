


interface ReadabilityData {
  score: string;
  formatting: string;
  issues: string[];
  strengths: string[];
}

interface ReadabilityAssessmentProps {
  data: ReadabilityData;
}

const GRADE_CONFIG: Record<string, { color: string; bg: string; border: string }> = {
  'A+': { color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-300' },
  'A':  { color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-300' },
  'A-': { color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  'B+': { color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-300' },
  'B':  { color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200' },
  'B-': { color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
  'C+': { color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-300' },
  'C':  { color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' },
  'C-': { color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
  'D':  { color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
  'F':  { color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-300' },
};

export function ReadabilityAssessment({ data }: ReadabilityAssessmentProps) {
  const grade = GRADE_CONFIG[data.score] || GRADE_CONFIG['C'];

  return (
    <div className="p-6">
      <div className="flex items-start justify-between mb-6 border-b border-hairline pb-4">
        <div>
          <h3 className="text-display-sm text-ink">Resume Readability</h3>
          <p className="text-body-sm text-mute mt-1">How easy is it for a recruiter to scan your resume?</p>
        </div>
        <div className={`w-14 h-14 rounded-xl ${grade.bg} ${grade.border} border-2 flex items-center justify-center shrink-0`}>
          <span className={`text-display-md font-bold ${grade.color}`}>{data.score}</span>
        </div>
      </div>

      {/* Formatting Summary */}
      <div className="mb-6 p-4 bg-canvas-soft rounded-lg border border-hairline">
        <div className="text-caption-mono text-mute mb-2">FORMATTING OVERVIEW</div>
        <p className="text-body-sm text-body">{data.formatting}</p>
      </div>

      {/* Strengths & Issues */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Strengths */}
        <div className="border border-emerald-200 bg-emerald-50/50 rounded-lg p-4">
          <div className="text-caption-mono text-emerald-700 mb-3 flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Strengths
          </div>
          <div className="flex flex-col gap-2">
            {data.strengths && data.strengths.length > 0 ? (
              data.strengths.map((s, i) => (
                <div key={i} className="flex items-start gap-2 text-body-sm text-body">
                  <span className="text-emerald-500 mt-0.5 shrink-0">•</span>
                  {s}
                </div>
              ))
            ) : (
              <span className="text-body-sm text-mute italic">None identified</span>
            )}
          </div>
        </div>

        {/* Issues */}
        <div className="border border-red-200 bg-red-50/50 rounded-lg p-4">
          <div className="text-caption-mono text-red-700 mb-3 flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Issues to Fix
          </div>
          <div className="flex flex-col gap-2">
            {data.issues && data.issues.length > 0 ? (
              data.issues.map((issue, i) => (
                <div key={i} className="flex items-start gap-2 text-body-sm text-body">
                  <span className="text-red-400 mt-0.5 shrink-0">•</span>
                  {issue}
                </div>
              ))
            ) : (
              <span className="text-body-sm text-emerald-600 italic">No issues found!</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
