import { PageSettings, PageDimensions } from '../../types/layout';
import { MM_TO_PX, INCH_TO_PX } from './PageGeometry';

export interface RulerTick {
  positionPx: number;
  label?: string;
  isMajor: boolean;
  isMedium: boolean;
}

export function generateHorizontalRulerTicks(
  pageWidthPx: number,
  zoom: number,
  unit: 'inch' | 'cm' = 'inch'
): RulerTick[] {
  const ticks: RulerTick[] = [];
  const scaledWidth = pageWidthPx * zoom;

  if (unit === 'inch') {
    const stepPx = (INCH_TO_PX / 8) * zoom; // eighth of an inch
    const totalTicks = Math.floor(scaledWidth / stepPx);

    for (let i = 0; i <= totalTicks; i++) {
      const pos = i * stepPx;
      const isInch = i % 8 === 0;
      const isHalf = i % 4 === 0 && !isInch;
      const isQuarter = i % 2 === 0 && !isHalf && !isInch;

      ticks.push({
        positionPx: pos,
        label: isInch && i > 0 ? String(i / 8) : undefined,
        isMajor: isInch,
        isMedium: isHalf || isQuarter,
      });
    }
  } else {
    // cm and mm
    const stepPx = (MM_TO_PX * 2) * zoom; // every 2mm
    const totalTicks = Math.floor(scaledWidth / stepPx);

    for (let i = 0; i <= totalTicks; i++) {
      const pos = i * stepPx;
      const mm = i * 2;
      const isCm = mm % 10 === 0;
      const isHalfCm = mm % 5 === 0 && !isCm;

      ticks.push({
        positionPx: pos,
        label: isCm && mm > 0 ? String(mm / 10) : undefined,
        isMajor: isCm,
        isMedium: isHalfCm,
      });
    }
  }

  return ticks;
}
