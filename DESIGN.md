# VolleyStack — Design System & Visual Guidelines (DESIGN.md)

> **Direzione Ufficiale Approvata**: **Variante B — "Obsidian & Electric Volt"**  
> Ispirato a brand di telemetria e performance atletica di fascia alta (*Whoop*, *Strava Pro*, *Nike Training*). Una dark mode dominante, profonda, con accenti cromatici al neon ad altissimo contrasto.

---

## 1. Filosofia Visiva: Athletic Performance SaaS

VolleyStack adotta l'estetica **Obsidian & Volt**:
- **Impatto Visivo Immediato**: Sfondo nero profondo ossidiana (`#070B12`) con contrasti taglienti e card scure a sfocatura progressiva.
- **Accenti Electric Volt**: Il colore principale di accento e azione primaria è il **Volt Green** (`#00F59B`), simbolo di energia, presenza confermata e vitalità agonistica.
- **Badge & Indicatori Neon**: Micro-pill luminescenti per tempi di recupero, countdown alle partite e stati del quorum.
- **Tipografia Telemetrica**: Numeri tabellari bold per importi in cassa (`€ 110.00`) e percentuali presenze (`94%`), associati a barre grafiche ad alta visibilità.

---

## 2. Design Tokens

### 2.1 Palette Colori

| Token | Valore HEX | Utilizzo |
| :--- | :--- | :--- |
| `--vs-bg-primary` | `#070B12` | Sfondo principale (Deep Obsidian Black) |
| `--vs-bg-secondary` | `#0B101B` | Sfondo navigazione, header e pannelli laterali |
| `--vs-surface` | `#0F1726` | Superficie card, modali, schede statistiche |
| `--vs-surface-hover` | `#162238` | Stato hover su card e righe di tabelle |
| `--vs-border` | `rgba(255, 255, 255, 0.08)` | Bordi sottili strutturali |
| `--vs-border-strong` | `rgba(0, 245, 155, 0.35)` | Bordi luminescenti o al focus |
| `--vs-text-primary` | `#F8FAFC` | Testo primario bianco nitido |
| `--vs-text-secondary` | `#94A3B8` | Testo secondario slate chiaro |
| `--vs-text-tertiary` | `#64748B` | Didascalie, date e label attenuate |

#### Colori Accento
* **Electric Volt Green** (`#00F59B` / `#10B981`): Azione primaria ("Ci sono" / "RSVP Yes"), presenze, indicatori positivi.
* **Hot Coral Red** (`#FF4757` / `#EF4444`): Assenza gara, multe aperte, cartellino rosso.
* **Championship Amber** (`#FFA502` / `#F59E0B`): Stato in dubbio, pre-partita imminente, cartellino giallo.
* **Sweet Pastry Pink** (`#FF4D94` / `#EC4899`): Tradizione delle paste e penalità goliardiche.
* **Azure Cyan** (`#0066FF` / `#38BDF8`): Ruoli tattici, allenamenti e notifiche di sistema.

---

## 3. Componenti Chiave (Variante B)

### 3.1 Pulsante "RSVP Yes" (Volt Dominant)
Un pulsante ad alta energia visiva:
- Sfondo: `bg-[#00F59B]`
- Testo: `text-[#070B12]` font-black uppercase tracking-wider
- Hover: `hover:bg-[#22FFAB] hover:shadow-[0_0_20px_rgba(0,245,155,0.4)]`
- Active: `active:scale-95`

### 3.2 Prossimo Evento (Hero Card)
- Card scura `#0F1726` con bagliore radiale d'accento verde/azzurro nell'angolo in alto a destra.
- Countdown con pill scura e icona fiamma/tempo (`0:20`, `Tra 2 giorni`).
- Sezione Roster con micro-grafico delle presenze e barra quorum neon verde.

### 3.3 Metric Widgets (Telemetry Style)
- **Tax / Cassa**: Icona Euro ambrata, importo in bianco bold, badge pill "Da Saldare" (rosso neon) o "In Regola" (verde neon).
- **Paste**: Icona pasticcino rosa con glow blur delicato, conteggio vassoi.
- **Presenze**: Percentuale con micro-barre verticali neon green stile frequenzimetro o grafico ad istogramma.

---

## 4. Linee Guida di Accessibilità e Micro-Animazioni
- Contrasto testo/sfondo certificato WCAG AA (minimo 7:1 per testo bianco su `#070B12`).
- Supporto a `prefers-reduced-motion` per rimuovere i bagliori pulsanti e le transizioni estese.
