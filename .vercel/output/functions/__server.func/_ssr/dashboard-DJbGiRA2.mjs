import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { S as require_jsx_runtime, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { g as CircleCheck, m as ClipboardList, n as TriangleAlert, r as Timer } from "../_libs/lucide-react.mjs";
import { h as listOfficerQueue } from "./server-DLee3XgE.mjs";
import { n as CardContent, t as Card } from "./card-jn0sOOOg.mjs";
import { n as UrgencyBadge, t as StatusBadge } from "./status-badge-Cr-9tieS.mjs";
import { t as formatDistanceToNow } from "../_libs/date-fns.mjs";
import { t as StatCard } from "./stat-card-XgEGdzxG.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard-DJbGiRA2.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function OfficerDashboard() {
	const [rows, setRows] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		listOfficerQueue().then(setRows).catch(() => setRows([]));
	}, []);
	const stats = (0, import_react.useMemo)(() => {
		const list = rows ?? [];
		return {
			assigned: list.filter((c) => c.status === "assigned" || c.status === "ai_analyzed").length,
			progress: list.filter((c) => ["officer_accepted", "in_progress"].includes(c.status)).length,
			verify: list.filter((c) => c.status === "verification_pending" || c.status === "resolution_submitted").length,
			breached: list.filter((c) => c.slaBreached).length
		};
	}, [rows]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl font-semibold",
				children: "Field queue"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted",
				children: "Accept, work, and submit verified evidence. Closure is admin-only."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Assigned",
						value: stats.assigned,
						icon: ClipboardList
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "In progress",
						value: stats.progress,
						icon: Timer
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Awaiting verify",
						value: stats.verify,
						icon: CircleCheck,
						tone: "ok"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "SLA breached",
						value: stats.breached,
						icon: TriangleAlert,
						tone: "high"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3",
				children: [
					rows === null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-faint",
						children: "Loading queue…"
					}),
					rows && rows.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
						className: "py-10 text-center text-sm text-muted",
						children: "No tasks in your queue."
					}) }),
					rows?.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/officer/complaints/$id",
						params: { id: c.id },
						className: "block",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
							className: "flex flex-wrap items-center justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-mono text-xs text-muted",
									children: c.id
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-medium",
									children: c.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-sm text-muted",
									children: c.address
								})
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UrgencyBadge, { level: c.urgencyLevel }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: c.status }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `text-xs ${c.slaBreached ? "text-accent" : "text-muted"}`,
										children: c.slaDeadline ? c.slaBreached ? "SLA breached" : `SLA ${formatDistanceToNow(new Date(c.slaDeadline))}` : ""
									})
								]
							})]
						}) })
					}, c.id))
				]
			})
		]
	});
}
//#endregion
export { OfficerDashboard as component };
