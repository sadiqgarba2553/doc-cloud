import React from 'react';
import { HeaderFooterContent } from '../../../types/layout';
import { formatHeaderFooterMacro } from '../../../core/layout/PaginationEngine';

interface PageFooterProps {
  content: HeaderFooterContent;
  pageIndex: number;
  totalPages: number;
  docTitle: string;
  heightPx: number;
  onEditFooter?: () => void;
}

export const PageFooter: React.FC<PageFooterProps> = ({
  content,
  pageIndex,
  totalPages,
  docTitle,
  heightPx,
  onEditFooter,
}) => {
  const left = formatHeaderFooterMacro(content.footerLeft, pageIndex, totalPages, docTitle);
  const center = formatHeaderFooterMacro(content.footerCenter || 'Page {page} of {pages}', pageIndex, totalPages, docTitle);
  const right = formatHeaderFooterMacro(content.footerRight, pageIndex, totalPages, docTitle);

  return (
    <div
      onClick={onEditFooter}
      style={{ height: `${heightPx}px` }}
      className="w-full flex items-center justify-between text-xs text-surface-400 dark:text-surface-500 border-t border-transparent hover:border-surface-200 dark:hover:border-surface-700 transition-colors cursor-pointer px-1 select-none"
      title="Footer (Click to configure)"
    >
      <div className="text-left truncate w-1/3">{left}</div>
      <div className="text-center truncate w-1/3 font-medium">{center}</div>
      <div className="text-right truncate w-1/3">{right}</div>
    </div>
  );
};
