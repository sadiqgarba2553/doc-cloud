import mammoth from 'mammoth';

export interface DocxImportResult {
  html: string;
  messages: string[];
}

export async function importFromDocx(arrayBuffer: ArrayBuffer): Promise<DocxImportResult> {
  const options = {
    styleMap: [
      "p[style-name='Heading 1'] => h1:fresh",
      "p[style-name='Heading 2'] => h2:fresh",
      "p[style-name='Heading 3'] => h3:fresh",
      "p[style-name='Heading 4'] => h4:fresh",
      "p[style-name='Quote'] => blockquote:fresh",
    ],
  };

  const result = await mammoth.convertToHtml({ arrayBuffer }, options);
  return {
    html: result.value,
    messages: result.messages.map((m) => m.message),
  };
}
