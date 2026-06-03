/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-testimonial
 * Base block: columns
 * Source selector: .TM-component-twist-at .text-media-container.reverse
 * Layout: Two-column with image on one side and testimonial text (heading, quote, attribution, CTA) on the other
 * Generated: 2026-05-26
 */
export default function parse(element, { document }) {
  // Extract image from the media column
  const mediaDiv = element.querySelector(':scope > .media');
  const image = mediaDiv ? mediaDiv.querySelector('img') : element.querySelector('img');

  // Extract text content from the text column
  const textDiv = element.querySelector(':scope > .text');

  // Extract heading - look for h2 with actual text content inside .text__richtext or the text-title
  const richtext = textDiv ? textDiv.querySelector('.text__richtext') : null;
  const heading = richtext ? richtext.querySelector('h2') : (textDiv ? textDiv.querySelector('h2') : null);

  // Extract description paragraph (the non-empty p that is not a quote or attribution)
  const paragraphs = richtext ? Array.from(richtext.querySelectorAll(':scope > p')) : [];
  const descriptionParagraphs = paragraphs.filter((p) => {
    const text = p.textContent.trim();
    // Skip empty paragraphs, paragraphs with italic (quotes), and paragraphs with bold (attribution)
    if (!text) return false;
    if (p.querySelector('i')) return false;
    if (p.querySelector('b')) return false;
    return true;
  });

  // Extract quote (paragraph containing italic text)
  const quoteParagraph = paragraphs.find((p) => p.querySelector('i'));

  // Extract attribution (paragraph containing bold text - title/company)
  const attributionParagraph = paragraphs.find((p) => p.querySelector('b'));

  // Extract CTA link
  const ctaLink = textDiv ? textDiv.querySelector('a.btn-cta, a.btn, a[class*="btn"]') : element.querySelector('a.btn-cta, a.btn, a[class*="btn"]');

  // Build the image cell
  const imageCell = [];
  if (image) {
    imageCell.push(image);
  }

  // Build the text content cell
  const textCell = [];
  if (heading && heading.textContent.trim()) {
    textCell.push(heading);
  }
  descriptionParagraphs.forEach((p) => textCell.push(p));
  if (quoteParagraph) {
    textCell.push(quoteParagraph);
  }
  if (attributionParagraph) {
    textCell.push(attributionParagraph);
  }
  if (ctaLink) {
    textCell.push(ctaLink);
  }

  // Build cells array: single row with two columns (image, text)
  const cells = [
    [imageCell, textCell],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-testimonial', cells });
  element.replaceWith(block);
}
