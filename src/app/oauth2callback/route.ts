import { NextRequest, NextResponse } from "next/server";

const MCP_OAUTH_URL =
  process.env.GOOGLE_WORKSPACE_MCP_URL ||
  "http://mcp-google-workspace:8000/oauth2callback";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const target = `${MCP_OAUTH_URL}${url.search}`;
  const res = await fetch(target, { redirect: "manual" });
  const body = await res.text();
  const headers = new Headers();
  const ct = res.headers.get("content-type");
  if (ct) headers.set("content-type", ct);
  return new NextResponse(body, { status: res.status, headers });
}
