import type { StructuredResume } from '../../../../lib/types';

export function ModernTemplate({ resume }: { resume: StructuredResume }) {
  return (
    <div className="flex bg-white text-gray-800 font-sans text-sm">
      {/* Left Sidebar (30%) */}
      <div className="w-[30%] bg-[#1a202c] text-white p-8 flex flex-col gap-6">
        <div className="mb-2">
          <div className="w-24 h-24 bg-gray-600 rounded-full mb-4 flex items-center justify-center text-3xl font-bold text-gray-300">
            {resume.contactInfo?.name?.charAt(0) || 'U'}
          </div>
        </div>

        <div className="flex flex-col gap-3 text-xs text-gray-300">
          <h3 className="text-white font-bold uppercase tracking-widest text-xs border-b border-gray-600 pb-1">Contact</h3>
          {resume.contactInfo?.email && <div className="break-all">{resume.contactInfo.email}</div>}
          {resume.contactInfo?.phone && <div>{resume.contactInfo.phone}</div>}
          {resume.contactInfo?.location && <div>{resume.contactInfo.location}</div>}
          {resume.contactInfo?.linkedin && <div className="break-all">{resume.contactInfo.linkedin}</div>}
        </div>

        {resume.skills && resume.skills.length > 0 && (
          <div className="flex flex-col gap-3 mt-4 text-xs">
            <h3 className="text-white font-bold uppercase tracking-widest text-xs border-b border-gray-600 pb-1">Skills</h3>
            {resume.skills.map((skillGroup, i) => (
              <div key={i}>
                <div className="font-semibold text-gray-200 mb-1">{skillGroup.category}</div>
                <div className="flex flex-wrap gap-1">
                  {skillGroup.items.map((item, j) => (
                    <span key={j} className="bg-gray-700 px-2 py-0.5 rounded-sm">{item}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {resume.education && resume.education.length > 0 && (
          <div className="flex flex-col gap-3 mt-4 text-xs">
            <h3 className="text-white font-bold uppercase tracking-widest text-xs border-b border-gray-600 pb-1">Education</h3>
            {resume.education.map((edu, i) => (
              <div key={i}>
                <div className="font-bold text-gray-200">{edu.degree}</div>
                <div className="text-gray-400">{edu.institution}</div>
                <div className="text-gray-500 text-[10px]">{edu.graduationDate}</div>
              </div>
            ))}
          </div>
        )}

        {resume.certifications && resume.certifications.length > 0 && (
          <div className="flex flex-col gap-3 mt-4 text-xs">
            <h3 className="text-white font-bold uppercase tracking-widest text-xs border-b border-gray-600 pb-1">Certifications</h3>
            {resume.certifications.map((cert, i) => (
              <div key={i}>
                <div className="font-bold text-gray-200">{cert.name}</div>
                {cert.issuer && <div className="text-gray-400">{cert.issuer}</div>}
                {cert.date && <div className="text-gray-500 text-[10px]">{cert.date}</div>}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right Main Content (70%) */}
      <div className="w-[70%] p-8 flex flex-col gap-6">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-1">{resume.contactInfo?.name || 'Your Name'}</h1>
          <h2 className="text-xl text-blue-600 font-medium">{resume.contactInfo?.title}</h2>
        </div>

        {resume.summary && (
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-800 border-b-2 border-gray-100 pb-1 mb-2">Profile</h3>
            <p className="text-xs text-gray-600 leading-relaxed text-justify">{resume.summary}</p>
          </div>
        )}

        {resume.experience && resume.experience.length > 0 && (
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-800 border-b-2 border-gray-100 pb-1 mb-4">Experience</h3>
            <div className="flex flex-col gap-5">
              {resume.experience.map((exp, i) => (
                <div key={i} className="relative">
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="font-bold text-gray-900">{exp.title}</h4>
                    <span className="text-xs text-blue-600 font-medium whitespace-nowrap bg-blue-50 px-2 py-0.5 rounded-full">
                      {exp.startDate} - {exp.endDate}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 font-medium mb-2">{exp.company}{exp.location ? `, ${exp.location}` : ''}</div>
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

        {resume.projects && resume.projects.length > 0 && (
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-800 border-b-2 border-gray-100 pb-1 mb-4">Projects</h3>
            <div className="flex flex-col gap-4">
              {resume.projects.map((project, i) => (
                <div key={i}>
                  <div className="flex items-baseline gap-1 flex-wrap">
                    <h4 className="font-bold text-gray-900">{project.name}</h4>
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
      </div>
    </div>
  );
}
