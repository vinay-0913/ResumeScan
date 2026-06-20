import type { APIRoute } from 'astro';
import { generateRewriteSuggestions, parseResumeStructured } from '../../lib/gemini';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { resumeText, jdText } = await request.json();

    if (!resumeText || !jdText) {
      return new Response(JSON.stringify({ error: 'Missing resume or job description' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Run both AI calls in parallel
    const [suggestions, structuredResume] = await Promise.all([
      generateRewriteSuggestions(resumeText, jdText),
      parseResumeStructured(resumeText)
    ]);

    return new Response(JSON.stringify({ 
      suggestions,
      structuredResume
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('Tailor API Error:', error);
    return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
