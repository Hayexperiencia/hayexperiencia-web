"use client";

import { useEffect } from "react";
import { trackPropertyView } from "./events";

const STORAGE_KEY = "hei_session_id";
const VIEWED_KEY_PREFIX = "hei_view_";
const DEDUP_MINUTES = 30;

function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "";
  let sid = localStorage.getItem(STORAGE_KEY);
  if (!sid) {
    sid = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem(STORAGE_KEY, sid);
  }
  return sid;
}

function detectSource(): string {
  if (typeof document === "undefined") return "direct";
  const ref = document.referrer;
  if (!ref) return "direct";
  try {
    const host = new URL(ref).hostname;
    if (host.includes("google")) return "google";
    if (host.includes("facebook") || host.includes("instagram") || host.includes("fbcdn")) return "meta";
    if (host.includes("whatsapp")) return "whatsapp";
    if (host.includes("hayexperiencia")) return "internal";
    return host;
  } catch {
    return "unknown";
  }
}

export default function PropertyViewTracker({ wasiId }: { wasiId: string | number }) {
  useEffect(() => {
    if (!wasiId) return;
    const dedupKey = `${VIEWED_KEY_PREFIX}${wasiId}`;
    const lastViewed = sessionStorage.getItem(dedupKey);
    const now = Date.now();
    if (lastViewed && now - Number(lastViewed) < DEDUP_MINUTES * 60 * 1000) return;

    const timer = setTimeout(() => {
      const sessionId = getOrCreateSessionId();
      const source = detectSource();
      const pagePath = typeof window !== "undefined" ? window.location.pathname : "";
      fetch("/api/analytics/view", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wasiId: String(wasiId), sessionId, source, pagePath }),
        keepalive: true,
      }).catch(() => {});
      trackPropertyView(wasiId, { source });
      sessionStorage.setItem(dedupKey, String(now));
    }, 1500);

    return () => clearTimeout(timer);
  }, [wasiId]);

  return null;
}
