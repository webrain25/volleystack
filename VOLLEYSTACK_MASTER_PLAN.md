# VolleyStack — Master Plan di Progetto

> **Documento di riferimento tecnico, funzionale e operativo**
>
> Obiettivo: progettare, sviluppare, testare e pubblicare **VolleyStack**, una webapp/PWA per la gestione completa di una squadra di pallavolo amatoriale.
>
> Stato documento: **v0.1 — Project Blueprint**
>
> Nome progetto: **VolleyStack**

---

# 0. Visione del prodotto

VolleyStack deve essere il punto unico in cui una squadra di pallavolo gestisce:

- giocatori;
- ruoli;
- allenamenti;
- partite;
- tornei;
- disponibilità;
- presenze;
- convocazioni;
- ritardi;
- compiti;
- multe / "tax";
- pagamenti;
- cassa squadra;
- paste / compleanni / cappellate;
- risultati;
- MVP;
- statistiche;
- annunci;
- passaggi auto;
- cronologia della stagione;
- premi e classifiche interne.

L'app deve essere pensata **mobile-first**, perché l'utilizzo principale sarà da smartphone.

Non deve cercare di sostituire WhatsApp come chat generale.

Deve invece sostituire:

- fogli Excel;
- messaggi sparsi;
- sondaggi WhatsApp;
- note manuali;
- liste presenze;
- contabilità informale;
- promemoria "chi deve portare cosa";
- classifiche fatte a mano.

---

# 1. Obiettivi principali

## 1.1 Obiettivi V1

La prima versione utilizzabile deve permettere di:

- [ ] creare un account;
- [ ] creare una squadra;
- [ ] entrare in una squadra tramite codice/invito;
- [ ] gestire i membri;
- [ ] definire ruoli e permessi;
- [ ] creare allenamenti;
- [ ] creare eventi;
- [ ] registrare disponibilità;
- [ ] registrare presenze effettive;
- [ ] visualizzare calendario;
- [ ] creare e assegnare Tax;
- [ ] registrare pagamenti Tax;
- [ ] creare e assegnare Paste;
- [ ] segnare Paste consegnate;
- [ ] visualizzare dashboard squadra;
- [ ] visualizzare profilo giocatore;
- [ ] avere storico attività;
- [ ] avere una UI mobile installabile come PWA.

## 1.2 Obiettivi V1.5

- [ ] cassa squadra;
- [ ] entrate/uscite;
- [ ] compiti;
- [ ] annunci;
- [ ] promemoria;
- [ ] ricorrenze allenamenti;
- [ ] statistiche base;
- [ ] esportazione CSV;
- [ ] backup;
- [ ] log amministrativo.

## 1.3 Obiettivi V2

- [ ] partite complete;
- [ ] convocazioni;
- [ ] risultati;
- [ ] set;
- [ ] MVP;
- [ ] Tax of the Match;
- [ ] formazione;
- [ ] rotazioni;
- [ ] car pooling;
- [ ] awards mensili;
- [ ] notifiche push;
- [ ] calendario esterno;
- [ ] import/export.

## 1.4 Obiettivi futuri

- [ ] multi-club;
- [ ] più squadre per società;
- [ ] dashboard coach;
- [ ] statistiche tecniche;
- [ ] scouting;
- [ ] sponsor;
- [ ] public team page;
- [ ] app native;
- [ ] monetizzazione opzionale.

---

# 2. Principi progettuali

VolleyStack deve rispettare questi principi:

1. **Mobile-first**
2. **Semplice**
3. **Veloce**
4. **Zero complessità inutile**
5. **Nessun microservizio in V1**
6. **Database relazionale**
7. **Self-hostable**
8. **Docker-first**
9. **Portabile tra provider**
10. **Nessun lock-in forte**
11. **PWA installabile**
12. **Privacy by design**
13. **Multi-team ready**
14. **Ruoli chiari**
15. **Audit delle operazioni sensibili**
16. **UI ironica ma non infantile**
17. **La parte "Tax/Paste" deve essere divertente**
18. **Le funzioni organizzative devono essere serie**

---

# 3. Stack tecnologico

## 3.1 Frontend

- React
- TypeScript
- Vite
- React Router
- Tailwind CSS
- TanStack Query
- React Hook Form
- Zod
- date-fns
- Lucide Icons
- PWA plugin per Vite

## 3.2 Backend

- Node.js
- TypeScript
- Fastify
- Zod
- JWT/session-based auth
- bcrypt/argon2 per password
- REST API

## 3.3 Database

- PostgreSQL

## 3.4 ORM

Scelta primaria:

- Prisma

Alternativa:

- Drizzle ORM

Decisione iniziale:

- [ ] confermare Prisma

## 3.5 DevOps

- Docker
- Docker Compose
- GitHub
- GitHub Actions
- `.env`
- migration DB
- backup PostgreSQL

## 3.6 Reverse proxy

Produzione:

- Caddy oppure Nginx

Preferenza:

- Caddy per HTTPS automatico e configurazione semplice.

---

# 4. Architettura

```text
┌───────────────────────────────┐
│          Smartphone           │
│ Browser / PWA                 │
└───────────────┬───────────────┘
                │ HTTPS
                ▼
┌───────────────────────────────┐
│         Reverse Proxy         │
│        Caddy / Nginx          │
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│       VolleyStack App         │
│                               │
│ React frontend                │
│ Node/Fastify backend          │
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│         PostgreSQL            │
│ Persistent volume             │
└───────────────────────────────┘
```

---

# 5. Struttura repository

```text
volleystack/
│
├── apps/
│   ├── web/
│   │   ├── src/
│   │   ├── public/
│   │   ├── vite.config.ts
│   │   └── package.json
│   │
│   └── api/
│       ├── src/
│       ├── tests/
│       └── package.json
│
├── packages/
│   ├── shared/
│   ├── types/
│   └── config/
│
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
│
├── docker/
│
├── scripts/
│
├── docs/
│
├── .github/
│   └── workflows/
│
├── docker-compose.yml
├── docker-compose.prod.yml
├── .env.example
├── .gitignore
├── README.md
└── package.json
```

---

# 6. Ambienti

## 6.1 Local development

- `localhost`
- PostgreSQL in Docker
- backend in Docker oppure hot reload locale
- frontend in Vite dev server
- seed demo

## 6.2 Test

- database dedicato
- dati sintetici
- test automatici

## 6.3 Production

- Docker Compose
- volume PostgreSQL persistente
- HTTPS
- backup
- logging
- variabili ambiente separate

---

# 7. Docker

## 7.1 Container minimi

- `web`
- `api`
- `postgres`

Produzione opzionale:

- `caddy`

## 7.2 Volumi

- PostgreSQL data
- backup
- eventuali upload

## 7.3 Network

Network privata:

```text
volleystack_network
```

## 7.4 Health checks

Aggiungere health check per:

- API;
- PostgreSQL;
- frontend/reverse proxy.

---

# 8. Modello multi-team

Ogni utente può appartenere a più squadre.

Esempio:

```text
Luca
├── Volley Roma
├── Beach Crew
└── Torneo Aziendale
```

Ogni entità di squadra deve avere:

```text
team_id
```

Tutte le query devono rispettare il perimetro squadra.

---

# 9. Ruoli

## 9.1 Owner

Può:

- eliminare squadra;
- trasferire ownership;
- configurare squadra;
- gestire ruoli;
- amministrare tutto.

## 9.2 Admin

Può:

- creare eventi;
- gestire giocatori;
- assegnare Tax;
- registrare pagamenti;
- assegnare Paste;
- modificare presenze;
- gestire cassa;
- creare annunci.

## 9.3 Coach

Può:

- gestire allenamenti;
- creare partite;
- convocare;
- registrare presenze;
- gestire lineup;
- consultare statistiche.

## 9.4 Treasurer

Può:

- gestire Tax;
- pagamenti;
- cassa;
- esportazioni contabili.

## 9.5 Player

Può:

- rispondere agli eventi;
- vedere squadra;
- vedere proprie Tax;
- vedere proprie Paste;
- votare MVP;
- consultare statistiche consentite.

## 9.6 Guest

Possibile in futuro.

---

# 10. Database — entità principali

## 10.1 users

Campi:

- id
- email
- password_hash
- first_name
- last_name
- nickname
- avatar_url
- phone_optional
- timezone
- locale
- created_at
- updated_at
- last_login_at
- is_active

---

## 10.2 teams

Campi:

- id
- name
- slug
- logo_url
- description
- city
- season_name
- created_by
- created_at
- updated_at
- archived_at

---

## 10.3 team_members

Campi:

- id
- team_id
- user_id
- role
- jersey_number
- volleyball_role
- secondary_role
- status
- joined_at
- left_at

Vincolo:

```text
UNIQUE(team_id, user_id)
```

---

# 11. Inviti squadra

Tabella:

## team_invites

Campi:

- id
- team_id
- code
- email_optional
- role
- expires_at
- max_uses
- uses
- created_by
- created_at
- revoked_at

Funzioni:

- [ ] link invito;
- [ ] codice breve;
- [ ] QR;
- [ ] scadenza;
- [ ] revoca;
- [ ] limite utilizzi.

---

# 12. Eventi

Tabella:

## events

Tipologie:

- TRAINING
- MATCH
- TOURNAMENT
- DINNER
- MEETING
- BEACH_VOLLEY
- PARTY
- OTHER

Campi:

- id
- team_id
- type
- title
- description
- start_at
- end_at
- meeting_at
- location_name
- location_address
- latitude_optional
- longitude_optional
- response_deadline
- max_participants
- created_by
- created_at
- updated_at
- cancelled_at

---

# 13. Eventi ricorrenti

Tabella opzionale:

## event_recurrence

Campi:

- event_id
- frequency
- interval
- weekday
- until_date

Esempio:

```text
Ogni lunedì alle 20:30
Ogni mercoledì alle 20:30
```

V1 può generare materialmente gli eventi futuri.

---

# 14. Disponibilità evento

Tabella:

## event_responses

Stati:

- YES
- NO
- MAYBE
- NO_RESPONSE

Campi:

- id
- event_id
- team_member_id
- response
- note
- responded_at
- updated_at

Esempio nota:

```text
"Arrivo 15 minuti dopo"
```

---

# 15. Presenze reali

Separare disponibilità da presenza effettiva.

Tabella:

## attendance

Campi:

- id
- event_id
- team_member_id
- status
- arrival_time
- minutes_late
- note
- recorded_by
- created_at
- updated_at

Stati:

- PRESENT
- ABSENT
- LATE
- EXCUSED
- INJURED
- OTHER

---

# 16. Modulo Tax

## 16.1 fine_types

Campi:

- id
- team_id
- name
- description
- category
- default_amount
- min_amount_optional
- max_amount_optional
- emoji
- active
- created_by
- created_at

Categorie:

- TRAINING
- MATCH
- DISCIPLINE
- LOCKER_ROOM
- LATENESS
- EQUIPMENT
- FUN
- OTHER

---

## 16.2 fines

Campi:

- id
- team_id
- team_member_id
- fine_type_id
- event_id_optional
- match_id_optional
- amount
- reason
- note
- issued_by
- issued_at
- status
- voided_at
- voided_by

Stati:

- OPEN
- PARTIALLY_PAID
- PAID
- VOID

---

# 17. Pagamenti Tax

Tabella:

## fine_payments

Campi:

- id
- team_id
- team_member_id
- amount
- payment_method
- note
- recorded_by
- paid_at
- created_at

Metodi:

- CASH
- BANK_TRANSFER
- PAYPAL
- OTHER

---

# 18. Calcolo saldo Tax

Non salvare direttamente il saldo.

Calcolare:

```text
Tax emesse
-
pagamenti
=
saldo
```

Vantaggio:

- evita inconsistenze;
- audit completo;
- storico sempre ricostruibile.

---

# 19. Modulo Paste

## 19.1 pastry_types

Campi:

- id
- team_id
- name
- description
- emoji
- default_quantity
- active

Esempi:

- Birthday
- New Car
- New House
- Wedding
- Epic Fail
- Team Achievement
- Other

---

## 19.2 pastry_obligations

Campi:

- id
- team_id
- team_member_id
- pastry_type_id
- event_id_optional
- title
- reason
- quantity
- due_date
- note
- assigned_by
- assigned_at
- delivered_at
- status

Stati:

- PENDING
- DELIVERED
- CANCELLED

---

# 20. Dashboard Home

La dashboard deve mostrare:

## Area 1 — Prossimo evento

- tipo;
- data;
- ora;
- luogo;
- risposta utente;
- numero presenti;
- pulsanti:
  - Ci sono
  - Non ci sono
  - Forse

## Area 2 — Le mie Tax

- saldo;
- numero Tax aperte;
- link dettaglio.

## Area 3 — Le mie Paste

- pendenze;
- prossima scadenza.

## Area 4 — Team feed

- nuove Tax;
- annunci;
- MVP;
- compleanni;
- risultati.

## Area 5 — Classifica Tax

Top 3.

---

# 21. Navigazione mobile

Bottom navigation consigliata:

```text
Home
Calendar
Tax
Team
More
```

Dentro `More`:

- Paste
- Cash
- Stats
- Tasks
- Settings

Alternativa:

```text
Home
Events
Tax
Paste
Team
```

Decisione UX da validare.

---

# 22. Calendario

Visualizzazioni:

- agenda;
- settimana;
- mese.

Filtri:

- allenamenti;
- partite;
- eventi sociali;
- tornei.

Azioni:

- crea;
- modifica;
- cancella;
- duplica;
- ricorrenza.

---

# 23. Squadra

Pagina roster.

Visualizzare:

- avatar;
- nickname;
- numero;
- ruolo;
- stato;
- presenza stagione;
- Tax;
- Paste.

Filtri:

- ruolo;
- attivo/non attivo.

---

# 24. Profilo giocatore

Informazioni:

- foto;
- nome;
- nickname;
- numero;
- ruolo;
- secondo ruolo;
- data ingresso squadra;
- presenze;
- assenze;
- ritardi;
- Tax stagione;
- Paste;
- MVP;
- storico attività.

Privacy:

alcuni dati visibili solo a admin.

---

# 25. Modulo Partite

Tabella:

## matches

Campi:

- id
- team_id
- event_id
- opponent
- competition
- venue_type
- status
- result_home
- result_away
- notes
- created_at

Venue:

- HOME
- AWAY
- NEUTRAL

Status:

- SCHEDULED
- LIVE
- COMPLETED
- CANCELLED

---

# 26. Set

Tabella:

## match_sets

Campi:

- id
- match_id
- set_number
- team_score
- opponent_score

Validazioni:

- set normali;
- tie-break;
- risultato coerente.

---

# 27. Convocazioni

Tabella:

## match_callups

Campi:

- match_id
- team_member_id
- status
- note
- called_by
- called_at

Stati:

- CALLED
- CONFIRMED
- DECLINED
- RESERVE

---

# 28. MVP

Tabella:

## mvp_votes

Campi:

- match_id
- voter_member_id
- candidate_member_id
- created_at

Vincoli:

- un voto per giocatore;
- voto non modificabile dopo chiusura opzionale;
- possibile divieto auto-voto.

---

# 29. Tax of the Match

Tabella:

## funny_votes

Tipologie:

- MVP
- TAX_PLAYER
- FUNNY_MOMENT

Il voto non deve creare automaticamente una multa monetaria.

Un admin deve confermare.

---

# 30. Lineup V2

Tabella:

## lineups

Campi:

- id
- match_id
- set_number
- rotation
- created_by

## lineup_players

- lineup_id
- position
- team_member_id

Posizioni:

- P1
- P2
- P3
- P4
- P5
- P6
- LIBERO

---

# 31. Compiti

Tabella:

## tasks

Campi:

- id
- team_id
- event_id_optional
- title
- description
- due_at
- status
- created_by

## task_assignments

Campi:

- task_id
- team_member_id
- completed_at

Esempi:

- palloni;
- maglie;
- chiavi;
- referto;
- acqua;
- paste.

---

# 32. Annunci

Tabella:

## announcements

Campi:

- id
- team_id
- title
- body
- priority
- created_by
- created_at
- expires_at

Priority:

- NORMAL
- IMPORTANT
- URGENT

---

# 33. Conferme lettura

Tabella:

## announcement_reads

Campi:

- announcement_id
- team_member_id
- read_at

Admin può vedere:

```text
Letto da 11/15
```

---

# 34. Cassa squadra

Tabella:

## cash_transactions

Campi:

- id
- team_id
- type
- category
- amount
- description
- related_fine_payment_id_optional
- created_by
- transaction_date
- created_at

Type:

- INCOME
- EXPENSE

Categorie:

- TAX
- TEAM_FEE
- SPONSOR
- EQUIPMENT
- DINNER
- TOURNAMENT
- OTHER

---

# 35. Saldo cassa

Calcolo:

```text
SUM(INCOME) - SUM(EXPENSE)
```

Non salvare saldo diretto.

---

# 36. Car pooling V2

## rides

Campi:

- id
- event_id
- driver_member_id
- departure_area
- departure_time
- seats_total
- seats_available
- note

## ride_passengers

- ride_id
- team_member_id
- status

---

# 37. Feed attività

Tabella generica opzionale:

## activity_log

Campi:

- id
- team_id
- actor_user_id
- type
- entity_type
- entity_id
- metadata_json
- created_at

Esempi:

- Tax assegnata;
- pagamento;
- evento creato;
- MVP;
- Paste consegnate.

---

# 38. Audit log

Per azioni sensibili:

## audit_logs

Campi:

- id
- team_id
- user_id
- action
- entity_type
- entity_id
- previous_value_json
- new_value_json
- ip_optional
- created_at

Audit per:

- ruoli;
- pagamenti;
- Tax annullate;
- cassa;
- eliminazioni.

---

# 39. Statistiche

## Presenze

- totale eventi;
- presenti;
- assenti;
- ritardi;
- percentuale presenza.

## Tax

- totale giocatore;
- media;
- top Taxpayer;
- categorie più frequenti.

## Paste

- totali;
- consegnate;
- pendenti;
- motivo più frequente.

## Match

- vinte;
- perse;
- set vinti;
- set persi.

---

# 40. Awards

Esempi:

- Minister of Finance
- Taxpayer of the Month
- Pastry King
- Attendance King
- Late King
- MVP of the Month
- Saint of the Month

Regole configurabili.

---

# 41. Autenticazione

## V1

- email;
- password;
- verifica email opzionale.

## Sicurezza

- password hash;
- rate limiting;
- token expiration;
- refresh token;
- logout;
- session invalidation.

## V2

- magic link;
- Google login;
- Apple login.

---

# 42. Authorization

Ogni endpoint deve verificare:

1. utente autenticato;
2. appartenenza al team;
3. ruolo;
4. permesso sull'azione.

Mai fidarsi del `team_id` inviato dal frontend.

---

# 43. API REST

Prefisso:

```text
/api/v1
```

---

# 44. API Auth

```text
POST /auth/register
POST /auth/login
POST /auth/logout
POST /auth/refresh
GET  /auth/me
```

---

# 45. API Teams

```text
GET    /teams
POST   /teams
GET    /teams/:teamId
PATCH  /teams/:teamId
DELETE /teams/:teamId
```

---

# 46. API Members

```text
GET    /teams/:teamId/members
POST   /teams/:teamId/members
GET    /teams/:teamId/members/:memberId
PATCH  /teams/:teamId/members/:memberId
DELETE /teams/:teamId/members/:memberId
```

---

# 47. API Invites

```text
POST   /teams/:teamId/invites
GET    /teams/:teamId/invites
DELETE /teams/:teamId/invites/:inviteId
POST   /invites/:code/join
```

---

# 48. API Events

```text
GET    /teams/:teamId/events
POST   /teams/:teamId/events
GET    /teams/:teamId/events/:eventId
PATCH  /teams/:teamId/events/:eventId
DELETE /teams/:teamId/events/:eventId
```

---

# 49. API Responses

```text
PUT /events/:eventId/response
GET /events/:eventId/responses
```

---

# 50. API Attendance

```text
GET /events/:eventId/attendance
PUT /events/:eventId/attendance/:memberId
```

---

# 51. API Tax

```text
GET    /teams/:teamId/fines
POST   /teams/:teamId/fines
GET    /teams/:teamId/fines/:fineId
PATCH  /teams/:teamId/fines/:fineId
DELETE /teams/:teamId/fines/:fineId
```

---

# 52. API Fine Types

```text
GET    /teams/:teamId/fine-types
POST   /teams/:teamId/fine-types
PATCH  /teams/:teamId/fine-types/:id
DELETE /teams/:teamId/fine-types/:id
```

---

# 53. API Payments

```text
GET  /teams/:teamId/payments
POST /teams/:teamId/payments
```

---

# 54. API Paste

```text
GET   /teams/:teamId/pastries
POST  /teams/:teamId/pastries
PATCH /teams/:teamId/pastries/:id
```

---

# 55. API Cash

```text
GET  /teams/:teamId/cash
POST /teams/:teamId/cash
GET  /teams/:teamId/cash/summary
```

---

# 56. API Stats

```text
GET /teams/:teamId/stats
GET /teams/:teamId/stats/attendance
GET /teams/:teamId/stats/fines
GET /teams/:teamId/stats/pastries
```

---

# 57. Error handling API

Formato uniforme:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request",
    "details": []
  }
}
```

---

# 58. Pagination

Liste:

```text
?page=1
&limit=20
```

Oppure cursor pagination in futuro.

---

# 59. Filtering

Esempio:

```text
/events?type=TRAINING
/fines?status=OPEN
/fines?memberId=...
```

---

# 60. Sorting

Esempio:

```text
?sort=createdAt
&order=desc
```

---

# 61. UI — schermate V1

- Splash
- Login
- Register
- Create Team
- Join Team
- Team selector
- Home
- Calendar
- Event detail
- Create event
- Attendance
- Tax list
- New Tax
- Tax detail
- Payments
- Paste list
- New Paste
- Team roster
- Player profile
- Settings
- Admin settings

---

# 62. UI — Empty states

Ogni schermata deve avere empty state.

Esempi:

```text
Nessuna Tax 🎉
Per ora la tua fedina fiscale è pulita.
```

```text
Nessuna Paste pendente.
La pasticceria può riposare.
```

---

# 63. UI — Loading states

Usare:

- skeleton;
- spinner solo per azioni brevi;
- optimistic update dove sicuro.

---

# 64. UI — Error states

Mostrare errori leggibili.

Esempio:

```text
Non siamo riusciti a salvare la risposta.
Riprova.
```

Non mostrare stack trace.

---

# 65. UI — Toast

Usare toast per:

- salvataggio;
- eliminazione;
- risposta evento;
- pagamento;
- Tax creata.

---

# 66. Design system

Definire:

- palette;
- typography;
- spacing;
- radius;
- shadows;
- buttons;
- cards;
- badges;
- inputs;
- dialog;
- dropdown;
- tabs;
- navbar.

---

# 67. Branding

Nome:

```text
VolleyStack
```

Logo:

- minimal;
- no clipart;
- no pallone 3D;
- preferire simbolo geometrico;
- possibile richiamo a stack/livelli/campo.

---

# 68. Tone of voice

Parte seria:

- chiara;
- asciutta;
- professionale.

Parte social:

- ironica;
- mai offensiva;
- personalizzabile.

---

# 69. PWA

Implementare:

- manifest;
- icon 192;
- icon 512;
- maskable icon;
- standalone display;
- theme color;
- splash behavior;
- service worker;
- offline shell.

---

# 70. Offline

V1:

- app shell disponibile;
- messaggio offline;
- cache read-only base.

V2:

- queue offline delle risposte;
- sync automatico.

---

# 71. Push notifications

V2.

Eventi notificabili:

- nuovo allenamento;
- reminder;
- convocazione;
- Tax;
- Paste;
- annuncio;
- cambio orario.

---

# 72. Email

V1 opzionale.

Email per:

- reset password;
- invito;
- verifica email.

---

# 73. Privacy

Implementare:

- privacy policy;
- termini;
- consenso necessario;
- esportazione dati utente;
- eliminazione account;
- eliminazione squadra;
- retention definita.

---

# 74. GDPR

Per utenti UE:

- minimizzazione dati;
- diritto cancellazione;
- diritto accesso;
- finalità dichiarate;
- basi giuridiche;
- registro consensi se necessario.

Non raccogliere dati inutili.

---

# 75. Sicurezza backend

Checklist:

- [ ] password hashing forte;
- [ ] JWT secret sicuro;
- [ ] HTTPS;
- [ ] rate limiting;
- [ ] CORS;
- [ ] secure headers;
- [ ] validation input;
- [ ] SQL injection mitigata ORM;
- [ ] authorization server-side;
- [ ] logging;
- [ ] secret fuori repository;
- [ ] backup;
- [ ] dependency updates.

---

# 76. Security headers

Configurare:

- Content-Security-Policy;
- X-Content-Type-Options;
- Referrer-Policy;
- Permissions-Policy;
- HSTS.

---

# 77. Rate limiting

Endpoint sensibili:

- login;
- register;
- reset password;
- invite join.

---

# 78. Upload immagini

V1:

- avatar;
- team logo.

Vincoli:

- JPEG/PNG/WebP;
- size limit;
- resize;
- filename random;
- sanitizzazione.

---

# 79. Storage

Possibilità:

- filesystem persistente;
- S3-compatible storage in futuro.

---

# 80. Logging

Log strutturati.

Campi:

- timestamp;
- level;
- request_id;
- user_id;
- team_id;
- endpoint;
- duration;
- status.

Non loggare password/token.

---

# 81. Monitoring

Minimo:

- health endpoint;
- container status;
- disk usage;
- DB backup status;
- error log.

---

# 82. Health endpoint

```text
GET /health
```

Risposta:

```json
{
  "status": "ok",
  "database": "ok"
}
```

---

# 83. Backup PostgreSQL

Automatizzare:

```bash
pg_dump
```

Politica suggerita:

- giornaliero;
- retention 7 giorni;
- settimanale;
- retention 4 settimane.

---

# 84. Restore test

Un backup non testato non è un backup.

Creare procedura documentata:

- creare DB vuoto;
- import dump;
- validare tabelle;
- validare record.

---

# 85. CI

GitHub Actions:

- install;
- lint;
- typecheck;
- unit test;
- build;
- integration test.

---

# 86. Branch strategy

Semplice:

```text
main
develop
feature/*
fix/*
```

Oppure trunk-based se lavoriamo in pochi.

---

# 87. Pull Request checklist

Ogni PR:

- [ ] build OK;
- [ ] test OK;
- [ ] lint OK;
- [ ] migration verificata;
- [ ] no secrets;
- [ ] screenshot UI se necessario;
- [ ] test manuale.

---

# 88. Coding standards

- TypeScript strict;
- ESLint;
- Prettier;
- naming coerente;
- no `any` salvo eccezioni;
- funzioni corte;
- business logic separata dai controller.

---

# 89. Testing

## Unit

- calcolo Tax;
- permissions;
- date;
- saldo;
- validazioni.

## Integration

- API;
- DB;
- auth.

## E2E

- registrazione;
- crea squadra;
- crea allenamento;
- rispondi;
- assegna Tax;
- paga Tax;
- assegna Paste.

---

# 90. Seed database

Creare dati demo:

Squadra:

```text
VolleyStack Demo
```

Giocatori:

- Cupi
- Adri
- Lova
- Romello
- Scavo
- Marga

Eventi:

- allenamento;
- partita;
- cena.

Tax:

- ritardo;
- pallone dimenticato;
- maglia dimenticata.

Paste:

- compleanno;
- cappellata.

---

# 91. UX onboarding

Step:

1. registrazione;
2. crea o entra;
3. inserisci nickname;
4. seleziona ruolo;
5. home.

Admin:

1. crea squadra;
2. nome;
3. stagione;
4. logo;
5. genera invito.

---

# 92. Team switching

Se utente ha più squadre:

menu:

```text
Volley Roma
Beach Team
Torneo
```

Il team selezionato diventa contesto globale.

---

# 93. Season management

Tabella:

## seasons

Campi:

- id
- team_id
- name
- start_date
- end_date
- active

Le statistiche devono essere filtrabili per stagione.

---

# 94. Archive

Non eliminare automaticamente dati storici.

Archiviare:

- stagioni;
- membri usciti;
- eventi passati.

---

# 95. Soft delete

Usare soft delete dove utile:

- team;
- fines;
- events;
- users.

---

# 96. Timezone

Salvare timestamp DB in UTC.

Visualizzare nella timezone utente/team.

Default:

```text
Europe/Rome
```

---

# 97. Localization

Preparare i18n.

Lingue iniziali:

- italiano.

Futuro:

- inglese.

Non hardcodare testi importanti nei componenti se possibile.

---

# 98. Accessibility

- contrasto;
- focus visibile;
- label input;
- aria;
- tap target grandi;
- navigazione tastiera.

---

# 99. Performance

Target:

- initial page fast;
- lazy route;
- bundle splitting;
- compressione immagini;
- query paginate;
- indexes DB.

---

# 100. Indici database

Indici minimi:

```text
team_id
user_id
event_id
member_id
created_at
status
start_at
```

Indici composti dove necessario.

---

# 101. Database constraints

Usare constraints per:

- amount >= 0;
- unique membership;
- one response per event/member;
- one attendance per event/member;
- one MVP vote per voter/match.

---

# 102. Transactions

Usare DB transaction per:

- pagamento + eventuale movimento cassa;
- cancellazione complessa;
- trasferimento ownership;
- operazioni multi-record.

---

# 103. Idempotenza

Per endpoint critici valutare idempotency key.

In particolare:

- pagamenti;
- import;
- notifiche.

---

# 104. Caching

V1:

- TanStack Query lato frontend.

Non serve Redis.

---

# 105. Redis

NON introdurre in V1.

Aggiungere solo se necessario.

---

# 106. Message queue

NON introdurre in V1.

---

# 107. Kubernetes

NON usare.

---

# 108. Microservizi

NON usare.

---

# 109. Analytics

Inizialmente:

- niente tracking invasivo.

Eventuale:

- analytics privacy-friendly.

Metriche utili:

- utenti attivi;
- eventi creati;
- RSVP;
- Tax;
- crash.

---

# 110. Feature flags

Possibile semplice tabella/config.

Esempio:

```text
ENABLE_MATCHES
ENABLE_CASH
ENABLE_MVP
```

---

# 111. Configurazione squadra

Settings:

- nome;
- logo;
- stagione;
- valuta;
- timezone;
- lingua;
- Tax abilitate;
- Paste abilitate;
- Cash abilitata;
- MVP abilitato.

---

# 112. Valuta

Default:

```text
EUR
```

Usare integer cents.

Esempio:

```text
2,50 € = 250
```

Mai float per denaro.

---

# 113. Date

API:

ISO 8601.

Esempio:

```text
2026-09-23T20:30:00Z
```

---

# 114. Criteri V1 pronta

VolleyStack V1 è pronta quando:

- [ ] utente può registrarsi;
- [ ] login funziona;
- [ ] team creation funziona;
- [ ] invito funziona;
- [ ] roster funziona;
- [ ] eventi funzionano;
- [ ] RSVP funziona;
- [ ] attendance funziona;
- [ ] Tax funzionano;
- [ ] pagamenti funzionano;
- [ ] Paste funzionano;
- [ ] dashboard funziona;
- [ ] PWA installabile;
- [ ] responsive;
- [ ] auth sicura;
- [ ] backup esiste;
- [ ] test principali passano;
- [ ] deploy riproducibile.

---

# 115. Fasi di sviluppo

## Fase 0 — Setup

- [ ] repository;
- [ ] monorepo;
- [ ] TypeScript;
- [ ] Docker Compose;
- [ ] Postgres;
- [ ] Prisma;
- [ ] lint;
- [ ] prettier;
- [ ] env;
- [ ] CI.

---

## Fase 1 — Database

- [ ] schema users;
- [ ] teams;
- [ ] team_members;
- [ ] invites;
- [ ] seasons;
- [ ] migrations;
- [ ] seed.

---

## Fase 2 — Auth

- [ ] register;
- [ ] login;
- [ ] logout;
- [ ] refresh/session;
- [ ] middleware auth;
- [ ] permissions.

---

## Fase 3 — Team

- [ ] create team;
- [ ] join;
- [ ] invite;
- [ ] roster;
- [ ] member edit;
- [ ] role permissions.

---

## Fase 4 — Frontend skeleton

- [ ] router;
- [ ] layout;
- [ ] bottom nav;
- [ ] auth pages;
- [ ] team selector;
- [ ] dashboard shell;
- [ ] design system.

---

## Fase 5 — Events

- [ ] schema events;
- [ ] event CRUD;
- [ ] calendar;
- [ ] detail;
- [ ] RSVP;
- [ ] attendance;
- [ ] late tracking.

---

## Fase 6 — Tax

- [ ] fine types;
- [ ] fines;
- [ ] new fine;
- [ ] fine list;
- [ ] player balance;
- [ ] payment;
- [ ] leaderboard.

---

## Fase 7 — Paste

- [ ] types;
- [ ] obligation;
- [ ] due date;
- [ ] delivered;
- [ ] history;
- [ ] leaderboard.

---

## Fase 8 — Dashboard

- [ ] next event;
- [ ] RSVP;
- [ ] personal Tax;
- [ ] Paste;
- [ ] leaderboard;
- [ ] feed.

---

## Fase 9 — PWA

- [ ] manifest;
- [ ] icons;
- [ ] service worker;
- [ ] installability;
- [ ] offline page.

---

## Fase 10 — Hardening

- [ ] authorization review;
- [ ] validation;
- [ ] rate limit;
- [ ] CSP;
- [ ] logging;
- [ ] backup;
- [ ] tests.

---

## Fase 11 — Deploy beta

- [ ] scegliere provider;
- [ ] DNS;
- [ ] HTTPS;
- [ ] env production;
- [ ] DB volume;
- [ ] backup;
- [ ] smoke test.

---

# 116. V1.5

Dopo beta:

- [ ] cassa;
- [ ] task;
- [ ] annunci;
- [ ] recurring events;
- [ ] export CSV;
- [ ] stats;
- [ ] awards.

---

# 117. V2

- [ ] matches;
- [ ] sets;
- [ ] callups;
- [ ] MVP;
- [ ] lineup;
- [ ] car pooling;
- [ ] push;
- [ ] calendar sync.

---

# 118. Roadmap indicativa

Ordine:

```text
Foundation
↓
Auth
↓
Team
↓
Events
↓
Attendance
↓
Tax
↓
Paste
↓
Dashboard
↓
PWA
↓
Beta
↓
Cash
↓
Matches
↓
Stats
```

---

# 119. Deployment gratuito — criteri

Il provider deve supportare:

- Docker oppure Node;
- HTTPS;
- database persistente;
- restart;
- env secrets;
- backup;
- costo controllabile.

Evitare dipendenza totale da un provider.

---

# 120. Self-hosting

Grazie a Docker:

```text
git clone
cp .env.example .env
docker compose up -d
```

Deve essere sufficiente per avviare il progetto.

---

# 121. README obbligatorio

README deve contenere:

- cos'è VolleyStack;
- screenshot;
- requirements;
- setup;
- env;
- Docker;
- migrations;
- seed;
- test;
- deploy;
- backup;
- restore.

---

# 122. Documentazione

Cartella:

```text
/docs
```

File:

```text
ARCHITECTURE.md
DATABASE.md
API.md
SECURITY.md
DEPLOYMENT.md
BACKUP.md
CONTRIBUTING.md
```

---

# 123. Environment variables

Esempio:

```env
NODE_ENV=development
DATABASE_URL=
JWT_SECRET=
JWT_REFRESH_SECRET=
APP_URL=
API_URL=
UPLOAD_DIR=
```

Mai committare `.env`.

---

# 124. Secrets

Generare chiavi forti.

Non usare:

```text
password123
secret
volleystack
```

---

# 125. Database migration workflow

Ogni modifica:

1. modificare schema;
2. creare migration;
3. test locale;
4. commit migration;
5. backup production;
6. deploy;
7. migrate.

---

# 126. Demo mode

Creare account demo opzionale.

Permette di mostrare app senza dati reali.

---

# 127. Import CSV

V1.5.

Possibili import:

- roster;
- Tax;
- presenze.

---

# 128. Export CSV

Esportare:

- presenze;
- Tax;
- pagamenti;
- cassa;
- roster.

---

# 129. Data ownership

Ogni team possiede i propri dati organizzativi.

Owner può esportare.

Utente può esportare i propri dati personali.

---

# 130. Delete account

Gestire caso utente appartenente a team.

Non cancellare automaticamente dati storici necessari.

Possibile anonimizzazione.

---

# 131. Delete team

Richiedere:

- owner;
- conferma forte;
- eventuale re-login;
- periodo grace opzionale.

---

# 132. Notification center

V2:

- nuove Tax;
- eventi;
- inviti;
- Paste;
- risultati.

---

# 133. Search

V2:

ricerca:

- membri;
- eventi;
- Tax.

---

# 134. Filters

Persistenza filtri lato client.

---

# 135. Dark mode

Non prioritaria.

Possibile V1.5.

---

# 136. Responsive breakpoints

Ottimizzare:

- 360px;
- 390px;
- 430px;
- tablet;
- desktop.

---

# 137. Browser target

Supportare:

- Chrome;
- Safari iOS;
- Firefox;
- Edge.

---

# 138. Mobile interaction

Regole:

- CTA grandi;
- evitare hover-only;
- bottom sheets utili;
- input numerici corretti;
- date picker mobile-friendly.

---

# 139. Conferme destructive

Richiedere conferma per:

- eliminazione evento;
- void Tax;
- cancellazione pagamento;
- rimozione membro;
- eliminazione squadra.

---

# 140. Undo

Dove possibile:

- toast undo;
- soft delete.

---

# 141. Business rule Tax

Possibili regole:

- Tax manuale;
- Tax fissa;
- Tax variabile;
- Tax legata a ritardo.

V2:

```text
0,50 € ogni 5 min
```

---

# 142. Auto Tax

NON attivare in V1.

Possibile V2:

- suggerire Tax;
- admin conferma.

Mai applicare automaticamente denaro senza conferma.

---

# 143. Birthday

Possibile campo:

```text
birth_date
```

Privacy configurable.

Sistema può suggerire:

```text
Compleanno → Paste
```

Admin conferma.

---

# 144. Paste reminder

Reminder:

- 24h prima;
- giorno evento.

---

# 145. Attendance reminder

Se non risposto:

- notifica;
- badge dashboard.

---

# 146. Leaderboard privacy

Team può scegliere:

- visibile a tutti;
- solo admin;
- disabilitato.

---

# 147. Fun mode

Team setting:

```text
fun_features_enabled
```

Disattiva:

- awards;
- funny copy;
- leaderboard.

---

# 148. Team theme

Futuro:

- team colors;
- logo;
- accent color.

---

# 149. App icon

Produrre:

- SVG;
- PNG 512;
- PNG 192;
- maskable;
- favicon.

---

# 150. Launch checklist

Prima di invitare squadra reale:

- [ ] HTTPS;
- [ ] backup;
- [ ] privacy;
- [ ] admin account;
- [ ] seed rimosso;
- [ ] log controllati;
- [ ] reset password;
- [ ] mobile tested;
- [ ] iPhone tested;
- [ ] Android tested;
- [ ] permissions tested;
- [ ] database backup tested.

---

# 151. Beta privata

Prima squadra:

- 10-20 utenti;
- 2 settimane;
- feedback.

Raccogliere:

- bug;
- schermate confuse;
- funzioni inutili;
- funzioni mancanti;
- performance;
- notifiche desiderate.

---

# 152. Feedback interno

Aggiungere in V1.5:

```text
Send feedback
```

Campi:

- categoria;
- messaggio;
- screenshot opzionale.

---

# 153. Definition of Done

Una feature è Done quando:

- implementata;
- validata;
- autorizzata;
- testata;
- responsive;
- error state;
- loading state;
- empty state;
- documentata;
- senza errori console;
- migration inclusa se necessaria.

---

# 154. Prima milestone concreta

## Milestone 1 — Foundation

Deliverable:

```text
docker compose up
```

deve avviare:

- PostgreSQL;
- API;
- React.

La web deve mostrare:

```text
VolleyStack
Development environment ready
API: connected
Database: connected
```

---

# 155. Seconda milestone

## Milestone 2 — Authentication

Utente può:

- registrarsi;
- accedere;
- uscire;
- vedere `/me`.

---

# 156. Terza milestone

## Milestone 3 — Team

Utente può:

- creare squadra;
- invitare;
- entrare;
- vedere roster.

---

# 157. Quarta milestone

## Milestone 4 — Training workflow

Flusso completo:

```text
Admin crea allenamento
↓
Giocatore vede evento
↓
Giocatore risponde
↓
Admin vede risposte
↓
Admin registra presenza
↓
Statistiche aggiornate
```

---

# 158. Quinta milestone

## Milestone 5 — Tax workflow

```text
Admin assegna Tax
↓
Giocatore riceve Tax
↓
Saldo aggiornato
↓
Pagamento registrato
↓
Saldo ricalcolato
```

---

# 159. Sesta milestone

## Milestone 6 — Paste workflow

```text
Admin assegna Paste
↓
Giocatore vede scadenza
↓
Dashboard mostra reminder
↓
Admin segna consegnata
↓
Storico aggiornato
```

---

# 160. Settima milestone

## Milestone 7 — Beta

Requisiti:

- URL pubblico;
- HTTPS;
- PWA;
- backup;
- 10+ utenti reali;
- nessun bug bloccante.

---

# 161. Cose da NON fare subito

Non implementare in V1:

- chat completa;
- pagamenti Stripe;
- scouting avanzato;
- AI;
- Kubernetes;
- microservizi;
- Redis;
- queue;
- app native;
- social feed complesso;
- streaming;
- live score;
- sponsor marketplace.

---

# 162. Decisioni ancora da prendere

- [ ] logo;
- [ ] palette;
- [ ] Prisma vs Drizzle;
- [ ] Caddy vs Nginx;
- [ ] provider hosting beta;
- [ ] email provider;
- [ ] dominio;
- [ ] policy retention;
- [ ] password reset provider;
- [ ] notifiche V2.

---

# 163. Priorità assolute

Ordine operativo consigliato:

1. repository;
2. Docker;
3. database;
4. auth;
5. team;
6. events;
7. RSVP;
8. attendance;
9. Tax;
10. Paste;
11. dashboard;
12. PWA;
13. test;
14. security;
15. deploy;
16. beta.

---

# 164. Risultato finale atteso

VolleyStack deve diventare una webapp/PWA in cui un giocatore apre il telefono e vede immediatamente:

```text
Prossimo allenamento
↓
Rispondi: sì/no/forse
↓
Tax aperte
↓
Paste pendenti
↓
Ultime attività
↓
Squadra
```

e un admin può gestire tutto senza Excel o messaggi sparsi.

---

# 165. Visione a lungo termine

VolleyStack non deve essere solamente:

```text
"un'app per le multe"
```

ma:

```text
"il sistema operativo della squadra di pallavolo"
```

La Tax e le Paste sono elementi distintivi.

Il valore principale deve rimanere:

```text
organizzare la squadra
+
ridurre il caos
+
mantenere la parte sociale
```

---

# 166. Prossimo task consigliato

Creare la base reale del progetto:

```text
volleystack/
├── apps/web
├── apps/api
├── prisma
├── docker-compose.yml
├── .env.example
└── README.md
```

Successivamente:

```text
docker compose up
```

e prima milestone funzionante.

---

# 167. Checklist ultra-operativa iniziale

## Giorno 1 — Repository

- [ ] creare repository `volleystack`;
- [ ] aggiungere README;
- [ ] aggiungere `.gitignore`;
- [ ] configurare package manager;
- [ ] creare monorepo;
- [ ] inizializzare frontend;
- [ ] inizializzare backend;
- [ ] inizializzare Prisma;
- [ ] creare docker-compose;
- [ ] avviare PostgreSQL;
- [ ] test connessione;
- [ ] commit `chore: initialize project`.

## Giorno 2 — Core database

- [ ] User;
- [ ] Team;
- [ ] TeamMember;
- [ ] TeamInvite;
- [ ] Season;
- [ ] migration;
- [ ] seed;
- [ ] test DB.

## Giorno 3 — Auth

- [ ] register;
- [ ] password hashing;
- [ ] login;
- [ ] session/token;
- [ ] logout;
- [ ] `/me`;
- [ ] middleware;
- [ ] auth UI.

## Giorno 4 — Team

- [ ] create team;
- [ ] team selector;
- [ ] invite;
- [ ] join;
- [ ] roster;
- [ ] roles.

## Giorno 5 — Events

- [ ] create;
- [ ] list;
- [ ] detail;
- [ ] edit;
- [ ] cancel;
- [ ] calendar.

## Giorno 6 — RSVP

- [ ] yes;
- [ ] no;
- [ ] maybe;
- [ ] note;
- [ ] admin summary.

## Giorno 7 — Attendance

- [ ] present;
- [ ] absent;
- [ ] late;
- [ ] minutes late;
- [ ] season stats.

## Giorno 8 — Tax

- [ ] fine types;
- [ ] fine;
- [ ] list;
- [ ] player balance;
- [ ] leaderboard.

## Giorno 9 — Payments

- [ ] register payment;
- [ ] transaction safety;
- [ ] balance update;
- [ ] history.

## Giorno 10 — Paste

- [ ] types;
- [ ] assign;
- [ ] deadline;
- [ ] deliver;
- [ ] history.

## Giorno 11 — Dashboard

- [ ] next event;
- [ ] RSVP;
- [ ] balance;
- [ ] Paste;
- [ ] leaderboard;
- [ ] activity.

## Giorno 12 — PWA

- [ ] manifest;
- [ ] icons;
- [ ] install;
- [ ] offline;
- [ ] mobile QA.

## Giorno 13 — Security

- [ ] auth review;
- [ ] permissions;
- [ ] rate limiting;
- [ ] headers;
- [ ] CORS;
- [ ] audit.

## Giorno 14 — Deploy

- [ ] provider;
- [ ] env;
- [ ] HTTPS;
- [ ] volume;
- [ ] backup;
- [ ] smoke tests.

---

# 168. Regola progettuale finale

Ogni nuova funzione deve rispondere a una delle domande:

1. Riduce un'attività che oggi facciamo manualmente?
2. Riduce messaggi ripetitivi?
3. Migliora organizzazione?
4. Migliora trasparenza?
5. Aggiunge valore sociale reale?

Se la risposta è sempre "no", la funzione non entra.

---

# 169. Stato iniziale

```text
Project: VolleyStack
Status: Planning
Architecture: Defined
Development: Not started
Database: Not created
Deployment: Not selected
V1 scope: Defined
```

---

# 170. Primo obiettivo operativo

**Portare VolleyStack da "documento" a "app avviabile in locale".**

Output richiesto:

```text
docker compose up
```

→ frontend raggiungibile;

→ API raggiungibile;

→ PostgreSQL connesso;

→ health check verde.

Quello sarà il vero punto di partenza dello sviluppo.

