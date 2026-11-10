/** Turns off the root layout's custom cursor and ember progress bar inside variants 8-10. */
export const analogReset = `
.pointer-events-none.fixed[class*="z-[90]"],
.pointer-events-none.fixed[class*="z-[91]"],
.pointer-events-none.fixed.origin-left.top-0 { display: none; }
html.cursor-none, html.cursor-none * { cursor: auto !important; }
html.cursor-none a, html.cursor-none button { cursor: pointer !important; }
html.cursor-none input { cursor: text !important; }`;
