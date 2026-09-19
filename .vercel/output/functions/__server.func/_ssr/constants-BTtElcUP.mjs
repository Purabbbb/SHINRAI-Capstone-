//#region node_modules/.nitro/vite/services/ssr/assets/constants-BTtElcUP.js
var TAGLINE = "From Concern to Completion";
var SUBTITLE = "Report civic issues. Track progress. Build better communities.";
var CATEGORIES = [
	"Pothole",
	"Damaged Road",
	"Garbage",
	"Water Leakage",
	"Broken Streetlight",
	"Drainage",
	"Traffic Obstruction",
	"Accident",
	"Other"
];
var DEPARTMENTS = [
	{
		id: "roads",
		name: "Roads & Infrastructure",
		description: "Potholes, damaged roads, street furniture"
	},
	{
		id: "sanitation",
		name: "Sanitation",
		description: "Garbage, dumping, overflowing bins"
	},
	{
		id: "water",
		name: "Water Department",
		description: "Leaks, supply, pipeline faults"
	},
	{
		id: "electricity",
		name: "Electricity",
		description: "Streetlights and electrical hazards"
	},
	{
		id: "public-works",
		name: "Public Works",
		description: "Drainage, waterlogging, civic works"
	},
	{
		id: "traffic",
		name: "Traffic",
		description: "Obstructions, signals, congestion"
	},
	{
		id: "emergency",
		name: "Emergency / Traffic",
		description: "Accidents and rapid-response incidents"
	}
];
var CATEGORY_TO_DEPARTMENT = {
	Pothole: "roads",
	"Damaged Road": "roads",
	Garbage: "sanitation",
	"Water Leakage": "water",
	"Broken Streetlight": "electricity",
	Drainage: "public-works",
	"Traffic Obstruction": "traffic",
	Accident: "emergency",
	Other: "public-works"
};
var SLA_HOURS = {
	HIGH: 4,
	MEDIUM: 24,
	LOW: 72
};
var FARIDABAD = {
	lat: 28.4089,
	lng: 77.3178
};
var STATUS_LABEL = {
	submitted: "Submitted",
	ai_analyzed: "AI Analyzed",
	assigned: "Assigned",
	officer_accepted: "Officer Accepted",
	in_progress: "Work In Progress",
	resolution_submitted: "Resolution Submitted",
	verification_pending: "Verification",
	resolved: "Resolved",
	rejected: "Rejected"
};
var STATUS_ORDER = [
	"submitted",
	"ai_analyzed",
	"assigned",
	"officer_accepted",
	"in_progress",
	"resolution_submitted",
	"verification_pending",
	"resolved"
];
var OPEN_STATUSES = [
	"submitted",
	"ai_analyzed",
	"assigned",
	"officer_accepted",
	"in_progress",
	"resolution_submitted",
	"verification_pending",
	"rejected"
];
var ROLE_HOME = {
	citizen: "/citizen/dashboard",
	officer: "/officer/dashboard",
	admin: "/admin/dashboard"
};
var CATEGORY_COLOR = {
	Pothole: "#8b7cff",
	"Damaged Road": "#6ea8ff",
	Garbage: "#34d399",
	"Water Leakage": "#38bdf8",
	"Broken Streetlight": "#fbbf24",
	Drainage: "#2dd4bf",
	"Traffic Obstruction": "#fb923c",
	Accident: "#ff5a8a",
	Other: "#9b97ad"
};
//#endregion
export { FARIDABAD as a, SLA_HOURS as c, SUBTITLE as d, TAGLINE as f, DEPARTMENTS as i, STATUS_LABEL as l, CATEGORY_COLOR as n, OPEN_STATUSES as o, CATEGORY_TO_DEPARTMENT as r, ROLE_HOME as s, CATEGORIES as t, STATUS_ORDER as u };
