import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { S as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { _ as patchComplaint, s as cn } from "./server-DLee3XgE.mjs";
import { i as DEPARTMENTS, l as STATUS_LABEL, u as STATUS_ORDER } from "./constants-BTtElcUP.mjs";
import { i as CardTitle, n as CardContent, r as CardHeader, t as Card } from "./card-jn0sOOOg.mjs";
import { t as IssueMap } from "./issue-map-5F0bVdqw.mjs";
import { t as Button } from "./button-BAZDNLjv.mjs";
import { n as UrgencyBadge, t as StatusBadge } from "./status-badge-Cr-9tieS.mjs";
import { n as UrgencyGauge, t as Textarea } from "./textarea-D6oFEY94.mjs";
import { n as format, t as formatDistanceToNow } from "../_libs/date-fns.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/complaint-view-5EFNewn4.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ComplaintTimeline({ status, events }) {
	const currentIdx = Math.max(0, STATUS_ORDER.indexOf(status === "rejected" ? "in_progress" : status));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
			className: "space-y-3",
			children: STATUS_ORDER.map((step, i) => {
				const done = i <= currentIdx && status !== "rejected";
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("grid size-2.5 rounded-full", done ? "bg-primary" : "bg-border", i === currentIdx && "ring-4 ring-primary/20") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cn("text-sm", done ? "text-fg" : "text-faint"),
						children: STATUS_LABEL[step]
					})]
				}, step);
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-3 border-t border-border pt-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
					className: "text-sm font-medium text-muted",
					children: "Updates"
				}),
				events.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-faint",
					children: "No updates yet."
				}),
				events.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-lg bg-surface-2 px-3 py-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-sm text-fg",
						children: e.message
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-1 font-mono text-[11px] tabular-nums text-faint",
						children: format(new Date(e.createdAt), "dd MMM, HH:mm")
					})]
				}, e.id))
			]
		})]
	});
}
function slaLabel(c) {
	if (c.status === "resolved") return "Closed";
	if (!c.slaDeadline) return "No SLA";
	if (new Date(c.slaDeadline).getTime() - Date.now() <= 0 || c.slaBreached) return "SLA breached";
	return `SLA ${formatDistanceToNow(new Date(c.slaDeadline))} left`;
}
function readFile(file) {
	return new Promise((resolve, reject) => {
		const r = new FileReader();
		r.onload = () => resolve(String(r.result));
		r.onerror = () => reject(r.error);
		r.readAsDataURL(file);
	});
}
function ComplaintView({ complaint, events, role, onChange }) {
	const [notes, setNotes] = (0, import_react.useState)(complaint.resolutionNotes ?? "");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const c = complaint;
	async function act(action, extra = {}) {
		setBusy(true);
		try {
			const next = await patchComplaint({ data: {
				id: c.id,
				action,
				...extra
			} });
			if (next) onChange(next);
			toast.success("Updated");
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Update failed");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-6 lg:grid-cols-[1.2fr_0.8fr]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-mono text-xs text-muted",
						children: c.id
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-1 font-display text-3xl font-semibold",
						children: c.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex flex-wrap gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: c.status }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UrgencyBadge, { level: c.urgencyLevel }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-full border border-border px-2.5 py-0.5 text-xs text-muted",
								children: c.category
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-full border border-border px-2.5 py-0.5 text-xs text-muted",
								children: c.departmentName ?? "Unassigned"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `rounded-full border px-2.5 py-0.5 text-xs ${c.slaBreached ? "border-accent/40 text-accent" : "border-border text-muted"}`,
								children: slaLabel(c)
							})
						]
					})
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Report" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "space-y-3 text-sm leading-relaxed text-muted",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-fg",
							children: c.description
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: c.address }),
						c.officerName && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["Officer: ", c.officerName] }),
						c.duplicateCount > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [c.duplicateCount, " citizen reports linked"] })
					]
				})] }),
				c.media[0] && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Evidence" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
					className: "grid gap-3 sm:grid-cols-2",
					children: c.media.map((m, i) => m.type === "image" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: m.url,
						alt: "",
						className: "h-48 w-full rounded-lg object-cover"
					}, i) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
						src: m.url,
						controls: true,
						className: "h-48 w-full rounded-lg bg-bg"
					}, i))
				})] }),
				(c.beforeImage || c.afterImage || role === "officer" || role === "admin") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Before / after verification" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-3 sm:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mb-2 text-xs text-muted",
								children: "Before"
							}), c.beforeImage ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: c.beforeImage,
								alt: "Before",
								className: "h-44 w-full rounded-lg object-cover"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid h-44 place-items-center rounded-lg border border-dashed border-border text-sm text-faint",
								children: "No before photo"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mb-2 text-xs text-muted",
								children: "After"
							}), c.afterImage ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: c.afterImage,
								alt: "After",
								className: "h-44 w-full rounded-lg object-cover"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid h-44 place-items-center rounded-lg border border-dashed border-border text-sm text-faint",
								children: "No after photo"
							})] })]
						}),
						c.resolutionNotes && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: c.resolutionNotes
						}),
						role === "officer" && c.status !== "resolved" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OfficerResolution, {
							busy,
							notes,
							setNotes,
							onAct: act
						}),
						role === "admin" && (c.status === "verification_pending" || c.status === "resolution_submitted") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								disabled: busy,
								onClick: () => void act("verify"),
								children: "Verify resolution"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "danger",
								disabled: busy,
								onClick: () => void act("reject_resolution", { notes }),
								children: "Reject resolution"
							})]
						})
					]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IssueMap, {
					height: 280,
					pins: [{
						id: c.id,
						title: c.title,
						category: c.category,
						urgencyLevel: c.urgencyLevel,
						status: c.status,
						lat: c.lat,
						lng: c.lng,
						departmentId: c.departmentId,
						duplicateCount: c.duplicateCount
					}]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-4",
			children: [
				c.aiAnalysis && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "AI analysis" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs uppercase tracking-wide text-faint",
							children: c.aiAnalysis.source === "grok" ? "Grok classification" : "Prototype classifier"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-sm",
							children: [
								"Issue type ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-fg",
									children: c.aiAnalysis.issueType
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "ml-2 font-mono text-muted",
									children: [Math.round(c.aiAnalysis.confidence * 100), "%"]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UrgencyGauge, {
							score: c.urgencyScore,
							level: c.urgencyLevel
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: c.aiAnalysis.rationale
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-sm text-muted",
							children: ["Nearby similar reports: ", c.aiAnalysis.similarReports]
						})
					]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Lifecycle" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ComplaintTimeline, {
					status: c.status,
					events
				}) })] }),
				role === "admin" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminActions, {
					c,
					busy,
					onAct: act
				}),
				role === "officer" && c.status !== "resolved" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Officer actions" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "flex flex-wrap gap-2",
					children: [
						c.status === "assigned" || c.status === "ai_analyzed" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							disabled: busy,
							onClick: () => void act("accept"),
							children: "Accept"
						}) : null,
						(c.status === "officer_accepted" || c.status === "assigned") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							disabled: busy,
							onClick: () => void act("start"),
							children: "Start work"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							disabled: busy,
							onClick: () => void act("escalate"),
							children: "Escalate"
						})
					]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-faint",
					children: "Prototype note: notifications stay in-app. There is no SMS, WhatsApp, or government dispatch in this demo."
				})
			]
		})]
	});
}
function OfficerResolution({ busy, notes, setNotes, onAct }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
				placeholder: "Resolution notes",
				value: notes,
				onChange: (e) => setNotes(e.target.value)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "inline-flex h-10 items-center rounded-md border border-border px-3 text-sm",
					children: ["Before photo", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "file",
						accept: "image/*",
						className: "hidden",
						onChange: async (e) => {
							const f = e.target.files?.[0];
							if (!f) return;
							onAct("save_before", { image: await readFile(f) });
						}
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "inline-flex h-10 items-center rounded-md bg-primary px-3 text-sm text-primary-fg",
					children: ["Submit with after photo", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "file",
						accept: "image/*",
						className: "hidden",
						onChange: async (e) => {
							const f = e.target.files?.[0];
							if (!f) return;
							onAct("submit_resolution", {
								afterImage: await readFile(f),
								notes
							});
						}
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-faint",
				children: "Officers cannot mark a complaint permanently resolved. Admin verification is required."
			}),
			busy && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted",
				children: "Saving…"
			})
		]
	});
}
function AdminActions({ c, busy, onAct }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Admin actions" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
		className: "space-y-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
				className: "h-10 w-full rounded-md border border-border bg-bg px-3 text-sm",
				defaultValue: c.departmentId ?? "",
				onChange: (e) => onAct("assign_department", { departmentId: e.target.value }),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: "",
					children: "Assign department"
				}), DEPARTMENTS.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: d.id,
					children: d.name
				}, d.id))]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
				className: "h-10 w-full rounded-md border border-border bg-bg px-3 text-sm",
				defaultValue: c.urgencyLevel,
				onChange: (e) => onAct("change_priority", { priority: e.target.value }),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "HIGH" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "MEDIUM" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "LOW" })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "outline",
				disabled: busy,
				onClick: () => onAct("escalate"),
				children: "Escalate"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-xs text-faint",
				children: ["Current status: ", STATUS_LABEL[c.status]]
			})
		]
	})] });
}
//#endregion
export { ComplaintView as t };
