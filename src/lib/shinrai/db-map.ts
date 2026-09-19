import type {
  AiAnalysis,
  Category,
  Complaint,
  ComplaintEvent,
  ComplaintStatus,
  MediaItem,
  UrgencyLevel,
} from "./types";

export type ComplaintRow = {
  id: string;
  citizen_id: string;
  title: string;
  description: string;
  category: string;
  urgency_score: number;
  urgency_level: string;
  department_id: string | null;
  department_name: string | null;
  officer_id: string | null;
  officer_name: string | null;
  status: string;
  lat: number;
  lng: number;
  address: string;
  media: MediaItem[] | string;
  ai_analysis: AiAnalysis | string | null;
  parent_complaint_id: string | null;
  duplicate_count: number;
  sla_deadline: string | Date | null;
  sla_breached: boolean;
  before_image: string | null;
  after_image: string | null;
  resolution_notes: string | null;
  resolution_submitted_at: string | Date | null;
  created_at: string | Date;
  updated_at: string | Date;
  resolved_at: string | Date | null;
};

function asIso(v: string | Date | null | undefined): string | null {
  if (!v) return null;
  if (v instanceof Date) return v.toISOString();
  return v;
}

function parseJson<T>(v: T | string | null | undefined, fallback: T): T {
  if (v == null) return fallback;
  if (typeof v === "string") {
    try {
      return JSON.parse(v) as T;
    } catch {
      return fallback;
    }
  }
  return v;
}

export function mapComplaint(row: ComplaintRow): Complaint {
  const slaDeadline = asIso(row.sla_deadline);
  const slaBreached =
    row.sla_breached ||
    (!!slaDeadline &&
      new Date(slaDeadline).getTime() < Date.now() &&
      row.status !== "resolved");
  return {
    id: row.id,
    citizenId: row.citizen_id,
    title: row.title,
    description: row.description,
    category: row.category as Category,
    urgencyScore: Number(row.urgency_score),
    urgencyLevel: row.urgency_level as UrgencyLevel,
    departmentId: row.department_id,
    departmentName: row.department_name,
    officerId: row.officer_id,
    officerName: row.officer_name,
    status: row.status as ComplaintStatus,
    lat: Number(row.lat),
    lng: Number(row.lng),
    address: row.address,
    media: parseJson<MediaItem[]>(row.media, []),
    aiAnalysis: parseJson<AiAnalysis | null>(row.ai_analysis, null),
    parentComplaintId: row.parent_complaint_id,
    duplicateCount: Number(row.duplicate_count ?? 1),
    slaDeadline,
    slaBreached,
    beforeImage: row.before_image,
    afterImage: row.after_image,
    resolutionNotes: row.resolution_notes,
    resolutionSubmittedAt: asIso(row.resolution_submitted_at),
    createdAt: asIso(row.created_at) ?? new Date().toISOString(),
    updatedAt: asIso(row.updated_at) ?? new Date().toISOString(),
    resolvedAt: asIso(row.resolved_at),
  };
}

export function mapEvent(row: {
  id: number;
  complaint_id: string;
  event_type: string;
  message: string;
  actor_id: string | null;
  created_at: string | Date;
}): ComplaintEvent {
  return {
    id: row.id,
    complaintId: row.complaint_id,
    eventType: row.event_type,
    message: row.message,
    actorId: row.actor_id,
    createdAt: asIso(row.created_at) ?? new Date().toISOString(),
  };
}

export const COMPLAINT_SELECT = `
  c.id, c.citizen_id, c.title, c.description, c.category, c.urgency_score, c.urgency_level,
  c.department_id, d.name as department_name, c.officer_id, o.name as officer_name,
  c.status, c.lat, c.lng, c.address, c.media, c.ai_analysis, c.parent_complaint_id,
  c.duplicate_count, c.sla_deadline, c.sla_breached, c.before_image, c.after_image,
  c.resolution_notes, c.resolution_submitted_at, c.created_at, c.updated_at, c.resolved_at
`;
