(() => {
  const gallery = document.querySelector("[data-news-gallery]");
  if (!gallery) return;

  const slides = [
    {
      src: "assets/Screenshot_20261102_232538.png",
      alt: "Premierea echipelor la RoboChallenge 2026, cu reprezentanții Momentum pe podium",
      caption: "Momentum — locul al II-lea, Freestyle Showcase Highschool",
    },
    {
      src: "assets/WhatsApp Image 2026-11-04 at 22.45.49.jpeg",
      alt: "Echipa Momentum pe scena competiției RoboChallenge",
      caption: "Echipa Momentum la RoboChallenge 2026",
    },
    {
      src: "assets/Screenshot_20261104_222252.png",
      alt: "Doi membri ai echipei Momentum cu premiile obținute",
      caption: "Premiile echipei Momentum",
    },
    {
      src: "assets/WhatsApp Image 2026-11-04 at 22.45.50 (3).jpeg",
      alt: "Sala competiției în timpul prezentării echipelor",
      caption: "Atmosfera competiției RoboChallenge",
    },
  ];

  let current = 0;
  gallery.innerHTML = `
    <figure class="news-award-figure">
      <img class="news-gallery-image" alt="">
      <figcaption></figcaption>
    </figure>
    <div class="news-gallery-controls" role="group" aria-label="Navigare fotografii">
      <button class="news-gallery-button" type="button" data-gallery-previous aria-label="Fotografia anterioară">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15.5 3 6 12l9.5 9 2.5-2.7-6.7-6.3 6.7-6.3z" fill="currentColor"/></svg>
      </button>
      <button class="news-gallery-button" type="button" data-gallery-next aria-label="Fotografia următoare">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8.5 3 18 12l-9.5 9L6 18.3l6.7-6.3L6 5.7z" fill="currentColor"/></svg>
      </button>
    </div>
    <div class="news-gallery-thumbs" aria-label="Alege fotografia"></div>
  `;

  const figure = gallery.querySelector(".news-award-figure");
  const image = gallery.querySelector(".news-gallery-image");
  const caption = gallery.querySelector("figcaption");
  const thumbs = gallery.querySelector(".news-gallery-thumbs");
  const thumbButtons = slides.map((slide, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "news-gallery-thumb";
    button.setAttribute("aria-label", `Arată fotografia ${index + 1}: ${slide.caption}`);
    button.addEventListener("click", () => show(index));
    const thumbnail = document.createElement("img");
    thumbnail.src = slide.src;
    thumbnail.alt = "";
    thumbnail.loading = "lazy";
    button.append(thumbnail);
    thumbs.append(button);
    return button;
  });

  function fitImage() {
    if (!image.naturalWidth || !image.naturalHeight) return;
    figure.style.removeProperty("width");
    figure.style.removeProperty("--news-caption-width");
    const width = image.getBoundingClientRect().width;
    figure.style.width = `${Math.round(width + 4)}px`;
    figure.style.setProperty("--news-caption-width", `${Math.round(width)}px`);
  }

  function show(index) {
    current = (index + slides.length) % slides.length;
    const slide = slides[current];
    image.onload = fitImage;
    image.src = slide.src;
    image.alt = slide.alt;
    caption.textContent = slide.caption;
    if (image.complete) fitImage();
    thumbButtons.forEach((button, thumbIndex) => {
      if (thumbIndex === current) button.setAttribute("aria-current", "true");
      else button.removeAttribute("aria-current");
    });
  }

  gallery.querySelector("[data-gallery-previous]").addEventListener("click", () => show(current - 1));
  gallery.querySelector("[data-gallery-next]").addEventListener("click", () => show(current + 1));
  window.addEventListener("resize", fitImage);
  gallery.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") show(current - 1);
    if (event.key === "ArrowRight") show(current + 1);
  });

  let touchStartX = null;
  image.addEventListener("touchstart", (event) => {
    touchStartX = event.changedTouches[0]?.clientX ?? null;
  }, { passive: true });
  image.addEventListener("touchend", (event) => {
    if (touchStartX === null) return;
    const delta = event.changedTouches[0].clientX - touchStartX;
    if (Math.abs(delta) > 45) show(current + (delta < 0 ? 1 : -1));
    touchStartX = null;
  }, { passive: true });

  show(0);
})();
