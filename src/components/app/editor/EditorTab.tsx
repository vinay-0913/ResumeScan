import { useState } from 'react';
import type { StructuredResume, Improvement } from '../../../../lib/types';

interface EditorTabProps {
  resume: StructuredResume;
  suggestions: Improvement[];
  onUpdate: (updatedResume: StructuredResume) => void;
}

export function EditorTab({ resume, suggestions, onUpdate }: EditorTabProps) {
  const [appliedSuggestions, setAppliedSuggestions] = useState<Set<number>>(new Set());
  const [failedSuggestions, setFailedSuggestions] = useState<Set<number>>(new Set());
  const handleUpdateField = (section: keyof StructuredResume, index: number | null, field: string, value: string) => {
    const newResume = { ...resume };
    if (index !== null && Array.isArray(newResume[section])) {
      (newResume[section] as any)[index][field] = value;
    } else {
      (newResume[section] as any)[field] = value;
    }
    onUpdate(newResume);
  };

  const handleUpdateBullet = (section: 'experience', expIndex: number, bulletIndex: number, value: string) => {
    const newResume = { ...resume };
    newResume[section][expIndex].bullets[bulletIndex] = value;
    onUpdate(newResume);
  };

  const applySuggestion = (suggestion: Improvement) => {
    const newResume = { ...resume };
    let applied = false;

    // Normalize a string for comparison: lowercase, collapse whitespace, strip punctuation
    const normalize = (s: string) => s.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, ' ').trim();

    // Compute simple word-overlap similarity (Jaccard-like) between two strings
    const similarity = (a: string, b: string): number => {
      const wordsA = new Set(normalize(a).split(' '));
      const wordsB = new Set(normalize(b).split(' '));
      const intersection = [...wordsA].filter(w => wordsB.has(w)).length;
      const union = new Set([...wordsA, ...wordsB]).size;
      return union === 0 ? 0 : intersection / union;
    };

    const normalizedOriginal = normalize(suggestion.original);

    // First try exact match (after normalization)
    for (let i = 0; i < newResume.experience.length; i++) {
      for (let j = 0; j < newResume.experience[i].bullets.length; j++) {
        if (normalize(newResume.experience[i].bullets[j]) === normalizedOriginal) {
          newResume.experience[i].bullets[j] = suggestion.improved;
          applied = true;
          break;
        }
      }
      if (applied) break;
    }

    // If no exact normalized match, find the best fuzzy match above a threshold
    if (!applied) {
      let bestScore = 0;
      let bestI = -1;
      let bestJ = -1;

      for (let i = 0; i < newResume.experience.length; i++) {
        for (let j = 0; j < newResume.experience[i].bullets.length; j++) {
          const score = similarity(newResume.experience[i].bullets[j], suggestion.original);
          if (score > bestScore) {
            bestScore = score;
            bestI = i;
            bestJ = j;
          }
        }
      }

      // Also check summary field
      if (newResume.summary) {
        const summaryScore = similarity(newResume.summary, suggestion.original);
        if (summaryScore > bestScore) {
          bestScore = summaryScore;
          bestI = -1; // sentinel for summary
          bestJ = -1;
        }
      }

      if (bestScore >= 0.5) {
        if (bestI === -1) {
          // Apply to summary
          newResume.summary = suggestion.improved;
        } else {
          newResume.experience[bestI].bullets[bestJ] = suggestion.improved;
        }
        applied = true;
      }
    }

    if (applied) onUpdate(newResume);
    return applied;
  };

  return (
    <div className="p-6 flex flex-col gap-8 bg-canvas">
      {suggestions.length > 0 && (
        <div className="bg-link-bg-soft/30 border border-link/20 rounded-xl p-4 mb-4">
          <h4 className="text-body-sm-strong text-link-deep mb-2 flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M13 10V3L4 14h7v7l9-11h-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            AI Suggestions
          </h4>
          <div className="flex flex-col gap-3">
            {suggestions.slice(0, 3).map((s, i) => {
              const isApplied = appliedSuggestions.has(i);
              const isFailed = failedSuggestions.has(i);
              return (
              <div key={i} className={`bg-canvas border rounded p-3 text-caption ${
                isApplied ? 'border-emerald-300 bg-emerald-50/30' : 'border-hairline'
              }`}>
                <div className="line-through text-red-600 mb-1">{s.original}</div>
                <div className="text-emerald-700 font-medium mb-2">{s.improved}</div>
                {isApplied ? (
                  <span className="inline-flex items-center gap-1 py-1 px-3 text-caption text-emerald-700 font-medium">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    Applied
                  </span>
                ) : isFailed ? (
                  <span className="inline-flex items-center gap-1 py-1 px-3 text-caption text-red-600 font-medium">
                    Could not match — edit manually in the fields below
                  </span>
                ) : (
                  <button 
                    onClick={() => {
                      const success = applySuggestion(s);
                      if (success) {
                        setAppliedSuggestions(prev => new Set(prev).add(i));
                      } else {
                        setFailedSuggestions(prev => new Set(prev).add(i));
                      }
                    }}
                    className="btn-secondary py-1 px-3 text-caption"
                  >
                    Accept Change
                  </button>
                )}
              </div>);
            })}
          </div>
        </div>
      )}

      <SectionBlock title="Contact Info">
        <InputField label="Name" value={resume.contactInfo?.name || ''} onChange={(v) => handleUpdateField('contactInfo', null, 'name', v)} />
        <InputField label="Title" value={resume.contactInfo?.title || ''} onChange={(v) => handleUpdateField('contactInfo', null, 'title', v)} />
        <div className="grid grid-cols-2 gap-4">
          <InputField label="Email" value={resume.contactInfo?.email || ''} onChange={(v) => handleUpdateField('contactInfo', null, 'email', v)} />
          <InputField label="Phone" value={resume.contactInfo?.phone || ''} onChange={(v) => handleUpdateField('contactInfo', null, 'phone', v)} />
        </div>
      </SectionBlock>

      <SectionBlock title="Summary">
        <textarea 
          className="form-input h-24 py-2 resize-none" 
          value={resume.summary || ''} 
          onChange={(e) => handleUpdateField('summary', null, '', e.target.value)} 
          placeholder="Professional summary..."
        />
      </SectionBlock>

      <SectionBlock title="Experience">
        {resume.experience?.map((exp, i) => (
          <div key={i} className="mb-6 pb-6 border-b border-hairline last:border-0 last:mb-0 last:pb-0">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <InputField label="Company" value={exp.company} onChange={(v) => handleUpdateField('experience', i, 'company', v)} />
              <InputField label="Title" value={exp.title} onChange={(v) => handleUpdateField('experience', i, 'title', v)} />
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-caption text-mute">Bullets</span>
              {exp.bullets.map((bullet, j) => (
                <textarea 
                  key={j}
                  className="form-input h-auto min-h-16 py-2 leading-relaxed" 
                  value={bullet} 
                  onChange={(e) => handleUpdateBullet('experience', i, j, e.target.value)}
                />
              ))}
            </div>
          </div>
        ))}
      </SectionBlock>
    </div>
  );
}

function SectionBlock({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-body-md-strong text-ink pb-2 border-b border-hairline">{title}</h3>
      {children}
    </div>
  );
}

function InputField({ label, value, onChange }: { label: string, value: string, onChange: (v: string) => void }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-caption text-mute">{label}</label>
      <input 
        type="text" 
        className="form-input" 
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
      />
    </div>
  );
}
