---
name: volley-premium-ui
description: Redesign UI/UX premium del gestionale spogliatoio volley. Usare per dashboard, giocatori, multe, presenze, calendario, pagamenti, responsive design e componenti condivisi.
---

# Volleyball Premium UI

## Obiettivo
Trasformare l'interfaccia esistente in un gestionale sportivo SaaS moderno, premium e professionale.

## Design direction
- Estetica Sports SaaS Premium, minimale e distintiva.
- Tipografia con gerarchia forte e leggibilità elevata.
- Palette coerente con il branding esistente.
- Spaziature sistematiche e griglie ben proporzionate.
- Icone coerenti, componenti riutilizzabili.
- Microinterazioni eleganti e funzionali.
- Mobile-first per le operazioni quotidiane dei giocatori.
- Dashboard desktop ottimizzate per la gestione.

## Workflow obbligatorio
1. Analizzare stack, routing, componenti e CSS esistenti.
2. Individuare problemi di UI, UX e accessibilità.
3. Usare ui-ux-pro-max per definire il design system.
4. Documentare token, componenti e scelte in DESIGN.md.
5. Proporre il redesign prima di modificare il codice.
6. Implementare una schermata alla volta.
7. Utilizzare Impeccable per critique, audit e polish.
8. Verificare desktop, tablet e mobile.
9. Eseguire build, lint e test disponibili.

## Flussi da ottimizzare, se presenti
- Dashboard generale dello spogliatoio.
- Gestione giocatori e ruoli.
- Registrazione multe e ritardi.
- Stato pagamenti e saldo della cassa.
- Calendario allenamenti e partite.
- Statistiche, classifiche e storico.

## Vincoli
- Non alterare la business logic.
- Non modificare API, database o autenticazione.
- Non modificare gli importi o le regole delle multe.
- Riutilizzare librerie e componenti già installati.
- Evitare dipendenze non necessarie.
- Non introdurre dati fittizi nelle schermate reali.
- Conservare la piena accessibilità da tastiera.

## Criteri di qualità
- Contrasto WCAG AA dove applicabile.
- Layout responsive senza overflow.
- Loading, empty, error e success states.
- Feedback immediato sulle azioni.
- Animazioni compatibili con reduced-motion.
- Nessuna regressione funzionale.
