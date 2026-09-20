(function () {
  const root = document.querySelector("#projects-grid");
  const projects = window.MOMENTUM_SITE?.projects || [];
  const groups = [
    { id: "ftc", title: "FIRST Tech Challenge" },
    { id: "competitions", title: "Olimpiade & Concursuri" },
    { id: "other", title: "Alte proiecte" }
  ];

  if (!root) return;

  function renderProject(project) {
    const visual = project.image
      ? `<img src="${project.image}" alt="${project.imageAlt || project.title}" loading="lazy">`
      : `<div class="project-visual-placeholder" aria-hidden="true">Momentum</div>`;

    return `
      <article class="project-card">
        <figure class="project-visual">
          ${visual}
        </figure>
        <div class="project-card-body">
          <div class="project-meta">
            <span>${project.category}</span>
            <strong>${project.period}</strong>
          </div>
          <h3>${project.title}</h3>
          <p>${project.description}</p>
        </div>
      </article>
    `;
  }

  root.innerHTML = groups.map((group) => {
    const groupProjects = projects.filter((project) => project.group === group.id);
    const content = groupProjects.length
      ? groupProjects.map(renderProject).join("")
      : `<p class="project-group-empty">Proiectele vor fi adăugate aici.</p>`;

    return `
      <section class="project-group" aria-labelledby="projects-${group.id}">
        <header class="project-group-heading">
          <h2 id="projects-${group.id}">${group.title}</h2>
        </header>
        <div class="projects-grid">
          ${content}
        </div>
      </section>
    `;
  }).join("");
})();
