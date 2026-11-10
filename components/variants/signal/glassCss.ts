/**
 * Shared glass material for variants 11-13. Each variant supplies the --glass-* values.
 * Web glassmorphism built from backdrop-filter, with a solid fallback.
 */
export const glassCss = `
.glass {
  background: var(--glass-bg);
  border: 1px solid var(--glass-line);
  border-radius: var(--glass-r);
  box-shadow: inset 0 1px 0 var(--glass-hi), 0 18px 40px var(--glass-shadow);
  -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(170%);
  backdrop-filter: blur(var(--glass-blur)) saturate(170%);
  transition: border-color .35s ease, box-shadow .35s ease;
}
.glass-lit {
  border-color: var(--glass-lit);
  box-shadow: inset 0 1px 0 var(--glass-hi), inset 0 0 30px var(--glass-lit-soft), 0 18px 40px var(--glass-shadow);
}
.glass-bad {
  border-color: var(--bad);
  box-shadow: inset 0 1px 0 var(--glass-hi), inset 0 0 30px var(--bad-soft), 0 18px 40px var(--glass-shadow);
}
.glass-field {
  background: var(--field-bg);
  border: 1px solid var(--glass-line);
  border-radius: 10px;
  color: var(--fg);
}
.jack {
  width: 24px; height: 24px; border-radius: 9999px;
  background: var(--jack);
  box-shadow: 0 0 0 3px var(--jack-ring), inset 0 2px 3px rgba(0,0,0,.5);
}
.vd { font-family: var(--vd); }
.cta {
  background-image: linear-gradient(110deg, var(--cta) 42%, var(--cta-shine) 50%, var(--cta) 58%);
  background-size: 260% 100%;
  background-position: 100% 0;
  color: var(--cta-fg);
  transition: background-position .7s cubic-bezier(.16,1,.3,1);
}
.cta:hover { background-position: 0 0; }
.rise-letter { animation: rise-letter .9s cubic-bezier(.16,1,.3,1) backwards; }
@keyframes rise-letter { from { transform: translateY(115%); } }
@media (prefers-reduced-motion: reduce) {
  .rise-letter { animation: none; }
}
@media (prefers-reduced-transparency: reduce) {
  .glass { background: var(--glass-solid); -webkit-backdrop-filter: none; backdrop-filter: none; }
}
@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
  .glass { background: var(--glass-solid); }
}`;
