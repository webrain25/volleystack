# VolleyStack — Product Context (PRODUCT.md)

## Product
VolleyStack è una piattaforma SaaS moderna e verticale per la gestione dello spogliatoio e delle squadre di pallavolo italiane (giovanili, serie minori, prime squadre e amatoriali).

## Target Users
- **Giocatori & Atleti**: Controllano orari allenamenti/partite, confermano presenza con RSVP a 1 tocco, verificano multe e debiti delle paste, leggono annunci.
- **Coach / Mister**: Pianificano sessioni, verificano presenze e convocati in tempo reale, generano discorsi motivazionali con Gemini AI.
- **Capitano & Vice-Capitano**: Gestiscono la disciplina e la bacheca annunci.
- **Tesoriere**: Registra multe da regolamento interno, verifica pagamenti in contanti o digitali (PayPal), tiene la cassa di squadra.

## Key Workflows
1. **Convocazioni & Presenze (RSVP)**: Notifica e conferma rapida per il prossimo evento con roster visibile.
2. **Cassa Multe & Regolamento (Tax)**: Monitoraggio delle infrazioni societarie (ritardi, maglie dimenticate, cartellini).
3. **Tradizione delle Paste**: Tracciamento goliardico delle penalità "pasticcini da portare allo spogliatoio".
4. **Bacheca & AI Assistant**: Annunci veloci, statistiche di presenza stagionale.

## Design Constraints
- Piattaforma: Web Responsive (Desktop + Mobile First).
- Zero-cost architecture: Neon Serverless PostgreSQL + Cloud Run + Cloudflare Pages.
- Massima chiarezza visiva e velocità a bordo campo.
- WCAG AA accessibility, zero regressioni funzionali.
