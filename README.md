# 🎯 ResumeScan

> **Don't beat the ATS — show clarity, impact, and outcome that aligns with the JD.**

ResumeScan is an AI-powered resume evaluation tool that simulates how a senior recruiter actually reviews a resume. Unlike simple ATS keyword matchers, ResumeScan uses Google Gemini to provide a holistic, human-perspective analysis: skill gaps, bullet point impact, readability, recruiter search visibility, and actionable rewrite suggestions — all in seconds.

---

## ✨ Features

### 📊 Recruiter-Style Analysis
- **Match Score (0–100)** — An overall fit score based on a real recruiter's perspective, not keyword density
- **Shortlist Probability** — `Highly Likely`, `Likely`, `Maybe`, or `Unlikely`, with detailed reasoning
- **Overall Summary** — A 3–4 sentence recruiter-style narrative of the candidate

### 🎯 Skill Gap Analysis
- **Strong Matches** — Skills clearly demonstrated in the resume with supporting evidence
- **Partial Matches** — Skills present but weakly demonstrated, with specific gaps identified
- **Missing Critical Skills** — Gaps that would likely disqualify or reduce shortlist chance
- **Bonus Skills** — Extra skills not required but that add value

### 📄 Readability Assessment
- **Letter-grade score** (A+ to F) for overall formatting quality
- Specific formatting issues and strengths called out
- Recruiter-perspective formatting feedback

### 💪 Bullet Point Impact Analysis
- Identifies the **strongest** bullet points and explains why they work
- Flags the **weakest** bullet points with specific issues and improvement suggestions
- Evaluates use of metrics, outcomes, and the STAR method

### 🔍 Recruiter Search Visibility
- Score (0–100) for how discoverable the resume is to recruiters searching by keywords
- Title/headline alignment with the target JD
- Missing industry phrases recruiters search for
- Concrete recommendations to improve visibility

### ✍️ AI-Powered Rewrite Suggestions
- Up to 8 high-impact before → after rewrites using the STAR method
- Categorized by section (`Experience`, `Summary`, `Skills`, etc.) and impact level (`high`, `medium`, `low`)
- Career coach reasoning for every suggestion

### 📥 Resume Download
- **Parse & Rebuild** — AI structurally parses the resume and rebuilds it as a clean `.docx`
- Choose from 8 professional templates: Professional, Modern, Minimal, Executive, Technical, Creative, Academic, Entry Level
- Download-ready `.docx` output via the `docx` library

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Astro 6](https://astro.build) (SSR, Node adapter) |
| **UI Components** | [React 19](https://react.dev) (island architecture) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com) (via Vite plugin) |
| **AI / LLM** | [Google Gemini 2.5 Flash Lite](https://ai.google.dev) |
| **PDF Parsing** | [pdf-parse](https://www.npmjs.com/package/pdf-parse) |
| **DOCX Generation** | [docx](https://docx.js.org) |
| **Language** | TypeScript |
| **Runtime** | Node.js ≥ 22.12.0 |

---

## 📁 Project Structure

```
d:/Resumescan/
├── public/                     # Static assets
├── src/
│   ├── assets/                 # Images and static resources
│   ├── components/             # Astro & React components
│   │   ├── Navbar.astro
│   │   ├── HeroSection.astro   # Landing page hero
│   │   ├── FeaturesSection.astro
│   │   ├── HowItWorks.astro
│   │   ├── SocialProof.astro
│   │   ├── TemplatesPreview.astro
│   │   ├── FAQ.astro
│   │   ├── CTASection.astro
│   │   ├── Footer.astro
│   │   └── app/                # React island components
│   │       ├── ResumeScanner.tsx     # Main orchestrator (upload → analyze → improve)
│   │       ├── UploadZone.tsx        # Drag-and-drop PDF uploader + JD input
│   │       ├── RecruiterVerdict.tsx  # Match score + shortlist probability
│   │       ├── SkillGapAnalysis.tsx  # Tabbed skill gap breakdown
│   │       ├── ReadabilityAssessment.tsx
│   │       ├── ImpactAnalysis.tsx
│   │       ├── RecruiterVisibility.tsx
│   │       ├── BulletImprovements.tsx
│   │       ├── ResumeTailor.tsx      # Side-by-side suggestions + template selector
│   │       ├── TemplateSelector.tsx
│   │       ├── DownloadPanel.tsx
│   │       ├── editor/               # Resume editor components
│   │       └── preview/              # Resume preview components
│   ├── layouts/
│   │   └── Layout.astro        # Base HTML layout
│   ├── lib/
│   │   ├── gemini.ts           # Gemini API calls (analyze, tailor, parse)
│   │   ├── pdf-parser.ts       # PDF text extraction
│   │   ├── document-generator.ts # DOCX generation
│   │   ├── templates.ts        # Resume template definitions
│   │   └── types.ts            # Shared TypeScript interfaces
│   ├── pages/
│   │   ├── index.astro         # Landing page
│   │   ├── scan.astro          # Main app page
│   │   └── api/
│   │       ├── scan.ts         # POST /api/scan — PDF + JD → analysis JSON
│   │       ├── tailor.ts       # POST /api/tailor — Resume text + JD → rewrites + structured resume
│   │       └── download.ts     # POST /api/download — Structured resume + template → .docx
│   └── styles/                 # Global CSS / Tailwind config
├── .env                        # Environment variables (not committed)
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

---

## 🚀 Getting Started (Local)

### Prerequisites

- **Node.js** `>= 22.12.0`
- A **Google Gemini API key** — [get one free here](https://aistudio.google.com/app/apikey)

### 1. Clone the repository

```sh
git clone <your-repo-url>
cd Resumescan
```

### 2. Install dependencies

```sh
npm install
```

### 3. Configure environment variables

```sh
cp .env.example .env
```

Then open `.env` and fill in your Gemini API key:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

> ⚠️ **Never commit your `.env` file.** It is already in `.gitignore`.

### 4. Start the development server

```sh
npm run dev
```

The app will be available at **[http://localhost:4321](http://localhost:4321)**.

---

## ☁️ Deploy to Vercel

This project is configured for **one-click Vercel deployment** using the `@astrojs/vercel` adapter.

### Option A — Deploy via Vercel Dashboard (Recommended)

1. Push your code to GitHub (already done ✅)
2. Go to [vercel.com/new](https://vercel.com/new) and import your GitHub repository
3. Vercel will auto-detect the Astro framework — no build settings needed
4. Add your environment variable:
   - **Name:** `GEMINI_API_KEY`
   - **Value:** your Google Gemini API key
5. Click **Deploy** 🚀

### Option B — Deploy via Vercel CLI

```sh
npm install -g vercel
vercel
```

Follow the prompts, then set the environment variable:

```sh
vercel env add GEMINI_API_KEY
```

### Environment Variables on Vercel

| Variable | Required | Description |
|---|---|---|
| `GEMINI_API_KEY` | ✅ Yes | Google Gemini API key — [get one here](https://aistudio.google.com/app/apikey) |

> **Note:** All API routes (`/api/scan`, `/api/tailor`, `/api/download`) run as Vercel Serverless Functions. The Gemini API key is kept server-side and never exposed to the browser.

---

## 🧞 Commands

All commands are run from the project root:

| Command | Action |
|:---|:---|
| `npm install` | Install project dependencies |
| `npm run dev` | Start local dev server at `localhost:4321` |
| `npm run build` | Build the production site to `./dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run astro ...` | Run Astro CLI commands (e.g., `astro check`) |
| `npm run astro -- --help` | Show Astro CLI help |

---

## 🔌 API Reference

### `POST /api/scan`

Accepts a PDF resume and job description text. Returns a full recruiter-style analysis.

**Request** — `multipart/form-data`

| Field | Type | Description |
|---|---|---|
| `resume` | `File` (PDF) | The candidate's resume |
| `jd` | `string` | The job description text |

**Response** — `application/json`

```json
{
  "analysis": {
    "matchScore": 78,
    "shortlistProbability": "Likely",
    "shortlistReasoning": "...",
    "skillGapAnalysis": { "strongMatches": [], "partialMatches": [], "missingCritical": [], "bonusSkills": [] },
    "readabilityAssessment": { "score": "B+", "formatting": "...", "issues": [], "strengths": [] },
    "impactAnalysis": { "strongBullets": [], "weakBullets": [] },
    "bulletImprovements": [],
    "recruiterSearchVisibility": { "score": 65, "titleAlignment": "...", "keyPhrases": [], "recommendations": [] },
    "overallSummary": "...",
    "topRecommendations": []
  },
  "extractedResumeText": "..."
}
```

---

### `POST /api/tailor`

Generates AI-powered rewrite suggestions and a structured parse of the resume.

**Request** — `application/json`

```json
{
  "resumeText": "...",
  "jdText": "..."
}
```

**Response** — `application/json`

```json
{
  "suggestions": [
    {
      "section": "Experience - Acme Corp",
      "type": "bullet_rewrite",
      "original": "...",
      "improved": "...",
      "reasoning": "...",
      "impact": "high"
    }
  ],
  "structuredResume": { "contactInfo": {}, "experience": [], "education": [], "skills": [], ... }
}
```

---

### `POST /api/download`

Generates a formatted `.docx` resume file from a structured resume object.

**Request** — `application/json`

```json
{
  "structuredResume": { ... },
  "templateId": "professional"
}
```

**Response** — Binary `.docx` file download.

---

## 🤖 AI Prompts & Model

ResumeScan uses **Gemini 2.5 Flash Lite** for all three AI operations:

| Function | Description |
|---|---|
| `analyzeResume()` | Simulates a senior recruiter reviewing the resume against a JD. Returns structured JSON with scores, skill gaps, impact analysis, visibility recommendations, and more. |
| `generateRewriteSuggestions()` | Acts as a career coach, producing up to 8 STAR-method bullet rewrites prioritised by impact. |
| `parseResumeStructured()` | Parses raw resume text into a normalised JSON structure for DOCX generation. |

All responses are requested in `application/json` MIME type via the Gemini API's `generationConfig`.

---

## 📝 Resume Templates

Eight templates are available for DOCX export:

| ID | Name | Description |
|---|---|---|
| `professional` | Professional | Classic single-column layout with serif headings |
| `modern` | Modern | Two-column layout with a sidebar for skills |
| `minimal` | Minimal | Clean single-column with lots of whitespace |
| `executive` | Executive | Bold headers and prominent professional summary |
| `technical` | Technical | Skills matrix and project-focused layout |
| `creative` | Creative | Subtle color accents and unique section dividers |
| `academic` | Academic | Education-first structure with publications section |
| `entry-level` | Entry Level | Highlights coursework and relevant projects |

---

## 🔒 Privacy

- **No data is stored.** Resumes and job descriptions are processed in memory on the server and never persisted to a database.
- **No account required.** The tool is fully free to use without sign-up.
- Your API key is server-side only and never exposed to the client.

---

## 🧩 How It Works

```
User uploads PDF + pastes Job Description
         │
         ▼
POST /api/scan
  → pdf-parse extracts resume text
  → Gemini analyzes resume vs. JD (recruiter perspective)
  → Returns: match score, skill gaps, readability, impact, visibility
         │
         ▼
User reviews analysis results
  → RecruiterVerdict (score + shortlist probability)
  → Tabbed panels: Skill Gaps / Readability / Impact / Visibility
         │
         ▼ (optional)
POST /api/tailor
  → Gemini generates STAR-method bullet rewrites
  → Gemini parses resume into structured JSON
  → Returns: improvement suggestions + structured resume
         │
         ▼
User edits suggestions in ResumeTailor
  → Selects template
         │
         ▼
POST /api/download
  → docx library generates formatted .docx
  → Browser downloads the file
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Please open an issue first to discuss what you'd like to change.

---

## 📄 License

This project is open source. See the [LICENSE](./LICENSE) file for details.

---

*Built with [Astro](https://astro.build), [React](https://react.dev), and [Google Gemini](https://ai.google.dev).*
