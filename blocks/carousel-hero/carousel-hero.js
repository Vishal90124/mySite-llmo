let carouselId = 0;

export default async function decorate(block) {
  carouselId += 1;
  block.setAttribute('id', `carousel-hero-${carouselId}`);
  block.setAttribute('role', 'region');
  block.setAttribute('aria-roledescription', 'Carousel');

  const rows = [...block.querySelectorAll(':scope > div')];
  if (rows.length === 0) return;

  // Extract data from rows
  const slides = rows.map((row) => {
    const cols = row.querySelectorAll(':scope > div');
    const imageCol = cols[0];
    const contentCol = cols[1];

    const picture = imageCol ? imageCol.querySelector('picture') : null;
    const heading = contentCol ? contentCol.querySelector('h1, h2, h3') : null;
    const paragraphs = contentCol ? contentCol.querySelectorAll('p') : [];
    const link = contentCol ? contentCol.querySelector('a') : null;

    // Extract the rotating title from heading text
    // Format: "WRITING THE FUTURE OF DRUG DISCOVERY" -> title = "DRUG DISCOVERY"
    let titleText = '';
    if (heading) {
      const fullText = heading.textContent.trim();
      const match = fullText.match(/WRITING THE FUTURE OF\s+(.+)/i);
      if (match) {
        titleText = match[1].trim();
      } else {
        titleText = fullText;
      }
    }

    // Get description (first non-link paragraph)
    let description = '';
    paragraphs.forEach((p) => {
      if (!p.querySelector('a') && p.textContent.trim()) {
        description = p.textContent.trim();
      }
    });

    return {
      picture, titleText, description, link,
    };
  });

  // Clear block
  block.innerHTML = '';

  // Build the two-column layout
  const wrapper = document.createElement('div');
  wrapper.classList.add('carousel-hero-wrapper');

  // Left column - images
  const leftCol = document.createElement('div');
  leftCol.classList.add('carousel-hero-left');

  slides.forEach((slide, idx) => {
    if (slide.picture) {
      const picClone = slide.picture.cloneNode(true);
      picClone.classList.add('carousel-hero-image');
      picClone.dataset.index = idx;
      if (idx === 0) picClone.classList.add('active');
      leftCol.append(picClone);
    }
  });

  // Right column - text content
  const rightCol = document.createElement('div');
  rightCol.classList.add('carousel-hero-right');

  // Static heading
  const headingEl = document.createElement('div');
  headingEl.classList.add('carousel-hero-heading');
  headingEl.textContent = 'WRITING THE FUTURE OF';
  rightCol.append(headingEl);

  // Scrolling titles wrapper
  const titleWrapper = document.createElement('div');
  titleWrapper.classList.add('carousel-hero-title-wrapper');

  const titleTrack = document.createElement('div');
  titleTrack.classList.add('carousel-hero-title-track');

  slides.forEach((slide, idx) => {
    const titleItem = document.createElement('div');
    titleItem.classList.add('carousel-hero-title-item');
    titleItem.dataset.index = idx;
    titleItem.textContent = slide.titleText;
    titleTrack.append(titleItem);
  });

  titleWrapper.append(titleTrack);
  rightCol.append(titleWrapper);

  // Description
  const descEl = document.createElement('p');
  descEl.classList.add('carousel-hero-description');
  descEl.textContent = slides[0]?.description || '';
  rightCol.append(descEl);

  // CTA button
  if (slides[0]?.link) {
    const ctaWrapper = document.createElement('p');
    ctaWrapper.classList.add('button-container');
    const cta = slides[0].link.cloneNode(true);
    cta.classList.add('button');
    ctaWrapper.append(cta);
    rightCol.append(ctaWrapper);
  }

  wrapper.append(leftCol);
  wrapper.append(rightCol);
  block.append(wrapper);

  // Auto-rotate functionality
  let currentSlide = 0;
  const totalSlides = slides.length;
  const intervalTime = 4000;

  function goToSlide(index) {
    currentSlide = index;

    // Update images
    leftCol.querySelectorAll('.carousel-hero-image').forEach((pic, idx) => {
      pic.classList.toggle('active', idx === currentSlide);
    });

    // Animate title track
    const itemHeight = titleWrapper.offsetHeight;
    titleTrack.style.transform = `translateY(-${currentSlide * itemHeight}px)`;

    // Update title items active state
    titleTrack.querySelectorAll('.carousel-hero-title-item').forEach((item, idx) => {
      item.classList.toggle('active', idx === currentSlide);
    });
  }

  function nextSlide() {
    goToSlide((currentSlide + 1) % totalSlides);
  }

  // Start auto-rotation
  let autoplayInterval = setInterval(nextSlide, intervalTime);

  // Pause on hover
  block.addEventListener('mouseenter', () => {
    clearInterval(autoplayInterval);
  });

  block.addEventListener('mouseleave', () => {
    autoplayInterval = setInterval(nextSlide, intervalTime);
  });

  // Initialize first slide
  goToSlide(0);
}
