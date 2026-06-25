import type { MetadataRoute } from "next";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://hayexperiencia.com";

// Bots de IA generativa permitidos EXPLICITAMENTE para que Hay Experiencia pueda ser
// citada como fuente en ChatGPT, Claude, Perplexity, Gemini y los AI Overviews de Google
// (frente de posicionamiento en LLMs). Bloquearlos por defecto = invisibilidad en IA;
// ~17% de sitios los bloquean por error. Ver investigaciones/2026-06-25-anatomia-landing-venta-propiedad.
const AI_BOTS = [
  "GPTBot", "OAI-SearchBot", "ChatGPT-User", // OpenAI
  "ClaudeBot", "anthropic-ai", "Claude-Web", // Anthropic
  "PerplexityBot", "Perplexity-User", // Perplexity
  "Google-Extended", // Gemini (training + grounding)
  "Applebot-Extended", // Apple Intelligence
  "Amazonbot", "cohere-ai", // otros
];

// No exponer a crawlers areas privadas / de fondo de embudo.
const DISALLOW = ["/admin", "/api/", "/cotizacion/", "/oauth2callback", "/bot"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: DISALLOW },
      ...AI_BOTS.map((userAgent) => ({ userAgent, allow: "/", disallow: DISALLOW })),
    ],
    sitemap: `${SITE}/sitemap.xml`,
    host: SITE,
  };
}
