import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

const WEBHOOK_SECRET = process.env.STRAPI_WEBHOOK_SECRET ?? "";

const TAG_MAP: Record<string, (entry: Record<string, unknown>) => string[]> = {
  "api::project.project": (entry) => {
    const slug = typeof entry.slug === "string" ? entry.slug : "";
    return ["project", ...(slug ? [`project:${slug}`] : []), "homepage"];
  },
  "api::homepage.homepage": () => ["homepage"],
  "api::navigation.navigation": () => ["navigation"],
  "api::site-setting.site-setting": () => ["site-settings"],
  "api::team-member.team-member": () => ["team-members"],
  "api::page.page": (entry) => {
    const slug = typeof entry.slug === "string" ? entry.slug : "";
    return ["page", ...(slug ? [`page:${slug}`] : [])];
  },
  "api::zone.zone": () => ["zones"],
  "api::article.article": (entry) => {
    const slug = typeof entry.slug === "string" ? entry.slug : "";
    return ["article", ...(slug ? [`article:${slug}`] : [])];
  },
  "api::guide.guide": (entry) => {
    const slug = typeof entry.slug === "string" ? entry.slug : "";
    return ["guide", ...(slug ? [`guide:${slug}`] : [])];
  },
  "api::market-report.market-report": () => ["market-reports"],
  "api::faq.faq": () => ["faqs"],
  "api::testimonial.testimonial": () => ["testimonials"],
  "api::press-mention.press-mention": () => ["press-mentions"],
  "api::property.property": () => ["properties"],
};

export async function POST(request: NextRequest) {
  const url = new URL(request.url);
  const secret = url.searchParams.get("secret") ?? request.headers.get("x-strapi-secret") ?? "";

  if (!WEBHOOK_SECRET || secret !== WEBHOOK_SECRET) {
    console.warn("[strapi-webhook] invalid secret");
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
  }

  let payload: Record<string, unknown>;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const event = typeof payload.event === "string" ? payload.event : "unknown";
  const model = typeof payload.model === "string" ? payload.model : "";
  const uid = typeof payload.uid === "string" ? payload.uid : `api::${model}.${model}`;
  const entry = (typeof payload.entry === "object" && payload.entry !== null)
    ? (payload.entry as Record<string, unknown>)
    : {};

  const handler = TAG_MAP[uid];
  const tags = handler ? handler(entry) : [];

  for (const tag of tags) {
    revalidateTag(tag, "max");
  }

  console.log("[strapi-webhook]", JSON.stringify({
    ts: new Date().toISOString(),
    event,
    uid,
    entryId: entry.id,
    slug: entry.slug,
    tags,
  }));

  return NextResponse.json({ status: "received", event, uid, tags });
}
