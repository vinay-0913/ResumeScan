import type { APIRoute } from 'astro';
import { generateDOCX } from '../../lib/document-generator';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { resumeData, templateId, format } = await request.json();

    if (!resumeData || !format) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (format === 'docx') {
      const buffer = await generateDOCX(resumeData, templateId || 'professional');
      
      return new Response(buffer, {
        status: 200,
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'Content-Disposition': 'attachment; filename="tailored_resume.docx"'
        }
      });
    } else {
      // PDF generation would go here using @react-pdf/renderer in a real implementation
      // For this prototype, we'll return an error if PDF is requested via API (client-side PDF gen is often easier)
      return new Response(JSON.stringify({ error: 'PDF generation not fully implemented in prototype' }), {
        status: 501,
        headers: { 'Content-Type': 'application/json' }
      });
    }

  } catch (error: any) {
    console.error('Download API Error:', error);
    return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
