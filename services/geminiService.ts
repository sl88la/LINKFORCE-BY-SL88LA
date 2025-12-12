import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateBioWithAI = async (
  currentBio: string,
  keywords: string,
  vibe: string
): Promise<string> => {
  if (!apiKey) {
    throw new Error("API Key is missing. Please configure your environment.");
  }

  const prompt = `
    You are a social media profile expert.
    Task: Write a short, punchy, and engaging bio for a "Link-in-bio" page (like Linktree).
    
    Context:
    - Current Bio (if any): "${currentBio}"
    - Keywords/Topics: "${keywords}"
    - Vibe/Tone: "${vibe}"
    
    Constraints:
    - Keep it under 150 characters.
    - Use emojis if the vibe fits.
    - Be concise.
    - Return ONLY the bio text, no explanations.
    - If the inputs are in Arabic, generate the bio in Arabic. If English, use English.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text?.trim() || "";
  } catch (error) {
    console.error("Error generating bio:", error);
    throw error;
  }
};