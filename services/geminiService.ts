import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResult } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const PROMPT_INSTRUCTION = `
You are an expert podcast producer with 30 years of experience. Your task is to analyze the provided podcast transcript (in SRT format) and generate two specific outputs: a "Rollercoaster Teaser" and 5 "Viral Reels".

TASK 1: THE ROLLERCOASTER TEASER (30-45s total)
Structure the teaser into exactly these 4 parts:
1. "The Incline" (5-8s): A hook, suspense, or provocative question.
2. "The Drop" (10-15s): The core insight or emotional peak.
3. "The Ride" (10-15s): 2-4 shorter interconnected clips showing momentum.
4. "The End" (5-8s): A cliffhanger.

TASK 2: 5 VIRAL REELS (30-45s each)
Identify 5 potential reels that meet "Excellent Quality" standards:
- Strong Opening (first 3s hook).
- Relatable/Valuable Content.
- Clear start and end.

VISUALS & B-ROLL (Artlist):
For every segment in the Teaser and every Reel, analyze the text to see if it describes a scene, emotion, or specific action.
- If it DOES, provide a "bRoll" suggestion containing keywords suitable for searching on Artlist (e.g., "Slow motion coffee pour", "Cinematic city night lapse", "Stressed person at computer").
- If the content is purely conversational/abstract and doesn't need B-Roll, return an empty string for "bRoll".

INPUT DATA:
The user will provide a transcript in SRT (SubRip Subtitle) format.
Example:
1
00:00:01,000 --> 00:00:04,000
This is the text content.

CRITICAL INSTRUCTIONS:
- You MUST use the exact timestamps provided in the SRT blocks.
- Do NOT estimate timestamps. Extract them directly from the SRT data.
- Ensure the start and end times in your response match the SRT format (e.g., "00:04:15,200").
- If a chosen clip spans multiple SRT blocks, use the start time of the first block and the end time of the last block.
- Calculate the duration based on the timestamps (e.g., "12s" or "34s").
- For "contentQuote", concatenate the text from the relevant SRT blocks, removing newlines or SRT formatting as needed to make it readable.

OUTPUT FORMAT:
Return valid JSON matching the schema provided.
`;

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    teaser: {
      type: Type.ARRAY,
      description: "The 4 distinct phases of the rollercoaster teaser.",
      items: {
        type: Type.OBJECT,
        properties: {
          phase: { type: Type.STRING, description: "Name of the phase (e.g., The Incline)" },
          startTime: { type: Type.STRING, description: "Timestamp start (SRT format)" },
          endTime: { type: Type.STRING, description: "Timestamp end (SRT format)" },
          duration: { type: Type.STRING, description: "Duration (e.g., '7s')" },
          startWord: { type: Type.STRING, description: "First 3-5 words of the clip" },
          endWord: { type: Type.STRING, description: "Last 3-5 words of the clip" },
          contentQuote: { type: Type.STRING, description: "The full text content of this segment" },
          bRoll: { type: Type.STRING, description: "Artlist search query for B-Roll, or empty string if not needed." }
        },
        required: ["phase", "startTime", "endTime", "duration", "startWord", "endWord", "contentQuote"]
      }
    },
    reels: {
      type: Type.ARRAY,
      description: "5 viral reel selections.",
      items: {
        type: Type.OBJECT,
        properties: {
          reelNumber: { type: Type.INTEGER },
          startTime: { type: Type.STRING, description: "Timestamp start (SRT format)" },
          endTime: { type: Type.STRING, description: "Timestamp end (SRT format)" },
          duration: { type: Type.STRING, description: "Duration (e.g., '35s')" },
          startWord: { type: Type.STRING },
          endWord: { type: Type.STRING },
          contentQuote: { type: Type.STRING },
          notes: { type: Type.STRING, description: "Explanation of why this clip was chosen (Opening/Content analysis)." },
          bRoll: { type: Type.STRING, description: "Artlist search query for B-Roll, or empty string if not needed." }
        },
        required: ["reelNumber", "startTime", "endTime", "duration", "startWord", "endWord", "contentQuote", "notes"]
      }
    }
  },
  required: ["teaser", "reels"]
};

export const analyzeTranscript = async (transcript: string, userInstructions?: string): Promise<AnalysisResult> => {
  try {
    const promptContent = `
        ${PROMPT_INSTRUCTION}
        
        ${userInstructions ? `
        --- IMPORTANT USER INSTRUCTIONS ---
        The user has provided specific instructions for this analysis. 
        You MUST prioritize the following request when selecting moments for the Teaser or Reels:
        "${userInstructions}"
        -----------------------------------
        ` : ''}

        --- SRT TRANSCRIPT START ---
        ${transcript}
        --- SRT TRANSCRIPT END ---
      `;

    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview", // Using Pro for complex narrative analysis
      contents: promptContent,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        thinkingConfig: { thinkingBudget: 1024 } // Allow some thinking for narrative structure
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as AnalysisResult;
    }
    throw new Error("No response generated");
  } catch (error) {
    console.error("Analysis failed:", error);
    throw error;
  }
};
