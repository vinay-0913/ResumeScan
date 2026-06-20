import type { StructuredResume } from '../../../../lib/types';

const ACCENT = '#374151'; // gray-700 — neutral dark accent

export function FresherTemplate({ resume }: { resume: StructuredResume }) {
  return (
    <div className="px-8 py-6 font-[Georgia,serif] text-[11px] leading-[1.45] bg-white text-gray-900" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>

      {/* ═══ Header ═══ */}
      <div className="flex justify-between items-start mb-1">
        {/* Left: Name + Title */}
        <div>
          <h1 className="text-[26px] font-normal tracking-tight text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>
            {resume.contactInfo?.name || 'Your Name'}
          </h1>
          {resume.contactInfo?.title && (
            <div className="text-[13px] text-gray-700 mt-0.5">{resume.contactInfo.title}</div>
          )}
        </div>

        {/* Right: Contact info with icons */}
        <div className="text-right text-[10px] text-gray-700 flex flex-col gap-0.5 mt-1 shrink-0">
          {resume.contactInfo?.phone && (
            <div className="flex items-center justify-end gap-1.5">
              <span style={{ color: ACCENT }}>📞</span>
              <span>{resume.contactInfo.phone}</span>
            </div>
          )}
          {resume.contactInfo?.email && (
            <div className="flex items-center justify-end gap-1.5">
              <span style={{ color: ACCENT }}>✉</span>
              <span>{resume.contactInfo.email}</span>
            </div>
          )}
          {resume.contactInfo?.linkedin && (
            <div className="flex items-center justify-end gap-1.5">
              <span style={{ color: ACCENT }}>🔗</span>
              <span style={{ color: ACCENT }}>{resume.contactInfo.linkedin}</span>
            </div>
          )}
          {resume.contactInfo?.location && (
            <div className="flex items-center justify-end gap-1.5">
              <span style={{ color: ACCENT }}>📍</span>
              <span>{resume.contactInfo.location}</span>
            </div>
          )}
        </div>
      </div>

      {/* ═══ Summary ═══ */}
      {resume.summary && (
        <Section title="Summary">
          <p className="text-[10.5px] text-gray-800 leading-relaxed text-justify">{resume.summary}</p>
        </Section>
      )}

      {/* ═══ Education ═══ */}
      {resume.education && resume.education.length > 0 && (
        <Section title="Education">
          {resume.education.map((edu, i) => (
            <div key={i} className="mb-2 last:mb-0">
              <div className="flex justify-between">
                <span className="font-bold text-gray-900">{edu.institution}</span>
                <span className="text-[10px] text-gray-600 italic shrink-0">{edu.location || ''}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[10.5px]">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</span>
                <span className="text-[10px] text-gray-600 italic shrink-0">{edu.graduationDate || ''}</span>
              </div>
              {edu.gpa && (
                <div className="text-[10px] text-gray-600 mt-0.5">GPA: {edu.gpa}</div>
              )}
            </div>
          ))}
        </Section>
      )}

      {/* ═══ Skills (table format) ═══ */}
      {resume.skills && resume.skills.length > 0 && (
        <Section title="Skills">
          <table className="w-full text-[10.5px]" style={{ borderCollapse: 'collapse' }}>
            <tbody>
              {resume.skills.map((skill, i) => (
                <tr key={i}>
                  <td className="font-bold text-gray-900 pr-3 py-[1px] whitespace-nowrap align-top" style={{ width: '1%' }}>
                    {skill.category}:
                  </td>
                  <td className="text-gray-800 py-[1px] align-top">
                    {skill.items.join(', ')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>
      )}

      {/* ═══ Experience ═══ */}
      {resume.experience && resume.experience.length > 0 && (
        <Section title="Experience">
          {resume.experience.map((exp, i) => (
            <div key={i} className="mb-3 last:mb-0">
              {/* Line 1: Title + Dates */}
              <div className="flex justify-between items-baseline">
                <div>
                  <span className="font-bold text-gray-900">{exp.title}</span>
                </div>
                <span className="text-[10px] text-gray-600 italic shrink-0 ml-2">{exp.startDate} – {exp.endDate}</span>
              </div>
              {/* Line 2: Company + Location */}
              <div className="flex justify-between items-baseline">
                <span className="text-[10.5px] text-gray-700">{exp.company}</span>
                {exp.location && (
                  <span className="text-[10px] text-gray-600 italic shrink-0 ml-2">{exp.location}</span>
                )}
              </div>
              {/* Bullets */}
              <ul className="mt-1 ml-3 flex flex-col gap-[2px]">
                {exp.bullets.map((bullet, j) => (
                  <li key={j} className="text-[10.5px] text-gray-800 leading-[1.45] flex items-start gap-1.5">
                    <span className="shrink-0 mt-[3px] text-[6px]">●</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </Section>
      )}

      {/* ═══ Projects ═══ */}
      {resume.projects && resume.projects.length > 0 && (
        <Section title="Projects">
          {resume.projects.map((project, i) => (
            <div key={i} className="mb-3 last:mb-0">
              {/* Project title | Tech stack */}
              <div className="flex items-baseline gap-1 flex-wrap">
                <span className="font-bold text-gray-900">{project.name}</span>
                {project.tech && project.tech.length > 0 && (
                  <>
                    <span className="text-gray-400 mx-0.5">|</span>
                    <span className="italic text-[10px] text-gray-600">{project.tech.join(', ')}</span>
                  </>
                )}
                <span className="text-[9px] ml-0.5" style={{ color: ACCENT }}>🔗</span>
              </div>
              {/* Bullets */}
              <ul className="mt-1 ml-3 flex flex-col gap-[2px]">
                {project.description.split('. ').filter(s => s.trim()).length > 1 ? (
                  // If description has multiple sentences, show as separate bullets
                  project.description.split('. ').filter(s => s.trim()).map((sentence, j) => (
                    <li key={j} className="text-[10.5px] text-gray-800 leading-[1.45] flex items-start gap-1.5">
                      <span className="shrink-0 mt-[3px] text-[6px]">●</span>
                      <span>{sentence.endsWith('.') ? sentence : `${sentence}.`}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-[10.5px] text-gray-800 leading-[1.45] flex items-start gap-1.5">
                    <span className="shrink-0 mt-[3px] text-[6px]">●</span>
                    <span>{project.description}</span>
                  </li>
                )}
              </ul>
            </div>
          ))}
        </Section>
      )}

      {/* ═══ Certifications / Achievements ═══ */}
      {resume.certifications && resume.certifications.length > 0 && (
        <Section title="Achievements & Certificates">
          <ul className="ml-3 flex flex-col gap-[2px]">
            {resume.certifications.map((cert, i) => (
              <li key={i} className="text-[10.5px] text-gray-800 leading-[1.45] flex items-start gap-1.5">
                <span className="shrink-0 mt-[3px] text-[6px]">●</span>
                <span>
                  {cert.name}
                  {cert.issuer && <span className="text-gray-600"> — {cert.issuer}</span>}
                  {cert.date && <span className="text-gray-500"> ({cert.date})</span>}
                </span>
              </li>
            ))}
          </ul>
        </Section>
      )}
    </div>
  );
}

/* ─── Section heading with underline ─── */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-3">
      <h2
        className="text-[13px] font-bold text-gray-900 pb-[3px] mb-[6px] border-b-[2px]"
        style={{ borderColor: ACCENT }}
      >
        {title}
      </h2>
      {children}
    </div>
  );
}
