import { PDFParse } from "pdf-parse";
import { getAICompletion } from "../../utils/ai.service.js";

// Function to call OpenRouter AI and get structured JSON response
export const analyzeResumeContent = async (text) => {
  const systemPrompt = `
You are an expert AI Applicant Tracking System (ATS) and Senior Technical Recruiter.
Evaluate the following resume text and provide a structured JSON response.

You must analyze based on:
* ATS readability and section structure
* Keyword optimization and technical skills quality
* Quantified achievements (metrics) and action verbs
* Project strength, complexity, and technical depth
* Resume competitiveness for modern tech roles.

Your response MUST be ONLY valid JSON matching this exact structure:
{
  "score": number (0-100),
  "summary": "Short overall evaluation",
  "strengths": [ "strength 1", "strength 2" ],
  "weaknesses": [ "weakness 1", "weakness 2" ],
  "improvements": [ "improvement 1", "improvement 2" ],
  "missingKeywords": [ "keyword 1", "keyword 2" ],
  "interviewQuestions": [
    {
      "question": "The interview question",
      "reason": "Why this question is being asked based on the resume"
    }
  ],
  "projectReview": [
    {
      "projectName": "Project name",
      "rating": "Strong | Average | Basic | Impressive",
      "feedback": "Detailed AI feedback about the project quality."
    }
  ]
}
  `;

  const userPrompt = `Resume Text:\n"""\n${text}\n"""`;

  try {
    // Using centralized AI service with automatic fallback
    const analysis = await getAICompletion(userPrompt, systemPrompt);
    return analysis;
  } catch (error) {
    console.error("Resume Analysis Migration Error:", error);
    throw new Error(`Failed to analyze resume with AI: ${error.message}`);
  }
};

export const extractTextFromPdfBuffer = async (buffer) => {
  let parser = null;
  try {
    parser = new PDFParse({ data: buffer });
    const result = await parser.getText();
    return result.text;
  } catch (error) {
    console.error("PDF Parsing Error:", error);
    throw new Error(`Failed to parse PDF file: ${error.message}`);
  } finally {
    if (parser) {
      await parser.destroy();
    }
  }
};
