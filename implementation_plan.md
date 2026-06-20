# Resumescan — AI-Powered Resume Tailoring Website

Build an AI-powered resume tailoring platform at `resumescan.com` that outperforms Rezi.ai and Jobscan.co, using Astro 6, Tailwind CSS v4, Gemini AI, and a Vercel-inspired design language.

## Competitor Analysis & Differentiators

### What competitors do well (features we need)
| Feature | Rezi.ai | Jobscan.co | Resumescan (ours) |
|---|---|---|---|
| ATS Score / Match Rate | ✅ Rezi Score (23 criteria) | ✅ Match Rate % | ✅ Deep ATS Score with **visual breakdown** |
| Keyword Analysis | ✅ AI Keyword Targeting | ✅ Hard/Soft skill matching | ✅ **Side-by-side diff view** with color-coded matches |
| Resume Tailoring | ❌ Manual editing after suggestions | ✅ One-Click Optimize (paid) | ✅ **One-click AI tailoring** with live preview |
| Resume Templates | ✅ 4 templates | ✅ Basic builder | ✅ **8+ ATS-friendly templates** with live preview |
| Download | ✅ PDF/DOCX/Google Drive | ✅ PDF | ✅ **PDF + DOCX** |
| Cover Letter | ✅ Generator | ✅ Generator | 🔜 Phase 2 |

### How we beat them (unique value propositions)

> [!IMPORTANT]
> These are the key differentiators that make Resumescan better:

1. **Instant visual keyword gap analysis** — A side-by-side split view showing your resume vs JD with color-coded keyword matches/misses (neither competitor does this visually)
2. **Real-time ATS score gauge** — Animated circular score gauge that updates live as AI tailors (competitors show static numbers)
3. **Before/After comparison** — Show the original vs tailored resume side-by-side so users see exactly what changed
4. **Free one-click tailoring** — Rezi requires manual editing, Jobscan locks "one-click" behind paywall; ours is free with Gemini
5. **Template preview with your data** — See your actual resume content in each template before choosing (competitors show generic previews)
6. **Skill gap recommendations** — Not just missing keywords, but actionable suggestions ("Add a bullet point about X using the STAR method")
7. **No account required** — Scan & tailor without signup (competitors force account creation)
8. **Beautiful Vercel-quality UI** — Premium feel vs competitors' dated corporate designs

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | **Astro 6** (SSR with `output: 'server'` for API routes) |
| Styling | **Tailwind CSS v4** (`@tailwindcss/vite` plugin) |
| UI Framework | **React 19** (for interactive islands: upload, score gauge, tailoring flow) |
| AI | **Google Gemini** via REST API (`generativelanguage.googleapis.com`) |
| PDF Parsing | **pdf-parse** (server-side PDF text extraction) |
| PDF Generation | **@react-pdf/renderer** (ATS-friendly PDF output) |
| DOCX Generation | **docx** (npm package for .docx output) |
| Fonts | **Geist** + **Geist Mono** (Vercel design system) |
| Adapter | **@astrojs/node** (for SSR/API routes) |

## User Review Required

> [!IMPORTANT]
> **API Key Security**: The Gemini API key will be stored in a `.env` file and only used server-side via Astro API routes. It will never be exposed to the client. Please confirm this approach is acceptable.

> [!WARNING]
> **Scope**: This is a large project. I recommend building it in phases. Phase 1 (this plan) covers the complete landing page + core scan/tailor flow. Phase 2 (future) would add user accounts, saved resumes, cover letters, etc. Does this phasing work for you?

## Open Questions

1. **Adapter**: Do you plan to deploy this on Vercel, Netlify, or a Node.js server? This determines which Astro adapter to use. I'll use `@astrojs/node` as default.
2. **Resume storage**: Should tailored resumes be stored server-side, or is client-side only (download immediately) acceptable for Phase 1?
3. **Rate limiting**: Should we add rate limiting to the Gemini API calls to prevent abuse, or is that a Phase 2 concern?

---

## Proposed Changes

### Phase 1: Foundation Setup

#### [MODIFY] [astro.config.mjs](file:///d:/Resumescan/astro.config.mjs)
- Add React integration (`@astrojs/react`)
- Add Node adapter (`@astrojs/node`) for SSR
- Add Tailwind v4 Vite plugin (`@tailwindcss/vite`)
- Set `output: 'server'` for API route support

#### [NEW] .env
- `GEMINI_API_KEY` environment variable

#### [MODIFY] [package.json](file:///d:/Resumescan/package.json)
- Add dependencies: `@astrojs/react`, `@astrojs/node`, `@tailwindcss/vite`, `tailwindcss`, `react`, `react-dom`, `pdf-parse`, `docx`, `@types/react`, `@types/react-dom`

---

### Phase 2: Design System (Tailwind v4 + Vercel Design Tokens)

#### [NEW] src/styles/global.css
Tailwind v4 entry point with `@import "tailwindcss"` and full `@theme` block mapping all DESIGN.md tokens:
- Colors: canvas, ink, body, mute, hairline, gradients, semantic colors
- Typography: Geist font family, all display/body/caption/code sizes via CSS custom properties
- Spacing: 4px base unit scale (xxs through section)
- Border radius: none through pill/full
- Shadows: stacked shadow elevation system (Level 0-5)
- Custom utilities for Vercel-specific patterns

#### [NEW] src/styles/components.css
Component-level Tailwind classes for reusable primitives:
- `.btn-primary`, `.btn-secondary` (pill CTAs)
- `.card-marketing`, `.card-soft` (elevation + hairline)
- `.form-input`, `.form-input-lg` (styled inputs)
- `.badge-secondary`, `.banner-marketing`

---

### Phase 3: Layout & Navigation

#### [MODIFY] [Layout.astro](file:///d:/Resumescan/src/layouts/Layout.astro)
- Import global.css for Tailwind
- Add Geist + Geist Mono font loading from CDN
- SEO meta tags for resumescan.com
- Structured data (JSON-LD) for SoftwareApplication
- Proper `<html>`, `<head>`, `<body>` with Vercel design tokens

#### [NEW] src/components/Navbar.astro
Vercel-style sticky nav bar (64px height):
- Logo ("Resumescan") left
- Nav links center: Features, How It Works, Templates, Pricing
- CTA cluster right: "Log In" (ghost) + "Get Started" (primary pill)
- Mobile: hamburger → full overlay menu
- Hairline bottom border + subtle backdrop blur

#### [NEW] src/components/Footer.astro
4-column footer with:
- Column 1: Resumescan logo + description
- Column 2: Product links
- Column 3: Resources
- Column 4: Legal
- Bottom bar: © 2024 Resumescan · Social links
- Mono-caps eyebrow labels per DESIGN.md

---

### Phase 4: Landing Page Sections

#### [MODIFY] [index.astro](file:///d:/Resumescan/src/pages/index.astro)
Complete landing page with these sections:

**Hero Section** (`hero-band` pattern):
- Headline: "Tailor your resume. Beat the ATS." (display-xl, sentence-case, period-terminated)
- Sub: "Upload your resume and job description. Get instant ATS score, keyword analysis, and AI-powered tailoring — free."
- Two CTAs: "Scan Your Resume" (primary pill) + "See How It Works" (secondary pill)
- Background: Vercel mesh gradient (cyan/blue/magenta/amber) at hero scale
- Upload drop zone area embedded in hero

**How It Works Section** (`showcase-band-light`):
- 3-step flow with animated icons:
  1. Upload Resume & Job Description
  2. Get ATS Score & Keyword Analysis
  3. AI Tailors Your Resume → Download
- Each step in a `card-marketing` with Level 3 shadow

**Features Section** (`feature-mesh-band`):
- 3-up feature grid:
  - "Keyword Gap Analysis" — side-by-side diff view
  - "AI-Powered Tailoring" — Gemini-powered rewriting
  - "ATS-Friendly Templates" — professional designs
- Mesh gradient backdrop

**Templates Preview Section** (`showcase-band-dark`):
- Polarity-flipped dark band
- Horizontal scroll of template cards (template-card pattern)
- 8 ATS-friendly template previews

**Social Proof Section**:
- Stats: "10,000+ resumes tailored" / "95% ATS pass rate" / "Free forever"
- Trust badges

**FAQ Section**:
- Accordion with common questions about ATS, resume tailoring, etc.
- Schema.org FAQPage markup

**CTA Section**:
- Final conversion push: "Ready to land more interviews?"
- Primary CTA button

---

### Phase 5: Scan & Tailor App (React Islands)

#### [NEW] src/components/app/ResumeScanner.tsx
Main interactive React island (`client:load`) — the core product experience:
- **Step 1: Upload** — Drag-and-drop zone for resume (PDF) + textarea for job description
- **Step 2: Analysis** — Loading animation → ATS score gauge + keyword breakdown
- **Step 3: Tailor** — Template selection → AI tailoring with progress
- **Step 4: Download** — Preview + download (PDF/DOCX)

#### [NEW] src/components/app/UploadZone.tsx
Drag-and-drop file upload component:
- Drop zone with dashed border (hairline style)
- File type validation (PDF only)
- Upload progress indicator
- File preview after upload

#### [NEW] src/components/app/ATSScoreGauge.tsx
Animated circular score gauge:
- SVG-based ring gauge with animated fill
- Score 0-100 with color gradient (red → yellow → green)
- Animated number counter
- Score breakdown categories below

#### [NEW] src/components/app/KeywordAnalysis.tsx
Side-by-side keyword gap analysis:
- Split view: Resume keywords (left) vs JD keywords (right)
- Color coding: ✅ matched (green), ❌ missing (red), ⚠️ partial (amber)
- Category grouping: Hard Skills, Soft Skills, Tools, Certifications
- Each missing keyword has an AI-generated suggestion

#### [NEW] src/components/app/TemplateSelector.tsx
Template selection carousel:
- 8 ATS-friendly templates shown as cards
- Hover preview with user's actual resume data
- Selected state with primary border
- Template categories: Professional, Modern, Minimal, Creative

#### [NEW] src/components/app/ResumePreview.tsx
Before/After resume comparison:
- Two-column layout showing original vs tailored
- Highlighted changes (green = added, red = removed)
- Diff annotations explaining each change

#### [NEW] src/components/app/DownloadPanel.tsx
Download options:
- PDF download button
- DOCX download button
- Preview in new tab

---

### Phase 6: API Routes (Server-Side)

#### [NEW] src/pages/api/scan.ts
`POST /api/scan` — Resume scanning endpoint:
- Accepts: resume text + job description text
- Calls Gemini API to analyze ATS compatibility
- Returns: ATS score, keyword matches, missing keywords, suggestions
- Response shape:
```json
{
  "score": 72,
  "categories": {
    "hardSkills": { "matched": [...], "missing": [...] },
    "softSkills": { "matched": [...], "missing": [...] },
    "tools": { "matched": [...], "missing": [...] },
    "certifications": { "matched": [...], "missing": [...] }
  },
  "suggestions": [...]
}
```

#### [NEW] src/pages/api/tailor.ts
`POST /api/tailor` — Resume tailoring endpoint:
- Accepts: resume text + job description + selected template
- Calls Gemini API to rewrite resume sections
- Returns: tailored resume content (structured JSON for each section)

#### [NEW] src/pages/api/download.ts
`POST /api/download` — Document generation endpoint:
- Accepts: tailored resume JSON + format (pdf/docx) + template ID
- Generates formatted document server-side
- Returns: binary file download

#### [NEW] src/lib/gemini.ts
Gemini API client wrapper:
- `analyzeResume(resumeText, jobDescription)` → score + keywords
- `tailorResume(resumeText, jobDescription, template)` → tailored content
- Rate limiting and error handling
- Structured prompts for consistent JSON output

#### [NEW] src/lib/pdf-parser.ts
PDF text extraction utility:
- Uses `pdf-parse` to extract text from uploaded PDFs
- Handles multi-page documents
- Returns clean text string

#### [NEW] src/lib/document-generator.ts
Document generation utilities:
- `generatePDF(resumeData, templateId)` → PDF buffer
- `generateDOCX(resumeData, templateId)` → DOCX buffer
- Template-specific formatting

---

### Phase 7: Resume Templates

#### [NEW] src/lib/templates/
8 ATS-friendly resume template definitions:
1. **Professional** — Classic single-column, serif headings
2. **Modern** — Two-column with sidebar
3. **Minimal** — Clean single-column, lots of whitespace
4. **Executive** — Bold headers, professional summary prominent
5. **Technical** — Skills matrix, project-focused
6. **Creative** — Subtle color accents, unique section dividers
7. **Academic** — Education-first, publications section
8. **Entry Level** — Skills & coursework prominent, minimal experience

Each template is a JSON schema defining:
- Section order and layout
- Typography choices (all ATS-safe fonts)
- Spacing and margin rules
- Color scheme (minimal, ATS-safe)

---

### Scan Page

#### [NEW] src/pages/scan.astro
Dedicated scan page with the ResumeScanner React island:
- Full-width app layout (no marketing sections)
- Sticky header with progress indicator (Upload → Analyze → Tailor → Download)
- ResumeScanner component rendered as Astro island

---

## File Structure Summary

```
d:/Resumescan/
├── .env                              # GEMINI_API_KEY
├── astro.config.mjs                  # Updated with React, Node adapter, TW v4
├── package.json                      # Updated dependencies
├── src/
│   ├── styles/
│   │   ├── global.css                # Tailwind v4 + Vercel design tokens
│   │   └── components.css            # Component classes
│   ├── layouts/
│   │   └── Layout.astro              # Main layout with fonts, meta, etc.
│   ├── components/
│   │   ├── Navbar.astro              # Sticky nav
│   │   ├── Footer.astro              # 4-column footer
│   │   ├── HeroSection.astro         # Hero with mesh gradient
│   │   ├── HowItWorks.astro          # 3-step flow
│   │   ├── FeaturesSection.astro     # 3-up feature grid
│   │   ├── TemplatesPreview.astro    # Dark band template showcase
│   │   ├── SocialProof.astro         # Stats + trust badges
│   │   ├── FAQ.astro                 # Accordion FAQ
│   │   ├── CTASection.astro          # Final CTA
│   │   └── app/                      # React interactive components
│   │       ├── ResumeScanner.tsx      # Main app flow
│   │       ├── UploadZone.tsx         # Drag & drop upload
│   │       ├── ATSScoreGauge.tsx      # Animated score ring
│   │       ├── KeywordAnalysis.tsx    # Side-by-side keywords
│   │       ├── TemplateSelector.tsx   # Template picker
│   │       ├── ResumePreview.tsx      # Before/after diff
│   │       └── DownloadPanel.tsx      # Download options
│   ├── pages/
│   │   ├── index.astro               # Landing page
│   │   ├── scan.astro                # Scan/tailor app page
│   │   └── api/
│   │       ├── scan.ts               # POST: analyze resume
│   │       ├── tailor.ts             # POST: tailor resume
│   │       └── download.ts           # POST: generate document
│   └── lib/
│       ├── gemini.ts                 # Gemini API client
│       ├── pdf-parser.ts             # PDF text extraction
│       ├── document-generator.ts     # PDF/DOCX generation
│       └── templates/                # 8 resume templates
│           ├── index.ts
│           ├── professional.ts
│           ├── modern.ts
│           ├── minimal.ts
│           ├── executive.ts
│           ├── technical.ts
│           ├── creative.ts
│           ├── academic.ts
│           └── entry-level.ts
```

## Verification Plan

### Automated Tests
1. `npm run build` — Verify successful Astro build
2. `npm run dev` — Start dev server and verify all pages load
3. Test API routes with curl/fetch:
   - `POST /api/scan` with sample resume + JD
   - `POST /api/tailor` with scan results
   - `POST /api/download` for PDF/DOCX generation

### Manual Verification
1. **Landing page**: All sections render correctly with Vercel design system
2. **Responsive**: Test at mobile (< 600px), tablet (600-959px), desktop (960+)
3. **Upload flow**: Drag-and-drop PDF, paste JD, get score
4. **Tailoring flow**: Select template, AI tailors, preview changes
5. **Download**: PDF and DOCX generate correctly with ATS-friendly formatting
6. **Performance**: Lighthouse audit targeting 90+ scores
7. **Accessibility**: Keyboard navigation, screen reader, color contrast
