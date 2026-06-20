export interface StructuredResume {
  contactInfo: {
    name: string;
    title: string;
    email: string;
    phone: string;
    linkedin?: string;
    location?: string;
  };
  summary?: string;
  experience: {
    company: string;
    title: string;
    location?: string;
    startDate: string;
    endDate: string;
    bullets: string[];
  }[];
  education: {
    institution: string;
    degree: string;
    field?: string;
    graduationDate?: string;
    gpa?: string;
  }[];
  skills: {
    category: string;
    items: string[];
  }[];
  certifications?: { name: string; issuer?: string; date?: string }[];
  projects?: { name: string; description: string; tech?: string[] }[];
}

export interface Improvement {
  original: string;
  improved: string;
  reasoning: string;
  section?: string;
  type?: string;
  impact?: string;
}

export interface AnalysisResult {
  matchScore: number;
  shortlistProbability: string;
  shortlistReasoning: string;
  skillGapAnalysis: {
    strongMatches: any[];
    partialMatches: any[];
    missingCritical: any[];
    bonusSkills: any[];
  };
  readabilityAssessment: {
    score: string;
    formatting: string;
    issues: string[];
    strengths: string[];
  };
  impactAnalysis: {
    strongBullets: any[];
    weakBullets: any[];
  };
  bulletImprovements: Improvement[];
  recruiterSearchVisibility: {
    score: number;
    titleAlignment: string;
    keyPhrases: string[];
    recommendations: string[];
  };
  overallSummary: string;
  topRecommendations: string[];
}
