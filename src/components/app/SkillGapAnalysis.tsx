import { useState } from 'react';

interface SkillItem {
  skill: string;
  evidence?: string;
  gap?: string;
  importance?: string;
  note?: string;
}

interface SkillGapData {
  strongMatches: SkillItem[];
  partialMatches: SkillItem[];
  missingCritical: SkillItem[];
  bonusSkills: SkillItem[];
}

interface SkillGapAnalysisProps {
  data: SkillGapData;
}

type CategoryKey = keyof SkillGapData;

const CATEGORIES: { key: CategoryKey; label: string; icon: string; color: string; bgColor: string; borderColor: string; detailKey: string; detailLabel: string }[] = [
  {
    key: 'strongMatches',
    label: 'Strong Matches',
    icon: '✓',
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    detailKey: 'evidence',
    detailLabel: 'Evidence',
  },
  {
    key: 'partialMatches',
    label: 'Partial Matches',
    icon: '◐',
    color: 'text-amber-700',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    detailKey: 'gap',
    detailLabel: 'Gap',
  },
  {
    key: 'missingCritical',
    label: 'Missing Critical',
    icon: '✕',
    color: 'text-red-700',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    detailKey: 'importance',
    detailLabel: 'Why it matters',
  },
  {
    key: 'bonusSkills',
    label: 'Bonus Skills',
    icon: '★',
    color: 'text-violet-700',
    bgColor: 'bg-violet-50',
    borderColor: 'border-violet-200',
    detailKey: 'note',
    detailLabel: 'Value',
  },
];

export function SkillGapAnalysis({ data }: SkillGapAnalysisProps) {
  const [expandedCategory, setExpandedCategory] = useState<CategoryKey | null>('strongMatches');

  return (
    <div className="p-6 overflow-hidden">
      <div className="mb-6 border-b border-hairline pb-4">
        <h3 className="text-display-sm text-ink">Skill Gap Analysis</h3>
        <p className="text-body-sm text-mute mt-1">
          How a recruiter evaluates your skills against the job requirements.
        </p>
      </div>

      {/* Category Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {CATEGORIES.map(cat => {
          const count = data[cat.key]?.length || 0;
          const isExpanded = expandedCategory === cat.key;
          return (
            <button
              key={cat.key}
              onClick={() => setExpandedCategory(isExpanded ? null : cat.key)}
              className={`flex flex-col items-center p-3 rounded-lg border transition-all cursor-pointer ${
                isExpanded
                  ? `${cat.bgColor} ${cat.borderColor} shadow-level-1`
                  : 'border-hairline hover:border-hairline-strong bg-canvas-soft'
              }`}
            >
              <span className={`text-2xl mb-1`}>{cat.icon}</span>
              <span className={`text-display-sm font-bold ${isExpanded ? cat.color : 'text-ink'}`}>{count}</span>
              <span className="text-caption text-mute text-center">{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Expanded Skills List */}
      <div className="max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {CATEGORIES.map(cat => {
          if (expandedCategory !== cat.key) return null;
          const items = data[cat.key] || [];
          if (items.length === 0) {
            return (
              <div key={cat.key} className="text-center py-8 text-body-sm text-mute italic">
                No {cat.label.toLowerCase()} found.
              </div>
            );
          }

          return (
            <div key={cat.key} className="flex flex-col gap-3 animate-in fade-in">
              {items.map((item, i) => (
                <div
                  key={i}
                  className={`p-4 rounded-lg border ${cat.borderColor} ${cat.bgColor} transition-all`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-body-sm-strong ${cat.color}`}>{item.skill}</span>
                  </div>
                  {(item as any)[cat.detailKey] && (
                    <div className="text-body-sm text-body">
                      <span className="text-caption-mono text-mute">{cat.detailLabel}:</span>{' '}
                      {(item as any)[cat.detailKey]}
                    </div>
                  )}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
