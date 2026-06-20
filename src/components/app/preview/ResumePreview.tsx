import type { StructuredResume } from '../../../../lib/types';
import { ProfessionalTemplate } from './ProfessionalTemplate';
import { ModernTemplate } from './ModernTemplate';
import { MinimalTemplate } from './MinimalTemplate';
import { ExecutiveTemplate } from './ExecutiveTemplate';
import { FresherTemplate } from './FresherTemplate';

interface ResumePreviewProps {
  resume: StructuredResume;
  templateId: string;
}

const TEMPLATES: Record<string, React.FC<{ resume: StructuredResume }>> = {
  professional: ProfessionalTemplate,
  modern: ModernTemplate,
  minimal: MinimalTemplate,
  executive: ExecutiveTemplate,
  fresher: FresherTemplate,
};

export function ResumePreview({ resume, templateId }: ResumePreviewProps) {
  const Template = TEMPLATES[templateId] || ProfessionalTemplate;

  return (
    <div className="w-full max-w-[850px] bg-white shadow-level-3 mx-auto origin-top">
      {/* Container to handle PDF printing */}
      <div id="resume-preview-content" className="w-full text-black bg-white">
        <Template resume={resume} />
      </div>
    </div>
  );
}
