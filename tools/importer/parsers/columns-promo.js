/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-promo
 * Base block: columns
 * Source: https://www.twistbioscience.com/
 * Selector: .cardlistingblock .column-control-container.sixty-forty
 * Generated: 2026-05-26
 *
 * Two-column promotional layout (60/40 split):
 *   Column 1: Promotional text content (offer headline, details, CTA link)
 *   Column 2: Product image
 */
export default function parse(element, { document }) {
  // Extract the two columns from the sixty-forty layout
  const columns = element.querySelectorAll(':scope > .column');

  // Column 1: Text content (promotional text + CTA)
  const textColumn = columns[0];
  const contentCell = [];

  if (textColumn) {
    // Extract all meaningful paragraphs (skip empty/whitespace-only ones)
    const paragraphs = textColumn.querySelectorAll('.cmp-text p');
    paragraphs.forEach((p) => {
      const textContent = p.textContent.trim();
      // Skip empty paragraphs (nbsp-only)
      if (textContent && textContent !== ' ') {
        contentCell.push(p);
      }
    });

    // Extract CTA link if not already captured via paragraph
    if (contentCell.length === 0) {
      // Fallback: grab all text and links directly
      const allText = textColumn.querySelectorAll('p, a');
      allText.forEach((el) => {
        const text = el.textContent.trim();
        if (text && text !== ' ') {
          contentCell.push(el);
        }
      });
    }
  }

  // Column 2: Image content
  const imageColumn = columns[1];
  const imageCell = [];

  if (imageColumn) {
    const img = imageColumn.querySelector('img');
    if (img) {
      imageCell.push(img);
    }
  }

  // Build cells: single row with two cells (text column, image column)
  const cells = [[contentCell, imageCell]];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-promo', cells });
  element.replaceWith(block);
}
