import { GoogleGenAI } from "@google/genai";

export const chatWithAI = async (req, res) => {
  const { problem, currentCode, userMessage, history } = req.body;

  try {
    const ai = new GoogleGenAI({
      apiKey: process.env.GOOGLE_KEY
    });

    const systemInstruction = `
You are a world-class coding mentor.
Problem: ${problem?.title}
Description: ${problem?.description}
Current Code:
${currentCode}
Give hints, edge cases, and complexity analysis.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        ...history.map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
        })),
        { role: 'user', parts: [{ text: userMessage }] }
      ],
      config: {
        systemInstruction,
        temperature: 0.7
      }
    });

    res.json({
      reply: response.text || "No response generated"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "AI service error" });
  }
};
