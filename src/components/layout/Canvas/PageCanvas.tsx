import React from 'react';
import { PageSettings, HeaderFooterContent } from '../../../types/layout';
import { getPageDimensions } from '../../../core/layout/PageGeometry';
import { PageHeader } from './PageHeader';
import { PageFooter } from './PageFooter';
import { WatermarkLayer } from './WatermarkLayer';

interface PageCanvasProps {
  settings: PageSettings;
  headerFooter: HeaderFooterContent;
  docTitle: string;
  zoom: number;
  children: React.ReactNode;
  onEditHeaderFooter?: () => void;
}

export const PageCanvas: React.FC<PageCanvasProps> = ({
  settings,
  headerFooter,
  docTitle,
  zoom,
  children,
  onEditHeaderFooter,
}) => {
  const isPageless = !!settings.pageless;

  const dims = getPageDimensions(
    settings.format,
    settings.orientation,
    settings.customWidthMm,
    settings.customHeightMm
  );

  const topPx = settings.margins.topPx;
  const bottomPx = settings.margins.bottomPx;
  const leftPx = settings.margins.leftPx;
  const rightPx = settings.margins.rightPx;

  if (isPageless) {
    return (
      <div
        style={{
          width: '100%',
          maxWidth: '920px',
        }}
        className="relative transition-all duration-150 mx-auto"
      >
        <div
          style={{
            padding: '40px 48px 100px 48px',
            columnCount: settings.columns,
            columnGap: `${settings.columnGapMm}mm`,
          }}
          className="relative bg-white dark:bg-surface-900 rounded-lg shadow-sm border border-surface-200/80 dark:border-surface-800 text-surface-900 dark:text-surface-100 min-h-[85vh]"
        >
          {children}
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        width: `${dims.widthPx * zoom}px`,
        minHeight: `${dims.heightPx * zoom}px`,
      }}
      className="relative transition-all duration-150 mx-auto"
    >
      <div
        style={{
          width: `${dims.widthPx}px`,
          minHeight: `${dims.heightPx}px`,
          transform: `scale(${zoom})`,
          transformOrigin: 'top center',
          paddingTop: `${topPx}px`,
          paddingBottom: `${bottomPx}px`,
          paddingLeft: `${leftPx}px`,
          paddingRight: `${rightPx}px`,
        }}
        className="relative bg-white dark:bg-surface-900 border border-surface-200/80 dark:border-surface-800 shadow-page dark:shadow-page-dark flex flex-col justify-between text-surface-900 dark:text-surface-100 transition-colors"
      >
        {/* Watermark Layer */}
        <WatermarkLayer
          enabled={settings.watermark?.enabled}
          text={settings.watermark?.text}
          opacity={settings.watermark?.opacity}
          color={settings.watermark?.color}
          angle={settings.watermark?.angle}
          fontSizePt={settings.watermark?.fontSizePt}
        />

        {/* Header Zone */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: `${leftPx}px`,
            right: `${rightPx}px`,
            height: `${topPx}px`,
          }}
          className="flex items-end pb-2"
        >
          <PageHeader
            content={headerFooter}
            pageIndex={1}
            totalPages={1}
            docTitle={docTitle}
            heightPx={topPx * 0.75}
            onEditHeader={onEditHeaderFooter}
          />
        </div>

        {/* Printable Body Content */}
        <div
          style={{
            columnCount: settings.columns,
            columnGap: `${settings.columnGapMm}mm`,
          }}
          className="relative z-10 flex-1 w-full"
        >
          {children}
        </div>

        {/* Footer Zone */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: `${leftPx}px`,
            right: `${rightPx}px`,
            height: `${bottomPx}px`,
          }}
          className="flex items-start pt-2"
        >
          <PageFooter
            content={headerFooter}
            pageIndex={1}
            totalPages={1}
            docTitle={docTitle}
            heightPx={bottomPx * 0.75}
            onEditFooter={onEditHeaderFooter}
          />
        </div>
      </div>
    </div>
  );
};
