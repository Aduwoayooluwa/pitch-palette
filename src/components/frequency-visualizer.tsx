import React, { useEffect, useRef } from 'react';

interface FrequencyVisualizerProps {
  analyser: AnalyserNode | null;
  isRecording: boolean;
}

const FrequencyVisualizer: React.FC<FrequencyVisualizerProps> = ({ analyser, isRecording }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    if (!isRecording || !analyser || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgb(20, 20, 20)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 2.5;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height;
        const frequency = (i * 44100) / (analyser.fftSize * 2);

        let color = '#666';
        if (frequency < 100) color = '#FF6B6B';
        else if (frequency < 200) color = '#4ECDC4';
        else if (frequency < 300) color = '#45B7D1';
        else if (frequency < 400) color = '#96CEB4';
        else color = '#FFEEAD';

        ctx.fillStyle = color;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        x += barWidth + 1;
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [analyser, isRecording]);

  return (
    <div className="absolute bottom-0 left-0 w-full sm:w-auto sm:bottom-4 sm:left-4 p-2 sm:p-0">
      <canvas
        ref={canvasRef}
        className="w-full sm:w-[300px] h-[80px] sm:h-[100px] rounded-none sm:rounded-lg shadow-lg"
        width={300}
        height={100}
        style={{ background: 'rgba(0,0,0,0.7)' }}
      />
    </div>
  );
};

export default FrequencyVisualizer