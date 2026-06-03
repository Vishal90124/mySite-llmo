/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import carouselHeroParser from './parsers/carousel-hero.js';
import columnsPromoParser from './parsers/columns-promo.js';
import cardsProductParser from './parsers/cards-product.js';
import columnsFeatureParser from './parsers/columns-feature.js';
import columnsTestimonialParser from './parsers/columns-testimonial.js';
import cardsResearchParser from './parsers/cards-research.js';
import cardsBlogParser from './parsers/cards-blog.js';
import cardsPressParser from './parsers/cards-press.js';
import columnsCtaParser from './parsers/columns-cta.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/twistbioscience-cleanup.js';
import sectionsTransformer from './transformers/twistbioscience-sections.js';

// PARSER REGISTRY
const parsers = {
  'carousel-hero': carouselHeroParser,
  'columns-promo': columnsPromoParser,
  'cards-product': cardsProductParser,
  'columns-feature': columnsFeatureParser,
  'columns-testimonial': columnsTestimonialParser,
  'cards-research': cardsResearchParser,
  'cards-blog': cardsBlogParser,
  'cards-press': cardsPressParser,
  'columns-cta': columnsCtaParser,
};

// TRANSFORMER REGISTRY
const transformers = [
  cleanupTransformer,
  sectionsTransformer,
];

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'Twist Bioscience homepage with hero, product categories, and promotional content',
  urls: ['https://www.twistbioscience.com/'],
  blocks: [
    {
      name: 'carousel-hero',
      instances: ['.homepageverticalcarousel'],
    },
    {
      name: 'columns-promo',
      instances: ['.cardlistingblock .column-control-container.sixty-forty'],
    },
    {
      name: 'cards-product',
      instances: ['.home-Page-our-products .column-control-container.three-column'],
    },
    {
      name: 'columns-feature',
      instances: ['.TM-component-unleash-the-power .text-media-container'],
    },
    {
      name: 'columns-testimonial',
      instances: ['.TM-component-twist-at .text-media-container.reverse'],
    },
    {
      name: 'cards-research',
      instances: ['.bg-grey-cool .column-control-container.three-column'],
    },
    {
      name: 'cards-blog',
      instances: ['.featuredblogs .featured-blogs-section'],
    },
    {
      name: 'cards-press',
      instances: ['.home-Page-Press-and-Accolades .column-control-container.three-column'],
    },
    {
      name: 'columns-cta',
      instances: ['.TM-component-lets-start .text-media-container.text-media-banner'],
    },
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Hero Carousel',
      selector: '.homepageverticalcarousel',
      style: 'dark',
      blocks: ['carousel-hero'],
      defaultContent: [],
    },
    {
      id: 'section-2',
      name: 'Promotional Banner',
      selector: '.cardlistingblock .column-control-container.sixty-forty',
      style: 'dark-teal',
      blocks: ['columns-promo'],
      defaultContent: [],
    },
    {
      id: 'section-3',
      name: 'Our Products',
      selector: '.home-Page-our-products',
      style: 'grey',
      blocks: ['cards-product'],
      defaultContent: ['.home-Page-our-products .card-listing-heading'],
    },
    {
      id: 'section-4',
      name: 'Unleash the Power of the Platform',
      selector: '.TM-component-unleash-the-power',
      style: null,
      blocks: ['columns-feature'],
      defaultContent: [],
    },
    {
      id: 'section-5',
      name: 'Twist at Your Service',
      selector: '.TM-component-twist-at',
      style: null,
      blocks: ['columns-testimonial'],
      defaultContent: [],
    },
    {
      id: 'section-6',
      name: 'Powering Today\'s Research',
      selector: '.cardlistingblock.bg-grey-cool',
      style: 'grey',
      blocks: ['cards-research'],
      defaultContent: ['.cardlistingblock.bg-grey-cool .card-listing-heading'],
    },
    {
      id: 'section-7',
      name: 'Blog Section',
      selector: '.featuredblogs',
      style: null,
      blocks: ['cards-blog'],
      defaultContent: [],
    },
    {
      id: 'section-8',
      name: 'Press and Accolades',
      selector: '.home-Page-Press-and-Accolades',
      style: 'grey',
      blocks: ['cards-press'],
      defaultContent: ['.home-Page-Press-and-Accolades .card-listing-heading'],
    },
    {
      id: 'section-9',
      name: 'CTA Banner',
      selector: '.TM-component-lets-start',
      style: 'dark',
      blocks: ['columns-cta'],
      defaultContent: [],
    },
  ],
};

function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, params } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. Execute afterTransform transformers (final cleanup + section breaks)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '') || '/index',
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
