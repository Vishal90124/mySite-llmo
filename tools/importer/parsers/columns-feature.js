/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-feature
 * Base block: columns
 * Source selector: .TM-component-unleash-the-power .text-media-container
 * Layout: Two-column feature block with image on one side, heading + description + CTA on the other
 * Generated: 2026-05-26
 */
export default function parse(element, { document }) {
  // Column 1: Media/Image
  const mediaDiv = element.querySelector(':scope > .media');
  const image = mediaDiv ? mediaDiv.querySelector('img') : element.querySelector('img');

  // Column 2: Text content
  const textDiv = element.querySelector(':scope > .text');

  // Extract heading - the actual heading with content is inside .text__richtext
  const richText = textDiv ? textDiv.querySelector('.text__richtext, .text-lg') : null;
  const heading = richText
    ? richText.querySelector('h2, h1, h3')
    : (textDiv ? textDiv.querySelector('h2, h1, h3') : null);

  // Extract description paragraphs (non-empty ones)
  const paragraphs = richText
    ? Array.from(richText.querySelectorAll('p')).filter((p) => p.textContent.trim().length > 0)
    : [];

  // Extract CTA link
  const ctaLink = textDiv
    ? textDiv.querySelector('a.btn-cta, a.btn, a[class*="btn"]')
    : element.querySelector('a.btn-cta, a.btn, a[class*="btn"]');

  // Build column 1 cell (image)
  const col1 = [];
  if (image) {
    col1.push(image);
  }

  // Build column 2 cell (text content + CTA)
  const col2 = [];
  if (heading) {
    col2.push(heading);
  }
  paragraphs.forEach((p) => {
    col2.push(p);
  });
  if (ctaLink) {
    col2.push(ctaLink);
  }

  // Columns block: single row with two cells (one per column)
  const cells = [
    [col1, col2],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-feature', cells });
  element.replaceWith(block);
}
