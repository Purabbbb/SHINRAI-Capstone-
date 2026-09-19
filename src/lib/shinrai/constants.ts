import type { Category, ComplaintStatus, Role, UrgencyLevel } from "./types";

export const APP_NAME = "Shinrai";
export const TAGLINE = "From Concern to Completion";
export const SUBTITLE = "Report civic issues. Track progress. Build better communities.";

export const CATEGORIES: Category[] = [
  "Pothole",
  "Damaged Road",
  "Garbage",
  "Water Leakage",
  "Broken Streetlight",
  "Drainage",
  "Traffic Obstruction",
  "Accident",
  "Other",
];

export const DEPARTMENTS: { id: string; name: string; description: string }[] = [
  { id: "roads", name: "Roads & Infrastructure", description: "Potholes, damaged roads, street furniture" },
  { id: "sanitation", name: "Sanitation", description: "Garbage, dumping, overflowing bins" },
  { id: "water", name: "Water Department", description: "Leaks, supply, pipeline faults" },
  { id: "electricity", name: "Electricity", description: "Streetlights and electrical hazards" },
  { id: "public-works", name: "Public Works", description: "Drainage, waterlogging, civic works" },
  { id: "traffic", name: "Traffic", description: "Obstructions, signals, congestion" },
  { id: "emergency", name: "Emergency / Traffic", description: "Accidents and rapid-response incidents" },
];

export const CATEGORY_TO_DEPARTMENT: Record<Category, string> = {
  Pothole: "roads",
  "Damaged Road": "roads",
  Garbage: "sanitation",
  "Water Leakage": "water",
  "Broken Streetlight": "electricity",
  Drainage: "public-works",
  "Traffic Obstruction": "traffic",
  Accident: "emergency",
  Other: "public-works",
};

export const SLA_HOURS: Record<UrgencyLevel, number> = {
  HIGH: 4,
  MEDIUM: 24,
  LOW: 72,
};

export const DUPLICATE_SIMILARITY_THRESHOLD = 0.52;
export const DUPLICATE_DISTANCE_METERS = 280;

export const FARIDABAD = { lat: 28.4089, lng: 77.3178 };

export const STATUS_LABEL: Record<ComplaintStatus, string> = {
  submitted: "Submitted",
  ai_analyzed: "AI Analyzed",
  assigned: "Assigned",
  officer_accepted: "Officer Accepted",
  in_progress: "Work In Progress",
  resolution_submitted: "Resolution Submitted",
  verification_pending: "Verification",
  resolved: "Resolved",
  rejected: "Rejected",
};

export const STATUS_ORDER: ComplaintStatus[] = [
  "submitted",
  "ai_analyzed",
  "assigned",
  "officer_accepted",
  "in_progress",
  "resolution_submitted",
  "verification_pending",
  "resolved",
];

export const OPEN_STATUSES: ComplaintStatus[] = [
  "submitted",
  "ai_analyzed",
  "assigned",
  "officer_accepted",
  "in_progress",
  "resolution_submitted",
  "verification_pending",
  "rejected",
];

export const ROLE_HOME: Record<Role, string> = {
  citizen: "/citizen/dashboard",
  officer: "/officer/dashboard",
  admin: "/admin/dashboard",
};

export const CATEGORY_COLOR: Record<Category, string> = {
  Pothole: "#8b7cff",
  "Damaged Road": "#6ea8ff",
  Garbage: "#34d399",
  "Water Leakage": "#38bdf8",
  "Broken Streetlight": "#fbbf24",
  Drainage: "#2dd4bf",
  "Traffic Obstruction": "#fb923c",
  Accident: "#ff5a8a",
  Other: "#9b97ad",
};

export const URGENCY_COLOR: Record<UrgencyLevel, string> = {
  LOW: "#34d399",
  MEDIUM: "#fbbf24",
  HIGH: "#ff5a8a",
};
