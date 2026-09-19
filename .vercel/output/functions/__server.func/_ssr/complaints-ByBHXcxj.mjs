import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { S as require_jsx_runtime, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { d as listAdminComplaints } from "./server-DLee3XgE.mjs";
import { i as DEPARTMENTS, l as STATUS_LABEL, t as CATEGORIES } from "./constants-BTtElcUP.mjs";
import { t as Card } from "./card-jn0sOOOg.mjs";
import { n as UrgencyBadge, t as StatusBadge } from "./status-badge-Cr-9tieS.mjs";
import { n as format } from "../_libs/date-fns.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/complaints-ByBHXcxj.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminQueue() {
	const [rows, setRows] = (0, import_react.useState)([]);
	const [category, setCategory] = (0, import_react.useState)("");
	const [urgency, setUrgency] = (0, import_react.useState)("");
	const [status, setStatus] = (0, import_react.useState)("");
	const [departmentId, setDepartmentId] = (0, import_react.useState)("");
	const [sort, setSort] = (0, import_react.useState)("newest");
	(0, import_react.useEffect)(() => {
		listAdminComplaints({ data: {
			category,
			urgency,
			status,
			departmentId,
			sort
		} }).then(setRows).catch(() => setRows([]));
	}, [
		category,
		urgency,
		status,
		departmentId,
		sort
	]);
	const sel = "h-9 rounded-md border border-border bg-bg px-2 text-sm";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl font-semibold",
				children: "Complaint queue"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted",
				children: "Filter, sort, and open any report."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						className: sel,
						value: category,
						onChange: (e) => setCategory(e.target.value),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: "Category"
						}), CATEGORIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: c }, c))]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						className: sel,
						value: urgency,
						onChange: (e) => setUrgency(e.target.value),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "",
								children: "Urgency"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "HIGH" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "MEDIUM" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "LOW" })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						className: sel,
						value: status,
						onChange: (e) => setStatus(e.target.value),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: "Status"
						}), Object.entries(STATUS_LABEL).map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: k,
							children: v
						}, k))]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						className: sel,
						value: departmentId,
						onChange: (e) => setDepartmentId(e.target.value),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: "Department"
						}), DEPARTMENTS.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: d.id,
							children: d.name
						}, d.id))]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						className: sel,
						value: sort,
						onChange: (e) => setSort(e.target.value),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "newest",
								children: "Newest"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "oldest",
								children: "Oldest"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "urgency",
								children: "Highest urgency"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "sla",
								children: "SLA first"
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "overflow-x-auto",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full min-w-[860px] text-left text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "text-xs uppercase tracking-wide text-faint",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: [
							"ID",
							"Issue",
							"Category",
							"Urgency",
							"Location",
							"Department",
							"Officer",
							"Status",
							"SLA",
							"Created"
						].map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-3 py-3 font-medium",
							children: h
						}, h)) })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: rows.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-t border-border hover:bg-surface-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-3 font-mono text-xs",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/admin/complaints/$id",
									params: { id: c.id },
									className: "text-primary",
									children: c.id
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-3",
								children: c.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-3",
								children: c.category
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UrgencyBadge, { level: c.urgencyLevel })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "max-w-40 truncate px-3 py-3 text-muted",
								children: c.address
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-3 text-muted",
								children: c.departmentName ?? "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-3 text-muted",
								children: c.officerName ?? "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: c.status })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: `px-3 py-3 ${c.slaBreached ? "text-accent" : "text-muted"}`,
								children: c.slaBreached ? "Breached" : "On track"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-3 font-mono text-xs text-faint",
								children: format(new Date(c.createdAt), "dd MMM")
							})
						]
					}, c.id)) })]
				}), rows.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "p-8 text-center text-sm text-muted",
					children: "No complaints found."
				})]
			})
		]
	});
}
//#endregion
export { AdminQueue as component };
