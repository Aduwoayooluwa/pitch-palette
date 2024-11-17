import React, { useRef, useEffect } from 'react';

interface DrawingCanvasProps {
  draw: (ctx: CanvasRenderingContext2D) => void;
}

const DrawingCanvas: React.FC<DrawingCanvasProps> = ({ draw }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = window.innerWidth * 2;
      canvas.height = window.innerHeight * 2;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;

      const context = canvas.getContext('2d');
      if (context) {
        context.scale(2, 2);
        context.lineCap = 'round';
        context.lineJoin = 'round';
        context.globalCompositeOperation = 'source-over';
        draw(context);
      }
    }
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 touch-none overflow-x-auto"
      style={{ zIndex: 1, pointerEvents: 'none' }}
    />
  );
};

export default DrawingCanvas;