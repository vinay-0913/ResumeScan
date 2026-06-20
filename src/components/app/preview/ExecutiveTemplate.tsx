import type { StructuredResume } from '../../../../lib/types';

export function ExecutiveTemplate({ resume }: { resume: StructuredResume }) {
  return (
    <div className="p-10 font-sans text-sm leading-snug flex flex-col bg-white text-gray-900">
      <div className="border-b-4 border-gray-900 pb-5 mb-6">
        <h1 className="text-4xl font-extrabold uppercase tracking-tight text-gray-900 mb-1">
          {resume.contactInfo?.name || 'Your Name'}
        </h1>
        <h2 className="text-lg font-bold text-gray-600 uppercase tracking-widest mb-3">
          {resume.contactInfo?.title}
        </h2>
        <div className="flex gap-4 text-xs font-medium text-gray-500">
          {resume.contactInfo?.email && <span>{resume.contactInfo.email}</span>}
          {resume.contactInfo?.phone && <span>{resume.contactInfo.phone}</span>}
          {resume.contactInfo?.location && <span>{resume.contactInfo.location}</span>}
          {resume.contactInfo?.linkedin && <span>{resume.contactInfo.linkedin}</span>}
        </div>
      </div>

      <div className="grid grid-cols-[1fr_250px] gap-8">
        <div className="flex flex-col gap-6">
          {resume.summary && (
            <div>
              <h3 className="text-lg font-bold uppercase text-gray-900 bg-gray-100 px-3 py-1 mb-3">Executive Summary</h3>
              <p className="text-sm text-gray-700 leading-relaxed font-medium">{resume.summary}</p>
            </div>
          )}

          {resume.experience && resume.experience.length > 0 && (
            <div>
              <h3 className="text-lg font-bold uppercase text-gray-900 bg-gray-100 px-3 py-1 mb-4">Professional Experience</h3>
              <div className="flex flex-col gap-6">
                {resume.experience.map((exp, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="font-bold text-base text-gray-900">{exp.company}</h4>
                      <span className="text-xs font-bold text-gray-500 uppercase">{exp.startDate} – {exp.endDate}</span>
                    </div>
                    <div className="text-sm font-bold text-gray-600 mb-2 italic">{exp.title}</div>
                    <ul className="list-disc pl-5 flex flex-col gap-1.5 marker:text-gray-400">
                      {exp.bullets.map((b, j) => (
                        <li key={j} className="text-xs text-gray-700">{b}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {resume.projects && resume.projects.length > 0 && (
            <div>
              <h3 className="text-lg font-bold uppercase text-gray-900 bg-gray-100 px-3 py-1 mb-4">Key Projects</h3>
              <div className="flex flex-col gap-4">
                {resume.projects.map((project, i) => (
                  <div key={i}>
                    <div className="flex items-baseline gap-1 flex-wrap">
                      <h4 className="font-bold text-base text-gray-900">{project.name}</h4>
                      {project.tech && project.tech.length > 0 && (
                        <>
                          <span className="text-gray-400 mx-0.5">|</span>
                          <span className="italic text-xs text-gray-500">{project.tech.join(', ')}</span>
                        </>
                      )}
                    </div>
                    <ul className="list-disc pl-5 flex flex-col gap-0.5 mt-1 marker:text-gray-400">
                      {project.description.split('. ').filter(s => s.trim()).map((sentence, j) => (
                        <li key={j} className="text-xs text-gray-700">{sentence.endsWith('.') ? sentence : `${sentence}.`}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-6 border-l border-gray-200 pl-8">
          {resume.skills && resume.skills.length > 0 && (
            <div>
              <h3 className="text-sm font-bold uppercase text-gray-900 border-b-2 border-gray-900 pb-1 mb-3">Core Competencies</h3>
              <div className="flex flex-col gap-3">
                {resume.skills.map((skillGroup, i) => (
                  <div key={i}>
                    <div className="font-bold text-xs text-gray-800 mb-1">{skillGroup.category}</div>
                    <div className="text-xs text-gray-600 leading-relaxed">
                      {skillGroup.items.join(', ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {resume.education && resume.education.length > 0 && (
            <div>
              <h3 className="text-sm font-bold uppercase text-gray-900 border-b-2 border-gray-900 pb-1 mb-3">Education</h3>
              <div className="flex flex-col gap-4">
                {resume.education.map((edu, i) => (
                  <div key={i}>
                    <div className="font-bold text-xs text-gray-900">{edu.degree}</div>
                    <div className="text-xs text-gray-700">{edu.field}</div>
                    <div className="text-xs text-gray-500 mt-1">{edu.institution}</div>
                    <div className="text-xs text-gray-400">{edu.graduationDate}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {resume.certifications && resume.certifications.length > 0 && (
            <div>
              <h3 className="text-sm font-bold uppercase text-gray-900 border-b-2 border-gray-900 pb-1 mb-3">Certifications</h3>
              <div className="flex flex-col gap-3">
                {resume.certifications.map((cert, i) => (
                  <div key={i}>
                    <div className="font-bold text-xs text-gray-900">{cert.name}</div>
                    {cert.issuer && <div className="text-xs text-gray-600">{cert.issuer}</div>}
                    {cert.date && <div className="text-xs text-gray-400">{cert.date}</div>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
