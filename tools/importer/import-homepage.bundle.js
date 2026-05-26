/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/carousel-hero.js
  function parse(element, { document }) {
    const leftPanel = element.querySelector(".vertical-carousel-left");
    const slideImages = leftPanel ? Array.from(leftPanel.querySelectorAll(":scope .img > img.card__img")) : [];
    const seen = /* @__PURE__ */ new Set();
    const uniqueImages = [];
    for (const img of slideImages) {
      const alt = img.getAttribute("alt") || "";
      if (!seen.has(alt)) {
        seen.add(alt);
        uniqueImages.push(img);
      }
    }
    const headingEl = element.querySelector(".vertical-carousel-right > .heading");
    const titleWrapper = element.querySelector(".vertical-carousel-title-wrapper");
    const allTitles = titleWrapper ? Array.from(titleWrapper.querySelectorAll(".title")) : [];
    const titlesSeen = /* @__PURE__ */ new Set();
    const uniqueTitles = [];
    for (const titleEl of allTitles) {
      const text = titleEl.textContent.trim();
      if (!titlesSeen.has(text)) {
        titlesSeen.add(text);
        uniqueTitles.push(titleEl);
      }
    }
    const descriptionEl = element.querySelector(".vertical-carousel-description p");
    const ctaLink = element.querySelector("a.vertical-carousel-btn");
    const cells = [];
    const slideCount = Math.min(uniqueImages.length, uniqueTitles.length);
    for (let i = 0; i < slideCount; i++) {
      const imageCell = uniqueImages[i];
      const contentCell = [];
      if (headingEl) {
        const h1 = document.createElement("h1");
        h1.textContent = headingEl.textContent.trim() + " " + uniqueTitles[i].textContent.trim();
        contentCell.push(h1);
      } else if (uniqueTitles[i]) {
        const h1 = document.createElement("h1");
        h1.textContent = uniqueTitles[i].textContent.trim();
        contentCell.push(h1);
      }
      if (descriptionEl) {
        const p = document.createElement("p");
        p.textContent = descriptionEl.textContent.trim();
        contentCell.push(p);
      }
      if (ctaLink) {
        const link = document.createElement("a");
        link.href = ctaLink.getAttribute("href") || "#";
        const btnText = ctaLink.querySelector(".cmp-button__text");
        link.textContent = btnText ? btnText.textContent.trim() : ctaLink.textContent.trim();
        contentCell.push(link);
      }
      cells.push([imageCell, contentCell]);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "carousel-hero", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-promo.js
  function parse2(element, { document }) {
    const columns = element.querySelectorAll(":scope > .column");
    const textColumn = columns[0];
    const contentCell = [];
    if (textColumn) {
      const paragraphs = textColumn.querySelectorAll(".cmp-text p");
      paragraphs.forEach((p) => {
        const textContent = p.textContent.trim();
        if (textContent && textContent !== "\xA0") {
          contentCell.push(p);
        }
      });
      if (contentCell.length === 0) {
        const allText = textColumn.querySelectorAll("p, a");
        allText.forEach((el) => {
          const text = el.textContent.trim();
          if (text && text !== "\xA0") {
            contentCell.push(el);
          }
        });
      }
    }
    const imageColumn = columns[1];
    const imageCell = [];
    if (imageColumn) {
      const img = imageColumn.querySelector("img");
      if (img) {
        imageCell.push(img);
      }
    }
    const cells = [[contentCell, imageCell]];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-promo", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-product.js
  function parse3(element, { document }) {
    const cards = element.querySelectorAll("a.card--product, a.card");
    const cells = [];
    cards.forEach((card) => {
      const img = card.querySelector(".card__img, img");
      const titleEl = card.querySelector(".card__title");
      const descEl = card.querySelector(".card__sub-title p, .card__sub-title");
      const contentCell = [];
      if (titleEl) {
        const heading = document.createElement("p");
        heading.textContent = titleEl.textContent.trim();
        heading.style.fontWeight = "bold";
        contentCell.push(heading);
      }
      if (descEl) {
        const desc = document.createElement("p");
        desc.textContent = descEl.textContent.trim();
        contentCell.push(desc);
      }
      if (card.href) {
        const link = document.createElement("a");
        link.href = card.href;
        link.textContent = titleEl ? titleEl.textContent.trim() : "Learn More";
        contentCell.push(link);
      }
      const imageCell = img ? [img] : [];
      cells.push([imageCell, contentCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-product", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-feature.js
  function parse4(element, { document }) {
    const mediaDiv = element.querySelector(":scope > .media");
    const image = mediaDiv ? mediaDiv.querySelector("img") : element.querySelector("img");
    const textDiv = element.querySelector(":scope > .text");
    const richText = textDiv ? textDiv.querySelector(".text__richtext, .text-lg") : null;
    const heading = richText ? richText.querySelector("h2, h1, h3") : textDiv ? textDiv.querySelector("h2, h1, h3") : null;
    const paragraphs = richText ? Array.from(richText.querySelectorAll("p")).filter((p) => p.textContent.trim().length > 0) : [];
    const ctaLink = textDiv ? textDiv.querySelector('a.btn-cta, a.btn, a[class*="btn"]') : element.querySelector('a.btn-cta, a.btn, a[class*="btn"]');
    const col1 = [];
    if (image) {
      col1.push(image);
    }
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
    const cells = [
      [col1, col2]
    ];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-feature", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-testimonial.js
  function parse5(element, { document }) {
    const mediaDiv = element.querySelector(":scope > .media");
    const image = mediaDiv ? mediaDiv.querySelector("img") : element.querySelector("img");
    const textDiv = element.querySelector(":scope > .text");
    const richtext = textDiv ? textDiv.querySelector(".text__richtext") : null;
    const heading = richtext ? richtext.querySelector("h2") : textDiv ? textDiv.querySelector("h2") : null;
    const paragraphs = richtext ? Array.from(richtext.querySelectorAll(":scope > p")) : [];
    const descriptionParagraphs = paragraphs.filter((p) => {
      const text = p.textContent.trim();
      if (!text) return false;
      if (p.querySelector("i")) return false;
      if (p.querySelector("b")) return false;
      return true;
    });
    const quoteParagraph = paragraphs.find((p) => p.querySelector("i"));
    const attributionParagraph = paragraphs.find((p) => p.querySelector("b"));
    const ctaLink = textDiv ? textDiv.querySelector('a.btn-cta, a.btn, a[class*="btn"]') : element.querySelector('a.btn-cta, a.btn, a[class*="btn"]');
    const imageCell = [];
    if (image) {
      imageCell.push(image);
    }
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
    const cells = [
      [imageCell, textCell]
    ];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-testimonial", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-research.js
  function parse6(element, { document }) {
    const cards = element.querySelectorAll("a.card--research, a.card");
    const cells = [];
    cards.forEach((card) => {
      const img = card.querySelector(".card__img, .card__media img");
      const titleEl = card.querySelector(".card__title");
      const badgeEl = card.querySelector(".card__badge");
      const descEl = card.querySelector(".card__sub-title p, .card__sub-title");
      const contentCell = [];
      if (titleEl) {
        const heading = document.createElement("p");
        heading.innerHTML = `<strong>${titleEl.textContent.trim()}</strong>`;
        contentCell.push(heading);
      }
      if (badgeEl && badgeEl.textContent.trim()) {
        const badge = document.createElement("p");
        badge.innerHTML = `<em>${badgeEl.textContent.trim()}</em>`;
        contentCell.push(badge);
      }
      if (descEl && descEl.textContent.trim()) {
        const desc = document.createElement("p");
        desc.textContent = descEl.textContent.trim();
        contentCell.push(desc);
      }
      if (card.href) {
        const link = document.createElement("a");
        link.href = card.href;
        link.textContent = titleEl ? titleEl.textContent.trim() : "Read More";
        contentCell.push(link);
      }
      const imageCell = img ? [img] : [];
      cells.push([imageCell, contentCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-research", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-blog.js
  function parse7(element, { document }) {
    const sectionHeading = element.querySelector(".featured-blogs-section__header h2");
    const featuredLeft = element.querySelector(".featured-content-left");
    const cardWrappers = Array.from(element.querySelectorAll(".featured-content-right .card-wrapper"));
    const footerLink = element.querySelector(".featured-blogs-section__footer a.featured-blogs-section__btn");
    const cells = [];
    if (featuredLeft) {
      const featuredImg = featuredLeft.querySelector("a.Featured-Link img");
      const featuredTitleLink = featuredLeft.querySelector("a.title");
      const featuredDesc = featuredLeft.querySelector("p.description");
      const featuredDuration = featuredLeft.querySelector("p.duration");
      const imageCell = [];
      if (featuredImg) imageCell.push(featuredImg);
      const contentCell = [];
      if (featuredTitleLink) contentCell.push(featuredTitleLink);
      if (featuredDesc && featuredDesc.textContent.trim()) contentCell.push(featuredDesc);
      if (featuredDuration) contentCell.push(featuredDuration);
      cells.push([imageCell, contentCell]);
    }
    cardWrappers.forEach((card) => {
      const cardImg = card.querySelector("a > img");
      const cardTitleLink = card.querySelector(".card-content-text a.title");
      const cardDesc = card.querySelector(".card-content-text p.description");
      const cardDuration = card.querySelector("p.duration");
      const imageCell = [];
      if (cardImg) imageCell.push(cardImg);
      const contentCell = [];
      if (cardTitleLink) contentCell.push(cardTitleLink);
      if (cardDesc && cardDesc.textContent.trim()) contentCell.push(cardDesc);
      if (cardDuration) contentCell.push(cardDuration);
      cells.push([imageCell, contentCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-blog", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-press.js
  function parse8(element, { document }) {
    const cards = element.querySelectorAll("a.card--press, a.card");
    const cells = [];
    cards.forEach((card) => {
      const img = card.querySelector(".card__img, .card__media img");
      const titleEl = card.querySelector(".card__title");
      const descEl = card.querySelector(".card__sub-title p, .card__sub-title");
      const contentCell = [];
      if (titleEl) {
        const heading = document.createElement("p");
        heading.textContent = titleEl.textContent.trim();
        heading.style.fontWeight = "bold";
        contentCell.push(heading);
      }
      if (descEl) {
        const desc = document.createElement("p");
        desc.textContent = descEl.textContent.trim();
        contentCell.push(desc);
      }
      if (card.href) {
        const link = document.createElement("a");
        link.href = card.href;
        link.textContent = "View article";
        contentCell.push(link);
      }
      const imageCell = img ? [img] : [];
      cells.push([imageCell, contentCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-press", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-cta.js
  function parse9(element, { document }) {
    const mediaDiv = element.querySelector(":scope > .media");
    const image = mediaDiv ? mediaDiv.querySelector("img") : element.querySelector("img");
    const textDiv = element.querySelector(":scope > .text");
    const heading = textDiv ? textDiv.querySelector("h2, h1, h3") : element.querySelector("h2, h1, h3");
    const ctaLink = textDiv ? textDiv.querySelector('a.btn-cta, a.btn, a[class*="btn"], a[class*="cta"]') : element.querySelector('a.btn-cta, a.btn, a[class*="btn"], a[class*="cta"]');
    const col1 = [];
    if (image) {
      col1.push(image);
    }
    const col2 = [];
    if (heading) {
      col2.push(heading);
    }
    if (ctaLink) {
      col2.push(ctaLink);
    }
    const cells = [
      [col1, col2]
    ];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-cta", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/twistbioscience-cleanup.js
  var H = { before: "beforeTransform", after: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === H.before) {
      WebImporter.DOMUtils.remove(element, [
        "#didomi-host",
        "#cookieAcceptedPopup"
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".cq-placeholder",
        ".newpar.aem-Grid-newComponent"
      ]);
    }
    if (hookName === H.after) {
      WebImporter.DOMUtils.remove(element, [
        ".cmp-experiencefragment--headerv2",
        ".cmp-experiencefragment--footer"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "iframe#db-sync",
        "img#db_lr_pixel_ad"
      ]);
      WebImporter.DOMUtils.remove(element, [
        'link[href*="clientlibs"]',
        'link[href*="/libs/"]'
      ]);
      WebImporter.DOMUtils.remove(element, [
        "noscript",
        "iframe",
        "link"
      ]);
    }
  }

  // tools/importer/transformers/twistbioscience-sections.js
  function transform2(hookName, element, payload) {
    if (hookName === "afterTransform") {
      const sections = payload && payload.template && payload.template.sections;
      if (!sections || sections.length < 2) return;
      const document = element.ownerDocument;
      const reversedSections = [...sections].reverse();
      for (const section of reversedSections) {
        const sectionEl = element.querySelector(section.selector);
        if (!sectionEl) continue;
        if (section.style) {
          const sectionMetadataBlock = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionEl.after(sectionMetadataBlock);
        }
        const isFirst = sections.indexOf(section) === 0;
        if (!isFirst) {
          const hr = document.createElement("hr");
          sectionEl.before(hr);
        }
      }
    }
  }

  // tools/importer/import-homepage.js
  var parsers = {
    "carousel-hero": parse,
    "columns-promo": parse2,
    "cards-product": parse3,
    "columns-feature": parse4,
    "columns-testimonial": parse5,
    "cards-research": parse6,
    "cards-blog": parse7,
    "cards-press": parse8,
    "columns-cta": parse9
  };
  var transformers = [
    transform,
    transform2
  ];
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "Twist Bioscience homepage with hero, product categories, and promotional content",
    urls: ["https://www.twistbioscience.com/"],
    blocks: [
      {
        name: "carousel-hero",
        instances: [".homepageverticalcarousel"]
      },
      {
        name: "columns-promo",
        instances: [".cardlistingblock .column-control-container.sixty-forty"]
      },
      {
        name: "cards-product",
        instances: [".home-Page-our-products .column-control-container.three-column"]
      },
      {
        name: "columns-feature",
        instances: [".TM-component-unleash-the-power .text-media-container"]
      },
      {
        name: "columns-testimonial",
        instances: [".TM-component-twist-at .text-media-container.reverse"]
      },
      {
        name: "cards-research",
        instances: [".bg-grey-cool .column-control-container.three-column"]
      },
      {
        name: "cards-blog",
        instances: [".featuredblogs .featured-blogs-section"]
      },
      {
        name: "cards-press",
        instances: [".home-Page-Press-and-Accolades .column-control-container.three-column"]
      },
      {
        name: "columns-cta",
        instances: [".TM-component-lets-start .text-media-container.text-media-banner"]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Hero Carousel",
        selector: ".homepageverticalcarousel",
        style: "dark",
        blocks: ["carousel-hero"],
        defaultContent: []
      },
      {
        id: "section-2",
        name: "Promotional Banner",
        selector: ".cardlistingblock .column-control-container.sixty-forty",
        style: "dark-teal",
        blocks: ["columns-promo"],
        defaultContent: []
      },
      {
        id: "section-3",
        name: "Our Products",
        selector: ".home-Page-our-products",
        style: "grey",
        blocks: ["cards-product"],
        defaultContent: [".home-Page-our-products .card-listing-heading"]
      },
      {
        id: "section-4",
        name: "Unleash the Power of the Platform",
        selector: ".TM-component-unleash-the-power",
        style: null,
        blocks: ["columns-feature"],
        defaultContent: []
      },
      {
        id: "section-5",
        name: "Twist at Your Service",
        selector: ".TM-component-twist-at",
        style: null,
        blocks: ["columns-testimonial"],
        defaultContent: []
      },
      {
        id: "section-6",
        name: "Powering Today's Research",
        selector: ".cardlistingblock.bg-grey-cool",
        style: "grey",
        blocks: ["cards-research"],
        defaultContent: [".cardlistingblock.bg-grey-cool .card-listing-heading"]
      },
      {
        id: "section-7",
        name: "Blog Section",
        selector: ".featuredblogs",
        style: null,
        blocks: ["cards-blog"],
        defaultContent: []
      },
      {
        id: "section-8",
        name: "Press and Accolades",
        selector: ".home-Page-Press-and-Accolades",
        style: "grey",
        blocks: ["cards-press"],
        defaultContent: [".home-Page-Press-and-Accolades .card-listing-heading"]
      },
      {
        id: "section-9",
        name: "CTA Banner",
        selector: ".TM-component-lets-start",
        style: "dark",
        blocks: ["columns-cta"],
        defaultContent: []
      }
    ]
  };
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
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
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_homepage_default = {
    transform: (payload) => {
      const { document, url, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "") || "/index"
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
