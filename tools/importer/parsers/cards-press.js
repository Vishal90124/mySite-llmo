/* eslint-disable */
/* global WebImporter */

/**
 * Parser: cards-press
 * Base block: cards
 * Source: https://www.twistbioscience.com/
 * Selector: .home-Page-Press-and-Accolades .column-control-container.three-column
 * Generated: 2026-05-26
 *
 * Extracts press/accolade cards from a three-column layout. Each card contains:
 * - Award/press logo image (.card__img)
 * - Card title (.card__title)
 * - Card description (.card__sub-title p)
 * - External link (wrapping <a> with href to press article)
 *
 * Output: One row per card with [image] and [title + description + link] cells.
 */
export default function parse(element, { document }) {
  // Find all press cards within the container
  const cards = element.querySelectorAll('a.card--press, a.card');
  const cells = [];

  cards.forEach((card) => {
    // Extract press/award logo image
    const img = card.querySelector('.card__img, .card__media img');

    // Extract title
    const titleEl = card.querySelector('.card__title');

    // Extract description from subtitle
    const descEl = card.querySelector('.card__sub-title p, .card__sub-title');

    // Build the content cell
    const contentCell = [];

    if (titleEl) {
      const heading = document.createElement('p');
      heading.textContent = titleEl.textContent.trim();
      heading.style.fontWeight = 'bold';
      contentCell.push(heading);
    }

    if (descEl) {
      const desc = document.createElement('p');
      desc.textContent = descEl.textContent.trim();
      contentCell.push(desc);
    }

    // Preserve the external link with "View article" text
    if (card.href) {
      const link = document.createElement('a');
      link.href = card.href;
      link.textContent = 'View article';
      contentCell.push(link);
    }

    // Build row: [image cell, content cell]
    const imageCell = img ? [img] : [];
    cells.push([imageCell, contentCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-press', cells });
  element.replaceWith(block);
}
