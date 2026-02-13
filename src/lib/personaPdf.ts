import { jsPDF } from 'jspdf';
import type { PersonaData } from '../types/persona';

const PAGE_W = 210;
const MARGIN = 12;
const CONTENT_W = PAGE_W - 2 * MARGIN;

const BOX_PAD_H = 5;
const BOX_PAD_V = 6;
const BOX_TOP_PADDING = 6;
const BOX_LABEL_TO_CONTENT_GAP = 2;
const GAP_BETWEEN_ROWS = 5;
const SPLIT_GAP = 4;
const HALF_W = (CONTENT_W - SPLIT_GAP) / 2;
const BOX_RADIUS = 1.5;
const FONT_TITLE = 17;
const FONT_SECTION = 10;
const FONT_BODY = 9;
const LINE_HEIGHT = 4;
const BORDER_WIDTH = 0.25;
const BORDER_COLOR = [180, 180, 180] as const;
const TITLE_BLUE = [30, 64, 125] as const;

const EMPTY_PLACEHOLDER = '—';

function getTextLines(doc: jsPDF, text: string, maxWidth: number, fontSize: number): string[] {
  doc.setFontSize(fontSize);
  return doc.splitTextToSize(text || '', Math.max(1, maxWidth));
}

function sanitizeFilename(name: string): string {
  return name.replace(/[/\\:*?"<>|]/g, '').trim() || 'Persona-Card';
}

function drawBox(doc: jsPDF, x: number, y: number, w: number, h: number): void {
  doc.setDrawColor(...BORDER_COLOR);
  doc.setLineWidth(BORDER_WIDTH);
  doc.roundedRect(x, y, w, h, BOX_RADIUS, BOX_RADIUS, 'S');
}

export function generatePersonaPdf(data: PersonaData): void {
  const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
  const personaName = (data.name || '').trim();
  const titleText = personaName ? `${personaName} — Persona Card` : 'Persona Card';
  const filenameBase = personaName ? `${sanitizeFilename(data.name)}-Persona-Card` : 'Persona-Card';

  let y = MARGIN;

  function drawSectionTitle(title: string, x: number, width: number): number {
    doc.setFontSize(FONT_SECTION);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...TITLE_BLUE); // navy #1E407D rgb(30, 64, 125)
    const innerW = width - 2 * BOX_PAD_H;
    const lines = getTextLines(doc, title, innerW, FONT_SECTION);
    for (const line of lines) {
      doc.text(line, x + BOX_PAD_H, y);
      y += LINE_HEIGHT;
    }
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    return y;
  }

  function drawBoldLabelLine(label: string, value: string, x: number, width: number): number {
    const innerW = width - 2 * BOX_PAD_H;
    const text = `${(value || '').trim() || EMPTY_PLACEHOLDER}`;
    doc.setFontSize(FONT_BODY);
    doc.setFont('helvetica', 'bold');
    doc.text(label + ': ', x + BOX_PAD_H, y);
    const labelW = doc.getTextWidth(label + ': ');
    doc.setFont('helvetica', 'normal');
    const valueLines = getTextLines(doc, text, innerW - labelW, FONT_BODY);
    if (valueLines.length === 0) {
      y += LINE_HEIGHT;
      return y;
    }
    doc.text(valueLines[0], x + BOX_PAD_H + labelW, y);
    y += LINE_HEIGHT;
    for (let i = 1; i < valueLines.length; i++) {
      doc.text(valueLines[i], x + BOX_PAD_H, y);
      y += LINE_HEIGHT;
    }
    return y;
  }

  function drawParagraph(content: string, x: number, width: number): void {
    const innerW = width - 2 * BOX_PAD_H;
    const text = (content || '').trim() || EMPTY_PLACEHOLDER;
    doc.setFontSize(FONT_BODY);
    const lines = getTextLines(doc, text, innerW, FONT_BODY);
    for (const line of lines) {
      doc.text(line, x + BOX_PAD_H, y);
      y += LINE_HEIGHT;
    }
  }

  function drawBulletList(items: string[], x: number, width: number): void {
    const innerW = width - 2 * BOX_PAD_H - 4;
    const list = (items || []).filter((s) => (s || '').trim());
    doc.setFontSize(FONT_BODY);
    if (list.length === 0) {
      doc.text(EMPTY_PLACEHOLDER, x + BOX_PAD_H, y);
      y += LINE_HEIGHT;
      return;
    }
    for (const item of list) {
      const lines = getTextLines(doc, '• ' + (item || '').trim(), innerW, FONT_BODY);
      for (const line of lines) {
        doc.text(line, x + BOX_PAD_H + 2, y);
        y += LINE_HEIGHT;
      }
    }
  }

  /** Renders a full-width single box. Returns bottom Y. */
  function singleBox(
    sectionTitle: string,
    renderContent: (x: number, width: number) => void
  ): number {
    const boxY = y;
    y += BOX_TOP_PADDING;
    drawSectionTitle(sectionTitle, MARGIN, CONTENT_W);
    y += BOX_LABEL_TO_CONTENT_GAP;
    renderContent(MARGIN, CONTENT_W);
    y += BOX_PAD_V;
    const boxH = y - boxY;
    drawBox(doc, MARGIN, boxY, CONTENT_W, boxH);
    y += GAP_BETWEEN_ROWS;
    return y;
  }

  /** Renders two equal-width boxes side by side. Returns bottom Y (max of both). */
  function splitRow(
    leftTitle: string,
    rightTitle: string,
    renderLeft: (x: number, width: number) => void,
    renderRight: (x: number, width: number) => void
  ): number {
    const rowY = y;
    const leftX = MARGIN;
    const rightX = MARGIN + HALF_W + SPLIT_GAP;

    y = rowY + BOX_TOP_PADDING;
    drawSectionTitle(leftTitle, leftX, HALF_W);
    y += BOX_LABEL_TO_CONTENT_GAP;
    renderLeft(leftX, HALF_W);
    y += BOX_PAD_V;
    const leftH = y - rowY;

    y = rowY + BOX_TOP_PADDING;
    drawSectionTitle(rightTitle, rightX, HALF_W);
    y += BOX_LABEL_TO_CONTENT_GAP;
    renderRight(rightX, HALF_W);
    y += BOX_PAD_V;
    const rightH = y - rowY;

    const rowH = Math.max(leftH, rightH);
    drawBox(doc, leftX, rowY, HALF_W, rowH);
    drawBox(doc, rightX, rowY, HALF_W, rowH);
    y = rowY + rowH + GAP_BETWEEN_ROWS;
    return y;
  }

  // ---------- PAGE 1 ----------
  doc.setFontSize(FONT_TITLE);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...TITLE_BLUE);
  doc.text(titleText, MARGIN, y);
  y += 8;
  doc.setDrawColor(...TITLE_BLUE);
  doc.setLineWidth(0.4);
  doc.line(MARGIN, y, PAGE_W - MARGIN, y);
  y += 8;

  y = singleBox('Bio', (x, w) => drawParagraph(data.bio, x, w));

  y = singleBox('Role in the Buying Process', (x, w) => drawParagraph(data.roleInBuyingProcess, x, w));

  y = singleBox('Background', (x, w) => {
    const title = (data.backgroundTitle ?? data.background ?? '').trim() || EMPTY_PLACEHOLDER;
    const reportsTo = (data.reportsTo ?? '').trim() || EMPTY_PLACEHOLDER;
    const numReports = (data.numberOfReports ?? '').trim() || EMPTY_PLACEHOLDER;
    const purchasingRole = (data.purchasingRole ?? '').trim() || EMPTY_PLACEHOLDER;
    drawBoldLabelLine('Title', title, x, w);
    drawBoldLabelLine('Reports to', reportsTo, x, w);
    drawBoldLabelLine('Number of reports', numReports, x, w);
    drawBoldLabelLine('Purchasing Role', purchasingRole, x, w);
  });

  y = singleBox('Demographics', (x, w) => {
    const age = (data.age ?? '').trim() || EMPTY_PLACEHOLDER;
    const gender = (data.gender ?? '').trim() || EMPTY_PLACEHOLDER;
    const location = (data.location ?? data.demographics ?? '').trim() || EMPTY_PLACEHOLDER;
    drawBoldLabelLine('Age', age, x, w);
    drawBoldLabelLine('Gender', gender, x, w);
    drawBoldLabelLine('Location', location, x, w);
  });

  y = singleBox('Company Info', (x, w) => {
    drawBoldLabelLine('Industry', (data.industry ?? '').trim() || EMPTY_PLACEHOLDER, x, w);
    drawBoldLabelLine('Size', (data.companySize ?? '').trim() || EMPTY_PLACEHOLDER, x, w);
    drawBoldLabelLine('Revenue', (data.revenue ?? '').trim() || EMPTY_PLACEHOLDER, x, w);
  });

  y = singleBox('Personality', (x, w) => drawParagraph(data.personality, x, w));

  y = singleBox('Responsibilities', (x, w) => drawParagraph(data.responsibilities, x, w));

  // ---------- PAGE 2 ----------
  doc.addPage();
  y = MARGIN;

  y = singleBox('Goals', (x, w) => drawParagraph(data.goals, x, w));

  y = singleBox('Challenges', (x, w) => drawParagraph(data.challenges, x, w));

  y = splitRow(
    'Motivators',
    'Validators',
    (x, w) => drawParagraph(data.motivators, x, w),
    (x, w) => drawBulletList(data.validators ?? [], x, w)
  );

  y = singleBox('Why won\'t they buy? (Objections)', (x, w) => drawBulletList(data.objections ?? [], x, w));

  y = singleBox('What closes the deal? (Triggers)', (x, w) => drawBulletList(data.triggers ?? [], x, w));

  y = singleBox('Communication Preferences', (x, w) => drawParagraph(data.communicationPreferences, x, w));

  y = splitRow(
    'Most Valued Features',
    'Least Valued Features',
    (x, w) => drawBulletList(data.mostValuedFeatures ?? [], x, w),
    (x, w) => drawBulletList(data.leastValuedFeatures ?? [], x, w)
  );

  y = singleBox('Price Point', (x, w) => {
    drawBoldLabelLine('Willing to pay', (data.willingnessToPay ?? '').trim() || EMPTY_PLACEHOLDER, x, w);
    drawBoldLabelLine('Customer acquisition cost (CAC)', (data.cac ?? '').trim() || EMPTY_PLACEHOLDER, x, w);
    drawBoldLabelLine('Lifetime value (LTV)', (data.ltv ?? '').trim() || EMPTY_PLACEHOLDER, x, w);
  });

  doc.save(`${filenameBase}.pdf`);
}
