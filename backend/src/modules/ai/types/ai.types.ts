export interface IResumeAnalysisResponse {
  summary: string;
  skills: string[];
  weaknesses: string[];
  strengths: string[];
  atsScore: number;
}

export interface IATSScoreResponse {
  overallScore: number;
  formattingScore: number;
  skillsScore: number;
  keywordMatch: string[];
  suggestions: string[];
}

export interface IResumeSummaryResponse {
  professionalSummary: string;
  experienceSummary: string;
  educationSummary: string;
}

export interface ISkillGapResponse {
  matchedSkills: string[];
  missingSkills: string[];
  learningSuggestions: string[];
}

export interface IRankedCandidate {
  candidateId: string;
  candidateName: string;
  matchingPercentage: number;
  reasoning: string;
}

export interface ICandidateRankingResponse {
  rankedCandidates: IRankedCandidate[];
}

export interface IInterviewQuestionsResponse {
  technicalQuestions: string[];
  behavioralQuestions: string[];
  followUpQuestions: string[];
}

export interface IJobDescriptionResponse {
  completeJobDescription: string;
  responsibilities: string[];
  requirements: string[];
  niceToHaveSkills: string[];
}

export interface ICareerCoachResponse {
  roadmap: string[];
  recommendedSkills: string[];
  projects: string[];
  learningResources: string[];
}
