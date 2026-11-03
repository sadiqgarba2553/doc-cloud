import React from 'react';
import { Editor } from '@tiptap/react';
import {
  FileText,
  SpellCheck,
  CheckCheck,
  XCircle,
  MessageSquarePlus,
  GitCompare,
  Eye,
  SlidersHorizontal,
} from 'lucide-react';
import { RibbonButton } from '../RibbonButton';

interface ReviewTabProps {
  editor: Editor | null;
  onOpenWordCountModal: () => void;
  trackChangesMode: boolean;
  onToggleTrackChanges: () => void;
  onOpenNewComment: () => void;
  onToggleCommentsSidebar: () => void;
  commentsSidebarOpen: boolean;
  onAcceptAllSuggestions: () => void;
  onRejectAllSuggestions: () => void;
  hasPendingSuggestions: boolean;
}

export const ReviewTab: React.FC<ReviewTabProps> = ({
  editor,
  onOpenWordCountModal,
  trackChangesMode,
  onToggleTrackChanges,
  onOpenNewComment,
  onToggleCommentsSidebar,
  commentsSidebarOpen,
  onAcceptAllSuggestions,
  onRejectAllSuggestions,
  hasPendingSuggestions,
}) => {
  return (
    <div className="flex items-center space-x-2 py-1 px-1 overflow-x-auto text-surface-700 dark:text-surface-300">
      {/* Proofing & Statistics */}
      <div className="flex items-center space-x-1 border-r border-surface-200 dark:border-surface-800 pr-2">
        <RibbonButton
          icon={<FileText className="w-4 h-4 text-sky-600 dark:text-sky-400" />}
          label="Word Count"
          variant="large"
          onClick={onOpenWordCountModal}
          title="Document Statistics, Word Count, and Reading Time"
        />
        <RibbonButton
          icon={<SpellCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
          label="Spell Check"
          variant="large"
          isActive={true}
          onClick={() => {
            alert('Spell check is active with native system dictionary support.');
          }}
          title="Native Spell Checking & Language Dictionary"
        />
      </div>

      {/* Track Changes / Suggestion Mode */}
      <div className="flex items-center space-x-1 border-r border-surface-200 dark:border-surface-800 pr-2">
        <RibbonButton
          icon={<SlidersHorizontal className="w-4 h-4 text-amber-500" />}
          label="Track Changes"
          variant="large"
          isActive={trackChangesMode}
          onClick={onToggleTrackChanges}
          title="Toggle Suggestion / Track Changes Mode"
        />
        <div className="flex flex-col space-y-0.5">
          <button
            onClick={onAcceptAllSuggestions}
            disabled={!hasPendingSuggestions}
            className="flex items-center space-x-1 text-[10px] px-2 py-0.5 rounded text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 disabled:opacity-40"
          >
            <CheckCheck className="w-3 h-3" />
            <span>Accept All</span>
          </button>
          <button
            onClick={onRejectAllSuggestions}
            disabled={!hasPendingSuggestions}
            className="flex items-center space-x-1 text-[10px] px-2 py-0.5 rounded text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 disabled:opacity-40"
          >
            <XCircle className="w-3 h-3" />
            <span>Reject All</span>
          </button>
        </div>
      </div>

      {/* Comments */}
      <div className="flex items-center space-x-1 border-r border-surface-200 dark:border-surface-800 pr-2">
        <RibbonButton
          icon={<MessageSquarePlus className="w-4 h-4 text-sky-600 dark:text-sky-400" />}
          label="New Comment"
          variant="large"
          onClick={onOpenNewComment}
          title="Add Comment to Selected Text"
        />
        <RibbonButton
          icon={<Eye className="w-4 h-4" />}
          label="Comments"
          variant="large"
          isActive={commentsSidebarOpen}
          onClick={onToggleCommentsSidebar}
          title="Toggle Comments Panel"
        />
      </div>

      {/* Compare Documents */}
      <div className="flex items-center space-x-1">
        <RibbonButton
          icon={<GitCompare className="w-4 h-4 text-purple-600 dark:text-purple-400" />}
          label="Compare"
          variant="large"
          onClick={() => {
            alert('Compare Documents: Select another version or document to see visual redline diffs.');
          }}
          title="Compare Two Documents"
        />
      </div>
    </div>
  );
};
