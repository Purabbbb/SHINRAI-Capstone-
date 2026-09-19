import { S as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as cn } from "./server-DLee3XgE.mjs";
import { l as STATUS_LABEL } from "./constants-BTtElcUP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/status-badge-Cr-9tieS.js
var import_jsx_runtime = require_jsx_runtime();
function Badge({ className, tone = "neutral", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium", {
			neutral: "bg-surface-2 text-muted border-border",
			high: "bg-accent/15 text-accent border-accent/30",
			medium: "bg-warn/15 text-warn border-warn/30",
			low: "bg-success/15 text-success border-success/30",
			success: "bg-success/15 text-success border-success/30",
			warn: "bg-warn/15 text-warn border-warn/30",
			info: "bg-primary/15 text-primary border-primary/30"
		}[tone], className),
		...props
	});
}
function StatusBadge({ status }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		tone: status === "resolved" ? "success" : status === "verification_pending" || status === "resolution_submitted" ? "info" : status === "rejected" ? "high" : "neutral",
		children: STATUS_LABEL[status]
	});
}
function UrgencyBadge({ level }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		tone: level === "HIGH" ? "high" : level === "MEDIUM" ? "medium" : "low",
		children: level
	});
}
//#endregion
export { UrgencyBadge as n, StatusBadge as t };
