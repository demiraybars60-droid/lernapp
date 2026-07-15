# 📇 Karteikarten-Lern-App (PWA)

Eine kleine, **offline-fähige** Lern-App für Karteikarten – gebaut zum Lernen für die
Uni-Klausur direkt auf dem Handy. Kein Build-Step, kein npm, keine Anmeldung.

- 📱 **Mobile-first** & Dark Mode als Standard, große Touch-Buttons
- 🔌 **Offline-fähig** dank Service Worker (nach dem ersten Laden komplett ohne Internet)
- 💾 **Lernfortschritt** wird lokal im Browser gespeichert (`localStorage`)
- 📅 **Lerntage**: 67 Lernkarten (Siedlungswasserwirtschaft I – Theorie + Formeln, Abwasser & Trinkwasser) thematisch auf 6 Lerntage verteilt – in 6 Tagen alles durch
- ✅ **Live-Status oben rechts**: wie viele richtig (✅), halb (🟠) und falsch (🔴) sind – plus farbige Chips für jede einzelne Karte
- 🔁 **Mastery-Logik**: eine Karte gilt erst als „gemeistert", wenn du sie sicher kannst – *Halb* muss 1× richtig, *Falsch* muss **2× hintereinander** richtig beantwortet werden
- ➕ Installierbar als App auf dem Homescreen (PWA)

---

## 📂 Dateien

| Datei | Zweck |
|---|---|
| `index.html` | Komplette App (HTML, JavaScript inline, Tailwind via CDN) |
| `questions.json` | Die Fragen & Antworten (hier neue Karten ergänzen) |
| `manifest.json` | PWA-Metadaten (Name, Farben, Icons) |
| `service-worker.js` | Caching für den Offline-Betrieb |
| `icon-192.png`, `icon-512.png` | App-Icons für den Homescreen |

---

## ▶️ Lokal testen

Da die App `questions.json` per `fetch` lädt **und** einen Service Worker nutzt, muss sie
über einen kleinen Webserver laufen (ein simpler Doppelklick auf `index.html` reicht nicht).

```bash
# Im Projektordner – einer dieser Befehle genügt:
python3 -m http.server 8000
# oder:
npx serve
```

Dann im Browser öffnen: <http://localhost:8000>

> 💡 Service Worker funktionieren nur über `https://` oder über `http://localhost`.
> GitHub Pages liefert automatisch HTTPS – passt also perfekt.

---

## 🚀 Hosting über GitHub Pages

1. **Repository anlegen** (falls noch nicht vorhanden) und die Dateien hochladen –
   `index.html` muss im **Wurzelverzeichnis** des Branches liegen.

   ```bash
   git add .
   git commit -m "Karteikarten-PWA"
   git push
   ```

2. **GitHub Pages aktivieren:**
   - Im Repo auf **Settings → Pages**
   - Unter **Build and deployment → Source**: **„Deploy from a branch"** wählen
   - Branch auswählen (z. B. `main`) und Ordner **`/ (root)`** → **Save**

3. **Warten & öffnen:** Nach ca. 1 Minute ist die App erreichbar unter:

   ```
   https://<dein-benutzername>.github.io/<repo-name>/
   ```

4. **Auf dem Handy installieren:**
   - Link am Handy öffnen (Chrome / Safari)
   - **Android (Chrome):** Menü ⋮ → „App installieren" / „Zum Startbildschirm hinzufügen"
   - **iPhone (Safari):** Teilen-Symbol → „Zum Home-Bildschirm"

   Danach startet die App wie eine native App – auch ohne Internet. ✈️

> ℹ️ Alle Pfade in der App sind **relativ**, daher funktioniert das Hosting im
> Unterverzeichnis `…/<repo-name>/` von GitHub Pages ohne Anpassung.

---

## ✏️ Eigene Fragen hinzufügen

Einfach `questions.json` bearbeiten und weitere Objekte ergänzen:

```json
{
  "id": "q11",
  "thema": "Kanalisation",
  "frage": "Deine Frage?",
  "antwort": "Die Antwort dazu."
}
```

- `id` muss **eindeutig** sein (sonst überschneidet sich der gespeicherte Fortschritt).
- Nach dem Bearbeiten neu deployen (committen & pushen). Auf dem Handy ggf. die App
  einmal schließen und neu öffnen, damit der Service Worker die neue Version lädt.

---

## 🗓️ Lerntage

Auf dem Startbildschirm wählst du deinen **Lerntag**. Die Tage werden automatisch aus dem
Feld `tag` in der `questions.json` gebildet – aktuell 6 Tage, thematisch gruppiert:

| Tag | Thema | Karten |
|---|---|---|
| **Tag 1** | Abwasser – Kanalisation & Start Parameter (BSB₅/CSB) | 11 |
| **Tag 2** | Abwasser – Parameter & Kläranlage I | 10 |
| **Tag 3** | Abwasser – Kläranlage II + Trinkwasser-Filtration | 11 |
| **Tag 4** | Trinkwasser – Flockung, Adsorption & Desinfektion I | 11 |
| **Tag 5** | Trinkwasser – Desinfektion II & Wasserbedarf | 12 |
| **Tag 6** | Trinkwasser – Verteilung + **Formeln** (Reynolds, Spitzenfaktoren …) | 12 |

Jeder Tag zeigt, wie viele seiner Karten du schon **gemeistert** hast (z. B. `8/11 ✅`).
Mit **„Alle Karten mischen"** kannst du alle 67 Karten zusammen wiederholen.

**Pausieren & Fortsetzen:** Der Fortschritt wird nach **jeder** Antwort gespeichert – auch
mitten im Durchlauf. Brichst du z. B. bei „3 gemeistert, 2 halb" ab, steht der Tag auf
**„weiter machen"** (blau) und du machst genau dort weiter (die schon gemeisterten Karten
sind raus, die halben/offenen kommen wieder). Mit dem **↺-Knopf** rechts neben einem Tag
setzt du **nur diesen einen Tag** zurück; „Zurücksetzen" oben löscht den gesamten Fortschritt.

Die **Formel-Karten** (Thema `Formeln`) fragen die klausurrelevanten Formeln separat ab
(Reynolds-Zahl, Tages-/Stundenspitzenfaktor, Löschwasserreserve, Freundlich-Isotherme,
Bernoulli). Reine Diagramm-/Zeichenaufgaben sind bewusst nicht enthalten.

> Inhalt: Theoriefragen mit geprüften Lösungen zu *Siedlungswasserwirtschaft I*
> (TU Hamburg). Fachlich am Skript orientiert und fürs Auswendiglernen strukturiert.

## 🔁 Mastery-Logik (wie „gemeistert" funktioniert)

Nach jeder Antwort bewertest du dich mit einem der drei Buttons. Eine Karte verlässt die
Runde erst, wenn du sie wirklich sicher kannst:

| Button | Farbe | Bedingung zum Meistern |
|---|---|---|
| **Wusste ich** | 🟢 grün | zählt sofort als sitzt (bei einer neuen Karte reicht 1×). |
| **Halb** | 🟠 orange | muss **noch 1× richtig** beantwortet werden. |
| **Wusste ich nicht** | 🔴 rot | muss **2× hintereinander richtig** beantwortet werden. |

Nicht gemeisterte Karten tauchen in derselben Runde immer wieder auf, bis alle grün sind.
Nach jeder Antwort leuchtet die Karte kurz grün / orange / rot auf.

**Live-Status oben rechts:** ✅ = gemeistert, 🟠 = halb (offen), 🔴 = falsch (offen).
Darunter zeigt eine Reihe **farbiger Chips** jede einzelne Karte (Nummer + Status), damit
du auf einen Blick siehst, *welche* Karten noch offen sind.

Der Fortschritt wird pro Karte im `localStorage` gespeichert (`mastered` + Status). Mit dem
Button **„Zurücksetzen"** löschst du den kompletten Lernfortschritt.

## ➕ Fragen erweitern & neue Lerntage

Neue Frage einfach in `questions.json` ergänzen und mit `"tag": 4` einen weiteren Lerntag
anlegen – der Tag erscheint dann automatisch auf dem Startbildschirm:

```json
{ "id": "q31", "tag": 4, "thema": "Kläranlage", "frage": "…", "antwort": "Zeile 1\nZeile 2" }
```

> 💡 In der `antwort` sorgt `\n` für einen Zeilenumbruch – so kannst du die Antworten
> übersichtlich in Stichpunkten fürs Auswendiglernen strukturieren.

---

## 🛠️ Tech-Stack

- **HTML + Vanilla JavaScript** (alles inline in `index.html`)
- **Tailwind CSS** über CDN (kein Build nötig)
- **localStorage** für den Fortschritt
- **Web App Manifest + Service Worker** für Installierbarkeit & Offline-Betrieb

Viel Erfolg bei der Klausur! 🎓