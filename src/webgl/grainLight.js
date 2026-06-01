// grainLight.js — the shader for the cinematic overlay.
//
// This is NOT 3D. It's a single full-screen fragment shader that paints two filmic things
// over the whole page (the canvas blends with `mix-blend-mode: soft-light`):
//   1. animated film grain — the analog-film texture the Kodak-Portra brand leans on
//   2. a soft light bloom whose color tracks the day→night arc (warm at dawn, cool at night)
// Output is centered on ~0.5 gray so soft-light leaves the page's brightness alone and only
// adds texture + a gentle graded light. Deliberately subtle — felt more than seen.

export const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`

export const fragmentShader = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;        // seconds, for animating the grain
  uniform float uProgress;    // 0 = dawn ... 1 = night (from the scroll arc)
  uniform vec2  uResolution;  // device-pixel size, so grain is ~1px regardless of DPR
  uniform float uGrain;       // grain amount (0..1-ish); tuned small

  // cheap hash noise — good enough for film grain, costs almost nothing
  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  void main() {
    // 1px-ish grain that re-randomizes every frame
    float g = hash(vUv * uResolution + fract(uTime) * 753.0);

    // soft light bloom from the upper-middle, like a window or a low sun
    float d = distance(vUv, vec2(0.5, 0.22));
    float bloom = smoothstep(0.95, 0.0, d);

    // light color warms at dawn, cools toward night
    vec3 warm = vec3(1.0, 0.85, 0.60);
    vec3 cool = vec3(0.52, 0.60, 0.86);
    vec3 lightCol = mix(warm, cool, uProgress);

    // cinematic vignette — gently darkens the far corners (0 at center, ~-0.08 at corners)
    float vigEdge = smoothstep(0.30, 0.72, distance(vUv, vec2(0.5)));
    float vignette = -0.08 * vigEdge;

    // assemble around neutral 0.5 so soft-light only adds texture + graded light + vignette
    float grain = (g - 0.5) * uGrain;
    vec3 col = vec3(0.5) + grain + (lightCol - 0.5) * bloom * 0.26 + vignette;

    gl_FragColor = vec4(col, 1.0);
  }
`
