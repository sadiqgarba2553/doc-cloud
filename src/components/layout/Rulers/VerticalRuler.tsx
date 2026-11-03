import React, { useRef, useEffect } from 'react';
import { INCH_TO_PX } from '../../../core/layout/PageGeometry';

interface VerticalRulerProps {
  pageHeightPx: number;
  zoom: number;
  marginTopPx: number;
  marginBottomPx: number;
}

export const VerticalRuler: React.FC<VerticalRulerProps> = ({
  pageHeightPx,
  zoom,
  marginTopPx,
  marginBottomPx,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const width = 20;
    const height = pageHeightPx * zoom;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.scale(dpr, dpr);

    // Gray margins, white printable
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(0, 0, width, height);

    const topScaled = marginTopPx * zoom;
    const bottomScaled = (pageHeightPx - marginBottomPx) * zoom;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, topScaled, width, bottomScaled - topScaled);

    // Inch ticks
    const stepPx = (INCH_TO_PX / 8) * zoom;
    const totalTicks = Math.floor(height / stepPx);

    ctx.strokeStyle = '#94a3b8';
    ctx.fillStyle = '#64748b';
    ctx.font = '9px Inter, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';

    for (let i = 0; i <= totalTicks; i++) {
      const y = i * stepPx;
      const isInch = i % 8 === 0;
      const isHalf = i % 4 === 0 && !isInch;

      ctx.beginPath();
      if (isInch) {
        ctx.moveTo(width - 9, y);
        ctx.lineTo(width, y);
        ctx.stroke();
        if (i > 0) {
          ctx.fillText(String(i / 8), 2, y);
        }
      } else if (isHalf) {
        ctx.moveTo(width - 6, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      } else {
        ctx.moveTo(width - 4, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    }
  }, [pageHeightPx, zoom, marginTopPx, marginBottomPx]);

  return (
    <div className="w-5 bg-surface-100 dark:bg-surface-900 border-r border-surface-200 dark:border-surface-800 flex flex-col items-center select-none overflow-hidden">
      <canvas ref={canvasRef} />
    </div>
  );
};
