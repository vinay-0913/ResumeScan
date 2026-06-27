import { useRef, useEffect, useState } from 'react';
import type { StructuredResume } from '../../../../lib/types';
import { ProfessionalTemplate } from './ProfessionalTemplate';
import { ModernTemplate } from './ModernTemplate';
import { MinimalTemplate } from './MinimalTemplate';
import { ExecutiveTemplate } from './ExecutiveTemplate';
import { FresherTemplate } from './FresherTemplate';

interface ResumePreviewProps {
  resume: StructuredResume;
  templateId: string;
  zoomLevel?: number;
  onUpdate?: (resume: StructuredResume) => void;
}

const TEMPLATES: Record<string, React.FC<{ resume: StructuredResume }>> = {
  professional: ProfessionalTemplate,
  modern: ModernTemplate,
  minimal: MinimalTemplate,
  executive: ExecutiveTemplate,
  fresher: FresherTemplate,
};

const RESUME_WIDTH = 850; // fixed render width in px
const MAX_SCALE = 0.78;   // never larger than 78% — keeps it readable but compact

export function ResumePreview({ resume, templateId, zoomLevel = 80, onUpdate }: ResumePreviewProps) {
  const Template = TEMPLATES[templateId] || ProfessionalTemplate;
  const contentRef = useRef<HTMLDivElement>(null);
  const [resumeHeight, setResumeHeight] = useState(0);

  const scale = zoomLevel / 100;

  useEffect(() => {
    const updateHeight = () => {
      if (contentRef.current) {
        setResumeHeight(contentRef.current.offsetHeight);
      }
    };
    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    if (contentRef.current) observer.observe(contentRef.current);
    return () => observer.disconnect();
  }, []);

  const scaledWidth  = RESUME_WIDTH * scale;
  const scaledHeight = resumeHeight * scale;

  return (
    <div className="flex justify-center w-full">
      <div style={{ width: scaledWidth, height: scaledHeight || undefined, position: 'relative', transition: 'width 0.15s, height 0.15s' }}>
        <div
          ref={contentRef}
          style={{
            width: RESUME_WIDTH,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            position: 'absolute',
            top: 0,
            left: 0,
            transition: 'transform 0.15s',
          }}
        >
          <div id="resume-preview-content" className="w-full bg-white text-black shadow-level-3">
            <Template resume={resume} onUpdate={onUpdate} />
          </div>
        </div>
      </div>
    </div>
  );
}
