# 📇 Karteikarten-Lern-App (PWA)

Eine kleine, **offline-fähige** Lern-App für Karteikarten – gebaut zum Lernen für die
Uni-Klausur direkt auf dem Handy. Kein Build-Step, kein npm, keine Anmeldung.

- 📱 **Mobile-first** & Dark Mode als Standard, große Touch-Buttons
- 🔌 **Offline-fähig** dank Service Worker (nach dem ersten Laden komplett ohne Internet)
- 💾 **Lernfortschritt** wird lokal im Browser gespeichert (`localStorage`)
- 🧠 **Spaced Repetition**: Karten kommen je nach Wissen früher oder später wieder
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

## 🧠 Wie funktioniert die Spaced-Repetition-Logik?

Für jede Karte werden im `localStorage` drei Werte gespeichert:

| Wert | Bedeutung | Startwert |
|---|---|---|
| `ease_factor` | „Leichtigkeit" der Karte (steuert das Wachstum) | `2.5` |
| `interval_days` | Tage bis zur nächsten Wiederholung | `0` |
| `next_review` | Datum der nächsten Fälligkeit (`YYYY-MM-DD`) | heute |

Nach jeder Antwort bewertest du dich mit einem der drei Buttons:

| Button | Wirkung |
|---|---|
| **Wusste ich nicht** | `interval = 1 Tag`, `ease − 0.2` (min. 1.3). Karte kommt in dieser Session nochmal. |
| **Halb** | Intervall wächst **leicht** (halbe Leichtigkeit), `ease` unverändert. |
| **Wusste ich** | Intervall wächst **stark** (× `ease`), `ease + 0.1`. |

So tauchen schwierige Karten häufig auf, gut gekonnte Karten immer seltener.

Auf dem Startbildschirm steht, **wie viele Karten heute fällig** sind. Mit dem Button
**„Zurücksetzen"** löschst du den kompletten Lernfortschritt.

---

## 🛠️ Tech-Stack

- **HTML + Vanilla JavaScript** (alles inline in `index.html`)
- **Tailwind CSS** über CDN (kein Build nötig)
- **localStorage** für den Fortschritt
- **Web App Manifest + Service Worker** für Installierbarkeit & Offline-Betrieb

Viel Erfolg bei der Klausur! 🎓