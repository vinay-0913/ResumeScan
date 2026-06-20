interface StyleTabProps {
  selectedTemplate: string;
  onSelectTemplate: (id: string) => void;
}

const TEMPLATES = [
  { id: 'professional', name: 'Professional', desc: 'Classic single-column' },
  { id: 'modern', name: 'Modern', desc: 'Two-column sidebar' },
  { id: 'minimal', name: 'Minimal', desc: 'Clean & spacious' },
  { id: 'executive', name: 'Executive', desc: 'Bold headings' },
  { id: 'fresher', name: 'Fresher', desc: 'Amber accents, serif' },
];

export function StyleTab({ selectedTemplate, onSelectTemplate }: StyleTabProps) {
  return (
    <div className="p-6 bg-canvas h-full">
      <div className="mb-6">
        <h3 className="text-body-md-strong text-ink">Resume Template</h3>
        <p className="text-caption text-mute mt-1">Select a layout for your tailored resume.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {TEMPLATES.map(t => (
          <button
            key={t.id}
            onClick={() => onSelectTemplate(t.id)}
            className={`flex flex-col text-left p-3 rounded-lg border transition-all ${
              selectedTemplate === t.id 
                ? 'border-link bg-link-bg-soft/20 shadow-level-1 ring-1 ring-link/50' 
                : 'border-hairline bg-canvas hover:border-hairline-strong hover:shadow-level-1'
            }`}
          >
            <TemplatePreviewThumbnail id={t.id} selected={selectedTemplate === t.id} />
            <span className={`text-body-sm-strong mt-3 ${selectedTemplate === t.id ? 'text-link-deep' : 'text-ink'}`}>
              {t.name}
            </span>
            <span className="text-caption text-mute">{t.desc}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function TemplatePreviewThumbnail({ id, selected }: { id: string, selected: boolean }) {
  const borderColor = selected ? 'border-link/30' : 'border-hairline';
  
  if (id === 'modern') {
    return (
      <div className={`w-full aspect-[1/1.4] rounded-md border ${borderColor} bg-canvas flex overflow-hidden`}>
        <div className="w-1/3 bg-ink/5 h-full p-1.5 flex flex-col gap-1">
          <div className="w-full aspect-square bg-ink/10 rounded-full mb-1"></div>
          <div className="h-1 w-full bg-ink/10 rounded"></div>
          <div className="h-1 w-2/3 bg-ink/10 rounded"></div>
        </div>
        <div className="flex-1 p-2 flex flex-col gap-1.5">
          <div className="h-1.5 w-3/4 bg-ink/20 rounded mb-1"></div>
          <div className="h-1 w-full bg-ink/10 rounded"></div>
          <div className="h-1 w-5/6 bg-ink/10 rounded"></div>
          <div className="h-[1px] w-full bg-ink/5 my-0.5"></div>
          <div className="h-1 w-full bg-ink/10 rounded"></div>
        </div>
      </div>
    );
  }

  if (id === 'fresher') {
    return (
      <div className={`w-full aspect-[1/1.4] rounded-md border ${borderColor} bg-canvas flex flex-col p-2.5 gap-1 overflow-hidden`}>
        {/* Name left, contact right */}
        <div className="flex justify-between items-start mb-0.5">
          <div className="h-2 w-1/3 bg-ink/20 rounded"></div>
          <div className="flex flex-col items-end gap-0.5">
            <div className="h-[3px] w-10 bg-ink/10 rounded"></div>
            <div className="h-[3px] w-8 bg-ink/10 rounded"></div>
          </div>
        </div>
        {/* Section with amber underline */}
        <div className="h-[2px] w-full bg-amber-400 rounded mt-0.5"></div>
        <div className="h-1 w-full bg-ink/10 rounded"></div>
        <div className="h-1 w-5/6 bg-ink/10 rounded"></div>
        {/* Another section */}
        <div className="h-[2px] w-full bg-gray-400 rounded mt-0.5"></div>
        <div className="flex gap-1">
          <div className="h-1 w-1/4 bg-ink/15 rounded"></div>
          <div className="h-1 w-3/4 bg-ink/10 rounded"></div>
        </div>
        <div className="flex gap-1">
          <div className="h-1 w-1/4 bg-ink/15 rounded"></div>
          <div className="h-1 w-2/3 bg-ink/10 rounded"></div>
        </div>
        {/* Another section */}
        <div className="h-[2px] w-full bg-gray-400 rounded mt-0.5"></div>
        <div className="h-1 w-full bg-ink/10 rounded"></div>
        <div className="h-1 w-4/5 bg-ink/10 rounded"></div>
      </div>
    );
  }

  // Default / Professional / Minimal / Executive
  return (
    <div className={`w-full aspect-[1/1.4] rounded-md border ${borderColor} bg-canvas flex flex-col p-2.5 gap-1.5 overflow-hidden`}>
      <div className="h-1.5 w-1/2 bg-ink/20 rounded mx-auto mb-1"></div>
      <div className="h-[1px] w-full bg-ink/10 mb-1"></div>
      <div className="h-1 w-full bg-ink/10 rounded"></div>
      <div className="h-1 w-5/6 bg-ink/10 rounded"></div>
      <div className="h-[1px] w-full bg-ink/5 my-0.5"></div>
      <div className="h-1 w-3/4 bg-ink/10 rounded"></div>
      <div className="h-1 w-full bg-ink/10 rounded"></div>
    </div>
  );
}
