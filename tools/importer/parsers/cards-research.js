/* eslint-disable */
/* global WebImporter */

/**
 * Parser: cards-research
 * Base block: cards
 * Source: https://www.twistbioscience.com/
 * Selector: .bg-grey-cool .column-control-container.three-column
 * Generated: 2026-05-26
 *
 * Extracts research/case-study cards from a three-column layout. Each card contains:
 * - Card image (.card__img)
 * - Card title (.card__title)
 * - Category badge (.card__badge) e.g. "Genes", "NGS"
 * - Card description (.card__sub-title p) - may be empty
 * - Card link (wrapping <a> with href to case study)
 *
 * Output: One row per card with [image] and [title + badge + description + link] cells.
 */
export default function parse(element, { document }) {
  // Find all research cards within the container
  const cards = element.querySelectorAll('a.card--research, a.card');
  const cells = [];

  cards.forEach((card) => {
    // Extract image
    const img = card.querySelector('.card__img, .card__media img');

    // Extract title
    const titleEl = card.querySelector('.card__title');

    // Extract category badge (e.g. "Genes", "NGS")
    const badgeEl = card.querySelector('.card__badge');

    // Extract description (may be empty in some cards)
    const descEl = card.querySelector('.card__sub-title p, .card__sub-title');

    // Build the content cell
    const contentCell = [];

    if (titleEl) {
      const heading = document.createElement('p');
      heading.innerHTML = `<strong>${titleEl.textContent.trim()}</strong>`;
      contentCell.push(heading);
    }

    if (badgeEl && badgeEl.textContent.trim()) {
      const badge = document.createElement('p');
      badge.innerHTML = `<em>${badgeEl.textContent.trim()}</em>`;
      contentCell.push(badge);
    }

    if (descEl && descEl.textContent.trim()) {
      const desc = document.createElement('p');
      desc.textContent = descEl.textContent.trim();
      contentCell.push(desc);
    }

    // Preserve the link to the case study
    if (card.href) {
      const link = document.createElement('a');
      link.href = card.href;
      link.textContent = titleEl ? titleEl.textContent.trim() : 'Read More';
      contentCell.push(link);
    }

    // Build row: [image cell, content cell]
    const imageCell = img ? [img] : [];
    cells.push([imageCell, contentCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-research', cells });
  element.replaceWith(block);
}
