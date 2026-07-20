import OpenAI from "openai";
// @ts-ignore
import pdfParse from "pdf-parse";
import { Types } from "mongoose";
import { CustomError, AuthorizationError } from "../../../shared/errors/custom.error.js";
import { JobRepository } from "../../jobs/repositories/job.repository.js";
import { UserRepository } from "../../users/repositories/user.repository.js";
import { ResumeRepository } from "../../users/repositories/resume.repository.js";
import { ApplicationRepository } from "../../applications/repositories/application.repository.js";
import { CompanyMemberRepository } from "../../companies/repositories/company-member.repository.js";
import {
  IResumeAnalysisResponse,
  IATSScoreResponse,
  IResumeSummaryResponse,
  ISkillGapResponse,
  ICandidateRankingResponse,
  IInterviewQuestionsResponse,
  IJobDescriptionResponse,
  ICareerCoachResponse
} from "../types/ai.types.js";

const FREE_MODELS = [
  "meta-llama/llama-3.3-70b-instruct:free",
  "meta-llama/llama-3-8b-instruct:free",
  "qwen/qwen3-next-80b-a3b-instruct:free"
];

export class AIService {
  private openai: OpenAI | null = null;
  private jobRepo = new JobRepository();
  private userRepo = new UserRepository();
  private resumeRepo = new ResumeRepository();
  private applicationRepo = new ApplicationRepository();
  private memberRepo = new CompanyMemberRepository();

  private getClient(): OpenAI {
    if (!this.openai) {
      if (!process.env.OPENROUTER_API_KEY) {
        throw new CustomError("OPENROUTER_API_KEY is not defined in environment variables", 500, "MODEL_ERROR");
      }
      this.openai = new OpenAI({
        baseURL: "https://openrouter.ai/api/v1",
        apiKey: process.env.OPENROUTER_API_KEY,
        timeout: 25000,
        defaultHeaders: {
          "HTTP-Referer": process.env.SITE_URL || "http://localhost:3000",
          "X-Title": "DevCircle AI"
        }
      });
    }
    return this.openai;
  }

  private async callLLM(prompt: string, systemPrompt: string, modelIndex = 0): Promise<any> {
    const client = this.getClient();
    const model = FREE_MODELS[modelIndex];

    try {
      const response = await client.chat.completions.create({
        model: model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt }
        ]
      });

      const content = response.choices[0].message.content || "";
      return this.parseJSONResponse(content, model);
    } catch (error: any) {
      console.warn(`[AI Warning] Model ${model} failed. Error: ${error.message}`);
      if (modelIndex < FREE_MODELS.length - 1) {
        return this.callLLM(prompt, systemPrompt, modelIndex + 1);
      }
      throw new CustomError(`AI completion failed: ${error.message}`, 500, "MODEL_ERROR");
    }
  }

  private parseJSONResponse(content: string, model: string): any {
    try {
      return JSON.parse(content);
    } catch {
      let clean = content.replace(/```json|```/g, "").trim();
      const startIdx = clean.indexOf("{");
      const endIdx = clean.lastIndexOf("}");
      if (startIdx !== -1 && endIdx !== -1) {
        try {
          return JSON.parse(clean.substring(startIdx, endIdx + 1));
        } catch (err: any) {
          console.error(`[AI Error] Cleaned content from ${model} failed JSON parse. Error: ${err.message}`);
        }
      }
      throw new CustomError("AI model response was not valid JSON", 500, "MODEL_ERROR");
    }
  }

  async parsePDFBuffer(buffer: Buffer): Promise<string> {
    try {
      // @ts-ignore
      const parsed = await pdfParse(buffer);
      return parsed.text || "";
    } catch (err: any) {
      throw new CustomError(`Failed to parse PDF: ${err.message}`, 400, "UNSUPPORTED_FILE");
    }
  }

  async getResumeText(userId: string, uploadedFile?: any): Promise<string> {
    if (uploadedFile) {
      return this.parsePDFBuffer(uploadedFile.buffer);
    }

    const resume = await this.resumeRepo.findByUserId(userId);
    if (!resume || !resume.url) {
      throw new CustomError("Resume file is required. Please upload a PDF or save a resume to your profile.", 400, "FILE_REQUIRED");
    }

    try {
      const response = await fetch(resume.url);
      if (!response.ok) {
        throw new Error(`Failed to fetch PDF from URL: ${response.statusText}`);
      }
      const arrayBuffer = await response.arrayBuffer();
      return this.parsePDFBuffer(Buffer.from(arrayBuffer));
    } catch (err: any) {
      throw new CustomError(`Failed to retrieve profile resume: ${err.message}`, 500, "MODEL_ERROR");
    }
  }

  async analyzeResume(userId: string, uploadedFile?: any): Promise<IResumeAnalysisResponse> {
    const resumeText = await this.getResumeText(userId, uploadedFile);

    const systemPrompt = "You are an expert HR and technical resume analyzer. You must analyze the provided resume text and return a structured JSON response matching the following schema:\n" +
      "{\n" +
      "  \"summary\": \"A short professional summary of the candidate's background.\",\n" +
      "  \"skills\": [\"List of identified key technical and soft skills\"],\n" +
      "  \"weaknesses\": [\"List of areas of improvement or skills/experience missing from the profile\"],\n" +
      "  \"strengths\": [\"List of outstanding achievements or key strengths in the profile\"],\n" +
      "  \"atsScore\": 85\n" +
      "}\n" +
      "Do not include any chat prefix or markdown text outside the JSON. Return only the JSON object.";

    const prompt = `Resume Text:\n\n${resumeText}`;
    return this.callLLM(prompt, systemPrompt);
  }

  async getATSScore(userId: string, uploadedFile?: any): Promise<IATSScoreResponse> {
    const resumeText = await this.getResumeText(userId, uploadedFile);

    const systemPrompt = "You are an expert Applicant Tracking System (ATS) evaluator. Evaluate the formatting, skills representation, and keywords matching of the resume. Return a structured JSON response matching the following schema:\n" +
      "{\n" +
      "  \"overallScore\": 80,\n" +
      "  \"formattingScore\": 85,\n" +
      "  \"skillsScore\": 75,\n" +
      "  \"keywordMatch\": [\"List of standard industry keywords matched in the resume\"],\n" +
      "  \"suggestions\": [\"Specific suggestions to improve the resume for ATS visibility\"]\n" +
      "}\n" +
      "Return only the JSON object, do not explain or prefix.";

    const prompt = `Resume Text:\n\n${resumeText}`;
    return this.callLLM(prompt, systemPrompt);
  }

  async getResumeSummary(userId: string, uploadedFile?: any): Promise<IResumeSummaryResponse> {
    const resumeText = await this.getResumeText(userId, uploadedFile);

    const systemPrompt = "You are an AI resume summarizer. Create a highly professional, high-impact overview of the candidate's career. Return a structured JSON response matching the following schema:\n" +
      "{\n" +
      "  \"professionalSummary\": \"A concise 3-4 sentence professional pitch.\",\n" +
      "  \"experienceSummary\": \"A summary of the candidate's professional achievements and career trajectory.\",\n" +
      "  \"educationSummary\": \"A summary of their academic achievements, degrees, and academic backgrounds.\"\n" +
      "}\n" +
      "Return only the JSON object, do not explain or prefix.";

    const prompt = `Resume Text:\n\n${resumeText}`;
    return this.callLLM(prompt, systemPrompt);
  }

  async getSkillGap(
    userId: string,
    jobId?: string,
    jobDescription?: string,
    uploadedFile?: any
  ): Promise<ISkillGapResponse> {
    const resumeText = await this.getResumeText(userId, uploadedFile);

    let jdText = jobDescription || "";
    if (jobId) {
      const job = await this.jobRepo.findById(jobId);
      if (!job) {
        throw new CustomError("Job not found", 404, "JOB_NOT_FOUND");
      }
      jdText = job.description;
    }

    if (!jdText.trim()) {
      throw new CustomError("Job description or Job ID is required to perform skill gap analysis", 400, "INVALID_PROMPT");
    }

    const systemPrompt = "You are a technical career advisor. Compare the candidate's resume against the job description to find missing skills, matched skills, and learning suggestions. Return a structured JSON response matching the following schema:\n" +
      "{\n" +
      "  \"matchedSkills\": [\"List of skills in the resume matching the job requirements\"],\n" +
      "  \"missingSkills\": [\"List of required skills or keywords mentioned in the job description but absent or weak in the resume\"],\n" +
      "  \"learningSuggestions\": [\"Specific, actionable suggestions (courses, projects, books) to acquire the missing skills\"]\n" +
      "}\n" +
      "Return only the JSON object, do not explain or prefix.";

    const prompt = `Resume Text:\n${resumeText}\n\nJob Description:\n${jdText}`;
    return this.callLLM(prompt, systemPrompt);
  }

  async rankCandidates(userId: string, jobId: string): Promise<ICandidateRankingResponse> {
    const job = await this.jobRepo.findById(jobId);
    if (!job) {
      throw new CustomError("Job not found", 404, "JOB_NOT_FOUND");
    }

    // Only recruiters belonging to the company can perform ranking
    const member = await this.memberRepo.findMember(job.companyId._id || job.companyId, userId);
    if (!member) {
      throw new AuthorizationError("Permission denied: Only company recruiters can rank candidates");
    }

    const applications = await this.applicationRepo.findByJob(jobId);
    if (applications.length === 0) {
      return { rankedCandidates: [] };
    }

    const candidateDataList = applications.map((app) => ({
      candidateId: (app.candidateId as any)._id ? (app.candidateId as any)._id.toString() : app.candidateId.toString(),
      candidateName: app.candidateSnapshot.name,
      skills: app.candidateSnapshot.skills,
      experience: app.candidateSnapshot.experience,
      education: app.candidateSnapshot.education
    }));

    const systemPrompt = "You are a recruitment analytics system. Rank the candidates based on how well their profiles match the job description. Return a structured JSON response matching the following schema:\n" +
      "{\n" +
      "  \"rankedCandidates\": [\n" +
      "    {\n" +
      "      \"candidateId\": \"The candidate's candidate ID\",\n" +
      "      \"candidateName\": \"The candidate's name\",\n" +
      "      \"matchingPercentage\": 95,\n" +
      "      \"reasoning\": \"A short description explaining why this candidate was ranked here\"\n" +
      "    }\n" +
      "  ]\n" +
      "}\n" +
      "Return only the JSON object, do not explain or prefix.";

    const prompt = `Job Title: ${job.title}\nJob Description: ${job.description}\n\nCandidates List:\n${JSON.stringify(candidateDataList)}`;
    return this.callLLM(prompt, systemPrompt);
  }

  async generateInterviewQuestions(
    userId: string,
    jobId: string,
    candidateId: string
  ): Promise<IInterviewQuestionsResponse> {
    const job = await this.jobRepo.findById(jobId);
    if (!job) {
      throw new CustomError("Job not found", 404, "JOB_NOT_FOUND");
    }

    const member = await this.memberRepo.findMember(job.companyId._id || job.companyId, userId);
    if (!member) {
      throw new AuthorizationError("Permission denied: Only company recruiters can generate interview questions");
    }

    const candidate = await this.userRepo.findById(candidateId);
    if (!candidate) {
      throw new CustomError("Candidate not found", 404, "USER_NOT_FOUND");
    }

    let candidateText = `Name: ${candidate.name}\nHeadline: ${candidate.headline || ""}\nSkills: ${(candidate.skills || []).join(", ")}\n`;

    const resume = await this.resumeRepo.findByUserId(candidateId);
    if (resume && resume.url) {
      try {
        const response = await fetch(resume.url);
        if (response.ok) {
          const arrayBuffer = await response.arrayBuffer();
          const parsed = await pdfParse(Buffer.from(arrayBuffer));
          candidateText += `\nParsed Resume Text:\n${parsed.text}`;
        }
      } catch (err) {
        console.warn(`[AI Warning] Failed to parse candidate resume: ${err}`);
      }
    }

    const systemPrompt = "You are a senior technical interviewer. Generate customized technical, behavioral, and follow-up interview questions based on the candidate's profile and the target job description. Return a structured JSON response matching the following schema:\n" +
      "{\n" +
      "  \"technicalQuestions\": [\"Technical questions tailored to candidate's skills and the job requirement\"],\n" +
      "  \"behavioralQuestions\": [\"Behavioral questions targeted to evaluate experience and soft skills\"],\n" +
      "  \"followUpQuestions\": [\"Specific follow-up questions to probe deeply into their past projects/employment\"]\n" +
      "}\n" +
      "Return only the JSON object, do not explain or prefix.";

    const prompt = `Job Title: ${job.title}\nJob Description: ${job.description}\n\nCandidate Background:\n${candidateText}`;
    return this.callLLM(prompt, systemPrompt);
  }

  async generateJobDescription(
    userId: string,
    jobTitle: string,
    experience: string | number,
    skills: string[]
  ): Promise<IJobDescriptionResponse> {
    const systemPrompt = "You are a professional HR copywriter. Generate a comprehensive job description. Return a structured JSON response matching the following schema:\n" +
      "{\n" +
      "  \"completeJobDescription\": \"A professional summary describing the role and company opportunity.\",\n" +
      "  \"responsibilities\": [\"List of key responsibilities for this role\"],\n" +
      "  \"requirements\": [\"List of concrete academic, experience, and skill requirements\"],\n" +
      "  \"niceToHaveSkills\": [\"List of optional or preferred skills/experience\"]\n" +
      "}\n" +
      "Return only the JSON object, do not explain or prefix.";

    const prompt = `Job Title: ${jobTitle}\nRequired Years of Experience: ${experience}\nKey Skills: ${skills.join(", ")}`;
    return this.callLLM(prompt, systemPrompt);
  }

  async careerCoach(userId: string, goal: string, uploadedFile?: any): Promise<ICareerCoachResponse> {
    const resumeText = await this.getResumeText(userId, uploadedFile);

    const systemPrompt = "You are a professional career coach. Develop a structured roadmap, projects list, skill recommendations, and resources to help the candidate achieve their target career goal. Return a structured JSON response matching the following schema:\n" +
      "{\n" +
      "  \"roadmap\": [\"Phase-by-phase timeline milestones to achieve the goal\"],\n" +
      "  \"recommendedSkills\": [\"Key technologies, libraries, and concepts to master\"],\n" +
      "  \"projects\": [\"Practical, portfolio-worthy project ideas matching the roadmap\"],\n" +
      "  \"learningResources\": [\"Books, documentation, tutorial topics, or courses to study\"]\n" +
      "}\n" +
      "Return only the JSON object, do not explain or prefix.";

    const prompt = `Candidate Resume Text:\n${resumeText}\n\nCareer Goal:\n${goal}`;
    return this.callLLM(prompt, systemPrompt);
  }
}
