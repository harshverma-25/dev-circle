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
      defaultHeaders: {
        "HTTP-Referer": process.env.SITE_URL || "http://localhost:3000",
        "X-Title": "DevCircle AI",
      }
    });
  }
  return openaiClient;
};

const FREE_MODELS = [
  "meta-llama/llama-3.3-70b-instruct:free",
  "deepseek/deepseek-chat:free",
  "meta-llama/llama-3.1-8b-instruct:free",
  "google/gemma-2-9b-it:free",
  "mistralai/mistral-7b-instruct:free"
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
      ],
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content;
    
    try {
      return JSON.parse(content);
    } catch (e) {
      const cleanJson = content.replace(/```json|```/g, "").trim();
      return JSON.parse(cleanJson);
    }
  } catch (error) {
    const isRateLimit = error.status === 429 || error.message?.includes("429") || error.response?.status === 429;
    
    if (isRateLimit && modelIndex < FREE_MODELS.length - 1) {
      console.warn(`Model ${model} rate limited or failed. Trying fallback: ${FREE_MODELS[modelIndex + 1]}`);
      return getAICompletion(prompt, systemPrompt, modelIndex + 1);
    }

    console.error(`OpenRouter Error (${model}):`, error.response?.data || error.message);
    throw new Error(`AI Analysis failed after trying ${modelIndex + 1} models. Please try again in a minute.`);
  }
};

