import { S as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as cn } from "./server-DLee3XgE.mjs";
import { n as CardContent, t as Card } from "./card-jn0sOOOg.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/stat-card-XgEGdzxG.js
var import_jsx_runtime = require_jsx_runtime();
function StatCard({ label, value, hint, icon: Icon, tone = "default" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
		className: "flex items-start justify-between gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-sm text-muted",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-1 font-display text-2xl font-semibold tabular-nums tracking-tight",
				children: value
			}),
			hint && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-1 text-xs text-faint",
				children: hint
			})
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: cn("grid size-10 place-items-center rounded-lg border border-border bg-surface-2 text-primary", tone === "high" && "text-accent", tone === "ok" && "text-success"),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" })
		})]
	}) });
}
//#endregion
export { StatCard as t };
