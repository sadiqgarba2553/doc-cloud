import { it, expect } from 'vitest';
import { applyMailMergeToContent, parseMailMergeCsv } from '../src/core/mailmerge/MailMergeEngine';

it('removes empty merged text nodes so Tiptap can load an empty field', () => {
  const result = applyMailMergeToContent({type:'doc',content:[{type:'paragraph',content:[{type:'text',text:'{{Name}}'}]}]}, {Name:''});
  expect(result.content[0].content).toEqual([]);
});
it('rejects ambiguous recipient headers and malformed quotes', () => {
  for (const csv of ['Name,Name\na,b', '__proto__,Name\na,b', 'Name\n"unclosed']) expect(() => parseMailMergeCsv(csv)).toThrow();
});
