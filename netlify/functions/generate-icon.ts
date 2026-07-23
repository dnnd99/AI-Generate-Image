import type { Handler } from "@netlify/functions";
import { GoogleGenAI } from "@google/genai";

// Reads GEMINI_API_KEYS="key1,key2,key3" (comma separated).
// Falls back to single GEMINI_API_KEY if that's all you have set.
function getGeminiKeys(): string[] {
  const multi = process.env.GEMINI_API_KEYS;
  if (multi) {
    return multi.split(",").map((k) => k.trim()).filter(Boolean);
  }
  const single = process.env.GEMINI_API_KEY;
  return single ? [single] : [];
}

function makeClient(apiKey: string) {
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

function isQuotaOrKeyError(err: any): boolean {
  const msg = (err?.message || "").toLowerCase();
  const status = err?.status || err?.code;
  return (
    status === 429 ||
    status === 403 ||
    msg.includes("quota") ||
    msg.includes("rate limit") ||
    msg.includes("resource_exhausted") ||
    msg.includes("permission") ||
    msg.includes("invalid api key") ||
    msg.includes("api key not valid")
  );
}

// Fallback Canvas Icon Generator when no key works
function generateFallbackIconCanvas(
  prompt: string,
  style: string,
  layout: string,
  resolution: string
): string {
  const size = resolution === "4K" ? 2048 : resolution === "2K" ? 1024 : 512;
  const isGrid = layout === "grid";

  const styleColors: Record<
    string,
    { bg: string; stroke: string; fill: string; fill2: string; accent: string }
  > = {
    outline: { bg: "#ffffff", stroke: "#111827", fill: "none", fill2: "none", accent: "#10b981" },
    glyph: { bg: "#ffffff", stroke: "#0f172a", fill: "#0f172a", fill2: "#1e293b", accent: "#10b981" },
    flat: { bg: "#ffffff", stroke: "#0f172a", fill: "#10b981", fill2: "#3b82f6", accent: "#f59e0b" },
    duotone: {
      bg: "#ffffff",
      stroke: "#059669",
      fill: "rgba(16, 185, 129, 0.2)",
      fill2: "#047857",
      accent: "#10b981",
    },
    glossy_jelly: {
      bg: "#ffffff",
      stroke: "none",
      fill: "url(#jellyGrad)",
      fill2: "url(#jellyGrad2)",
      accent: "#34d399",
    },
  };

  const palette = styleColors[style] || styleColors.flat;
  let pathShape = "";
  const lower = prompt.toLowerCase();

  if (lower.includes("cart") || lower.includes("shopping") || lower.includes("belanja") || lower.includes("keranjang")) {
    pathShape = `<path d="M20 30h15l10 30h40l8-20H35" stroke="${palette.stroke}" stroke-width="6" fill="${palette.fill}" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="48" cy="72" r="7" fill="${palette.accent}"/>
    <circle cx="72" cy="72" r="7" fill="${palette.accent}"/>`;
  } else if (lower.includes("wallet") || lower.includes("dompet") || lower.includes("pay") || lower.includes("money") || lower.includes("uang")) {
    pathShape = `<rect x="20" y="30" width="60" height="42" rx="8" stroke="${palette.stroke}" stroke-width="6" fill="${palette.fill}"/>
    <rect x="52" y="44" width="28" height="14" rx="4" fill="${palette.accent}" stroke="${palette.stroke}" stroke-width="4"/>
    <circle cx="62" cy="51" r="3" fill="#ffffff"/>`;
  } else if (lower.includes("lock") || lower.includes("gembok") || lower.includes("security") || lower.includes("keamanan")) {
    pathShape = `<rect x="25" y="42" width="50" height="38" rx="8" stroke="${palette.stroke}" stroke-width="6" fill="${palette.fill}"/>
    <path d="M35 42V28a15 15 0 0130 0v14" stroke="${palette.stroke}" stroke-width="6" fill="none" stroke-linecap="round"/>
    <circle cx="50" cy="58" r="5" fill="${palette.accent}"/>`;
  } else if (lower.includes("rocket") || lower.includes("roket") || lower.includes("launch") || lower.includes("startup")) {
    pathShape = `<path d="M50 18c15 0 25 20 25 40h-50c0-20 10-40 25-40z" fill="${palette.fill}" stroke="${palette.stroke}" stroke-width="6"/>
    <circle cx="50" cy="38" r="8" fill="${palette.accent}" stroke="${palette.stroke}" stroke-width="4"/>
    <path d="M25 58l-10 15h15M75 58l10 15H75" stroke="${palette.stroke}" stroke-width="6" stroke-linecap="round"/>`;
  } else if (lower.includes("heart") || lower.includes("suka") || lower.includes("love") || lower.includes("kesehatan")) {
    pathShape = `<path d="M50 78S20 58 20 38a16 16 0 0130-10 16 16 0 0130 10c0 20-30 40-30 40z" fill="${palette.fill}" stroke="${palette.stroke}" stroke-width="6"/>`;
  } else if (lower.includes("star") || lower.includes("bintang") || lower.includes("rating")) {
    pathShape = `<polygon points="50,15 61,38 86,38 66,54 73,78 50,62 27,78 34,54 14,38 39,38" fill="${palette.fill}" stroke="${palette.stroke}" stroke-width="6" stroke-linejoin="round"/>`;
  } else if (lower.includes("setting") || lower.includes("gear") || lower.includes("pengaturan")) {
    pathShape = `<circle cx="50" cy="50" r="20" stroke="${palette.stroke}" stroke-width="6" fill="${palette.fill}"/>
    <circle cx="50" cy="50" r="8" fill="${palette.accent}"/>
    <path d="M50 18v8M50 74v8M18 50h8M74 50h8M27 27l6 6M67 67l6 6M27 73l6-6M67 33l6-6" stroke="${palette.stroke}" stroke-width="6" stroke-linecap="round"/>`;
  } else {
    pathShape = `<circle cx="50" cy="50" r="32" fill="${palette.fill}" stroke="${palette.stroke}" stroke-width="6"/>
    <path d="M35 50l10 10 20-20" stroke="${palette.accent}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`;
  }

  const renderSingle = (cx: number, cy: number, scale: number) => `
    <g transform="translate(${cx - 50 * scale}, ${cy - 50 * scale}) scale(${scale})">
      ${pathShape}
    </g>
  `;

  let content = "";
  if (isGrid) {
    const offsets: [number, number][] = [
      [150, 150], [300, 150], [450, 150],
      [150, 300], [300, 300], [450, 300],
      [150, 450], [300, 450], [450, 450],
    ];
    content = offsets.map(([x, y]) => renderSingle(x, y, 1)).join("");
  } else {
    content = renderSingle(300, 300, 3.2);
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="${size}" height="${size}">
    <defs>
      <linearGradient id="jellyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#34d399" />
        <stop offset="100%" stop-color="#059669" />
      </linearGradient>
      <linearGradient id="jellyGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#60a5fa" />
        <stop offset="100%" stop-color="#2563eb" />
      </linearGradient>
      <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="8" stdDeviation="6" flood-color="#000000" flood-opacity="0.12"/>
      </filter>
    </defs>
    <rect width="600" height="600" fill="${palette.bg}"/>
    <g filter="url(#shadow)">
      ${content}
    </g>
  </svg>`;

  const base64 = Buffer.from(svg).toString("base64");
  return `data:image/svg+xml;base64,${base64}`;
}

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  try {
    const { prompt, style, layout, resolution } = JSON.parse(event.body || "{}");

    if (!prompt || typeof prompt !== "string") {
      return { statusCode: 400, body: JSON.stringify({ error: "Prompt is required" }) };
    }

    const keys = getGeminiKeys();
    // Shuffle so repeated requests spread load across keys instead of
    // always hammering the first one in the list.
    const orderedKeys = [...keys].sort(() => Math.random() - 0.5);

    const stylePrompts: Record<string, string> = {
      outline: "minimalist vector icon, crisp thin black stroke outline, linear art style, clean uniform line width, white background, stock vector quality",
      glyph: "solid monochrome glyph vector icon, filled silhouette, bold simple geometry, clean high contrast graphic, isolated on pure white background, microstock vector",
      flat: "modern flat 2D vector icon, vibrant color palette, clean geometry, subtle layered depth, smooth clean vector edges, isolated on plain white background",
      duotone: "stylish duotone vector icon, 2-color vibrant neon green and dark navy blue palette, clean modern graphic design, white background",
      glossy_jelly: "3D glossy jelly cartoon vector icon, shiny plastic bubble style, soft smooth gradients, rounded highlights, vibrant playful colors, isolated on crisp white background",
    };

    const layoutPrompt =
      layout === "grid"
        ? "set of 9 matching vector icons arranged in a clean 3x3 grid layout, cohesive icon pack set"
        : "single centered vector icon, perfectly balanced composition";

    const styleDesc = stylePrompts[style] || stylePrompts.flat;
    const fullPrompt = `${prompt}, ${styleDesc}, ${layoutPrompt}, professional microstock vector quality, isolated on clean white background, high resolution, top rating graphics asset.`;

    let lastError: any = null;

    for (const key of orderedKeys) {
      try {
        const ai = makeClient(key);
        const response = await ai.models.generateContent({
          model: "gemini-3.1-flash-image",
          contents: { parts: [{ text: fullPrompt }] },
          config: {
            imageConfig: {
              aspectRatio: "1:1",
              imageSize: resolution === "4K" ? "4K" : resolution === "2K" ? "2K" : "1K",
            },
          },
        });

        const parts = response.candidates?.[0]?.content?.parts || [];
        let imageUrl = "";
        for (const part of parts) {
          if (part.inlineData) {
            imageUrl = `data:${part.inlineData.mimeType || "image/png"};base64,${part.inlineData.data}`;
            break;
          }
        }

        if (imageUrl) {
          return {
            statusCode: 200,
            body: JSON.stringify({ success: true, imageUrl, fullPrompt, mode: "gemini" }),
          };
        }
      } catch (err: any) {
        lastError = err;
        if (isQuotaOrKeyError(err)) {
          // Try the next key in the list
          continue;
        }
        // Non-quota error (e.g. bad request) — no point retrying other keys
        break;
      }
    }

    if (lastError) {
      console.warn("All Gemini keys failed, falling back to vector SVG generator:", lastError?.message || lastError);
    }

    const fallbackUrl = generateFallbackIconCanvas(prompt, style, layout, resolution);
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        imageUrl: fallbackUrl,
        fullPrompt,
        mode: "fallback",
        notice:
          orderedKeys.length === 0
            ? "No GEMINI_API_KEYS configured. Operating in local vector engine mode."
            : "All Gemini API keys hit quota/errors. Operating in local vector engine mode.",
      }),
    };
  } catch (error: any) {
    console.error("Error generating icon:", error);
    return { statusCode: 500, body: JSON.stringify({ error: error?.message || "Failed to generate icon" }) };
  }
};
