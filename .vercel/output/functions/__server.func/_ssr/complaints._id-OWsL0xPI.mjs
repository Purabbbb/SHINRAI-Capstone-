import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { S as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as Route$1 } from "./router-BChAPU7h.mjs";
import { l as getComplaint } from "./server-DLee3XgE.mjs";
import { t as ComplaintView } from "./complaint-view-5EFNewn4.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/complaints._id-OWsL0xPI.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Page() {
	const { id } = Route$1.useParams();
	const [data, setData] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		getComplaint({ data: id }).then((r) => {
			if (r?.complaint) setData({
				complaint: r.complaint,
				events: r.events
			});
		});
	}, [id]);
	if (!data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted",
		children: "Loading complaint…"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ComplaintView, {
		role: "citizen",
		complaint: data.complaint,
		events: data.events,
		onChange: (c) => setData((d) => d ? {
			...d,
			complaint: c
		} : d)
	});
}
//#endregion
export { Page as component };
