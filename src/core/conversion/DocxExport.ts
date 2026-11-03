import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  PageBreak as DocxPageBreak,
  Header,
  Footer,
  convertMillimetersToTwip,
} from 'docx';
import { PageSettings, HeaderFooterContent } from '../../types/layout';
import { getPageDimensions } from '../layout/PageGeometry';

export async function exportToDocx(
  docJson: any,
  settings: PageSettings,
  headerFooter?: HeaderFooterContent,
  docTitle: string = 'Document'
): Promise<Uint8Array> {
  const children: any[] = [];

  if (docJson && Array.isArray(docJson.content)) {
    for (const node of docJson.content) {
      const converted = convertNodeToDocx(node);
      if (Array.isArray(converted)) {
        children.push(...converted);
      } else if (converted) {
        children.push(converted);
      }
    }
  }

  // If empty document, add at least one blank paragraph
  if (children.length === 0) {
    children.push(new Paragraph({ text: '' }));
  }

  const topTwips = convertMillimetersToTwip(settings.margins.topMm || 25.4);
  const bottomTwips = convertMillimetersToTwip(settings.margins.bottomMm || 25.4);
  const leftTwips = convertMillimetersToTwip(settings.margins.leftMm || 25.4);
  const rightTwips = convertMillimetersToTwip(settings.margins.rightMm || 25.4);

  const dimensions = getPageDimensions(settings.format, 'portrait', settings.customWidthMm, settings.customHeightMm);
  const doc = new Document({
    creator: 'Doc Cloud (BlueCloud AI Technologies)',
    title: docTitle,
    sections: [
      {
        properties: {
          page: {
            size: { width: convertMillimetersToTwip(dimensions.widthMm), height: convertMillimetersToTwip(dimensions.heightMm), orientation: settings.orientation },
            margin: {
              top: topTwips,
              bottom: bottomTwips,
              left: leftTwips,
              right: rightTwips,
            },
          },
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: headerFooter?.headerRight || headerFooter?.headerCenter || '',
                    size: 18,
                    color: '718096',
                  }),
                ],
              }),
            ],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: headerFooter?.footerCenter?.replace(/\{page\}/gi, '1').replace(/\{pages\}/gi, '1') || 'Doc Cloud',
                    size: 18,
                    color: '718096',
                  }),
                ],
              }),
            ],
          }),
        },
        children,
      },
    ],
  });

  const buffer = await Packer.toBlob(doc);
  return new Uint8Array(await buffer.arrayBuffer());
}

function convertNodeToDocx(node: any): any {
  if (!node) return null;

  switch (node.type) {
    case 'paragraph': {
      const alignment = mapAlignment(node.attrs?.textAlign);
      const runs = (node.content || []).map(convertInlineToTextRun).filter(Boolean);
      return new Paragraph({
        alignment,
        spacing: {
          after: 140, // 7pt spacing after
          line: 276, // 1.15 line spacing
        },
        children: runs.length > 0 ? runs : [new TextRun('')],
      });
    }

    case 'heading': {
      const level = node.attrs?.level || 1;
      const alignment = mapAlignment(node.attrs?.textAlign);
      const runs = (node.content || []).map(convertInlineToTextRun).filter(Boolean);
      const headingMap: Record<number, (typeof HeadingLevel)[keyof typeof HeadingLevel]> = {
        1: HeadingLevel.HEADING_1,
        2: HeadingLevel.HEADING_2,
        3: HeadingLevel.HEADING_3,
        4: HeadingLevel.HEADING_4,
        5: HeadingLevel.HEADING_5,
        6: HeadingLevel.HEADING_6,
      };

      return new Paragraph({
        heading: headingMap[level] || HeadingLevel.HEADING_1,
        alignment,
        spacing: { before: 240, after: 120 },
        children: runs,
      });
    }

    case 'bulletList': {
      const paragraphs: any[] = [];
      if (Array.isArray(node.content)) {
        for (const item of node.content) {
          if (item.type === 'listItem' && Array.isArray(item.content)) {
            for (const child of item.content) {
              const runs = (child.content || []).map(convertInlineToTextRun).filter(Boolean);
              paragraphs.push(
                new Paragraph({
                  bullet: { level: 0 },
                  spacing: { after: 100 },
                  children: runs,
                })
              );
            }
          }
        }
      }
      return paragraphs;
    }

    case 'orderedList': {
      const paragraphs: any[] = [];
      let index = 1;
      if (Array.isArray(node.content)) {
        for (const item of node.content) {
          if (item.type === 'listItem' && Array.isArray(item.content)) {
            for (const child of item.content) {
              const runs = (child.content || []).map(convertInlineToTextRun).filter(Boolean);
              paragraphs.push(
                new Paragraph({
                  children: [new TextRun({ text: `${index}.  `, bold: true }), ...runs],
                  spacing: { after: 100 },
                })
              );
              index++;
            }
          }
        }
      }
      return paragraphs;
    }

    case 'blockquote': {
      const runs = (node.content?.[0]?.content || []).map(convertInlineToTextRun).filter(Boolean);
      return new Paragraph({
        indent: { left: convertMillimetersToTwip(12.7) },
        border: {
          left: {
            color: '0284c7',
            space: 12,
            style: BorderStyle.SINGLE,
            size: 24,
          },
        },
        spacing: { before: 140, after: 140 },
        children: runs,
      });
    }

    case 'pageBreak': {
      return new Paragraph({
        children: [new DocxPageBreak()],
      });
    }

    case 'table': {
      const rows: TableRow[] = [];
      if (Array.isArray(node.content)) {
        for (const rowNode of node.content) {
          if (rowNode.type === 'tableRow' && Array.isArray(rowNode.content)) {
            const cells: TableCell[] = [];
            for (const cellNode of rowNode.content) {
              const cellParagraphs: Paragraph[] = [];
              if (Array.isArray(cellNode.content)) {
                for (const p of cellNode.content) {
                  const runs = (p.content || []).map(convertInlineToTextRun).filter(Boolean);
                  cellParagraphs.push(new Paragraph({ children: runs }));
                }
              }
              if (cellParagraphs.length === 0) {
                cellParagraphs.push(new Paragraph({ text: '' }));
              }

              const isHeader = cellNode.type === 'tableHeader';
              cells.push(
                new TableCell({
                  shading: isHeader ? { fill: 'F1F5F9' } : undefined,
                  children: cellParagraphs,
                })
              );
            }
            rows.push(new TableRow({ children: cells }));
          }
        }
      }
      return new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows,
      });
    }

    default:
      return null;
  }
}

function convertInlineToTextRun(node: any): TextRun | null {
  if (!node || node.type !== 'text') return null;

  let bold = false;
  let italics = false;
  let strike = false;
  let underline = false;
  let sub = false;
  let sup = false;
  let color: string | undefined = undefined;

  if (Array.isArray(node.marks)) {
    for (const mark of node.marks) {
      if (mark.type === 'bold') bold = true;
      if (mark.type === 'italic') italics = true;
      if (mark.type === 'strike') strike = true;
      if (mark.type === 'underline') underline = true;
      if (mark.type === 'subscript') sub = true;
      if (mark.type === 'superscript') sup = true;
      if (mark.type === 'textStyle' && mark.attrs?.color) {
        color = mark.attrs.color.replace('#', '');
      }
    }
  }

  return new TextRun({
    text: node.text || '',
    bold,
    italics,
    strike,
    underline: underline ? {} : undefined,
    subScript: sub,
    superScript: sup,
    color,
    font: node.marks?.find((mark: any) => mark.type === 'textStyle')?.attrs?.fontFamily?.split(',')[0]?.replace(/"/g, '') || 'Arial',
    size: node.marks?.find((mark: any) => mark.type === 'textStyle')?.attrs?.fontSize ? parseFloat(node.marks.find((mark: any) => mark.type === 'textStyle').attrs.fontSize) * 2 : 22,
  });
}

function mapAlignment(textAlign?: string): (typeof AlignmentType)[keyof typeof AlignmentType] {
  switch (textAlign) {
    case 'center':
      return AlignmentType.CENTER;
    case 'right':
      return AlignmentType.RIGHT;
    case 'justify':
      return AlignmentType.JUSTIFIED;
    case 'left':
    default:
      return AlignmentType.LEFT;
  }
}
