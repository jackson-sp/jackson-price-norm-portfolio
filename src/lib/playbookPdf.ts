import { jsPDF } from 'jspdf';
import type { PlaybookData } from '../types/playbook';

// Portrait A4: 210 x 297 mm
const PAGE_W = 210;
const PAGE_H = 297;
const MARGIN = 12;
const BOX_PAD = 4;
/** Extra top padding above section title inside each box (~2–4pt breathing room). */
const SECTION_TITLE_TOP_PAD = 1.5;
const BOX_RADIUS = 1.5;
const FONT_TITLE = 17;
const FONT_HEAD = 10;
const FONT_BODY = 9;
const LH = 4;
const HEADER_TO_BODY_GAP = 2;
const MIN_Y_FOR_HEADER = 28;
const BORDER_COLOR = [180, 180, 180] as const;

const CONTENT_W = PAGE_W - 2 * MARGIN;
const BOTTOM_LIMIT = PAGE_H - MARGIN;

function getTextLines(doc: jsPDF, text: string, maxWidth: number, fontSize: number): string[] {
  doc.setFontSize(fontSize);
  return doc.splitTextToSize(text || '', Math.max(1, maxWidth));
}

function sanitizeFilename(name: string): string {
  return name.replace(/[/\\:*?"<>|]/g, '').trim() || 'Messaging-Playbook';
}

function drawBox(doc: jsPDF, x: number, y: number, w: number, h: number): void {
  doc.setDrawColor(...BORDER_COLOR);
  doc.setLineWidth(0.25);
  doc.roundedRect(x, y, w, h, BOX_RADIUS, BOX_RADIUS, 'S');
}

export function generatePlaybookPdf(data: PlaybookData): void {
  const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
  const yourName = (data.yourName || '').trim();
  const titleText = yourName ? `${yourName}'s Messaging Playbook` : 'Messaging Playbook';
  const filenameBase = yourName ? `${sanitizeFilename(data.yourName)}-Messaging-Playbook` : 'Messaging-Playbook';

  let y = MARGIN;

  function ensureSpaceForHeader(): void {
    if (y > BOTTOM_LIMIT - MIN_Y_FOR_HEADER) {
      doc.addPage();
      y = MARGIN;
    }
  }

  function startSectionBox(title: string): number {
    ensureSpaceForHeader();
    const boxY = y;
    y += BOX_PAD + SECTION_TITLE_TOP_PAD;
    doc.setFontSize(FONT_HEAD);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 64, 125);
    const titleLines = getTextLines(doc, title, CONTENT_W - 2 * BOX_PAD, FONT_HEAD);
    titleLines.forEach((line) => {
      doc.text(line, MARGIN + BOX_PAD, y);
      y += LH;
    });
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    y += HEADER_TO_BODY_GAP;
    return boxY;
  }

  function endSectionBox(boxY: number): void {
    const boxH = y - boxY + BOX_PAD;
    drawBox(doc, MARGIN, boxY, CONTENT_W, boxH);
    y += BOX_PAD + 4;
  }

  function drawBodyText(text: string, innerW: number): void {
    if (!text.trim()) return;
    doc.setFontSize(FONT_BODY);
    const lines = getTextLines(doc, text, innerW, FONT_BODY);
    for (const line of lines) {
      if (y > BOTTOM_LIMIT - LH) {
        doc.addPage();
        y = MARGIN;
      }
      doc.text(line, MARGIN + BOX_PAD, y);
      y += LH;
    }
  }

  function drawBodyList(items: string[], innerW: number): void {
    const list = items.filter((s) => s.trim());
    if (list.length === 0) return;
    doc.setFontSize(FONT_BODY);
    for (const item of list) {
      const lines = getTextLines(doc, '• ' + item.trim(), innerW - 4, FONT_BODY);
      for (const line of lines) {
        if (y > BOTTOM_LIMIT - LH) {
          doc.addPage();
          y = MARGIN;
        }
        doc.text(line, MARGIN + BOX_PAD + 2, y);
        y += LH;
      }
    }
  }

  const innerW = CONTENT_W - 2 * BOX_PAD;

  // Title (no box)
  doc.setFontSize(FONT_TITLE);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 64, 125);
  doc.text(titleText, MARGIN, y);
  y += 8;
  doc.setDrawColor(30, 64, 125);
  doc.setLineWidth(0.4);
  doc.line(MARGIN, y, PAGE_W - MARGIN, y);
  y += 8;

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);

  let boxY = startSectionBox('Value Proposition');
  drawBodyText(data.valueProposition, innerW);
  endSectionBox(boxY);

  boxY = startSectionBox('Audience');
  drawBodyText(data.audience, innerW);
  endSectionBox(boxY);

  boxY = startSectionBox('Elevator Pitch');
  drawBodyText(data.elevatorPitch, innerW);
  endSectionBox(boxY);

  boxY = startSectionBox('Long Description');
  drawBodyText(data.longDescription, innerW);
  endSectionBox(boxY);

  boxY = startSectionBox('Tone of Voice');
  drawBodyText(data.toneOfVoice, innerW);
  endSectionBox(boxY);

  boxY = startSectionBox('Outcomes');
  drawBodyList(data.outcomes, innerW);
  endSectionBox(boxY);

  boxY = startSectionBox('Customer Requirements');
  drawBodyList(data.customerRequirements, innerW);
  endSectionBox(boxY);

  // Outcome Pillars table — always start on page 2
  doc.addPage();
  y = MARGIN;
  const tableBoxY = y;
  y += BOX_PAD + SECTION_TITLE_TOP_PAD;
  doc.setFontSize(FONT_HEAD);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 64, 125);
  doc.text('Outcome Pillars', MARGIN + BOX_PAD, y);
  y += LH + HEADER_TO_BODY_GAP;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);

  const labelColW = 42;
  const pillarColW = (CONTENT_W - 2 * BOX_PAD - labelColW) / 3;
  const rowLabels = ['Pain points', 'Product/feature benefits', 'Product/feature details', 'Proof points'];
  const pillarKeys = ['painPoints', 'productBenefits', 'productDetails', 'proofPoints'] as const;
  const cellPad = 3;
  const lineH = 4;
  const maxLinesPerCell = 12;

  doc.setDrawColor(...BORDER_COLOR);
  doc.setLineWidth(0.2);
  doc.setFontSize(FONT_BODY);

  const headerH = lineH + cellPad * 2;
  if (y > BOTTOM_LIMIT - headerH) {
    doc.addPage();
    y = MARGIN;
  }
  doc.setFont('helvetica', 'bold');
  doc.rect(MARGIN + BOX_PAD, y, labelColW, headerH);
  doc.rect(MARGIN + BOX_PAD + labelColW, y, pillarColW, headerH);
  doc.rect(MARGIN + BOX_PAD + labelColW + pillarColW, y, pillarColW, headerH);
  doc.rect(MARGIN + BOX_PAD + labelColW + 2 * pillarColW, y, pillarColW, headerH);
  doc.text('Pillar 1', MARGIN + BOX_PAD + labelColW + cellPad, y + cellPad + lineH * 0.8);
  doc.text('Pillar 2', MARGIN + BOX_PAD + labelColW + pillarColW + cellPad, y + cellPad + lineH * 0.8);
  doc.text('Pillar 3', MARGIN + BOX_PAD + labelColW + 2 * pillarColW + cellPad, y + cellPad + lineH * 0.8);
  doc.setFont('helvetica', 'normal');
  y += headerH;

  for (let row = 0; row < 4; row++) {
    if (y > BOTTOM_LIMIT - lineH * 3) {
      doc.addPage();
      y = MARGIN;
    }
    let maxLines = 1;
    for (let c = 0; c < 3; c++) {
      const lines = getTextLines(doc, (data.pillars[c][pillarKeys[row]] || '').trim() || '-', pillarColW - cellPad * 2, FONT_BODY);
      maxLines = Math.max(maxLines, Math.min(maxLinesPerCell, lines.length));
    }
    const cellH = Math.max(lineH * 3, maxLines * lineH + cellPad * 2);
    const cellTop = y;

    doc.setFont('helvetica', 'bold');
    doc.rect(MARGIN + BOX_PAD, cellTop, labelColW, cellH);
    const labelLines = getTextLines(doc, rowLabels[row], labelColW - cellPad * 2, FONT_BODY);
    labelLines.slice(0, 3).forEach((line, i) => {
      doc.text(line, MARGIN + BOX_PAD + cellPad, cellTop + cellPad + (i + 1) * lineH);
    });
    doc.setFont('helvetica', 'normal');

    for (let col = 0; col < 3; col++) {
      const cellX = MARGIN + BOX_PAD + labelColW + col * pillarColW;
      doc.rect(cellX, cellTop, pillarColW, cellH);
      const lines = getTextLines(doc, (data.pillars[col][pillarKeys[row]] || '').trim() || '-', pillarColW - cellPad * 2, FONT_BODY);
      lines.slice(0, maxLinesPerCell).forEach((line, i) => {
        if (cellTop + cellPad + (i + 1) * lineH <= cellTop + cellH - cellPad) {
          doc.text(line, cellX + cellPad, cellTop + cellPad + (i + 1) * lineH);
        }
      });
    }
    y = cellTop + cellH;
  }

  drawBox(doc, MARGIN, tableBoxY, CONTENT_W, y - tableBoxY + BOX_PAD);
  y += BOX_PAD + 4;

  doc.save(`${filenameBase}.pdf`);
}
