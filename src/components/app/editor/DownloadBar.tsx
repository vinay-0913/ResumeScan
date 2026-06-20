import { useState } from 'react';
import type { StructuredResume } from '../../../../lib/types';

interface DownloadBarProps {
  resume: StructuredResume;
  templateId: string;
}

export function DownloadBar({ resume, templateId }: DownloadBarProps) {
  const [isDownloadingDOCX, setIsDownloadingDOCX] = useState(false);

  const handleDownloadPDF = () => {
    const source = document.getElementById('resume-preview-content');
    if (!source) {
      alert('Resume preview not found');
      return;
    }

    // Clone the resume content into a top-level print container
    const printContainer = document.createElement('div');
    printContainer.id = 'print-only-resume';
    printContainer.appendChild(source.cloneNode(true));
    document.body.appendChild(printContainer);

    // Add print-mode class to body so CSS can hide everything else
    document.body.classList.add('printing-resume');

    // Small delay to allow DOM and styles to settle
    requestAnimationFrame(() => {
      window.print();

      // Cleanup after print dialog closes
      document.body.classList.remove('printing-resume');
      if (document.body.contains(printContainer)) {
        document.body.removeChild(printContainer);
      }
    });
  };

  const handleDownloadDOCX = async () => {
    setIsDownloadingDOCX(true);
    try {
      const res = await fetch('/api/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeData: resume,
          templateId,
          format: 'docx'
        })
      });

      if (!res.ok) throw new Error('Download failed');

      // Create a blob and download
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tailored_resume_${templateId}.docx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error(err);
      alert('Failed to generate DOCX');
    } finally {
      setIsDownloadingDOCX(false);
    }
  };

  return (
    <div className="bg-canvas border-t border-hairline p-4 flex items-center justify-between shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20">
      <div className="flex flex-col">
        <span className="text-body-sm-strong text-ink">Ready to download?</span>
        <span className="text-caption text-mute">Template: {templateId}</span>
      </div>
      <div className="flex items-center gap-3">
        <button 
          onClick={handleDownloadPDF}
          className="btn-secondary"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="mr-2"><path d="M12 15V3m0 12l-4-4m4 4l4-4M2 17l.621 2.485A2 2 0 004.561 21h14.878a2 2 0 001.94-1.515L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Download PDF
        </button>
        <button 
          onClick={handleDownloadDOCX}
          disabled={isDownloadingDOCX}
          className="btn-primary"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="mr-2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          {isDownloadingDOCX ? 'Generating...' : 'Download DOCX'}
        </button>
      </div>
    </div>
  );
}
