import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { S as require_jsx_runtime, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Shield, b as Brain, g as CircleCheck, l as MapPin, x as Bell, y as Camera } from "../_libs/lucide-react.mjs";
import { u as getPublicPins } from "./server-DLee3XgE.mjs";
import { d as SUBTITLE, f as TAGLINE } from "./constants-BTtElcUP.mjs";
import { n as CardContent, t as Card } from "./card-jn0sOOOg.mjs";
import { t as IssueMap } from "./issue-map-5F0bVdqw.mjs";
import { t as Button } from "./button-BAZDNLjv.mjs";
import { i as useCurrentUserState, t as ShinraiMark } from "./logo-BL1L9wu-.mjs";
import { i as UserButton, n as SignedIn, r as SignedOut } from "./gates-CtWSaF9O.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BVl6BKyK.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Home() {
	const { user, isPending } = useCurrentUserState();
	const [pins, setPins] = (0, import_react.useState)([]);
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "hero-wash min-h-dvh",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "mx-auto flex h-16 max-w-6xl items-center justify-between px-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShinraiMark, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-display text-lg font-bold",
						children: "Shinrai"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [
						isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-8 w-24 animate-pulse rounded-full bg-surface-2" }) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignedOut, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							variant: "secondary",
							size: "sm",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/login",
								children: "Sign in"
							})
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignedIn, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserButton, {}) })
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mx-auto grid max-w-6xl gap-10 px-4 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:py-24",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "stagger-in max-w-xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-medium uppercase tracking-[0.22em] text-primary",
							children: "Civic OS for cities"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-4 font-display text-5xl font-extrabold leading-[0.95] sm:text-6xl",
							children: "Shinrai"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-xl text-muted",
							children: TAGLINE
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-5 text-base leading-relaxed text-muted",
							children: SUBTITLE
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-8 flex flex-wrap gap-3",
							children: [user ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								size: "lg",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/citizen/report",
									children: "Report an issue"
								})
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								size: "lg",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/login",
									children: "Report an issue"
								})
							}), user ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								size: "lg",
								variant: "secondary",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/admin/dashboard",
									children: "Explore dashboard"
								})
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								size: "lg",
								variant: "secondary",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/login",
									children: "Explore dashboard"
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-6 max-w-md text-xs text-faint",
							children: "Capstone prototype. AI routing, duplicate matching, and CCTV detection are demonstration modules — not live municipal infrastructure."
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					className: "overflow-hidden",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "p-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IssueMap, {
							pins,
							height: 340
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between px-4 py-3 text-xs text-muted",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Live issue map · Faridabad / Delhi NCR demo data" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "tabular-nums",
								children: [pins.length, " reports"]
							})]
						})]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mx-auto max-w-6xl px-4 pb-10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl font-semibold",
					children: "How Shinrai works"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6 grid gap-3 md:grid-cols-4",
					children: [
						{
							n: "01",
							t: "Report",
							d: "Photo, video, or text with GPS."
						},
						{
							n: "02",
							t: "Analyze",
							d: "Classify, score urgency, find duplicates."
						},
						{
							n: "03",
							t: "Route",
							d: "Send to the right department and officer."
						},
						{
							n: "04",
							t: "Verify",
							d: "Before/after evidence, then close."
						}
					].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-mono text-xs text-primary",
							children: s.n
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2 font-display text-lg",
							children: s.t
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted",
							children: s.d
						})
					] }) }, s.n))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mx-auto max-w-6xl px-4 pb-20",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl font-semibold",
					children: "Key features"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3",
					children: [
						{
							icon: Brain,
							t: "AI-powered governance",
							d: "Issue type, urgency, and department from the report itself."
						},
						{
							icon: Bell,
							t: "Real-time issue tracking",
							d: "A visible lifecycle from submitted to resolved."
						},
						{
							icon: CircleCheck,
							t: "Verified resolution",
							d: "Field teams must file before and after photos."
						},
						{
							icon: Camera,
							t: "CCTV incident detection",
							d: "Prototype module for accident stills and alerts."
						},
						{
							icon: MapPin,
							t: "Geospatial intelligence",
							d: "Heatmap, clustering of nearby reports, SLA view."
						},
						{
							icon: Shield,
							t: "Accountable queues",
							d: "Admin, officer, and citizen portals on one platform."
						}
					].map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "flex gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(f.icon, { className: "mt-0.5 size-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-medium",
							children: f.t
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted",
							children: f.d
						})] })]
					}) }, f.t))
				})]
			})
		]
	});
}
//#endregion
export { Home as component };
