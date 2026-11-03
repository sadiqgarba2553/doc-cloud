import React from 'react';

interface WatermarkLayerProps {
  enabled?: boolean;
  text?: string;
  opacity?: number;
  color?: string;
  angle?: number;
  fontSizePt?: number;
}

export const WatermarkLayer: React.FC<WatermarkLayerProps> = ({
  enabled,
  text = 'CONFIDENTIAL',
  opacity = 0.12,
  color = '#64748b',
  angle = -45,
  fontSizePt = 54,
}) => {
  if (!enabled || !text) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-0">
      <span
        style={{
          transform: `rotate(${angle}deg)`,
          fontSize: `${fontSizePt}pt`,
          color: color,
          opacity: opacity,
        }}
        className="font-black tracking-widest uppercase text-center"
      >
        {text}
      </span>
    </div>
  );
};
