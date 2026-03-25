import { Renderer, Program, Mesh, Triangle } from 'https://cdn.jsdelivr.net/npm/ogl/+esm';

const hexToRgb = hex => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return [1, 0.5, 0.2];
  return [parseInt(result[1], 16) / 255, parseInt(result[2], 16) / 255, parseInt(result[3], 16) / 255];
};

const vertex = `#version 300 es
precision highp float;
in vec2 position;
in vec2 uv;
out vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragment = `#version 300 es
// Using highest precision logic for modern WebGL 2 (required for smooth raymarching)
precision highp float;
uniform vec2 iResolution;
uniform float iTime;
uniform vec3 uCustomColor;
uniform float uUseCustomColor;
uniform float uSpeed;
uniform float uDirection;
uniform float uScale;
uniform float uOpacity;
uniform vec2 uMouse;
uniform float uMouseInteractive;
out vec4 fragColor;

// Polyfill for tanh in case mobile devices fail with built-in tanh
vec3 myTanh(vec3 x) {
    vec3 e2x = exp(2.0 * x);
    return (e2x - 1.0) / (e2x + 1.0);
}

void mainImage(out vec4 o, vec2 C) {
  vec2 center = iResolution.xy * 0.5;
  C = (C - center) / uScale + center;
  
  vec2 mouseOffset = (uMouse - center) * 0.0002;
  C += mouseOffset * length(C - center) * step(0.5, uMouseInteractive);
  
  // Safe initialization necessary outside of Shadertoy
  float i = 0.0, d = 0.0, z = 0.0, T = iTime * uSpeed * uDirection;
  vec3 O = vec3(0.0), p, S;
  o = vec4(0.0); // Reset o just in case

  // Highly Optimized Raymarching: Max 40 steps instead of 60 for significant performance uplift!
  for (vec2 r = iResolution.xy, Q; ++i < 40.; O += o.w/d*o.xyz) {
    p = z * normalize(vec3(C - 0.5*r, r.y)); 
    p.z -= 4.0; 
    S = p;
    d = p.y - T;
    
    // Core Plasma Liquid Wave Magic
    p.x += 0.4 * (1.0 + p.y) * sin(d + p.x * 0.1) * cos(0.34 * d + p.x * 0.05); 
    
    // Optimized Rotation Matrix
    float c = cos(p.y - T);
    float s = sin(p.y - T);
    mat2 rot = mat2(c, s, -s, c);
    p.xz = rot * p.xz;
    Q = p.xz;
    
    z += d = abs(length(Q) - 0.25 * (5.0 + S.y)) / 3.0 + 8e-4; 
    o = 1.0 + sin(S.y + p.z * 0.5 + S.z - length(S - p) + vec4(2,1,0,8));
  }
  
  o.xyz = myTanh(O / 1e4);
}

bool finite1(float x){ return !(isnan(x) || isinf(x)); }
vec3 sanitize(vec3 c){
  return vec3(
    finite1(c.r) ? c.r : 0.0,
    finite1(c.g) ? c.g : 0.0,
    finite1(c.b) ? c.b : 0.0
  );
}

void main() {
  vec4 o = vec4(0.0);
  mainImage(o, gl_FragCoord.xy);
  vec3 rgb = sanitize(o.rgb);
  
  // Apply our custom theme color mix logic based on lightness density
  float intensity = (rgb.r + rgb.g + rgb.b) / 3.0;
  vec3 customColor = intensity * uCustomColor;
  vec3 finalColor = mix(rgb, customColor, step(0.5, uUseCustomColor));
  
  // Base Opacity
  float alpha = length(rgb) * uOpacity;
  fragColor = vec4(finalColor, min(alpha, 1.0));
}
`;

export function initPlasmaBackground(containerSelector, options = {}) {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  const {
    color = '#D63447', // Theme accent red/orange exactly!
    speed = 0.6,
    direction = 'forward',
    scale = 1.1,
    opacity = 0.8,
    mouseInteractive = true
  } = options;

  container.style.position = 'relative';
  container.style.overflow = 'hidden';

  const canvasContainer = document.createElement('div');
  canvasContainer.className = 'plasma-container';
  canvasContainer.style.position = 'absolute';
  canvasContainer.style.top = '0';
  canvasContainer.style.left = '0';
  canvasContainer.style.width = '100%';
  canvasContainer.style.height = '100%';
  canvasContainer.style.zIndex = '0';
  canvasContainer.style.pointerEvents = mouseInteractive ? 'auto' : 'none';
  
  Array.from(container.children).forEach(child => {
    if (getComputedStyle(child).position === 'static') {
      child.style.position = 'relative';
    }
    child.style.zIndex = '1';
  });

  container.insertBefore(canvasContainer, container.firstChild);

  const useCustomColor = color ? 1.0 : 0.0;
  const customColorRgb = color ? hexToRgb(color) : [1, 1, 1];
  const directionMultiplier = direction === 'reverse' ? -1.0 : 1.0;

  // STRICT PERFORMANCE MODE: Lock DPR to 1 to ensure zero-lag on retina
  const renderer = new Renderer({
    webgl: 2,
    alpha: true,
    antialias: false,
    dpr: 1 // Crucial for whole-website scroll performance
  });
  const gl = renderer.gl;
  const canvas = gl.canvas;
  canvas.style.display = 'block';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvasContainer.appendChild(canvas);

  const geometry = new Triangle(gl);
  
  const program = new Program(gl, {
    vertex: vertex,
    fragment: fragment,
    uniforms: {
      iTime: { value: 0 },
      iResolution: { value: new Float32Array([1, 1]) },
      uCustomColor: { value: new Float32Array(customColorRgb) },
      uUseCustomColor: { value: useCustomColor },
      uSpeed: { value: speed * 0.4 },
      uDirection: { value: directionMultiplier },
      uScale: { value: scale },
      uOpacity: { value: opacity },
      uMouse: { value: new Float32Array([0, 0]) },
      uMouseInteractive: { value: mouseInteractive ? 1.0 : 0.0 }
    }
  });

  const mesh = new Mesh(gl, { geometry, program });
  let mousePos = { x: 0, y: 0 };

  const handleMouseMove = e => {
    if (!mouseInteractive) return;
    const rect = canvasContainer.getBoundingClientRect();
    mousePos.x = e.clientX - rect.left;
    mousePos.y = e.clientY - rect.top;
    const mouseUniform = program.uniforms.uMouse.value;
    mouseUniform[0] = mousePos.x;
    mouseUniform[1] = mousePos.y;
  };

  if (mouseInteractive) {
    document.addEventListener('mousemove', handleMouseMove);
  }

  const setSize = () => {
    const rect = canvasContainer.getBoundingClientRect();
    const width = Math.max(1, Math.floor(rect.width));
    const height = Math.max(1, Math.floor(rect.height));
    renderer.setSize(width, height);
    const res = program.uniforms.iResolution.value;
    res[0] = gl.drawingBufferWidth;
    res[1] = gl.drawingBufferHeight;
  };

  window.addEventListener('resize', setSize);
  setSize();

  let raf = 0;
  const t0 = performance.now();
  let isVisible = false; // By default off

  const loop = t => {
    // Zero Performance Penalty when off-screen!
    if (!isVisible) {
      raf = requestAnimationFrame(loop);
      return; 
    }
    
    let timeValue = (t - t0) * 0.001;
    program.uniforms.iTime.value = timeValue;
    
    renderer.render({ scene: mesh });
    raf = requestAnimationFrame(loop);
  };
  raf = requestAnimationFrame(loop);

  // Performance Enhancement: Only compute WebGL when user is actually looking at Newsletter Section!
  if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(entries => {
          entries.forEach(entry => {
              isVisible = entry.isIntersecting;
          });
      }, { threshold: 0.01 });
      observer.observe(container);
  } else {
      isVisible = true; // Fallback
  }
}

// Ensure execution triggers correctly without getting deferred blocked
function startPlasmaSafe() {
  initPlasmaBackground('#newsletter-section', {
    color: "#D63447", // Irfan's Core Tech Brew Theme Red
    speed: 0.6,
    direction: "forward",
    scale: 1.1,
    opacity: 0.8,
    mouseInteractive: true
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", startPlasmaSafe);
} else {
  // Execute immediately if we arrive post-load
  startPlasmaSafe();
}
