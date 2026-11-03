import { Extension } from '@tiptap/core';
import { Plugin, TextSelection } from '@tiptap/pm/state';

// Basic typed-text suggestions. Structural edits and paste are intentionally not tracked.
export function suggestEdits(enabled: () => boolean) {
  const attrs = (type: 'insert' | 'delete') => ({ id: crypto.randomUUID(), type, author: 'You', createdAt: new Date().toISOString() });
  return Extension.create({
    name: 'suggestEdits',
    addProseMirrorPlugins() {
      return [new Plugin({ props: {
        handleTextInput(view, from, to, text) {
          if (!enabled() || view.composing) return false;
          const mark = view.state.schema.marks.suggestion;
          const tr = view.state.tr;
          if (from < to) tr.addMark(from, to, mark.create(attrs('delete')));
          const previous = from === to ? view.state.doc.resolve(from).nodeBefore?.marks.find(m => m.type === mark && m.attrs.type === 'insert') : undefined;
          tr.insert(to, view.state.schema.text(text, [...view.state.selection.$from.marks().filter(m => m.type !== mark), previous ?? mark.create(attrs('insert'))]));
          tr.setSelection(TextSelection.create(tr.doc, to + text.length));
          view.dispatch(tr);
          return true;
        },
        handleKeyDown(view, event) {
          if (!enabled() || !['Backspace', 'Delete'].includes(event.key) || event.ctrlKey || event.metaKey || event.altKey || view.composing) return false;
          const { from, to, $from } = view.state.selection;
          let start = from, end = to;
          if (from === to) {
            if (event.key === 'Backspace') {
              if ($from.parentOffset === 0) return false;
              start--;
              const code = view.state.doc.textBetween(start, from).charCodeAt(0);
              if (code >= 0xDC00 && code <= 0xDFFF) start--;
            } else {
              if ($from.parentOffset === $from.parent.content.size) return false;
              end++;
              const code = view.state.doc.textBetween(from, end).charCodeAt(0);
              if (code >= 0xD800 && code <= 0xDBFF) end++;
            }
          }
          if (view.state.doc.resolve(start).parent !== view.state.doc.resolve(end).parent) return false;
          const mark = view.state.schema.marks.suggestion;
          const deleting = view.state.doc.slice(start, end).content;
          let onlyInsertions = true;
          deleting.forEach(node => { if (!node.isText || !node.marks.some(m => m.type === mark && m.attrs.type === 'insert')) onlyInsertions = false; });
          if (onlyInsertions) { view.dispatch(view.state.tr.delete(start, end)); return true; }
          const tr = view.state.tr.addMark(start, end, mark.create(attrs('delete')));
          tr.setSelection(TextSelection.create(tr.doc, event.key === 'Backspace' ? start : end));
          view.dispatch(tr);
          return true;
        },
      } })];
    },
  });
}
