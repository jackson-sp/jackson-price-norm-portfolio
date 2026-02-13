import { jsPDF } from 'jspdf';
import type { BattlecardData } from '../types/battlecard';

// ============== LAYOUT CONSTANTS (single place for all coordinates) ==============
// Landscape A4: 297 x 210 mm
const PAGE_W = 297;
const PAGE_H = 210;
const MARGIN = 10;
const GAP = 2;
const BOX_PAD = 3;
/** Extra top padding so section headers don't feel cramped against the box border (~2–4pt more). */
const BOX_PADDING_TOP = 4.5;
/** Vertical gap between section title and first line of body (mm). ~4–6pt. Applied to all 12 sections. */
const HEADER_TO_BODY_GAP = 1.5;

// —— Key Differentiators: circle grid (no overlap, no bleed) ——
/** Circle radius for star ratings (mm). ~3.4pt – clearly visible at 100% zoom. */
const CIRCLE_RADIUS = 1.2;
/** Edge-to-edge gap between circles (mm). */
const CIRCLE_GAP = 0.8;
/** Horizontal padding inside each rating column for the circle run (mm). */
const DIFF_INNER_PADDING = 1.5;
/** Key Diff: vertical gap between header row and first circle row (mm). */
const KD_HEADER_TO_GRID_GAP = 1;
/** Key Diff: height of each metric row (mm). Must be >= 2*R + 1. */
const KD_ROW_H_DEFAULT = 5;
/** Subtle rounded corners on all section boxes (mm; ~4–5px equivalent). */
const BOX_RADIUS = 1.5;

// Font sizes (recommended: body 9pt, header 10–11pt, title 16–18pt)
const FONT_TITLE = 17;
const FONT_HEAD = 10;
const FONT_BODY = 9;
const LH = 3.5;

const BORDER_COLOR = [180, 180, 180] as const;

// Content area
const CONTENT_W = PAGE_W - 2 * MARGIN;
const CONTENT_H = PAGE_H - 2 * MARGIN;

// Row 1: give more width to Key Differentiators so rating circles fit. Overview & Why We Win narrower.
const ROW1_OVERVIEW_W = (CONTENT_W - 2 * GAP) * 0.28;
const ROW1_DIFF_W = (CONTENT_W - 2 * GAP) * 0.44;
const ROW1_WHY_W = (CONTENT_W - 2 * GAP) * 0.28;

// Rows 2–4: two or three equal columns
const COL2_W = (CONTENT_W - GAP) / 2;
const COL3_W = (CONTENT_W - 2 * GAP) / 3;

// Row heights: row 4 slightly shorter to reclaim space for Section 12. Sum + gaps must fit in CONTENT_H.
const TITLE_BLOCK_H = 10;
const ROW1_H = 34;
const ROW2_H = 38;
const ROW3_H = 38;
const ROW4_H = 24;
const ROW5_H = 38;

const TOTAL_CONTENT_H =
  TITLE_BLOCK_H + ROW1_H + ROW2_H + ROW3_H + ROW4_H + ROW5_H + 4 * GAP;

/** Ensures content fits on page: no negative heights, last section bottom within page. */
function layoutSafe(lastSectionBottom: number): boolean {
  if (TOTAL_CONTENT_H > CONTENT_H) return false;
  if (lastSectionBottom > PAGE_H - MARGIN) return false;
  return true;
}

function getTextLines(doc: jsPDF, text: string, maxWidth: number, fontSize: number): string[] {
  doc.setFontSize(fontSize);
  return doc.splitTextToSize(text || '-', maxWidth);
}

const N_STARS = 5;

/**
 * Draws exactly N_STARS circles in one row for a star rating.
 * @param firstCircleLeftX - x of the left edge of the first circle (centers at firstCircleLeftX + r, etc.)
 * @param centerY - vertical center of the row (cy = rowY + ROW_HEIGHT/2)
 * @param value - 0–5 rating
 * @param r - circle radius (mm)
 * @param gap - gap between circle centers (mm), must be >= 2*r + 2 so circles don't touch
 */
function drawStarRating(
  doc: jsPDF,
  firstCircleLeftX: number,
  centerY: number,
  value: number,
  r: number,
  gap: number
): void {
  const v = Math.max(0, Math.min(N_STARS, Math.round(value)));
  for (let i = 0; i < N_STARS; i++) {
    const cx = firstCircleLeftX + r + i * (2 * r + gap);
    if (i < v) {
      doc.setFillColor(0, 0, 0);
      doc.circle(cx, centerY, r, 'F');
    } else {
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.3);
      doc.circle(cx, centerY, r, 'S');
    }
  }
}

/** Required width for N_STARS circles: N*2*r + (N-1)*gap */
function requiredCircleRunWidth(r: number, gap: number): number {
  return N_STARS * 2 * r + (N_STARS - 1) * gap;
}

/** Right edge of last circle: colStartX + (N-1)*(2*r+gap) + 2*r */
function lastCircleRight(colStartX: number, r: number, gap: number): number {
  return colStartX + (N_STARS - 1) * (2 * r + gap) + 2 * r;
}

/**
 * Compute R and gap so circle run fits in column and does not overlap.
 * Ensures lastCircleRight <= colX + colW - INNER_PADDING. Returns { r, gap }.
 */
function fitCirclesInColumn(
  colW: number,
  innerPadding: number,
  preferredR: number,
  preferredGap: number
): { r: number; gap: number } {
  const maxRunW = colW - 2 * innerPadding;
  let r = preferredR;
  let gap = preferredGap;
  if (lastCircleRight(0, r, gap) > maxRunW) {
    // Shrink gap first, then radius — but never below 1.0mm (~3pt)
    gap = Math.max(0.3, (maxRunW - N_STARS * 2 * r) / (N_STARS - 1));
    if (requiredCircleRunWidth(r, gap) > maxRunW) {
      r = Math.max(1.0, (maxRunW - (N_STARS - 1) * 0.3) / (N_STARS * 2));
      gap = Math.max(0.3, (maxRunW - N_STARS * 2 * r) / (N_STARS - 1));
    }
  }
  return { r, gap };
}

function drawBox(doc: jsPDF, x: number, y: number, w: number, h: number): void {
  doc.setDrawColor(...BORDER_COLOR);
  doc.setLineWidth(0.25);
  doc.roundedRect(x, y, w, h, BOX_RADIUS, BOX_RADIUS, 'S');
}

function sectionHeadInBox(doc: jsPDF, x: number, y: number, w: number, title: string): number {
  doc.setFontSize(FONT_HEAD);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 64, 125);
  const titleLines = getTextLines(doc, title, Math.max(1, w), FONT_HEAD);
  titleLines.forEach((line) => {
    doc.text(line, x, y);
    y += LH;
  });
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  return y + 2.5 + HEADER_TO_BODY_GAP;
}

/** Content Y for section header (top padding); use for all sectionHeadInBox calls. */
function boxContentTop(boxY: number): number {
  return boxY + BOX_PADDING_TOP;
}

function sanitizeFilename(name: string): string {
  return name.replace(/[/\\:*?"<>|]/g, '').trim() || 'Sales-Battlecard';
}

export function generateBattlecardPdf(data: BattlecardData): void {
  const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'landscape' });
  const comp1 = data.differentiators.competitor1 || 'Comp #1';
  const comp2 = data.differentiators.competitor2 || 'Comp #2';
  const r = data.differentiators.ratings;
  const yourName = (data.yourName || '').trim();
  const titleText = yourName ? `${yourName}'s Sales Battlecard` : 'Sales Battlecard';
  const filenameBase = yourName ? `${sanitizeFilename(data.yourName)}-Sales-Battlecard` : 'Sales-Battlecard';

  // —— Title: single line ——
  doc.setFontSize(FONT_TITLE);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 64, 125);
  doc.text(titleText, MARGIN, MARGIN + 6);
  doc.setDrawColor(30, 64, 125);
  doc.setLineWidth(0.4);
  doc.line(MARGIN, MARGIN + 8, PAGE_W - MARGIN, MARGIN + 8);

  let rowY = MARGIN + TITLE_BLOCK_H;

  // —— Row 1: Overview (narrow) | Key Differentiators (wide) | Why We Win (narrow) ——
  const r1y = rowY;
  const r1h = ROW1_H;
  const innerOverviewW = ROW1_OVERVIEW_W - 2 * BOX_PAD;
  const innerWhyW = ROW1_WHY_W - 2 * BOX_PAD;
  const maxY1 = r1y + r1h - BOX_PAD;

  let x = MARGIN;
  drawBox(doc, x, r1y, ROW1_OVERVIEW_W, r1h);
  let y = sectionHeadInBox(doc, x + BOX_PAD, boxContentTop(r1y), innerOverviewW, '1. Overview');
  doc.setFontSize(FONT_BODY);
  getTextLines(doc, data.overview.companyDescription, innerOverviewW, FONT_BODY)
    .slice(0, 2)
    .forEach((line) => {
      if (y <= maxY1) {
        doc.text(line, x + BOX_PAD, y);
        y += LH;
      }
    });
  if (y <= maxY1) {
    y += LH * 0.5;
    doc.setFont('helvetica', 'bold');
    const audienceLabelW = doc.getTextWidth('Audience: ');
    doc.text('Audience: ', x + BOX_PAD, y);
    doc.setFont('helvetica', 'normal');
    doc.text((data.overview.audience || '-').slice(0, 30), x + BOX_PAD + audienceLabelW, y);
    y += LH * 1.2;
    y += LH * 0.8;
  }
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(FONT_BODY);
  doc.text('Top Features', x + BOX_PAD, y);
  y += LH;
  doc.setFont('helvetica', 'normal');
  data.overview.topFeatures.forEach((f) => {
    if (f && y <= maxY1) {
      doc.text('• ' + f.slice(0, 28), x + BOX_PAD, y);
      y += LH;
    }
  });

  x = MARGIN + ROW1_OVERVIEW_W + GAP;
  const diffBoxX = x;
  const diffBoxY = r1y;
  const diffBoxW = ROW1_DIFF_W;
  const diffBoxH = r1h;
  drawBox(doc, diffBoxX, diffBoxY, diffBoxW, diffBoxH);
  const innerBottomY = diffBoxY + diffBoxH - BOX_PAD;

  // Content area — no clip rect; coordinate math keeps content in bounds
  const diffBoxContentX = diffBoxX + BOX_PAD;
  const contentTopY = diffBoxY + BOX_PAD;
  const usableW = diffBoxW - 2 * BOX_PAD;
  // Fixed 25% equal-width columns: Metric | You | Comp1 | Comp2
  const colW25 = usableW / 4;
  const ratingColW = colW25;
  const col1X = diffBoxContentX + colW25;
  const col2X = diffBoxContentX + 2 * colW25;
  const col3X = diffBoxContentX + 3 * colW25;

  // Fit 5 circles within each rating column
  let { r: effectiveR, gap: effectiveGap } = fitCirclesInColumn(
    ratingColW,
    DIFF_INNER_PADDING,
    CIRCLE_RADIUS,
    CIRCLE_GAP
  );

  // Section title
  doc.setFontSize(FONT_HEAD);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 64, 125);
  doc.text('2. Key Differentiators', diffBoxContentX, contentTopY + 3.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);

  // Column headers — same header-to-body gap as other sections
  const headerY = contentTopY + 3.5 + LH + HEADER_TO_BODY_GAP;
  const gridTopY = headerY + 2 + KD_HEADER_TO_GRID_GAP;
  doc.setFontSize(FONT_BODY);
  doc.setFont('helvetica', 'bold');
  doc.text('Metric', diffBoxContentX + colW25 / 2, headerY, { align: 'center' });
  doc.text('You', col1X + colW25 / 2, headerY, { align: 'center' });
  doc.text(comp1.slice(0, 10), col2X + colW25 / 2, headerY, { align: 'center' });
  doc.text(comp2.slice(0, 10), col3X + colW25 / 2, headerY, { align: 'center' });
  doc.setFont('helvetica', 'normal');

  // Metric data
  const metrics: [string, number, number, number][] = [
    ['Price', r.price.you, r.price.comp1, r.price.comp2],
    ['Speed', r.speed.you, r.speed.comp1, r.speed.comp2],
    ['Support', r.support.you, r.support.comp1, r.support.comp2],
    ['Security', r.security.you, r.security.comp1, r.security.comp2],
    ['Apps', r.apps.you, r.apps.comp1, r.apps.comp2],
  ];
  const numMetrics = metrics.length;
  const maxGridH = innerBottomY - gridTopY;
  let KD_ROW_H = Math.min(KD_ROW_H_DEFAULT, maxGridH / numMetrics);
  const minRowHForCircles = 2 * effectiveR + 1;
  if (KD_ROW_H < minRowHForCircles) {
    KD_ROW_H = maxGridH / numMetrics;
    effectiveR = Math.max(1.0, (KD_ROW_H - 1) / 2);
    effectiveGap = Math.max(0.3, effectiveGap);
    const fit = fitCirclesInColumn(ratingColW, DIFF_INNER_PADDING, effectiveR, effectiveGap);
    effectiveR = fit.r;
    effectiveGap = fit.gap;
  }
  if (gridTopY + numMetrics * KD_ROW_H > innerBottomY) {
    KD_ROW_H = (innerBottomY - gridTopY) / numMetrics;
  }

  // Center the 5-circle group horizontally within each rating column
  const circleRunW = requiredCircleRunWidth(effectiveR, effectiveGap);
  const colStart1 = col1X + (ratingColW - circleRunW) / 2;
  const colStart2 = col2X + (ratingColW - circleRunW) / 2;
  const colStart3 = col3X + (ratingColW - circleRunW) / 2;

  // Draw rating circles for each metric row
  metrics.forEach(([label, a, b, c], rowIndex) => {
    const mRowY = gridTopY + rowIndex * KD_ROW_H;
    const centerY = mRowY + KD_ROW_H / 2;
    doc.text(label, diffBoxContentX + colW25 / 2, mRowY + KD_ROW_H * 0.7, { align: 'center' });
    drawStarRating(doc, colStart1, centerY, a, effectiveR, effectiveGap);
    drawStarRating(doc, colStart2, centerY, b, effectiveR, effectiveGap);
    drawStarRating(doc, colStart3, centerY, c, effectiveR, effectiveGap);
  });
  y = gridTopY + numMetrics * KD_ROW_H;

  x = MARGIN + ROW1_OVERVIEW_W + GAP + ROW1_DIFF_W + GAP;
  drawBox(doc, x, r1y, ROW1_WHY_W, r1h);
  y = sectionHeadInBox(doc, x + BOX_PAD, boxContentTop(r1y), innerWhyW, '3. Why We Win');
  doc.setFontSize(FONT_BODY);
  data.whyWeWin.forEach((b) => {
    if (b && y <= maxY1) {
      getTextLines(doc, '• ' + b, innerWhyW - 2, FONT_BODY).forEach((line) => {
        if (y <= maxY1) {
          doc.text(line, x + BOX_PAD, y);
          y += LH;
        }
      });
    }
  });

  rowY += ROW1_H + GAP;

  // —— Row 2: Customer Pain Points | Handling Objections ——
  const r2y = rowY;
  const r2h = ROW2_H;
  const innerW2 = COL2_W - 2 * BOX_PAD;
  const maxY2 = r2y + r2h - BOX_PAD;

  drawBox(doc, MARGIN, r2y, COL2_W, r2h);
  y = sectionHeadInBox(doc, MARGIN + BOX_PAD, boxContentTop(r2y), innerW2, '4. Customer Pain Points');
  doc.setFontSize(FONT_BODY);
  const painList = Array.isArray(data.painPoints) ? data.painPoints : [data.painPoints];
  painList.filter(Boolean).forEach((point) => {
    if (y <= maxY2) {
      getTextLines(doc, point, innerW2, FONT_BODY).forEach((line) => {
        if (y <= maxY2) {
          doc.text(line, MARGIN + BOX_PAD, y);
          y += LH;
        }
      });
      y += LH * 0.3;
    }
  });

  x = MARGIN + COL2_W + GAP;
  drawBox(doc, x, r2y, COL2_W, r2h);
  y = sectionHeadInBox(doc, x + BOX_PAD, boxContentTop(r2y), innerW2, '5. Handling Objections');
  doc.setFontSize(FONT_BODY);
  data.objections.forEach((o) => {
    if ((o.objection || o.response) && y <= maxY2) {
      doc.setFont('helvetica', 'bold');
      getTextLines(doc, o.objection || '-', innerW2, FONT_BODY).forEach((line) => {
        if (y <= maxY2) {
          doc.text(line, x + BOX_PAD, y);
          y += LH;
        }
      });
      doc.setFont('helvetica', 'normal');
      getTextLines(doc, o.response || '-', innerW2, FONT_BODY).forEach((line) => {
        if (y <= maxY2) {
          doc.text(line, x + BOX_PAD, y);
          y += LH;
        }
      });
      y += LH * 0.6;
    }
  });

  rowY += ROW2_H + GAP;

  // —— Row 3: Key Features | Questions to Ask | Pricing ——
  const r3y = rowY;
  const r3h = ROW3_H;
  const innerW3 = COL3_W - 2 * BOX_PAD;
  const maxY3 = r3y + r3h - BOX_PAD;

  x = MARGIN;
  drawBox(doc, x, r3y, COL3_W, r3h);
  y = sectionHeadInBox(doc, x + BOX_PAD, boxContentTop(r3y), innerW3, '6. Key Features');
  doc.setFontSize(FONT_BODY);
  data.keyFeatures.forEach((f) => {
    if ((f.name || f.description) && y <= maxY3) {
      doc.setFont('helvetica', 'bold');
      doc.text((f.name || '-').slice(0, 22), x + BOX_PAD, y);
      y += LH;
      doc.setFont('helvetica', 'normal');
      getTextLines(doc, f.description || '', innerW3, FONT_BODY)
        .slice(0, 2)
        .forEach((line) => {
          doc.text(line, x + BOX_PAD, y);
          y += LH;
        });
      y += LH * 0.4;
    }
  });

  x = MARGIN + COL3_W + GAP;
  drawBox(doc, x, r3y, COL3_W, r3h);
  y = sectionHeadInBox(doc, x + BOX_PAD, boxContentTop(r3y), innerW3, '7. Questions to Ask');
  doc.setFontSize(FONT_BODY);
  data.questionsToAsk.forEach((q) => {
    if (q && y <= maxY3) {
      getTextLines(doc, '• ' + q, innerW3, FONT_BODY).forEach((line) => {
        if (y <= maxY3) {
          doc.text(line, x + BOX_PAD, y);
          y += LH;
        }
      });
    }
  });

  x = MARGIN + 2 * (COL3_W + GAP);
  drawBox(doc, x, r3y, COL3_W, r3h);
  y = sectionHeadInBox(doc, x + BOX_PAD, boxContentTop(r3y), innerW3, '8. Pricing');
  doc.setFontSize(FONT_BODY);
  const pw = innerW3 / 3;
  const priceRowH = 3.5;
  doc.setFont('helvetica', 'bold');
  doc.text('', x + BOX_PAD, y + 2);
  doc.text('Monthly', x + BOX_PAD + pw, y + 2);
  doc.text('Annual', x + BOX_PAD + 2 * pw, y + 2);
  y += priceRowH;
  doc.setFont('helvetica', 'normal');
  [
    ['You', data.pricing.you.monthly, data.pricing.you.annual],
    [comp1.slice(0, 8), data.pricing.comp1.monthly, data.pricing.comp1.annual],
    [comp2.slice(0, 8), data.pricing.comp2.monthly, data.pricing.comp2.annual],
  ].forEach(([who, mon, ann]) => {
    doc.text(String(who).slice(0, 8), x + BOX_PAD, y + 2);
    doc.text((mon || '-').slice(0, 10), x + BOX_PAD + pw, y + 2);
    doc.text((ann || '-').slice(0, 10), x + BOX_PAD + 2 * pw, y + 2);
    y += priceRowH;
  });

  rowY += ROW3_H + GAP;

  // —— Row 4: Quick Tips | Third-Party Validation | Relevant Customers (slightly shorter) ——
  const r4y = rowY;
  const r4h = ROW4_H;
  const maxY4 = r4y + r4h - BOX_PAD;

  x = MARGIN;
  drawBox(doc, x, r4y, COL3_W, r4h);
  y = sectionHeadInBox(doc, x + BOX_PAD, boxContentTop(r4y), innerW3, '9. Quick Tips');
  doc.setFontSize(FONT_BODY);
  getTextLines(doc, data.quickTips, innerW3, FONT_BODY)
    .slice(0, 4)
    .forEach((line) => {
      if (y <= maxY4) {
        doc.text(line, x + BOX_PAD, y);
        y += LH;
      }
    });

  x = MARGIN + COL3_W + GAP;
  drawBox(doc, x, r4y, COL3_W, r4h);
  y = sectionHeadInBox(doc, x + BOX_PAD, boxContentTop(r4y), innerW3, '10. Third-Party Validation');
  doc.setFontSize(FONT_BODY);
  getTextLines(doc, data.thirdPartyValidation, innerW3, FONT_BODY)
    .slice(0, 4)
    .forEach((line) => {
      if (y <= maxY4) {
        doc.text(line, x + BOX_PAD, y);
        y += LH;
      }
    });

  x = MARGIN + 2 * (COL3_W + GAP);
  drawBox(doc, x, r4y, COL3_W, r4h);
  y = sectionHeadInBox(doc, x + BOX_PAD, boxContentTop(r4y), innerW3, '11. Relevant Customers');
  doc.setFontSize(FONT_BODY);
  getTextLines(doc, data.relevantCustomers, innerW3, FONT_BODY)
    .slice(0, 4)
    .forEach((line) => {
      if (y <= maxY4) {
        doc.text(line, x + BOX_PAD, y);
        y += LH;
      }
    });

  rowY += ROW4_H + GAP;

  // —— Row 5: Section 12 Additional Resources (must fit within page) ——
  const r5y = rowY;
  const r5h = ROW5_H;
  const r5w = CONTENT_W;
  const innerR5w = r5w - 2 * BOX_PAD;
  const maxY5 = PAGE_H - MARGIN - BOX_PAD;

  if (r5y + r5h > PAGE_H - MARGIN) {
    console.warn('Battlecard PDF: Row 5 would exceed page. Layout constants may need adjustment.');
  }

  drawBox(doc, MARGIN, r5y, r5w, r5h);
  y = sectionHeadInBox(doc, MARGIN + BOX_PAD, boxContentTop(r5y), innerR5w, '12. Additional Resources');
  doc.setFontSize(FONT_BODY);
  doc.setFont('helvetica', 'normal');
  const content = (data.additionalResources.content || '').trim() || '-';
  getTextLines(doc, content, innerR5w, FONT_BODY).forEach((line) => {
    if (y <= maxY5) {
      doc.text(line, MARGIN + BOX_PAD, y);
      y += LH;
    }
  });

  const finalBottom = r5y + r5h;
  if (!layoutSafe(finalBottom)) {
    console.warn(
      `Battlecard PDF layout: content bottom ${finalBottom.toFixed(1)}mm exceeds safe area (${PAGE_H - MARGIN}mm). Section 12 may be clipped.`
    );
  }

  doc.save(`${filenameBase.replace(/\s+/g, '-')}.pdf`);
}
