
import { GoogleGenAI, Type } from "@google/genai";

const getAIClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export interface AuditResult {
  complianceScore: number;
  observations: string[];
  recommendations: string[];
  status: 'Pass' | 'Attention Required' | 'Fail';
}

const AUDIT_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    complianceScore: {
      type: Type.NUMBER,
      description: 'A score from 0 to 100 based on wiring standards.',
    },
    observations: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'Specific things noticed in the image.',
    },
    recommendations: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'Steps to improve the wiring.',
    },
    status: {
      type: Type.STRING,
      description: 'Overall status: Pass, Attention Required, or Fail.',
    },
  },
  required: ['complianceScore', 'observations', 'recommendations', 'status'],
};

/**
 * Converts a URL or a full base64 data string to just the base64 data part.
 * The Gemini API requires the raw base64 data, not a URL or data URI prefix.
 */
async function processImageInput(input: string): Promise<string> {
  // If it's already a data URL (base64)
  if (input.startsWith('data:')) {
    const split = input.split(',');
    return split.length > 1 ? split[1] : split[0];
  }
  
  // If it's a regular URL, we must fetch it and convert to base64
  if (input.startsWith('http')) {
    try {
      const response = await fetch(input);
      if (!response.ok) throw new Error(`Fetch failed: ${response.statusText}`);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          // Extract just the base64 part
          const base64Data = result.split(',')[1];
          if (!base64Data) {
            reject(new Error("Failed to extract base64 data from reader"));
            return;
          }
          resolve(base64Data);
        };
        reader.onerror = () => reject(new Error("Failed to read image as base64"));
        reader.readAsDataURL(blob);
      });
    } catch (e) {
      console.error("Failed to fetch image URL for audit", e);
      throw new Error("Could not access image URL for analysis. Please ensure the image is accessible via CORS or upload a local file.");
    }
  }

  // Fallback for raw base64 strings
  return input;
}

export const auditWiringImage = async (imageInput: string, section: string, standards: string): Promise<AuditResult> => {
  const ai = getAIClient();
  
  // Crucial: Gemini inlineData.data must be base64 data, not a URL.
  const base64Data = await processImageInput(imageInput);

  const prompt = `
    You are an expert electrical engineer auditing a panel wiring image for Schneider Electric standards.
    Section of Panel: ${section}
    Reference Standards: ${standards}
    
    Analyze the provided image for:
    1. Routing consistency (perpendicular paths, neatness)
    2. Bundling and tie spacing (even distribution)
    3. Label placement and orientation (legibility)
    4. Bend radius compliance (no sharp kinks)
    5. Clearance and separation (between power and signal)
    
    Provide a professional audit report in JSON format.
  `;

  // Fix contents structure to match @google/genai SDK instructions
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        { text: prompt },
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: base64Data,
          },
        },
      ],
    },
    config: {
      responseMimeType: 'application/json',
      responseSchema: AUDIT_SCHEMA,
    },
  });

  const text = response.text;
  if (!text) {
    throw new Error("The AI model returned an empty response.");
  }

  try {
    return JSON.parse(text) as AuditResult;
  } catch (e) {
    console.error("Failed to parse AI response as JSON:", text);
    throw new Error("The AI model returned an invalid format. Please try again.");
  }
};
