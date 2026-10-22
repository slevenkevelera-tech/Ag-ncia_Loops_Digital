import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Neural3DBackgroundProps {
  className?: string;
}

export const Neural3DBackground: React.FC<Neural3DBackgroundProps> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationFrameId: number;
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.z = 240;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0); // Transparent background
    container.appendChild(renderer.domElement);

    // 2. Neural Network 3D Nodes
    const nodeCount = 75;
    const maxConnectionDistance = 75;
    const nodePositions: THREE.Vector3[] = [];
    const nodeVelocities: THREE.Vector3[] = [];

    // Distribute nodes in a 3D ellipsoidal neural manifold
    for (let i = 0; i < nodeCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = Math.cbrt(Math.random()) * 110;

      const sinPhi = Math.sin(phi);
      const x = r * sinPhi * Math.cos(theta) * 1.5;
      const y = r * sinPhi * Math.sin(theta) * 0.9;
      const z = r * Math.cos(phi) * 1.1;

      const pos = new THREE.Vector3(x, y, z);
      nodePositions.push(pos);

      // Gentle floating orbital velocity
      nodeVelocities.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 0.12,
          (Math.random() - 0.5) * 0.12,
          (Math.random() - 0.5) * 0.12
        )
      );
    }

    // Node geometry using Points
    const nodeGeometry = new THREE.BufferGeometry();
    const nodePositionsArray = new Float32Array(nodeCount * 3);
    const nodeColorsArray = new Float32Array(nodeCount * 3);

    for (let i = 0; i < nodeCount; i++) {
      nodePositionsArray[i * 3] = nodePositions[i].x;
      nodePositionsArray[i * 3 + 1] = nodePositions[i].y;
      nodePositionsArray[i * 3 + 2] = nodePositions[i].z;

      // Cyan to ice-white color gradient
      const isCore = i % 4 === 0;
      nodeColorsArray[i * 3] = isCore ? 1.0 : 0.0;     // R
      nodeColorsArray[i * 3 + 1] = isCore ? 1.0 : 0.95; // G
      nodeColorsArray[i * 3 + 2] = 1.0;                 // B
    }

    nodeGeometry.setAttribute('position', new THREE.BufferAttribute(nodePositionsArray, 3));
    nodeGeometry.setAttribute('color', new THREE.BufferAttribute(nodeColorsArray, 3));

    // Custom circular soft glow texture for nodes
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      grad.addColorStop(0.3, 'rgba(0, 240, 255, 0.8)');
      grad.addColorStop(0.7, 'rgba(0, 160, 255, 0.2)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 64, 64);
    }
    const nodeTexture = new THREE.CanvasTexture(canvas);

    const nodeMaterial = new THREE.PointsMaterial({
      size: 4.5,
      map: nodeTexture,
      transparent: true,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.75,
    });

    const pointsMesh = new THREE.Points(nodeGeometry, nodeMaterial);
    scene.add(pointsMesh);

    // 3. Dynamic Neural Connections (Line Segments)
    const maxLines = (nodeCount * (nodeCount - 1)) / 2;
    const linePositions = new Float32Array(maxLines * 6);
    const lineColors = new Float32Array(maxLines * 6);

    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3).setUsage(THREE.DynamicDrawUsage));
    lineGeometry.setAttribute('color', new THREE.BufferAttribute(lineColors, 3).setUsage(THREE.DynamicDrawUsage));

    const lineMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.35, // Kept subtle to protect text readability
    });

    const linesMesh = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(linesMesh);

    // 4. Traveling Synaptic Action Potential Pulses (Data Packets)
    interface Pulse3D {
      fromIdx: number;
      toIdx: number;
      progress: number;
      speed: number;
    }
    const pulses: Pulse3D[] = [];
    const maxPulses = 12;

    const pulseGeometry = new THREE.BufferGeometry();
    const pulsePositionsArray = new Float32Array(maxPulses * 3);
    pulseGeometry.setAttribute('position', new THREE.BufferAttribute(pulsePositionsArray, 3).setUsage(THREE.DynamicDrawUsage));

    const pulseMaterial = new THREE.PointsMaterial({
      size: 5.5,
      map: nodeTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      color: new THREE.Color(0x00ffc8), // Neon mint/cyan electric pulse
      opacity: 0.9,
    });
    const pulseMesh = new THREE.Points(pulseGeometry, pulseMaterial);
    scene.add(pulseMesh);

    // 5. Mouse Parallax (Gentle & Smooth)
    let targetRotationX = 0;
    let targetRotationY = 0;
    let currentRotationX = 0;
    let currentRotationY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      const halfWidth = window.innerWidth / 2;
      const halfHeight = window.innerHeight / 2;
      targetRotationY = ((event.clientX - halfWidth) / halfWidth) * 0.28;
      targetRotationX = ((event.clientY - halfHeight) / halfHeight) * 0.18;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // 6. Resize Handler
    const handleResize = () => {
      if (!container || !renderer) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // 7. Animation Loop
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse lerping
      currentRotationX += (targetRotationX - currentRotationX) * 0.04;
      currentRotationY += (targetRotationY - currentRotationY) * 0.04;

      // Gentle continuous ambient drift + mouse offset
      scene.rotation.y = elapsedTime * 0.05 + currentRotationY;
      scene.rotation.x = Math.sin(elapsedTime * 0.04) * 0.08 + currentRotationX;
      scene.rotation.z = Math.cos(elapsedTime * 0.03) * 0.04;

      // Update Node positions within ellipsoidal bounds
      const nodePosAttr = nodeGeometry.getAttribute('position') as THREE.BufferAttribute;
      const posArray = nodePosAttr.array as Float32Array;

      const activeConnections: { i: number; j: number }[] = [];

      for (let i = 0; i < nodeCount; i++) {
        const pos = nodePositions[i];
        const vel = nodeVelocities[i];

        pos.add(vel);

        // Gentle boundary rebound
        if (Math.abs(pos.x) > 160) vel.x *= -1;
        if (Math.abs(pos.y) > 90) vel.y *= -1;
        if (Math.abs(pos.z) > 110) vel.z *= -1;

        posArray[i * 3] = pos.x;
        posArray[i * 3 + 1] = pos.y;
        posArray[i * 3 + 2] = pos.z;
      }
      nodePosAttr.needsUpdate = true;

      // Update 3D Neural Connections
      let lineVertexIndex = 0;
      let colorVertexIndex = 0;

      for (let i = 0; i < nodeCount; i++) {
        for (let j = i + 1; j < nodeCount; j++) {
          const dx = nodePositions[i].x - nodePositions[j].x;
          const dy = nodePositions[i].y - nodePositions[j].y;
          const dz = nodePositions[i].z - nodePositions[j].z;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist < maxConnectionDistance) {
            activeConnections.push({ i, j });

            // Line segment positions
            linePositions[lineVertexIndex++] = nodePositions[i].x;
            linePositions[lineVertexIndex++] = nodePositions[i].y;
            linePositions[lineVertexIndex++] = nodePositions[i].z;

            linePositions[lineVertexIndex++] = nodePositions[j].x;
            linePositions[lineVertexIndex++] = nodePositions[j].y;
            linePositions[lineVertexIndex++] = nodePositions[j].z;

            // Alpha based on distance
            const alpha = (1 - dist / maxConnectionDistance) * 0.28;

            // Cyan gradient colors
            lineColors[colorVertexIndex++] = 0.0 * alpha; // R
            lineColors[colorVertexIndex++] = 0.9 * alpha; // G
            lineColors[colorVertexIndex++] = 1.0 * alpha; // B

            lineColors[colorVertexIndex++] = 0.0 * alpha; // R
            lineColors[colorVertexIndex++] = 1.0 * alpha; // G
            lineColors[colorVertexIndex++] = 0.8 * alpha; // B
          }
        }
      }

      lineGeometry.setDrawRange(0, lineVertexIndex / 3);
      const linePosAttr = lineGeometry.getAttribute('position') as THREE.BufferAttribute;
      const lineColorAttr = lineGeometry.getAttribute('color') as THREE.BufferAttribute;
      linePosAttr.needsUpdate = true;
      lineColorAttr.needsUpdate = true;

      // Spawn new 3D Synaptic Action Potential Pulses
      if (Math.random() < 0.04 && pulses.length < maxPulses && activeConnections.length > 0) {
        const randomConn = activeConnections[Math.floor(Math.random() * activeConnections.length)];
        pulses.push({
          fromIdx: randomConn.i,
          toIdx: randomConn.j,
          progress: 0,
          speed: 0.015 + Math.random() * 0.02,
        });
      }

      // Update pulses
      const pulsePosAttr = pulseGeometry.getAttribute('position') as THREE.BufferAttribute;
      const pulseArr = pulsePosAttr.array as Float32Array;

      for (let p = pulses.length - 1; p >= 0; p--) {
        const pulse = pulses[p];
        pulse.progress += pulse.speed;

        if (pulse.progress >= 1) {
          pulses.splice(p, 1);
          continue;
        }

        const p1 = nodePositions[pulse.fromIdx];
        const p2 = nodePositions[pulse.toIdx];

        if (p1 && p2) {
          const px = p1.x + (p2.x - p1.x) * pulse.progress;
          const py = p1.y + (p2.y - p1.y) * pulse.progress;
          const pz = p1.z + (p2.z - p1.z) * pulse.progress;

          pulseArr[p * 3] = px;
          pulseArr[p * 3 + 1] = py;
          pulseArr[p * 3 + 2] = pz;
        }
      }

      pulseGeometry.setDrawRange(0, pulses.length);
      pulsePosAttr.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // 8. Clean up WebGL resources on unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);

      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      nodeGeometry.dispose();
      nodeMaterial.dispose();
      nodeTexture.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
      pulseGeometry.dispose();
      pulseMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 pointer-events-none overflow-hidden z-0 ${className}`}
      aria-hidden="true"
    />
  );
};
