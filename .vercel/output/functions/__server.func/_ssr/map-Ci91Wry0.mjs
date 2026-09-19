import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { S as require_jsx_runtime, b as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { u as getPublicPins } from "./server-DLee3XgE.mjs";
import { l as STATUS_LABEL, t as CATEGORIES } from "./constants-BTtElcUP.mjs";
import { n as MapFilters, t as IssueMap } from "./issue-map-5F0bVdqw.mjs";
import { t as Button } from "./button-BAZDNLjv.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/map-Ci91Wry0.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminMap() {
	const navigate = useNavigate();
	const [pins, setPins] = (0, import_react.useState)([]);
	const [category, setCategory] = (0, import_react.useState)("");
	const [urgency, setUrgency] = (0, import_react.useState)("");
	const [status, setStatus] = (0, import_react.useState)("");
	const [heat, setHeat] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		getPublicPins().then((rows) => setPins(rows.map((r) => ({
			id: r.id,
			title: r.title,
			category: r.category,
			urgencyLevel: r.urgency_level,
			status: r.status,
			lat: Number(r.lat),
			lng: Number(r.lng),
			departmentId: r.department_id,
			duplicateCount: r.duplicate_count
		})))).catch(() => setPins([]));
	}, []);
	const filtered = (0, import_react.useMemo)(() => pins.filter((p) => (!category || p.category === category) && (!urgency || p.urgencyLevel === urgency) && (!status || p.status === status)), [
		pins,
		category,
		urgency,
		status
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-end justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-3xl font-semibold",
					children: "Live issue map"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted",
					children: "OpenStreetMap · Faridabad / NCR demo pins"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: heat ? "default" : "secondary",
					onClick: () => setHeat((v) => !v),
					children: heat ? "Heat view on" : "Density view"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapFilters, {
				category,
				urgency,
				status,
				onCategory: setCategory,
				onUrgency: setUrgency,
				onStatus: setStatus,
				categories: [...CATEGORIES],
				statuses: Object.keys(STATUS_LABEL)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IssueMap, {
				pins: filtered,
				height: 560,
				heat,
				onSelect: (id) => void navigate({
					to: "/admin/complaints/$id",
					params: { id }
				})
			})
		]
	});
}
//#endregion
export { AdminMap as component };
