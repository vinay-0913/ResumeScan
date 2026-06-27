import { useRef } from 'react';
import type { StructuredResume } from '../../../../lib/types';

// ─── Editable inline helper ───────────────────────────────────────────────────
// Renders any tag as contentEditable. Syncs to parent on blur only,
// so typing never triggers re-renders mid-edit.
function E({
  value,
  onChange,
  className = '',
  tag: Tag = 'span',
  multiline = false,
}: {
  value: string;
  onChange: (v: string) => void;
  className?: string;
  tag?: keyof React.JSX.IntrinsicElements;
  multiline?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  return (
    <Tag
      ref={ref as any}
      contentEditable
      suppressContentEditableWarning
      spellCheck={false}
      className={`outline-none rounded focus-visible:ring-1 focus-visible:ring-blue-400/60 cursor-text hover:bg-blue-50/40 transition-colors ${className}`}
      onBlur={(e) => {
        const text = (e.currentTarget as HTMLElement).innerText.trim();
        if (text !== value) onChange(text);
      }}
      onKeyDown={(e) => {
        if (!multiline && e.key === 'Enter') { e.preventDefault(); (e.currentTarget as HTMLElement).blur(); }
      }}
      dangerouslySetInnerHTML={{ __html: value ?? '' }}
    />
  );
}

// ─── Template ────────────────────────────────────────────────────────────────
export function ProfessionalTemplate({
  resume,
  onUpdate,
}: {
  resume: StructuredResume;
  onUpdate?: (r: StructuredResume) => void;
}) {
  const u = onUpdate; // shorthand

  // Immutable updater helpers
  const setContact = (field: string, v: string) =>
    u?.({ ...resume, contactInfo: { ...resume.contactInfo, [field]: v } });

  const setSummary = (v: string) => u?.({ ...resume, summary: v });

  const setExpField = (i: number, field: string, v: string) => {
    const exp = resume.experience.map((e, idx) => idx === i ? { ...e, [field]: v } : e);
    u?.({ ...resume, experience: exp });
  };

  const setBullet = (ei: number, bi: number, v: string) => {
    const exp = resume.experience.map((e, idx) => {
      if (idx !== ei) return e;
      const bullets = e.bullets.map((b, j) => j === bi ? v : b);
      return { ...e, bullets };
    });
    u?.({ ...resume, experience: exp });
  };

  const setEduField = (i: number, field: string, v: string) => {
    const education = resume.education.map((e, idx) => idx === i ? { ...e, [field]: v } : e);
    u?.({ ...resume, education });
  };

  const setSkillCategory = (i: number, v: string) => {
    const skills = resume.skills.map((s, idx) => idx === i ? { ...s, category: v } : s);
    u?.({ ...resume, skills });
  };

  const setSkillItems = (i: number, v: string) => {
    const items = v.split(',').map(s => s.trim()).filter(Boolean);
    const skills = resume.skills.map((s, idx) => idx === i ? { ...s, items } : s);
    u?.({ ...resume, skills });
  };

  const setCertField = (i: number, field: string, v: string) => {
    const certifications = (resume.certifications || []).map((c, idx) =>
      idx === i ? { ...c, [field]: v } : c
    );
    u?.({ ...resume, certifications });
  };

  const setProjectField = (i: number, field: string, v: string) => {
    const projects = (resume.projects || []).map((p, idx) =>
      idx === i ? { ...p, [field]: v } : p
    );
    u?.({ ...resume, projects });
  };

  return (
    <div className="p-10 font-sans text-sm leading-snug flex flex-col bg-white text-gray-900 font-serif">

      {/* Header */}
      <div className="text-center mb-6">
        <E
          tag="h1"
          value={resume.contactInfo?.name || 'Your Name'}
          onChange={(v) => setContact('name', v)}
          className="text-3xl font-bold uppercase tracking-wider mb-1 text-black block"
        />
        <E
          value={resume.contactInfo?.title || ''}
          onChange={(v) => setContact('title', v)}
          className="text-lg mb-2 text-gray-700 block"
        />
        <div className="flex flex-wrap justify-center gap-3 text-xs text-gray-600">
          <E value={resume.contactInfo?.email || ''} onChange={(v) => setContact('email', v)} />
          {resume.contactInfo?.phone && <span>•&nbsp;<E value={resume.contactInfo.phone} onChange={(v) => setContact('phone', v)} /></span>}
          {resume.contactInfo?.location && <span>•&nbsp;<E value={resume.contactInfo.location} onChange={(v) => setContact('location', v)} /></span>}
          {resume.contactInfo?.linkedin && <span>•&nbsp;<E value={resume.contactInfo.linkedin} onChange={(v) => setContact('linkedin', v)} /></span>}
        </div>
      </div>

      {/* Summary */}
      {resume.summary && (
        <div className="mb-5">
          <h2 className="text-sm font-bold uppercase tracking-widest border-b border-black pb-1 mb-2">Professional Summary</h2>
          <E
            tag="p"
            value={resume.summary}
            onChange={setSummary}
            className="text-xs text-gray-800 leading-relaxed text-justify block"
            multiline
          />
        </div>
      )}

      {/* Experience */}
      {resume.experience?.length > 0 && (
        <div className="mb-5">
          <h2 className="text-sm font-bold uppercase tracking-widest border-b border-black pb-1 mb-3">Professional Experience</h2>
          <div className="flex flex-col gap-4">
            {resume.experience.map((exp, i) => (
              <div key={i}>
                <div className="flex justify-between items-end mb-1">
                  <div>
                    <E value={exp.title} onChange={(v) => setExpField(i, 'title', v)} className="font-bold text-black" />
                    <span className="mx-1">|</span>
                    <E value={exp.company} onChange={(v) => setExpField(i, 'company', v)} className="italic" />
                  </div>
                  <div className="text-xs font-semibold whitespace-nowrap flex gap-1">
                    <E value={exp.startDate} onChange={(v) => setExpField(i, 'startDate', v)} />
                    <span>-</span>
                    <E value={exp.endDate} onChange={(v) => setExpField(i, 'endDate', v)} />
                  </div>
                </div>
                {exp.location && (
                  <E value={exp.location} onChange={(v) => setExpField(i, 'location', v)} className="text-xs text-gray-600 mb-1 block" />
                )}
                <ul className="list-disc pl-4 flex flex-col gap-1">
                  {exp.bullets.map((b, j) => (
                    <li key={j} className="text-xs text-gray-800">
                      <E value={b} onChange={(v) => setBullet(i, j, v)} className="inline" multiline />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {resume.education?.length > 0 && (
        <div className="mb-5">
          <h2 className="text-sm font-bold uppercase tracking-widest border-b border-black pb-1 mb-3">Education</h2>
          <div className="flex flex-col gap-2">
            {resume.education.map((edu, i) => (
              <div key={i} className="flex justify-between">
                <div>
                  <E value={edu.institution} onChange={(v) => setEduField(i, 'institution', v)} className="font-bold block" />
                  <div className="text-xs italic">
                    <E value={edu.degree} onChange={(v) => setEduField(i, 'degree', v)} />
                    {edu.field && <><span> in </span><E value={edu.field} onChange={(v) => setEduField(i, 'field', v)} /></>}
                  </div>
                </div>
                <div className="text-xs text-right">
                  <E value={edu.graduationDate || ''} onChange={(v) => setEduField(i, 'graduationDate', v)} className="font-semibold block" />
                  {edu.gpa && <div>GPA: <E value={edu.gpa} onChange={(v) => setEduField(i, 'gpa', v)} /></div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {resume.projects?.length > 0 && (
        <div className="mb-5">
          <h2 className="text-sm font-bold uppercase tracking-widest border-b border-black pb-1 mb-3">Projects</h2>
          <div className="flex flex-col gap-3">
            {resume.projects.map((project, i) => {
              // Split description into bullet sentences
              const bullets = (project.description || '')
                .split(/\.\s+|\n/)
                .map(s => s.trim())
                .filter(Boolean)
                .map(s => (s.endsWith('.') ? s : `${s}.`));

              const updateBulletAt = (bi: number, v: string) => {
                const updated = bullets.map((b, j) => j === bi ? (v.endsWith('.') ? v : `${v}.`) : b);
                setProjectField(i, 'description', updated.join(' '));
              };

              return (
                <div key={i}>
                  <div className="flex items-baseline gap-1 flex-wrap">
                    <E value={project.name} onChange={(v) => setProjectField(i, 'name', v)} className="font-bold text-black" />
                    {project.tech?.length > 0 && (
                      <>
                        <span className="text-gray-400 mx-0.5">|</span>
                        <E
                          value={(project.tech || []).join(', ')}
                          onChange={(v) => setProjectField(i, 'tech', v)}
                          className="italic text-xs text-gray-600"
                        />
                      </>
                    )}
                  </div>
                  <ul className="list-disc pl-4 flex flex-col gap-0.5 mt-1">
                    {bullets.map((bullet, j) => (
                      <li key={j} className="text-xs text-gray-800">
                        <E
                          value={bullet}
                          onChange={(v) => updateBulletAt(j, v)}
                          className="inline"
                          multiline
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Skills */}
      {resume.skills?.length > 0 && (
        <div className="mb-5">
          <h2 className="text-sm font-bold uppercase tracking-widest border-b border-black pb-1 mb-2">Technical Skills</h2>
          <div className="flex flex-col gap-1 text-xs">
            {resume.skills.map((skillGroup, i) => (
              <div key={i}>
                <E value={skillGroup.category} onChange={(v) => setSkillCategory(i, v)} className="font-bold" />
                <span>: </span>
                <E value={skillGroup.items.join(', ')} onChange={(v) => setSkillItems(i, v)} className="inline" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {resume.certifications?.length > 0 && (
        <div>
          <h2 className="text-sm font-bold uppercase tracking-widest border-b border-black pb-1 mb-2">Certifications</h2>
          <div className="flex flex-col gap-1 text-xs">
            {resume.certifications.map((cert, i) => (
              <div key={i} className="flex justify-between">
                <div>
                  <E value={cert.name} onChange={(v) => setCertField(i, 'name', v)} className="font-bold" />
                  {cert.issuer && <span className="text-gray-600"> — <E value={cert.issuer} onChange={(v) => setCertField(i, 'issuer', v)} /></span>}
                </div>
                {cert.date && <E value={cert.date} onChange={(v) => setCertField(i, 'date', v)} className="text-gray-500" />}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

