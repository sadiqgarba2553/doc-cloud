import { DocumentSuggestion } from '../../types/review';

/**
 * Traverses ProseMirror content AST and processes suggestion marks/nodes
 * When accepting an 'insert': keep text, strip suggestion mark
 * When accepting a 'delete': remove deleted text node
 * When rejecting an 'insert': remove inserted text node
 * When rejecting a 'delete': keep text, strip deletion mark
 */
export function processSuggestionsInContent(
  contentNode: any,
  suggestionId: string | 'ALL',
  action: 'accept' | 'reject'
): any {
  if (!contentNode) return contentNode;

  if (contentNode.type === 'text') {
    const marks = contentNode.marks || [];
    const suggestionMark = marks.find(
      (m: any) =>
        (m.type === 'suggestion' || m.type === 'insertion' || m.type === 'deletion') &&
        (suggestionId === 'ALL' || m.attrs?.suggestionId === suggestionId)
    );

    if (suggestionMark) {
      const isInsert = suggestionMark.type === 'insertion' || suggestionMark.attrs?.type === 'insert';
      const isDelete = suggestionMark.type === 'deletion' || suggestionMark.attrs?.type === 'delete';

      if (action === 'accept') {
        if (isDelete) return null; // remove text
        if (isInsert) {
          // keep text, filter out suggestion mark
          return {
            ...contentNode,
            marks: marks.filter((m: any) => m !== suggestionMark),
          };
        }
      } else {
        // reject
        if (isInsert) return null; // remove inserted text
        if (isDelete) {
          // keep text, filter out deletion mark
          return {
            ...contentNode,
            marks: marks.filter((m: any) => m !== suggestionMark),
          };
        }
      }
    }
    return contentNode;
  }

  const cloned = { ...contentNode };
  if (Array.isArray(contentNode.content)) {
    const nextChildren: any[] = [];
    for (const child of contentNode.content) {
      const processed = processSuggestionsInContent(child, suggestionId, action);
      if (processed !== null) {
        nextChildren.push(processed);
      }
    }
    cloned.content = nextChildren;
  }

  return cloned;
}

export function updateSuggestionsLedger(
  suggestions: DocumentSuggestion[],
  targetId: string | 'ALL',
  status: 'accepted' | 'rejected'
): DocumentSuggestion[] {
  return suggestions.map(s => {
    if (targetId === 'ALL' || s.id === targetId) {
      return { ...s, status };
    }
    return s;
  });
}
