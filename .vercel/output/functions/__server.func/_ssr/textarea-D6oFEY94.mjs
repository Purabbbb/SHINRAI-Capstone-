import "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { S as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as cn } from "./server-DLee3XgE.mjs";
require_react();
var import_jsx_runtime = require_jsx_runtime();
function UrgencyGauge({ score, level }) {
	const pct = Math.round(score * 100);
	const color = level === "HIGH" ? "bg-accent" : level === "MEDIUM" ? "bg-warn" : "bg-success";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-baseline justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-sm text-muted",
					children: "Urgency score"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-mono text-lg tabular-nums text-fg",
					children: score.toFixed(2)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-2.5 overflow-hidden rounded-full bg-surface-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: cn("h-full rounded-full transition-[width] duration-500", color),
					style: { width: `${pct}%` }
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-xs font-medium tracking-wide text-muted",
				children: ["Priority ", level]
			})
		]
	});
}
function Textarea({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn("flex min-h-28 w-full rounded-md border border-border bg-bg px-3 py-2 text-sm text-fg placeholder:text-faint outline-none focus-visible:ring-2 focus-visible:ring-primary/60", className),
		...props
	});
}
//#endregion
export { UrgencyGauge as n, Textarea as t };
