import React, { useEffect, useRef } from 'react';

const VoiceReactiveSpeaker = ({ stream }) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  const particleCount = 100;
  const silenceThreshold = 0.05;
  let audioReactiveValue = 0;
  const particles = [];

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let centerX, centerY, radius;
    let animationFrameId;

    // 1) Resize logic based on parent container
    const resizeCanvas = () => {
      const { width, height } = container.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;
      centerX = width / 2;
      centerY = height / 2;
      radius = Math.min(width, height) * 0.35;
    };

    // 2) Watch for any size changes on the container
    const resizeObserver = new ResizeObserver(resizeCanvas);
    resizeObserver.observe(container);

    const createParticles = (innerRadius) => {
      particles.length = 0; // reset on re-create
      for (let i = 0; i < particleCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const r = innerRadius + Math.random() * 10;
        particles.push({
          x: centerX + Math.cos(angle) * r,
          y: centerY + Math.sin(angle) * r,
          size: Math.random() * 1 + 0.5,
          speedX: (Math.random() - 0.5) * 1.5,
          speedY: (Math.random() - 0.5) * 1.5,
          opacity: Math.random() * 0.3 + 0.2,
          life: Math.random() * 100 + 50,
        });
      }
    };

    const updateParticles = (innerRadius) => {
      particles.forEach((p, i) => {
        p.x += p.speedX * (1 + audioReactiveValue);
        p.y += p.speedY * (1 + audioReactiveValue);
        p.life -= 1;
        if (p.life <= 0) {
          const angle = Math.random() * Math.PI * 2;
          const r = innerRadius + Math.random() * 10;
          particles[i] = {
            x: centerX + Math.cos(angle) * r,
            y: centerY + Math.sin(angle) * r,
            size: Math.random() * 1 + 0.5,
            speedX: (Math.random() - 0.5) * 1.5,
            speedY: (Math.random() - 0.5) * 1.5,
            opacity: Math.random() * 0.3 + 0.2,
            life: Math.random() * 100 + 50,
          };
        }
      });
    };

    const drawParticles = () => {
      particles.forEach(p => {
        ctx.fillStyle = `rgba(255, 0, 255, ${p.opacity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    const drawSpeakerShape = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Outer morphing gradient shape
      const outerGrad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
      outerGrad.addColorStop(0, 'rgba(255, 0, 255, 0.9)');
      outerGrad.addColorStop(0.5, 'rgba(128, 0, 128, 0.7)');
      outerGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = outerGrad;
      ctx.beginPath();
      const pts = 16;
      for (let i = 0; i <= pts; i++) {
        const angle = (Math.PI * 2 / pts) * i;
        const morph = Math.sin(angle * 3 + Date.now() * 0.001) * 0.05;
        const r = radius + morph * radius;
        const x = centerX + Math.cos(angle) * r;
        const y = centerY + Math.sin(angle) * r;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.shadowBlur = 40;
      ctx.shadowColor = 'rgba(255, 0, 255, 0.9)';
      ctx.fill();
      ctx.shadowBlur = 0;

      // Inner pulse
      const innerRadius = radius * 0.4;
      const basePulse = Math.sin(Date.now() * 0.002) * 0.1 + 1;
      const pulseFactor = audioReactiveValue > 0
        ? basePulse + audioReactiveValue * 0.8
        : 1;
      const innerGrad = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, innerRadius * pulseFactor
      );
      innerGrad.addColorStop(0, 'rgba(50, 0, 100, 0.8)');
      innerGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = innerGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, innerRadius * pulseFactor, 0, Math.PI * 2);
      ctx.fill();

      // Particles if sound > silenceThreshold
      if (audioReactiveValue > 0) {
        updateParticles(innerRadius * pulseFactor);
        drawParticles();
      }
    };

    const animate = () => {
      drawSpeakerShape();
      animationFrameId = requestAnimationFrame(animate);
    };

    // kick it off
    resizeCanvas();
    createParticles(radius * 0.4);
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!stream) return;

    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioCtx.createMediaStreamSource(stream);
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;
    source.connect(analyser);
    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    const updateFromAudio = () => {
      analyser.getByteFrequencyData(dataArray);
      const avg = dataArray.reduce((sum, v) => sum + v, 0) / dataArray.length;
      const norm = avg / 128;
      audioReactiveValue = norm > silenceThreshold ? norm : 0;
      requestAnimationFrame(updateFromAudio);
    };
    updateFromAudio();
  }, [stream]);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
      <canvas
        ref={canvasRef}
        style={{ display: 'block', width: '100%', height: '100%' }}
      />
    </div>
  );
};

export default VoiceReactiveSpeaker;
