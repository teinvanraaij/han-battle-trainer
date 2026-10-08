# HAN Battle Trainer

[Open de app](https://teinvanraaij.github.io/han-battle-trainer/)

Oefen voor de Battle van de minor Circulaire Economie met 9 lessen duurzaamheid en 5 modules business ethics. Modi: Leer, Overhoor, Quiz, Battle en Gatenlijst. Munitie en Duivel zijn verwijderd. De Quiz bevat 28 meerkeuzevragen met automatische feedback en bronverwijzing.

De app bevat vaste, brongebonden oefenvragen en beoordelingscriteria. Bij open vragen beoordeel je je eigen antwoord. Bij de Quiz wordt je keuze automatisch gecontroleerd; er is geen AI verbonden. Antwoorden, scores en gatenlijst worden in de browser op je eigen apparaat bewaard. Voortgang van een andere website of browser wordt niet automatisch overgenomen.

## Installeren op je telefoon

- Android: open de app in Chrome en kies **Installeer de app**. Via het browsermenu kun je ook **Toevoegen aan startscherm** kiezen.
- iPhone: open de app in Safari, kies **Delen → Zet op beginscherm → Voeg toe**.

Open de app eerst met internet en wacht op **Klaar om offline te oefenen**. Daarna werken de geladen stof en oefenvragen ook offline. Externe links naar de e-learning vereisen internet.

## Bron

De lesinhoud is afkomstig uit [Minor CE e-learnings](https://fabianb88.github.io/minor-ce-elearnings/index.html). De app verwijst naar de relevante les of module. De oorspronkelijke inhoud blijft van de oorspronkelijke rechthebbenden; deze repository kent die inhoud geen nieuwe licentie toe. Dit is een oefenhulpmiddel, geen officiële HAN-app.

## Lokaal openen en aanpassen

Gebruik Node.js 20 of hoger; er zijn geen externe pakketten nodig.

```sh
npm test
npm start
```

Open daarna http://127.0.0.1:4173. De app staat in `dist/`: `data.js` bevat de geladen stof en oefendata, `engine.js` de oefenlogica, `app.js` de interface en `pwa.js`/`sw.js` de installatie en offline opslag.

Na een push naar `main` controleert GitHub Actions de app en publiceert `dist/` op GitHub Pages. Verhoog bij wijzigingen in offline bestanden de cacheversie in `dist/sw.js` zodat bestaande installaties de nieuwe versie kunnen laden.
