import type { APIRoute } from 'astro';
import { extractTextFromPDF } from '../../lib/pdf-parser';
import { analyzeResume } from '../../lib/gemini';

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const resumeFile = formData.get('resume') as File;
    const jdText = formData.get('jd') as string;

    if (!resumeFile || !jdText) {
      return new Response(JSON.stringify({ error: 'Missing resume or job description' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Extract text from PDF
    const arrayBuffer = await resumeFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const resumeText = await extractTextFromPDF(buffer);

    // Call Gemini to perform recruiter-style evaluation
    const result = await analyzeResume(resumeText, jdText);

    return new Response(JSON.stringify({
      analysis: result,
      extractedResumeText: resumeText // Send back for next step
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('Scan API Error:', error);
    return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
