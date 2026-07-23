import type { Handler } from "@netlify/functions";
import { GoogleGenAI } from "@google/genai";

function getGenAIClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  let body: any = {};
  try {
    body = JSON.parse(event.body || "{}");
  } catch {
    // ignore, handled by fallback below
  }
  const { prompt, style } = body;

  try {
    const ai = getGenAIClient();

    if (!ai) {
      const words = (prompt || "icon").toLowerCase().split(/\s+/);
      const tags = Array.from(
        new Set([
          ...words,
          "icon", "vector", "symbol", "graphic", "design", "sign", "illustration", "element",
          "microstock", "flat", "button", "app", "interface", "web", "isolated", "set", "creative",
          "modern", "digital", "ui", "ux", "collection", "marketing", "business", "media",
        ])
      );
      return {
        statusCode: 200,
        body: JSON.stringify({
          title: `${prompt} Vector Icon Set - Microstock Style`,
          category: "Graphic Resources / Icons",
          tags: tags.slice(0, 25),
        }),
      };
    }

    const sysPrompt = `You are a professional microstock keywording and SEO expert for Adobe Stock, Shutterstock, and Freepik. 
Generate metadata for a vector icon described as: "${prompt}" in style "${style}".
Return a JSON object with:
- "title": A descriptive 6-10 word title suitable for stock agency submission (in English).
- "category": Microstock category (e.g., Business, Technology, Shopping, Healthcare, Social Media).
- "tags": An array of 25 to 35 highly relevant SEO keywords/tags for stock search indexing.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: sysPrompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return {
      statusCode: 200,
      body: JSON.stringify({
        title: parsed.title || `${prompt} Vector Icon`,
        category: parsed.category || "Icons & Vectors",
        tags: Array.isArray(parsed.tags) ? parsed.tags : ["icon", "vector", "symbol"],
      }),
    };
  } catch (err: any) {
    return {
      statusCode: 200,
      body: JSON.stringify({
        title: `${prompt || "Vector"} Icon Asset`,
        category: "Vectors",
        tags: ["icon", "vector", "symbol", "design", "graphic", "stock"],
      }),
    };
  }
};
