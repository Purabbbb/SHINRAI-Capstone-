export type Role = "citizen" | "officer" | "admin";

export type ComplaintStatus =
  | "submitted"
  | "ai_analyzed"
  | "assigned"
  | "officer_accepted"
  | "in_progress"
  | "resolution_submitted"
  | "verification_pending"
  | "resolved"
  | "rejected";

export type Category =
  | "Pothole"
  | "Damaged Road"
  | "Garbage"
  | "Water Leakage"
  | "Broken Streetlight"
  | "Drainage"
  | "Traffic Obstruction"
  | "Accident"
  | "Other";

export type UrgencyLevel = "LOW" | "MEDIUM" | "HIGH";

export type MediaItem = {
  type: "image" | "video";
  url: string;
  name?: string;
};

export type AiAnalysis = {
  issueType: Category;
  confidence: number;
  urgencyScore: number;
  priority: UrgencyLevel;
  departmentId: string;
  departmentName: string;
  similarReports: number;
  source: "grok" | "prototype";
  rationale: string;
};

export type DuplicateMatch = {
  id: string;
  title: string;
  similarity: number;
  distanceMeters: number;
  status: ComplaintStatus;
  category: Category;
};

export type Complaint = {
  id: string;
  citizenId: string;
  title: string;
  description: string;
  category: Category;
  urgencyScore: number;
  urgencyLevel: UrgencyLevel;
  departmentId: string | null;
  departmentName: string | null;
  officerId: string | null;
  officerName: string | null;
  status: ComplaintStatus;
  lat: number;
  lng: number;
  address: string;
  media: MediaItem[];
  aiAnalysis: AiAnalysis | null;
  parentComplaintId: string | null;
  duplicateCount: number;
  slaDeadline: string | null;
  slaBreached: boolean;
  beforeImage: string | null;
  afterImage: string | null;
  resolutionNotes: string | null;
  resolutionSubmittedAt: string | null;
  createdAt: string;
  updatedAt: string;
  resolvedAt: string | null;
};

export type ComplaintEvent = {
  id: number;
  complaintId: string;
  eventType: string;
  message: string;
  actorId: string | null;
  createdAt: string;
};

export type NotificationItem = {
  id: number;
  title: string;
  body: string;
  isRead: boolean;
  complaintId: string | null;
  createdAt: string;
};

export type Department = { id: string; name: string; description: string };

export type Officer = {
  id: string;
  name: string;
  departmentId: string;
  departmentName: string;
  userId: string | null;
  status: string;
};

export type MapPin = {
  id: string;
  title: string;
  category: Category;
  urgencyLevel: UrgencyLevel;
  status: ComplaintStatus;
  lat: number;
  lng: number;
  departmentId: string | null;
  duplicateCount: number;
};

export type AccidentIncident = {
  id: number;
  cameraId: string;
  locationLabel: string;
  lat: number;
  lng: number;
  detection: string;
  confidence: number;
  alertStatus: string;
  prototype: boolean;
  frameData: string | null;
  notes: string | null;
  createdAt: string;
};

export type AnalyticsOverview = {
  total: number;
  open: number;
  resolved: number;
  highPriority: number;
  slaCompliance: number;
  avgResolutionHours: number | null;
  slaBreached: number;
};
