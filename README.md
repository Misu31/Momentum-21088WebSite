# Momentum FTC 21088 Website

Site static în română pentru echipa Momentum FTC 21088.

Nu există React, build step sau dependențe. Site-ul folosește doar HTML, CSS și JavaScript.

## Editare rapidă

1. Deschide `assets/data.js`.
2. Modifică textele, pozele, statisticile, sponsorii, contactele și linkurile din obiectul `MOMENTUM_SITE`.
3. Deschide `index.html` în browser pentru verificare.

## Structura conținutului

- `team`: wordmark info, descriere, școală, oraș, motto
- `team.email`: adresa oficiala afisata in sectiunea Contact
- `images`: pozele mari de pe site
- `quickFacts`: fișa rapidă de sub hero
- `identity`: cardurile despre robot, software, strategie și pit
- `telemetry`: date FTCScout / FTC Events
- `events`: rezultate de eveniment
- `timeline`: sezoanele echipei
- `impact`: ONCS, InfoEducație și alte rezultate în afara FTC
- `partners`: secțiunea de parteneriate
- `sponsors`: imaginile și numele din logo wall-ul partenerilor
- `contacts`: telefoane și emailuri
- `social`: linkurile către Instagram și TikTok

Pagina `news.html` este pagina evenimentului. Textele Lorem ipsum pot fi înlocuite direct în fișier, fără alte modificări.

În `partners.tiers`, categoria `Financial sponsor` este pentru firme care susțin direct financiar sezonul.

## Poze

Pozele actuale sunt temporare. Înlocuiește URL-urile din `assets/data.js` cu imagini reale:

- `hero`: robotul pe teren, drive team sau poză de competiție cu energie
- `workshop`: CAD, mecanică, electronică, debugging, testare
- `competition`: teren, pit, drive team, prezentare, premiere
- `team`: echipă, mentorat, eveniment sau comunitate

## Contract

Modelul este în `documente/model-contract-sponsorizare.html`.
Poate fi printat sau salvat ca PDF din browser. Înainte de publicare, înlocuiește modelul cu varianta validată de școală/asociație/entitatea juridică ce poate primi sponsorizarea.

## Logo wall

Logo wall-ul este generat din `sponsors` în `assets/data.js`.
Înlocuiește URL-urile temporare din `logo` cu logo-uri reale, ideal imagini PNG/WebP cu fundal transparent sau alb.

## Date FTC

Telemetria încearcă să preia automat Quick Stats pentru echipa 21088 din API-ul public FTCScout, fără cheie API. Dacă serviciul nu răspunde, site-ul afișează valorile de rezervă din `assets/data.js`, verificate la 4 septembrie 2026.
Când începe un sezon nou, actualizează anii din `telemetry.live`, plus `events` și `quickFacts` în `assets/data.js`.
