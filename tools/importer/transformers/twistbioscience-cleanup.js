/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Twist Bioscience site-wide cleanup.
 * Removes non-authorable content (header, footer, cookie banners, tracking,
 * AEM authoring artifacts) so the import contains only page-level authorable content.
 *
 * Selectors validated against migration-work/cleaned.html:
 * - #didomi-host: Didomi cookie consent container (line 2)
 * - .cmp-experiencefragment--headerv2: Header experience fragment (line 8)
 * - .cmp-experiencefragment--footer: Footer experience fragment (line 3858)
 * - .cq-placeholder: AEM authoring placeholder markers (21 occurrences)
 * - .newpar.aem-Grid-newComponent: AEM new-paragraph markers
 * - #cookieAcceptedPopup: Cookie policy popup (line 4079)
 * - iframe#db-sync: Tracking iframe (line 4080)
 * - img#db_lr_pixel_ad: Tracking pixel (line 4082)
 * - link[href*="clientlibs"]: AEM clientlib CSS links (lines 12-18)
 * - link[href*="/libs/"]: AEM libs CSS links (line 17)
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.before) {
    // Remove cookie/consent overlays and tracking that may interfere with parsing
    WebImporter.DOMUtils.remove(element, [
      '#didomi-host',
      '#cookieAcceptedPopup',
    ]);

    // Remove AEM authoring artifacts (cq-placeholder markers, newpar sections)
    WebImporter.DOMUtils.remove(element, [
      '.cq-placeholder',
      '.newpar.aem-Grid-newComponent',
    ]);
  }

  if (hookName === H.after) {
    // Remove non-authorable site chrome: header and footer experience fragments
    WebImporter.DOMUtils.remove(element, [
      '.cmp-experiencefragment--headerv2',
      '.cmp-experiencefragment--footer',
    ]);

    // Remove tracking elements
    WebImporter.DOMUtils.remove(element, [
      'iframe#db-sync',
      'img#db_lr_pixel_ad',
    ]);

    // Remove AEM clientlib link elements (non-authorable CSS references)
    WebImporter.DOMUtils.remove(element, [
      'link[href*="clientlibs"]',
      'link[href*="/libs/"]',
    ]);

    // Remove any remaining noscript, iframe, and link elements
    WebImporter.DOMUtils.remove(element, [
      'noscript',
      'iframe',
      'link',
    ]);
  }
}
