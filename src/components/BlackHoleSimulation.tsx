import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Orbit, Move, Maximize2, Minimize2, Zap, Layers, Sparkles } from 'lucide-react';

interface BlackHoleSimulationProps {
  className?: string;
}

export const BlackHoleSimulation: React.FC<BlackHoleSimulationProps> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Ice White is the default color palette requested by user
  const [colorPreset, setColorPreset] = useState<'ice' | 'glacier' | 'pure_white'>('ice');
  const [gravityPreset, setGravityPreset] = useState<'normal' | 'intense' | 'supermassive'>('intense');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [fps, setFps] = useState<number>(60);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  // Mutable animation state
  const animStateRef = useRef({
    gl: null as WebGL2RenderingContext | null,
    program: null as WebGLProgram | null,
    uniforms: {} as Record<string, WebGLUniformLocation>,
    mouseTarget: { x: 0, y: 0 },
    mouseCurrent: { x: 0, y: 0 },
    mouseStrength: 0.6,
    startTime: performance.now(),
    frameId: 0,
    gravitySpeed: 2.8,
    // Branco Gelo: Ice White with cold crystal undertone
    colorFront: [0.92, 0.96, 1.0, 1.0], // Ice White (#EAF4FC)
    colorHorizon: [1.0, 1.0, 1.0, 1.0], // Pure Luminous White
    scaleVal: 0.32, // Exact Drael scale
    pxSize: 3.4, // Exact Drael point size
  });

  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  }, []);

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Update uniforms when state changes
  useEffect(() => {
    const state = animStateRef.current;
    if (gravityPreset === 'normal') state.gravitySpeed = 1.8;
    else if (gravityPreset === 'intense') state.gravitySpeed = 2.8;
    else state.gravitySpeed = 4.2;
  }, [gravityPreset]);

  useEffect(() => {
    const state = animStateRef.current;
    if (colorPreset === 'ice') {
      // Branco Gelo clássico Drael (#EAF4FC)
      state.colorFront = [0.92, 0.96, 1.0, 1.0];
      state.colorHorizon = [1.0, 1.0, 1.0, 1.0];
    } else if (colorPreset === 'glacier') {
      // Branco Gelo Glacial com leve ciano polar (#E0F7FA)
      state.colorFront = [0.88, 0.97, 1.0, 1.0];
      state.colorHorizon = [0.8, 1.0, 1.0, 1.0];
    } else {
      // Branco Titânio Absoluto (#FFFFFF)
      state.colorFront = [1.0, 1.0, 1.0, 1.0];
      state.colorHorizon = [1.0, 1.0, 1.0, 1.0];
    }
  }, [colorPreset]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const gl = canvas.getContext('webgl2', {
      alpha: true,
      antialias: false,
      powerPreference: 'high-performance',
      premultipliedAlpha: false,
    });

    if (!gl) {
      console.warn('WebGL2 not supported, fallback active');
      return;
    }
    animStateRef.current.gl = gl;

    // Fullscreen quad vertex shader
    const vsSource = `#version 300 es
      in vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    // Fragment Shader reproducing the exact Drael Swirl & Bayer Stippling format in Ice White
    const fsSource = `#version 300 es
      precision highp float;

      uniform float u_time;
      uniform vec2 u_resolution;
      uniform float u_pixelRatio;
      uniform vec2 u_mouse;
      uniform float u_mouseStrength;
      uniform float u_scale;
      uniform float u_pxSize;
      uniform vec4 u_colorFront;
      uniform vec4 u_colorHorizon;
      uniform float u_speed;

      out vec4 fragColor;

      #define TWO_PI 6.28318530718
      #define PI 3.14159265358979323846

      // Exact Drael Bayer 4x4 Dithering Matrix
      const int bayer4x4[16] = int[16](
        0,  8,  2, 10,
       12,  4, 14,  6,
        3, 11,  1,  9,
       15,  7, 13,  5
      );

      float getBayerValue(vec2 uv, int size) {
        ivec2 pos = ivec2(fract(uv / float(size)) * float(size));
        int index = pos.y * size + pos.x;
        return float(bayer4x4[index]) / 16.0;
      }

      void main() {
        // Drael time parameter
        float t = u_time * u_speed * 0.18;
        float pxSize = max(1.0, u_pxSize * u_pixelRatio);

        // 1. Drael Pixelized Stippled UV calculation
        vec2 pxSizeUV = gl_FragCoord.xy - 0.5 * u_resolution;
        pxSizeUV /= pxSize;
        vec2 canvasPixelizedUV = (floor(pxSizeUV) + 0.5) * pxSize;
        vec2 normalizedUV = canvasPixelizedUV / u_resolution;

        // 2. Drael Shape Coordinate Fitting (cover mode)
        vec2 shapeUV = normalizedUV;
        float maxDim = max(u_resolution.x, u_resolution.y);
        vec2 objectWorldScale = u_resolution.xy / maxDim;
        shapeUV *= objectWorldScale;
        shapeUV += vec2(0.5, -0.5) * (objectWorldScale - 1.0);

        // Gravitational displacement tracking mouse
        shapeUV -= vec2(0.5, 0.5);
        shapeUV -= u_mouse * 0.35 * u_mouseStrength;
        shapeUV /= u_scale;

        // 3. Exact Drael Swirl Geometry (Shape 6 on drael.sh)
        float l = length(shapeUV);
        float angle = 6.0 * atan(shapeUV.y, shapeUV.x) + 4.0 * t;
        float twist = 1.2;
        float offset = 1.0 / pow(max(l, 1e-6), twist) + angle / TWO_PI;
        float mid = smoothstep(0.0, 1.0, pow(l, twist));
        float swirl = mix(0.0, fract(offset), mid);

        // 4. BORDAS DO HORIZONTE DE EVENTOS (LUZ TENTANDO ESCAPAR)
        // Raio Schwarzschild central (escuridão total no centro da singularidade)
        float horizonRadius = 0.08;
        float singularityVoid = smoothstep(horizonRadius * 0.75, horizonRadius * 1.12, l);

        // Relativistic Escaping Light Flares:
        // No contorno do horizonte de eventos, a luz se estica e luta para escapar antes de ser curvada
        float escapeAngle = angle * 2.5 - t * 3.0;
        float escapeTendrils = pow(abs(cos(escapeAngle)), 10.0) * (0.8 + 0.2 * sin(t * 6.0));
        float photonRim = smoothstep(0.07, 0.13, l) * (1.0 - smoothstep(0.13, 0.38, l));
        float lightBurst = photonRim * escapeTendrils * 1.8;

        // Combina o formato exato do swirl da Drael com os jatos de luz em fuga do horizonte
        float shape = (swirl * 0.9 + lightBurst) * singularityVoid;

        // 5. Drael Bayer 4x4 Dithering (Cria os pontos minúsculos estocásticos ordenados)
        float dithering = getBayerValue(pxSizeUV, 4);
        dithering -= 0.5;

        // Step function creates crisp, micro-stippled points
        float res = step(0.5, shape + dithering);

        // 6. Paleta Branco Gelo (Ice White) & Brilho Relativístico nos Pontos
        vec3 fgColor = u_colorFront.rgb;
        vec3 escapeColor = u_colorHorizon.rgb;

        // Efeito Doppler e calor de luz nos pontos de fuga da borda
        float rimProximity = smoothstep(horizonRadius * 3.0, horizonRadius * 1.05, l);
        vec3 pointColor = mix(fgColor, escapeColor, rimProximity);

        // Os pontos no anel de fótons atingem branco gelo puro com intensidade estelar
        float flareIntensity = smoothstep(0.05, 0.0, abs(l - horizonRadius * 1.3)) * escapeTendrils;
        pointColor = mix(pointColor, vec3(1.0, 1.0, 1.0), flareIntensity);

        // Saída final: pontos em Branco Gelo sobre fundo preto cósmico (#000000)
        vec3 finalColor = pointColor * res * singularityVoid;
        float opacity = res * singularityVoid;

        fragColor = vec4(finalColor, opacity);
      }
    `;

    // Compile Shader Helper
    const compileShader = (type: number, src: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, src);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compile error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vs = compileShader(gl.VERTEX_SHADER, vsSource);
    const fs = compileShader(gl.FRAGMENT_SHADER, fsSource);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program));
      return;
    }
    animStateRef.current.program = program;
    gl.useProgram(program);

    // Quad geometry covering fullscreen
    const posBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0]),
      gl.STATIC_DRAW
    );

    const posAttr = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(posAttr);
    gl.vertexAttribPointer(posAttr, 2, gl.FLOAT, false, 0, 0);

    // Cache Uniform Locations
    const uniformNames = [
      'u_time',
      'u_resolution',
      'u_pixelRatio',
      'u_mouse',
      'u_mouseStrength',
      'u_scale',
      'u_pxSize',
      'u_colorFront',
      'u_colorHorizon',
      'u_speed',
    ];
    uniformNames.forEach((name) => {
      animStateRef.current.uniforms[name] = gl.getUniformLocation(program, name)!;
    });

    // Resize Handler
    const updateSize = () => {
      if (!container || !canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
      const width = Math.round(container.clientWidth * dpr);
      const height = Math.round(container.clientHeight * dpr);

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
    };
    updateSize();

    const resizeObserver = new ResizeObserver(updateSize);
    resizeObserver.observe(container);

    // Mouse Tracking with smooth gravitational attraction
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      animStateRef.current.mouseTarget = { x, y };
      animStateRef.current.mouseStrength = 1.0;
    };

    const handleMouseEnter = () => {
      setIsHovered(true);
      animStateRef.current.mouseStrength = 1.0;
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
      animStateRef.current.mouseTarget = { x: 0, y: 0 };
      animStateRef.current.mouseStrength = 0.5;
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);

    // Render Loop
    let lastFpsUpdate = performance.now();
    let frameCount = 0;

    const render = () => {
      const now = performance.now();
      const state = animStateRef.current;
      const u = state.uniforms;

      // FPS calculation
      frameCount++;
      if (now - lastFpsUpdate > 600) {
        setFps(Math.round((frameCount * 1000) / (now - lastFpsUpdate)));
        frameCount = 0;
        lastFpsUpdate = now;
      }

      // Smooth exponential mouse inertia (Drael gravitational weight)
      state.mouseCurrent.x += (state.mouseTarget.x - state.mouseCurrent.x) * 0.07;
      state.mouseCurrent.y += (state.mouseTarget.y - state.mouseCurrent.y) * 0.07;

      gl.useProgram(program);

      // Set Uniforms matching exact Drael configuration
      gl.uniform1f(u.u_time, (now - state.startTime) / 1000.0);
      gl.uniform2f(u.u_resolution, canvas.width, canvas.height);
      gl.uniform1f(u.u_pixelRatio, Math.min(window.devicePixelRatio || 1, 2.5));
      gl.uniform2f(u.u_mouse, state.mouseCurrent.x, state.mouseCurrent.y);
      gl.uniform1f(u.u_mouseStrength, state.mouseStrength);
      gl.uniform1f(u.u_scale, state.scaleVal);
      gl.uniform1f(u.u_pxSize, state.pxSize);
      gl.uniform4fv(u.u_colorFront, new Float32Array(state.colorFront));
      gl.uniform4fv(u.u_colorHorizon, new Float32Array(state.colorHorizon));
      gl.uniform1f(u.u_speed, state.gravitySpeed);

      gl.drawArrays(gl.TRIANGLES, 0, 6);

      state.frameId = requestAnimationFrame(render);
    };

    animStateRef.current.frameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animStateRef.current.frameId);
      resizeObserver.disconnect();
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);

      gl.deleteBuffer(posBuffer);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full rounded-2xl overflow-hidden border border-white/10 bg-[#000000] shadow-2xl transition-all duration-500 group select-none ${className} ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none max-h-none h-screen' : 'aspect-[16/9] max-h-[620px]'
      }`}
    >
      {/* 4K WebGL2 Shader Canvas (Branco Gelo Drael) */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Drael-Style Top Left Spec Badge */}
      <div className="absolute top-5 left-5 pointer-events-none flex flex-col gap-1.5 z-10">
        <div className="flex items-center gap-2">
          <div className="px-3 py-1 rounded-md bg-black/85 backdrop-blur-md border border-white/30 text-[11px] font-mono font-bold text-white flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.2)]">
            <Orbit className="w-3.5 h-3.5 text-white animate-spin" style={{ animationDuration: '14s' }} />
            <span>BURACO NEGRO 4K · BRANCO GELO DRAEL</span>
          </div>
          <div className="px-2.5 py-1 rounded-md bg-black/75 backdrop-blur-md border border-white/15 text-[10px] font-mono text-neutral-300">
            BAYER 4x4 (PONTOS DRAEL)
          </div>
        </div>

        <div className="flex items-center gap-2 text-[10px] font-mono text-neutral-400 pl-1">
          <span className="flex items-center gap-1 text-white font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_6px_#fff]"></span>
            {fps} FPS
          </span>
          <span className="text-neutral-600">·</span>
          <span className="text-neutral-300">HORIZONTE DE EVENTOS: LUZ EM FUGA</span>
          <span className="text-neutral-600">·</span>
          <span className="text-white flex items-center gap-1 font-medium">
            <Move className="w-3 h-3 text-white" />
            GRAVITAÇÃO INTERATIVA (MOUSE)
          </span>
        </div>
      </div>

      {/* Top Right: Fullscreen Button */}
      <div className="absolute top-5 right-5 flex items-center gap-2 z-10">
        <button
          onClick={toggleFullscreen}
          className="p-2.5 rounded-lg bg-black/80 backdrop-blur-md border border-white/15 text-neutral-300 hover:text-white hover:border-white/50 transition-colors shadow-lg"
          title={isFullscreen ? 'Sair de tela cheia' : 'Expandir para tela cheia'}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4 text-white" /> : <Maximize2 className="w-4 h-4 text-white" />}
        </button>
      </div>

      {/* Guide watermark on hover */}
      <div
        className={`absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none transition-opacity duration-700 ${
          isHovered ? 'opacity-0' : 'opacity-40 hover:opacity-0'
        }`}
      >
        <div className="px-4 py-2 rounded-full bg-black/75 border border-white/15 text-xs font-mono text-neutral-200 flex items-center gap-2 shadow-xl">
          <Move className="w-3.5 h-3.5 text-white" />
          <span>Mova o mouse para atrair a matéria e deformar a luz do horizonte</span>
        </div>
      </div>

      {/* Bottom Floating Telemetry & Physics Controls Dock (Drael Aesthetic) */}
      <div className="absolute bottom-5 left-5 right-5 flex flex-wrap items-center justify-between gap-4 p-3.5 rounded-xl bg-black/85 backdrop-blur-md border border-white/15 z-10">
        {/* Core Architecture Info */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-neutral-950 flex items-center justify-center border border-white/30 shadow-[0_0_15px_rgba(255,255,255,0.2)]">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-[10px] text-neutral-300 font-mono tracking-wider font-semibold">
              HORIZONTE SCHWARZSCHILD · PONTOS BRANCO GELO
            </div>
            <div className="text-xs sm:text-sm font-semibold text-white">Loops Relativistic Stipple Engine v3.2</div>
          </div>
        </div>

        {/* Physics Controls: Gravitational Intensity & White Spectrum */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Gravitational Intensity */}
          <div className="flex items-center gap-1 bg-neutral-950/90 p-1 rounded-lg border border-white/15 text-[11px] font-mono">
            <span className="text-neutral-400 px-1.5">Gravidade:</span>
            <button
              onClick={() => setGravityPreset('normal')}
              className={`px-2 py-0.5 rounded transition-all ${
                gravityPreset === 'normal' ? 'bg-white/20 text-white border border-white/40' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Suave
            </button>
            <button
              onClick={() => setGravityPreset('intense')}
              className={`px-2 py-0.5 rounded transition-all ${
                gravityPreset === 'intense' ? 'bg-white/20 text-white border border-white/40' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Relativística
            </button>
            <button
              onClick={() => setGravityPreset('supermassive')}
              className={`px-2 py-0.5 rounded transition-all ${
                gravityPreset === 'supermassive' ? 'bg-white/20 text-white border border-white/40' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Supermassiva
            </button>
          </div>

          {/* Color Spectrum (Ice White Variants) */}
          <div className="flex items-center gap-1 bg-neutral-950/90 p-1 rounded-lg border border-white/15 text-[11px] font-mono">
            <button
              onClick={() => setColorPreset('ice')}
              className={`px-2.5 py-0.5 rounded transition-all ${
                colorPreset === 'ice' ? 'bg-white/25 text-white border border-white/50 font-semibold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Branco Gelo
            </button>
            <button
              onClick={() => setColorPreset('glacier')}
              className={`px-2 py-0.5 rounded transition-all ${
                colorPreset === 'glacier' ? 'bg-white/25 text-white border border-white/50 font-semibold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Glacial
            </button>
            <button
              onClick={() => setColorPreset('pure_white')}
              className={`px-2 py-0.5 rounded transition-all ${
                colorPreset === 'pure_white' ? 'bg-white/25 text-white border border-white/50 font-semibold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Titânio Puro
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
