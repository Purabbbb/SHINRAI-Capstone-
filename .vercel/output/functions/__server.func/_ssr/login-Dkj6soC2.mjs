import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { S as require_jsx_runtime, v as Link, y as Navigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as GROK_PROVIDERS } from "./server-OVmyHIWG.mjs";
import { a as bootstrapMe } from "./server-DLee3XgE.mjs";
import { s as ROLE_HOME } from "./constants-BTtElcUP.mjs";
import { i as CardTitle, n as CardContent, r as CardHeader, t as Card } from "./card-jn0sOOOg.mjs";
import { t as Button } from "./button-BAZDNLjv.mjs";
import { n as Label, t as Input } from "./label-DkXfLEsj.mjs";
import { r as signIn, t as authClient } from "./client-B40BzJxt.mjs";
import { i as useCurrentUserState, t as ShinraiMark } from "./logo-BL1L9wu-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-Dkj6soC2.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Login() {
	const { user, isPending } = useCurrentUserState();
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-dvh place-items-center text-muted",
		children: "Loading session…"
	});
	if (user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PortalPicker, { name: user.displayName });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthForm, {});
}
function PortalPicker({ name }) {
	const [busy, setBusy] = (0, import_react.useState)(null);
	const [go, setGo] = (0, import_react.useState)(null);
	if (go) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: go });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "hero-wash grid min-h-dvh place-items-center px-4 py-10",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "w-full max-w-lg",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShinraiMark, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
					className: "mt-3",
					children: "Choose a portal"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted",
					children: [
						"Signed in",
						name ? ` as ${name}` : "",
						". This prototype lets you open any role on your account so the full workflow can be demonstrated."
					]
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "grid gap-2",
				children: [[
					[
						"citizen",
						"Citizen",
						"Report issues and track them"
					],
					[
						"officer",
						"Officer",
						"Work the field queue with before/after evidence"
					],
					[
						"admin",
						"Admin",
						"Analytics, SLA, map, and verification"
					]
				].map(([role, label, hint]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "secondary",
					className: "h-auto flex-col items-start py-3",
					disabled: !!busy,
					onClick: async () => {
						setBusy(role);
						await bootstrapMe({ data: {
							role,
							displayName: name
						} });
						setGo(ROLE_HOME[role]);
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-medium",
						children: busy === role ? "Opening…" : `Continue as ${label}`
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs font-normal text-muted",
						children: hint
					})]
				}, role)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					variant: "ghost",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						children: "Back to landing"
					})
				})]
			})]
		})
	});
}
function AuthForm() {
	const [mode, setMode] = (0, import_react.useState)("in");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [name, setName] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	async function submit(e) {
		e.preventDefault();
		setBusy(true);
		setError(null);
		const { error: err } = await (mode === "up" ? authClient.signUp.email({
			email,
			password,
			name: name || "Citizen"
		}) : authClient.signIn.email({
			email,
			password
		}));
		setBusy(false);
		if (err) setError(err.message ?? "Could not sign in");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "hero-wash grid min-h-dvh place-items-center px-4 py-10",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "w-full max-w-md",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShinraiMark, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
					className: "mt-3",
					children: "Enter Shinrai"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "Sign in to report issues or run a demo of the three portals."
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "space-y-4",
				children: [
					GROK_PROVIDERS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "secondary",
						className: "w-full",
						onClick: () => void signIn(p.providerId, { callbackURL: "/login" }),
						children: ["Continue with ", p.label]
					}, p.providerId)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "relative py-1 text-center text-xs text-faint",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "bg-surface px-2",
							children: "or email"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "space-y-3",
						onSubmit: (e) => void submit(e),
						children: [
							mode === "up" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "name",
									children: "Name"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "name",
									value: name,
									onChange: (e) => setName(e.target.value)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "email",
									children: "Email"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "email",
									type: "email",
									required: true,
									value: email,
									onChange: (e) => setEmail(e.target.value)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "password",
									children: "Password"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "password",
									type: "password",
									required: true,
									minLength: 8,
									value: password,
									onChange: (e) => setPassword(e.target.value)
								})]
							}),
							error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-danger",
								children: error
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								className: "w-full",
								disabled: busy,
								children: busy ? "Please wait…" : mode === "up" ? "Create account" : "Sign in"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "text-sm text-muted underline-offset-4 hover:underline",
						onClick: () => setMode(mode === "up" ? "in" : "up"),
						children: mode === "up" ? "Have an account? Sign in" : "Need an account? Create one"
					})
				]
			})]
		})
	});
}
//#endregion
export { Login as component };
