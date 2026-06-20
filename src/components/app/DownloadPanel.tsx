import { useState } from 'react';

interface DownloadPanelProps {
  onDownload: (format: 'pdf' | 'docx') => Promise<void>;
}

export function DownloadPanel({ onDownload }: DownloadPanelProps) {
  const [isDownloading, setIsDownloading] = useState<'pdf' | 'docx' | null>(null);

  const handleDownload = async (format: 'pdf' | 'docx') => {
    setIsDownloading(format);
    try {
      await onDownload(format);
    } finally {
      setIsDownloading(null);
    }
  };

  return (
    <div className="bg-ink text-canvas rounded-xl shadow-level-4 p-8 text-center flex flex-col items-center">
      <div className="w-16 h-16 rounded-full bg-success/20 text-success flex items-center justify-center mb-6">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </div>
      
      <h3 className="text-display-md text-canvas mb-2">Suggestions Ready!</h3>
      <p className="text-body-md text-mute max-w-md mb-8">
        Your resume improvement suggestions are ready. Download your optimized resume to make the best impression on recruiters.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
        <button 
          onClick={() => handleDownload('pdf')}
          disabled={isDownloading !== null}
          className="btn-primary bg-canvas text-ink hover:bg-canvas-soft border-none min-w-[200px]"
        >
          {isDownloading === 'pdf' ? 'Generating...' : 'Download PDF'}
        </button>
        
        <button 
          onClick={() => handleDownload('docx')}
          disabled={isDownloading !== null}
          className="btn-secondary border-mute/30 text-canvas hover:border-canvas hover:text-canvas min-w-[200px]"
          style={{ backgroundColor: 'transparent' }}
        >
          {isDownloading === 'docx' ? 'Generating...' : 'Download DOCX'}
        </button>
      </div>
    </div>
  );
}
