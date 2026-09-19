import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { S as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { f as listIncidents, r as analyzeCctv } from "./server-DLee3XgE.mjs";
import { a as FARIDABAD } from "./constants-BTtElcUP.mjs";
import { i as CardTitle, n as CardContent, r as CardHeader, t as Card } from "./card-jn0sOOOg.mjs";
import { t as Button } from "./button-BAZDNLjv.mjs";
import { n as format } from "../_libs/date-fns.mjs";
import { n as Label, t as Input } from "./label-DkXfLEsj.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cctv-DbEGtMlY.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CctvPage() {
	const videoRef = (0, import_react.useRef)(null);
	const [cameraId, setCameraId] = (0, import_react.useState)("CAM-21A");
	const [location, setLocation] = (0, import_react.useState)("Sector 21, Faridabad");
	const [fileName, setFileName] = (0, import_react.useState)("");
	const [frame, setFrame] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [incidents, setIncidents] = (0, import_react.useState)([]);
	const [last, setLast] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		listIncidents().then(setIncidents).catch(() => setIncidents([]));
	}, []);
	function grabFrame() {
		const video = videoRef.current;
		if (!video || video.readyState < 2) return null;
		const canvas = document.createElement("canvas");
		canvas.width = 480;
		canvas.height = 270;
		const ctx = canvas.getContext("2d");
		if (!ctx) return null;
		ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
		return canvas.toDataURL("image/jpeg", .7);
	}
	async function run() {
		setBusy(true);
		try {
			const still = grabFrame() ?? frame;
			const res = await analyzeCctv({ data: {
				cameraId,
				locationLabel: location,
				lat: FARIDABAD.lat,
				lng: FARIDABAD.lng,
				frameData: still,
				hint: fileName
			} });
			setLast(res);
			setFrame(still);
			toast.success(res.detected ? "Prototype detection: incident flagged" : "Prototype detection: no incident");
			const list = await listIncidents();
			setIncidents(list);
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Detection failed");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-6 lg:grid-cols-[1.1fr_0.9fr]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-3xl font-semibold",
					children: "CCTV incident module"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted",
					children: "Prototype detection. This is not production-grade accident detection and is not connected to live city cameras."
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Upload a traffic clip" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-3 sm:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Camera ID" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: cameraId,
									onChange: (e) => setCameraId(e.target.value)
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Location" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: location,
									onChange: (e) => setLocation(e.target.value)
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "file",
							accept: "video/*",
							onChange: (e) => {
								const f = e.target.files?.[0];
								if (!f || !videoRef.current) return;
								setFileName(f.name);
								videoRef.current.src = URL.createObjectURL(f);
							}
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
							ref: videoRef,
							controls: true,
							className: "w-full rounded-lg bg-bg",
							onLoadedData: () => setFrame(grabFrame())
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							disabled: busy,
							onClick: () => void run(),
							children: busy ? "Running detector…" : "Extract frames & detect"
						})
					]
				})] }),
				last && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: last.label }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "space-y-2 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["Confidence: ", last.confidence] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["Camera: ", cameraId] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["Location: ", location] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["Source: ", last.source === "grok" ? "Grok vision (prototype)" : "Heuristic prototype detector"] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-muted",
							children: last.notes
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs uppercase tracking-wide text-faint",
							children: "Prototype Detection"
						})
					]
				})] })
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-xl",
				children: "Incident log"
			}), incidents.map((inc) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "space-y-1 py-4 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-medium",
						children: inc.detection
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-muted",
						children: [
							inc.cameraId,
							" · ",
							inc.locationLabel
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "font-mono text-xs text-faint",
						children: [
							format(new Date(inc.createdAt), "dd MMM HH:mm"),
							" · conf ",
							inc.confidence,
							" · ",
							inc.alertStatus
						]
					}),
					inc.prototype && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-faint",
						children: "Prototype detection"
					})
				]
			}) }, inc.id))]
		})]
	});
}
//#endregion
export { CctvPage as component };
