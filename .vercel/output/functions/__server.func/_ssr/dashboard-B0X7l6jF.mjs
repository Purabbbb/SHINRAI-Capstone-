import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { S as require_jsx_runtime, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Shield, f as Inbox, g as CircleCheck, i as Siren, n as TriangleAlert, p as Clock } from "../_libs/lucide-react.mjs";
import { n as analyticsOverview, t as analyticsBreakdown } from "./server-DLee3XgE.mjs";
import { i as CardTitle, n as CardContent, r as CardHeader, t as Card } from "./card-jn0sOOOg.mjs";
import { a as XAxis, c as Bar, d as ResponsiveContainer, f as Tooltip, i as YAxis, l as Pie, n as PieChart, r as BarChart, s as CartesianGrid, u as Cell } from "../_libs/recharts+[...].mjs";
import { t as StatCard } from "./stat-card-XgEGdzxG.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard-B0X7l6jF.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var COLORS = [
	"#8b7cff",
	"#ff5a8a",
	"#34d399",
	"#fbbf24",
	"#38bdf8",
	"#fb923c",
	"#2dd4bf",
	"#9b97ad"
];
function AdminDashboard() {
	const [ov, setOv] = (0, import_react.useState)(null);
	const [cats, setCats] = (0, import_react.useState)([]);
	const [urg, setUrg] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		analyticsOverview().then(setOv).catch(() => void 0);
		analyticsBreakdown({ data: { days: 90 } }).then((b) => {
			setCats(b.byCategory);
			setUrg(b.byUrgency);
		}).catch(() => void 0);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl font-semibold",
				children: "Governance overview"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted",
				children: "Seeded Faridabad demo data plus any live reports from this session."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Total complaints",
						value: ov?.total ?? "—",
						icon: Inbox
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Open",
						value: ov?.open ?? "—",
						icon: Clock
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Resolved",
						value: ov?.resolved ?? "—",
						icon: CircleCheck,
						tone: "ok"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "High priority",
						value: ov?.highPriority ?? "—",
						icon: Siren,
						tone: "high"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Avg resolution (hrs)",
						value: ov?.avgResolutionHours ?? "—",
						icon: Clock
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "SLA compliance",
						value: ov ? `${ov.slaCompliance}%` : "—",
						hint: `${ov?.slaBreached ?? 0} currently breached`,
						icon: Shield
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Complaints by category" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
					className: "h-72",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: "100%",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
							data: cats,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
									stroke: "#2a2940",
									vertical: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
									dataKey: "name",
									tick: {
										fill: "#9b97ad",
										fontSize: 11
									},
									interval: 0,
									angle: -20,
									height: 60
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
									tick: {
										fill: "#9b97ad",
										fontSize: 11
									},
									allowDecimals: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
									background: "#12121c",
									border: "1px solid #2a2940"
								} }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
									dataKey: "value",
									fill: "#8b7cff",
									radius: [
										6,
										6,
										0,
										0
									]
								})
							]
						})
					})
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Urgency distribution" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
					className: "h-72",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: "100%",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, {
							data: urg,
							dataKey: "value",
							nameKey: "name",
							innerRadius: 50,
							outerRadius: 80,
							paddingAngle: 4,
							children: urg.map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: COLORS[i % COLORS.length] }, i))
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
							background: "#12121c",
							border: "1px solid #2a2940"
						} })] })
					})
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						className: "rounded-md border border-border px-3 py-2",
						to: "/admin/complaints",
						children: "Open complaint queue"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						className: "rounded-md border border-border px-3 py-2",
						to: "/admin/map",
						children: "Issue map"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						className: "rounded-md border border-border px-3 py-2",
						to: "/admin/cctv",
						children: "CCTV prototype"
					}),
					ov && ov.slaBreached > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex items-center gap-1 rounded-md border border-accent/30 px-3 py-2 text-accent",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "size-4" }),
							" ",
							ov.slaBreached,
							" SLA breaches"
						]
					})
				]
			})
		]
	});
}
//#endregion
export { AdminDashboard as component };
