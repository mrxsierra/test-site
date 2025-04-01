// Determine base path dynamically
let isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
let base = isLocal ? "./" : "/test-site/";

export let basepath = base;
export let html_assets_path = base + "html_assets/";

console.log(basepath);
console.log(html_assets_path);