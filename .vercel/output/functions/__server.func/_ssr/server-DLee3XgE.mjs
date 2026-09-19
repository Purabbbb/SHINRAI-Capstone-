import { a as getServerFnById, i as TSS_SERVER_FUNCTION, r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-DdUB-lT3.mjs";
import { n as clsx } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/server-DLee3XgE.js
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var bootstrapMe = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("105cbb26e35c6058ca3b608df33e6fa778290a3bfbc8f3964fdf3ce4733bd22f"));
createServerFn({ method: "GET" }).handler(createSsrRpc("2a265847f5baf00dde8e42f98fd911bc68c8ef108a4b29e2ea1449300966cddf"));
createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("55639118f4d9e4344b905cde8b2986fa12f2107780282dd27b42c0043a4f55aa"));
var getPublicPins = createServerFn({ method: "GET" }).handler(createSsrRpc("2f9b406a0bea41cb71947e15e68bbefe06a2233835a8bcb0cda6c54bb00aa97c"));
var listMyComplaints = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("ef01f1759d90298853e51ba1237465a60f7e1add47a3f36c96803579c09f019e"));
var listOfficerQueue = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("67fe45bb209d5655f47c4fc52b155a6e1736b0ecd8ff22826ecf26b9733128ec"));
var listAdminComplaints = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("ff3867773c1a61d01099f71d98d96ace7793f8c35813dc4419cccbdbd7ff927d"));
var getComplaint = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((id) => id).handler(createSsrRpc("db3731e1945f4d919f9d071f831d841e25ddb5d8964299935849e81c5d2fac1a"));
var createComplaint = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("18c4fb8114c92db89d0523d2ae7b8a4f69f1399a656846fca265deb4bccf4829"));
var analyzeComplaint = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("eaca3ac85cfbcdb29c78c718a3b2a3a32837efbbd93cbdd24ce83c8b378ee76c"));
createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((id) => id).handler(createSsrRpc("5a8be71b0b333fff9e41e622153849a743cd4d30a4b9399566f37d3822ce4366"));
var patchComplaint = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("8f439186f71b87f15294ea98622f2b326c513ca41c3560116252a7d4f905f8f6"));
var listNotifications = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("bb22e3016157a9049fa5cbf1c231c5937a17c782538d2ff06c877fec89f09afa"));
var markNotificationRead = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((id) => id).handler(createSsrRpc("a84e67de074e9f471293922c30d829fde731237341a9b5912cea6b7e6d748d0d"));
var analyticsOverview = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("027b3642c1f5bf023e3fbfd143f9d05e148a62e1154dec45c378c9f368914bbf"));
var analyticsBreakdown = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("f6493f0f004986f61909a578b9c25329a06b22fb1a59c145db73a267aec40d23"));
var analyzeCctv = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("197d789717f667e5783e96553265cd3e0c8d16cb54a700b2b3db89dffa420303"));
var listIncidents = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("f77a67027a8339966847b2b9b1f2e022e401af7037b60c07f64fd3ef798d0dde"));
var citizenStats = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("11a2faf09d891c5b8ecf633a10be7033037d422e6801388d2c5fa61b535c0822"));
//#endregion
export { patchComplaint as _, bootstrapMe as a, createComplaint as c, listAdminComplaints as d, listIncidents as f, markNotificationRead as g, listOfficerQueue as h, analyzeComplaint as i, getComplaint as l, listNotifications as m, analyticsOverview as n, citizenStats as o, listMyComplaints as p, analyzeCctv as r, cn as s, analyticsBreakdown as t, getPublicPins as u };
