import React, { useState, useEffect } from 'react';
import { ReactP5Wrapper } from '@p5-wrapper/react';
import sketch from './sketch';

const Visualizer = ({stream}) => {
  const [params, setParams] = useState({ bump: 0, theta: 0, phy: 0 });

  useEffect(() => {
    if (!stream) return;

    let audioContext, analyser, dataArray;
    let animationFrameId;

    const setupAudio = async () => {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioContext.createMediaStreamSource(stream);
      analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      dataArray = new Uint8Array(analyser.frequencyBinCount);
      source.connect(analyser);
    };

    const updateParams = () => {
      if (analyser) {
        analyser.getByteFrequencyData(dataArray);
        let avgFrequency = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;

        if (avgFrequency >= 45) {
          avgFrequency += 20;
        }

        if (avgFrequency <= 20.5) {
          avgFrequency = params.bump * 0.95;
        }

        const newBump = Math.min(avgFrequency / 255 * 0.97, 1.3);

        setParams({
          bump: newBump,
          theta: 4.1,
          phy: 8.8,
        });
      }
      animationFrameId = requestAnimationFrame(updateParams);
    };

    setupAudio().then(updateParams);

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (audioContext) audioContext.close();
    };
  }, [stream]);


  return (
    <div
      id="p5-container"
      style={{ height: "50vh", width: "50vh", position: "relative", margin: "auto" }}
    >
      <ReactP5Wrapper sketch={sketch} params={params} />
    </div>
  );
};

export default Visualizer;
