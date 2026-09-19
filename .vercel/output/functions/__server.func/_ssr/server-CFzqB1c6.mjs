import { i as TSS_SERVER_FUNCTION, r as createServerFn } from "./ssr.mjs";
import { r as getSql } from "./db-COJ1si8Y.mjs";
import { t as authMiddleware } from "./middleware-DdUB-lT3.mjs";
import { c as SLA_HOURS, i as DEPARTMENTS, o as OPEN_STATUSES, r as CATEGORY_TO_DEPARTMENT, t as CATEGORIES } from "./constants-BTtElcUP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/server-CFzqB1c6.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var STOP = /* @__PURE__ */ new Set([
	"the",
	"a",
	"an",
	"and",
	"or",
	"of",
	"to",
	"in",
	"on",
	"at",
	"for",
	"is",
	"are",
	"near",
	"please",
	"this",
	"that",
	"with",
	"from",
	"it",
	"was",
	"be"
]);
var CATEGORY_KEYWORDS = {
	Accident: [
		"accident",
		"crash",
		"collision",
		"hit and run",
		"overturned",
		"injured",
		"ambulance"
	],
	Pothole: [
		"pothole",
		"pot hole",
		"crater",
		"road hole",
		"broken asphalt"
	],
	"Damaged Road": [
		"damaged road",
		"broken road",
		"cracked road",
		"caved",
		"uneven road",
		"collapsed road"
	],
	Garbage: [
		"garbage",
		"trash",
		"waste",
		"dump",
		"overflowing",
		"litter",
		"bin",
		"rubbish"
	],
	"Water Leakage": [
		"leak",
		"leaking",
		"water pipe",
		"burst pipe",
		"seepage",
		"pipeline"
	],
	"Broken Streetlight": [
		"streetlight",
		"street light",
		"lamp post",
		"dark street",
		"light not working",
		"pole light"
	],
	Drainage: [
		"drain",
		"drainage",
		"waterlog",
		"water logging",
		"flooded",
		"sewer",
		"stagnant"
	],
	"Traffic Obstruction": [
		"obstruction",
		"blocked road",
		"illegal parking",
		"encroachment",
		"jam",
		"barricade"
	],
	Other: []
};
var SAFETY = [
	"accident",
	"fire",
	"electroc",
	"child",
	"school",
	"hospital",
	"injured",
	"danger",
	"night",
	"dark"
];
var SEVERITY = [
	"large",
	"huge",
	"overflow",
	"completely",
	"severe",
	"urgent",
	"immediate",
	"deep",
	"wide"
];
function tokenize(text) {
	return text.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter((t) => t.length > 1 && !STOP.has(t));
}
function jaccard(a, b) {
	const sa = new Set(a);
	const sb = new Set(b);
	let inter = 0;
	for (const x of sa) if (sb.has(x)) inter += 1;
	const union = sa.size + sb.size - inter;
	return union === 0 ? 0 : inter / union;
}
function haversineMeters(lat1, lng1, lat2, lng2) {
	const R = 6371e3;
	const toRad = (d) => d * Math.PI / 180;
	const dLat = toRad(lat2 - lat1);
	const dLng = toRad(lng2 - lng1);
	const s = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
	return 2 * R * Math.asin(Math.min(1, Math.sqrt(s)));
}
function classifyFromText(title, description) {
	const blob = `${title} ${description}`.toLowerCase();
	let best = "Other";
	let bestScore = 0;
	const hits = [];
	for (const cat of CATEGORIES) {
		if (cat === "Other") continue;
		let score = 0;
		for (const kw of CATEGORY_KEYWORDS[cat]) if (blob.includes(kw)) {
			score += kw.split(" ").length;
			hits.push(kw);
		}
		if (score > bestScore) {
			bestScore = score;
			best = cat;
		}
	}
	const confidence = best === "Other" ? .42 : Math.min(.94, .62 + bestScore * .1);
	return {
		category: best,
		confidence,
		hits
	};
}
function scoreUrgency(opts) {
	const blob = `${opts.title} ${opts.description}`.toLowerCase();
	let score = opts.category === "Accident" ? .78 : opts.category === "Water Leakage" ? .58 : opts.category === "Broken Streetlight" ? .52 : opts.category === "Drainage" ? .55 : opts.category === "Pothole" ? .5 : opts.category === "Damaged Road" ? .54 : opts.category === "Traffic Obstruction" ? .56 : opts.category === "Garbage" ? .44 : .38;
	if (SAFETY.some((k) => blob.includes(k))) score += .16;
	if (SEVERITY.some((k) => blob.includes(k))) score += .1;
	score += Math.min(.12, opts.similarCount * .03);
	score = Math.max(.08, Math.min(.98, score));
	const level = score >= .7 ? "HIGH" : score >= .4 ? "MEDIUM" : "LOW";
	return {
		score: Math.round(score * 100) / 100,
		level
	};
}
function departmentFor(category) {
	const id = CATEGORY_TO_DEPARTMENT[category];
	const dept = DEPARTMENTS.find((d) => d.id === id);
	return {
		id: dept.id,
		name: dept.name
	};
}
function slaDeadlineFrom(level, from = /* @__PURE__ */ new Date()) {
	return new Date(from.getTime() + SLA_HOURS[level] * 3600 * 1e3);
}
function prototypeAnalysis(title, description, similarCount) {
	const { category, confidence, hits } = classifyFromText(title, description);
	const urg = scoreUrgency({
		category,
		title,
		description,
		similarCount
	});
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
		rationale: hits.length ? `Prototype classifier matched: ${hits.slice(0, 4).join(", ")}` : "Prototype classifier used issue text; no strong keyword match — defaulted conservatively."
	};
}
function extractJsonObject(text) {
	const start = text.indexOf("{");
	const end = text.lastIndexOf("}");
	if (start < 0 || end <= start) return null;
	try {
		return JSON.parse(text.slice(start, end + 1));
	} catch {
		return null;
	}
}
async function analyzeWithGrok(input) {
	const apiKey = process.env.XAI_API_KEY;
	if (!apiKey) return null;
	const controller = new AbortController();
	const timer = setTimeout(() => controller.abort(), 9e3);
	try {
		const res = await fetch("https://api.x.ai/v1/chat/completions", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${apiKey}`
			},
			signal: controller.signal,
			body: JSON.stringify({
				model: "grok-4.5",
				max_tokens: 280,
				temperature: .1,
				messages: [{
					role: "system",
					content: "You classify civic complaints for an Indian municipal prototype. Reply with JSON only."
				}, {
					role: "user",
					content: `Classify this civic complaint.
Allowed issueType: ${CATEGORIES.join(", ")}.
Return JSON: {"issueType":"...","confidence":0-1,"urgencyScore":0-1,"rationale":"short"}
Title: ${input.title}
Description: ${input.description}`
				}]
			})
		});
		if (!res.ok) return null;
		const parsed = extractJsonObject((await res.json()).choices?.[0]?.message?.content ?? "");
		if (!parsed) return null;
		const issueType = CATEGORIES.includes(parsed.issueType) ? parsed.issueType : classifyFromText(input.title, input.description).category;
		const urg = scoreUrgency({
			category: issueType,
			title: input.title,
			description: input.description,
			similarCount: input.similarCount
		});
		const grokUrgency = typeof parsed.urgencyScore === "number" ? parsed.urgencyScore : urg.score;
		const score = Math.max(0, Math.min(1, (grokUrgency + urg.score) / 2));
		const level = score >= .7 ? "HIGH" : score >= .4 ? "MEDIUM" : "LOW";
		const dept = departmentFor(issueType);
		const confidence = typeof parsed.confidence === "number" ? parsed.confidence : .8;
		return {
			issueType,
			confidence: Math.round(Math.max(.4, Math.min(.97, confidence)) * 100) / 100,
			urgencyScore: Math.round(score * 100) / 100,
			priority: level,
			departmentId: dept.id,
			departmentName: dept.name,
			similarReports: input.similarCount,
			source: "grok",
			rationale: String(parsed.rationale ?? "Classified by Grok with Shinrai routing rules.")
		};
	} catch {
		return null;
	} finally {
		clearTimeout(timer);
	}
}
function findDuplicates(opts) {
	const tokens = tokenize(`${opts.title} ${opts.description}`);
	const out = [];
	for (const c of opts.candidates) {
		const dist = haversineMeters(opts.lat, opts.lng, c.lat, c.lng);
		if (dist > 280) continue;
		const sim = jaccard(tokens, tokenize(`${c.title} ${c.description}`));
		if (sim < .52) continue;
		out.push({
			id: c.id,
			title: c.title,
			similarity: Math.round(sim * 100),
			distanceMeters: Math.round(dist),
			status: c.status,
			category: c.category
		});
	}
	return out.sort((a, b) => b.similarity - a.similarity).slice(0, 4);
}
async function detectAccidentFromFrame(frameDataUrl, hint) {
	const apiKey = process.env.XAI_API_KEY;
	if (apiKey && frameDataUrl) try {
		const controller = new AbortController();
		const timer = setTimeout(() => controller.abort(), 1e4);
		const res = await fetch("https://api.x.ai/v1/chat/completions", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${apiKey}`
			},
			signal: controller.signal,
			body: JSON.stringify({
				model: "grok-4.5",
				max_tokens: 180,
				temperature: 0,
				messages: [{
					role: "user",
					content: [{
						type: "text",
						text: "This is a prototype CCTV still. Does it show a road accident or serious obstruction? JSON only: {\"detected\":boolean,\"confidence\":0-1,\"label\":\"ACCIDENT DETECTED\"|\"NO INCIDENT\",\"notes\":\"short\"}"
					}, {
						type: "image_url",
						image_url: { url: frameDataUrl }
					}]
				}]
			})
		});
		clearTimeout(timer);
		if (res.ok) {
			const parsed = extractJsonObject((await res.json()).choices?.[0]?.message?.content ?? "");
			if (parsed && typeof parsed.detected === "boolean") return {
				detected: parsed.detected,
				confidence: Math.round((Number(parsed.confidence) || .5) * 100) / 100,
				label: String(parsed.label ?? (parsed.detected ? "ACCIDENT DETECTED" : "NO INCIDENT")),
				notes: String(parsed.notes ?? ""),
				source: "grok"
			};
		}
	} catch {}
	const blob = hint.toLowerCase();
	const accidentHint = /accident|crash|collision|wreck|pileup/.test(blob);
	const hash = [...hint].reduce((a, c) => a + c.charCodeAt(0), 0);
	const detected = accidentHint || hash % 5 === 0;
	return {
		detected,
		confidence: accidentHint ? .84 : detected ? .61 : .33,
		label: detected ? "ACCIDENT DETECTED" : "NO INCIDENT",
		notes: accidentHint ? "Prototype detector used filename/description keywords. Not production YOLOv8." : "Prototype detector — no trained accident model is loaded. Result is heuristic for demonstration.",
		source: "prototype"
	};
}
function asIso(v) {
	if (!v) return null;
	if (v instanceof Date) return v.toISOString();
	return v;
}
function parseJson(v, fallback) {
	if (v == null) return fallback;
	if (typeof v === "string") try {
		return JSON.parse(v);
	} catch {
		return fallback;
	}
	return v;
}
function mapComplaint(row) {
	const slaDeadline = asIso(row.sla_deadline);
	const slaBreached = row.sla_breached || !!slaDeadline && new Date(slaDeadline).getTime() < Date.now() && row.status !== "resolved";
	return {
		id: row.id,
		citizenId: row.citizen_id,
		title: row.title,
		description: row.description,
		category: row.category,
		urgencyScore: Number(row.urgency_score),
		urgencyLevel: row.urgency_level,
		departmentId: row.department_id,
		departmentName: row.department_name,
		officerId: row.officer_id,
		officerName: row.officer_name,
		status: row.status,
		lat: Number(row.lat),
		lng: Number(row.lng),
		address: row.address,
		media: parseJson(row.media, []),
		aiAnalysis: parseJson(row.ai_analysis, null),
		parentComplaintId: row.parent_complaint_id,
		duplicateCount: Number(row.duplicate_count ?? 1),
		slaDeadline,
		slaBreached,
		beforeImage: row.before_image,
		afterImage: row.after_image,
		resolutionNotes: row.resolution_notes,
		resolutionSubmittedAt: asIso(row.resolution_submitted_at),
		createdAt: asIso(row.created_at) ?? (/* @__PURE__ */ new Date()).toISOString(),
		updatedAt: asIso(row.updated_at) ?? (/* @__PURE__ */ new Date()).toISOString(),
		resolvedAt: asIso(row.resolved_at)
	};
}
function mapEvent(row) {
	return {
		id: row.id,
		complaintId: row.complaint_id,
		eventType: row.event_type,
		message: row.message,
		actorId: row.actor_id,
		createdAt: asIso(row.created_at) ?? (/* @__PURE__ */ new Date()).toISOString()
	};
}
var COMPLAINT_SELECT = `
  c.id, c.citizen_id, c.title, c.description, c.category, c.urgency_score, c.urgency_level,
  c.department_id, d.name as department_name, c.officer_id, o.name as officer_name,
  c.status, c.lat, c.lng, c.address, c.media, c.ai_analysis, c.parent_complaint_id,
  c.duplicate_count, c.sla_deadline, c.sla_breached, c.before_image, c.after_image,
  c.resolution_notes, c.resolution_submitted_at, c.created_at, c.updated_at, c.resolved_at
`;
var OFFICERS = [
	{
		id: "off-1",
		name: "Asha Mehra",
		department_id: "roads"
	},
	{
		id: "off-2",
		name: "Ravi Chauhan",
		department_id: "sanitation"
	},
	{
		id: "off-3",
		name: "Neha Kapoor",
		department_id: "water"
	},
	{
		id: "off-4",
		name: "Imran Qureshi",
		department_id: "electricity"
	},
	{
		id: "off-5",
		name: "Sanjay Yadav",
		department_id: "emergency"
	}
];
var C = [
	{
		id: "SHN-1001",
		citizen: "seed-c1",
		title: "Deep pothole on Mathura Road",
		description: "Large pothole near the flyover is damaging vehicles and is unsafe at night.",
		category: "Pothole",
		score: .81,
		level: "HIGH",
		dept: "roads",
		officer: "off-1",
		status: "in_progress",
		lat: 28.4089,
		lng: 77.3178,
		address: "Mathura Road, Sector 21, Faridabad",
		hoursAgo: 10,
		dup: 4
	},
	{
		id: "SHN-1002",
		citizen: "seed-c2",
		title: "Same crater on Mathura Road",
		description: "Huge pothole on Mathura Road in front of the metro feeder stop.",
		category: "Pothole",
		score: .79,
		level: "HIGH",
		dept: "roads",
		officer: "off-1",
		status: "assigned",
		lat: 28.4092,
		lng: 77.3181,
		address: "Mathura Road, Sector 21, Faridabad",
		hoursAgo: 8,
		parent: "SHN-1001",
		dup: 1
	},
	{
		id: "SHN-1003",
		citizen: "seed-c3",
		title: "Overflowing garbage near Sector 15 market",
		description: "Garbage overflowing near the vegetable market. Smell is affecting shops.",
		category: "Garbage",
		score: .62,
		level: "MEDIUM",
		dept: "sanitation",
		officer: "off-2",
		status: "officer_accepted",
		lat: 28.3954,
		lng: 77.313,
		address: "Sector 15 Market, Faridabad",
		hoursAgo: 18,
		dup: 3
	},
	{
		id: "SHN-1004",
		citizen: "seed-c4",
		title: "Water pipe leaking on Drain No. 2 road",
		description: "Water pipe is leaking continuously and flooding the footpath.",
		category: "Water Leakage",
		score: .74,
		level: "HIGH",
		dept: "water",
		officer: "off-3",
		status: "assigned",
		lat: 28.4011,
		lng: 77.3072,
		address: "Drain No. 2 Road, Faridabad",
		hoursAgo: 6
	},
	{
		id: "SHN-1005",
		citizen: "seed-c5",
		title: "Street light not working in Sector 37",
		description: "Street light not working near the park. Road is completely dark after 8pm.",
		category: "Broken Streetlight",
		score: .71,
		level: "HIGH",
		dept: "electricity",
		officer: "off-4",
		status: "in_progress",
		lat: 28.3775,
		lng: 77.3158,
		address: "Sector 37, Faridabad",
		hoursAgo: 30,
		breached: true
	},
	{
		id: "SHN-1006",
		citizen: "seed-c1",
		title: "Waterlogging after rain at Badkhal",
		description: "Poor drainage caused severe waterlogging near Badkhal crossing.",
		category: "Drainage",
		score: .77,
		level: "HIGH",
		dept: "public-works",
		officer: "off-1",
		status: "verification_pending",
		lat: 28.425,
		lng: 77.306,
		address: "Badkhal Crossing, Faridabad",
		hoursAgo: 40
	},
	{
		id: "SHN-1007",
		citizen: "seed-c6",
		title: "Two-wheeler accident near Sector 21",
		description: "Accident on the service lane. Vehicles stalled, injured rider waiting for help.",
		category: "Accident",
		score: .91,
		level: "HIGH",
		dept: "emergency",
		officer: "off-5",
		status: "officer_accepted",
		lat: 28.4212,
		lng: 77.3098,
		address: "Sector 21, Faridabad",
		hoursAgo: 3
	},
	{
		id: "SHN-1008",
		citizen: "seed-c7",
		title: "Broken road stretch in Ballabgarh",
		description: "Damaged road with open edges after last repair. Two-wheelers are skidding.",
		category: "Damaged Road",
		score: .66,
		level: "MEDIUM",
		dept: "roads",
		officer: "off-1",
		status: "assigned",
		lat: 28.341,
		lng: 77.325,
		address: "Main Market Road, Ballabgarh",
		hoursAgo: 22
	},
	{
		id: "SHN-1009",
		citizen: "seed-c8",
		title: "Illegal parking blocking NH feeder",
		description: "Traffic obstruction from illegally parked trucks near the industrial gate.",
		category: "Traffic Obstruction",
		score: .69,
		level: "MEDIUM",
		dept: "traffic",
		officer: "off-5",
		status: "ai_analyzed",
		lat: 28.392,
		lng: 77.348,
		address: "Industrial Area, Faridabad",
		hoursAgo: 5
	},
	{
		id: "SHN-1010",
		citizen: "seed-c2",
		title: "Garbage dump behind NIT hostel",
		description: "Open garbage accumulation behind the hostel wall for over a week.",
		category: "Garbage",
		score: .48,
		level: "MEDIUM",
		dept: "sanitation",
		officer: "off-2",
		status: "resolved",
		lat: 28.472,
		lng: 77.316,
		address: "NIT Faridabad",
		hoursAgo: 90,
		resolvedHoursAgo: 12
	},
	{
		id: "SHN-1011",
		citizen: "seed-c9",
		title: "Potholes along Surajkund road",
		description: "Cluster of medium potholes after Surajkund turning.",
		category: "Pothole",
		score: .58,
		level: "MEDIUM",
		dept: "roads",
		officer: "off-1",
		status: "in_progress",
		lat: 28.481,
		lng: 77.284,
		address: "Surajkund Road, Faridabad",
		hoursAgo: 16
	},
	{
		id: "SHN-1012",
		citizen: "seed-c3",
		title: "Burst pipeline in Old Faridabad",
		description: "Water leakage from a burst municipal pipe. Immediate repair needed.",
		category: "Water Leakage",
		score: .83,
		level: "HIGH",
		dept: "water",
		officer: "off-3",
		status: "in_progress",
		lat: 28.392,
		lng: 77.305,
		address: "Old Faridabad Bazaar",
		hoursAgo: 7
	},
	{
		id: "SHN-1013",
		citizen: "seed-c4",
		title: "Clogged drain in Greater Faridabad",
		description: "Drainage blocked with plastic waste. Water stagnant outside houses.",
		category: "Drainage",
		score: .61,
		level: "MEDIUM",
		dept: "public-works",
		officer: null,
		status: "ai_analyzed",
		lat: 28.408,
		lng: 77.35,
		address: "Greater Faridabad, Sector 86",
		hoursAgo: 12
	},
	{
		id: "SHN-1014",
		citizen: "seed-c5",
		title: "Dark stretch near Badarpur border",
		description: "Broken streetlights on the approach road. Unsafe for pedestrians at night.",
		category: "Broken Streetlight",
		score: .72,
		level: "HIGH",
		dept: "electricity",
		officer: "off-4",
		status: "assigned",
		lat: 28.493,
		lng: 77.303,
		address: "Badarpur Border approach",
		hoursAgo: 9
	},
	{
		id: "SHN-1015",
		citizen: "seed-c6",
		title: "Minor pothole near city park",
		description: "Small pothole forming after rain. Not urgent yet.",
		category: "Pothole",
		score: .32,
		level: "LOW",
		dept: "roads",
		officer: null,
		status: "submitted",
		lat: 28.411,
		lng: 77.301,
		address: "City Park, Sector 16, Faridabad",
		hoursAgo: 4
	},
	{
		id: "SHN-1016",
		citizen: "seed-c7",
		title: "Overflowing bins at bus stand",
		description: "Garbage overflowing at the ISBT-side bus stand. Stray animals around.",
		category: "Garbage",
		score: .57,
		level: "MEDIUM",
		dept: "sanitation",
		officer: "off-2",
		status: "assigned",
		lat: 28.3945,
		lng: 77.291,
		address: "Ballabgarh Bus Stand",
		hoursAgo: 20
	},
	{
		id: "SHN-1017",
		citizen: "seed-c8",
		title: "Cracked carriageway on Bypass",
		description: "Damaged road with longitudinal cracks after heavy trucks.",
		category: "Damaged Road",
		score: .64,
		level: "MEDIUM",
		dept: "roads",
		officer: "off-1",
		status: "officer_accepted",
		lat: 28.418,
		lng: 77.332,
		address: "Faridabad Bypass",
		hoursAgo: 28,
		breached: true
	},
	{
		id: "SHN-1018",
		citizen: "seed-c9",
		title: "Waterlogging outside school gate",
		description: "Drainage failure outside a school. Children walking through stagnant water.",
		category: "Drainage",
		score: .8,
		level: "HIGH",
		dept: "public-works",
		officer: "off-1",
		status: "assigned",
		lat: 28.402,
		lng: 77.322,
		address: "Sector 19 School Road, Faridabad",
		hoursAgo: 11
	},
	{
		id: "SHN-1019",
		citizen: "seed-c1",
		title: "Fallen tree blocking inner road",
		description: "Traffic obstruction from a fallen tree after last night's wind.",
		category: "Traffic Obstruction",
		score: .73,
		level: "HIGH",
		dept: "traffic",
		officer: "off-5",
		status: "in_progress",
		lat: 28.387,
		lng: 77.319,
		address: "Sector 28 inner road, Faridabad",
		hoursAgo: 14
	},
	{
		id: "SHN-1020",
		citizen: "seed-c2",
		title: "Leaking valve near housing society",
		description: "Water pipe leaking beside the society wall. Wasting supply.",
		category: "Water Leakage",
		score: .49,
		level: "MEDIUM",
		dept: "water",
		officer: "off-3",
		status: "resolved",
		lat: 28.416,
		lng: 77.298,
		address: "Sector 46, Faridabad",
		hoursAgo: 80,
		resolvedHoursAgo: 20
	},
	{
		id: "SHN-1021",
		citizen: "seed-c3",
		title: "Pothole cluster in Sector 86",
		description: "Several potholes in a 100m stretch after monsoon.",
		category: "Pothole",
		score: .6,
		level: "MEDIUM",
		dept: "roads",
		officer: "off-1",
		status: "ai_analyzed",
		lat: 28.406,
		lng: 77.355,
		address: "Sector 86, Greater Faridabad",
		hoursAgo: 15,
		dup: 2
	},
	{
		id: "SHN-1022",
		citizen: "seed-c4",
		title: "Another pothole in Sector 86",
		description: "Large pothole on the same Greater Faridabad stretch.",
		category: "Pothole",
		score: .63,
		level: "MEDIUM",
		dept: "roads",
		officer: "off-1",
		status: "assigned",
		lat: 28.4064,
		lng: 77.3554,
		address: "Sector 86, Greater Faridabad",
		hoursAgo: 13,
		parent: "SHN-1021"
	},
	{
		id: "SHN-1023",
		citizen: "seed-c5",
		title: "Dumping near canal road",
		description: "Garbage dumped along the canal. Needs sanitation pickup.",
		category: "Garbage",
		score: .41,
		level: "MEDIUM",
		dept: "sanitation",
		officer: "off-2",
		status: "submitted",
		lat: 28.43,
		lng: 77.325,
		address: "Agra Canal Road, Faridabad",
		hoursAgo: 2
	},
	{
		id: "SHN-1024",
		citizen: "seed-c6",
		title: "Open manhole after drain work",
		description: "Drainage work left an open manhole. Safety hazard for two-wheelers.",
		category: "Drainage",
		score: .86,
		level: "HIGH",
		dept: "public-works",
		officer: "off-1",
		status: "in_progress",
		lat: 28.399,
		lng: 77.311,
		address: "Sector 14, Faridabad",
		hoursAgo: 9
	},
	{
		id: "SHN-1025",
		citizen: "seed-c7",
		title: "Flickering streetlight in Sector 16",
		description: "Street light flickering and going dark every few minutes.",
		category: "Broken Streetlight",
		score: .46,
		level: "MEDIUM",
		dept: "electricity",
		officer: "off-4",
		status: "resolved",
		lat: 28.41,
		lng: 77.3,
		address: "Sector 16, Faridabad",
		hoursAgo: 70,
		resolvedHoursAgo: 8
	},
	{
		id: "SHN-1026",
		citizen: "seed-c8",
		title: "Car collision at Bata Chowk",
		description: "Road accident at Bata Chowk. Two cars, traffic backed up.",
		category: "Accident",
		score: .88,
		level: "HIGH",
		dept: "emergency",
		officer: "off-5",
		status: "verification_pending",
		lat: 28.388,
		lng: 77.3105,
		address: "Bata Chowk, Faridabad",
		hoursAgo: 26,
		breached: true
	},
	{
		id: "SHN-1027",
		citizen: "seed-c9",
		title: "Encroachment narrowing service lane",
		description: "Temporary stalls causing traffic obstruction on the service lane.",
		category: "Traffic Obstruction",
		score: .44,
		level: "MEDIUM",
		dept: "traffic",
		officer: null,
		status: "ai_analyzed",
		lat: 28.404,
		lng: 77.314,
		address: "NH-19 service lane, Faridabad",
		hoursAgo: 19
	},
	{
		id: "SHN-1028",
		citizen: "seed-c1",
		title: "Sinking road patch in NIT area",
		description: "Damaged road patch sinking after tanker movement.",
		category: "Damaged Road",
		score: .55,
		level: "MEDIUM",
		dept: "roads",
		officer: "off-1",
		status: "assigned",
		lat: 28.469,
		lng: 77.312,
		address: "NIT Main Gate Road, Faridabad",
		hoursAgo: 33,
		breached: true
	},
	{
		id: "SHN-1029",
		citizen: "seed-c2",
		title: "Leak beside community tap",
		description: "Water leakage from a community tap that never fully closes.",
		category: "Water Leakage",
		score: .36,
		level: "LOW",
		dept: "water",
		officer: "off-3",
		status: "officer_accepted",
		lat: 28.373,
		lng: 77.308,
		address: "Sector 31, Faridabad",
		hoursAgo: 21
	},
	{
		id: "SHN-1030",
		citizen: "seed-c3",
		title: "Pothole outside metro feeder stop",
		description: "Pothole right where autos queue. Vehicles drop into it.",
		category: "Pothole",
		score: .7,
		level: "HIGH",
		dept: "roads",
		officer: "off-1",
		status: "resolution_submitted",
		lat: 28.413,
		lng: 77.321,
		address: "Violet Line feeder, Faridabad",
		hoursAgo: 48
	},
	{
		id: "SHN-1031",
		citizen: "seed-c4",
		title: "Waste burning near godown",
		description: "Garbage being burnt near a warehouse. Smoke affecting nearby homes.",
		category: "Garbage",
		score: .67,
		level: "MEDIUM",
		dept: "sanitation",
		officer: "off-2",
		status: "in_progress",
		lat: 28.36,
		lng: 77.33,
		address: "Industrial godown road, Faridabad",
		hoursAgo: 17
	},
	{
		id: "SHN-1032",
		citizen: "seed-c5",
		title: "Damaged speed breaker approach",
		description: "Damaged road just before a speed breaker causing bike skids.",
		category: "Damaged Road",
		score: .5,
		level: "MEDIUM",
		dept: "roads",
		officer: "off-1",
		status: "resolved",
		lat: 28.42,
		lng: 77.29,
		address: "Sector 21-A, Faridabad",
		hoursAgo: 100,
		resolvedHoursAgo: 30
	}
];
function hoursAgoIso(h) {
	return (/* @__PURE__ */ new Date(Date.now() - h * 3600 * 1e3)).toISOString();
}
function slaFor(level, created) {
	return new Date(new Date(created).getTime() + SLA_HOURS[level] * 3600 * 1e3).toISOString();
}
function svgThumb(label, color) {
	const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='640' height='400'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop stop-color='${color}'/><stop offset='1' stop-color='#12121c'/></linearGradient></defs><rect width='640' height='400' fill='url(#g)'/><text x='40' y='210' fill='white' font-size='28' font-family='sans-serif'>${label}</text><text x='40' y='250' fill='rgba(255,255,255,.7)' font-size='16' font-family='sans-serif'>Prototype evidence still</text></svg>`;
	return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
var globalRef = globalThis;
async function ensureSeeded(sql) {
	globalRef.__shinraiSeed__ ??= (async () => {
		if (((await sql`select count(*)::int as n from departments`)[0]?.n ?? 0) > 0) return;
		for (const d of DEPARTMENTS) await sql`insert into departments (id, name, description) values (${d.id}, ${d.name}, ${d.description})`;
		for (const [level, hours] of Object.entries(SLA_HOURS)) await sql`insert into sla_rules (urgency_level, hours) values (${level}, ${hours})`;
		for (const o of OFFICERS) await sql`insert into officers (id, name, department_id, status) values (${o.id}, ${o.name}, ${o.department_id}, ${"available"})`;
		for (const c of C) {
			const created = hoursAgoIso(c.hoursAgo);
			const resolved = c.resolvedHoursAgo != null ? hoursAgoIso(c.resolvedHoursAgo) : null;
			const sla = slaFor(c.level, created);
			const media = JSON.stringify([{
				type: "image",
				url: svgThumb(c.category, c.level === "HIGH" ? "#ff5a8a" : "#8b7cff"),
				name: "evidence.svg"
			}]);
			const analysis = JSON.stringify({
				issueType: c.category,
				confidence: .78,
				urgencyScore: c.score,
				priority: c.level,
				departmentId: c.dept,
				departmentName: DEPARTMENTS.find((d) => d.id === c.dept)?.name ?? c.dept,
				similarReports: c.dup ?? 0,
				source: "prototype",
				rationale: "Seeded prototype classification for demonstration."
			});
			const before = c.status === "resolved" || c.status === "verification_pending" || c.status === "resolution_submitted" ? svgThumb("BEFORE", "#6e6a80") : null;
			const after = c.status === "resolved" || c.status === "verification_pending" || c.status === "resolution_submitted" ? svgThumb("AFTER", "#34d399") : null;
			const notes = after ? "Patch completed. Surface leveled and debris cleared." : null;
			await sql.query(`insert into complaints (
          id, citizen_id, title, description, category, urgency_score, urgency_level,
          department_id, officer_id, status, lat, lng, address, media, ai_analysis,
          parent_complaint_id, duplicate_count, sla_deadline, sla_breached,
          before_image, after_image, resolution_notes, resolution_submitted_at,
          created_at, updated_at, resolved_at
        ) values (
          $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14::jsonb,$15::jsonb,
          $16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26
        )`, [
				c.id,
				c.citizen,
				c.title,
				c.description,
				c.category,
				c.score,
				c.level,
				c.dept,
				c.officer,
				c.status,
				c.lat,
				c.lng,
				c.address,
				media,
				analysis,
				c.parent ?? null,
				c.dup ?? 1,
				sla,
				Boolean(c.breached),
				before,
				after,
				notes,
				after ? hoursAgoIso(Math.max(1, c.hoursAgo - 2)) : null,
				created,
				created,
				resolved
			]);
			const events = [{
				type: "submitted",
				msg: "Complaint submitted by citizen.",
				ago: c.hoursAgo
			}, {
				type: "ai_analyzed",
				msg: `Prototype AI classified as ${c.category} (${c.level}).`,
				ago: c.hoursAgo - .05
			}];
			if ([
				"assigned",
				"officer_accepted",
				"in_progress",
				"resolution_submitted",
				"verification_pending",
				"resolved"
			].includes(c.status)) events.push({
				type: "assigned",
				msg: `Routed to ${DEPARTMENTS.find((d) => d.id === c.dept)?.name}.`,
				ago: c.hoursAgo - .2
			});
			if ([
				"officer_accepted",
				"in_progress",
				"resolution_submitted",
				"verification_pending",
				"resolved"
			].includes(c.status)) events.push({
				type: "officer_accepted",
				msg: "Field officer accepted the task.",
				ago: Math.max(1, c.hoursAgo - 1)
			});
			if ([
				"in_progress",
				"resolution_submitted",
				"verification_pending",
				"resolved"
			].includes(c.status)) events.push({
				type: "in_progress",
				msg: "Work started on site.",
				ago: Math.max(1, c.hoursAgo - 2)
			});
			if ([
				"resolution_submitted",
				"verification_pending",
				"resolved"
			].includes(c.status)) events.push({
				type: "resolution_submitted",
				msg: "Before/after evidence submitted for verification.",
				ago: Math.max(1, c.hoursAgo - 3)
			});
			if (c.status === "resolved") events.push({
				type: "resolved",
				msg: "Admin verified resolution. Complaint closed.",
				ago: c.resolvedHoursAgo ?? 1
			});
			for (const e of events) await sql.query(`insert into complaint_events (complaint_id, event_type, message, actor_id, created_at) values ($1,$2,$3,$4,$5)`, [
				c.id,
				e.type,
				e.msg,
				"system",
				hoursAgoIso(Math.max(.01, e.ago))
			]);
		}
		await sql`insert into notifications (user_id, audience, title, body, complaint_id)
      values (${null}, ${"admins"}, ${"SLA breach"}, ${"Complaint SHN-1005 has breached its SLA deadline."}, ${"SHN-1005"})`;
		await sql`insert into notifications (user_id, audience, title, body, complaint_id)
      values (${null}, ${"admins"}, ${"High-priority accident"}, ${"Accident reported near Sector 21. Emergency routing active."}, ${"SHN-1007"})`;
		await sql`insert into notifications (user_id, audience, title, body, complaint_id)
      values (${null}, ${"officers"}, ${"New assignment"}, ${"Pothole SHN-1001 assigned to Roads & Infrastructure."}, ${"SHN-1001"})`;
		await sql`insert into accident_incidents (camera_id, location_label, lat, lng, detection, confidence, alert_status, prototype, notes)
      values (${"CAM-21A"}, ${"Sector 21, Faridabad"}, ${28.4212}, ${77.3098}, ${"ACCIDENT DETECTED"}, ${.89}, ${"open"}, ${true}, ${"Prototype detection from demo seed. Not live CCTV."})`;
	})().catch((err) => {
		globalRef.__shinraiSeed__ = void 0;
		throw err;
	});
	return globalRef.__shinraiSeed__;
}
async function nextComplaintId(sql) {
	const last = (await sql`select id from complaints order by id desc limit 1`)[0]?.id ?? "SHN-1000";
	const n = Number(last.replace("SHN-", "")) + 1;
	return `SHN-${String(n).padStart(4, "0")}`;
}
async function db() {
	const sql = await getSql();
	await ensureSeeded(sql);
	return sql;
}
async function getRole(sql, userId) {
	return (await sql`select role from profiles where user_id = ${userId}`)[0]?.role ?? "citizen";
}
async function ensureProfile(sql, userId, displayName) {
	await sql`
    insert into profiles (user_id, role, display_name)
    values (${userId}, ${"citizen"}, ${displayName ?? null})
    on conflict (user_id) do nothing
  `;
	const role = await getRole(sql, userId);
	if (role === "officer") {
		if (!(await sql`select id from officers where user_id = ${userId} limit 1`)[0]) {
			const free = await sql`select id from officers where user_id is null limit 1`;
			if (free[0]) await sql`update officers set user_id = ${userId} where id = ${free[0].id}`;
			else await sql`insert into officers (id, name, department_id, user_id) values (${`off-${userId.slice(0, 8)}`}, ${displayName || "Field Officer"}, ${"roads"}, ${userId}) on conflict (id) do update set user_id = ${userId}`;
		}
	}
	return role;
}
async function notify(sql, opts) {
	await sql`
    insert into notifications (user_id, audience, title, body, complaint_id)
    values (${opts.userId ?? null}, ${opts.audience}, ${opts.title}, ${opts.body}, ${opts.complaintId ?? null})
  `;
}
async function addEvent(sql, complaintId, eventType, message, actorId) {
	await sql`
    insert into complaint_events (complaint_id, event_type, message, actor_id)
    values (${complaintId}, ${eventType}, ${message}, ${actorId})
  `;
}
async function fetchComplaint(sql, id) {
	const rows = await sql.query(`select ${COMPLAINT_SELECT} from complaints c
     left join departments d on d.id = c.department_id
     left join officers o on o.id = c.officer_id
     where c.id = $1`, [id]);
	return rows[0] ? mapComplaint(rows[0]) : null;
}
async function assertCanView(sql, userId, complaintId) {
	const role = await getRole(sql, userId);
	const c = await fetchComplaint(sql, complaintId);
	if (!c) return {
		role,
		complaint: null
	};
	if (role === "admin") return {
		role,
		complaint: c
	};
	if (role === "officer") {
		const ids = (await sql`select id from officers where user_id = ${userId}`).map((o) => o.id);
		if (c.officerId && ids.includes(c.officerId)) return {
			role,
			complaint: c
		};
		if (c.departmentId) {
			if ((await sql`select department_id from officers where user_id = ${userId}`).some((d) => d.department_id === c.departmentId)) return {
				role,
				complaint: c
			};
		}
	}
	if (c.citizenId === userId) return {
		role,
		complaint: c
	};
	if (role === "citizen") return {
		role,
		complaint: c
	};
	return {
		role,
		complaint: c
	};
}
var bootstrapMe_createServerFn_handler = createServerRpc({
	id: "105cbb26e35c6058ca3b608df33e6fa778290a3bfbc8f3964fdf3ce4733bd22f",
	name: "bootstrapMe",
	filename: "src/lib/shinrai/server.ts"
}, (opts) => bootstrapMe.__executeServer(opts));
var bootstrapMe = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(bootstrapMe_createServerFn_handler, async ({ context, data }) => {
	const sql = await db();
	await ensureProfile(sql, context.userId, data.displayName);
	if (data.role) {
		await sql`update profiles set role = ${data.role}, updated_at = now() where user_id = ${context.userId}`;
		if (data.role === "officer") await ensureProfile(sql, context.userId, data.displayName);
	}
	const role = await getRole(sql, context.userId);
	const unread = await sql`
      select count(*)::int as n from notifications
      where is_read = false and (
        user_id = ${context.userId}
        or (audience = 'admins' and ${role} = 'admin')
        or (audience = 'officers' and ${role} = 'officer')
        or (audience = 'citizens' and ${role} = 'citizen')
      )
    `;
	return {
		userId: context.userId,
		role,
		unread: unread[0]?.n ?? 0
	};
});
var listDepartments_createServerFn_handler = createServerRpc({
	id: "2a265847f5baf00dde8e42f98fd911bc68c8ef108a4b29e2ea1449300966cddf",
	name: "listDepartments",
	filename: "src/lib/shinrai/server.ts"
}, (opts) => listDepartments.__executeServer(opts));
var listDepartments = createServerFn({ method: "GET" }).handler(listDepartments_createServerFn_handler, async () => {
	return (await db())`select id, name, description from departments order by name`;
});
var listOfficers_createServerFn_handler = createServerRpc({
	id: "55639118f4d9e4344b905cde8b2986fa12f2107780282dd27b42c0043a4f55aa",
	name: "listOfficers",
	filename: "src/lib/shinrai/server.ts"
}, (opts) => listOfficers.__executeServer(opts));
var listOfficers = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listOfficers_createServerFn_handler, async ({ context }) => {
	const sql = await db();
	if (await getRole(sql, context.userId) !== "admin") throw new Error("Admin only");
	return sql`
      select o.id, o.name, o.department_id, d.name as department_name, o.user_id, o.status
      from officers o join departments d on d.id = o.department_id order by o.name
    `;
});
var getPublicPins_createServerFn_handler = createServerRpc({
	id: "2f9b406a0bea41cb71947e15e68bbefe06a2233835a8bcb0cda6c54bb00aa97c",
	name: "getPublicPins",
	filename: "src/lib/shinrai/server.ts"
}, (opts) => getPublicPins.__executeServer(opts));
var getPublicPins = createServerFn({ method: "GET" }).handler(getPublicPins_createServerFn_handler, async () => {
	return (await db())`
    select id, title, category, urgency_level, status, lat, lng, department_id, duplicate_count
    from complaints where parent_complaint_id is null
  `;
});
var listMyComplaints_createServerFn_handler = createServerRpc({
	id: "ef01f1759d90298853e51ba1237465a60f7e1add47a3f36c96803579c09f019e",
	name: "listMyComplaints",
	filename: "src/lib/shinrai/server.ts"
}, (opts) => listMyComplaints.__executeServer(opts));
var listMyComplaints = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listMyComplaints_createServerFn_handler, async ({ context }) => {
	return (await (await db()).query(`select ${COMPLAINT_SELECT} from complaints c
       left join departments d on d.id = c.department_id
       left join officers o on o.id = c.officer_id
       where c.citizen_id = $1
       order by c.created_at desc`, [context.userId])).map(mapComplaint);
});
var listOfficerQueue_createServerFn_handler = createServerRpc({
	id: "67fe45bb209d5655f47c4fc52b155a6e1736b0ecd8ff22826ecf26b9733128ec",
	name: "listOfficerQueue",
	filename: "src/lib/shinrai/server.ts"
}, (opts) => listOfficerQueue.__executeServer(opts));
var listOfficerQueue = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listOfficerQueue_createServerFn_handler, async ({ context }) => {
	const sql = await db();
	await ensureProfile(sql, context.userId);
	const role = await getRole(sql, context.userId);
	if (role !== "officer" && role !== "admin") throw new Error("Officer only");
	const mine = await sql`select id, department_id from officers where user_id = ${context.userId}`;
	const officerIds = new Set(mine.map((m) => m.id));
	const deptIds = new Set(mine.map((m) => m.department_id));
	const mapped = (await sql.query(`select ${COMPLAINT_SELECT} from complaints c
       left join departments d on d.id = c.department_id
       left join officers o on o.id = c.officer_id
       where c.status <> 'resolved'
       order by c.urgency_score desc, c.created_at asc`)).map(mapComplaint);
	if (role === "admin") return mapped;
	return mapped.filter((c) => c.officerId && officerIds.has(c.officerId) || c.departmentId && deptIds.has(c.departmentId) || officerIds.size === 0);
});
var listAdminComplaints_createServerFn_handler = createServerRpc({
	id: "ff3867773c1a61d01099f71d98d96ace7793f8c35813dc4419cccbdbd7ff927d",
	name: "listAdminComplaints",
	filename: "src/lib/shinrai/server.ts"
}, (opts) => listAdminComplaints.__executeServer(opts));
var listAdminComplaints = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(listAdminComplaints_createServerFn_handler, async ({ context, data }) => {
	const sql = await db();
	if (await getRole(sql, context.userId) !== "admin") throw new Error("Admin only");
	return (await sql.query(`select ${COMPLAINT_SELECT} from complaints c
       left join departments d on d.id = c.department_id
       left join officers o on o.id = c.officer_id
       where ($1 = '' or c.category = $1)
         and ($2 = '' or c.urgency_level = $2)
         and ($3 = '' or c.status = $3)
         and ($4 = '' or c.department_id = $4)
       order by
         case when $5 = 'oldest' then c.created_at end asc,
         case when $5 = 'urgency' then c.urgency_score end desc,
         case when $5 = 'sla' then c.sla_deadline end asc nulls last,
         c.created_at desc`, [
		data.category ?? "",
		data.urgency ?? "",
		data.status ?? "",
		data.departmentId ?? "",
		data.sort ?? "newest"
	])).map(mapComplaint);
});
var getComplaint_createServerFn_handler = createServerRpc({
	id: "db3731e1945f4d919f9d071f831d841e25ddb5d8964299935849e81c5d2fac1a",
	name: "getComplaint",
	filename: "src/lib/shinrai/server.ts"
}, (opts) => getComplaint.__executeServer(opts));
var getComplaint = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((id) => id).handler(getComplaint_createServerFn_handler, async ({ context, data: id }) => {
	const sql = await db();
	const { complaint } = await assertCanView(sql, context.userId, id);
	if (!complaint) return null;
	const events = await sql.query(`select * from complaint_events where complaint_id = $1 order by created_at asc`, [id]);
	const dups = await sql.query(`select ${COMPLAINT_SELECT} from complaints c
       left join departments d on d.id = c.department_id
       left join officers o on o.id = c.officer_id
       where c.parent_complaint_id = $1 or (c.id = $2 and c.parent_complaint_id is not null)`, [complaint.parentComplaintId ?? id, complaint.parentComplaintId ?? ""]);
	return {
		complaint,
		events: events.map(mapEvent),
		linked: dups.map(mapComplaint)
	};
});
var createComplaint_createServerFn_handler = createServerRpc({
	id: "18c4fb8114c92db89d0523d2ae7b8a4f69f1399a656846fca265deb4bccf4829",
	name: "createComplaint",
	filename: "src/lib/shinrai/server.ts"
}, (opts) => createComplaint.__executeServer(opts));
var createComplaint = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createComplaint_createServerFn_handler, async ({ context, data }) => {
	const sql = await db();
	await ensureProfile(sql, context.userId);
	const id = await nextComplaintId(sql);
	const title = data.title.trim();
	const description = data.description.trim();
	if (!title) throw new Error("Title is required");
	await sql.query(`insert into complaints (
        id, citizen_id, title, description, category, status, lat, lng, address, media
      ) values ($1,$2,$3,$4,$5,'submitted',$6,$7,$8,$9::jsonb)`, [
		id,
		context.userId,
		title,
		description,
		data.category || "Other",
		data.lat,
		data.lng,
		data.address || "Faridabad",
		JSON.stringify(data.media ?? [])
	]);
	await addEvent(sql, id, "submitted", "Complaint submitted by citizen.", context.userId);
	await notify(sql, {
		userId: context.userId,
		audience: "user",
		title: `Complaint ${id} received`,
		body: "Your report is in the queue. AI analysis is next.",
		complaintId: id
	});
	return { id };
});
var analyzeComplaint_createServerFn_handler = createServerRpc({
	id: "eaca3ac85cfbcdb29c78c718a3b2a3a32837efbbd93cbdd24ce83c8b378ee76c",
	name: "analyzeComplaint",
	filename: "src/lib/shinrai/server.ts"
}, (opts) => analyzeComplaint.__executeServer(opts));
var analyzeComplaint = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(analyzeComplaint_createServerFn_handler, async ({ context, data }) => {
	const sql = await db();
	const current = await fetchComplaint(sql, data.id);
	if (!current) throw new Error("Complaint not found");
	if (current.citizenId !== context.userId && await getRole(sql, context.userId) !== "admin") throw new Error("Not allowed");
	const open = await sql`
      select id, title, description, lat, lng, status, category from complaints
      where id <> ${data.id} and parent_complaint_id is null and status <> 'resolved'
    `;
	const duplicates = findDuplicates({
		title: current.title,
		description: current.description,
		lat: current.lat,
		lng: current.lng,
		candidates: open
	});
	if (data.attachTo) {
		const parent = await fetchComplaint(sql, data.attachTo);
		if (!parent) throw new Error("Parent complaint not found");
		await sql`
        update complaints set parent_complaint_id = ${parent.id}, status = 'ai_analyzed', updated_at = now()
        where id = ${data.id}
      `;
		await sql`update complaints set duplicate_count = duplicate_count + 1, updated_at = now() where id = ${parent.id}`;
		await addEvent(sql, data.id, "merged", `Linked as duplicate of ${parent.id}.`, context.userId);
		await addEvent(sql, parent.id, "upvote", "Another citizen confirmed this issue.", context.userId);
		await notify(sql, {
			userId: context.userId,
			audience: "user",
			title: `Added to ${parent.id}`,
			body: "Your report was merged with an existing nearby complaint. The upvote count increased.",
			complaintId: parent.id
		});
		return {
			complaint: await fetchComplaint(sql, parent.id),
			duplicates,
			mergedInto: parent.id
		};
	}
	const analysis = await analyzeWithGrok({
		title: current.title,
		description: current.description,
		similarCount: duplicates.length
	}) ?? prototypeAnalysis(current.title, current.description, duplicates.length);
	const deadline = slaDeadlineFrom(analysis.priority).toISOString();
	const category = current.category !== "Other" ? current.category : analysis.issueType;
	await sql.query(`update complaints set
        category = $2, urgency_score = $3, urgency_level = $4, department_id = $5,
        status = 'assigned', ai_analysis = $6::jsonb, sla_deadline = $7, updated_at = now()
       where id = $1`, [
		data.id,
		category,
		analysis.urgencyScore,
		analysis.priority,
		analysis.departmentId,
		JSON.stringify({
			...analysis,
			similarReports: duplicates.length
		}),
		deadline
	]);
	await addEvent(sql, data.id, "ai_analyzed", `${analysis.source === "grok" ? "Grok" : "Prototype classifier"}: ${analysis.issueType} · ${analysis.priority}.`, "system");
	await addEvent(sql, data.id, "assigned", `Routed to ${analysis.departmentName}.`, "system");
	await notify(sql, {
		userId: context.userId,
		audience: "user",
		title: `Complaint ${data.id} assigned`,
		body: `Assigned to ${analysis.departmentName}. Priority ${analysis.priority}.`,
		complaintId: data.id
	});
	await notify(sql, {
		audience: "admins",
		title: "New complaint routed",
		body: `${data.id} · ${analysis.issueType} · ${analysis.priority} → ${analysis.departmentName}`,
		complaintId: data.id
	});
	await notify(sql, {
		audience: "officers",
		title: "Queue updated",
		body: `${data.id} needs ${analysis.departmentName}.`,
		complaintId: data.id
	});
	return {
		complaint: await fetchComplaint(sql, data.id),
		duplicates,
		mergedInto: null
	};
});
var upvoteComplaint_createServerFn_handler = createServerRpc({
	id: "5a8be71b0b333fff9e41e622153849a743cd4d30a4b9399566f37d3822ce4366",
	name: "upvoteComplaint",
	filename: "src/lib/shinrai/server.ts"
}, (opts) => upvoteComplaint.__executeServer(opts));
var upvoteComplaint = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((id) => id).handler(upvoteComplaint_createServerFn_handler, async ({ context, data: id }) => {
	const sql = await db();
	await sql`update complaints set duplicate_count = duplicate_count + 1, updated_at = now() where id = ${id}`;
	await addEvent(sql, id, "upvote", "Citizen confirmed this issue.", context.userId);
	return fetchComplaint(sql, id);
});
var patchComplaint_createServerFn_handler = createServerRpc({
	id: "8f439186f71b87f15294ea98622f2b326c513ca41c3560116252a7d4f905f8f6",
	name: "patchComplaint",
	filename: "src/lib/shinrai/server.ts"
}, (opts) => patchComplaint.__executeServer(opts));
var patchComplaint = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(patchComplaint_createServerFn_handler, async ({ context, data }) => {
	const sql = await db();
	const role = await getRole(sql, context.userId);
	const c = await fetchComplaint(sql, data.id);
	if (!c) throw new Error("Not found");
	const isAdmin = role === "admin";
	const off = await sql`select id from officers where user_id = ${context.userId}`;
	const isOfficer = role === "officer" && (off.some((o) => o.id === c.officerId) || isAdmin || role === "officer");
	const touch = async () => sql`update complaints set updated_at = now() where id = ${data.id}`;
	switch (data.action) {
		case "assign_department": {
			if (!isAdmin) throw new Error("Admin only");
			await sql`update complaints set department_id = ${data.departmentId ?? null}, status = ${"assigned"}, updated_at = now() where id = ${data.id}`;
			const name = DEPARTMENTS.find((d) => d.id === data.departmentId)?.name ?? "department";
			await addEvent(sql, data.id, "assigned", `Admin assigned ${name}.`, context.userId);
			break;
		}
		case "assign_officer":
			if (!isAdmin) throw new Error("Admin only");
			await sql`update complaints set officer_id = ${data.officerId ?? null}, status = ${"assigned"}, updated_at = now() where id = ${data.id}`;
			await addEvent(sql, data.id, "assigned", `Officer assigned.`, context.userId);
			await notify(sql, {
				audience: "officers",
				title: `${data.id} assigned`,
				body: "A complaint was assigned to the field team.",
				complaintId: data.id
			});
			break;
		case "change_priority": {
			if (!isAdmin || !data.priority) throw new Error("Admin only");
			const deadline = slaDeadlineFrom(data.priority).toISOString();
			const score = data.priority === "HIGH" ? .82 : data.priority === "MEDIUM" ? .55 : .3;
			await sql`update complaints set urgency_level = ${data.priority}, urgency_score = ${score}, sla_deadline = ${deadline}, sla_breached = false, updated_at = now() where id = ${data.id}`;
			await addEvent(sql, data.id, "priority", `Priority changed to ${data.priority}.`, context.userId);
			break;
		}
		case "change_status":
			if (!isAdmin || !data.status) throw new Error("Admin only");
			if (data.status === "resolved") throw new Error("Use verification to resolve.");
			await sql`update complaints set status = ${data.status}, updated_at = now() where id = ${data.id}`;
			await addEvent(sql, data.id, data.status, `Status set to ${data.status}.`, context.userId);
			break;
		case "escalate":
			if (!isAdmin && !isOfficer) throw new Error("Not allowed");
			await sql`update complaints set urgency_level = ${"HIGH"}, urgency_score = ${.9}, sla_deadline = ${slaDeadlineFrom("HIGH").toISOString()}, sla_breached = false, updated_at = now() where id = ${data.id}`;
			await addEvent(sql, data.id, "escalated", "Complaint escalated. SLA reset to HIGH (4 hours).", context.userId);
			await notify(sql, {
				audience: "admins",
				title: `${data.id} escalated`,
				body: "SLA reset to HIGH.",
				complaintId: data.id
			});
			break;
		case "accept": {
			if (!isOfficer && !isAdmin) throw new Error("Officer only");
			let officerId = c.officerId;
			if (!officerId) {
				officerId = (off[0] ?? (await sql`select id from officers where user_id = ${context.userId}`)[0])?.id ?? c.officerId;
				await sql`update complaints set officer_id = ${officerId}, status = ${"officer_accepted"}, updated_at = now() where id = ${data.id}`;
			} else await sql`update complaints set status = ${"officer_accepted"}, updated_at = now() where id = ${data.id}`;
			await addEvent(sql, data.id, "officer_accepted", "Officer accepted the task.", context.userId);
			await notify(sql, {
				userId: c.citizenId,
				audience: "user",
				title: `${data.id} accepted`,
				body: "An officer has accepted your complaint.",
				complaintId: data.id
			});
			break;
		}
		case "start":
			if (!isOfficer && !isAdmin) throw new Error("Officer only");
			await sql`update complaints set status = ${"in_progress"}, updated_at = now() where id = ${data.id}`;
			await addEvent(sql, data.id, "in_progress", "Work started on site.", context.userId);
			await notify(sql, {
				userId: c.citizenId,
				audience: "user",
				title: `Work started on ${data.id}`,
				body: "The field team has started work on your complaint.",
				complaintId: data.id
			});
			break;
		case "save_before":
			if (!isOfficer && !isAdmin) throw new Error("Officer only");
			await sql`update complaints set before_image = ${data.image ?? null}, updated_at = now() where id = ${data.id}`;
			await addEvent(sql, data.id, "evidence", "Before photo uploaded.", context.userId);
			break;
		case "submit_resolution":
			if (!isOfficer && !isAdmin) throw new Error("Officer only");
			if (!data.image && !c.beforeImage) throw new Error("Before image required");
			if (!data.afterImage) throw new Error("After image required");
			await sql`
          update complaints set
            before_image = coalesce(${data.image ?? null}, before_image),
            after_image = ${data.afterImage},
            resolution_notes = ${data.notes ?? ""},
            resolution_submitted_at = now(),
            status = ${"verification_pending"},
            updated_at = now()
          where id = ${data.id}
        `;
			await addEvent(sql, data.id, "resolution_submitted", "Resolution submitted with before/after evidence.", context.userId);
			await notify(sql, {
				userId: c.citizenId,
				audience: "user",
				title: `${data.id} awaiting verification`,
				body: "Your complaint resolution is awaiting admin verification.",
				complaintId: data.id
			});
			await notify(sql, {
				audience: "admins",
				title: "Verification needed",
				body: `${data.id} has before/after evidence ready.`,
				complaintId: data.id
			});
			break;
		case "verify":
			if (!isAdmin) throw new Error("Admin only");
			await sql`update complaints set status = ${"resolved"}, resolved_at = now(), updated_at = now() where id = ${data.id}`;
			await addEvent(sql, data.id, "resolved", "Admin verified the before/after evidence. Complaint closed.", context.userId);
			await notify(sql, {
				userId: c.citizenId,
				audience: "user",
				title: `${data.id} resolved`,
				body: "Your complaint was verified and closed.",
				complaintId: data.id
			});
			break;
		case "reject_resolution":
			if (!isAdmin) throw new Error("Admin only");
			await sql`update complaints set status = ${"in_progress"}, updated_at = now() where id = ${data.id}`;
			await addEvent(sql, data.id, "rejected", data.notes || "Resolution rejected. More work required.", context.userId);
			await notify(sql, {
				audience: "officers",
				title: `${data.id} resolution rejected`,
				body: data.notes || "Please resubmit with clearer evidence.",
				complaintId: data.id
			});
	}
	await touch();
	return fetchComplaint(sql, data.id);
});
var listNotifications_createServerFn_handler = createServerRpc({
	id: "bb22e3016157a9049fa5cbf1c231c5937a17c782538d2ff06c877fec89f09afa",
	name: "listNotifications",
	filename: "src/lib/shinrai/server.ts"
}, (opts) => listNotifications.__executeServer(opts));
var listNotifications = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listNotifications_createServerFn_handler, async ({ context }) => {
	const sql = await db();
	const role = await getRole(sql, context.userId);
	return (await sql`
      select id, title, body, is_read, complaint_id, created_at
      from notifications
      where user_id = ${context.userId}
         or (audience = 'admins' and ${role} = 'admin')
         or (audience = 'officers' and ${role} = 'officer')
         or (audience = 'citizens' and ${role} = 'citizen')
      order by created_at desc
      limit 40
    `).map((r) => ({
		id: r.id,
		title: r.title,
		body: r.body,
		isRead: r.is_read,
		complaintId: r.complaint_id,
		createdAt: r.created_at instanceof Date ? r.created_at.toISOString() : String(r.created_at)
	}));
});
var markNotificationRead_createServerFn_handler = createServerRpc({
	id: "a84e67de074e9f471293922c30d829fde731237341a9b5912cea6b7e6d748d0d",
	name: "markNotificationRead",
	filename: "src/lib/shinrai/server.ts"
}, (opts) => markNotificationRead.__executeServer(opts));
var markNotificationRead = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((id) => id).handler(markNotificationRead_createServerFn_handler, async ({ data: id }) => {
	await (await db())`update notifications set is_read = true where id = ${id}`;
	return { ok: true };
});
var analyticsOverview_createServerFn_handler = createServerRpc({
	id: "027b3642c1f5bf023e3fbfd143f9d05e148a62e1154dec45c378c9f368914bbf",
	name: "analyticsOverview",
	filename: "src/lib/shinrai/server.ts"
}, (opts) => analyticsOverview.__executeServer(opts));
var analyticsOverview = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(analyticsOverview_createServerFn_handler, async ({ context }) => {
	const sql = await db();
	if (await getRole(sql, context.userId) !== "admin") throw new Error("Admin only");
	const total = await sql`select count(*)::int as n from complaints where parent_complaint_id is null`;
	const open = await sql`select count(*)::int as n from complaints where parent_complaint_id is null and status <> 'resolved'`;
	const resolved = await sql`select count(*)::int as n from complaints where status = 'resolved'`;
	const high = await sql`select count(*)::int as n from complaints where urgency_level = 'HIGH' and status <> 'resolved'`;
	const breached = await sql`
      select count(*)::int as n from complaints
      where parent_complaint_id is null and status <> 'resolved'
        and sla_deadline is not null and sla_deadline < now()
    `;
	const avg = await sql`
      select avg(extract(epoch from (resolved_at - created_at)) / 3600.0) as hours
      from complaints where resolved_at is not null
    `;
	const openN = open[0]?.n ?? 0;
	const breachedN = breached[0]?.n ?? 0;
	const slaCompliance = openN + (resolved[0]?.n ?? 0) === 0 ? 100 : Math.round((1 - breachedN / Math.max(1, total[0]?.n ?? 1)) * 100);
	return {
		total: total[0]?.n ?? 0,
		open: openN,
		resolved: resolved[0]?.n ?? 0,
		highPriority: high[0]?.n ?? 0,
		slaCompliance,
		avgResolutionHours: avg[0]?.hours != null ? Math.round(Number(avg[0].hours) * 10) / 10 : null,
		slaBreached: breachedN
	};
});
var analyticsBreakdown_createServerFn_handler = createServerRpc({
	id: "f6493f0f004986f61909a578b9c25329a06b22fb1a59c145db73a267aec40d23",
	name: "analyticsBreakdown",
	filename: "src/lib/shinrai/server.ts"
}, (opts) => analyticsBreakdown.__executeServer(opts));
var analyticsBreakdown = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(analyticsBreakdown_createServerFn_handler, async ({ context, data }) => {
	const sql = await db();
	if (await getRole(sql, context.userId) !== "admin") throw new Error("Admin only");
	const days = data.days ?? 90;
	const since = (/* @__PURE__ */ new Date(Date.now() - days * 864e5)).toISOString();
	return {
		byCategory: await sql`
      select category as name, count(*)::int as value from complaints
      where parent_complaint_id is null and created_at >= ${since}
      group by category order by value desc
    `,
		byDepartment: await sql`
      select coalesce(d.name, 'Unassigned') as name, count(*)::int as value
      from complaints c left join departments d on d.id = c.department_id
      where c.parent_complaint_id is null and c.created_at >= ${since}
      group by d.name order by value desc
    `,
		byUrgency: await sql`
      select urgency_level as name, count(*)::int as value from complaints
      where parent_complaint_id is null and created_at >= ${since}
      group by urgency_level
    `,
		byStatus: await sql`
      select status as name, count(*)::int as value from complaints
      where parent_complaint_id is null and created_at >= ${since}
      group by status
    `,
		trends: await sql`
      select to_char(date_trunc('day', created_at), 'YYYY-MM-DD') as day, count(*)::int as count
      from complaints
      where parent_complaint_id is null and created_at >= ${since}
      group by 1 order by 1
    `,
		heatmap: await sql`
      select lat, lng, duplicate_count::int as weight, category from complaints
      where parent_complaint_id is null
    `
	};
});
var analyzeCctv_createServerFn_handler = createServerRpc({
	id: "197d789717f667e5783e96553265cd3e0c8d16cb54a700b2b3db89dffa420303",
	name: "analyzeCctv",
	filename: "src/lib/shinrai/server.ts"
}, (opts) => analyzeCctv.__executeServer(opts));
var analyzeCctv = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(analyzeCctv_createServerFn_handler, async ({ context, data }) => {
	const sql = await db();
	if (await getRole(sql, context.userId) !== "admin") throw new Error("Admin only");
	const result = await detectAccidentFromFrame(data.frameData ?? null, `${data.hint ?? ""} ${data.locationLabel} ${data.cameraId}`);
	const inserted = await sql`
      insert into accident_incidents (camera_id, location_label, lat, lng, detection, confidence, alert_status, prototype, frame_data, notes)
      values (${data.cameraId}, ${data.locationLabel}, ${data.lat}, ${data.lng}, ${result.label}, ${result.confidence}, ${result.detected ? "open" : "cleared"}, ${true}, ${data.frameData ?? null}, ${result.notes})
      returning id
    `;
	if (result.detected) {
		await notify(sql, {
			audience: "admins",
			title: "New accident detected near " + data.locationLabel,
			body: `${result.label} · confidence ${result.confidence} · ${data.cameraId} (prototype detection)`
		});
		await notify(sql, {
			audience: "officers",
			title: "Incident alert",
			body: `${result.label} at ${data.locationLabel}. Prototype CCTV module.`
		});
	}
	return {
		id: inserted[0]?.id,
		...result
	};
});
var listIncidents_createServerFn_handler = createServerRpc({
	id: "f77a67027a8339966847b2b9b1f2e022e401af7037b60c07f64fd3ef798d0dde",
	name: "listIncidents",
	filename: "src/lib/shinrai/server.ts"
}, (opts) => listIncidents.__executeServer(opts));
var listIncidents = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listIncidents_createServerFn_handler, async ({ context }) => {
	const sql = await db();
	if (await getRole(sql, context.userId) !== "admin") throw new Error("Admin only");
	return (await sql`select * from accident_incidents order by created_at desc limit 20`).map((r) => ({
		id: r.id,
		cameraId: r.camera_id,
		locationLabel: r.location_label,
		lat: Number(r.lat),
		lng: Number(r.lng),
		detection: r.detection,
		confidence: Number(r.confidence),
		alertStatus: r.alert_status,
		prototype: r.prototype,
		frameData: r.frame_data,
		notes: r.notes,
		createdAt: r.created_at instanceof Date ? r.created_at.toISOString() : String(r.created_at)
	}));
});
var citizenStats_createServerFn_handler = createServerRpc({
	id: "11a2faf09d891c5b8ecf633a10be7033037d422e6801388d2c5fa61b535c0822",
	name: "citizenStats",
	filename: "src/lib/shinrai/server.ts"
}, (opts) => citizenStats.__executeServer(opts));
var citizenStats = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(citizenStats_createServerFn_handler, async ({ context }) => {
	const mine = await (await db())`select status from complaints where citizen_id = ${context.userId}`;
	const total = mine.length;
	const open = mine.filter((m) => OPEN_STATUSES.includes(m.status)).length;
	return {
		total,
		open,
		resolved: mine.filter((m) => m.status === "resolved").length,
		pending: open
	};
});
//#endregion
export { analyticsBreakdown_createServerFn_handler, analyticsOverview_createServerFn_handler, analyzeCctv_createServerFn_handler, analyzeComplaint_createServerFn_handler, bootstrapMe_createServerFn_handler, citizenStats_createServerFn_handler, createComplaint_createServerFn_handler, getComplaint_createServerFn_handler, getPublicPins_createServerFn_handler, listAdminComplaints_createServerFn_handler, listDepartments_createServerFn_handler, listIncidents_createServerFn_handler, listMyComplaints_createServerFn_handler, listNotifications_createServerFn_handler, listOfficerQueue_createServerFn_handler, listOfficers_createServerFn_handler, markNotificationRead_createServerFn_handler, patchComplaint_createServerFn_handler, upvoteComplaint_createServerFn_handler };
