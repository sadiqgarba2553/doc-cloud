export interface LayoutBlock { pos: number; height: number; pageBreak?: boolean }
export interface PageGap { pos: number; height: number }

// Layout decorations never enter the document model or change selection positions.
export function paginateBlocks(blocks: LayoutBlock[], bodyHeight: number, pageSeparation: number) {
  let used = 0;
  let pages = 1;
  let oversized = false;
  const gaps: PageGap[] = [];
  for (const block of blocks) {
    if (block.pageBreak || (used > 0 && used + block.height > bodyHeight)) {
      gaps.push({ pos: block.pos, height: Math.max(0, bodyHeight - used) + pageSeparation });
      pages++;
      used = 0;
    }
    if (!block.pageBreak) {
      oversized ||= block.height > bodyHeight;
      used += block.height;
    }
  }
  return { gaps, pages, oversized };
}
