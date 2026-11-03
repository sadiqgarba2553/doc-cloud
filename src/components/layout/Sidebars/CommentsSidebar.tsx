import React, { useState } from 'react';
import { MessageSquare, Check, Trash2, Reply, X } from 'lucide-react';
import { DocumentComment } from '../../../types/review';

interface CommentsSidebarProps {
  comments: DocumentComment[];
  isOpen: boolean;
  onClose: () => void;
  onAddReply: (commentId: string, text: string) => void;
  onToggleResolve: (commentId: string) => void;
  onDeleteComment: (commentId: string) => void;
}

export const CommentsSidebar: React.FC<CommentsSidebarProps> = ({
  comments,
  isOpen,
  onClose,
  onAddReply,
  onToggleResolve,
  onDeleteComment,
}) => {
  const [replyInputs, setReplyInputs] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const handleReplySubmit = (commentId: string) => {
    const text = replyInputs[commentId]?.trim();
    if (text) {
      onAddReply(commentId, text);
      setReplyInputs((prev) => ({ ...prev, [commentId]: '' }));
    }
  };

  return (
    <aside className="w-72 bg-white dark:bg-surface-900 border-l border-surface-200 dark:border-surface-800 flex flex-col select-none z-10 transition-colors shadow-sm">
      {/* Header */}
      <div className="h-10 px-3 border-b border-surface-200 dark:border-surface-800 flex items-center justify-between">
        <div className="flex items-center space-x-1.5 text-xs font-bold text-surface-800 dark:text-surface-200 uppercase tracking-wider">
          <MessageSquare className="w-3.5 h-3.5 text-sky-600" />
          <span>Comments ({comments.length})</span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-500"
          title="Close Comments Panel"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Comment List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {comments.length === 0 ? (
          <p className="text-xs text-surface-400 italic text-center py-6">
            No comments yet. Select text in the document and click 'New Comment' in the Review tab.
          </p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className={`p-3 rounded-lg border text-xs transition-colors ${
                comment.resolved
                  ? 'border-surface-200 dark:border-surface-800 bg-surface-50 dark:bg-surface-900/40 opacity-70'
                  : 'border-amber-300 dark:border-amber-700/60 bg-amber-50/40 dark:bg-amber-950/20 shadow-sm'
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center space-x-1.5">
                  <div
                    style={{ backgroundColor: comment.avatarColor || '#0284c7' }}
                    className="w-4 h-4 rounded-full text-[9px] text-white flex items-center justify-center font-bold"
                  >
                    {comment.author.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-semibold text-surface-900 dark:text-surface-100">{comment.author}</span>
                </div>
                <span className="text-[10px] text-surface-400">
                  {new Date(comment.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                </span>
              </div>

              {/* Selected quote text */}
              {comment.selectedText && (
                <div className="p-1.5 rounded bg-amber-100/60 dark:bg-amber-950/40 text-[11px] text-surface-700 dark:text-surface-300 italic mb-2 border-l-2 border-amber-500">
                  "{comment.selectedText}"
                </div>
              )}

              {/* Content */}
              <p className="text-surface-800 dark:text-surface-200 mb-2 leading-relaxed">{comment.content}</p>

              {/* Replies */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="space-y-1.5 pl-2 border-l border-surface-300 dark:border-surface-700 my-2">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="text-[11px]">
                      <span className="font-medium text-surface-800 dark:text-surface-200">{reply.author}: </span>
                      <span className="text-surface-600 dark:text-surface-400">{reply.content}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Reply Input */}
              <div className="mt-2 flex items-center space-x-1">
                <input
                  type="text"
                  placeholder="Reply..."
                  value={replyInputs[comment.id] || ''}
                  onChange={(e) => setReplyInputs({ ...replyInputs, [comment.id]: e.target.value })}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleReplySubmit(comment.id);
                  }}
                  className="flex-1 px-2 py-1 text-xs border border-surface-300 dark:border-surface-700 rounded bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 outline-none"
                />
                <button
                  onClick={() => handleReplySubmit(comment.id)}
                  className="p-1 rounded bg-sky-600 text-white hover:bg-sky-700"
                  title="Send Reply"
                >
                  <Reply className="w-3 h-3" />
                </button>
              </div>

              {/* Actions: Resolve / Delete */}
              <div className="mt-2.5 pt-2 border-t border-surface-200 dark:border-surface-800 flex items-center justify-between">
                <button
                  onClick={() => onToggleResolve(comment.id)}
                  className="flex items-center space-x-1 text-[10px] text-surface-500 hover:text-emerald-600 transition-colors"
                >
                  <Check className="w-3 h-3" />
                  <span>{comment.resolved ? 'Reopen' : 'Resolve'}</span>
                </button>
                <button
                  onClick={() => onDeleteComment(comment.id)}
                  className="text-surface-400 hover:text-rose-500 transition-colors"
                  title="Delete Comment"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </aside>
  );
};
