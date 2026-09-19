import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { S as require_jsx_runtime, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { g as CircleCheck, h as CircleDashed, m as ClipboardList, o as Plus } from "../_libs/lucide-react.mjs";
import { o as citizenStats, p as listMyComplaints } from "./server-DLee3XgE.mjs";
import { n as CardContent, t as Card } from "./card-jn0sOOOg.mjs";
import { t as Button } from "./button-BAZDNLjv.mjs";
import { n as UrgencyBadge, t as StatusBadge } from "./status-badge-Cr-9tieS.mjs";
import { t as StatCard } from "./stat-card-XgEGdzxG.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard-CtjxzJcV.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CitizenDashboard() {
	const [rows, setRows] = (0, import_react.useState)(null);
	const [stats, setStats] = (0, import_react.useState)({
		total: 0,
		open: 0,
		resolved: 0,
		pending: 0
	});
	(0, import_react.useEffect)(() => {
		listMyComplaints().then(setRows).catch(() => setRows([]));
		citizenStats().then(setStats).catch(() => void 0);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-end justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-3xl font-semibold",
					children: "My reports"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted",
					children: "Track every issue from concern to completion."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/citizen/report",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), " Report new issue"]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "My complaints",
						value: stats.total,
						icon: ClipboardList
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Open",
						value: stats.open,
						icon: CircleDashed
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Resolved",
						value: stats.resolved,
						icon: CircleCheck,
						tone: "ok"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Pending actions",
						value: stats.pending,
						icon: CircleDashed
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-medium text-muted",
						children: "Recent complaints"
					}),
					rows === null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-faint",
						children: "Loading…"
					}),
					rows && rows.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "py-10 text-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: "No complaints found."
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							className: "mt-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/citizen/report",
								children: "File the first report"
							})
						})]
					}) }),
					rows?.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/citizen/complaints/$id",
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
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-sm text-muted",
									children: [
										c.category,
										" · ",
										c.address
									]
								})
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UrgencyBadge, { level: c.urgencyLevel }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: c.status })]
							})]
						}) })
					}, c.id))
				]
			})
		]
	});
}
//#endregion
export { CitizenDashboard as component };
