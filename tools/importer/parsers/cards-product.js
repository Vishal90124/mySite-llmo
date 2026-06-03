/* eslint-disable */
/* global WebImporter */

/**
 * Parser: cards-product
 * Base block: cards
 * Source: https://www.twistbioscience.com/
 * Selector: .home-Page-our-products .column-control-container.three-column
 * Generated: 2026-05-26
 *
 * Extracts product cards from a three-column layout. Each card contains:
 * - Product image (.card__img)
 * - Product title (.card__title)
 * - Product description (.card__sub-title p)
 * - Product link (wrapping <a> with href)
 *
 * Output: One row per card with [image] and [title + description + link] cells.
 */
export default function parse(element, { document }) {
  // Find all product cards within the container
  const cards = element.querySelectorAll('a.card--product, a.card');
  const cells = [];

  cards.forEach((card) => {
    // Extract image
    const img = card.querySelector('.card__img, img');

    // Extract title text
    const titleEl = card.querySelector('.card__title');

    // Extract description
    const descEl = card.querySelector('.card__sub-title p, .card__sub-title');

    // Build the content cell: title as heading, description, and link
    const contentCell = [];

    if (titleEl) {
      // Create a proper heading element for the title
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

    // Preserve the link
    if (card.href) {
      const link = document.createElement('a');
      link.href = card.href;
      link.textContent = titleEl ? titleEl.textContent.trim() : 'Learn More';
      contentCell.push(link);
    }

    // Build row: [image cell, content cell]
    const imageCell = img ? [img] : [];
    cells.push([imageCell, contentCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-product', cells });
  element.replaceWith(block);
}
