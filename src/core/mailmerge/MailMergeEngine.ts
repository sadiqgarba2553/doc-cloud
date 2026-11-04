import { DocCloudFilePackage } from '../../types/document';

export interface RecipientRecord {
  [key: string]: string;
}

/**
 * Simple quote-aware CSV parser for mail merge data sources
 */
export function parseMailMergeCsv(csvText: string): RecipientRecord[] {
  const clean = csvText.replace(/^\uFEFF/, '').trim();
  if (!clean) return [];

  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < clean.length; i++) {
    const char = clean[i];
    if (char === '"') {
      if (inQuotes && clean[i + 1] === '"') {
        field += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      row.push(field.trim());
      field = '';
    } else if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && clean[i + 1] === '\n') i++;
      row.push(field.trim());
      if (row.some(f => f.length > 0)) rows.push(row);
      row = [];
      field = '';
    } else {
      field += char;
    }
  }
  if (field || row.length > 0) {
    row.push(field.trim());
    if (row.some(f => f.length > 0)) rows.push(row);
  }

  if (rows.length < 2) return [];

  const headers = rows[0].map(h => h.replace(/^["']|["']$/g, '').trim());
  const records: RecipientRecord[] = [];

  for (let r = 1; r < rows.length; r++) {
    const rec: RecipientRecord = {};
    headers.forEach((header, idx) => {
      rec[header] = rows[r][idx] ?? '';
    });
    records.push(rec);
  }

  return records;
}

/**
 * Scans ProseMirror JSON tree for {{FieldName}} tags
 */
export function extractMergeFields(contentNode: any): string[] {
  const fields = new Set<string>();

  function traverse(node: any) {
    if (!node) return;
    if (node.type === 'text' && typeof node.text === 'string') {
      const matches = node.text.matchAll(/\{\{([^{}]+)\}\}/g);
      for (const m of matches) {
        fields.add(m[1].trim());
      }
    }
    if (Array.isArray(node.content)) {
      node.content.forEach(traverse);
    }
  }

  traverse(contentNode);
  return Array.from(fields);
}

/**
 * Replaces all {{FieldName}} in a string with record values
 */
export function replaceMergeFieldsInString(text: string, record: RecipientRecord): string {
  return text.replace(/\{\{([^{}]+)\}\}/g, (_, fieldName) => {
    const key = fieldName.trim();
    return record[key] !== undefined ? record[key] : `{{${key}}}`;
  });
}

/**
 * Deeply clones ProseMirror content tree and substitutes {{FieldName}} tokens with recipient record data
 */
export function applyMailMergeToContent(contentNode: any, record: RecipientRecord): any {
  if (!contentNode) return contentNode;

  if (contentNode.type === 'text' && typeof contentNode.text === 'string') {
    return {
      ...contentNode,
      text: replaceMergeFieldsInString(contentNode.text, record),
    };
  }

  const cloned: any = { ...contentNode };
  if (Array.isArray(contentNode.content)) {
    cloned.content = contentNode.content.map((child: any) => applyMailMergeToContent(child, record));
  }
  return cloned;
}

/**
 * Generates an array of individual personalized DocCloud packages for all recipients
 */
export function generateMailMergePackages(
  basePackage: DocCloudFilePackage,
  recipients: RecipientRecord[]
): DocCloudFilePackage[] {
  return recipients.map((rec, idx) => {
    const recipientTitle =
      rec['Name'] || rec['FullName'] || rec['First Name'] || `Recipient ${idx + 1}`;
    const mergedTitle = `${basePackage.metadata.title} - ${recipientTitle}`;

    const mergedPackage: DocCloudFilePackage = {
      ...structuredClone(basePackage),
      metadata: {
        ...basePackage.metadata,
        id: crypto.randomUUID(),
        title: mergedTitle,
        updatedAt: new Date().toISOString(),
      },
      content: applyMailMergeToContent(basePackage.content, rec),
    };

    return mergedPackage;
  });
}
