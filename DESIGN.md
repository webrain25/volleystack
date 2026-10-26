# VolleyStack — Design System & Visual Guidelines (DESIGN.md)

Questo documento definisce il linguaggio visivo, i design token, la gerarchia tipografica e i componenti per il redesign premium di **VolleyStack**.

---

## 1. Filosofia Visiva: Sports SaaS Premium

VolleyStack si posiziona come un prodotto SaaS sportivo di fascia alta (ispirato all'eleganza funzionale di *Linear* e alla precisione atletica di *Strava Pro*):
- **Precisione & Scansionabilità**: I dati critici (orari partite, convocazioni, importi multe, debiti paste) devono essere leggibili in 1 secondo a bordo campo.
- **Raffinata Doppia Anima (Light & Dark)**:
  - **Light Mode ("Azzurro Clean Court")**: Luminosa, ariosa, dominante nei palazzetti e sotto il sole, con contrasto netto e accenti Azzurro Royal.
  - **Dark Mode ("Obsidian Court")**: Sfondo profondo grafite/ossidiana (`#0B0F17`) con accenti cromatici ad alta saturazione, mai affaticante per gli occhi.
- **Micro-interazioni Funzionali**: Feedback immediato al tocco (RSVP, pagamenti, notifiche), transizioni fluide (150-250ms), pieno supporto a `prefers-reduced-motion`.

---

## 2. Design Tokens

### 2.1 Colori

#### Palette Semantica Principale
| Token | Light Mode | Dark Mode | Utilizzo |
| :--- | :--- | :--- | :--- |
| `--vs-bg-primary` | `#F8FAFC` (Slate 50) | `#070A10` (Deep Obsidian) | Sfondo principale dell'applicazione |
| `--vs-bg-secondary` | `#FFFFFF` | `#0D131F` (Dark Slate) | Sfondo sidebar, header e contenitori |
| `--vs-surface` | `#FFFFFF` | `#111A29` (Surface Navy) | Card principali, modali, pannelli |
| `--vs-surface-hover` | `#F1F5F9` | `#172338` | Stato hover su righe, item e card |
| `--vs-border` | `rgba(15, 23, 42, 0.08)` | `rgba(255, 255, 255, 0.08)` | Bordi sottili strutturali |
| `--vs-border-strong` | `rgba(15, 23, 42, 0.16)` | `rgba(255, 255, 255, 0.16)` | Bordi evidenziati o al focus |

#### Colori Accento e Sportivi
| Nome | Valore HEX | Utilizzo |
| :--- | :--- | :--- |
| **Brand Azure** | `#0066FF` (`#2563EB`) | Azione primaria, brand identity, bottoni principali |
| **Success Volt** | `#10B981` (`#059669`) | Convocazione confermata ("Ci sono"), saldo pagato, vittoria |
| **Warning Amber** | `#F59E0B` (`#D97706`) | In attesa, cartellini gialli, orari imminenti |
| **Danger Coral** | `#EF4444` (`#DC2626`) | Convocazione rifiutata, multa non pagata, cartellino rosso |
| **Pastry Pink** | `#EC4899` (`#DB2777`) | Tassa delle paste (goliardica, ben visibile, festosa) |

### 2.2 Tipografia

* **Font Primario**: `"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
* **Font Display / Numerico**: `"Inter Tight", "Inter", sans-serif` con `font-feature-settings: "tnum"` (tabular numbers per orari e importi in €).

| Livello | Dimensione / Interlinea | Peso | Utilizzo |
| :--- | :--- | :--- | :--- |
| **Display Hero** | `32px` / `38px` (mobile), `40px` / `46px` (desktop) | `700` Bold | Titolo evento hero, prossime sfide |
| **H1** | `24px` / `30px` (mobile), `28px` / `34px` (desktop) | `700` Bold | Intestazione principale di pagina |
| **H2** | `18px` / `24px` | `600` SemiBold | Sezioni interne, titoli card |
| **Metric Value** | `22px` - `26px` (tabular) | `700` Bold | Importi monetari, percentuali presenze |
| **Body Standard** | `14px` / `20px` | `400` Regular / `500` Medium | Testi correnti, descrizioni |
| **Caption / Label** | `11px` / `16px` (uppercase, tracking +0.05em) | `600` SemiBold | Categorie, date, tag di stato |

### 2.3 Raggio di Curvatura (Border Radius)
* `--radius-sm`: `8px` (Badge, chip, input compatti)
* `--radius-md`: `12px` (Pulsanti, input di form, menu a tendina)
* `--radius-lg`: `18px` (Card standard, feed item, widget secondari)
* `--radius-xl`: `24px` (EventHero, modali in primo piano)

---

## 3. Specifiche dei Componenti Chiave

### 3.1 EventHeroCard (Prossimo Evento & Convocazione)
* **Struttura**:
  * Chip tipologia evento: `Partita` (blu/oro) vs `Allenamento` (azzurro) vs `Social` (viola).
  * Data e Ora in rilievo con separatore chiaro e countdown visivo (`Tra 2 giorni, 4 ore`).
  * Indicazione Palazzetto/Campo con icona pin e link diretto a Google Maps.
  * **Pulsanti RSVP a 1 tocco**:
    * "Ci sono" (Pulsante prominente con icona check e stato attivo verde volt).
    * "Assente" / "In dubbio" (Pulsanti secondari compatti e puliti).
  * **Micro-Roster Avatar**: Preview orizzontale degli atleti già confermati con contatore `+8 altri`.

### 3.2 MetricWidget (Tax, Paste, Presenze)
* **Mobile Layout**: Adattivo. Invece di 3 colonne schiacciate su smartphone piccoli, si trasforma in un carosello touch o griglia flessibile a 2 colonne + riga estesa per evitare troncamento di testo.
* **Indicatori di stato**:
  * **Tax**: Saldo totale in evidenza con badge "Tutto in regola" verde o "X aperte" rosso corallo.
  * **Paste**: Icona pasticcino rosa con badge numerico pulsante delicato se ci sono debiti aperti.
  * **Presenze**: Percentuale con micro-barra di progresso discreta.

### 3.3 LockerFeedItem (Attività dello Spogliatoio)
* Cronologia con linea verticale di collegamento minima (`border-l-2`).
* Dot colorati semantici (verde = presenza, rosso = multa, rosa = paste).
* Avatar atleta o icona di sistema con testo sintetico.

### 3.4 BottomNavBar (Mobile)
* Altezza 64px con supporto `pb-safe` per iPhone con barra home.
* Icone vettoriali Lucide con spessore visivo aumentato sullo stato attivo.
* Indicatore pill o dot luminescente centrato sotto l'icona selezionata.

---

## 4. Regole di Accessibilità & Performance

1. **Contrasto WCAG AA**: Rapporto minimo 4.5:1 per tutti i testi su sfondi chiari o scuri.
2. **Focus State da Tastiera**: Anello di focus evidente (`focus-visible:ring-2 focus-visible:ring-brand-blue`).
3. **Motion**: Tutte le animazioni Framer Motion devono rispettare `prefers-reduced-motion` disattivando blur e traslazioni superflue.
4. **Touch Target**: Minimo 44x44px per tutti i pulsanti interattivi su mobile.
