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

  const handleUpdateBullet = (expIndex: number, bulletIndex: number, value: string) => {
    const newResume = { ...resume };
    newResume.experience[expIndex].bullets[bulletIndex] = value;
    onUpdate(newResume);
  };

  const handleAddBullet = (expIndex: number) => {
    const newResume = { ...resume };
    newResume.experience[expIndex].bullets.push('');
    onUpdate(newResume);
  };

  const handleRemoveBullet = (expIndex: number, bulletIndex: number) => {
    const newResume = { ...resume };
    newResume.experience[expIndex].bullets.splice(bulletIndex, 1);
    onUpdate(newResume);
  };

  const handleUpdateSkillItem = (catIndex: number, itemIndex: number, value: string) => {
    const newResume = { ...resume };
    newResume.skills[catIndex].items[itemIndex] = value;
    onUpdate(newResume);
  };

  const handleAddSkillItem = (catIndex: number) => {
    const newResume = { ...resume };
    newResume.skills[catIndex].items.push('');
    onUpdate(newResume);
  };

  const handleRemoveSkillItem = (catIndex: number, itemIndex: number) => {
    const newResume = { ...resume };
    newResume.skills[catIndex].items.splice(itemIndex, 1);
    onUpdate(newResume);
  };

  const applySuggestion = (suggestion: Improvement) => {
    const newResume = { ...resume };
    let applied = false;

    const normalize = (s: string) => s.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, ' ').trim();

    const similarity = (a: string, b: string): number => {
      const wordsA = new Set(normalize(a).split(' '));
      const wordsB = new Set(normalize(b).split(' '));
      const intersection = [...wordsA].filter(w => wordsB.has(w)).length;
      const union = new Set([...wordsA, ...wordsB]).size;
      return union === 0 ? 0 : intersection / union;
    };

    const normalizedOriginal = normalize(suggestion.original);

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

      if (newResume.summary) {
        const summaryScore = similarity(newResume.summary, suggestion.original);
        if (summaryScore > bestScore) {
          bestScore = summaryScore;
          bestI = -1;
          bestJ = -1;
        }
      }

      if (bestScore >= 0.5) {
        if (bestI === -1) {
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

      {/* ── Contact Info ── */}
      <SectionBlock title="Contact Info">
        <InputField label="Full Name" value={resume.contactInfo?.name || ''} onChange={(v) => handleUpdateField('contactInfo', null, 'name', v)} />
        <InputField label="Job Title" value={resume.contactInfo?.title || ''} onChange={(v) => handleUpdateField('contactInfo', null, 'title', v)} />
        <div className="grid grid-cols-2 gap-4">
          <InputField label="Email" value={resume.contactInfo?.email || ''} onChange={(v) => handleUpdateField('contactInfo', null, 'email', v)} />
          <InputField label="Phone" value={resume.contactInfo?.phone || ''} onChange={(v) => handleUpdateField('contactInfo', null, 'phone', v)} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <InputField label="LinkedIn" value={resume.contactInfo?.linkedin || ''} onChange={(v) => handleUpdateField('contactInfo', null, 'linkedin', v)} />
          <InputField label="Location" value={resume.contactInfo?.location || ''} onChange={(v) => handleUpdateField('contactInfo', null, 'location', v)} />
        </div>
      </SectionBlock>

      {/* ── Summary ── */}
      <SectionBlock title="Summary">
        <textarea
          className="form-input h-24 py-2 resize-none"
          value={resume.summary || ''}
          onChange={(e) => handleUpdateField('summary', null, '', e.target.value)}
          placeholder="Professional summary..."
        />
      </SectionBlock>

      {/* ── Experience ── */}
      {resume.experience?.length > 0 && (
        <SectionBlock title="Experience">
          {resume.experience.map((exp, i) => (
            <div key={i} className="mb-6 pb-6 border-b border-hairline last:border-0 last:mb-0 last:pb-0">
              <div className="grid grid-cols-2 gap-4 mb-3">
                <InputField label="Company" value={exp.company || ''} onChange={(v) => handleUpdateField('experience', i, 'company', v)} />
                <InputField label="Job Title" value={exp.title || ''} onChange={(v) => handleUpdateField('experience', i, 'title', v)} />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-3">
                <InputField label="Start Date" value={exp.startDate || ''} onChange={(v) => handleUpdateField('experience', i, 'startDate', v)} />
                <InputField label="End Date" value={exp.endDate || ''} onChange={(v) => handleUpdateField('experience', i, 'endDate', v)} />
              </div>
              {exp.location !== undefined && (
                <div className="mb-3">
                  <InputField label="Location" value={exp.location || ''} onChange={(v) => handleUpdateField('experience', i, 'location', v)} />
                </div>
              )}
              <div className="flex flex-col gap-2">
                <span className="text-caption text-mute">Bullets</span>
                {exp.bullets.map((bullet, j) => (
                  <div key={j} className="flex gap-2 items-start">
                    <textarea
                      className="form-input flex-1 h-auto min-h-16 py-2 leading-relaxed"
                      value={bullet}
                      onChange={(e) => handleUpdateBullet(i, j, e.target.value)}
                    />
                    <button
                      onClick={() => handleRemoveBullet(i, j)}
                      className="mt-2 text-mute hover:text-red-500 transition-colors p-1 shrink-0"
                      title="Remove bullet"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => handleAddBullet(i)}
                  className="text-caption text-link hover:underline self-start mt-1"
                >
                  + Add bullet
                </button>
              </div>
            </div>
          ))}
        </SectionBlock>
      )}

      {/* ── Education ── */}
      {resume.education?.length > 0 && (
        <SectionBlock title="Education">
          {resume.education.map((edu, i) => (
            <div key={i} className="mb-4 pb-4 border-b border-hairline last:border-0 last:mb-0 last:pb-0">
              <div className="grid grid-cols-2 gap-4 mb-3">
                <InputField label="Institution" value={edu.institution || ''} onChange={(v) => handleUpdateField('education', i, 'institution', v)} />
                <InputField label="Degree" value={edu.degree || ''} onChange={(v) => handleUpdateField('education', i, 'degree', v)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <InputField label="Field of Study" value={edu.field || ''} onChange={(v) => handleUpdateField('education', i, 'field', v)} />
                <InputField label="Graduation Date" value={edu.graduationDate || ''} onChange={(v) => handleUpdateField('education', i, 'graduationDate', v)} />
              </div>
              {edu.gpa && (
                <div className="mt-3">
                  <InputField label="GPA" value={edu.gpa || ''} onChange={(v) => handleUpdateField('education', i, 'gpa', v)} />
                </div>
              )}
            </div>
          ))}
        </SectionBlock>
      )}

      {/* ── Skills ── */}
      {resume.skills?.length > 0 && (
        <SectionBlock title="Skills">
          {resume.skills.map((skillCat, catIndex) => (
            <div key={catIndex} className="mb-4 pb-4 border-b border-hairline last:border-0 last:mb-0 last:pb-0">
              <InputField
                label="Category"
                value={skillCat.category || ''}
                onChange={(v) => {
                  const newResume = { ...resume };
                  newResume.skills[catIndex].category = v;
                  onUpdate(newResume);
                }}
              />
              <div className="mt-3">
                <span className="text-caption text-mute block mb-2">Items</span>
                <div className="flex flex-wrap gap-2">
                  {skillCat.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-center gap-1 bg-canvas-soft border border-hairline rounded-lg px-2 py-1">
                      <input
                        type="text"
                        className="bg-transparent text-caption text-ink outline-none"
                        style={{ width: `${Math.max(48, item.length * 8)}px` }}
                        value={item}
                        onChange={(e) => handleUpdateSkillItem(catIndex, itemIndex, e.target.value)}
                      />
                      <button
                        onClick={() => handleRemoveSkillItem(catIndex, itemIndex)}
                        className="text-mute hover:text-red-500 transition-colors ml-1"
                        title="Remove skill"
                      >
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => handleAddSkillItem(catIndex)}
                    className="text-caption text-link border border-dashed border-link/40 rounded-lg px-2 py-1 hover:bg-link-bg-soft/30 transition-colors"
                  >
                    + Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </SectionBlock>
      )}

      {/* ── Certifications ── */}
      {resume.certifications && resume.certifications.length > 0 && (
        <SectionBlock title="Certifications">
          {resume.certifications.map((cert, i) => (
            <div key={i} className="mb-4 pb-4 border-b border-hairline last:border-0 last:mb-0 last:pb-0">
              <InputField
                label="Certification Name"
                value={cert.name || ''}
                onChange={(v) => {
                  const newResume = { ...resume };
                  newResume.certifications![i] = { ...cert, name: v };
                  onUpdate(newResume);
                }}
              />
              <div className="grid grid-cols-2 gap-4 mt-3">
                <InputField
                  label="Issuer"
                  value={cert.issuer || ''}
                  onChange={(v) => {
                    const newResume = { ...resume };
                    newResume.certifications![i] = { ...cert, issuer: v };
                    onUpdate(newResume);
                  }}
                />
                <InputField
                  label="Date"
                  value={cert.date || ''}
                  onChange={(v) => {
                    const newResume = { ...resume };
                    newResume.certifications![i] = { ...cert, date: v };
                    onUpdate(newResume);
                  }}
                />
              </div>
            </div>
          ))}
        </SectionBlock>
      )}

      {/* ── Projects ── */}
      {resume.projects && resume.projects.length > 0 && (
        <SectionBlock title="Projects">
          {resume.projects.map((project, i) => (
            <div key={i} className="mb-4 pb-4 border-b border-hairline last:border-0 last:mb-0 last:pb-0">
              <InputField
                label="Project Name"
                value={project.name || ''}
                onChange={(v) => {
                  const newResume = { ...resume };
                  newResume.projects![i] = { ...project, name: v };
                  onUpdate(newResume);
                }}
              />
              <div className="mt-3">
                <label className="text-caption text-mute block mb-1">Description</label>
                <textarea
                  className="form-input h-20 py-2 resize-none w-full"
                  value={project.description || ''}
                  onChange={(e) => {
                    const newResume = { ...resume };
                    newResume.projects![i] = { ...project, description: e.target.value };
                    onUpdate(newResume);
                  }}
                  placeholder="Project description..."
                />
              </div>
              <div className="mt-3">
                <label className="text-caption text-mute block mb-1">Technologies (comma-separated)</label>
                <input
                  type="text"
                  className="form-input"
                  value={(project.tech || []).join(', ')}
                  onChange={(e) => {
                    const newResume = { ...resume };
                    newResume.projects![i] = { ...project, tech: e.target.value.split(',').map(t => t.trim()).filter(Boolean) };
                    onUpdate(newResume);
                  }}
                  placeholder="React, Node.js, PostgreSQL..."
                />
              </div>
            </div>
          ))}
        </SectionBlock>
      )}
    </div>
  );
}

function SectionBlock({ title, children }: { title: string; children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div className="flex flex-col gap-3">
      <button
        onClick={() => setCollapsed(c => !c)}
        className="flex items-center justify-between pb-2 border-b border-hairline w-full text-left"
      >
        <h3 className="text-body-md-strong text-ink">{title}</h3>
        <svg
          className={`w-4 h-4 text-mute transition-transform duration-200 ${collapsed ? '-rotate-90' : ''}`}
          viewBox="0 0 24 24" fill="none"
        >
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {!collapsed && <div className="flex flex-col gap-3">{children}</div>}
    </div>
  );
}

function InputField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
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
