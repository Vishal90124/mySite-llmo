/* eslint-disable */
/* global WebImporter */

/**
 * Parser: cards-blog
 * Base block: cards
 * Source: https://www.twistbioscience.com/
 * Selector: .featuredblogs .featured-blogs-section
 * Generated: 2026-05-26
 *
 * Extracts featured blog cards from the homepage blog section.
 * Source structure: featured-blogs-section with a featured post (left)
 * and multiple "most recent" card-wrapper items (right), plus a section
 * heading and footer CTA link.
 *
 * Output: one row per blog card with [image, content cell (title link + description + date)]
 */
export default function parse(element, { document }) {
  // Extract section heading
  const sectionHeading = element.querySelector('.featured-blogs-section__header h2');

  // Extract the featured post (left side)
  const featuredLeft = element.querySelector('.featured-content-left');

  // Extract "most recent" card items (right side)
  const cardWrappers = Array.from(element.querySelectorAll('.featured-content-right .card-wrapper'));

  // Extract footer CTA link
  const footerLink = element.querySelector('.featured-blogs-section__footer a.featured-blogs-section__btn');

  const cells = [];

  // Process featured post
  if (featuredLeft) {
    const featuredImg = featuredLeft.querySelector('a.Featured-Link img');
    const featuredTitleLink = featuredLeft.querySelector('a.title');
    const featuredDesc = featuredLeft.querySelector('p.description');
    const featuredDuration = featuredLeft.querySelector('p.duration');

    const imageCell = [];
    if (featuredImg) imageCell.push(featuredImg);

    const contentCell = [];
    if (featuredTitleLink) contentCell.push(featuredTitleLink);
    if (featuredDesc && featuredDesc.textContent.trim()) contentCell.push(featuredDesc);
    if (featuredDuration) contentCell.push(featuredDuration);

    cells.push([imageCell, contentCell]);
  }

  // Process each "most recent" card
  cardWrappers.forEach((card) => {
    const cardImg = card.querySelector('a > img');
    const cardTitleLink = card.querySelector('.card-content-text a.title');
    const cardDesc = card.querySelector('.card-content-text p.description');
    const cardDuration = card.querySelector('p.duration');

    const imageCell = [];
    if (cardImg) imageCell.push(cardImg);

    const contentCell = [];
    if (cardTitleLink) contentCell.push(cardTitleLink);
    if (cardDesc && cardDesc.textContent.trim()) contentCell.push(cardDesc);
    if (cardDuration) contentCell.push(cardDuration);

    cells.push([imageCell, contentCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-blog', cells });
  element.replaceWith(block);
}
