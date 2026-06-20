


export interface Template {
  id: string;
  name: string;
  description: string;
}

const TEMPLATES: Template[] = [
  { id: 'professional', name: 'Professional', description: 'Classic single-column layout.' },
  { id: 'modern', name: 'Modern', description: 'Two-column with sidebar.' },
  { id: 'minimal', name: 'Minimal', description: 'Clean single-column, lots of whitespace.' },
  { id: 'executive', name: 'Executive', description: 'Bold headers, prominent summary.' },
  { id: 'technical', name: 'Technical', description: 'Skills matrix, project-focused.' },
  { id: 'creative', name: 'Creative', description: 'Subtle color accents.' },
  { id: 'academic', name: 'Academic', description: 'Education-first, publications.' },
  { id: 'entry-level', name: 'Entry Level', description: 'Skills & coursework prominent.' },
];

interface TemplateSelectorProps {
  selectedId: string;
  onSelect: (id: string) => void;
}

export function TemplateSelector({ selectedId, onSelect }: TemplateSelectorProps) {
  return (
    <div className="bg-canvas-soft border border-hairline rounded-xl p-6">
      <div className="mb-6">
        <h3 className="text-body-md-strong text-ink">Select a Template</h3>
        <p className="text-body-sm text-mute">Choose a recruiter-preferred format for your resume.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {TEMPLATES.map(template => (
          <button
            key={template.id}
            onClick={() => onSelect(template.id)}
            className={`flex flex-col text-left p-3 rounded-lg border transition-all ${
              selectedId === template.id 
                ? 'border-link bg-link-bg-soft/20 shadow-level-1 ring-1 ring-link/50' 
                : 'border-hairline bg-canvas hover:border-hairline-strong hover:shadow-level-1'
            }`}
          >
            {/* Abstract visual representation */}
            <div className={`w-full aspect-[1/1.4] mb-3 rounded-md border ${selectedId === template.id ? 'border-link/30' : 'border-hairline'} bg-canvas flex flex-col p-2 gap-1 overflow-hidden`}>
               <div className="h-2 w-3/4 bg-ink/10 rounded mx-auto mb-1"></div>
               <div className="h-1 w-full bg-ink/5 rounded mb-2"></div>
               <div className="h-1 w-1/3 bg-ink/10 rounded"></div>
               <div className="h-[2px] w-full bg-ink/5"></div>
               <div className="h-[2px] w-full bg-ink/5"></div>
               <div className="h-[2px] w-5/6 bg-ink/5"></div>
            </div>
            
            <span className={`text-body-sm-strong ${selectedId === template.id ? 'text-link-deep' : 'text-ink'}`}>
              {template.name}
            </span>
            <span className="text-caption text-mute line-clamp-1">{template.description}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
