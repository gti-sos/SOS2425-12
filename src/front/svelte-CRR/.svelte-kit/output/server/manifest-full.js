export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.png"]),
	mimeTypes: {".png":"image/png"},
	_: {
		client: {start:"_app/immutable/entry/start.DPeCfBlj.js",app:"_app/immutable/entry/app.Ba6Pa639.js",imports:["_app/immutable/entry/start.DPeCfBlj.js","_app/immutable/chunks/Baykk5sG.js","_app/immutable/chunks/BNcx3LAd.js","_app/immutable/chunks/B7c6h4Q9.js","_app/immutable/entry/app.Ba6Pa639.js","_app/immutable/chunks/BNcx3LAd.js","_app/immutable/chunks/CF1z4Vv1.js","_app/immutable/chunks/DlJmpeef.js","_app/immutable/chunks/B7c6h4Q9.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js'))
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
