/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-cta
 * Base block: columns
 * Source selector: .TM-component-lets-start .text-media-container.text-media-banner
 * Layout: Two-column CTA banner with image on one side, heading + CTA button on the other
 * Generated: 2026-05-26
 */
export default function parse(element, { document }) {
  // Column 1: Media/Image
  const mediaDiv = element.querySelector(':scope > .media');
  const image = mediaDiv ? mediaDiv.querySelector('img') : element.querySelector('img');

  // Column 2: Text content (heading + CTA)
  const textDiv = element.querySelector(':scope > .text');

  // Extract heading - may be h2 with nested <b> or direct text
  const heading = textDiv
    ? textDiv.querySelector('h2, h1, h3')
    : element.querySelector('h2, h1, h3');

  // Extract CTA link
  const ctaLink = textDiv
    ? textDiv.querySelector('a.btn-cta, a.btn, a[class*="btn"], a[class*="cta"]')
    : element.querySelector('a.btn-cta, a.btn, a[class*="btn"], a[class*="cta"]');

  // Build column 1 cell (image)
  const col1 = [];
  if (image) {
    col1.push(image);
  }

  // Build column 2 cell (heading + CTA button)
  const col2 = [];
  if (heading) {
    col2.push(heading);
  }
  if (ctaLink) {
    col2.push(ctaLink);
  }

  // Columns block: single row with two cells (one per column)
  const cells = [
    [col1, col2],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-cta', cells });
  element.replaceWith(block);
}
