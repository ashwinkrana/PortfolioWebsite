import { fragmentShader, vertexShader } from "./backgroundShaders";

const MAX_DPR = 1.5; // Never render above 1.5x, even on very dense screens.
const RENDER_SCALE = 0.5; // Silk has only soft shapes, so half resolution scales up invisibly.
const MAX_DELTA = 0.05; // Longest time step in seconds, so a stall cannot cause a jump.
const FRAME_MS = 1000 / 45; // Cap at 45fps; backdrop blur re-composites on every frame.

export type BackgroundEngine = { dispose: () => void };

/** Returns null when WebGL is unavailable, which leaves the CSS fallback showing. */
export function createBackgroundEngine(
  canvas: HTMLCanvasElement,
  reduceMotion: boolean,
  onLost: () => void
): BackgroundEngine | null {
  // Ask for a plain WebGL context; no alpha or depth buffer is needed for a flat background.
  const gl = canvas.getContext("webgl", { alpha: false, antialias: false, depth: false, powerPreference: "low-power" });
  if (!gl) return null;
  const context = gl;

  // Compile one shader stage from its GLSL source.
  const compile = (type: number, source: string) => {
    // Allocate an empty shader object on the GPU.
    const shader = context.createShader(type)!;
    // Hand it the GLSL text.
    context.shaderSource(shader, source);
    // Compile the text into GPU code.
    context.compileShader(shader);
    return shader;
  };

  // Compile the vertex stage.
  const vs = compile(context.VERTEX_SHADER, vertexShader);
  // Compile the pixel stage.
  const fs = compile(context.FRAGMENT_SHADER, fragmentShader);
  // Create the program that joins the two stages.
  const program = context.createProgram()!;
  // Attach the vertex stage.
  context.attachShader(program, vs);
  // Attach the pixel stage.
  context.attachShader(program, fs);
  // Put the position attribute in slot 0, where the vertex setup below expects it.
  context.bindAttribLocation(program, 0, "aPosition");
  // Link the stages into something runnable.
  context.linkProgram(program);
  // Stages can be flagged for deletion now; the program keeps them alive.
  context.deleteShader(vs);
  context.deleteShader(fs);
  // On a failed link, give up and let the CSS fallback stand.
  if (!context.getProgramParameter(program, context.LINK_STATUS)) {
    context.deleteProgram(program);
    return null;
  }
  // Make this the program all draw calls use.
  context.useProgram(program);

  // Look up where each uniform lives so it can be written every frame.
  const uRes = context.getUniformLocation(program, "uRes");
  const uTime = context.getUniformLocation(program, "uTime");
  const uMouse = context.getUniformLocation(program, "uMouse");

  // Allocate a GPU buffer for the triangle's corners.
  const buffer = context.createBuffer();
  // Make it the active vertex buffer.
  context.bindBuffer(context.ARRAY_BUFFER, buffer);
  // One oversized triangle covers the whole screen with fewer vertices than a quad.
  context.bufferData(context.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), context.STATIC_DRAW);
  // Enable slot 0, where the program reads its position.
  context.enableVertexAttribArray(0);
  // Describe the data: two floats per corner, tightly packed.
  context.vertexAttribPointer(0, 2, context.FLOAT, false, 0, 0);

  let time = 7; // Start part-way in so the first frame is already an interesting shape.
  let last = 0;
  let raf = 0;
  let running = false;
  let onScreen = true;
  let disposed = false;
  let lost = false; // True once the GPU has dropped the context; nothing can draw after that.
  // Start above the screen so the light is neutral until the pointer actually moves.
  const target = { x: 0.5, y: 1.2 };
  const mouse = { x: 0.5, y: 1.2 };

  const draw = () => {
    // Tell the shader the drawing buffer's size.
    context.uniform2f(uRes, canvas.width, canvas.height);
    // Tell it the current animation time.
    context.uniform1f(uTime, time);
    // Tell it where the smoothed pointer is.
    context.uniform2f(uMouse, mouse.x, mouse.y);
    // Draw the three corners as one triangle.
    context.drawArrays(context.TRIANGLES, 0, 3);
  };

  const resize = () => {
    // Combine the DPR cap with the resolution scale.
    const scale = Math.min(window.devicePixelRatio || 1, MAX_DPR) * RENDER_SCALE;
    const width = Math.max(1, Math.round(canvas.clientWidth * scale));
    const height = Math.max(1, Math.round(canvas.clientHeight * scale));
    if (canvas.width === width && canvas.height === height) return;
    // Resizing the drawing buffer also clears it.
    canvas.width = width;
    canvas.height = height;
    // Keep the GPU's output rectangle in step with the buffer.
    context.viewport(0, 0, width, height);
    // Redraw at once so a paused or reduced-motion page is never left blank.
    draw();
  };

  const frame = (now: number) => {
    raf = requestAnimationFrame(frame);
    // Skip this frame if the cap has not elapsed yet.
    if (now - last < FRAME_MS) return;
    // Clamp the elapsed time so a stall resumes smoothly.
    const delta = Math.min((now - last) / 1000, MAX_DELTA);
    last = now;
    time += delta;
    // Ease the pointer towards its target so the sheen feels weighty.
    mouse.x += (target.x - mouse.x) * 0.06;
    mouse.y += (target.y - mouse.y) * 0.06;
    draw();
  };

  const updateRunning = () => {
    // Run only when motion is allowed, the canvas is visible and the context is still alive.
    const shouldRun = !reduceMotion && onScreen && !document.hidden && !disposed && !lost;
    if (shouldRun === running) return;
    running = shouldRun;
    if (running) {
      last = performance.now();
      raf = requestAnimationFrame(frame);
    } else {
      cancelAnimationFrame(raf);
    }
  };

  const onPointer = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    target.x = e.clientX / window.innerWidth;
    // Flip y, because GLSL measures from the bottom of the screen.
    target.y = 1 - e.clientY / window.innerHeight;
  };

  const onContextLost = (e: Event) => {
    // Stop drawing and hand over to the CSS fallback.
    e.preventDefault();
    // Remember the loss so a later tab switch cannot restart the loop.
    lost = true;
    cancelAnimationFrame(raf);
    running = false;
    onLost();
  };

  const resizeObserver = new ResizeObserver(resize);
  const intersectionObserver = new IntersectionObserver(([entry]) => {
    onScreen = entry.isIntersecting;
    updateRunning();
  });

  resizeObserver.observe(canvas);
  intersectionObserver.observe(canvas);
  document.addEventListener("visibilitychange", updateRunning);
  canvas.addEventListener("webglcontextlost", onContextLost);
  // Reduced motion draws one still frame and never listens to the pointer.
  if (!reduceMotion) window.addEventListener("pointermove", onPointer, { passive: true });

  resize();
  draw();
  updateRunning();

  return {
    dispose() {
      disposed = true;
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", updateRunning);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      window.removeEventListener("pointermove", onPointer);
      // Free the compiled program on the GPU.
      context.deleteProgram(program);
      // Free the triangle buffer.
      context.deleteBuffer(buffer);
      // Release the whole context now instead of waiting for garbage collection.
      context.getExtension("WEBGL_lose_context")?.loseContext();
    },
  };
}
