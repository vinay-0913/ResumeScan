import type { StructuredResume } from '../../../../lib/types';

export function MinimalTemplate({ resume }: { resume: StructuredResume }) {
  return (
    <div className="p-12 font-sans text-sm leading-relaxed flex flex-col bg-white text-gray-800">
      <div className="flex justify-between items-end mb-8 border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-3xl font-light text-gray-900 mb-1">{resume.contactInfo?.name || 'Your Name'}</h1>
          <h2 className="text-sm font-medium tracking-widest text-gray-500 uppercase">{resume.contactInfo?.title}</h2>
        </div>
        <div className="text-right text-xs text-gray-500 flex flex-col gap-1">
          {resume.contactInfo?.email && <div>{resume.contactInfo.email}</div>}
          {resume.contactInfo?.phone && <div>{resume.contactInfo.phone}</div>}
          {resume.contactInfo?.linkedin && <div>{resume.contactInfo.linkedin}</div>}
        </div>
      </div>

      <div className="flex flex-col gap-8">
        {resume.summary && (
          <div className="grid grid-cols-[120px_1fr] gap-6">
            <div className="text-xs font-semibold tracking-wider text-gray-400 uppercase pt-1">About</div>
            <p className="text-xs text-gray-700 leading-loose">{resume.summary}</p>
          </div>
        )}

        {resume.experience && resume.experience.length > 0 && (
          <div className="grid grid-cols-[120px_1fr] gap-6">
            <div className="text-xs font-semibold tracking-wider text-gray-400 uppercase pt-1">Experience</div>
            <div className="flex flex-col gap-6">
              {resume.experience.map((exp, i) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="font-semibold text-gray-900">{exp.company}</span>
                    <span className="text-xs text-gray-400 font-mono tracking-tight">{exp.startDate} - {exp.endDate}</span>
                  </div>
                  <div className="text-sm italic text-gray-500 mb-2">{exp.title}</div>
                  <ul className="list-disc pl-4 flex flex-col gap-1.5 marker:text-gray-300">
                    {exp.bullets.map((b, j) => (
                      <li key={j} className="text-xs text-gray-600 pl-1">{b}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {resume.education && resume.education.length > 0 && (
          <div className="grid grid-cols-[120px_1fr] gap-6">
            <div className="text-xs font-semibold tracking-wider text-gray-400 uppercase pt-1">Education</div>
            <div className="flex flex-col gap-4">
              {resume.education.map((edu, i) => (
                <div key={i} className="flex justify-between items-baseline">
                  <div>
                    <div className="font-semibold text-gray-900">{edu.institution}</div>
                    <div className="text-xs text-gray-600">{edu.degree}{edu.field ? `, ${edu.field}` : ''}</div>
                  </div>
                  <div className="text-xs text-gray-400 font-mono tracking-tight">{edu.graduationDate}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {resume.projects && resume.projects.length > 0 && (
          <div className="grid grid-cols-[120px_1fr] gap-6">
            <div className="text-xs font-semibold tracking-wider text-gray-400 uppercase pt-1">Projects</div>
            <div className="flex flex-col gap-4">
              {resume.projects.map((project, i) => (
                <div key={i}>
                  <div className="flex items-baseline gap-1 flex-wrap">
                    <span className="font-semibold text-gray-900">{project.name}</span>
                    {project.tech && project.tech.length > 0 && (
                      <>
                        <span className="text-gray-400 mx-0.5">|</span>
                        <span className="italic text-xs text-gray-500">{project.tech.join(', ')}</span>
                      </>
                    )}
                  </div>
                  <ul className="list-disc pl-4 flex flex-col gap-0.5 mt-1 marker:text-gray-300">
                    {project.description.split('. ').filter(s => s.trim()).map((sentence, j) => (
                      <li key={j} className="text-xs text-gray-600 pl-1">{sentence.endsWith('.') ? sentence : `${sentence}.`}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {resume.skills && resume.skills.length > 0 && (
          <div className="grid grid-cols-[120px_1fr] gap-6">
            <div className="text-xs font-semibold tracking-wider text-gray-400 uppercase pt-1">Skills</div>
            <div className="flex flex-col gap-2">
              {resume.skills.map((skillGroup, i) => (
                <div key={i} className="text-xs">
                  <span className="font-medium text-gray-800 mr-2">{skillGroup.category}:</span>
                  <span className="text-gray-600">{skillGroup.items.join(' • ')}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {resume.certifications && resume.certifications.length > 0 && (
          <div className="grid grid-cols-[120px_1fr] gap-6">
            <div className="text-xs font-semibold tracking-wider text-gray-400 uppercase pt-1">Certifications</div>
            <div className="flex flex-col gap-2">
              {resume.certifications.map((cert, i) => (
                <div key={i} className="text-xs">
                  <span className="font-medium text-gray-800">{cert.name}</span>
                  {cert.issuer && <span className="text-gray-500"> — {cert.issuer}</span>}
                  {cert.date && <span className="text-gray-400 ml-2">{cert.date}</span>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
