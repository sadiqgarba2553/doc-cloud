export interface CommentReply {
  id: string;
  author: string;
  avatarColor: string;
  content: string;
  createdAt: string;
}

export interface DocumentComment {
  id: string;
  selectedText: string;
  author: string;
  avatarColor: string;
  content: string;
  createdAt: string;
  resolved: boolean;
  replies: CommentReply[];
}

export type SuggestionType = 'insert' | 'delete';

export interface DocumentSuggestion {
  id: string;
  type: SuggestionType;
  author: string;
  avatarColor: string;
  text: string;
  createdAt: string;
  status: 'pending' | 'accepted' | 'rejected';
}

export interface DocumentRevision {
  id: string;
  name: string;
  author: string;
  createdAt: string;
  contentJson: string; // serialized ProseMirror doc
  wordCount: number;
}

export interface CollaboratorUser {
  id: string;
  name: string;
  color: string;
  cursorPos?: number;
  lastActive: number;
}
