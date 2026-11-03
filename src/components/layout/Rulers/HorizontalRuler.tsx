import React, { useRef, useEffect } from 'react';
import { generateHorizontalRulerTicks } from '../../../core/layout/RulerCoordinates';

interface HorizontalRulerProps {
  pageWidthPx: number;
  zoom: number;
  marginLeftPx: number;
  marginRightPx: number;
  onMarginChange?: (leftPx: number, rightPx: number) => void;
}

export const HorizontalRuler: React.FC<HorizontalRulerProps> = ({
  pageWidthPx,
  zoom,
  marginLeftPx,
  marginRightPx,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const width = pageWidthPx * zoom;
    const height = 20;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.scale(dpr, dpr);

    // Background: White in printable area, subtle gray in margin area
    ctx.fillStyle = '#e2e8f0'; // dark surface
    ctx.fillRect(0, 0, width, height);

    const leftScaled = marginLeftPx * zoom;
    const rightScaled = (pageWidthPx - marginRightPx) * zoom;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(leftScaled, 0, rightScaled - leftScaled, height);

    // Ticks & Labels
    const ticks = generateHorizontalRulerTicks(pageWidthPx, zoom, 'inch');
    ctx.strokeStyle = '#94a3b8';
    ctx.fillStyle = '#64748b';
    ctx.font = '9px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    for (const tick of ticks) {
      const x = tick.positionPx;
      ctx.beginPath();
      if (tick.isMajor) {
        ctx.moveTo(x, height - 9);
        ctx.lineTo(x, height);
        ctx.stroke();
        if (tick.label) {
          ctx.fillText(tick.label, x, 2);
        }
      } else if (tick.isMedium) {
        ctx.moveTo(x, height - 6);
        ctx.lineTo(x, height);
        ctx.stroke();
      } else {
        ctx.moveTo(x, height - 4);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
    }

    // Draw Left and Right Margin Marker Triangles
    ctx.fillStyle = '#0284c7';
    // Left marker
    ctx.beginPath();
    ctx.moveTo(leftScaled - 4, height);
    ctx.lineTo(leftScaled + 4, height);
    ctx.lineTo(leftScaled, height - 6);
    ctx.closePath();
    ctx.fill();

    // Right marker
    ctx.beginPath();
    ctx.moveTo(rightScaled - 4, height);
    ctx.lineTo(rightScaled + 4, height);
    ctx.lineTo(rightScaled, height - 6);
    ctx.closePath();
    ctx.fill();
  }, [pageWidthPx, zoom, marginLeftPx, marginRightPx]);

  return (
    <div className="h-5 bg-surface-100 dark:bg-surface-900 border-b border-surface-200 dark:border-surface-800 flex justify-center overflow-hidden select-none">
      <canvas ref={canvasRef} className="shadow-sm" />
    </div>
  );
};
