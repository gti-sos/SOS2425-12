

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/layout.svelte.js')).default;
export const imports = ["_app/immutable/nodes/0.Co75Ri7i.js","_app/immutable/chunks/DlJmpeef.js","_app/immutable/chunks/BNcx3LAd.js"];
export const stylesheets = [];
export const fonts = [];
