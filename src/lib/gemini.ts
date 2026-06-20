const API_KEY = import.meta.env.GEMINI_API_KEY;
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent';

export async function analyzeResume(resumeText: string, jobDescription: string) {
  if (!API_KEY) throw new Error('Gemini API key is not configured');

  const prompt = `
  You are a senior technical recruiter with 15+ years of experience screening candidates.
  You are reviewing a candidate's resume against a specific job description.

  Your evaluation should reflect how a REAL recruiter evaluates resumes — not an ATS keyword matcher.
  Focus on: clarity, formatting quality, impact of bullet points, skill relevance, career progression,
  and whether this candidate would realistically be shortlisted for an interview.

  Analyze the resume and return your evaluation as JSON with the following structure:

  {
    "matchScore": <number 0-100, overall match quality from recruiter perspective>,
    "shortlistProbability": "<'Highly Likely' | 'Likely' | 'Maybe' | 'Unlikely'>",
    "shortlistReasoning": "<2-3 sentence explanation of why a recruiter would or wouldn't shortlist this candidate>",
    "skillGapAnalysis": {
      "strongMatches": [{ "skill": "<skill name>", "evidence": "<how resume demonstrates this>" }],
      "partialMatches": [{ "skill": "<skill name>", "gap": "<what's missing or weak>" }],
      "missingCritical": [{ "skill": "<skill name>", "importance": "<why this matters for the role>" }],
      "bonusSkills": [{ "skill": "<skill name>", "note": "<why this adds value even if not required>" }]
    },
    "readabilityAssessment": {
      "score": "<letter grade A+ to F>",
      "formatting": "<overall formatting quality assessment>",
      "issues": ["<specific formatting or readability problem>"],
      "strengths": ["<specific formatting or readability strength>"]
    },
    "impactAnalysis": {
      "strongBullets": [{ "text": "<the actual bullet text>", "why": "<why this is effective>" }],
      "weakBullets": [{ "text": "<the actual bullet text>", "issue": "<what's wrong>", "suggestion": "<how to improve>" }]
    },
    "bulletImprovements": [
      {
        "original": "<original bullet point from resume>",
        "improved": "<rewritten version using STAR method with metrics>",
        "reasoning": "<why this rewrite is better>"
      }
    ],
    "recruiterSearchVisibility": {
      "score": <number 0-100>,
      "titleAlignment": "<how well the resume title/headline matches the JD title>",
      "keyPhrases": ["<missing industry phrases that recruiters search for>"],
      "recommendations": ["<specific action to improve recruiter search visibility>"]
    },
    "overallSummary": "<3-4 sentence recruiter-perspective summary of this candidate>",
    "topRecommendations": ["<top 3-5 most impactful changes the candidate should make>"]
  }

  Important guidelines:
  - Be constructively honest, not harsh. A recruiter gives actionable feedback.
  - Provide at least 2 items in each array field (strongMatches, partialMatches, etc.) when applicable. Return empty arrays only when truly none exist.
  - Limit bulletImprovements to the 5 most impactful rewrites.
  - The matchScore should reflect real recruiter assessment — a 70+ means strong candidate, 85+ means exceptional.
  - For impactAnalysis, limit to 3 strong and 3 weak bullets maximum.
  - Write as if advising the candidate directly.

  Job Description:
  ${jobDescription}

  Resume:
  ${resumeText}
  `;

  const response = await fetch(`${API_URL}?key=${API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { response_mime_type: 'application/json' }
    })
  });

  if (!response.ok) {
    const err = await response.text();
    console.error('Gemini API Error:', err);
    throw new Error('Failed to analyze resume with Gemini');
  }

  const data = await response.json();
  const content = data.candidates[0].content.parts[0].text;
  
  try {
    return JSON.parse(content);
  } catch (e) {
    console.error('Failed to parse Gemini output:', content);
    throw new Error('Invalid JSON from Gemini');
  }
}

export async function generateRewriteSuggestions(resumeText: string, jobDescription: string) {
  if (!API_KEY) throw new Error('Gemini API key is not configured');

  const prompt = `
  You are a senior career coach and resume writer who thinks like a recruiter.
  Review the following resume against the job description and provide concrete rewrite suggestions.

  Focus on making bullet points impactful using the STAR method (Situation, Task, Action, Result).
  Do NOT just stuff keywords — instead, make the resume tell a compelling story that would
  convince a recruiter to pick up the phone.

  Return an array of improvement objects, up to 8 of the most impactful changes.
  Format the output exactly as JSON:

  [
    {
      "section": "<which resume section this appears in, e.g. 'Experience - Company Name', 'Summary', 'Skills'>",
      "type": "bullet_rewrite" | "section_suggestion" | "title_alignment" | "summary_rewrite",
      "original": "<original text from resume>",
      "improved": "<the rewritten version>",
      "reasoning": "<why this change matters from a recruiter's perspective>",
      "impact": "high" | "medium" | "low"
    }
  ]

  Prioritize:
  1. Weak bullet points that lack metrics or outcomes
  2. Title/headline alignment with the target role
  3. Summary section improvements
  4. Missing context that a recruiter would want to see

  Job Description:
  ${jobDescription}

  Resume:
  ${resumeText}
  `;

  const response = await fetch(`${API_URL}?key=${API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { response_mime_type: 'application/json' }
    })
  });

  if (!response.ok) {
    const err = await response.text();
    console.error('Gemini API Error:', err);
    throw new Error('Failed to generate rewrite suggestions with Gemini');
  }

  const data = await response.json();
  const content = data.candidates[0].content.parts[0].text;
  
  try {
    return JSON.parse(content);
  } catch (e) {
    console.error('Failed to parse Gemini output:', content);
    throw new Error('Invalid JSON from Gemini');
  }
}

export async function parseResumeStructured(resumeText: string) {
  if (!API_KEY) throw new Error('Gemini API key is not configured');

  const prompt = `
  You are an expert resume parser. Extract the following resume text into a structured JSON format.
  Clean up any formatting artifacts and normalize dates where possible.

  Format the output exactly as JSON matching this schema:
  {
    "contactInfo": {
      "name": "Full Name",
      "title": "Professional Title (if present)",
      "email": "email@example.com",
      "phone": "phone number",
      "linkedin": "linkedin URL if present",
      "location": "City, State if present"
    },
    "summary": "Professional summary or objective statement if present",
    "experience": [
      {
        "company": "Company Name",
        "title": "Job Title",
        "location": "Location if present",
        "startDate": "Start Date (e.g. 'Jan 2020')",
        "endDate": "End Date (e.g. 'Present' or 'Dec 2022')",
        "bullets": ["Bullet point 1", "Bullet point 2"]
      }
    ],
    "education": [
      {
        "institution": "University/School Name",
        "degree": "Degree Name",
        "field": "Field of Study",
        "graduationDate": "Graduation Date",
        "gpa": "GPA if present"
      }
    ],
    "skills": [
      {
        "category": "e.g. Languages, Frameworks, Tools",
        "items": ["Skill 1", "Skill 2"]
      }
    ],
    "certifications": [
      {
        "name": "Certification Name",
        "issuer": "Issuing Organization",
        "date": "Date"
      }
    ],
    "projects": [
      {
        "name": "Project Name",
        "description": "Project Description",
        "tech": ["Tech 1", "Tech 2"]
      }
    ]
  }

  Resume Text:
  ${resumeText}
  `;

  const response = await fetch(`${API_URL}?key=${API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { response_mime_type: 'application/json' }
    })
  });

  if (!response.ok) {
    const err = await response.text();
    console.error('Gemini API Error:', err);
    throw new Error('Failed to parse resume with Gemini');
  }

  const data = await response.json();
  const content = data.candidates[0].content.parts[0].text;
  
  try {
    return JSON.parse(content);
  } catch (e) {
    console.error('Failed to parse Gemini output:', content);
    throw new Error('Invalid JSON from Gemini');
  }
}
