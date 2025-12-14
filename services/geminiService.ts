import { GoogleGenAI, Type, Schema } from "@google/genai";
import { MOCK_PRODUCTS } from "../constants";

// ✅ VITE ENV VARIABLE (CORRECT)
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("VITE_GEMINI_API_KEY is not defined");
}

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey });

// Construct product catalog string
const productCatalogString = MOCK_PRODUCTS.map(
  p =>
    `ID: ${p.id}, Name: ${p.name}, Category: ${p.category}, Price: $${p.price}, Description: ${p.description}`
).join("\n");

const SYSTEM_INSTRUCTION = `
You are "Paw", the intelligent shopping assistant for Pawradise Pet Shop. 
Your goal is to help customers find the perfect products for their pets from our catalog.
Be friendly, punny (use pet puns occasionally), and helpful.

Here is our current Product Catalog:
${productCatalogString}

If you recommend products, include their IDs in "recommendedProductIds".

If images are requested, populate "imageGenerationPrompt".

Always respond in JSON format.
`;

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    text: { type: Type.STRING },
    recommendedProductIds: {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    },
    imageGenerationPrompt: {
      type: Type.STRING
    }
  },
  required: ["text"]
};

export const generateChatResponse = async (
  history: { role: string; parts: { text: string }[] }[],
  userMessage: string
) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        ...history,
        { role: "user", parts: [{ text: userMessage }] }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema,
        temperature: 0.7
      }
    });

    let jsonText = response.text;
    if (!jsonText) throw new Error("No response from Gemini");

    // Clean JSON safely
    const first = jsonText.indexOf("{");
    const last = jsonText.lastIndexOf("}");
    if (first !== -1 && last !== -1) {
      jsonText = jsonText.slice(first, last + 1);
    }

    return JSON.parse(jsonText) as {
      text: string;
      recommendedProductIds?: string[];
      imageGenerationPrompt?: string;
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      text: "🐾 Oops! I'm having trouble right now. Please try again.",
      recommendedProductIds: []
    };
  }
};

export const generateImage = async (prompt: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        imageConfig: { aspectRatio: "1:1" }
      }
    });

    const parts = response.candidates?.[0]?.content?.parts || [];
    for (const part of parts) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }

    return null;
  } catch (error) {
    console.error("Gemini Image Error:", error);
    return null;
  }
};
