import { Node } from '@tiptap/pm/model';

export function findTextRanges(doc: Node, query: string, matchCase = false) {
  const ranges: { from: number; to: number }[] = [];
  if (!query) return ranges;
  const needle = matchCase ? query : query.toLowerCase();
  doc.descendants((node, pos) => {
    if (!node.isTextblock) return;
    // Keep text offsets equal to ProseMirror positions, including inline atoms.
    const text = node.textBetween(0, node.content.size, '', '\ufffc');
    const haystack = matchCase ? text : text.toLowerCase();
    let start = 0;
    for (;;) {
      const index = haystack.indexOf(needle, start);
      if (index < 0) break;
      ranges.push({ from: pos + 1 + index, to: pos + 1 + index + query.length });
      start = index + needle.length;
    }
    return false;
  });
  return ranges;
}
