export function exportToRtf(text: string, title: string = 'Document'): string {
  // Escape RTF special characters
  const escaped = text
    .replace(/\\/g, '\\\\')
    .replace(/{/g, '\\{')
    .replace(/}/g, '\\}')
    .replace(/\n\n/g, '\\par\\par\n')
    .replace(/\n/g, '\\par\n');

  return `{\\rtf1\\ansi\\ansicpg1252\\deff0\\nouicompat\\deflang1033{\\fonttbl{\\f0\\fnil\\fcharset0 Calibri;}}
{\\colortbl ;\\red0\\green0\\blue0;\\red2\\green132\\blue199;}
\\viewkind4\\uc1 
\\pard\\sa200\\sl276\\slmult1\\f0\\fs22\\lang9 
{\\b\\fs32\\cf2 ${title}}\\par\\par
${escaped}
\\par
}`;
}

export function importFromRtf(rtfString: string): string {
  // Strip RTF control words and groups
  let text = rtfString;

  // Remove header and font tables
  text = text.replace(/\{\\*?\\[^{}]+;?\}|[{}]/g, '');

  // Replace \par with newlines
  text = text.replace(/\\par[d]?\s*/g, '\n');

  // Replace escaped backslashes and brackets
  text = text.replace(/\\\\/g, '\\').replace(/\\\{/g, '{').replace(/\\\}/g, '}');

  // Remove other control words like \b0, \i1, \fs24, etc.
  text = text.replace(/\\[a-z0-9\-]+\s?/gi, '');

  // Convert paragraphs to simple HTML paragraphs
  const paragraphs = text
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  if (paragraphs.length === 0) return '<p></p>';
  return paragraphs.map((p) => `<p>${escapeHtml(p)}</p>`).join('');
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
