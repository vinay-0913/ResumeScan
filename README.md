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
