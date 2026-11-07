(() => {
  const dialog = document.createElement("dialog");
  dialog.className = "image-lightbox";
  dialog.setAttribute("aria-label", "Vizualizare fotografie mărită");
  dialog.innerHTML = `
    <div class="image-lightbox-toolbar" role="group" aria-label="Controale zoom">
      <button class="image-lightbox-button" type="button" data-zoom-out aria-label="Micșorează fotografia">−</button>
      <output data-zoom-level aria-live="polite">100%</output>
      <button class="image-lightbox-button" type="button" data-zoom-in aria-label="Mărește fotografia">+</button>
      <button class="image-lightbox-button" type="button" data-zoom-reset aria-label="Resetează zoom-ul">Potrivire</button>
      <button class="image-lightbox-button" type="button" data-lightbox-close aria-label="Închide fotografia">Închide</button>
    </div>
    <div class="image-lightbox-viewport" data-lightbox-viewport>
      <img class="image-lightbox-image" alt="">
    </div>
    <p class="image-lightbox-caption" data-lightbox-caption></p>
  `;
  document.body.append(dialog);

  const lightboxImage = dialog.querySelector(".image-lightbox-image");
  const viewport = dialog.querySelector("[data-lightbox-viewport]");
  const zoomLevel = dialog.querySelector("[data-zoom-level]");
  const caption = dialog.querySelector("[data-lightbox-caption]");
  let opener = null;
  let baseWidth = 0;
  let zoom = 1;

  function applyZoom(nextZoom) {
    zoom = Math.min(4, Math.max(0.5, nextZoom));
    lightboxImage.style.width = `${Math.round(baseWidth * zoom)}px`;
    zoomLevel.value = `${Math.round(zoom * 100)}%`;
    zoomLevel.textContent = `${Math.round(zoom * 100)}%`;
  }

  function openImage(source) {
    const gallery = source.closest(".news-gallery, .project-gallery");
    const newsCaption = source.closest(".news-award-figure")?.querySelector("figcaption")?.textContent;
    const projectCaption = gallery?.querySelector("[data-gallery-caption]")?.textContent;
    const description = newsCaption || projectCaption || source.alt || "Fotografie Momentum";

    opener = source;
    lightboxImage.alt = source.alt || description;
    caption.textContent = description;
    dialog.setAttribute("aria-label", `Fotografie mărită: ${description}`);
    lightboxImage.onload = () => {
      baseWidth = Math.min(lightboxImage.naturalWidth, Math.max(240, window.innerWidth - 64), 1600);
      viewport.scrollTop = 0;
      viewport.scrollLeft = 0;
      applyZoom(1);
    };
    lightboxImage.src = source.currentSrc || source.src;
    if (lightboxImage.complete && lightboxImage.naturalWidth) {
      baseWidth = Math.min(lightboxImage.naturalWidth, Math.max(240, window.innerWidth - 64), 1600);
      applyZoom(1);
    }
    if (!dialog.open) dialog.showModal();
    dialog.querySelector("[data-lightbox-close]").focus();
  }

  function findZoomableImage(target) {
    if (!(target instanceof Element)) return null;
    return target.closest("img.news-gallery-image, img.project-gallery-image");
  }

  document.addEventListener("click", (event) => {
    const source = findZoomableImage(event.target);
    if (!source) return;
    const stage = source.closest("[data-gallery-stage]");
    if (source.dataset.swipeSuppressed === "true" || stage?.dataset.swipeSuppressed === "true") {
      event.preventDefault();
      return;
    }
    event.preventDefault();
    openImage(source);
  });

  document.addEventListener("keydown", (event) => {
    if (dialog.open || (event.key !== "Enter" && event.key !== " ")) return;
    const source = findZoomableImage(event.target);
    if (!source) return;
    event.preventDefault();
    openImage(source);
  });

  dialog.querySelector("[data-lightbox-close]").addEventListener("click", () => dialog.close());
  dialog.querySelector("[data-zoom-in]").addEventListener("click", () => applyZoom(zoom * 1.25));
  dialog.querySelector("[data-zoom-out]").addEventListener("click", () => applyZoom(zoom / 1.25));
  dialog.querySelector("[data-zoom-reset]").addEventListener("click", () => {
    applyZoom(1);
    viewport.scrollTop = 0;
    viewport.scrollLeft = 0;
  });
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener("close", () => {
    opener?.focus();
    opener = null;
  });
  viewport.addEventListener("wheel", (event) => {
    if (!event.ctrlKey) return;
    event.preventDefault();
    applyZoom(zoom * (event.deltaY < 0 ? 1.1 : 1 / 1.1));
  }, { passive: false });
})();
