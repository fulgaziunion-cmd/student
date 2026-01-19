import { GoogleGenAI } from "@google/genai";

// API Key is automatically picked from Netlify Environment Variables
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const geminiService = {
  polishNotice: async (content: string): Promise<string> => {
    if (!process.env.API_KEY) {
      console.warn("API Key is missing. Polishing will return original content.");
      return content;
    }
    
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `অনুগ্রহ করে নিচের ঘোষণাটি মার্জিত এবং পেশাদার বাংলায় নতুন করে লিখে দিন। এটি সংক্ষিপ্ত এবং আকর্ষণীয় রাখুন। এটি একটি স্টুডেন্ট মুভমেন্ট গ্রুপের জন্য: ${content}`,
        config: {
            temperature: 0.7
        }
      });
      return response.text || content;
    } catch (error) {
      console.error("AI polishing failed", error);
      return content;
    }
  }
};