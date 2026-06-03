/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Twist Bioscience section breaks and Section Metadata.
 * Adds <hr> section dividers and Section Metadata blocks based on
 * payload.template.sections from page-templates.json.
 *
 * Runs only in afterTransform (after block parsing is complete).
 *
 * Section selectors validated against migration-work/cleaned.html:
 * - .homepageverticalcarousel (line 3255)
 * - .cardlistingblock .column-control-container.sixty-forty (line 3344)
 * - .home-Page-our-products (line 3405)
 * - .TM-component-unleash-the-power (line 3518)
 * - .TM-component-twist-at (line 3554)
 * - .cardlistingblock.bg-grey-cool (line 3597)
 * - .featuredblogs (line 3660)
 * - .home-Page-Press-and-Accolades (line 3760)
 * - .TM-component-lets-start (line 3834)
 */

export default function transform(hookName, element, payload) {
  if (hookName === 'afterTransform') {
    const sections = payload && payload.template && payload.template.sections;
    if (!sections || sections.length < 2) return;

    const document = element.ownerDocument;

    // Process sections in reverse order to avoid offset issues when inserting elements
    const reversedSections = [...sections].reverse();

    for (const section of reversedSections) {
      const sectionEl = element.querySelector(section.selector);
      if (!sectionEl) continue;

      // Add Section Metadata block after the section element if it has a style
      if (section.style) {
        const sectionMetadataBlock = WebImporter.Blocks.createBlock(document, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        sectionEl.after(sectionMetadataBlock);
      }

      // Add <hr> before this section element if it's not the first section
      const isFirst = sections.indexOf(section) === 0;
      if (!isFirst) {
        const hr = document.createElement('hr');
        sectionEl.before(hr);
      }
    }
  }
}
