import React, { useEffect, useRef } from 'react';
import { useMusicPlayer } from '../context/MusicPlayerContext';

interface AudioSpectrumVisualizerProps {
  barCount?: number;
  height?: number;
  className?: string;
}

export const AudioSpectrumVisualizer: React.FC<AudioSpectrumVisualizerProps> = ({
  barCount = 18,
  height = 24,
  className = ''
}) => {
  const { isPlaying, getFrequencyData } = useMusicPlayer();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameId = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const freqData = getFrequencyData();
      const width = canvas.width;
      const barWidth = (width / barCount) - 2;

      for (let i = 0; i < barCount; i++) {
        const val = isPlaying ? (freqData[i % freqData.length] || 40) : 10;
        const normalized = Math.min(1, Math.max(0.1, val / 255));
        const barHeight = Math.max(3, normalized * canvas.height);
        const x = i * (barWidth + 2);
        const y = canvas.height - barHeight;

        // Gradient for vibrant gold/amber styling
        const grad = ctx.createLinearGradient(0, canvas.height, 0, 0);
        grad.addColorStop(0, '#D97706');
        grad.addColorStop(0.5, '#F59E0B');
        grad.addColorStop(1, '#FDE047');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, 2);
        ctx.fill();
      }

      if (isPlaying) {
        animFrameId.current = requestAnimationFrame(render);
      }
    };

    render();

    if (isPlaying) {
      animFrameId.current = requestAnimationFrame(render);
    }

    return () => {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [isPlaying, barCount, getFrequencyData]);

  return (
    <canvas
      ref={canvasRef}
      width={barCount * 6}
      height={height}
      className={`inline-block ${className}`}
      title="Active Audio Equalizer Spectrum"
    />
  );
};
