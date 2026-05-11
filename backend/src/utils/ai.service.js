import OpenAI from "openai";

let openaiClient = null;

const getOpenAIClient = () => {
  if (!openaiClient) {
    if (!process.env.OPENROUTER_API_KEY) {
      throw new Error("OPENROUTER_API_KEY is not defined in environment variables");
    }
    openaiClient = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_API_KEY,
      timeout: 15000, // 15 seconds to prevent hanging
      defaultHeaders: {
        "HTTP-Referer": process.env.SITE_URL || "http://localhost:3000",
        "X-Title": "DevCircle AI",
      }
    });
  }
  return openaiClient;
};

const FREE_MODELS = [
  "meta-llama/llama-3.3-70b-instruct:free",      // Llama 3.3 70B - most capable
  "nousresearch/hermes-3-llama-3.1-405b:free",   // Hermes 3 405B - very capable
  "openai/gpt-oss-120b:free",                    // GPT OSS 120B
  "nvidia/nemotron-3-super-120b-a12b:free",      // Nvidia 120B
  "qwen/qwen3-next-80b-a3b-instruct:free",       // Qwen 80B
  "meta-llama/llama-3.2-3b-instruct:free",       // Llama 3.2 3B - fastest fallback
];

/**
 * Flexible AI Completion wrapper for OpenRouter with Fallback Support
 */
export const getAICompletion = async (prompt, systemPrompt = "", modelIndex = 0) => {
  const model = FREE_MODELS[modelIndex];
  
  try {
    const openai = getOpenAIClient();
    const response = await openai.chat.completions.create({
      model: model,
      messages: [
        { role: "system", content: systemPrompt || "You are a professional assistant." },
        { role: "user", content: prompt }
      ]
    });

    const content = response.choices[0].message.content;
    
    try {
      return JSON.parse(content);
    } catch (e) {
      const cleanJson = content.replace(/```json|```/g, "").trim();
      const jsonStart = cleanJson.indexOf("{");
      const jsonEnd = cleanJson.lastIndexOf("}");
      
      if (jsonStart !== -1 && jsonEnd !== -1) {
        try {
          return JSON.parse(cleanJson.substring(jsonStart, jsonEnd + 1));
        } catch (parseErr) {
          console.error(`[AI Error] Model ${model} returned invalid JSON:`, content);
          throw new Error("Invalid JSON format from model");
        }
      }
      
      console.error(`[AI Error] Model ${model} returned non-JSON text:`, content);
      throw new Error("No JSON object found in response");
    }
  } catch (error) {
    // If it's an API error, it might be in error.response
    const apiErrorMessage = error.response?.data?.error?.message || error.message;
    console.warn(`[AI Warning] Model ${model} failed. Reason: ${apiErrorMessage}`);
    
    if (modelIndex < FREE_MODELS.length - 1) {
      console.warn(`[AI Info] Trying fallback model: ${FREE_MODELS[modelIndex + 1]}`);
      return getAICompletion(prompt, systemPrompt, modelIndex + 1);
    }

    console.error(`[AI Fatal] All models failed. Last error:`, apiErrorMessage);
    throw new Error(`AI Analysis failed after trying ${modelIndex + 1} models. Please try again in a minute.`);
  }
};

