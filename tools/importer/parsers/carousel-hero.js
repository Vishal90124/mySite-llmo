/* eslint-disable */
/* global WebImporter */

/**
 * Parser: carousel-hero
 * Base block: carousel
 * Source: https://www.twistbioscience.com/
 * Generated: 2026-05-26
 *
 * Extracts a vertical carousel hero section with rotating images, titles,
 * a shared heading/description, and CTA button. Produces one row per slide
 * with image (col 1) and content (col 2).
 */
export default function parse(element, { document }) {
  // Extract the unique slide images from .vertical-carousel-left
  const leftPanel = element.querySelector('.vertical-carousel-left');
  const slideImages = leftPanel
    ? Array.from(leftPanel.querySelectorAll(':scope .img > img.card__img'))
    : [];

  // Remove duplicates (source repeats images for animation); keep first 5 unique by alt text
  const seen = new Set();
  const uniqueImages = [];
  for (const img of slideImages) {
    const alt = img.getAttribute('alt') || '';
    if (!seen.has(alt)) {
      seen.add(alt);
      uniqueImages.push(img);
    }
  }

  // Extract the shared heading text ("WRITING THE FUTURE OF")
  const headingEl = element.querySelector('.vertical-carousel-right > .heading');

  // Extract unique slide titles from .vertical-carousel-title-wrapper
  const titleWrapper = element.querySelector('.vertical-carousel-title-wrapper');
  const allTitles = titleWrapper
    ? Array.from(titleWrapper.querySelectorAll('.title'))
    : [];

  // Deduplicate titles (repeated for animation)
  const titlesSeen = new Set();
  const uniqueTitles = [];
  for (const titleEl of allTitles) {
    const text = titleEl.textContent.trim();
    if (!titlesSeen.has(text)) {
      titlesSeen.add(text);
      uniqueTitles.push(titleEl);
    }
  }

  // Extract the description paragraph
  const descriptionEl = element.querySelector('.vertical-carousel-description p');

  // Extract the CTA button/link
  const ctaLink = element.querySelector('a.vertical-carousel-btn');

  // Build cells: one row per slide
  // Each row = [image, content]
  // Content for each slide: shared heading + slide title
  // First slide also gets description + CTA
  const cells = [];

  const slideCount = Math.min(uniqueImages.length, uniqueTitles.length);
  for (let i = 0; i < slideCount; i++) {
    const imageCell = uniqueImages[i];

    const contentCell = [];

    // Add shared heading as h1 for each slide
    if (headingEl) {
      const h1 = document.createElement('h1');
      h1.textContent = headingEl.textContent.trim() + ' ' + uniqueTitles[i].textContent.trim();
      contentCell.push(h1);
    } else if (uniqueTitles[i]) {
      const h1 = document.createElement('h1');
      h1.textContent = uniqueTitles[i].textContent.trim();
      contentCell.push(h1);
    }

    // Add description on each slide (for carousel context)
    if (descriptionEl) {
      const p = document.createElement('p');
      p.textContent = descriptionEl.textContent.trim();
      contentCell.push(p);
    }

    // Add CTA link on each slide
    if (ctaLink) {
      const link = document.createElement('a');
      link.href = ctaLink.getAttribute('href') || '#';
      const btnText = ctaLink.querySelector('.cmp-button__text');
      link.textContent = btnText ? btnText.textContent.trim() : ctaLink.textContent.trim();
      contentCell.push(link);
    }

    cells.push([imageCell, contentCell]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-hero', cells });
  element.replaceWith(block);
}
