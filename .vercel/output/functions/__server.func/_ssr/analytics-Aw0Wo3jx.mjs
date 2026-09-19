import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { S as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as analyticsOverview, t as analyticsBreakdown } from "./server-DLee3XgE.mjs";
import { i as CardTitle, n as CardContent, r as CardHeader, t as Card } from "./card-jn0sOOOg.mjs";
import { t as IssueMap } from "./issue-map-5F0bVdqw.mjs";
import { a as XAxis, c as Bar, d as ResponsiveContainer, f as Tooltip, i as YAxis, o as Area, r as BarChart, s as CartesianGrid, t as AreaChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/analytics-Aw0Wo3jx.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AnalyticsPage() {
	const [days, setDays] = (0, import_react.useState)(90);
	const [ov, setOv] = (0, import_react.useState)(null);
	const [trends, setTrends] = (0, import_react.useState)([]);
	const [dept, setDept] = (0, import_react.useState)([]);
	const [status, setStatus] = (0, import_react.useState)([]);
	const [heat, setHeat] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		analyticsOverview().then(setOv).catch(() => void 0);
		analyticsBreakdown({ data: { days } }).then((b) => {
			setTrends(b.trends);
			setDept(b.byDepartment);
			setStatus(b.byStatus);
			setHeat(b.heatmap.map((h, i) => ({
				id: `h-${i}`,
				title: h.category,
				category: h.category,
				urgencyLevel: "MEDIUM",
				status: "submitted",
				lat: Number(h.lat),
				lng: Number(h.lng),
				departmentId: null,
				duplicateCount: Number(h.weight)
			})));
		}).catch(() => void 0);
	}, [days]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-end justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-3xl font-semibold",
					children: "Analytics"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted",
					children: "Charts use stored complaints — they do not randomize on refresh."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					className: "h-9 rounded-md border border-border bg-bg px-2 text-sm",
					value: days,
					onChange: (e) => setDays(Number(e.target.value)),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: 7,
							children: "Last 7 days"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: 30,
							children: "Last 30 days"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: 90,
							children: "Last 90 days"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: 365,
							children: "All demo data"
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
						label: "Volume",
						value: ov?.total ?? "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
						label: "SLA compliance",
						value: ov ? `${ov.slaCompliance}%` : "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
						label: "Avg hours to close",
						value: ov?.avgResolutionHours ?? "—"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Complaint trend" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
				className: "h-72",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
					width: "100%",
					height: "100%",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
						data: trends,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
								stroke: "#2a2940",
								vertical: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
								dataKey: "day",
								tick: {
									fill: "#9b97ad",
									fontSize: 11
								}
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
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
								dataKey: "count",
								stroke: "#8b7cff",
								fill: "#8b7cff33"
							})
						]
					})
				})
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Department workload" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
					className: "h-72",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: "100%",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
							data: dept,
							layout: "vertical",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
									stroke: "#2a2940",
									horizontal: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
									type: "number",
									tick: {
										fill: "#9b97ad",
										fontSize: 11
									}
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
									type: "category",
									dataKey: "name",
									width: 140,
									tick: {
										fill: "#9b97ad",
										fontSize: 11
									}
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
									background: "#12121c",
									border: "1px solid #2a2940"
								} }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
									dataKey: "value",
									fill: "#ff5a8a",
									radius: [
										0,
										6,
										6,
										0
									]
								})
							]
						})
					})
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Resolution status" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
					className: "h-72",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: "100%",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
							data: status,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
									stroke: "#2a2940",
									vertical: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
									dataKey: "name",
									tick: {
										fill: "#9b97ad",
										fontSize: 10
									},
									interval: 0,
									angle: -25,
									height: 70
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
									fill: "#34d399",
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
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mb-3 font-display text-xl",
				children: "Recurring issue zones"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IssueMap, {
				pins: heat,
				height: 380,
				heat: true
			})] })
		]
	});
}
function Metric({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "text-sm text-muted",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mt-1 font-display text-2xl tabular-nums",
		children: value
	})] }) });
}
//#endregion
export { AnalyticsPage as component };
