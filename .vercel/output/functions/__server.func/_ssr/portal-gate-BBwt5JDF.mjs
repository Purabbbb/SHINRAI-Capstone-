import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { S as require_jsx_runtime, d as useRouterState, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Shield, c as Map, d as LayoutDashboard, i as Siren, m as ClipboardList, o as Plus, s as Menu, t as X, v as ChartColumn, x as Bell } from "../_libs/lucide-react.mjs";
import { a as bootstrapMe, g as markNotificationRead, m as listNotifications, s as cn } from "./server-DLee3XgE.mjs";
import { t as Button } from "./button-BAZDNLjv.mjs";
import { i as useCurrentUserState, n as ShinraiWordmark, r as useCurrentUser } from "./logo-BL1L9wu-.mjs";
import { i as UserButton, t as RedirectToSignIn } from "./gates-CtWSaF9O.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/portal-gate-BBwt5JDF.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var NAV = {
	citizen: [{
		to: "/citizen/dashboard",
		label: "Dashboard",
		icon: LayoutDashboard
	}, {
		to: "/citizen/report",
		label: "Report issue",
		icon: Plus
	}],
	officer: [{
		to: "/officer/dashboard",
		label: "Queue",
		icon: ClipboardList
	}],
	admin: [
		{
			to: "/admin/dashboard",
			label: "Overview",
			icon: LayoutDashboard
		},
		{
			to: "/admin/complaints",
			label: "Queue",
			icon: ClipboardList
		},
		{
			to: "/admin/map",
			label: "Issue map",
			icon: Map
		},
		{
			to: "/admin/analytics",
			label: "Analytics",
			icon: ChartColumn
		},
		{
			to: "/admin/cctv",
			label: "CCTV",
			icon: Siren
		}
	]
};
function AppShell({ role, children }) {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const user = useCurrentUser();
	const [open, setOpen] = (0, import_react.useState)(false);
	const [notes, setNotes] = (0, import_react.useState)([]);
	const [showNotes, setShowNotes] = (0, import_react.useState)(false);
	const unread = notes.filter((n) => !n.isRead).length;
	(0, import_react.useEffect)(() => {
		bootstrapMe({ data: {
			displayName: user?.displayName,
			role
		} }).catch(() => void 0);
		listNotifications().then(setNotes).catch(() => setNotes([]));
	}, [role, user?.displayName]);
	const links = NAV[role];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-bg text-fg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "sticky top-0 z-30 border-b border-border bg-bg/80 backdrop-blur-md",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "grid size-10 place-items-center rounded-md md:hidden",
							onClick: () => setOpen((v) => !v),
							children: open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShinraiWordmark, { compact: true })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "hidden items-center gap-1 md:flex",
						children: links.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: l.to,
							className: cn("flex h-9 items-center gap-2 rounded-md px-3 text-sm text-muted hover:bg-surface-2 hover:text-fg", pathname.startsWith(l.to) && "bg-surface-2 text-fg"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(l.icon, { className: "size-4" }), l.label]
						}, l.to))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoleChips, { current: role }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "ghost",
										size: "icon",
										onClick: () => setShowNotes((v) => !v),
										"aria-label": "Notifications",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "size-4" })
									}),
									unread > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "absolute right-1 top-1 grid min-w-4 place-items-center rounded-full bg-accent px-1 text-[10px] text-primary-fg",
										children: unread
									}),
									showNotes && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "absolute right-0 top-11 z-40 w-80 max-w-[calc(100vw-2rem)] rounded-xl border border-border bg-surface p-2 shadow-xl",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "px-2 py-1 text-xs font-medium text-muted",
												children: "Notifications"
											}),
											notes.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "px-2 py-4 text-sm text-faint",
												children: "No notifications yet."
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "max-h-80 overflow-auto",
												children: notes.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
													className: "w-full rounded-lg px-2 py-2 text-left hover:bg-surface-2",
													onClick: () => {
														markNotificationRead({ data: n.id });
														setNotes((prev) => prev.map((x) => x.id === n.id ? {
															...x,
															isRead: true
														} : x));
													},
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: cn("text-sm", n.isRead ? "text-muted" : "text-fg"),
														children: n.title
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "text-xs text-faint",
														children: n.body
													})]
												}, n.id))
											})
										]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserButton, {})
						]
					})
				]
			}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "border-t border-border px-4 py-3 md:hidden",
				children: links.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: l.to,
					onClick: () => setOpen(false),
					className: "flex h-11 items-center gap-2 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(l.icon, { className: "size-4" }), l.label]
				}, l.to))
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
			className: "mx-auto max-w-6xl px-4 py-6",
			children
		})]
	});
}
function RoleChips({ current }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "hidden items-center rounded-full border border-border p-0.5 sm:flex",
		children: [
			{
				role: "citizen",
				to: "/citizen/dashboard",
				label: "Citizen"
			},
			{
				role: "officer",
				to: "/officer/dashboard",
				label: "Officer"
			},
			{
				role: "admin",
				to: "/admin/dashboard",
				label: "Admin"
			}
		].map((it) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: it.to,
			className: cn("flex h-7 items-center gap-1 rounded-full px-2.5 text-[11px] text-muted", current === it.role && "bg-surface-2 text-fg"),
			children: [it.role === "admin" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "size-3" }), it.label]
		}, it.role))
	});
}
function Skeleton({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: cn("animate-pulse rounded-md bg-surface-2", className) });
}
function PortalGate({ role, children }) {
	const { user, isPending } = useCurrentUserState();
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-bg p-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-14 w-full" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 grid gap-3 md:grid-cols-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-28" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-28" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-28" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-28" })
			]
		})]
	});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		role,
		children
	});
}
//#endregion
export { PortalGate as t };
