import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { S as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as cn } from "./server-DLee3XgE.mjs";
import { a as FARIDABAD, n as CATEGORY_COLOR } from "./constants-BTtElcUP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/issue-map-5F0bVdqw.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function IssueMap(props) {
	const [ready, setReady] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => setReady(true), []);
	if (!ready) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("rounded-xl bg-surface-2", props.className),
		style: { height: props.height ?? 420 }
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LeafletMap, { ...props });
}
function LeafletMap({ pins, height = 420, onSelect, pickMode, picked, onPick, heat, className }) {
	const [Lmod, setLmod] = (0, import_react.useState)(null);
	const [RL, setRL] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		Promise.all([
			import("../_libs/@react-leaflet/core+[...].mjs").then((n) => /* @__PURE__ */ __toESM(n.b())),
			import("../_libs/react-leaflet.mjs").then((n) => n.t),
			Promise.resolve({})
		]).then(([leaflet, reactLeaflet]) => {
			setLmod(leaflet);
			setRL(reactLeaflet);
		});
	}, []);
	const center = (0, import_react.useMemo)(() => {
		if (picked) return [picked.lat, picked.lng];
		if (pins[0]) return [pins[0].lat, pins[0].lng];
		return [FARIDABAD.lat, FARIDABAD.lng];
	}, [pins, picked]);
	if (!Lmod || !RL) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("rounded-xl bg-surface-2", className),
		style: { height }
	});
	const { MapContainer, TileLayer, CircleMarker, Popup, useMapEvents } = RL;
	function ClickCatcher() {
		useMapEvents({ click(e) {
			if (pickMode) onPick?.(e.latlng.lat, e.latlng.lng);
		} });
		return null;
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("overflow-hidden rounded-xl border border-border", className),
		style: { height },
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(MapContainer, {
			center,
			zoom: 12,
			style: {
				height: "100%",
				width: "100%"
			},
			scrollWheelZoom: true,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TileLayer, {
					attribution: "© OpenStreetMap",
					url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClickCatcher, {}),
				pins.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleMarker, {
					center: [p.lat, p.lng],
					radius: heat ? 8 + Math.min(14, p.duplicateCount * 3) : 8,
					pathOptions: {
						color: CATEGORY_COLOR[p.category] ?? "#8b7cff",
						fillColor: CATEGORY_COLOR[p.category] ?? "#8b7cff",
						fillOpacity: heat ? .28 : .85,
						weight: heat ? 0 : 1
					},
					eventHandlers: { click: () => onSelect?.(p.id) },
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Popup, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-40 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-mono text-xs",
								children: p.id
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-medium",
								children: p.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-1 text-xs",
								children: [
									p.category,
									" · ",
									p.urgencyLevel,
									" · ",
									p.status
								]
							})
						]
					}) })
				}, p.id)),
				picked && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleMarker, {
					center: [picked.lat, picked.lng],
					radius: 10,
					pathOptions: {
						color: "#ff5a8a",
						fillColor: "#ff5a8a",
						fillOpacity: .9
					}
				})
			]
		})
	});
}
function MapFilters(props) {
	const sel = "h-9 rounded-md border border-border bg-bg px-2 text-sm text-fg";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-wrap gap-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
				className: sel,
				value: props.category,
				onChange: (e) => props.onCategory(e.target.value),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: "",
					children: "All categories"
				}), props.categories.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: c }, c))]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
				className: sel,
				value: props.urgency,
				onChange: (e) => props.onUrgency(e.target.value),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: "",
					children: "All urgency"
				}), [
					"HIGH",
					"MEDIUM",
					"LOW"
				].map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: u }, u))]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
				className: sel,
				value: props.status,
				onChange: (e) => props.onStatus(e.target.value),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: "",
					children: "All status"
				}), props.statuses.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: s,
					children: s
				}, s))]
			})
		]
	});
}
//#endregion
export { MapFilters as n, IssueMap as t };
