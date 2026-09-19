import {
  CATEGORIES,
  CATEGORY_TO_DEPARTMENT,
  DEPARTMENTS,
  DUPLICATE_DISTANCE_METERS,
  DUPLICATE_SIMILARITY_THRESHOLD,
  SLA_HOURS,
} from "./constants";
import type { AiAnalysis, Category, DuplicateMatch, UrgencyLevel } from "./types";

const STOP = new Set([
  "the", "a", "an", "and", "or", "of", "to", "in", "on", "at", "for", "is", "are",
  "near", "please", "this", "that", "with", "from", "it", "was", "be",
]);

const CATEGORY_KEYWORDS: Record<Category, string[]> = {
  Accident: ["accident", "crash", "collision", "hit and run", "overturned", "injured", "ambulance"],
  Pothole: ["pothole", "pot hole", "crater", "road hole", "broken asphalt"],
  "Damaged Road": ["damaged road", "broken road", "cracked road", "caved", "uneven road", "collapsed road"],
  Garbage: ["garbage", "trash", "waste", "dump", "overflowing", "litter", "bin", "rubbish"],
  "Water Leakage": ["leak", "leaking", "water pipe", "burst pipe", "seepage", "pipeline"],
  "Broken Streetlight": ["streetlight", "street light", "lamp post", "dark street", "light not working", "pole light"],
  Drainage: ["drain", "drainage", "waterlog", "water logging", "flooded", "sewer", "stagnant"],
  "Traffic Obstruction": ["obstruction", "blocked road", "illegal parking", "encroachment", "jam", "barricade"],
  Other: [],
};

const SAFETY = ["accident", "fire", "electroc", "child", "school", "hospital", "injured", "danger", "night", "dark"];
const SEVERITY = ["large", "huge", "overflow", "completely", "severe", "urgent", "immediate", "deep", "wide"];

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1 && !STOP.has(t));
}

export function jaccard(a: string[], b: string[]): number {
  const sa = new Set(a);
  const sb = new Set(b);
  let inter = 0;
  for (const x of sa) if (sb.has(x)) inter += 1;
  const union = sa.size + sb.size - inter;
  return union === 0 ? 0 : inter / union;
}

export function haversineMeters(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(s)));
}

export function classifyFromText(title: string, description: string): { category: Category; confidence: number; hits: string[] } {
  const blob = `${title} ${description}`.toLowerCase();
  let best: Category = "Other";
  let bestScore = 0;
  const hits: string[] = [];
  for (const cat of CATEGORIES) {
    if (cat === "Other") continue;
    let score = 0;
    for (const kw of CATEGORY_KEYWORDS[cat]) {
      if (blob.includes(kw)) {
        score += kw.split(" ").length;
        hits.push(kw);
      }
    }
    if (score > bestScore) {
      bestScore = score;
      best = cat;
    }
  }
  const confidence = best === "Other" ? 0.42 : Math.min(0.94, 0.62 + bestScore * 0.1);
  return { category: best, confidence, hits };
}

export function scoreUrgency(opts: {
  category: Category;
  title: string;
  description: string;
  similarCount: number;
}): { score: number; level: UrgencyLevel } {
  const blob = `${opts.title} ${opts.description}`.toLowerCase();
  let score =
    opts.category === "Accident" ? 0.78
    : opts.category === "Water Leakage" ? 0.58
    : opts.category === "Broken Streetlight" ? 0.52
    : opts.category === "Drainage" ? 0.55
    : opts.category === "Pothole" ? 0.5
    : opts.category === "Damaged Road" ? 0.54
    : opts.category === "Traffic Obstruction" ? 0.56
    : opts.category === "Garbage" ? 0.44
    : 0.38;

  if (SAFETY.some((k) => blob.includes(k))) score += 0.16;
  if (SEVERITY.some((k) => blob.includes(k))) score += 0.1;
  score += Math.min(0.12, opts.similarCount * 0.03);
  score = Math.max(0.08, Math.min(0.98, score));
  const level: UrgencyLevel = score >= 0.7 ? "HIGH" : score >= 0.4 ? "MEDIUM" : "LOW";
  return { score: Math.round(score * 100) / 100, level };
}

export function departmentFor(category: Category) {
  const id = CATEGORY_TO_DEPARTMENT[category];
  const dept = DEPARTMENTS.find((d) => d.id === id)!;
  return { id: dept.id, name: dept.name };
}

export function slaDeadlineFrom(level: UrgencyLevel, from = new Date()): Date {
  return new Date(from.getTime() + SLA_HOURS[level] * 3600 * 1000);
}

export function prototypeAnalysis(
  title: string,
  description: string,
  similarCount: number,
): AiAnalysis {
  const { category, confidence, hits } = classifyFromText(title, description);
  const urg = scoreUrgency({ category, title, description, similarCount });
  const dept = departmentFor(category);
  return {
    issueType: category,
    confidence: Math.round(confidence * 100) / 100,
    urgencyScore: urg.score,
    priority: urg.level,
    departmentId: dept.id,
    departmentName: dept.name,
    similarReports: similarCount,
    source: "prototype",
    rationale: hits.length
      ? `Prototype classifier matched: ${hits.slice(0, 4).join(", ")}`
      : "Prototype classifier used issue text; no strong keyword match — defaulted conservatively.",
  };
}

function extractJsonObject(text: string): Record<string, unknown> | null {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start < 0 || end <= start) return null;
  try {
    return JSON.parse(text.slice(start, end + 1)) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export async function analyzeWithGrok(input: {
  title: string;
  description: string;
  similarCount: number;
}): Promise<AiAnalysis | null> {
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) return null;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 9000);
  try {
    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: "grok-4.5",
        max_tokens: 280,
        temperature: 0.1,
        messages: [
          {
            role: "system",
            content:
              "You classify civic complaints for an Indian municipal prototype. Reply with JSON only.",
          },
          {
            role: "user",
            content: `Classify this civic complaint.
Allowed issueType: ${CATEGORIES.join(", ")}.
Return JSON: {"issueType":"...","confidence":0-1,"urgencyScore":0-1,"rationale":"short"}
Title: ${input.title}
Description: ${input.description}`,
          },
        ],
      }),
    });
    if (!res.ok) return null;
    const body = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    const parsed = extractJsonObject(body.choices?.[0]?.message?.content ?? "");
    if (!parsed) return null;
    const issueType = CATEGORIES.includes(parsed.issueType as Category)
      ? (parsed.issueType as Category)
      : classifyFromText(input.title, input.description).category;
    const urg = scoreUrgency({
      category: issueType,
      title: input.title,
      description: input.description,
      similarCount: input.similarCount,
    });
    const grokUrgency = typeof parsed.urgencyScore === "number" ? parsed.urgencyScore : urg.score;
    const score = Math.max(0, Math.min(1, (grokUrgency + urg.score) / 2));
    const level: UrgencyLevel = score >= 0.7 ? "HIGH" : score >= 0.4 ? "MEDIUM" : "LOW";
    const dept = departmentFor(issueType);
    const confidence = typeof parsed.confidence === "number" ? parsed.confidence : 0.8;
    return {
      issueType,
      confidence: Math.round(Math.max(0.4, Math.min(0.97, confidence)) * 100) / 100,
      urgencyScore: Math.round(score * 100) / 100,
      priority: level,
      departmentId: dept.id,
      departmentName: dept.name,
      similarReports: input.similarCount,
      source: "grok",
      rationale: String(parsed.rationale ?? "Classified by Grok with Shinrai routing rules."),
    };
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export function findDuplicates(opts: {
  title: string;
  description: string;
  lat: number;
  lng: number;
  candidates: { id: string; title: string; description: string; lat: number; lng: number; status: DuplicateMatch["status"]; category: Category }[];
}): DuplicateMatch[] {
  const tokens = tokenize(`${opts.title} ${opts.description}`);
  const out: DuplicateMatch[] = [];
  for (const c of opts.candidates) {
    const dist = haversineMeters(opts.lat, opts.lng, c.lat, c.lng);
    if (dist > DUPLICATE_DISTANCE_METERS) continue;
    const sim = jaccard(tokens, tokenize(`${c.title} ${c.description}`));
    if (sim < DUPLICATE_SIMILARITY_THRESHOLD) continue;
    out.push({
      id: c.id,
      title: c.title,
      similarity: Math.round(sim * 100),
      distanceMeters: Math.round(dist),
      status: c.status,
      category: c.category,
    });
  }
  return out.sort((a, b) => b.similarity - a.similarity).slice(0, 4);
}

export async function detectAccidentFromFrame(frameDataUrl: string | null, hint: string): Promise<{
  detected: boolean;
  confidence: number;
  label: string;
  notes: string;
  source: "grok" | "prototype";
}> {
  const apiKey = process.env.XAI_API_KEY;
  if (apiKey && frameDataUrl) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 10000);
      const res = await fetch("https://api.x.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        signal: controller.signal,
        body: JSON.stringify({
          model: "grok-4.5",
          max_tokens: 180,
          temperature: 0,
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: 'This is a prototype CCTV still. Does it show a road accident or serious obstruction? JSON only: {"detected":boolean,"confidence":0-1,"label":"ACCIDENT DETECTED"|"NO INCIDENT","notes":"short"}',
                },
                { type: "image_url", image_url: { url: frameDataUrl } },
              ],
            },
          ],
        }),
      });
      clearTimeout(timer);
      if (res.ok) {
        const body = (await res.json()) as { choices?: { message?: { content?: string } }[] };
        const parsed = extractJsonObject(body.choices?.[0]?.message?.content ?? "");
        if (parsed && typeof parsed.detected === "boolean") {
          return {
            detected: parsed.detected,
            confidence: Math.round((Number(parsed.confidence) || 0.5) * 100) / 100,
            label: String(parsed.label ?? (parsed.detected ? "ACCIDENT DETECTED" : "NO INCIDENT")),
            notes: String(parsed.notes ?? ""),
            source: "grok",
          };
        }
      }
    } catch {
      /* fall through */
    }
  }

  const blob = hint.toLowerCase();
  const accidentHint = /accident|crash|collision|wreck|pileup/.test(blob);
  const hash = [...hint].reduce((a, c) => a + c.charCodeAt(0), 0);
  const detected = accidentHint || hash % 5 === 0;
  return {
    detected,
    confidence: accidentHint ? 0.84 : detected ? 0.61 : 0.33,
    label: detected ? "ACCIDENT DETECTED" : "NO INCIDENT",
    notes: accidentHint
      ? "Prototype detector used filename/description keywords. Not production YOLOv8."
      : "Prototype detector — no trained accident model is loaded. Result is heuristic for demonstration.",
    source: "prototype",
  };
}
