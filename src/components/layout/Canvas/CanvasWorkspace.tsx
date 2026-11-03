import React, { useRef } from 'react';
import { PageSettings, HeaderFooterContent } from '../../../types/layout';
import { getPageDimensions } from '../../../core/layout/PageGeometry';
import { PageCanvas } from './PageCanvas';
import { HorizontalRuler } from '../Rulers/HorizontalRuler';
import { VerticalRuler } from '../Rulers/VerticalRuler';

interface CanvasWorkspaceProps {
  settings: PageSettings;
  headerFooter: HeaderFooterContent;
  docTitle: string;
  zoom: number;
  showRulers: boolean;
  children: React.ReactNode;
  onEditHeaderFooter?: () => void;
}

export const CanvasWorkspace: React.FC<CanvasWorkspaceProps> = ({
  settings,
  headerFooter,
  docTitle,
  zoom,
  showRulers,
  children,
  onEditHeaderFooter,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const dims = getPageDimensions(
    settings.format,
    settings.orientation,
    settings.customWidthMm,
    settings.customHeightMm
  );

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-surface-200/70 dark:bg-surface-950 transition-colors">
      {/* Horizontal Ruler */}
      {showRulers && (
        <HorizontalRuler
          pageWidthPx={dims.widthPx}
          zoom={zoom}
          marginLeftPx={settings.margins.leftPx}
          marginRightPx={settings.margins.rightPx}
        />
      )}

      {/* Main Viewport */}
      <div className="flex-1 flex overflow-hidden">
        {/* Vertical Ruler */}
        {showRulers && (
          <VerticalRuler
            pageHeightPx={dims.heightPx}
            zoom={zoom}
            marginTopPx={settings.margins.topPx}
            marginBottomPx={settings.margins.bottomPx}
          />
        )}

        {/* Scrollable Document Area */}
        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-auto p-8 flex justify-center items-start print:p-0 print:overflow-visible"
        >
          <PageCanvas
            settings={settings}
            headerFooter={headerFooter}
            docTitle={docTitle}
            zoom={zoom}
            onEditHeaderFooter={onEditHeaderFooter}
          >
            {children}
          </PageCanvas>
        </div>
      </div>
    </div>
  );
};
