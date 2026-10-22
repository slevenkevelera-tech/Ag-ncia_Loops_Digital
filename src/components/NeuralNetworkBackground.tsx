import React, { useEffect, useRef } from 'react';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseRadius: number;
  pulsePhase: number;
  pulseSpeed: number;
  connections: number[];
}

interface Packet {
  sourceIdx: number;
  targetIdx: number;
  progress: number;
  speed: number;
  color: string;
}

export const NeuralNetworkBackground: React.FC<{ className?: string }> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    // Node count scaled to screen size, keeping it subtle and elegant
    const nodeCount = Math.min(55, Math.floor((width * height) / 22000));
    const nodes: Node[] = [];
    const packets: Packet[] = [];

    // Initialize neural nodes
    for (let i = 0; i < nodeCount; i++) {
      const radius = Math.random() * 1.8 + 1.2;
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius,
        baseRadius: radius,
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.02 + Math.random() * 0.02,
        connections: [],
      });
    }

    // Mouse tracking for subtle interactive synaptic resonance
    const mouse = { x: -1000, y: -1000, active: false };
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    };
    const handleMouseLeave = () => {
      mouse.active = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    const maxDistance = 140;
    const maxDistanceSq = maxDistance * maxDistance;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Update node positions & reset connections
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        node.x += node.vx;
        node.y += node.vy;

        // Bounce gently at borders
        if (node.x < 10) { node.x = 10; node.vx *= -1; }
        if (node.x > width - 10) { node.x = width - 10; node.vx *= -1; }
        if (node.y < 10) { node.y = 10; node.vy *= -1; }
        if (node.y > height - 10) { node.y = height - 10; node.vy *= -1; }

        node.pulsePhase += node.pulseSpeed;
        node.radius = node.baseRadius + Math.sin(node.pulsePhase) * 0.5;
        node.connections = [];

        // Gentle mouse avoidance / connection
        if (mouse.active) {
          const dx = mouse.x - node.x;
          const dy = mouse.y - node.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < 180 * 180) {
            const dist = Math.sqrt(distSq);
            // Very subtle gravitational attraction to mouse
            node.x += (dx / dist) * 0.25;
            node.y += (dy / dist) * 0.25;
          }
        }
      }

      // Draw neural connections (Synapses)
      ctx.lineWidth = 0.8;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const distSq = dx * dx + dy * dy;

          if (distSq < maxDistanceSq) {
            const dist = Math.sqrt(distSq);
            const alpha = (1 - dist / maxDistance) * 0.22; // Kept low to not distract text reading

            ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();

            nodes[i].connections.push(j);

            // Chance to spawn an automation data packet traveling between nodes
            if (Math.random() < 0.0015 && packets.length < 15) {
              packets.push({
                sourceIdx: i,
                targetIdx: j,
                progress: 0,
                speed: 0.012 + Math.random() * 0.015,
                color: Math.random() > 0.4 ? 'rgba(0, 255, 192, 0.85)' : 'rgba(255, 255, 255, 0.9)',
              });
            }
          }
        }
      }

      // Draw & update traveling data packets (Tokens / Neural Pulses)
      for (let p = packets.length - 1; p >= 0; p--) {
        const packet = packets[p];
        packet.progress += packet.speed;

        if (packet.progress >= 1) {
          packets.splice(p, 1);
          continue;
        }

        const n1 = nodes[packet.sourceIdx];
        const n2 = nodes[packet.targetIdx];
        if (!n1 || !n2) {
          packets.splice(p, 1);
          continue;
        }

        const px = n1.x + (n2.x - n1.x) * packet.progress;
        const py = n1.y + (n2.y - n1.y) * packet.progress;

        ctx.fillStyle = packet.color;
        ctx.beginPath();
        ctx.arc(px, py, 1.8, 0, Math.PI * 2);
        ctx.fill();

        // Glow
        ctx.shadowColor = '#00f0ff';
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Draw Neural Nodes
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        const isConnected = node.connections.length > 0;
        const brightness = isConnected ? 0.45 : 0.2;

        // Outer subtle halo
        ctx.fillStyle = `rgba(0, 240, 255, ${brightness * 0.35})`;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius * 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Inner solid core
        ctx.fillStyle = isConnected ? 'rgba(255, 255, 255, 0.75)' : 'rgba(0, 255, 192, 0.5)';
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none opacity-40 z-0 ${className}`}
      aria-hidden="true"
    />
  );
};
