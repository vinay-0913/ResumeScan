import { useState, useRef } from 'react';

interface UploadZoneProps {
  onUpload: (resumeFile: File, jobDescription: string) => void;
}

export function UploadZone({ onUpload }: UploadZoneProps) {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (selectedFile: File) => {
    setError('');
    if (selectedFile.type !== 'application/pdf') {
      setError('Please upload a PDF file.');
      return;
    }
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB.');
      return;
    }
    setFile(selectedFile);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please upload your resume.');
      return;
    }
    if (!jobDescription.trim()) {
      setError('Please enter a job description.');
      return;
    }
    onUpload(file, jobDescription);
  };

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="text-center">
        <h2 className="text-display-lg text-ink mb-4">Get Your Recruiter Evaluation</h2>
        <p className="text-body-lg text-body">Upload your resume and paste the target job description. Our AI recruiter will evaluate your fit — just like a real hiring manager would.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-8 bg-canvas p-8 rounded-xl shadow-level-4 border border-hairline">
        
        {/* Upload Resume */}
        <div className="flex flex-col gap-2">
          <label className="text-body-md-strong text-ink">1. Upload Your Resume (PDF)</label>
          <div
            className={`relative border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center transition-colors cursor-pointer ${
              dragActive ? 'border-link bg-link-bg-soft/30' : file ? 'border-success bg-success/5' : 'border-hairline-strong hover:border-ink/30 bg-canvas-soft'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
          >
            <input
              ref={inputRef}
              type="file"
              accept="application/pdf"
              onChange={handleChange}
              className="hidden"
            />
            
            {file ? (
              <div className="flex items-center gap-3 text-success">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <div className="flex flex-col">
                  <span className="text-body-md-strong">{file.name}</span>
                  <span className="text-caption text-success/80">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                </div>
                <button type="button" onClick={(e) => { e.stopPropagation(); setFile(null); }} className="ml-auto p-1 hover:bg-success/20 rounded-full transition-colors text-success">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
              </div>
            ) : (
              <>
                <div className="w-12 h-12 rounded-full bg-canvas border border-hairline shadow-level-1 flex items-center justify-center text-ink mb-4 group-hover:scale-110 transition-transform">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <p className="text-body-md text-ink text-center mb-1">
                  <span className="font-medium text-link">Click to upload</span> or drag and drop
                </p>
                <p className="text-caption text-mute">PDF up to 5MB</p>
              </>
            )}
          </div>
        </div>

        {/* Paste JD */}
        <div className="flex flex-col gap-2">
          <label htmlFor="jd" className="text-body-md-strong text-ink flex justify-between items-baseline">
            <span>2. Paste Job Description</span>
            <span className="text-caption text-mute">{jobDescription.length} chars</span>
          </label>
          <textarea
            id="jd"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the full job description here. Our AI recruiter will evaluate your resume against these requirements — focusing on skills, impact, readability, and real shortlist potential."
            className="form-input min-h-[200px] py-3 resize-y bg-canvas-soft focus:bg-canvas focus:border-link focus:ring-1 focus:ring-link/50 transition-all"
          />
        </div>

        {error && (
          <div className="bg-error-soft/30 border border-error/30 text-error-deep px-4 py-3 rounded-md text-body-sm flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            {error}
          </div>
        )}

        <button 
          type="submit" 
          className="btn-primary w-full shadow-level-2 mt-4 text-button-lg h-14"
          disabled={!file || !jobDescription.trim()}
        >
          Get Recruiter Feedback
        </button>

      </form>
    </div>
  );
}
