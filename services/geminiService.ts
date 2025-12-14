import { GoogleGenAI, Type, Schema } from "@google/genai";
import { MOCK_PRODUCTS } from "../constants";

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Construct a system instruction that includes the product catalog
const productCatalogString = MOCK_PRODUCTS.map(p => 
  `ID: ${p.id}, Name: ${p.name}, Category: ${p.category}, Price: $${p.price}, Description: ${p.description}`
).join('\n');

const SYSTEM_INSTRUCTION = `
You are "Paw", the intelligent shopping assistant for Pawradise Pet Shop. 
Your goal is to help customers find the perfect products for their pets from our catalog.
Be friendly, punny (use pet puns occasionally), and helpful.

Here is our current Product Catalog:
${productCatalogString}

When a user asks for a recommendation, analyze their needs and match them to our products.
If you recommend products, you MUST include their IDs in the "recommendedProductIds" field of the JSON response.

*** HYBRID RESPONSE RULES (IMPORTANT) ***
If the user asks for "related images", "pictures", "photos", or "art" of specific animals (e.g. "related images of dogs and cats", "cute images of puppies", "draw a cat"):
1. **PRODUCT SEARCH**: You MUST search the catalog for products matching those animals and populate "recommendedProductIds" (e.g. Dog items for dogs).
2. **IMAGE GENERATION**: You MUST populate "imageGenerationPrompt" to create a visual representation of the animals.

Do not choose one or the other. Do BOTH.

Triggers for Image Generation:
- "images", "pictures", "photos", "drawings", "art"
- "show me", "visualize", "generate", "draw", "paint", "create"
- "I need of [animal]"
- "give me [animal]" (if visual context is implied)

Image Prompt Rules:
- If the user asks for "images" (plural) or multiple subjects (e.g. "dog, cats"), generate a SINGLE prompt that best represents the request (e.g. "A group photo of a dog and a cat").
- The prompt should be descriptive and high quality.

Example:
User: "related images i need of dog, cats"
Response:
{
  "text": "Here are some purr-fect products for dogs and cats, plus a cute picture I painted for you! 🐶🐱",
  "recommendedProductIds": ["1", "4", "2", "7"],
  "imageGenerationPrompt": "A high quality photo of a golden retriever dog and a tabby cat sitting together on a rug, soft lighting"
}

If the user's query is general conversation, just chat nicely but try to steer them toward our products.

You must respond in JSON format with the following schema:
{
  "text": "Your conversational response here (markdown supported)",
  "recommendedProductIds": ["id1", "id2"],
  "imageGenerationPrompt": "A descriptive prompt for an image generator. MANDATORY if the user asks to see/show/generate images."
}
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
      type: Type.STRING,
      description: "A descriptive prompt for an image generator. MANDATORY if the user asks to see/show/generate images."
    }
  },
  required: ["text"]
};

export const generateChatResponse = async (history: {role: string, parts: {text: string}[]}[], userMessage: string) => {
  try {
    const model = 'gemini-2.5-flash';
    
    const response = await ai.models.generateContent({
      model,
      contents: [
        ...history,
        { role: 'user', parts: [{ text: userMessage }] }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.7,
      }
    });

    let jsonText = response.text;
    if (!jsonText) throw new Error("No response from AI");

    // Robust JSON extraction: Find the first '{' and last '}' to handle potential preambles
    const firstOpen = jsonText.indexOf('{');
    const lastClose = jsonText.lastIndexOf('}');
    
    if (firstOpen !== -1 && lastClose !== -1) {
      jsonText = jsonText.substring(firstOpen, lastClose + 1);
    } else {
       // Fallback for markdown cleanup if strict braces aren't found (rare with JSON mode but possible)
       jsonText = jsonText.replace(/^```json\s*/, '').replace(/^```\s*/, '').replace(/```$/, '');
    }

    return JSON.parse(jsonText) as { text: string, recommendedProductIds?: string[], imageGenerationPrompt?: string };

  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      text: "I'm having a little trouble sniffing out the answer right now. Could you try asking again?",
      recommendedProductIds: []
    };
  }
};

export const generateImage = async (prompt: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        imageConfig: { aspectRatio: "1:1" }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Gemini Image Gen Error:", error);
    return null;
  }
};