import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { S as require_jsx_runtime, b as useNavigate, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { _ as Check, u as LoaderCircle } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { c as createComplaint, i as analyzeComplaint } from "./server-DLee3XgE.mjs";
import { a as FARIDABAD, t as CATEGORIES } from "./constants-BTtElcUP.mjs";
import { i as CardTitle, n as CardContent, r as CardHeader, t as Card } from "./card-jn0sOOOg.mjs";
import { t as IssueMap } from "./issue-map-5F0bVdqw.mjs";
import { t as Button } from "./button-BAZDNLjv.mjs";
import { n as UrgencyGauge, t as Textarea } from "./textarea-D6oFEY94.mjs";
import { n as Label, t as Input } from "./label-DkXfLEsj.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/report-zwCSHkg1.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STEPS = [
	"Extracting information",
	"Identifying issue type",
	"Estimating urgency",
	"Checking duplicate complaints",
	"Determining department"
];
function ReportIssue() {
	const navigate = useNavigate();
	const [title, setTitle] = (0, import_react.useState)("");
	const [description, setDescription] = (0, import_react.useState)("");
	const [category, setCategory] = (0, import_react.useState)("");
	const [lat, setLat] = (0, import_react.useState)(FARIDABAD.lat);
	const [lng, setLng] = (0, import_react.useState)(FARIDABAD.lng);
	const [address, setAddress] = (0, import_react.useState)("Faridabad, Haryana");
	const [media, setMedia] = (0, import_react.useState)([]);
	const [geoNote, setGeoNote] = (0, import_react.useState)(null);
	const [phase, setPhase] = (0, import_react.useState)("form");
	const [step, setStep] = (0, import_react.useState)(0);
	const [result, setResult] = (0, import_react.useState)(null);
	const [id, setId] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (!navigator.geolocation) {
			setGeoNote("Location permission unavailable. Please select the location manually.");
			return;
		}
		navigator.geolocation.getCurrentPosition((pos) => {
			setLat(pos.coords.latitude);
			setLng(pos.coords.longitude);
			setAddress("Current location (GPS)");
		}, () => setGeoNote("Location permission unavailable. Please select the location manually."));
	}, []);
	async function onFiles(files, type) {
		if (!files?.[0]) return;
		const file = files[0];
		if (file.size > 9e5) {
			toast.error("Keep uploads under 900KB for this prototype.");
			return;
		}
		const url = await new Promise((res, rej) => {
			const r = new FileReader();
			r.onload = () => res(String(r.result));
			r.onerror = () => rej(r.error);
			r.readAsDataURL(file);
		});
		setMedia((m) => [...m, {
			type,
			url,
			name: file.name
		}]);
	}
	async function submit(e) {
		e.preventDefault();
		if (!title.trim()) {
			toast.error("Add a title.");
			return;
		}
		try {
			const created = await createComplaint({ data: {
				title,
				description,
				category,
				lat,
				lng,
				address,
				media
			} });
			setId(created.id);
			setPhase("analyzing");
			setStep(0);
			const timer = window.setInterval(() => setStep((s) => Math.min(STEPS.length, s + 1)), 450);
			const analyzed = await analyzeComplaint({ data: { id: created.id } });
			window.clearInterval(timer);
			setStep(STEPS.length);
			setResult(analyzed);
			setPhase("result");
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "AI analysis failed. You can still submit the complaint.");
			if (id) navigate({
				to: "/citizen/complaints/$id",
				params: { id }
			});
		}
	}
	if (phase === "analyzing") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "mx-auto max-w-lg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Analyzing your complaint…" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
			className: "space-y-3",
			children: STEPS.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 text-sm",
				children: [i < step ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4 text-success" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin text-muted" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: i < step ? "text-fg" : "text-muted",
					children: s
				})]
			}, s))
		})]
	});
	if (phase === "result" && result?.complaint) {
		const a = result.complaint.aiAnalysis;
		const dups = result.duplicates;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-2xl space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "AI analysis result" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-faint",
					children: a?.source === "grok" ? "Classified with Grok, then routed by Shinrai rules." : "Prototype classifier — replaceable with a trained NLP model."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							k: "Issue type",
							v: a?.issueType ?? result.complaint.category
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							k: "Confidence",
							v: `${Math.round((a?.confidence ?? 0) * 100)}%`
						}),
						a && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UrgencyGauge, {
							score: a.urgencyScore,
							level: a.priority
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							k: "Recommended department",
							v: a?.departmentName ?? "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							k: "Nearby similar reports",
							v: String(dups.length)
						})
					]
				})] }),
				dups[0] && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "This issue may already have been reported." }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "space-y-3",
					children: [dups.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-lg border border-border p-3 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-mono text-xs",
								children: d.id
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: d.title }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-muted",
								children: [
									"Similarity ",
									d.similarity,
									"% · Distance ",
									d.distanceMeters,
									"m"
								]
							})
						]
					}, d.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							variant: "secondary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/citizen/complaints/$id",
								params: { id: dups[0].id },
								children: "View existing complaint"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: async () => {
								if (!id) return;
								const merged = await analyzeComplaint({ data: {
									id,
									attachTo: dups[0].id
								} });
								navigate({
									to: "/citizen/complaints/$id",
									params: { id: merged.mergedInto ?? dups[0].id }
								});
							},
							children: "Add my report"
						})]
					})]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					className: "w-full",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/citizen/complaints/$id",
						params: { id: result.mergedInto ?? result.complaint.id },
						children: ["Open complaint ", result.complaint.id]
					})
				})
			]
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "mx-auto max-w-2xl space-y-5",
		onSubmit: (e) => void submit(e),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl font-semibold",
				children: "Report an issue"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted",
				children: "Multimedia civic reporting with GPS tagging."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "title",
					children: "Title"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: "title",
					required: true,
					value: title,
					onChange: (e) => setTitle(e.target.value),
					placeholder: "Large pothole on Mathura Road"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "desc",
					children: "Description"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					id: "desc",
					value: description,
					onChange: (e) => setDescription(e.target.value),
					placeholder: "What happened, how severe, who is affected…"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Category (optional)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					className: "h-10 w-full rounded-md border border-border bg-bg px-3 text-sm",
					value: category,
					onChange: (e) => setCategory(e.target.value),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "",
						children: "Let AI decide"
					}), CATEGORIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: c }, c))]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "rounded-lg border border-dashed border-border p-4 text-sm",
					children: ["Image upload", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "file",
						accept: "image/*",
						className: "mt-2 block w-full text-xs",
						onChange: (e) => void onFiles(e.target.files, "image")
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "rounded-lg border border-dashed border-border p-4 text-sm",
					children: ["Video upload", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "file",
						accept: "video/*",
						className: "mt-2 block w-full text-xs",
						onChange: (e) => void onFiles(e.target.files, "video")
					})]
				})]
			}),
			media[0] && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex gap-2 overflow-x-auto",
				children: media.map((m, i) => m.type === "image" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: m.url,
					alt: "",
					className: "h-24 rounded-md object-cover"
				}, i) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
					src: m.url,
					className: "h-24 rounded-md"
				}, i))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-lg border border-border p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-sm font-medium",
					children: "Voice note"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-xs text-faint",
					children: "Prototype placeholder — type the complaint or use the description field. Speech-to-text is not wired in this demo."
				})]
			}),
			geoNote && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-warn",
				children: geoNote
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Latitude" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: lat,
						onChange: (e) => setLat(Number(e.target.value))
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Longitude" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: lng,
						onChange: (e) => setLng(Number(e.target.value))
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Location" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: address,
					onChange: (e) => setAddress(e.target.value)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "Choose location manually on the map"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IssueMap, {
				height: 280,
				pins: [],
				pickMode: true,
				picked: {
					lat,
					lng
				},
				onPick: (a, b) => {
					setLat(a);
					setLng(b);
					setAddress("Pinned on map");
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "w-full",
				size: "lg",
				children: "Submit complaint"
			})
		]
	});
}
function Row({ k, v }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-baseline justify-between gap-4 text-sm",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-muted",
			children: k
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-fg",
			children: v
		})]
	});
}
//#endregion
export { ReportIssue as component };
