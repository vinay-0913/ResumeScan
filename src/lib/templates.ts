export interface ResumeTemplate {
  id: string;
  name: string;
  description: string;
  // In Phase 2, this would contain DOCX layout properties
}

export const TEMPLATES: Record<string, ResumeTemplate> = {
  'professional': {
    id: 'professional',
    name: 'Professional',
    description: 'Classic single-column layout with serif headings.',
  },
  'modern': {
    id: 'modern',
    name: 'Modern',
    description: 'Two-column layout with a sidebar for skills.',
  },
  'minimal': {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean single-column with lots of whitespace.',
  },
  'executive': {
    id: 'executive',
    name: 'Executive',
    description: 'Bold headers and prominent professional summary.',
  },
  'technical': {
    id: 'technical',
    name: 'Technical',
    description: 'Skills matrix and project-focused layout.',
  },
  'creative': {
    id: 'creative',
    name: 'Creative',
    description: 'Subtle color accents and unique section dividers.',
  },
  'academic': {
    id: 'academic',
    name: 'Academic',
    description: 'Education-first structure with publications section.',
  },
  'entry-level': {
    id: 'entry-level',
    name: 'Entry Level',
    description: 'Highlights coursework and relevant projects.',
  }
};

export const getTemplateList = () => Object.values(TEMPLATES);
