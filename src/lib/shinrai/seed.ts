import type { Sql } from "@/lib/db";
import { DEPARTMENTS, SLA_HOURS } from "./constants";
import type { Category, ComplaintStatus, UrgencyLevel } from "./types";

type SeedComplaint = {
  id: string;
  citizen: string;
  title: string;
  description: string;
  category: Category;
  score: number;
  level: UrgencyLevel;
  dept: string;
  officer: string | null;
  status: ComplaintStatus;
  lat: number;
  lng: number;
  address: string;
  hoursAgo: number;
  dup?: number;
  parent?: string;
  breached?: boolean;
  resolvedHoursAgo?: number;
};

const OFFICERS = [
  { id: "off-1", name: "Asha Mehra", department_id: "roads" },
  { id: "off-2", name: "Ravi Chauhan", department_id: "sanitation" },
  { id: "off-3", name: "Neha Kapoor", department_id: "water" },
  { id: "off-4", name: "Imran Qureshi", department_id: "electricity" },
  { id: "off-5", name: "Sanjay Yadav", department_id: "emergency" },
];

const C: SeedComplaint[] = [
  { id: "SHN-1001", citizen: "seed-c1", title: "Deep pothole on Mathura Road", description: "Large pothole near the flyover is damaging vehicles and is unsafe at night.", category: "Pothole", score: 0.81, level: "HIGH", dept: "roads", officer: "off-1", status: "in_progress", lat: 28.4089, lng: 77.3178, address: "Mathura Road, Sector 21, Faridabad", hoursAgo: 10, dup: 4 },
  { id: "SHN-1002", citizen: "seed-c2", title: "Same crater on Mathura Road", description: "Huge pothole on Mathura Road in front of the metro feeder stop.", category: "Pothole", score: 0.79, level: "HIGH", dept: "roads", officer: "off-1", status: "assigned", lat: 28.4092, lng: 77.3181, address: "Mathura Road, Sector 21, Faridabad", hoursAgo: 8, parent: "SHN-1001", dup: 1 },
  { id: "SHN-1003", citizen: "seed-c3", title: "Overflowing garbage near Sector 15 market", description: "Garbage overflowing near the vegetable market. Smell is affecting shops.", category: "Garbage", score: 0.62, level: "MEDIUM", dept: "sanitation", officer: "off-2", status: "officer_accepted", lat: 28.3954, lng: 77.313, address: "Sector 15 Market, Faridabad", hoursAgo: 18, dup: 3 },
  { id: "SHN-1004", citizen: "seed-c4", title: "Water pipe leaking on Drain No. 2 road", description: "Water pipe is leaking continuously and flooding the footpath.", category: "Water Leakage", score: 0.74, level: "HIGH", dept: "water", officer: "off-3", status: "assigned", lat: 28.4011, lng: 77.3072, address: "Drain No. 2 Road, Faridabad", hoursAgo: 6 },
  { id: "SHN-1005", citizen: "seed-c5", title: "Street light not working in Sector 37", description: "Street light not working near the park. Road is completely dark after 8pm.", category: "Broken Streetlight", score: 0.71, level: "HIGH", dept: "electricity", officer: "off-4", status: "in_progress", lat: 28.3775, lng: 77.3158, address: "Sector 37, Faridabad", hoursAgo: 30, breached: true },
  { id: "SHN-1006", citizen: "seed-c1", title: "Waterlogging after rain at Badkhal", description: "Poor drainage caused severe waterlogging near Badkhal crossing.", category: "Drainage", score: 0.77, level: "HIGH", dept: "public-works", officer: "off-1", status: "verification_pending", lat: 28.425, lng: 77.306, address: "Badkhal Crossing, Faridabad", hoursAgo: 40 },
  { id: "SHN-1007", citizen: "seed-c6", title: "Two-wheeler accident near Sector 21", description: "Accident on the service lane. Vehicles stalled, injured rider waiting for help.", category: "Accident", score: 0.91, level: "HIGH", dept: "emergency", officer: "off-5", status: "officer_accepted", lat: 28.4212, lng: 77.3098, address: "Sector 21, Faridabad", hoursAgo: 3 },
  { id: "SHN-1008", citizen: "seed-c7", title: "Broken road stretch in Ballabgarh", description: "Damaged road with open edges after last repair. Two-wheelers are skidding.", category: "Damaged Road", score: 0.66, level: "MEDIUM", dept: "roads", officer: "off-1", status: "assigned", lat: 28.341, lng: 77.325, address: "Main Market Road, Ballabgarh", hoursAgo: 22 },
  { id: "SHN-1009", citizen: "seed-c8", title: "Illegal parking blocking NH feeder", description: "Traffic obstruction from illegally parked trucks near the industrial gate.", category: "Traffic Obstruction", score: 0.69, level: "MEDIUM", dept: "traffic", officer: "off-5", status: "ai_analyzed", lat: 28.392, lng: 77.348, address: "Industrial Area, Faridabad", hoursAgo: 5 },
  { id: "SHN-1010", citizen: "seed-c2", title: "Garbage dump behind NIT hostel", description: "Open garbage accumulation behind the hostel wall for over a week.", category: "Garbage", score: 0.48, level: "MEDIUM", dept: "sanitation", officer: "off-2", status: "resolved", lat: 28.472, lng: 77.316, address: "NIT Faridabad", hoursAgo: 90, resolvedHoursAgo: 12 },
  { id: "SHN-1011", citizen: "seed-c9", title: "Potholes along Surajkund road", description: "Cluster of medium potholes after Surajkund turning.", category: "Pothole", score: 0.58, level: "MEDIUM", dept: "roads", officer: "off-1", status: "in_progress", lat: 28.481, lng: 77.284, address: "Surajkund Road, Faridabad", hoursAgo: 16 },
  { id: "SHN-1012", citizen: "seed-c3", title: "Burst pipeline in Old Faridabad", description: "Water leakage from a burst municipal pipe. Immediate repair needed.", category: "Water Leakage", score: 0.83, level: "HIGH", dept: "water", officer: "off-3", status: "in_progress", lat: 28.392, lng: 77.305, address: "Old Faridabad Bazaar", hoursAgo: 7 },
  { id: "SHN-1013", citizen: "seed-c4", title: "Clogged drain in Greater Faridabad", description: "Drainage blocked with plastic waste. Water stagnant outside houses.", category: "Drainage", score: 0.61, level: "MEDIUM", dept: "public-works", officer: null, status: "ai_analyzed", lat: 28.408, lng: 77.35, address: "Greater Faridabad, Sector 86", hoursAgo: 12 },
  { id: "SHN-1014", citizen: "seed-c5", title: "Dark stretch near Badarpur border", description: "Broken streetlights on the approach road. Unsafe for pedestrians at night.", category: "Broken Streetlight", score: 0.72, level: "HIGH", dept: "electricity", officer: "off-4", status: "assigned", lat: 28.493, lng: 77.303, address: "Badarpur Border approach", hoursAgo: 9 },
  { id: "SHN-1015", citizen: "seed-c6", title: "Minor pothole near city park", description: "Small pothole forming after rain. Not urgent yet.", category: "Pothole", score: 0.32, level: "LOW", dept: "roads", officer: null, status: "submitted", lat: 28.411, lng: 77.301, address: "City Park, Sector 16, Faridabad", hoursAgo: 4 },
  { id: "SHN-1016", citizen: "seed-c7", title: "Overflowing bins at bus stand", description: "Garbage overflowing at the ISBT-side bus stand. Stray animals around.", category: "Garbage", score: 0.57, level: "MEDIUM", dept: "sanitation", officer: "off-2", status: "assigned", lat: 28.3945, lng: 77.291, address: "Ballabgarh Bus Stand", hoursAgo: 20 },
  { id: "SHN-1017", citizen: "seed-c8", title: "Cracked carriageway on Bypass", description: "Damaged road with longitudinal cracks after heavy trucks.", category: "Damaged Road", score: 0.64, level: "MEDIUM", dept: "roads", officer: "off-1", status: "officer_accepted", lat: 28.418, lng: 77.332, address: "Faridabad Bypass", hoursAgo: 28, breached: true },
  { id: "SHN-1018", citizen: "seed-c9", title: "Waterlogging outside school gate", description: "Drainage failure outside a school. Children walking through stagnant water.", category: "Drainage", score: 0.8, level: "HIGH", dept: "public-works", officer: "off-1", status: "assigned", lat: 28.402, lng: 77.322, address: "Sector 19 School Road, Faridabad", hoursAgo: 11 },
  { id: "SHN-1019", citizen: "seed-c1", title: "Fallen tree blocking inner road", description: "Traffic obstruction from a fallen tree after last night's wind.", category: "Traffic Obstruction", score: 0.73, level: "HIGH", dept: "traffic", officer: "off-5", status: "in_progress", lat: 28.387, lng: 77.319, address: "Sector 28 inner road, Faridabad", hoursAgo: 14 },
  { id: "SHN-1020", citizen: "seed-c2", title: "Leaking valve near housing society", description: "Water pipe leaking beside the society wall. Wasting supply.", category: "Water Leakage", score: 0.49, level: "MEDIUM", dept: "water", officer: "off-3", status: "resolved", lat: 28.416, lng: 77.298, address: "Sector 46, Faridabad", hoursAgo: 80, resolvedHoursAgo: 20 },
  { id: "SHN-1021", citizen: "seed-c3", title: "Pothole cluster in Sector 86", description: "Several potholes in a 100m stretch after monsoon.", category: "Pothole", score: 0.6, level: "MEDIUM", dept: "roads", officer: "off-1", status: "ai_analyzed", lat: 28.406, lng: 77.355, address: "Sector 86, Greater Faridabad", hoursAgo: 15, dup: 2 },
  { id: "SHN-1022", citizen: "seed-c4", title: "Another pothole in Sector 86", description: "Large pothole on the same Greater Faridabad stretch.", category: "Pothole", score: 0.63, level: "MEDIUM", dept: "roads", officer: "off-1", status: "assigned", lat: 28.4064, lng: 77.3554, address: "Sector 86, Greater Faridabad", hoursAgo: 13, parent: "SHN-1021" },
  { id: "SHN-1023", citizen: "seed-c5", title: "Dumping near canal road", description: "Garbage dumped along the canal. Needs sanitation pickup.", category: "Garbage", score: 0.41, level: "MEDIUM", dept: "sanitation", officer: "off-2", status: "submitted", lat: 28.43, lng: 77.325, address: "Agra Canal Road, Faridabad", hoursAgo: 2 },
  { id: "SHN-1024", citizen: "seed-c6", title: "Open manhole after drain work", description: "Drainage work left an open manhole. Safety hazard for two-wheelers.", category: "Drainage", score: 0.86, level: "HIGH", dept: "public-works", officer: "off-1", status: "in_progress", lat: 28.399, lng: 77.311, address: "Sector 14, Faridabad", hoursAgo: 9 },
  { id: "SHN-1025", citizen: "seed-c7", title: "Flickering streetlight in Sector 16", description: "Street light flickering and going dark every few minutes.", category: "Broken Streetlight", score: 0.46, level: "MEDIUM", dept: "electricity", officer: "off-4", status: "resolved", lat: 28.41, lng: 77.3, address: "Sector 16, Faridabad", hoursAgo: 70, resolvedHoursAgo: 8 },
  { id: "SHN-1026", citizen: "seed-c8", title: "Car collision at Bata Chowk", description: "Road accident at Bata Chowk. Two cars, traffic backed up.", category: "Accident", score: 0.88, level: "HIGH", dept: "emergency", officer: "off-5", status: "verification_pending", lat: 28.388, lng: 77.3105, address: "Bata Chowk, Faridabad", hoursAgo: 26, breached: true },
  { id: "SHN-1027", citizen: "seed-c9", title: "Encroachment narrowing service lane", description: "Temporary stalls causing traffic obstruction on the service lane.", category: "Traffic Obstruction", score: 0.44, level: "MEDIUM", dept: "traffic", officer: null, status: "ai_analyzed", lat: 28.404, lng: 77.314, address: "NH-19 service lane, Faridabad", hoursAgo: 19 },
  { id: "SHN-1028", citizen: "seed-c1", title: "Sinking road patch in NIT area", description: "Damaged road patch sinking after tanker movement.", category: "Damaged Road", score: 0.55, level: "MEDIUM", dept: "roads", officer: "off-1", status: "assigned", lat: 28.469, lng: 77.312, address: "NIT Main Gate Road, Faridabad", hoursAgo: 33, breached: true },
  { id: "SHN-1029", citizen: "seed-c2", title: "Leak beside community tap", description: "Water leakage from a community tap that never fully closes.", category: "Water Leakage", score: 0.36, level: "LOW", dept: "water", officer: "off-3", status: "officer_accepted", lat: 28.373, lng: 77.308, address: "Sector 31, Faridabad", hoursAgo: 21 },
  { id: "SHN-1030", citizen: "seed-c3", title: "Pothole outside metro feeder stop", description: "Pothole right where autos queue. Vehicles drop into it.", category: "Pothole", score: 0.7, level: "HIGH", dept: "roads", officer: "off-1", status: "resolution_submitted", lat: 28.413, lng: 77.321, address: "Violet Line feeder, Faridabad", hoursAgo: 48 },
  { id: "SHN-1031", citizen: "seed-c4", title: "Waste burning near godown", description: "Garbage being burnt near a warehouse. Smoke affecting nearby homes.", category: "Garbage", score: 0.67, level: "MEDIUM", dept: "sanitation", officer: "off-2", status: "in_progress", lat: 28.36, lng: 77.33, address: "Industrial godown road, Faridabad", hoursAgo: 17 },
  { id: "SHN-1032", citizen: "seed-c5", title: "Damaged speed breaker approach", description: "Damaged road just before a speed breaker causing bike skids.", category: "Damaged Road", score: 0.5, level: "MEDIUM", dept: "roads", officer: "off-1", status: "resolved", lat: 28.42, lng: 77.29, address: "Sector 21-A, Faridabad", hoursAgo: 100, resolvedHoursAgo: 30 },
];

function hoursAgoIso(h: number) {
  return new Date(Date.now() - h * 3600 * 1000).toISOString();
}

function slaFor(level: UrgencyLevel, created: string) {
  return new Date(new Date(created).getTime() + SLA_HOURS[level] * 3600 * 1000).toISOString();
}

function svgThumb(label: string, color: string) {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='640' height='400'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop stop-color='${color}'/><stop offset='1' stop-color='#12121c'/></linearGradient></defs><rect width='640' height='400' fill='url(#g)'/><text x='40' y='210' fill='white' font-size='28' font-family='sans-serif'>${label}</text><text x='40' y='250' fill='rgba(255,255,255,.7)' font-size='16' font-family='sans-serif'>Prototype evidence still</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const globalRef = globalThis as typeof globalThis & { __shinraiSeed__?: Promise<void> };

export async function ensureSeeded(sql: Sql): Promise<void> {
  globalRef.__shinraiSeed__ ??= (async () => {
    const existing = await sql<{ n: number }>`select count(*)::int as n from departments`;
    if ((existing[0]?.n ?? 0) > 0) return;

    for (const d of DEPARTMENTS) {
      await sql`insert into departments (id, name, description) values (${d.id}, ${d.name}, ${d.description})`;
    }
    for (const [level, hours] of Object.entries(SLA_HOURS)) {
      await sql`insert into sla_rules (urgency_level, hours) values (${level}, ${hours})`;
    }
    for (const o of OFFICERS) {
      await sql`insert into officers (id, name, department_id, status) values (${o.id}, ${o.name}, ${o.department_id}, ${"available"})`;
    }

    for (const c of C) {
      const created = hoursAgoIso(c.hoursAgo);
      const resolved = c.resolvedHoursAgo != null ? hoursAgoIso(c.resolvedHoursAgo) : null;
      const sla = slaFor(c.level, created);
      const media = JSON.stringify([
        { type: "image", url: svgThumb(c.category, c.level === "HIGH" ? "#ff5a8a" : "#8b7cff"), name: "evidence.svg" },
      ]);
      const analysis = JSON.stringify({
        issueType: c.category,
        confidence: 0.78,
        urgencyScore: c.score,
        priority: c.level,
        departmentId: c.dept,
        departmentName: DEPARTMENTS.find((d) => d.id === c.dept)?.name ?? c.dept,
        similarReports: c.dup ?? 0,
        source: "prototype",
        rationale: "Seeded prototype classification for demonstration.",
      });
      const before = c.status === "resolved" || c.status === "verification_pending" || c.status === "resolution_submitted"
        ? svgThumb("BEFORE", "#6e6a80")
        : null;
      const after = c.status === "resolved" || c.status === "verification_pending" || c.status === "resolution_submitted"
        ? svgThumb("AFTER", "#34d399")
        : null;
      const notes = after ? "Patch completed. Surface leveled and debris cleared." : null;
      await sql.query(
        `insert into complaints (
          id, citizen_id, title, description, category, urgency_score, urgency_level,
          department_id, officer_id, status, lat, lng, address, media, ai_analysis,
          parent_complaint_id, duplicate_count, sla_deadline, sla_breached,
          before_image, after_image, resolution_notes, resolution_submitted_at,
          created_at, updated_at, resolved_at
        ) values (
          $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14::jsonb,$15::jsonb,
          $16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26
        )`,
        [
          c.id, c.citizen, c.title, c.description, c.category, c.score, c.level,
          c.dept, c.officer, c.status, c.lat, c.lng, c.address, media, analysis,
          c.parent ?? null, c.dup ?? 1, sla, Boolean(c.breached),
          before, after, notes,
          after ? hoursAgoIso(Math.max(1, c.hoursAgo - 2)) : null,
          created, created, resolved,
        ],
      );

      const events: { type: string; msg: string; ago: number }[] = [
        { type: "submitted", msg: "Complaint submitted by citizen.", ago: c.hoursAgo },
        { type: "ai_analyzed", msg: `Prototype AI classified as ${c.category} (${c.level}).`, ago: c.hoursAgo - 0.05 },
      ];
      if (["assigned", "officer_accepted", "in_progress", "resolution_submitted", "verification_pending", "resolved"].includes(c.status)) {
        events.push({ type: "assigned", msg: `Routed to ${DEPARTMENTS.find((d) => d.id === c.dept)?.name}.`, ago: c.hoursAgo - 0.2 });
      }
      if (["officer_accepted", "in_progress", "resolution_submitted", "verification_pending", "resolved"].includes(c.status)) {
        events.push({ type: "officer_accepted", msg: "Field officer accepted the task.", ago: Math.max(1, c.hoursAgo - 1) });
      }
      if (["in_progress", "resolution_submitted", "verification_pending", "resolved"].includes(c.status)) {
        events.push({ type: "in_progress", msg: "Work started on site.", ago: Math.max(1, c.hoursAgo - 2) });
      }
      if (["resolution_submitted", "verification_pending", "resolved"].includes(c.status)) {
        events.push({ type: "resolution_submitted", msg: "Before/after evidence submitted for verification.", ago: Math.max(1, c.hoursAgo - 3) });
      }
      if (c.status === "resolved") {
        events.push({ type: "resolved", msg: "Admin verified resolution. Complaint closed.", ago: c.resolvedHoursAgo ?? 1 });
      }
      for (const e of events) {
        await sql.query(
          `insert into complaint_events (complaint_id, event_type, message, actor_id, created_at) values ($1,$2,$3,$4,$5)`,
          [c.id, e.type, e.msg, "system", hoursAgoIso(Math.max(0.01, e.ago))],
        );
      }
    }

    await sql`insert into notifications (user_id, audience, title, body, complaint_id)
      values (${null}, ${"admins"}, ${"SLA breach"}, ${"Complaint SHN-1005 has breached its SLA deadline."}, ${"SHN-1005"})`;
    await sql`insert into notifications (user_id, audience, title, body, complaint_id)
      values (${null}, ${"admins"}, ${"High-priority accident"}, ${"Accident reported near Sector 21. Emergency routing active."}, ${"SHN-1007"})`;
    await sql`insert into notifications (user_id, audience, title, body, complaint_id)
      values (${null}, ${"officers"}, ${"New assignment"}, ${"Pothole SHN-1001 assigned to Roads & Infrastructure."}, ${"SHN-1001"})`;

    await sql`insert into accident_incidents (camera_id, location_label, lat, lng, detection, confidence, alert_status, prototype, notes)
      values (${"CAM-21A"}, ${"Sector 21, Faridabad"}, ${28.4212}, ${77.3098}, ${"ACCIDENT DETECTED"}, ${0.89}, ${"open"}, ${true}, ${"Prototype detection from demo seed. Not live CCTV."})`;
  })().catch((err) => {
    globalRef.__shinraiSeed__ = undefined;
    throw err;
  });
  return globalRef.__shinraiSeed__;
}

export async function nextComplaintId(sql: Sql): Promise<string> {
  const rows = await sql<{ id: string }>`select id from complaints order by id desc limit 1`;
  const last = rows[0]?.id ?? "SHN-1000";
  const n = Number(last.replace("SHN-", "")) + 1;
  return `SHN-${String(n).padStart(4, "0")}`;
}
