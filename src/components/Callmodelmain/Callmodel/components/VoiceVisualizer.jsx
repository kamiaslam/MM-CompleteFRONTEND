import React, { useEffect, useRef } from 'react';

const VoiceVisualizer = ({ stream }) => {  // Destructure stream from props
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!stream) return; // Early return if no stream is passed

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let audioContext;
    let analyser;
    let dataArray;
    let source;
    let animationFrameId;
    let currentAmplitude = 0; // smoothed amplitude

    // Define a single color for the reactive circle.
    const centerColor = '#f12a81';

    // Initialize audio stream and analyser
    const initAudio = () => {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      source = audioContext.createMediaStreamSource(stream);  // Use the passed stream prop
      analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      dataArray = new Uint8Array(analyser.frequencyBinCount);
      source.connect(analyser);
      draw(); // start the drawing loop
    };

    // Draw the reactive circle that responds to audio amplitude
    const draw = () => {
      animationFrameId = requestAnimationFrame(draw);
      analyser.getByteTimeDomainData(dataArray);

      // Compute the average amplitude
      const average = dataArray.reduce((sum, val) => sum + val, 0) / dataArray.length;
      const isSpeaking = average > 130;
      const targetAmplitude = isSpeaking ? 100 : 0;
      // Smooth the amplitude transition for fluid animation
      currentAmplitude = currentAmplitude * 0.9 + targetAmplitude * 0.1;

      // Clear canvas for each frame
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      // Base radius plus a reactive offset based on the amplitude
      const centerRadius = 60 + currentAmplitude * 0.6 + 20;

      // Create a radial gradient that uses the same color throughout
      const centerGradient = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        centerRadius
      );
      centerGradient.addColorStop(0, centerColor);
      centerGradient.addColorStop(0.5, centerColor);
      centerGradient.addColorStop(1, centerColor);

      // Draw the center circle
      ctx.fillStyle = centerGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, centerRadius, 0, Math.PI * 2);
      ctx.fill();
    };

    initAudio();

    // Cleanup on component unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      if (audioContext) {
        audioContext.close();
      }
    };
  }, [stream]);  // Depend on stream to re-initialize when the stream prop changes

  return (
    <canvas
      ref={canvasRef}
      width={300}
      height={300}
    />
  );
};

export default VoiceVisualizer;
