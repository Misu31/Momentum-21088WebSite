(function () {
  const data = window.MOMENTUM_SITE;
  const root = document.querySelector("#app");
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const siteNav = document.querySelector("[data-site-nav]");
  const newsLink = document.querySelector("[data-news-link]");

  if (menuToggle && siteNav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = siteNav.classList.toggle("is-open");
      menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    siteNav.addEventListener("click", (event) => {
      if (event.target.closest("a")) {
        siteNav.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  if (newsLink) {
    const deliveredKey = "momentum-news-notification-delivered";
    const readKey = "momentum-news-notification-read";
    const isNewsPage = newsLink.getAttribute("aria-current") === "page";
    const notificationAudio = new Audio("assets/notification%20sound.wav");
    notificationAudio.preload = "auto";
    let pendingSound = false;

    function readSessionValue(key) {
      try {
        return window.sessionStorage.getItem(key) === "true";
      } catch (error) {
        return false;
      }
    }

    function writeSessionValue(key) {
      try {
        window.sessionStorage.setItem(key, "true");
      } catch (error) {
        // The visual notification still works when storage is unavailable.
      }
    }

    function removeSoundUnlockListeners() {
      document.removeEventListener("pointerdown", playPendingSound, true);
      document.removeEventListener("keydown", playPendingSound, true);
    }

    function playNotificationTone() {
      notificationAudio.currentTime = 0;
      const playRequest = notificationAudio.play();

      if (!playRequest) return;
      playRequest.then(() => {
        pendingSound = false;
        removeSoundUnlockListeners();
      }).catch(() => {
        pendingSound = true;
      });
    }

    function playPendingSound() {
      if (pendingSound) playNotificationTone();
    }

    function showNewsNotification(withSound) {
      newsLink.classList.add("has-news-notification");
      newsLink.setAttribute("aria-label", "News, o noutate nouă");
      if (withSound) playNotificationTone();
    }

    document.addEventListener("pointerdown", playPendingSound, true);
    document.addEventListener("keydown", playPendingSound, true);

    if (isNewsPage) {
      writeSessionValue(readKey);
    } else if (readSessionValue(readKey)) {
      newsLink.classList.remove("has-news-notification");
    } else if (readSessionValue(deliveredKey) && !readSessionValue(readKey)) {
      showNewsNotification(false);
    } else if (!readSessionValue(deliveredKey)) {
      window.setTimeout(() => {
        writeSessionValue(deliveredKey);
        showNewsNotification(true);
      }, 3000);
    }

    newsLink.addEventListener("click", () => {
      writeSessionValue(readKey);
      newsLink.classList.remove("has-news-notification");
      newsLink.removeAttribute("aria-label");
    });
  }

  if (!data || !root) {
    return;
  }

  function sourceLinks() {
    return `
      <a href="${data.links.ftcScout}" target="_blank" rel="noreferrer">FTCScout</a>
      <a href="${data.links.ftcEvents}" target="_blank" rel="noreferrer">FTC Events</a>
    `;
  }

  function renderFact(item) {
    return `
      <article class="fact-card">
        <span>${item.label}</span>
        <strong>${item.value}</strong>
      </article>
    `;
  }

  function renderIdentity(item) {
    return `
      <article class="identity-card">
        <span>${item.label}</span>
        <h3>${item.title}</h3>
        <p>${item.text}</p>
      </article>
    `;
  }

  function renderHeroStat(item) {
    return `
      <article class="telemetry-card" data-telemetry-stat="${item.key}">
        <strong>${item.value}</strong>
        <span>${item.label}</span>
        <p>${item.note}</p>
      </article>
    `;
  }

  function renderQuickStat(row) {
    return `
      <tr data-api-season="${row.apiSeason}">
        <th scope="row">${row.season}<span>${row.game}</span></th>
        <td data-stat-field="totalOpr">${row.totalOpr}</td>
        <td data-stat-field="autoOpr">${row.autoOpr}</td>
        <td data-stat-field="teleopOpr">${row.teleopOpr}</td>
        <td data-stat-field="endgameOpr">${row.endgameOpr}</td>
        <td data-stat-field="globalRank">${row.globalRank}</td>
      </tr>
    `;
  }

  function renderNote(item) {
    return `<li>${item}</li>`;
  }

  function renderEvent(event) {
    return `
      <article class="event-card">
        <div>
          <span>${event.meta}</span>
          <h3>${event.name}</h3>
        </div>
        <dl>
          <div><dt>Clasament</dt><dd>${event.rank}</dd></div>
          <div><dt>Record</dt><dd>${event.record}</dd></div>
          <div><dt>Medie</dt><dd>${event.average}</dd></div>
          <div><dt>Maxim</dt><dd>${event.high}</dd></div>
        </dl>
      </article>
    `;
  }

  function renderTimeline(item) {
    return `
      <article class="timeline-card">
        <span>${item.season}</span>
        <strong>${item.game}</strong>
        <h3>${item.title}</h3>
        <p>${item.text}</p>
      </article>
    `;
  }

  function renderImpact(item) {
    return `
      <article class="impact-card">
        <span>${item.result}</span>
        <h3>${item.title}</h3>
        <p>${item.text}</p>
      </article>
    `;
  }

  function renderPartnerValue(item) {
    return `<li>${item}</li>`;
  }

  function renderTier(item) {
    return `
      <article class="tier-card">
        <h3>${item.title}</h3>
        <p>${item.text}</p>
      </article>
    `;
  }

  function renderSponsor(sponsor) {
    const logo = sponsor.logo
      ? `<img src="${sponsor.logo}" alt="Logo ${sponsor.name}">`
      : `<span class="sponsor-mark" aria-hidden="true">${sponsor.name.slice(0, 1)}</span>`;

    return `
      <article class="sponsor-card" aria-label="${sponsor.name}">
        ${logo}
        <div>
          <span>${sponsor.type}</span>
          <h3>${sponsor.name}</h3>
        </div>
      </article>
    `;
  }

  function renderSponsorTrack(items) {
    return items.map(renderSponsor).join("");
  }

  function renderContact(contact) {
    const phoneHref = contact.phone.replace(/[^\d+]/g, "");
    return `
      <article class="contact-card">
        <span>${contact.role}</span>
        <h3>${contact.name}</h3>
        <a href="tel:${phoneHref}">${contact.phone}</a>
        <a href="mailto:${contact.email}">${contact.email}</a>
      </article>
    `;
  }

  function renderSocial(link) {
    const href = link.url === "#" ? "#contact" : link.url;
    const attrs = link.url === "#" ? "" : 'target="_blank" rel="noreferrer"';
    return `<a href="${href}" ${attrs}>${link.label}</a>`;
  }

  root.innerHTML = `
    <section class="hero-card" id="top">
      <div class="hero-shell">
        <div class="hero-copy">
          <p class="eyebrow">${data.team.heroLine}</p>
          <div class="wordmark" aria-label="Momentum 21088">
            <span data-text="Momentum">Momentum</span>
            <strong data-text="21088">21088</strong>
          </div>
          <p class="hero-statement">${data.team.statement}</p>
          <div class="hero-actions" aria-label="Acțiuni principale">
            <a class="button primary" href="#identitate">Cine suntem</a>
            <a class="button ghost" href="#telemetry">Telemetrie</a>
          </div>
        </div>
        <figure class="hero-image">
          <img src="${data.images.hero}" alt="Imagine reprezentativă Momentum">
          <figcaption>
            <span>${data.team.competition}</span>
            <strong>${data.team.motto}</strong>
          </figcaption>
        </figure>
      </div>
    </section>

    <section class="facts-strip" aria-label="Fișă rapidă Momentum">
      <div class="section-inner facts-grid">
        ${data.quickFacts.map(renderFact).join("")}
      </div>
    </section>

    <section class="section-block intro-section" id="identitate">
      <div class="section-inner intro-grid">
        <div>
          <p class="eyebrow">Identity</p>
          <h1>${data.team.name}</h1>
        </div>
        <p>
          O echipă FTC nu este doar robotul de pe teren. Este un sistem: atelier, cod, strategie,
          prezentare, date, oameni și identitate. Momentum există ca acest sistem, cu Brăila pe hartă
          și cu numărul 21088 pe robot.
        </p>
      </div>
    </section>

    <section class="media-band">
      <div class="media-panel main-photo">
        <img src="${data.images.workshop}" alt="Atelier Momentum">
        <span>Laborator</span>
      </div>
      <div class="media-panel">
        <img src="${data.images.competition}" alt="Competiție FTC">
        <span>Competitie</span>
      </div>
      <div class="media-panel blue">
        <img src="${data.images.team}" alt="Echipa Momentum">
        <span>Driving Team</span>
      </div>
    </section>

    <section class="section-block systems-section" id="robot">
      <div class="section-inner">
        <div class="section-header">
          <p class="eyebrow">The system</p>
          <h2>Robotul este mașina. Echipa este motorul.</h2>
        </div>
        <div class="identity-grid">
          ${data.identity.map(renderIdentity).join("")}
        </div>
      </div>
    </section>

    <section class="section-block telemetry-section" id="telemetry">
      <div class="section-inner">
        <div class="telemetry-head">
          <div>
            <p class="eyebrow">FTC data</p>
            <h2>${data.telemetry.headline}</h2>
          </div>
          <p>${data.telemetry.intro}</p>
        </div>

        <div class="telemetry-grid">
          ${data.telemetry.heroStats.map(renderHeroStat).join("")}
        </div>

        <div class="stats-layout">
          <div class="table-wrap" role="region" aria-label="Comparație OPR pe sezoane" tabindex="0">
            <table>
              <thead>
                <tr>
                  <th>Sezon</th>
                  <th>OPR total</th>
                  <th>Auto</th>
                  <th>TeleOp</th>
                  <th>Endgame</th>
                  <th>Clasament global</th>
                </tr>
              </thead>
              <tbody>${data.telemetry.quickStats.map(renderQuickStat).join("")}</tbody>
            </table>
          </div>
          <aside class="notes-card">
            <h3>Notes</h3>
            <ul>${data.telemetry.notes.map(renderNote).join("")}</ul>
            <p class="telemetry-status" data-telemetry-status aria-live="polite">
              Date de rezervă verificate la ${data.telemetry.sourceDate}.
            </p>
            <div class="source-links">${sourceLinks()}</div>
          </aside>
        </div>

        <div class="event-grid">
          ${data.events.map(renderEvent).join("")}
        </div>
      </div>
    </section>

    <section class="section-block timeline-section">
      <div class="section-inner timeline-layout">
        <div class="section-header">
          <p class="eyebrow">Timeline</p>
          <h2>Sezoane care au construit identitatea.</h2>
        </div>
        <div class="timeline-grid">
          ${data.timeline.map(renderTimeline).join("")}
        </div>
      </div>
    </section>

    <section class="section-block impact-section" id="olimpiade">
      <div class="section-inner impact-layout">
        <div class="section-header">
          <p class="eyebrow">Beyond FTC</p>
          <h2>Proiectele continuă și în afara terenului.</h2>
        </div>
        <div class="impact-grid">
          ${data.impact.map(renderImpact).join("")}
        </div>
      </div>
    </section>

    <section class="section-block partner-section" id="parteneri">
      <div class="section-inner partner-layout">
        <div>
          <p class="eyebrow">Collaborate</p>
          <h2>${data.partners.title}</h2>
          <p>${data.partners.text}</p>
          <ul class="check-list">${data.partners.value.map(renderPartnerValue).join("")}</ul>
          <div class="partner-actions">
            <a class="button primary" href="#contact">Contact</a>
          </div>
        </div>
        <div class="tier-grid">
          ${data.partners.tiers.map(renderTier).join("")}
        </div>
      </div>
    </section>

    <section class="section-block sponsor-section" id="sponsori">
      <div class="section-inner">
        <div class="section-header narrow">
          <p class="eyebrow">Partners</p>
          <h2>Parteneri</h2>
          <p>Un spațiu vizibil pentru partenerii care apar lângă Momentum. Imaginile sunt temporare și pot fi înlocuite direct din <code>assets/data.js</code>.</p>
        </div>
      </div>
      <div class="logo-wall" aria-label="Logo wall parteneri">
        <div class="logo-marquee">
          <div class="logo-track">
            ${renderSponsorTrack([...data.sponsors, ...data.sponsors])}
          </div>
        </div>
      </div>
    </section>

    <section class="section-block contact-section" id="contact">
      <div class="section-inner contact-layout">
        <div>
          <p class="eyebrow">Contact</p>
          <h2>Momentum FTC 21088</h2>
          <p>${data.team.school} / ${data.team.city}</p>
          <a class="team-email" href="mailto:${data.team.email}">${data.team.email}</a>
          <div class="social-links" aria-label="Rețele sociale">
            ${data.social.map(renderSocial).join("")}
          </div>
        </div>
        <div class="contact-grid">
          ${data.contacts.map(renderContact).join("")}
        </div>
      </div>
    </section>

    <footer class="site-footer">
      <div class="section-inner footer-grid">
        <p>${data.team.name} FTC ${data.team.number} / ${data.team.city}</p>
        <p>
          Data sources: ${sourceLinks()}
        </p>
      </div>
    </footer>
    <a class="velocity-strip" href="${data.links.velocityEasterEgg}" target="_blank" rel="noreferrer" aria-label="Velocity 21087"></a>
  `;

  function formatStat(value) {
    return Number(value).toFixed(2);
  }

  function updateTelemetryRow(stats) {
    const row = root.querySelector(`[data-api-season="${stats.season}"]`);
    if (!row) return;

    const values = {
      totalOpr: formatStat(stats.tot.value),
      autoOpr: formatStat(stats.auto.value),
      teleopOpr: formatStat(stats.dc.value),
      endgameOpr: formatStat(stats.eg.value),
      globalRank: `#${stats.tot.rank} / ${stats.count}`
    };

    Object.entries(values).forEach(([field, value]) => {
      const cell = row.querySelector(`[data-stat-field="${field}"]`);
      if (cell) cell.textContent = value;
    });
  }

  function updateTelemetryCard(key, value, note) {
    const card = root.querySelector(`[data-telemetry-stat="${key}"]`);
    if (!card) return;

    const valueElement = card.querySelector("strong");
    const noteElement = card.querySelector("p");
    if (valueElement) valueElement.textContent = value;
    if (noteElement && note) noteElement.textContent = note;
  }

  async function refreshTelemetry() {
    const config = data.telemetry.live;
    const status = root.querySelector("[data-telemetry-status]");
    if (!config || !status) return;

    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 8000);

    try {
      const getQuickStats = async (season) => {
        const response = await fetch(
          `${config.apiBase}/teams/${config.teamNumber}/quick-stats?season=${season}`,
          { signal: controller.signal }
        );
        if (!response.ok) throw new Error(`FTCScout ${response.status}`);
        return response.json();
      };

      const [current, previous] = await Promise.all([
        getQuickStats(config.currentSeason),
        getQuickStats(config.previousSeason)
      ]);

      updateTelemetryRow(current);
      updateTelemetryRow(previous);
      updateTelemetryCard("total", formatStat(current.tot.value));
      updateTelemetryCard("rank", `#${current.tot.rank}`, `din ${current.count} echipe`);

      const growth = Math.round((current.tot.value / previous.tot.value - 1) * 100);
      updateTelemetryCard("growth", `${growth >= 0 ? "+" : ""}${growth}%`);

      const updatedOn = new Intl.DateTimeFormat("ro-RO", { dateStyle: "long" }).format(new Date());
      status.textContent = `Actualizat live din FTCScout · ${updatedOn}`;
      status.classList.add("is-live");
    } catch (error) {
      status.textContent = `Date de rezervă verificate la ${data.telemetry.sourceDate}.`;
    } finally {
      window.clearTimeout(timeout);
    }
  }

  refreshTelemetry();
})();
