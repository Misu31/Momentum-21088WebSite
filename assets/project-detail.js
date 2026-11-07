(function () {
  const root = document.querySelector("#project-detail");
  const projects = window.MOMENTUM_SITE?.projects || [];
  const slug = new URLSearchParams(window.location.search).get("slug");
  const project = projects.find((item) => item.slug === slug);
  const projectPageEnabled = window.MOMENTUM_SITE?.projectPagesEnabled !== false || project?.pageEnabled === true;

  if (!root) return;

  if (!projectPageEnabled) {
    document.title = "Pagină temporar indisponibilă | Momentum FTC 21088";
    root.innerHTML = `
      <section class="project-detail-content">
        <div class="section-inner">
          <div class="project-overview-card">
            <p class="eyebrow">Robots &amp; Projects</p>
            <h1 class="project-detail-title">Paginile proiectelor sunt dezactivate temporar.</h1>
            <p class="project-detail-lede">Poți explora în continuare proiectele din pagina principală Robots &amp; Projects.</p>
            <a class="button primary" href="robots-projects.html">Înapoi la proiecte</a>
          </div>
        </div>
      </section>
    `;
    return;
  }

  if (!project) {
    root.innerHTML = `
      <section class="project-detail-content">
        <div class="section-inner">
          <div class="project-overview-card">
            <p class="eyebrow">Project archive</p>
            <h1 class="project-detail-title">Proiectul nu a fost găsit.</h1>
            <p class="project-detail-lede">Revino la pagina Robots &amp; Projects pentru a explora proiectele echipei.</p>
            <a class="button primary" href="robots-projects.html">Înapoi la proiecte</a>
          </div>
        </div>
      </section>
    `;
    return;
  }

  const slides = project.gallery?.length
    ? project.gallery
    : project.image
      ? [{ src: project.image, alt: project.imageAlt || project.title, caption: project.title }]
      : [];

  function renderSlide(slide, index) {
    return `
      <button
        class="project-gallery-thumb${index === 0 ? " is-active" : ""}"
        type="button"
        data-gallery-thumb="${index}"
        aria-label="Afișează imaginea ${index + 1}: ${slide.caption || slide.alt}"
        aria-pressed="${index === 0 ? "true" : "false"}"
      >
        <img src="${slide.src}" alt="" loading="lazy">
      </button>
    `;
  }

  const gallery = slides.length
    ? `
      <div class="project-gallery${slides.length > 1 ? " has-multiple-slides" : " is-single-slide"}" data-project-gallery>
        <div class="project-gallery-stage" data-gallery-stage tabindex="0" aria-label="Galerie foto ${project.title}">
          <button class="project-gallery-arrow project-gallery-arrow--previous" type="button" data-gallery-previous aria-label="Imaginea anterioară">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15.5 3 6 12l9.5 9 2.5-2.7-6.7-6.3 6.7-6.3z" /></svg>
          </button>
          <img class="project-gallery-image" data-gallery-image src="${slides[0].src}" alt="${slides[0].alt}" aria-live="polite" role="button" tabindex="0" aria-haspopup="dialog" title="Deschide fotografia pentru zoom">
          <button class="project-gallery-arrow project-gallery-arrow--next" type="button" data-gallery-next aria-label="Imaginea următoare">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8.5 3 18 12l-9.5 9L6 18.3l6.7-6.3L6 5.7z" /></svg>
          </button>
        </div>
        <div class="project-gallery-bar">
          <p class="project-gallery-caption" data-gallery-caption aria-live="polite">${slides[0].caption || slides[0].alt}</p>
          <div class="project-gallery-thumbnails" aria-label="Alege o imagine">
            ${slides.map(renderSlide).join("")}
          </div>
        </div>
      </div>
    `
    : `<div class="project-gallery-empty">Fotografiile acestui proiect vor apărea aici.</div>`;

  document.title = `${project.title} | Momentum FTC 21088`;
  root.innerHTML = `
    <article class="project-detail-page">
      <section class="project-detail-content">
        <div class="section-inner">
          <a class="project-back-link" href="robots-projects.html"> < Toate proiectele</a>
          <div class="project-overview-card">
            <p class="eyebrow">${project.category}</p>
            <h1 class="project-detail-title">${project.title}</h1>
            <p class="project-detail-period">${project.period}</p>
            <p class="project-detail-lede">${project.description}</p>
          </div>
          ${gallery}
          <div class="project-detail-actions">
            <a class="button ghost" href="robots-projects.html">Înapoi la Robots &amp; Projects</a>
          </div>
        </div>
      </section>
    </article>
  `;

  const galleryElement = root.querySelector("[data-project-gallery]");
  if (!galleryElement || slides.length < 2) return;

  const image = galleryElement.querySelector("[data-gallery-image]");
  const caption = galleryElement.querySelector("[data-gallery-caption]");
  const thumbs = [...galleryElement.querySelectorAll("[data-gallery-thumb]")];
  let activeIndex = 0;

  function showSlide(index) {
    activeIndex = (index + slides.length) % slides.length;
    const slide = slides[activeIndex];
    image.src = slide.src;
    image.alt = slide.alt;
    caption.textContent = slide.caption || slide.alt;

    thumbs.forEach((thumb, thumbIndex) => {
      const isActive = thumbIndex === activeIndex;
      thumb.classList.toggle("is-active", isActive);
      thumb.setAttribute("aria-pressed", isActive ? "true" : "false");
      if (isActive) thumb.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" });
    });
  }

  galleryElement.querySelector("[data-gallery-previous]").addEventListener("click", () => showSlide(activeIndex - 1));
  galleryElement.querySelector("[data-gallery-next]").addEventListener("click", () => showSlide(activeIndex + 1));
  thumbs.forEach((thumb) => {
    thumb.addEventListener("click", () => showSlide(Number(thumb.dataset.galleryThumb)));
  });
  const stage = galleryElement.querySelector("[data-gallery-stage]");
  stage.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") showSlide(activeIndex - 1);
    if (event.key === "ArrowRight") showSlide(activeIndex + 1);
  });

  let touchStartX = null;
  let touchStartY = null;
  stage.addEventListener("touchstart", (event) => {
    const touch = event.changedTouches[0];
    touchStartX = touch?.clientX ?? null;
    touchStartY = touch?.clientY ?? null;
  }, { passive: true });
  stage.addEventListener("touchend", (event) => {
    if (touchStartX === null || touchStartY === null) return;
    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - touchStartX;
    const deltaY = touch.clientY - touchStartY;
    if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY)) {
      showSlide(activeIndex + (deltaX < 0 ? 1 : -1));
      stage.dataset.swipeSuppressed = "true";
      window.setTimeout(() => delete stage.dataset.swipeSuppressed, 400);
    }
    touchStartX = null;
    touchStartY = null;
  }, { passive: true });
})();
