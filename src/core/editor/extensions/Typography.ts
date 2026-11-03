import { Extension } from '@tiptap/core';

export const Typography = Extension.create({
  name: 'docTypography',
  addGlobalAttributes() {
    return [
      { types: ['textStyle'], attributes: { fontSize: { default: null, parseHTML: element => element.style.fontSize || null, renderHTML: attrs => attrs.fontSize ? { style: `font-size: ${attrs.fontSize}` } : {} } } },
      { types: ['paragraph', 'heading'], attributes: {
        lineHeight: { default: null, parseHTML: element => element.style.lineHeight || null, renderHTML: attrs => attrs.lineHeight ? { style: `line-height: ${attrs.lineHeight}` } : {} },
      } },
    ];
  },
});
