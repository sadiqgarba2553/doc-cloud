import React from 'react';
import { Keyboard, HelpCircle, Info, ExternalLink, ShieldCheck } from 'lucide-react';
import { RibbonButton } from '../RibbonButton';

interface HelpTabProps {
  onOpenShortcuts: () => void;
  onOpenMatrix: () => void;
  onOpenAbout: () => void;
}

export const HelpTab: React.FC<HelpTabProps> = ({
  onOpenShortcuts,
  onOpenMatrix,
  onOpenAbout,
}) => {
  return (
    <div className="flex items-center space-x-2 py-1 px-1 overflow-x-auto text-surface-700 dark:text-surface-300">
      <div className="flex items-center space-x-1 border-r border-surface-200 dark:border-surface-800 pr-2">
        <RibbonButton
          icon={<Keyboard className="w-4 h-4 text-sky-600 dark:text-sky-400" />}
          label="Shortcuts"
          variant="large"
          onClick={onOpenShortcuts}
          title="Keyboard Shortcuts Reference"
        />
        <RibbonButton
          icon={<ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
          label="Parity Matrix"
          variant="large"
          onClick={onOpenMatrix}
          title="Word / Docs Feature Parity Matrix"
        />
      </div>

      <div className="flex items-center space-x-1">
        <RibbonButton
          icon={<Info className="w-4 h-4 text-purple-600 dark:text-purple-400" />}
          label="About Doc Cloud"
          variant="large"
          onClick={onOpenAbout}
          title="About Doc Cloud & BlueCloud AI Technologies"
        />
      </div>
    </div>
  );
};
