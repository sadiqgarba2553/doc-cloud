import React from 'react';

interface RibbonButtonProps {
  icon: React.ReactNode;
  label?: string;
  onClick: (e: React.MouseEvent) => void;
  isActive?: boolean;
  disabled?: boolean;
  title?: string;
  variant?: 'large' | 'small' | 'icon';
  hasDropdown?: boolean;
}

export const RibbonButton: React.FC<RibbonButtonProps> = ({
  icon,
  label,
  onClick,
  isActive = false,
  disabled = false,
  title,
  variant = 'small',
  hasDropdown = false,
}) => {
  if (variant === 'large') {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        title={title}
        className={`flex flex-col items-center justify-center px-2 py-1 rounded min-w-[50px] transition-all select-none ${
          disabled
            ? 'opacity-40 cursor-not-allowed text-surface-400'
            : isActive
            ? 'bg-sky-100 text-sky-800 dark:bg-sky-950/80 dark:text-sky-300 font-medium'
            : 'hover:bg-surface-200/70 dark:hover:bg-surface-800 text-surface-700 dark:text-surface-300 hover:text-surface-900 dark:hover:text-surface-100'
        }`}
      >
        <div className="w-5 h-5 flex items-center justify-center mb-0.5">{icon}</div>
        {label && <span className="text-[11px] leading-tight tracking-tight text-center">{label}</span>}
      </button>
    );
  }

  if (variant === 'icon') {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        title={title}
        className={`p-1.5 rounded transition-all select-none flex items-center justify-center ${
          disabled
            ? 'opacity-40 cursor-not-allowed text-surface-400'
            : isActive
            ? 'bg-sky-100 text-sky-800 dark:bg-sky-950/80 dark:text-sky-300 font-medium'
            : 'hover:bg-surface-200/70 dark:hover:bg-surface-800 text-surface-700 dark:text-surface-300 hover:text-surface-900 dark:hover:text-surface-100'
        }`}
      >
        <div className="w-4 h-4 flex items-center justify-center">{icon}</div>
        {hasDropdown && <span className="text-[9px] ml-0.5 opacity-60">▼</span>}
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`flex items-center space-x-1.5 px-2 py-1 rounded text-xs transition-all select-none ${
        disabled
          ? 'opacity-40 cursor-not-allowed text-surface-400'
          : isActive
          ? 'bg-sky-100 text-sky-800 dark:bg-sky-950/80 dark:text-sky-300 font-medium'
          : 'hover:bg-surface-200/70 dark:hover:bg-surface-800 text-surface-700 dark:text-surface-300 hover:text-surface-900 dark:hover:text-surface-100'
      }`}
    >
      <div className="w-4 h-4 flex items-center justify-center">{icon}</div>
      {label && <span className="text-[11px] tracking-tight">{label}</span>}
      {hasDropdown && <span className="text-[9px] opacity-60">▼</span>}
    </button>
  );
};
