import { S as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as cn } from "./server-DLee3XgE.mjs";
import { t as authClient } from "./client-B40BzJxt.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/logo-BL1L9wu-.js
var import_jsx_runtime = require_jsx_runtime();
/**
* Current user + loading state. Same behavior in live preview and when deployed:
*   - Auth enabled -> the real signed-in user; `user` is `null` while
*                            the session resolves (`isPending: true`) and when
*                            signed out (`isPending: false`). Session comes from
*                            Better Auth `useSession()` → `/api/auth/get-session`
*                            (cookie when deployed; bearer in live preview).
*   - Auth disabled (`VITE_AUTH_ENABLED=false`) -> `DEV_USER`, never pending.
*
* Protect a route by waiting out `isPending` before acting on `user` —
* redirecting on `user: null` alone bounces signed-in visitors to sign-in on
* every hard reload:
*
*   import { RedirectToSignIn } from "@/lib/auth/gates";
*   const { user, isPending } = useCurrentUserState();
*   if (isPending) return null;              // still resolving — don't redirect yet
*   if (!user) return <RedirectToSignIn />;  // definitely signed out
*
* `authEnabled` is a module-level constant fixed at load, so the guarded hook
* call keeps a stable hook order across every render of a given component.
*/
function useCurrentUserState() {
	const { data, isPending } = authClient.useSession();
	const user = data?.user;
	return {
		user: user ? {
			id: user.id,
			displayName: user.name ?? null,
			primaryEmail: user.email ?? null,
			profileImageUrl: user.image ?? null,
			isDevFallback: false
		} : null,
		isPending
	};
}
/**
* Convenience view of `useCurrentUserState().user` for display (e.g.
* `user?.displayName ?? "Guest"`). NOTE: `null` means *loading OR signed out* —
* for redirects/guards use `useCurrentUserState()` and check `isPending`.
*/
function useCurrentUser() {
	return useCurrentUserState().user;
}
function ShinraiMark({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 32 32",
		className: cn("size-8", className),
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "16",
				cy: "16",
				r: "15",
				fill: "#12121c",
				stroke: "#8b7cff",
				strokeWidth: "1.2"
			}),
			[
				0,
				45,
				90,
				135,
				180,
				225,
				270,
				315
			].map((deg) => {
				const r = deg * Math.PI / 180;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
					x1: 16 + Math.cos(r) * 7,
					y1: 16 + Math.sin(r) * 7,
					x2: 16 + Math.cos(r) * 13,
					y2: 16 + Math.sin(r) * 13,
					stroke: "#8b7cff",
					strokeWidth: "1.6",
					strokeLinecap: "round"
				}, deg);
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "11",
				y: "12",
				width: "10",
				height: "8",
				rx: "3",
				fill: "#ff5a8a"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "14.2",
				cy: "16",
				r: "0.9",
				fill: "#070712"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "17.8",
				cy: "16",
				r: "0.9",
				fill: "#070712"
			})
		]
	});
}
function ShinraiWordmark({ compact }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShinraiMark, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "leading-tight",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "font-display text-base font-bold tracking-tight text-fg",
				children: "Shinrai"
			}), !compact && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-[11px] text-muted",
				children: "From Concern to Completion"
			})]
		})]
	});
}
//#endregion
export { useCurrentUserState as i, ShinraiWordmark as n, useCurrentUser as r, ShinraiMark as t };
