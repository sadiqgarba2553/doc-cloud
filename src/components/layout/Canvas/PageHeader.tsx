import React from 'react';
import { HeaderFooterContent } from '../../../types/layout';
import { formatHeaderFooterMacro } from '../../../core/layout/PaginationEngine';

interface PageHeaderProps {
  content: HeaderFooterContent;
  pageIndex: number;
  totalPages: number;
  docTitle: string;
  heightPx: number;
  onEditHeader?: () => void;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  content,
  pageIndex,
  totalPages,
  docTitle,
  heightPx,
  onEditHeader,
}) => {
  const left = formatHeaderFooterMacro(content.headerLeft, pageIndex, totalPages, docTitle);
  const center = formatHeaderFooterMacro(content.headerCenter, pageIndex, totalPages, docTitle);
  const right = formatHeaderFooterMacro(content.headerRight, pageIndex, totalPages, docTitle);

  return (
    <div
      onClick={onEditHeader}
      style={{ height: `${heightPx}px` }}
      className="w-full flex items-center justify-between text-xs text-surface-400 dark:text-surface-500 border-b border-transparent hover:border-surface-200 dark:hover:border-surface-700 transition-colors cursor-pointer px-1 select-none"
      title="Header (Click to configure)"
    >
      <div className="text-left truncate w-1/3">{left}</div>
      <div className="text-center truncate w-1/3 font-medium">{center}</div>
      <div className="text-right truncate w-1/3">{right}</div>
    </div>
  );
};
