import type { StructuredResume } from '../../../../lib/types';

export function ProfessionalTemplate({ resume }: { resume: StructuredResume }) {
  return (
    <div className="p-10 font-sans text-sm leading-snug flex flex-col bg-white text-gray-900 font-serif">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold uppercase tracking-wider mb-1 text-black">{resume.contactInfo?.name || 'Your Name'}</h1>
        {resume.contactInfo?.title && (
          <div className="text-lg mb-2 text-gray-700">{resume.contactInfo.title}</div>
        )}
        <div className="flex flex-wrap justify-center gap-3 text-xs text-gray-600">
          {resume.contactInfo?.email && <span>{resume.contactInfo.email}</span>}
          {resume.contactInfo?.phone && <span>• {resume.contactInfo.phone}</span>}
          {resume.contactInfo?.location && <span>• {resume.contactInfo.location}</span>}
          {resume.contactInfo?.linkedin && <span>• {resume.contactInfo.linkedin}</span>}
        </div>
      </div>

      {/* Summary */}
      {resume.summary && (
        <div className="mb-5">
          <h2 className="text-sm font-bold uppercase tracking-widest border-b border-black pb-1 mb-2">Professional Summary</h2>
          <p className="text-xs text-gray-800 leading-relaxed text-justify">{resume.summary}</p>
        </div>
      )}

      {/* Experience */}
      {resume.experience && resume.experience.length > 0 && (
        <div className="mb-5">
          <h2 className="text-sm font-bold uppercase tracking-widest border-b border-black pb-1 mb-3">Professional Experience</h2>
          <div className="flex flex-col gap-4">
            {resume.experience.map((exp, i) => (
              <div key={i}>
                <div className="flex justify-between items-end mb-1">
                  <div>
                    <span className="font-bold text-black">{exp.title}</span>
                    <span className="mx-1">|</span>
                    <span className="italic">{exp.company}</span>
                  </div>
                  <div className="text-xs font-semibold whitespace-nowrap">
                    {exp.startDate} - {exp.endDate}
                  </div>
                </div>
                {exp.location && <div className="text-xs text-gray-600 mb-1">{exp.location}</div>}
                <ul className="list-disc pl-4 flex flex-col gap-1">
                  {exp.bullets.map((b, j) => (
                    <li key={j} className="text-xs text-gray-800">{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {resume.education && resume.education.length > 0 && (
        <div className="mb-5">
          <h2 className="text-sm font-bold uppercase tracking-widest border-b border-black pb-1 mb-3">Education</h2>
          <div className="flex flex-col gap-2">
            {resume.education.map((edu, i) => (
              <div key={i} className="flex justify-between">
                <div>
                  <div className="font-bold">{edu.institution}</div>
                  <div className="text-xs italic">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</div>
                </div>
                <div className="text-xs text-right">
                  <div className="font-semibold">{edu.graduationDate}</div>
                  {edu.gpa && <div>GPA: {edu.gpa}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {resume.projects && resume.projects.length > 0 && (
        <div className="mb-5">
          <h2 className="text-sm font-bold uppercase tracking-widest border-b border-black pb-1 mb-3">Projects</h2>
          <div className="flex flex-col gap-3">
            {resume.projects.map((project, i) => (
              <div key={i}>
                <div className="flex items-baseline gap-1 flex-wrap">
                  <span className="font-bold text-black">{project.name}</span>
                  {project.tech && project.tech.length > 0 && (
                    <>
                      <span className="text-gray-400 mx-0.5">|</span>
                      <span className="italic text-xs text-gray-600">{project.tech.join(', ')}</span>
                    </>
                  )}
                </div>
                <ul className="list-disc pl-4 flex flex-col gap-0.5 mt-1">
                  {project.description.split('. ').filter(s => s.trim()).map((sentence, j) => (
                    <li key={j} className="text-xs text-gray-800">{sentence.endsWith('.') ? sentence : `${sentence}.`}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {resume.skills && resume.skills.length > 0 && (
        <div className="mb-5">
          <h2 className="text-sm font-bold uppercase tracking-widest border-b border-black pb-1 mb-2">Technical Skills</h2>
          <div className="flex flex-col gap-1 text-xs">
            {resume.skills.map((skillGroup, i) => (
              <div key={i}>
                <span className="font-bold">{skillGroup.category}:</span> {skillGroup.items.join(', ')}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {resume.certifications && resume.certifications.length > 0 && (
        <div>
          <h2 className="text-sm font-bold uppercase tracking-widest border-b border-black pb-1 mb-2">Certifications</h2>
          <div className="flex flex-col gap-1 text-xs">
            {resume.certifications.map((cert, i) => (
              <div key={i} className="flex justify-between">
                <div>
                  <span className="font-bold">{cert.name}</span>
                  {cert.issuer && <span className="text-gray-600"> — {cert.issuer}</span>}
                </div>
                {cert.date && <span className="text-gray-500">{cert.date}</span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
