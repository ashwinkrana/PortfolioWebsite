/**
 * GLSL for the homepage Silk background. Original shader, modelled on the look of
 * the ReactBits Silk background. Colours stay light so dark page text stays readable.
 */

export const vertexShader = `
// One 2D corner of the full-screen triangle, supplied by the engine.
attribute vec2 aPosition;
void main() {
  // Clip space already spans -1 to 1, so the position passes straight through.
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

export const fragmentShader = `
// Use high precision so slow animation does not band or stutter.
precision highp float;
// Size of the drawing buffer in pixels.
uniform vec2 uRes;
// Seconds of animation, paused whenever the page is hidden.
uniform float uTime;
// Smoothed pointer position, 0 to 1 on both axes, y pointing up.
uniform vec2 uMouse;

// Height of the cloth at point p and time t.
float folds(vec2 p, float t) {
  // Push x sideways by a wave in y, so straight folds start to bend.
  p.x += 0.35 * sin(p.y * 1.6 + t * 0.7);
  // Push y by a wave in x, so the bends curl back the other way.
  p.y += 0.25 * sin(p.x * 1.3 - t * 0.5);
  // Add three sine layers: broad folds, diagonal folds, fine ripples.
  return sin(p.x * 3.1 + t) + 0.6 * sin((p.x + p.y) * 4.7 - t * 0.8) + 0.35 * sin(p.y * 7.3 + t * 0.6);
}

void main() {
  // Turn the pixel position into 0 to 1 across the screen.
  vec2 uv = gl_FragCoord.xy / uRes;
  // Start the cloth coordinates from that position.
  vec2 p = uv;
  // Correct for screen shape so folds are not stretched on wide displays.
  p.x *= uRes.x / uRes.y;
  // Zoom out slightly so several large folds fit on screen.
  p *= 1.2;
  // Slow the clock right down; silk should drift, not ripple.
  float t = uTime * 0.18;
  // Small step used to measure the slope of the cloth.
  float e = 0.004;
  // Height at this pixel.
  float h = folds(p, t);
  // Slope along x, measured by comparing a nearby height.
  float dx = folds(p + vec2(e, 0.0), t) - h;
  // Slope along y, measured the same way.
  float dy = folds(p + vec2(0.0, e), t) - h;
  // Build the surface direction from those slopes; 0.16 gives folds visible depth.
  vec3 normal = normalize(vec3(-dx / e * 0.16, -dy / e * 0.16, 1.0));
  // Aim the light from the pointer, so the sheen follows the cursor.
  vec3 light = normalize(vec3((uMouse - 0.5) * 1.6, 0.9));
  // Soft shading: how directly this bit of cloth faces the light.
  float diffuse = clamp(dot(normal, light), 0.0, 1.0);
  // Tight highlight: the bright glint that makes it read as satin.
  float glint = pow(max(dot(reflect(-light, normal), vec3(0.0, 0.0, 1.0)), 0.0), 24.0);
  // Base cloth colour, a cool pearl.
  vec3 pearl = vec3(0.93, 0.95, 0.97);
  // Three tints borrowed from the page's own orange, teal and pink.
  vec3 peach = vec3(1.0, 0.72, 0.55);
  vec3 teal = vec3(0.55, 0.87, 0.92);
  vec3 pink = vec3(0.98, 0.68, 0.80);
  // Slow left-to-right blend between the warm tints.
  float blendA = 0.5 + 0.5 * sin(p.x * 1.1 + t * 0.6);
  // Slow top-to-bottom signal that decides where teal appears.
  float blendB = 0.5 + 0.5 * sin(p.y * 1.4 - t * 0.4 + 1.7);
  // Blend the two warm tints first; peach straight into teal would average out to grey.
  vec3 warm = mix(peach, pink, blendA);
  // Bring teal in only as distinct patches, with a narrow crossover between the two.
  vec3 tint = mix(warm, teal, smoothstep(0.58, 0.82, blendB));
  // Lay the tint over pearl, a little stronger on the raised folds.
  vec3 color = mix(pearl, tint, 0.68 + 0.09 * h);
  // Shade the folds, with a floor high enough that dark text stays readable.
  color *= 0.84 + 0.2 * diffuse;
  // Add a restrained glint so highlights do not blow out to white.
  color += glint * 0.16;
  // Output the final colour, fully opaque.
  gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
}
`;
