import React, { useRef, useState, useCallback } from 'react';
import Controls from './controls';
import DrawingCanvas from './drawing-canvas';
import WelcomeMessage from './welcome-message';
import FrequencyVisualizer from './frequency-visualizer';

interface Point {
  x: number;
  y: number;
}

const VoiceCanvas: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const canvasDimensions = useRef({ width: 0, height: 0 });
  const currentPoint = useRef<Point>({ x: 0, y: 0 });
  const animationRef = useRef<number>();

  const getDirection = (frequency: number): string => {

    if (frequency < 120) return 'left';     
    if (frequency < 220) return 'right';   
    if (frequency < 320) return 'up';      
    if (frequency < 420) return 'down';    
    return 'curve';                        
  };

  const movePoint = (direction: string, distance: number): Point => {
    const { x, y } = currentPoint.current;
    const { width, height } = canvasDimensions.current;
    const step = Math.min(distance * 2, 20);

    let newPoint: Point = { x, y };

    switch (direction) {
      case 'left':
        newPoint = { x: x - step, y };
        break;
      case 'right':
        newPoint = { x: x + step, y };
        break;
      case 'up':
        newPoint = { x, y: y - step };
        break;
      case 'down':
        newPoint = { x, y: y + step };
        break;
      case 'curve':
        const angle = (Date.now() / 1000) % (2 * Math.PI);
        newPoint = {
          x: x + Math.cos(angle) * step,
          y: y + Math.sin(angle) * step
        };
        break;
    }

    // Keep point within bounds with some padding
    return {
      x: Math.max(10, Math.min(width - 10, newPoint.x)),
      y: Math.max(10, Math.min(height - 10, newPoint.y))
    };
  };

  const draw = useCallback((ctx: CanvasRenderingContext2D) => {
    if (!analyserRef.current) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyserRef.current.getByteFrequencyData(dataArray);

    // Find the dominant frequency
    let maxValue = 0;
    let maxIndex = 0;
    let totalVolume = 0;

    // Analyze a specific range of frequencies (20Hz - 2000Hz)
    const minBin = Math.floor((20 * analyserRef.current.fftSize) / 44100);
    const maxBin = Math.floor((2000 * analyserRef.current.fftSize) / 44100);
    
    for (let i = minBin; i < maxBin; i++) {
      if (dataArray[i] > maxValue) {
        maxValue = dataArray[i];
        maxIndex = i;
      }
      totalVolume += dataArray[i];
    }

    const binCount = maxBin - minBin;
    const averageVolume = totalVolume / binCount;
    const normalizedVolume = averageVolume / 255;
    
    // Lowered threshold for better sensitivity to quiet sounds
    if (normalizedVolume > 0.02) {
      // Convert frequency bin to Hz (approximate)
      const frequency = (maxIndex * 44100) / analyserRef.current.fftSize;
      const direction = getDirection(frequency);
      const newPoint = movePoint(direction, normalizedVolume * 100);

      ctx.beginPath();
      ctx.moveTo(currentPoint.current.x, currentPoint.current.y);
      ctx.lineTo(newPoint.x, newPoint.y);

      const colors = {
        left: '#FF6B6B',
        right: '#4ECDC4',
        up: '#45B7D1',
        down: '#96CEB4',
        curve: '#FFEEAD'
      };
      
      ctx.strokeStyle = colors[direction as keyof typeof colors];
      ctx.lineWidth = Math.max(2, normalizedVolume * 20); // Minimum line width of 2
      ctx.stroke();

      currentPoint.current = newPoint;
    }

    animationRef.current = requestAnimationFrame(() => draw(ctx));
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: { 
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
          channelCount: 1, 
        } 
      });
      
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      
      // Adjust analyzer settings for better frequency detection
      analyserRef.current.fftSize = 8192; // the frequency resolution
      analyserRef.current.smoothingTimeConstant = 0.8;
      analyserRef.current.minDecibels = -90; // sensitivity for quiet sounds
      analyserRef.current.maxDecibels = -10; // this will prevent clipping
      
      source.connect(analyserRef.current);
      
      setIsRecording(true);
      setError(null);

      const canvas = document.querySelector('canvas');
      if (canvas) {
        canvasDimensions.current = {
          width: canvas.width / 2,
          height: canvas.height / 2
        };
        currentPoint.current = {
          x: canvasDimensions.current.width / 2,
          y: canvasDimensions.current.height / 2
        };
      }
    } catch (err) {
      setError('Microphone access denied. Please allow microphone access to use this feature.');
    }
  };

  const stopRecording = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    setIsRecording(false);
  };

  const clearCanvas = useCallback(() => {
    const canvas = document.querySelector('canvas');
    const ctx = canvas?.getContext('2d');
    if (ctx && canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      currentPoint.current = {
        x: canvasDimensions.current.width / 2,
        y: canvasDimensions.current.height / 2
      };
    }
  }, []);

  return (
    <div className="relative w-full h-screen bg-gray-900">
      <DrawingCanvas draw={isRecording ? draw : () => {}} />
      <Controls
        isRecording={isRecording}
        onStartRecording={startRecording}
        onStopRecording={stopRecording}
        onClear={clearCanvas}
      />
      <FrequencyVisualizer analyser={analyserRef.current} isRecording={isRecording} />
      <WelcomeMessage isRecording={isRecording} error={error} />
    </div>
  );
};

export default VoiceCanvas;