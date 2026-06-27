import { useState } from 'react';
import type { StructuredResume } from '../../../../lib/types';

interface DownloadBarProps {
  resume: StructuredResume;
  templateId: string;
  fileName?: string;
}

export function DownloadBar({ resume, templateId, fileName }: DownloadBarProps) {
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

    // Temporarily change document title so print dialog uses it as filename
    const originalTitle = document.title;
    if (fileName) {
      document.title = fileName;
    }

    // Add print-mode class to body so CSS can hide everything else
    document.body.classList.add('printing-resume');

    // Small delay to allow DOM and styles to settle
    requestAnimationFrame(() => {
      window.print();

      // Cleanup after print dialog closes
      document.body.classList.remove('printing-resume');
      document.title = originalTitle;
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
      a.download = `${fileName || 'Resume'}.docx`;
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
    <>
      <button
        onClick={handleDownloadPDF}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-caption font-medium text-mute hover:text-ink bg-canvas-soft hover:bg-canvas-soft-2 border border-hairline rounded-lg transition-colors"
        title="Download as PDF"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M12 15V3m0 12l-4-4m4 4l4-4M2 17l.621 2.485A2 2 0 004.561 21h14.878a2 2 0 001.94-1.515L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        PDF
      </button>
      <button
        onClick={handleDownloadDOCX}
        disabled={isDownloadingDOCX}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-caption font-medium text-white bg-ink hover:opacity-90 rounded-lg transition-colors disabled:opacity-50"
        title="Download as DOCX"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        {isDownloadingDOCX ? '...' : 'DOCX'}
      </button>
    </>
  );
}

