import { GoogleGenerativeAI } from "@google/generative-ai";
import { PDFParse } from "pdf-parse";

// Function to call Gemini API and get structured JSON response
export const analyzeResumeContent = async (text) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not defined in environment variables");
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

  const prompt = `
You are an expert AI Applicant Tracking System (ATS) and Senior Technical Recruiter.
Evaluate the following resume text and provide a structured JSON response.

Resume Text:
"""
${text}
"""

Please analyze based on the following criteria:
* ATS readability and section structure
* Keyword optimization and technical skills quality
* Quantified achievements and action verbs
* Formatting quality and engineering impact
* Project strength, complexity, real-world usefulness, technical depth, scalability, and whether projects look beginner/basic.
* Resume competitiveness for internships/jobs.

Your response MUST be ONLY valid JSON matching this exact structure, with no markdown formatting (like \`\`\`json) outside of the JSON:
{
  "score": number (0-100),
  "summary": "Short overall evaluation",
  "strengths": [ "strength 1", "strength 2" ],
  "weaknesses": [ "weakness 1", "weakness 2" ],
  "improvements": [ "improvement 1", "improvement 2" ],
  "missingKeywords": [ "keyword 1", "keyword 2" ],
  "projectReview": [
    {
      "projectName": "Project name",
      "rating": "Strong | Average | Basic | Impressive",
      "feedback": "Detailed AI feedback about the project quality. Explain which projects are impressive, which feel basic/tutorial-level, what makes projects stronger, and what recruiters may think."
    }
  ]
}
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const textResponse = response.text();
    
    // Clean up potential markdown wrapper from Gemini output
    let cleanJson = textResponse.trim();
    if (cleanJson.startsWith("\`\`\`json")) {
      cleanJson = cleanJson.substring(7);
    }
    if (cleanJson.startsWith("\`\`\`")) {
      cleanJson = cleanJson.substring(3);
    }
    if (cleanJson.endsWith("\`\`\`")) {
      cleanJson = cleanJson.substring(0, cleanJson.length - 3);
    }

    return JSON.parse(cleanJson);
  } catch (error) {
    console.error("Gemini API Error:", error);
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
