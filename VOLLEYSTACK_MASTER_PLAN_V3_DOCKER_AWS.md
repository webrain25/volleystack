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


---

# 171. Metodo di sviluppo — User-Driven Software Engineering

VolleyStack deve essere sviluppato seguendo un processo **iterativo, user-centered e evidence-driven**.

L'ordine corretto non è:

```text
idea
↓
codice
↓
pubblicazione
```

ma:

```text
problema reale
↓
ricerca utenti
↓
requisiti
↓
user stories
↓
prioritizzazione
↓
prototipo
↓
test con utenti
↓
revisione
↓
implementazione
↓
test
↓
beta
↓
feedback
↓
iterazione
```

L'obiettivo è evitare di costruire funzionalità che sembrano utili ma che la squadra non userebbe davvero.

---

# 172. Principi User-Driven

Ogni decisione di prodotto deve essere collegata ad almeno uno dei seguenti elementi:

- bisogno espresso dagli utenti;
- problema osservato;
- comportamento ricorrente;
- inefficienza concreta;
- risultato di survey;
- risultato di usability test;
- dato raccolto durante la beta.

Ogni feature deve avere:

```text
Problem
↓
User Need
↓
Requirement
↓
User Story
↓
Acceptance Criteria
↓
Prototype
↓
Test
↓
Implementation
↓
Validation
```

---

# 173. Ciclo di sviluppo consigliato

Per ogni macro-funzionalità:

## Step 1 — Discover

Capire:

- chi usa la funzione;
- quale problema risolve;
- come viene risolto oggi;
- quanto frequentemente si verifica;
- quanto è fastidioso;
- quali workaround esistono.

## Step 2 — Define

Produrre:

- user need;
- functional requirement;
- non-functional requirement;
- user story;
- acceptance criteria.

## Step 3 — Design

Produrre:

- user flow;
- wireframe;
- mockup;
- prototipo interattivo.

## Step 4 — Test

Eseguire:

- task-based usability test;
- raccolta errori;
- misurazione tempo;
- questionario;
- intervista breve.

## Step 5 — Develop

Implementare solo dopo che il flusso principale è sufficientemente validato.

## Step 6 — Verify

Verificare tecnicamente:

- test;
- security;
- performance;
- acceptance criteria.

## Step 7 — Validate

Verificare con utenti reali che la feature risolva il problema previsto.

---

# 174. Stakeholder Analysis

Stakeholder principali:

## Player

Interessi:

- capire quando si gioca;
- rispondere velocemente;
- vedere i propri impegni;
- sapere eventuali Tax;
- sapere eventuali Paste;
- vedere informazioni della squadra.

## Coach

Interessi:

- sapere chi è disponibile;
- preparare allenamenti;
- convocare;
- controllare presenza;
- ridurre messaggi ripetitivi.

## Team Admin

Interessi:

- gestire roster;
- organizzare eventi;
- coordinare la squadra;
- amministrare Tax/Paste.

## Treasurer

Interessi:

- tracciare pagamenti;
- avere saldo affidabile;
- vedere chi deve pagare;
- evitare Excel/manualità.

## Captain

Interessi:

- coordinare il gruppo;
- comunicare;
- gestire attività sociali;
- aiutare coach/admin.

## Occasional Player

Interessi:

- capire rapidamente cosa deve fare;
- evitare interfacce complesse;
- ricevere solo notifiche utili.

---

# 175. Stakeholder Matrix

Classificare gli stakeholder tramite:

```text
Power
↑

High        Manage Closely
            Coach
            Owner/Admin

Low         Keep Informed
            Players
            Occasional Players

            ─────────────────→ Interest
```

Aggiornare la matrice se VolleyStack viene usato da una società con dirigenti o più squadre.

---

# 176. Personas — Regola

Le personas iniziali sono **ipotesi**, non verità.

Devono essere validate con:

- survey;
- interviste;
- utilizzo beta.

Non inventare dettagli inutili.

Le personas devono contenere soltanto informazioni utili al design.

---

# 177. Persona P1 — Player

```text
Nome: Marco
Ruolo: giocatore
Frequenza allenamenti: 2-3 volte/settimana
Tecnologia: smartphone quotidiano
```

Obiettivi:

- sapere subito quando c'è allenamento;
- rispondere con un tap;
- vedere Tax e Paste;
- non dover rileggere 150 messaggi WhatsApp.

Frustrazioni:

- cambi di orario persi nella chat;
- sondaggi duplicati;
- non sapere se ha già pagato;
- dimenticare compiti.

Scenario:

```text
Marco esce dal lavoro.
Apre VolleyStack.
Vede allenamento alle 20:30.
Tocca "Ci sono".
Nota "arrivo 10 min dopo".
Chiude l'app.
```

---

# 178. Persona P2 — Admin

```text
Nome: Luca
Ruolo: team admin
Uso: frequente
```

Obiettivi:

- avere una sola fonte dati;
- ridurre messaggi manuali;
- evitare fogli Excel separati;
- assegnare Tax/Paste rapidamente.

Frustrazioni:

- risposte sparse;
- conteggi manuali;
- persone che dimenticano di rispondere;
- informazioni discordanti.

---

# 179. Persona P3 — Coach

Obiettivi:

- sapere chi viene;
- controllare disponibilità;
- sapere numero giocatori;
- registrare presenze;
- preparare convocazioni.

Frustrazioni:

- conferme tardive;
- risposte incomplete;
- ritardi non segnalati.

---

# 180. Proto-Personas vs Validated Personas

Prima della ricerca:

```text
Proto-Persona
```

Dopo almeno:

- 5-8 interviste;
- survey;
- osservazione beta;

può diventare:

```text
Validated Persona
```

Documentare quali assunzioni sono state confermate e quali no.

---

# 181. Problem Statements

Esempio P1:

```text
I giocatori hanno bisogno di un modo rapido per vedere
gli eventi della squadra e dichiarare la propria disponibilità
perché le informazioni attuali sono disperse nei messaggi.
```

Esempio P2:

```text
Gli admin hanno bisogno di una fonte unica e affidabile
per gestire presenze, Tax e Paste
perché l'attuale gestione manuale crea errori e dimenticanze.
```

---

# 182. How Might We

Trasformare i problemi in domande di design.

Esempi:

```text
How might we rendere la risposta ad un allenamento possibile in meno di 5 secondi?
```

```text
How might we mostrare chiaramente le Tax senza trasformare l'app in un gestionale contabile pesante?
```

```text
How might we ricordare le Paste senza creare notifiche fastidiose?
```

---

# 183. Research Questions

Prima di progettare, rispondere a:

1. Come viene gestita oggi la squadra?
2. Quali strumenti vengono utilizzati?
3. Quali informazioni vengono perse più spesso?
4. Quali operazioni sono più ripetitive?
5. Cosa infastidisce di più i giocatori?
6. Cosa infastidisce di più gli admin?
7. Quali feature sarebbero realmente usate?
8. Quali feature sono considerate inutili?
9. Quanto spesso gli utenti aprirebbero l'app?
10. Quanto valore hanno Tax/Paste rispetto alle funzioni organizzative?

---

# 184. Ipotesi iniziali da validare

## H1

Gli utenti preferiscono un'app dedicata rispetto a sondaggi WhatsApp per le presenze.

## H2

La feature più usata sarà il prossimo evento + RSVP.

## H3

Tax e Paste aumentano engagement ma non sono il motivo principale per usare l'app.

## H4

La dashboard deve permettere di completare il task principale senza entrare nel calendario.

## H5

Una chat interna completa non è necessaria.

## H6

Gli utenti preferiscono mantenere WhatsApp per conversazioni libere.

## H7

Il coach/admin vuole vedere immediatamente chi non ha risposto.

## H8

Le notifiche devono essere poche e configurabili.

---

# 185. Survey Discovery — Obiettivo

Eseguire un primo sondaggio **prima del prototipo definitivo**.

Target:

- compagni di squadra;
- giocatori di altre squadre amatoriali;
- coach;
- dirigenti se disponibili.

Campione minimo utile:

```text
10-15 persone
```

Campione preferibile:

```text
20-30 persone
```

Non serve significatività statistica.

Serve identificare pattern e priorità.

---

# 186. Survey Discovery — Intro pronta

Testo consigliato:

```text
Sto progettando VolleyStack, una webapp per semplificare
l'organizzazione di una squadra di pallavolo.

Il questionario serve a capire quali problemi sono davvero
importanti prima di sviluppare l'app.

Non ci sono risposte giuste o sbagliate.
Tempo richiesto: circa 3-5 minuti.
```

---

# 187. Survey Discovery — Sezione A: Profilo

## Q1

Qual è il tuo ruolo principale?

- Giocatore
- Allenatore
- Dirigente/Admin
- Capitano
- Altro

## Q2

Quanti allenamenti fai mediamente a settimana?

- 0
- 1
- 2
- 3
- 4+

## Q3

A che livello giochi?

- Amatoriale
- Campionato territoriale
- Regionale
- Nazionale
- Altro

## Q4

Quante persone ci sono circa nella tua squadra?

- meno di 10
- 10-15
- 16-20
- oltre 20

---

# 188. Survey Discovery — Sezione B: Gestione attuale

## Q5

Come gestite principalmente allenamenti e partite?

Scelta multipla:

- WhatsApp
- Google Calendar
- Spond
- TeamSnap
- SportEasy
- Foglio Excel
- App della società
- Altro

## Q6

Come comunicate la presenza agli allenamenti?

- messaggio;
- sondaggio WhatsApp;
- app;
- non la comunichiamo;
- altro.

## Q7

Quanto spesso capita che qualcuno non risponda o dimentichi?

Scala:

```text
1 = mai
5 = molto spesso
```

## Q8

Quanto è difficile capire rapidamente chi sarà presente?

Scala 1-5.

## Q9

Quanto spesso si perdono informazioni importanti nella chat?

Scala 1-5.

---

# 189. Survey Discovery — Sezione C: Problemi

## Q10

Quali problemi capitano più spesso?

Checkbox:

- persone che non rispondono;
- cambi orario persi;
- ritardi;
- convocazioni confuse;
- conteggio presenze;
- gestione quote;
- gestione multe;
- gestione compleanni/paste;
- materiale da portare;
- passaggi auto;
- risultati/statistiche;
- altro.

## Q11

Qual è il problema più fastidioso?

Risposta aperta.

## Q12

Quale attività della squadra richiede più messaggi inutili?

Risposta aperta.

---

# 190. Survey Discovery — Sezione D: Feature

Domanda:

> Quanto sarebbe utile ciascuna funzione?

Scala:

```text
1 = inutile
5 = indispensabile
```

Valutare:

- calendario;
- allenamenti;
- disponibilità;
- presenze;
- convocazioni;
- partite;
- compiti;
- Tax;
- Paste;
- cassa;
- statistiche;
- MVP;
- annunci;
- car pooling;
- reminder;
- classifica interna.

---

# 191. Survey Discovery — Sezione E: Comportamento

## Q13

Quanto spesso pensi che apriresti un'app del genere?

- ogni giorno;
- più volte a settimana;
- 1 volta/settimana;
- solo quando ricevo una notifica;
- raramente.

## Q14

Quale sarebbe il motivo principale per aprirla?

- prossimo allenamento;
- risposta presenza;
- calendario;
- Tax;
- Paste;
- partite;
- statistiche;
- altro.

## Q15

Preferiresti:

- usare l'app anche per chat;
- continuare a usare WhatsApp per parlare;
- indifferente.

---

# 192. Survey Discovery — Sezione F: Notifiche

Chiedere quali notifiche vogliono:

- nuovo evento;
- cambio orario;
- reminder risposta;
- convocazione;
- Tax;
- Paste;
- annuncio;
- risultato.

Per ciascuna:

```text
Sì / No
```

---

# 193. Survey Discovery — Sezione G: Open Feedback

## Q16

Qual è una funzione che vorresti assolutamente?

## Q17

Quale funzione pensi sarebbe inutile?

## Q18

Cosa dovrebbe fare VolleyStack meglio di WhatsApp?

## Q19

Useresti personalmente VolleyStack?

- sicuramente sì;
- probabilmente sì;
- forse;
- probabilmente no;
- sicuramente no.

## Q20

Perché?

Risposta aperta.

---

# 194. Analisi survey

Per ogni feature calcolare:

```text
mean usefulness
median
% voti 4-5
```

Esempio:

| Feature | Media | % 4-5 |
|---|---:|---:|
| RSVP | 4.8 | 95% |
| Calendar | 4.5 | 90% |
| Tax | 3.7 | 65% |
| Chat | 2.1 | 20% |

La priorità non deve essere decisa solo dalla media.

Considerare anche:

- frequenza del problema;
- impatto;
- costo di implementazione;
- dipendenze.

---

# 195. Prioritizzazione RICE opzionale

Formula:

```text
RICE =
Reach × Impact × Confidence
───────────────────────────
Effort
```

Usare una scala semplice.

Esempio:

| Feature | Reach | Impact | Confidence | Effort | Score |
|---|---:|---:|---:|---:|---:|
| RSVP | 10 | 3 | 0.9 | 2 | 13.5 |
| Chat | 8 | 1 | 0.5 | 8 | 0.5 |

---

# 196. MoSCoW

## Must Have

- login;
- team;
- events;
- RSVP;
- attendance;
- Tax;
- Paste;
- dashboard.

## Should Have

- cassa;
- task;
- announcements;
- stats.

## Could Have

- MVP;
- lineup;
- car pooling;
- awards.

## Won't Have — V1

- chat;
- live scoring;
- scouting avanzato;
- payment gateway.

---

# 197. Product Backlog

Ogni backlog item deve avere:

```text
ID
Epic
Title
User Story
Priority
Acceptance Criteria
Dependencies
Estimate
Status
```

---

# 198. Epic Structure

Epiche iniziali:

```text
EPIC-AUTH
EPIC-TEAM
EPIC-EVENTS
EPIC-ATTENDANCE
EPIC-TAX
EPIC-PASTRIES
EPIC-DASHBOARD
EPIC-CASH
EPIC-MATCH
EPIC-STATS
EPIC-PWA
```

---

# 199. User Story Template

Formato:

```text
As a [role]
I want [goal]
So that [reason]
```

Versione italiana:

```text
Come [utente]
voglio [azione]
così da [beneficio].
```

---

# 200. User Story US-AUTH-001

```text
Come nuovo utente
voglio creare un account
così da poter accedere alla mia squadra.
```

Acceptance Criteria:

```gherkin
Given che non possiedo un account
When inserisco email e password valide
Then il sistema crea il mio account
And posso accedere a VolleyStack
```

---

# 201. User Story US-TEAM-001

```text
Come admin
voglio creare una squadra
così da poter invitare i miei compagni.
```

Acceptance Criteria:

```gherkin
Given che sono autenticato
When inserisco un nome squadra valido
Then viene creata la squadra
And divento owner
And posso generare un invito
```

---

# 202. User Story US-EVENT-001

```text
Come admin
voglio creare un allenamento
così che tutti sappiano quando e dove si svolgerà.
```

Acceptance Criteria:

```gherkin
Given che sono admin
When inserisco data, ora e luogo
Then l'allenamento appare nel calendario del team
And i membri possono rispondere
```

---

# 203. User Story US-RSVP-001

```text
Come giocatore
voglio indicare se parteciperò
così che il coach conosca la mia disponibilità.
```

Acceptance Criteria:

```gherkin
Given che esiste un evento futuro
When seleziono "Ci sono"
Then la mia risposta viene salvata
And il conteggio presenti viene aggiornato
```

---

# 204. User Story US-RSVP-002

```text
Come giocatore
voglio segnalare che arriverò in ritardo
così che la squadra sappia quando arriverò.
```

Acceptance Criteria:

```gherkin
Given che rispondo sì
When inserisco una nota di ritardo
Then la nota è visibile agli utenti autorizzati
```

---

# 205. User Story US-ATT-001

```text
Come coach
voglio registrare la presenza reale
così da avere statistiche affidabili.
```

---

# 206. User Story US-TAX-001

```text
Come admin
voglio assegnare una Tax ad un giocatore
così da registrare una penalità concordata dalla squadra.
```

Acceptance Criteria:

```gherkin
Given che sono admin
When seleziono giocatore, motivo e importo
Then viene creata una Tax aperta
And il saldo del giocatore viene aggiornato
And l'operazione è registrata nell'audit log
```

---

# 207. User Story US-TAX-002

```text
Come giocatore
voglio vedere il dettaglio delle mie Tax
così da capire da cosa deriva il mio saldo.
```

---

# 208. User Story US-TAX-003

```text
Come tesoriere
voglio registrare un pagamento
così da aggiornare correttamente il saldo del giocatore.
```

---

# 209. User Story US-PASTRY-001

```text
Come admin
voglio assegnare un obbligo Paste
così da non dimenticare compleanni o cappellate.
```

---

# 210. User Story US-PASTRY-002

```text
Come giocatore
voglio vedere quando devo portare le Paste
così da ricordarmene prima dell'allenamento.
```

---

# 211. User Story US-DASH-001

```text
Come giocatore
voglio vedere il prossimo allenamento appena apro l'app
così da non dover cercare nel calendario.
```

---

# 212. User Story US-DASH-002

```text
Come giocatore
voglio vedere immediatamente se ho Tax o Paste pendenti
così da sapere cosa devo sistemare.
```

---

# 213. User Story US-ADMIN-001

```text
Come admin
voglio vedere chi non ha ancora risposto
così da poter sollecitare soltanto quelle persone.
```

---

# 214. User Stories — INVEST

Ogni user story deve essere:

- **Independent**
- **Negotiable**
- **Valuable**
- **Estimable**
- **Small**
- **Testable**

Se una story è troppo grande, dividerla.

---

# 215. Epic vs Story

NO:

```text
Come admin voglio gestire tutta la squadra.
```

Troppo grande.

Sì:

```text
creare team
invitare player
cambiare ruolo
rimuovere player
modificare numero maglia
```

---

# 216. Story Mapping

Mappa del percorso principale:

```text
Join Team
↓
Open Home
↓
Check Next Event
↓
Respond
↓
Attend Training
↓
Check Tax/Paste
↓
Review Team Activity
```

Backbone:

```text
Onboarding
Team
Events
Attendance
Social
Finance
```

---

# 217. Story Map MVP

## Onboarding

MVP:

- register;
- join;
- team selection.

Later:

- Google login;
- magic link.

## Events

MVP:

- list;
- detail;
- RSVP.

Later:

- recurring;
- calendar sync.

## Social

MVP:

- Tax;
- Paste.

Later:

- Awards;
- reactions.

---

# 218. Definition of Ready

Una story entra in sviluppo solo se:

- [ ] ruolo definito;
- [ ] problema definito;
- [ ] valore definito;
- [ ] acceptance criteria;
- [ ] dipendenze note;
- [ ] mockup disponibile se UI;
- [ ] edge cases principali noti.

---

# 219. Definition of Done — User Driven

Una feature è completata solo se:

- [ ] acceptance criteria soddisfatti;
- [ ] test tecnici passano;
- [ ] responsive;
- [ ] accessibility base;
- [ ] error state;
- [ ] empty state;
- [ ] loading state;
- [ ] almeno un test utente se modifica workflow critico;
- [ ] documentazione aggiornata.

---

# 220. Functional Requirements

Formato ID:

```text
FR-001
```

Esempio:

```text
FR-001
The system shall allow an authenticated admin to create an event.
```

```text
FR-002
The system shall allow a team member to submit one availability response per event.
```

---

# 221. Non-Functional Requirements

Formato:

```text
NFR-001
```

Categorie:

- performance;
- security;
- availability;
- usability;
- accessibility;
- portability;
- maintainability;
- privacy.

---

# 222. NFR — Performance

```text
NFR-PERF-001
La dashboard dovrebbe diventare interattiva entro 2 secondi
su una connessione mobile ragionevole.
```

```text
NFR-PERF-002
Una risposta RSVP deve mostrare feedback visivo entro 500 ms,
anche se la conferma server avviene successivamente.
```

---

# 223. NFR — Usability

```text
NFR-UX-001
Un giocatore deve poter rispondere a un allenamento
con massimo 2 interazioni dalla Home.
```

```text
NFR-UX-002
L'80% degli utenti di test deve riuscire a trovare
le proprie Tax senza aiuto.
```

---

# 224. NFR — Security

```text
NFR-SEC-001
Un utente non appartenente a un team non deve poter leggere
o modificare dati di quel team.
```

---

# 225. NFR — Portability

```text
NFR-PORT-001
Il sistema deve essere avviabile tramite Docker Compose
senza dipendere da servizi cloud proprietari.
```

---

# 226. Requirements Traceability Matrix

Creare:

```text
docs/TRACEABILITY.md
```

Esempio:

| Requirement | User Story | Prototype | Test | Endpoint | Status |
|---|---|---|---|---|---|
| FR-001 | US-EVENT-001 | P-EVENT-01 | E2E-14 | POST /events | Planned |
| FR-002 | US-RSVP-001 | P-RSVP-01 | E2E-15 | PUT /response | Planned |

Obiettivo:

non perdere il collegamento tra bisogno, design e implementazione.

---

# 227. Use Case Specification

Per workflow complessi aggiungere use case formale.

Template:

```text
Use Case ID:
Actor:
Preconditions:
Trigger:
Main Flow:
Alternative Flows:
Postconditions:
Exceptions:
```

---

# 228. Use Case UC-001 — Respond to Training

Actor:

```text
Player
```

Precondition:

```text
Authenticated
Member of team
Training exists
```

Main Flow:

1. player opens Home;
2. sees next training;
3. taps YES;
4. system saves response;
5. UI updates count;
6. confirmation appears.

Alternative:

- NO;
- MAYBE;
- add note.

Exception:

- event cancelled;
- response deadline passed;
- network failure.

---

# 229. UML / Architecture Artifacts

Per integrare Laboratory of Advanced Programming mantenere:

```text
docs/diagrams/
```

Produrre almeno:

- Use Case Diagram;
- Domain Model;
- ER Diagram;
- Component Diagram;
- Deployment Diagram;
- Sequence Diagram;
- State Diagram per workflow importanti.

---

# 230. C4 Model

Livelli consigliati:

## C1 — System Context

VolleyStack e attori.

## C2 — Container

- Web/PWA;
- API;
- PostgreSQL.

## C3 — Components

Backend:

- Auth;
- Team;
- Events;
- Attendance;
- Tax;
- Paste.

Evitare C4 troppo dettagliato se non porta valore.

---

# 231. Sequence Diagram — RSVP

```text
Player
  |
  | tap YES
  v
React
  |
  | PUT /response
  v
API
  |
  | validate auth
  | validate membership
  v
PostgreSQL
  |
  | upsert response
  v
API
  |
  | 200 OK
  v
React
  |
  | update UI
```

---

# 232. State Machine — Tax

```text
OPEN
  |
  | partial payment
  v
PARTIALLY_PAID
  |
  | full payment
  v
PAID
```

Alternative:

```text
OPEN
 |
 | admin void
 v
VOID
```

---

# 233. Domain-Driven Thinking leggero

Non serve implementare DDD completo.

Usare però bounded concepts chiari:

```text
Identity
Team
Event
Attendance
Finance
Social
Match
```

Evitare modelli generici senza significato.

---

# 234. SOLID

Backend e frontend devono rispettare i principi SOLID dove sensato.

Esempio:

NO:

```text
FineController
```

che:

- valida;
- calcola;
- salva;
- invia notifiche;
- aggiorna cash;
- genera statistiche.

Separare responsabilità.

---

# 235. Service Layer

Struttura:

```text
routes
↓
controllers
↓
services
↓
repositories/ORM
```

Business logic nei servizi.

---

# 236. Dependency Injection

Usare dependency injection leggera per:

- services;
- repositories;
- clock;
- email provider;
- notification provider.

Serve soprattutto alla testabilità.

---

# 237. Repository Pattern

Usarlo solo se porta valore.

Non creare astrazioni inutili sopra Prisma.

Possibile per componenti complessi:

```text
FineRepository
EventRepository
```

---

# 238. Design Patterns utili

Possibili:

## Strategy

per calcolo Tax:

```text
FixedFineStrategy
LateFineStrategy
CustomFineStrategy
```

## Factory

per notifiche o event type.

## Adapter

per provider esterni:

```text
EmailAdapter
StorageAdapter
```

## Observer/Event approach

per:

```text
FineCreated
EventCreated
PaymentRecorded
```

senza introdurre message queue.

---

# 239. Anti-Patterns da evitare

- God class;
- fat controllers;
- duplicated business logic;
- boolean explosion;
- magic numbers;
- hardcoded permissions;
- shared mutable state;
- premature abstraction;
- premature microservices.

---

# 240. Architecture Decision Records

Cartella:

```text
docs/adr/
```

Esempi:

```text
ADR-001-use-postgresql.md
ADR-002-use-docker-compose.md
ADR-003-use-rest-api.md
ADR-004-use-prisma.md
ADR-005-no-chat-in-v1.md
```

Template:

```text
Context
Decision
Alternatives
Consequences
Status
```

---

# 241. Prototype Strategy

Creare 3 livelli di prototipo.

## Prototype 0 — Sketch

Carta / wireframe grezzo.

Obiettivo:

- struttura;
- navigazione;
- priorità.

## Prototype 1 — Low Fidelity

Figma grayscale.

Obiettivo:

- user flow;
- information architecture.

## Prototype 2 — High Fidelity

Figma interattivo.

Obiettivo:

- UI;
- copy;
- usability.

Solo dopo:

```text
Implementation
```

---

# 242. Prototype P0 — Schermate minime

Disegnare:

- Login;
- Home;
- Calendar;
- Event;
- Tax;
- Paste;
- Team.

Non preoccuparsi dei colori.

---

# 243. Prototype P1 — Flow prioritario

Il primo flow da testare deve essere:

```text
Home
↓
Next Training
↓
RSVP
↓
See confirmation
```

Perché è il task più frequente.

---

# 244. Prototype P2 — Flow admin

```text
Admin Home
↓
Create Training
↓
Select Date
↓
Set Response Deadline
↓
Publish
↓
View Responses
```

---

# 245. Prototype P3 — Tax

```text
Tax
↓
New Tax
↓
Player
↓
Reason
↓
Amount
↓
Confirm
```

---

# 246. Prototype P4 — Paste

```text
Paste
↓
Assign
↓
Player
↓
Reason
↓
Due Date
↓
Save
```

---

# 247. Prototype Review Round 1

Partecipanti:

```text
3-5 utenti
```

Obiettivo:

trovare grossi problemi strutturali.

Non serve un campione grande.

---

# 248. Usability Test — Regole

Durante il test:

NON dire:

```text
clicca qui
```

Dire:

```text
Immagina che mercoledì tu abbia allenamento
e voglia confermare la presenza.
Fammi vedere cosa faresti.
```

Osservare senza aiutare.

---

# 249. Usability Test Tasks — Player

## Task 1

Trova quando sarà il prossimo allenamento.

## Task 2

Conferma che parteciperai.

## Task 3

Segnala che arriverai 10 minuti in ritardo.

## Task 4

Controlla quanto devi di Tax.

## Task 5

Scopri perché hai una Tax da 2 €.

## Task 6

Controlla se devi portare Paste.

## Task 7

Trova il numero di maglia di un compagno.

---

# 250. Usability Test Tasks — Admin

## Task 1

Crea un allenamento.

## Task 2

Controlla chi non ha risposto.

## Task 3

Registra un giocatore come in ritardo.

## Task 4

Assegna una Tax.

## Task 5

Registra un pagamento.

## Task 6

Assegna Paste per un compleanno.

---

# 251. Metriche usability

Per ogni task registrare:

## Task Success

- success;
- partial;
- fail.

## Time on Task

secondi.

## Errors

numero.

## Assistance

- none;
- minor;
- major.

## Confidence

utente 1-5.

---

# 252. Usability Success Criteria

Esempio MVP:

```text
RSVP success rate >= 90%
```

```text
Median time RSVP <= 10 sec
```

```text
Find Tax balance success >= 80%
```

```text
Create event admin success >= 80%
```

---

# 253. Severity degli usability issue

## S0

Cosmetico.

## S1

Fastidio minore.

## S2

Problema serio ma workaround presente.

## S3

Blocca il task.

Priorità:

```text
S3 > S2 > S1 > S0
```

---

# 254. Usability Observation Sheet

Template:

| User | Task | Success | Time | Errors | Help | Notes |
|---|---|---|---:|---:|---|---|
| U01 | RSVP | Yes | 7s | 0 | None | - |

---

# 255. Think-Aloud Protocol

Chiedere:

```text
Mentre usi il prototipo,
dimmi ad alta voce cosa pensi,
cosa ti aspetti e cosa stai cercando.
```

Non guidare l'utente.

---

# 256. Post-Test Interview

Domande:

1. Cosa ti è sembrato più semplice?
2. Cosa ti ha confuso?
3. C'era qualcosa che ti aspettavi di trovare?
4. Quale funzione useresti di più?
5. Quale useresti meno?
6. Cosa cambieresti nella Home?
7. Useresti questa app al posto dei sondaggi WhatsApp?
8. Cosa dovrebbe assolutamente essere migliorato prima di usarla?

---

# 257. Survey Post-Prototype — Intro

```text
Hai appena provato un prototipo di VolleyStack.
Questo questionario serve a capire se l'interfaccia è chiara
e se le funzionalità rispondono ai bisogni reali della squadra.
```

---

# 258. Survey Post-Prototype — Usability

Scala 1-5:

```text
1 = completamente in disaccordo
5 = completamente d'accordo
```

Domande:

1. Ho capito subito come orientarmi nell'app.
2. La Home mostra le informazioni che mi servono.
3. Confermare la presenza è semplice.
4. Il calendario è facile da capire.
5. La sezione Tax è chiara.
6. La sezione Paste è chiara.
7. Le informazioni importanti sono facili da trovare.
8. L'app sembra veloce da usare.
9. Mi sentirei sicuro ad usarla senza istruzioni.
10. Userei VolleyStack per gestire la squadra.

---

# 259. Survey Post-Prototype — Feature Value

Valutare 1-5:

- allenamenti;
- RSVP;
- presenze;
- calendario;
- Tax;
- Paste;
- cassa;
- MVP;
- task;
- statistiche.

---

# 260. Survey Post-Prototype — Preferenze

## Q

Cosa preferisci vedere in Home?

Scegli massimo 3:

- prossimo allenamento;
- prossima partita;
- saldo Tax;
- Paste;
- annunci;
- classifica;
- calendario;
- stats.

---

# 261. Survey Post-Prototype — Open

1. Qual è la cosa migliore del prototipo?
2. Qual è la cosa peggiore?
3. C'è qualcosa che non hai capito?
4. Cosa manca?
5. Cosa elimineresti?
6. Cosa cambieresti nella Home?

---

# 262. Survey dopo Beta

Dopo 2 settimane reali chiedere:

1. Quante volte hai usato VolleyStack?
2. Per quali funzioni?
3. Ti ha fatto risparmiare messaggi WhatsApp?
4. Hai perso meno informazioni?
5. Hai dimenticato meno eventi?
6. Quale funzione non hai mai usato?
7. Quale funzione manca?
8. Continueresti ad usarlo?

---

# 263. Behavioral Analytics senza invasività

Registrare solo eventi prodotto aggregati utili:

```text
event_viewed
rsvp_submitted
fine_viewed
pastry_viewed
```

Non registrare contenuti personali inutili.

---

# 264. Beta Metrics

Metriche consigliate:

## Activation

```text
% invitati che completano onboarding
```

## RSVP Adoption

```text
% eventi con almeno 80% risposte
```

## Weekly Active Users

```text
WAU
```

## Core Feature Usage

```text
RSVP per user
Tax views
Paste views
```

---

# 265. Product Success Metrics

VolleyStack è utile se:

- almeno 80% della squadra lo usa;
- almeno 80% delle disponibilità viene registrato nell'app;
- diminuiscono i reminder manuali;
- gli admin riferiscono meno lavoro organizzativo;
- la squadra vuole continuare a usarlo.

---

# 266. Qualitative Success

Non usare soltanto numeri.

Cercare commenti come:

```text
"Non devo più cercare il sondaggio."
```

```text
"Finalmente so se ho pagato."
```

```text
"Guardo direttamente lì per sapere l'allenamento."
```

Questi indicano vero valore.

---

# 267. Feedback Repository

Creare:

```text
docs/research/
```

File:

```text
DISCOVERY_SURVEY.md
INTERVIEW_NOTES.md
PROTOTYPE_TEST_01.md
PROTOTYPE_TEST_02.md
BETA_FEEDBACK.md
```

---

# 268. Research Log

Ogni sessione:

```text
Participant ID
Date
Role
Prototype version
Tasks
Observations
Quotes
Issues
Severity
Ideas
```

Non usare necessariamente nomi reali.

---

# 269. Privacy nella ricerca utenti

Nei documenti usare:

```text
U01
U02
U03
```

invece dei nomi.

Non raccogliere:

- dati sensibili;
- informazioni non necessarie.

---

# 270. Requirements Change Management

Quando emerge un nuovo requisito:

1. documentarlo;
2. associare fonte;
3. valutare valore;
4. valutare effort;
5. verificare conflitti;
6. prioritizzare;
7. aggiornare backlog.

---

# 271. Requirement Source

Ogni requisito può indicare:

```text
SRC-SURVEY
SRC-INTERVIEW
SRC-USABILITY
SRC-ADMIN
SRC-TECH
SRC-LEGAL
```

---

# 272. Example Requirement Trace

```text
Survey:
"Mi dimentico spesso di rispondere"
↓
Need:
Reminder risposta
↓
Requirement:
FR-NOT-003
↓
Story:
US-NOT-004
↓
Prototype:
P-NOT-02
↓
Test:
UT-12
↓
Implementation:
NotificationService
```

---

# 273. Kano Model opzionale

Classificare feature:

## Basic

Se manca → frustrazione.

Esempio:

- calendario;
- RSVP.

## Performance

Più è buona → più soddisfazione.

Esempio:

- statistiche;
- reminder.

## Delight

Non attesa ma piacevole.

Esempio:

- awards;
- Paste leaderboard.

---

# 274. Opportunity Solution Tree

Esempio:

```text
Outcome:
Ridurre caos organizzativo
│
├── Opportunity:
│   Persone non rispondono
│   ├── Reminder
│   └── Badge unanswered
│
├── Opportunity:
│   Informazioni perse
│   ├── Dashboard
│   └── Calendar
│
└── Opportunity:
    Contabilità confusa
    ├── Tax ledger
    └── Payment history
```

---

# 275. User Journey — Training

## Before

```text
WhatsApp message
↓
poll
↓
search poll
↓
reply
↓
change response
↓
coach counts
```

## After VolleyStack

```text
notification
↓
open
↓
tap YES
↓
done
```

Misurare la riduzione del numero di step.

---

# 276. User Journey — Tax

Before:

```text
messaggio
↓
nota
↓
Excel
↓
pagamento
↓
aggiornamento manuale
```

After:

```text
assign Tax
↓
ledger
↓
payment
↓
automatic balance
```

---

# 277. Information Architecture Test

Prima del prototipo finale fare un semplice tree test.

Chiedere:

```text
Dove cercheresti:
- una Tax?
- il prossimo allenamento?
- il roster?
- una Paste?
- la cassa?
```

Se molti utenti cercano in sezioni diverse:

rivedere navigazione.

---

# 278. Card Sorting

Possibile test con 5-8 persone.

Carte:

- Events
- Training
- Matches
- Attendance
- Tax
- Paste
- Cash
- Team
- Stats
- Tasks

Chiedere di raggrupparle.

Serve a validare menu e nomenclatura.

---

# 279. Naming Test

Per termini potenzialmente ambigui:

```text
Tax
Paste
Cash
Events
Tasks
```

chiedere agli utenti:

> Cosa ti aspetti di trovare entrando qui?

Se l'interpretazione è incoerente:

cambiare label o aggiungere subtitle.

---

# 280. A/B Test non necessario in fase iniziale

Non fare A/B test con 15 utenti.

Meglio:

- osservazione;
- interviste;
- usability testing.

A/B testing richiede campioni più grandi.

---

# 281. Prototype Versions

Usare versioning:

```text
P0.1
P0.2
P1.0
P1.1
P2.0
```

Ogni test deve indicare quale versione è stata usata.

---

# 282. Design Changelog

Creare:

```text
docs/DESIGN_CHANGELOG.md
```

Esempio:

```text
P1.0 → P1.1
- RSVP moved to Home
Reason: 4/5 users looked there first.
```

---

# 283. UX Decision Log

Ogni decisione importante deve avere evidenza.

Esempio:

```text
Decision:
No chat in V1.

Evidence:
7/9 utenti preferiscono WhatsApp per conversazioni.
```

---

# 284. Technical Decision + User Evidence

Non tutte le scelte vengono dagli utenti.

Esempio:

```text
Decision:
Use PostgreSQL.

Reason:
Relational domain + maintainability.
```

Separare:

```text
Product decision
Technical decision
```

---

# 285. User Story Estimation

Usare story points:

```text
1
2
3
5
8
13
```

Story > 8:

valutare split.

---

# 286. Planning Poker

Se lavorano più sviluppatori:

stimare indipendentemente e discutere divergenze.

Se lavori da solo:

usare story points per confronto relativo.

---

# 287. Sprint Structure

Possibile sprint di 1 settimana:

```text
Planning
↓
Development
↓
Review
↓
Retrospective
```

Per progetto personale può essere più leggero.

---

# 288. Sprint Goal

Esempio:

```text
"Un giocatore può vedere e rispondere al prossimo allenamento."
```

Meglio di:

```text
"Finire 12 task."
```

---

# 289. Sprint Review

Mostrare prodotto funzionante.

Chiedere:

- cosa funziona?
- cosa manca?
- cosa non è chiaro?

---

# 290. Retrospective

Domande:

```text
Start
Stop
Continue
```

Oppure:

```text
What went well?
What didn't?
What should change?
```

---

# 291. Git Workflow collegato alle Stories

Branch:

```text
feature/US-RSVP-001-submit-response
```

Commit:

```text
feat(rsvp): add event response endpoint
```

PR:

```text
US-RSVP-001 — Submit event response
```

---

# 292. Conventional Commits

Usare:

```text
feat:
fix:
refactor:
test:
docs:
chore:
perf:
```

---

# 293. Issue Template

Ogni issue:

```text
Story ID
Context
Acceptance Criteria
Design
Technical Notes
Tests
```

---

# 294. Bug Template

```text
Environment
Steps to reproduce
Expected
Actual
Severity
Screenshot
Logs
```

---

# 295. Test Pyramid

```text
           E2E
         /     \
   Integration
   /           \
      Unit
```

Molti unit.

Meno integration.

Pochi E2E critici.

---

# 296. TDD selettivo

Usare TDD soprattutto per:

- saldo Tax;
- payment allocation;
- permissions;
- recurrence;
- business rules.

Non serve forzarlo per componenti UI banali.

---

# 297. Code Review Checklist

- business rule corretta;
- auth verificata;
- no duplication;
- naming chiaro;
- test;
- edge cases;
- no sensitive logs;
- query efficienti;
- mobile UX.

---

# 298. Clean Code Guidelines

Preferire:

```text
calculateOutstandingFineBalance()
```

a:

```text
calc()
```

Preferire early return.

Evitare funzioni > ~40-50 righe se contengono più responsabilità.

---

# 299. Refactoring Rule

Non rifattorizzare per estetica durante una feature se aumenta troppo scope.

Creare issue tecnica separata.

---

# 300. Technical Debt Register

Creare:

```text
docs/TECH_DEBT.md
```

Campi:

```text
ID
Description
Impact
Risk
Effort
Target release
```

---

# 301. Architecture Fitness

Ogni release verificare:

- Docker build;
- migration;
- auth boundaries;
- team isolation;
- backup restore;
- bundle size;
- slow query.

---

# 302. API Contract

Documentare OpenAPI.

Endpoint devono avere:

- request schema;
- response schema;
- error schema.

Possibile generazione client TypeScript.

---

# 303. Contract Testing

Verificare che frontend e backend condividano tipi/schemi.

Evitare:

```text
frontend assumes field X
backend renamed field
```

---

# 304. Feature Acceptance Demo

Prima di chiudere story:

eseguire scenario acceptance criteria manualmente o automaticamente.

---

# 305. Prototype Gate

Una feature UI complessa passa a sviluppo se:

- flow completo;
- nessun S3;
- massimo pochi S2;
- utenti comprendono nomenclatura;
- task success accettabile.

---

# 306. MVP Gate

Prima di beta:

- 5 utenti completano onboarding;
- 5 utenti RSVP senza aiuto;
- admin crea evento senza aiuto;
- admin assegna Tax senza aiuto;
- nessun blocker.

---

# 307. Beta Gate

Prima della beta reale:

- backup attivo;
- HTTPS;
- permissions test;
- error logging;
- mobile QA;
- privacy text;
- feedback channel.

---

# 308. Post-Beta Decision Framework

Per ogni feature richiesta:

```text
How many users asked?
How often does problem occur?
How severe?
Does workaround exist?
Implementation effort?
Maintenance cost?
```

---

# 309. Feature Request Score

Possibile formula:

```text
Value Score =
Frequency × Severity × Users
────────────────────────────
Effort
```

---

# 310. Release Notes

Ogni release:

```text
Added
Changed
Fixed
Known Issues
```

---

# 311. Semantic Versioning

```text
0.1.0 prototype
0.2.0 internal alpha
0.5.0 beta
1.0.0 stable
```

---

# 312. User Research Milestones

## Research R1

Discovery survey.

## Research R2

Interviews.

## Research R3

Low-fi prototype testing.

## Research R4

High-fi prototype testing.

## Research R5

Beta evaluation.

---

# 313. Suggested Sample Sizes

Discovery survey:

```text
15-30
```

Interviews:

```text
5-8
```

Prototype usability round:

```text
5
```

Second round:

```text
5
```

Beta:

intera squadra.

---

# 314. Interview Guide — Discovery

Durata:

```text
15-20 min
```

Domande:

1. Raccontami come organizzate una settimana tipica.
2. Come vengono comunicati gli allenamenti?
3. Come confermate le presenze?
4. Cosa succede quando qualcuno non risponde?
5. Come gestite multe/quote?
6. Come gestite compleanni o cose da portare?
7. Qual è la parte più caotica?
8. Quali strumenti avete provato?
9. Cosa non ha funzionato?
10. Se potessi eliminare una sola seccatura, quale sarebbe?

---

# 315. Interview Anti-Bias

NON chiedere:

```text
Ti piacerebbe un'app che fa X?
```

Meglio:

```text
Come gestisci X oggi?
```

Cercare comportamento reale, non intenzione ipotetica.

---

# 316. Avoid Leading Questions

NO:

```text
Non sarebbe utile avere reminder automatici?
```

Sì:

```text
Come fai oggi a ricordarti di rispondere?
```

---

# 317. Prototype Presentation Script

Prima del test dire:

```text
Sto testando l'interfaccia, non te.
Se qualcosa non è chiaro è un problema del prototipo,
non una tua difficoltà.

Prova a comportarti come faresti normalmente.
```

---

# 318. Prototype Test Consent

Chiedere consenso se:

- registri audio;
- registri schermo;
- salvi screenshot.

Per test informali tra amici può bastare consenso esplicito, ma documentarlo.

---

# 319. Research Findings Format

Ogni finding:

```text
Finding ID
Evidence
Frequency
Severity
Affected Flow
Recommendation
```

---

# 320. Example Finding

```text
UX-007

Finding:
4/5 utenti cercavano la risposta allenamento nella Home.

Evidence:
P1, P2, P4, P5.

Severity:
S2.

Decision:
Mostrare RSVP direttamente nella card prossimo evento.
```

---

# 321. User Evidence Backlog

Ogni issue UX deve linkare finding.

Esempio:

```text
US-RSVP-001
Source: UX-007
```

---

# 322. Proto-Persona Validation Table

| Assumption | Evidence | Status |
|---|---|---|
| Player wants quick RSVP | 8/9 interviews | Confirmed |
| Chat needed | 2/9 | Rejected |
| Tax is core feature | survey 3.5/5 | Partial |

---

# 323. Hypothesis Tracking

Per ogni hypothesis:

```text
H1
Expected evidence
Observed evidence
Status
Decision
```

Status:

- Confirmed
- Partially Confirmed
- Rejected
- Inconclusive

---

# 324. Usability Benchmark

Salvare metriche per versione.

Esempio:

| Metric | P1 | P2 |
|---|---:|---:|
| RSVP success | 70% | 100% |
| RSVP median time | 18s | 6s |
| Tax find success | 60% | 90% |

---

# 325. UX Debt

Come technical debt, registrare:

```text
UX-DEBT-001
```

Esempio:

```text
Tax filters difficult on small screens.
```

---

# 326. Accessibility Testing

Prima beta:

- keyboard;
- contrast;
- screen-reader labels;
- zoom;
- large font;
- focus order.

---

# 327. Heuristic Evaluation

Eseguire review con Nielsen-style principles:

- visibility of status;
- match with real world;
- user control;
- consistency;
- error prevention;
- recognition over recall;
- efficiency;
- minimalist design;
- error recovery;
- help.

---

# 328. Error Prevention

Esempio Tax:

prima di confermare:

```text
Stai assegnando €5,00 a Marco
Motivo: Ritardo
```

CTA:

```text
Confirm Tax
```

---

# 329. Error Recovery

Permettere:

```text
Void Tax
```

con audit.

Non cancellare silenziosamente.

---

# 330. Progressive Disclosure

Non mostrare tutte le impostazioni subito.

Player vede semplicità.

Admin vede strumenti avanzati.

---

# 331. Dashboard Personalization

V1:

stessa struttura.

V2:

possibile ordinamento card.

Non introdurre subito personalizzazione complessa.

---

# 332. Content Design

Etichette corte.

Preferire:

```text
I'm in
I'm out
Maybe
```

oppure versione italiana coerente:

```text
Ci sono
Non ci sono
Forse
```

---

# 333. Language Validation

Testare se termini inglesi sono capiti.

VolleyStack può avere brand inglese ma UI iniziale italiana.

---

# 334. Data Visualization

Grafici solo se aiutano una domanda.

Esempio utile:

```text
Attendance trend
```

Esempio inutile:

grafico a torta decorativo per 3 record.

---

# 335. Empty State Research

Empty states devono spiegare:

- cosa c'è qui;
- perché;
- cosa fare dopo.

---

# 336. Onboarding Test

Task:

```text
Entra nella squadra usando questo codice.
```

Misurare:

- success;
- tempo;
- errori.

---

# 337. QR Join Test

V2 o V1.5:

testare:

```text
scan QR
↓
register/login
↓
join
```

Deve preservare l'invito anche dopo login.

---

# 338. Notification Research

Prima di implementare push chiedere:

```text
Quali notifiche vuoi davvero?
```

Non attivare tutto di default.

---

# 339. Notification Preference Model

Per categoria:

```text
OFF
IMPORTANT_ONLY
ALL
```

---

# 340. Experiment Log

Se proviamo varianti:

```text
EXP-001
Hypothesis
Variant A
Variant B
Metric
Result
Decision
```

Solo quando il campione lo permette.

---

# 341. Documentation as Product Artifact

Il repository deve mostrare anche il processo.

Cartelle:

```text
docs/
├── product/
├── research/
├── ux/
├── architecture/
├── adr/
└── testing/
```

---

# 342. Product Requirements Document

Creare:

```text
docs/product/PRD.md
```

Contenuti:

- vision;
- problem;
- target;
- goals;
- non-goals;
- personas;
- epics;
- metrics;
- risks;
- rollout.

---

# 343. Software Requirements Specification

Creare:

```text
docs/product/SRS.md
```

Contenuti:

- scope;
- actors;
- FR;
- NFR;
- constraints;
- interfaces;
- data;
- security.

---

# 344. UX Research Plan

Creare:

```text
docs/research/RESEARCH_PLAN.md
```

Contenuti:

- objectives;
- questions;
- participants;
- methods;
- timeline;
- analysis.

---

# 345. Prototype Test Plan

Creare:

```text
docs/research/USABILITY_TEST_PLAN.md
```

Contenuti:

- prototype version;
- participants;
- tasks;
- metrics;
- script;
- success thresholds.

---

# 346. Backlog File

Possibile:

```text
docs/product/BACKLOG.md
```

Oppure GitHub Issues/Projects.

---

# 347. GitHub Project Columns

Suggerite:

```text
Ideas
Research
Ready
In Progress
Review
Testing
Done
```

---

# 348. Linking GitHub Issues

Issue title:

```text
[US-RSVP-001] Submit event response
```

Labels:

```text
epic:events
type:feature
priority:must
ux
backend
frontend
```

---

# 349. User Story Acceptance Test

Ogni story deve avere almeno un acceptance test.

Può essere:

- automated;
- manual;
- E2E.

---

# 350. Continuous Discovery

Anche dopo rilascio:

ogni 2-4 settimane raccogliere feedback.

Non considerare il requirements phase “finito”.

---

# 351. MVP Research Sequence consigliata

```text
1. Discovery survey
2. 5 interviews
3. Synthesize
4. Define personas
5. Prioritize
6. Low-fi prototype
7. Test with 5 users
8. Fix
9. High-fi prototype
10. Test with 5 users
11. Implement MVP
12. Beta whole team
13. Post-beta survey
14. Iterate
```

---

# 352. Prima Survey da fare agli amici

Versione consigliata da usare realmente:

## Titolo

```text
VolleyStack — come gestiamo davvero la squadra?
```

## Descrizione

```text
Sto progettando una webapp per semplificare l'organizzazione
della nostra squadra: allenamenti, presenze, partite, Tax,
Paste e altre attività.

Prima di svilupparla voglio capire quali funzioni servono davvero.
Il questionario dura circa 4 minuti.
```

Domande essenziali:

1. Ruolo nella squadra.
2. Quanto spesso ti alleni?
3. Come controlli oggi gli allenamenti?
4. Come comunichi la presenza?
5. Quanto spesso dimentichi di rispondere?
6. Quanto spesso perdi informazioni in chat?
7. Qual è il problema più fastidioso?
8. Valuta calendario 1-5.
9. Valuta RSVP 1-5.
10. Valuta presenze 1-5.
11. Valuta Tax 1-5.
12. Valuta Paste 1-5.
13. Valuta cassa 1-5.
14. Valuta partite 1-5.
15. Valuta statistiche 1-5.
16. Valuta MVP 1-5.
17. Valuta task 1-5.
18. Quali 3 funzioni useresti di più?
19. Useresti chat interna o WhatsApp?
20. Quanto spesso apriresti VolleyStack?
21. Cosa dovrebbe assolutamente fare?
22. Cosa non dovrebbe fare?
23. Useresti questa app?
24. Perché?

---

# 353. Seconda Survey — dopo prototipo

## Titolo

```text
VolleyStack — feedback sul prototipo
```

Domande:

1. Hai completato tutti i task?
2. Quanto era chiara la Home? 1-5
3. Quanto era semplice rispondere? 1-5
4. Quanto era chiaro il calendario? 1-5
5. Quanto era chiara la sezione Tax? 1-5
6. Quanto era chiara Paste? 1-5
7. Quanto era facile trovare un compagno? 1-5
8. Quanto sembrava veloce l'app? 1-5
9. Cosa ti ha confuso?
10. Quale schermata cambieresti?
11. Cosa manca?
12. Cosa elimineresti?
13. Quanto probabilmente useresti VolleyStack? 1-5
14. Preferisci VolleyStack o sondaggi WhatsApp per RSVP?
15. Perché?

---

# 354. Prototype Presentation to Friends

Sequenza consigliata:

```text
1. Non spiegare tutte le feature.
2. Presenta solo il problema.
3. Fai eseguire 5-7 task.
4. Osserva.
5. Non aiutare subito.
6. Fai domande dopo.
7. Compila survey.
```

Questo evita che la presentazione influenzi troppo il test.

---

# 355. Prototype Demo Script

Dire:

```text
VolleyStack è un prototipo per gestire la vita della squadra.

Non voglio capire se ti piace l'idea in astratto:
voglio capire se riesci realmente a usarla.

Immagina che questa sia già l'app della squadra.
```

Poi iniziare dai task.

---

# 356. Usability Test Scenario

```text
È martedì.
Domani hai allenamento alle 20:30.
Sai già che arriverai circa 10 minuti in ritardo.

Usa il prototipo per informare la squadra.
```

Osservare dove va l'utente.

---

# 357. Scenario Tax

```text
Ti ricordi che la settimana scorsa hai ricevuto una multa.
Vuoi capire quanto devi e perché.

Mostrami cosa faresti.
```

---

# 358. Scenario Admin

```text
Sei admin.
Sabato c'è un'amichevole.

Crea l'evento e controlla poi chi non ha risposto.
```

---

# 359. UX Findings Prioritization

Formula semplice:

```text
Priority =
Severity × Frequency
```

Esempio:

```text
S3 × 4 utenti
```

altissima priorità.

---

# 360. Research Stop Rule

Non continuare a testare indefinitamente.

Passare allo sviluppo quando:

- pattern principali stabili;
- nessun blocker;
- nuovi test producono poche informazioni nuove.

---

# 361. Laboratory of Advanced Programming — Applicazione concreta

Il progetto deve mostrare competenze su:

- OOP/design;
- separation of concerns;
- patterns;
- testing;
- dependency management;
- build automation;
- containers;
- CI/CD;
- code quality;
- architecture;
- documentation.

---

# 362. User-Driven Software Engineering — Applicazione concreta

Il progetto deve mostrare competenze su:

- stakeholder analysis;
- requirements elicitation;
- personas;
- user stories;
- acceptance criteria;
- prototyping;
- usability testing;
- prioritization;
- traceability;
- iterative validation.

---

# 363. Portfolio Value

VolleyStack può essere presentato non come:

```text
"Ho sviluppato una webapp"
```

ma come:

```text
"Ho progettato e sviluppato un prodotto software
seguendo un processo user-centered,
dalla requirements elicitation alla beta,
con architettura containerizzata e testing automatizzato."
```

---

# 364. Portfolio Evidence

Conservare:

- survey anonimizzata;
- persona;
- story map;
- mockup;
- findings;
- iterations;
- architecture diagrams;
- code;
- tests;
- CI;
- deployment.

---

# 365. Final Case Study Structure

Quando il progetto sarà maturo:

```text
1. Problem
2. Research
3. Findings
4. Personas
5. Requirements
6. User Stories
7. Prototype
8. Usability Testing
9. Architecture
10. Implementation
11. Testing
12. Deployment
13. Beta Results
14. Lessons Learned
```

---

# 366. New Project Status Model

Da ora VolleyStack non è solo:

```text
Planning → Coding → Done
```

ma:

```text
Discovery
↓
Requirements
↓
Prototype
↓
Validation
↓
Development
↓
Verification
↓
Beta
↓
Evaluation
↓
Iteration
```

---

# 367. Nuova roadmap iniziale consigliata

## Phase A — Discovery

- [ ] preparare survey;
- [ ] inviarla a 15-30 persone;
- [ ] fare 5 interviste;
- [ ] sintetizzare risultati.

## Phase B — Requirements

- [ ] definire personas validate;
- [ ] scrivere user stories;
- [ ] scrivere FR/NFR;
- [ ] MoSCoW;
- [ ] story map;
- [ ] backlog.

## Phase C — Prototype

- [ ] low-fi;
- [ ] test 5 utenti;
- [ ] correggere;
- [ ] high-fi;
- [ ] test 5 utenti.

## Phase D — Engineering

- [ ] repository;
- [ ] Docker;
- [ ] auth;
- [ ] team;
- [ ] events;
- [ ] RSVP;
- [ ] Tax;
- [ ] Paste.

## Phase E — Beta

- [ ] deploy;
- [ ] intera squadra;
- [ ] analytics minime;
- [ ] survey post-beta.

## Phase F — Iterate

- [ ] confrontare ipotesi;
- [ ] aggiornare backlog;
- [ ] V1.1.

---

# 368. Primo deliverable di ricerca

Prima di iniziare sviluppo completo creare:

```text
VOLLEYSTACK_DISCOVERY_SURVEY.md
```

e trasformarlo in:

- Google Forms;
- Microsoft Forms;
- Typeform;
- altro.

---

# 369. Secondo deliverable di ricerca

Creare:

```text
VOLLEYSTACK_USER_STORIES.md
```

Contenente tutte le stories V1 con:

- ID;
- role;
- goal;
- benefit;
- acceptance criteria;
- priority;
- source.

---

# 370. Terzo deliverable

Creare:

```text
VOLLEYSTACK_PROTOTYPE_TEST.md
```

Contenente:

- scenario;
- tasks;
- moderator script;
- observations;
- metrics;
- survey.

---

# 371. Regola finale User-Driven

Non costruire una feature perché:

```text
"sembra figa"
```

Costruirla perché:

```text
"risolve un problema osservato o validato"
```

Le funzioni divertenti sono ammesse e desiderabili,
ma devono migliorare engagement senza complicare il core workflow.

---

# 372. Prossimo passo aggiornato

Prima milestone non è più immediatamente il codice.

Il percorso consigliato diventa:

```text
Survey Discovery
↓
5 Interviews
↓
Requirements
↓
User Stories
↓
Prototype
↓
Usability Test
↓
Revision
↓
Docker/Code
```

È possibile comunque preparare in parallelo la foundation tecnica,
ma il prodotto vero deve essere guidato dall'evidenza raccolta dagli utenti.


---

# 373. Decisione architetturale ufficiale — Docker-first + AWS-deployable

VolleyStack adotterà formalmente il seguente principio:

```text
Docker-first
Cloud-ready
AWS-deployable
Provider-independent
```

L'applicazione deve poter essere eseguita:

1. in locale;
2. su una VM generica;
3. su AWS EC2;
4. in futuro su AWS ECS;
5. su altri provider senza riscrittura applicativa.

AWS sarà quindi un **deployment target**, non una dipendenza strutturale del dominio applicativo.

---

# 374. Obiettivo della strategia duale

La combinazione Docker + AWS serve a ottenere contemporaneamente:

## Portabilità

Il codice non deve dipendere da un singolo cloud provider.

## Riproducibilità

Lo stesso ambiente deve essere avviabile su:

```text
PC sviluppatore
CI
VM di test
AWS
VPS alternativo
```

## Valore didattico

Il progetto permette di applicare:

- Software Engineering;
- Advanced Programming;
- DevOps;
- Cloud Engineering;
- Infrastructure as Code.

## Evoluzione incrementale

Non introdurre servizi AWS complessi prima che servano.

---

# 375. Architettura di riferimento — Development

In sviluppo locale:

```text
Developer PC
│
└── Docker Compose
    │
    ├── web
    │   └── React + TypeScript + Vite
    │
    ├── api
    │   └── Node.js + Fastify + TypeScript
    │
    └── postgres
        └── PostgreSQL
```

Comando principale:

```bash
docker compose up -d
```

Obiettivo:

un nuovo sviluppatore deve poter avviare l'intero progetto senza configurare manualmente PostgreSQL o altri servizi.

---

# 376. Architettura di riferimento — Beta AWS

Per la prima beta AWS:

```text
Internet
   │
   ▼
Public DNS / HTTPS
   │
   ▼
AWS EC2
   │
   └── Docker Compose
       │
       ├── Caddy
       ├── web
       ├── api
       └── postgres
            │
            └── persistent volume
```

Questa fase deve essere:

- semplice;
- economica;
- facile da comprendere;
- facile da migrare;
- sufficiente per 10-30 utenti reali.

---

# 377. Architettura di riferimento — AWS avanzata

Dopo validazione della beta:

```text
                    Internet
                       │
                       ▼
                Route 53 / DNS
                       │
                       ▼
               Application Load
                   Balancer
                       │
          ┌────────────┴────────────┐
          │                         │
          ▼                         ▼
      ECS Service               ECS Service
         Web                       API
          │                         │
          └────────────┬────────────┘
                       │
                       ▼
                  RDS PostgreSQL
                       │
                       ▼
                    Backups
```

Container images:

```text
GitHub Actions
      │
      ▼
Amazon ECR
      │
      ▼
Amazon ECS
```

---

# 378. Evoluzione deployment

Roadmap infrastrutturale:

```text
LOCAL DOCKER
↓
GENERIC VM / FREE VM
↓
AWS EC2 + Docker Compose
↓
ECR
↓
ECS
↓
RDS
↓
CloudWatch
↓
Terraform full infrastructure
```

Non saltare direttamente a ECS/RDS senza motivo.

---

# 379. Regola contro la duplicazione architetturale

VolleyStack NON deve mantenere due backend diversi.

Da evitare:

```text
Backend Docker/PostgreSQL
+
Backend Lambda/DynamoDB
```

Motivi:

- doppio dominio;
- doppia logica;
- doppio testing;
- doppio deploy;
- maggiore manutenzione;
- rischio inconsistenze.

L'architettura principale resta:

```text
Node.js API
+
PostgreSQL
```

AWS ospita la stessa architettura.

---

# 380. Backend cloud-agnostic

Il backend non deve importare direttamente SDK AWS nella business logic.

Separazione consigliata:

```text
domain/
application/
infrastructure/
```

Esempio:

```text
application
    │
    ├── UploadAvatarUseCase
    │
    ▼
StoragePort
    │
    ├── LocalStorageAdapter
    └── S3StorageAdapter
```

Questo permette di cambiare provider senza modificare il dominio.

---

# 381. Ports & Adapters

Per servizi esterni usare interfacce/adapter.

Esempi:

```text
EmailProvider
StorageProvider
NotificationProvider
Clock
FileStorage
```

Implementazioni possibili:

```text
LocalEmailProvider
SesEmailProvider

LocalFileStorage
S3FileStorage
```

---

# 382. AWS Services — Fase EC2

Servizi iniziali minimi:

- EC2;
- Security Groups;
- EBS;
- IAM;
- CloudWatch base;
- Route 53 opzionale.

Non introdurre inizialmente:

- ECS;
- RDS;
- ElastiCache;
- SQS;
- SNS;
- Lambda.

---

# 383. AWS Services — Fase avanzata

Servizi possibili:

- ECR;
- ECS;
- RDS PostgreSQL;
- CloudWatch;
- Route 53;
- ACM;
- S3;
- SES;
- Secrets Manager;
- Systems Manager Parameter Store.

Ogni servizio deve avere una motivazione esplicita.

---

# 384. AWS Cost Control

Prima di creare infrastruttura AWS:

- [ ] creare AWS Budget;
- [ ] creare billing alert;
- [ ] verificare free plan / crediti disponibili;
- [ ] impostare alert a soglie basse;
- [ ] documentare risorse create;
- [ ] evitare risorse inattive;
- [ ] eliminare risorse di test non utilizzate.

Soglie consigliate:

```text
$1
$5
$10
```

---

# 385. AWS Account Safety

Checklist:

- [ ] MFA root account;
- [ ] non usare root per attività quotidiane;
- [ ] creare IAM user/role dedicato;
- [ ] least privilege;
- [ ] access key solo se necessaria;
- [ ] non committare credenziali;
- [ ] ruotare segreti;
- [ ] CloudTrail opzionale in fase avanzata.

---

# 386. AWS Region

Scegliere una regione primaria.

Criteri:

- latenza;
- prezzo;
- disponibilità servizi;
- data residency;
- free-tier eligibility.

Per utilizzo italiano valutare una regione europea.

Documentare la scelta in ADR.

---

# 387. ADR — AWS Region

Creare:

```text
docs/adr/ADR-006-aws-region.md
```

Contenuti:

```text
Context
Options
Decision
Cost implications
Latency implications
Data residency
```

---

# 388. Dockerfile frontend

Creare:

```text
docker/Dockerfile.web
```

Multi-stage build:

```text
Node build stage
↓
static production stage
```

Se frontend viene servito dal backend o da Caddy, documentare chiaramente la scelta.

---

# 389. Dockerfile backend

Creare:

```text
docker/Dockerfile.api
```

Requisiti:

- multi-stage;
- production dependencies;
- non-root user;
- health check;
- minimal base image;
- deterministic install.

---

# 390. Docker Compose development

File:

```text
docker-compose.yml
```

Servizi:

```text
web
api
postgres
```

Caratteristiche:

- hot reload;
- development env;
- named volume DB;
- network privata.

---

# 391. Docker Compose production

File:

```text
docker-compose.prod.yml
```

Servizi:

```text
caddy
web
api
postgres
```

Caratteristiche:

- no dev dependency;
- no source mount;
- restart policy;
- production env;
- persistent storage;
- health check;
- resource limits quando opportuno.

---

# 392. Docker Networks

Network consigliate:

```text
frontend_net
backend_net
```

Regola:

PostgreSQL non deve essere pubblicamente raggiungibile.

Solo API può accedere al DB.

---

# 393. Docker Secrets

In locale:

```text
.env
```

In produzione:

preferire:

- AWS Systems Manager Parameter Store;
- AWS Secrets Manager;
- secret file protetto.

Mai inserire password nel Dockerfile.

---

# 394. Health Checks Docker

Web:

```text
HTTP /health
```

API:

```text
GET /health
```

DB:

```text
pg_isready
```

Compose deve usare `depends_on` con health condition dove supportato.

---

# 395. Persistent Storage PostgreSQL

Volume:

```text
postgres_data
```

Non usare filesystem effimero del container.

Documentare:

- mount;
- owner;
- backup;
- restore;
- upgrade.

---

# 396. AWS EC2 Storage

Per PostgreSQL containerizzato su EC2:

```text
EC2
└── EBS volume
    └── PostgreSQL data
```

Non affidarsi esclusivamente allo storage temporaneo dell'istanza.

---

# 397. PostgreSQL Backup su AWS

Fase EC2:

```text
pg_dump
↓
compressed dump
↓
local backup directory
↓
optional S3 copy
```

Policy:

- daily;
- weekly;
- retention.

---

# 398. S3 Backup

In fase beta avanzata:

- [ ] creare bucket privato;
- [ ] block public access;
- [ ] versioning opzionale;
- [ ] lifecycle policy;
- [ ] encryption;
- [ ] IAM minimo.

---

# 399. Restore Drill

Ogni release significativa:

1. prendere backup;
2. creare DB temporaneo;
3. restore;
4. verificare record;
5. verificare login;
6. verificare eventi;
7. verificare Tax/Paste.

---

# 400. Reverse Proxy

Scelta iniziale consigliata:

```text
Caddy
```

Motivi:

- configurazione semplice;
- automatic HTTPS;
- reverse proxy;
- logging.

---

# 401. Caddy Architecture

```text
Internet
  │
  ▼
Caddy :443
  │
  ├── /
  │   └── frontend
  │
  └── /api
      └── backend
```

---

# 402. TLS

Obbligatorio in produzione.

Certificati:

```text
Let's Encrypt
```

Oppure in fase AWS avanzata:

```text
ACM
```

---

# 403. Domain Strategy

Fase iniziale:

- provider hostname;
- free DNS/subdomain;
- IP solo per test.

Fase pubblica:

- dominio dedicato;
- Route 53 opzionale;
- DNS provider alternativo possibile.

---

# 404. Terraform — Decisione

Infrastructure as Code raccomandata.

Cartella:

```text
infrastructure/aws/terraform/
```

Terraform non deve essere introdotto prima di aver compreso manualmente le risorse base.

Strategia:

```text
prima deploy manuale controllato
↓
documentazione
↓
codifica Terraform
```

---

# 405. Terraform Structure

```text
infrastructure/aws/terraform/
│
├── main.tf
├── providers.tf
├── variables.tf
├── outputs.tf
├── network.tf
├── security_groups.tf
├── ec2.tf
├── iam.tf
├── storage.tf
├── dns.tf
└── versions.tf
```

---

# 406. Terraform State

Non committare:

```text
terraform.tfstate
```

Fase personale:

state locale protetto.

Fase avanzata:

backend remoto S3 + locking appropriato.

---

# 407. Terraform Variables

Mai hardcodare:

- password;
- token;
- secret.

Usare:

```text
TF_VAR_*
```

oppure secure secret injection.

---

# 408. Terraform Outputs

Output utili:

```text
public_ip
public_dns
application_url
```

Non mostrare secret.

---

# 409. Terraform Plan Workflow

Prima di applicare:

```bash
terraform fmt
terraform validate
terraform plan
```

Solo dopo:

```bash
terraform apply
```

---

# 410. Infrastructure PR

Ogni modifica infrastrutturale deve indicare:

- risorsa aggiunta;
- motivo;
- costo previsto;
- rischio;
- rollback.

---

# 411. GitHub Actions — CI

Workflow:

```text
push / pull request
↓
install
↓
lint
↓
typecheck
↓
unit test
↓
integration test
↓
build
```

---

# 412. GitHub Actions — Docker Build

Workflow opzionale:

```text
merge main
↓
build web image
↓
build api image
↓
scan
↓
push registry
```

---

# 413. Container Registry

Fase iniziale:

possibile GitHub Container Registry.

Fase AWS:

```text
Amazon ECR
```

---

# 414. ECR

Repository:

```text
volleystack-web
volleystack-api
```

Tag:

```text
git-sha
semantic-version
latest
```

Non usare soltanto `latest`.

---

# 415. Image Tagging

Esempio:

```text
volleystack-api:0.5.0
volleystack-api:8f231ca
```

Permette rollback.

---

# 416. Container Security Scan

Prima deploy:

- dependency audit;
- image scan;
- non-root user;
- no embedded secrets.

---

# 417. AWS EC2 Deployment Workflow

Prima versione:

```text
GitHub
↓
CI
↓
build/test
↓
SSH deploy controlled
↓
docker compose pull
↓
docker compose up -d
↓
health check
```

In futuro evitare SSH manuale con strumenti più robusti.

---

# 418. Zero-Downtime Consideration

Non prioritario in beta.

Per beta accettabile:

```text
brief restart
```

Fase ECS:

rolling deployment.

---

# 419. Rollback EC2

Procedura:

1. mantenere image tag precedente;
2. modificare version;
3. `docker compose up -d`;
4. verificare health.

Migration DB incompatibile richiede piano separato.

---

# 420. Database Migration Safety

Prima di deploy migration:

- backup;
- review;
- test staging;
- forward compatibility quando possibile.

Preferire:

```text
expand
↓
deploy code
↓
migrate data
↓
contract
```

per cambi complessi.

---

# 421. Staging

Fase iniziale:

staging locale.

Fase avanzata:

ambiente AWS separato o stack ridotto.

Non condividere DB production.

---

# 422. Environment Naming

```text
development
test
staging
production
```

---

# 423. AWS Tags

Ogni risorsa AWS deve avere almeno:

```text
Project=VolleyStack
Environment=production
ManagedBy=Terraform
Owner=<team/project>
```

Serve anche per cost tracking.

---

# 424. CloudWatch

Fase AWS:

monitorare:

- CPU;
- disk;
- container logs;
- API errors;
- restart count.

---

# 425. Application Metrics

Metriche backend:

- request count;
- error rate;
- latency;
- DB connection errors.

---

# 426. Alerting

Alert minimo:

- app unavailable;
- disk near full;
- backup failed;
- high error rate.

---

# 427. RDS Migration Path

Quando passiamo da PostgreSQL containerizzato a RDS:

```text
PostgreSQL Docker
↓
pg_dump
↓
RDS PostgreSQL
↓
restore
↓
DATABASE_URL update
```

Il codice applicativo non deve cambiare.

---

# 428. Perché PostgreSQL resta centrale

VolleyStack ha relazioni naturali tra:

- users;
- teams;
- members;
- events;
- attendance;
- fines;
- payments;
- pastries;
- matches.

Quindi PostgreSQL resta il database primario.

Non cambiare datastore solo per adeguarsi ad AWS.

---

# 429. ECS Migration Path

```text
Docker Compose
↓
same Docker images
↓
ECR
↓
ECS task definitions
↓
ECS services
```

Obiettivo:

riutilizzare le stesse immagini.

---

# 430. ECS Components

Possibili:

- ECS Cluster;
- Task Definition web;
- Task Definition api;
- Service web;
- Service api;
- ALB;
- Target Groups;
- IAM Task Roles.

---

# 431. ECS Fargate vs ECS EC2

Valutare quando necessario.

## Fargate

Pro:

- meno gestione server.

Contro:

- costo.

## EC2-backed ECS

Pro:

- più controllo;
- può essere più economico in alcuni scenari.

Contro:

- più gestione.

Non decidere prima di avere traffico reale.

---

# 432. Cost Evaluation Gate

Prima di passare da EC2 Compose a ECS/RDS:

calcolare:

- costo mensile stimato;
- utenti attivi;
- traffico;
- benefit operativo;
- effort.

Migrare solo se il beneficio supera la complessità.

---

# 433. Free / Low-Cost Deployment Strategy

Ordine raccomandato:

```text
Local Docker
↓
free/cheap generic VM if needed
↓
AWS Free Plan credits
↓
EC2 beta
↓
decision based on real usage
```

Non assumere che AWS rimanga gratuito indefinitamente.

---

# 434. Cost Documentation

Creare:

```text
docs/infrastructure/COSTS.md
```

Contenuti:

- risorsa;
- tier;
- costo stimato;
- free quota;
- alert;
- data verifica.

---

# 435. AWS Billing Review

Mensile durante beta:

- Cost Explorer;
- Budgets;
- unused resources;
- EBS volumes orphaned;
- elastic IP;
- snapshots;
- data transfer.

---

# 436. Provider Independence Test

Ogni 3-6 mesi verificare:

```text
Could VolleyStack run on a generic Ubuntu VM?
```

Se risposta è no:

documentare perché.

---

# 437. Generic VM Deployment

Procedura target:

```bash
git clone <repository>
cp .env.example .env
docker compose -f docker-compose.prod.yml up -d
```

Con minime configurazioni.

---

# 438. Mobile App Evolution

Futuro:

```text
apps/mobile/
```

Stack candidato:

- React Native;
- Expo;
- TypeScript.

Riutilizzare:

```text
packages/domain
packages/api-client
packages/validation
packages/types
```

---

# 439. Shared Code

Condividere tra web e mobile:

- DTO;
- API types;
- Zod schemas;
- enums;
- validation;
- domain utilities;
- API client.

Non condividere forzatamente componenti UI se crea complessità.

---

# 440. Backend Stability for Mobile

Prima di mobile:

- API versioning;
- stable contracts;
- OpenAPI;
- auth mobile-compatible;
- refresh tokens;
- CORS adjusted where relevant.

---

# 441. Authentication Evolution

In Docker/EC2 beta:

possibile auth interna.

In futuro:

- mantenere auth interna;
- oppure introdurre provider esterno tramite adapter.

Non legare business logic a Cognito.

---

# 442. AWS Cognito — Opzionale

Cognito può essere sperimentato come alternativa futura.

Se introdotto:

```text
AuthProvider interface
├── LocalAuthProvider
└── CognitoAuthProvider
```

Decisione tramite ADR.

---

# 443. AWS S3 — Opzionale

Per:

- avatar;
- logo;
- backup;
- attachment futuri.

Usare adapter.

---

# 444. AWS SES — Opzionale

Per:

- verifica email;
- reset password;
- inviti.

Backend deve dipendere da:

```text
EmailProvider
```

non direttamente da SES.

---

# 445. Local Development Equivalents

AWS service | Local equivalent

```text
S3          → filesystem/minio opzionale
SES         → mailhog
RDS         → postgres container
ECS         → docker compose
```

Questo preserva developer experience.

---

# 446. Local Email Testing

Aggiungere opzionalmente:

```text
MailHog
```

in development.

---

# 447. MinIO

Non necessario V1.

Possibile se vogliamo testare API S3-compatible localmente.

---

# 448. Infrastructure Documentation

Nuova cartella:

```text
docs/infrastructure/
```

File:

```text
LOCAL_DOCKER.md
AWS_EC2.md
AWS_ECS.md
RDS_MIGRATION.md
BACKUP_RESTORE.md
COSTS.md
TERRAFORM.md
```

---

# 449. Cloud Architecture Diagram

Produrre diagramma versionato.

Versioni:

```text
ARCH-LOCAL-v1
ARCH-AWS-EC2-v1
ARCH-AWS-ECS-v1
```

---

# 450. Deployment Diagram UML

Documentare:

```text
Client
→ Reverse Proxy
→ Web/API
→ PostgreSQL
```

e versione AWS.

---

# 451. ADR nuove

Creare:

```text
ADR-006-docker-first.md
ADR-007-aws-as-deployment-target.md
ADR-008-postgresql-over-dynamodb.md
ADR-009-ec2-before-ecs.md
ADR-010-terraform.md
```

---

# 452. ADR-006 — Docker-first

Decision:

VolleyStack sarà containerizzato fin dall'inizio.

Motivi:

- portability;
- reproducibility;
- local/prod parity;
- cloud independence.

---

# 453. ADR-007 — AWS as Deployment Target

Decision:

AWS non fa parte del core domain.

È una destinazione di deploy.

---

# 454. ADR-008 — PostgreSQL over DynamoDB

Decision:

PostgreSQL rimane datastore principale.

Motivi:

- dominio relazionale;
- query;
- consistenza;
- semplicità del modello;
- portabilità.

---

# 455. ADR-009 — EC2 before ECS

Decision:

La beta AWS usa EC2 + Docker Compose.

ECS verrà valutato dopo validazione.

---

# 456. ADR-010 — Terraform

Decision:

Infrastructure as Code con Terraform dopo comprensione/manual deployment iniziale.

---

# 457. Nuove User Stories DevOps

## US-OPS-001

```text
Come sviluppatore
voglio avviare l'intero sistema con Docker Compose
così da avere un ambiente riproducibile.
```

Acceptance Criteria:

```gherkin
Given Docker installato
When eseguo docker compose up
Then web, api e database diventano healthy
And l'app è raggiungibile localmente
```

---

# 458. US-OPS-002

```text
Come maintainer
voglio distribuire VolleyStack su AWS EC2 usando le stesse immagini Docker
così da evitare differenze tra sviluppo e produzione.
```

---

# 459. US-OPS-003

```text
Come maintainer
voglio ripristinare il database da backup
così da recuperare il servizio in caso di perdita dati.
```

---

# 460. US-OPS-004

```text
Come maintainer
voglio ricevere un alert se il costo AWS supera una soglia
così da evitare spese impreviste.
```

---

# 461. Non-Functional Requirements — Deployment

```text
NFR-DEP-001
VolleyStack deve essere eseguibile tramite Docker Compose.
```

```text
NFR-DEP-002
La business logic non deve dipendere da servizi proprietari AWS.
```

```text
NFR-DEP-003
Il deployment deve essere riproducibile da documentazione e Infrastructure as Code.
```

---

# 462. NFR — Availability Beta

Per beta privata:

target ragionevole:

```text
best effort
```

Non serve SLA enterprise.

---

# 463. NFR — Recovery

Definire inizialmente:

```text
RPO <= 24h
RTO <= 4h
```

per beta amatoriale.

Rivalutare in futuro.

---

# 464. Security — EC2

Checklist:

- [ ] SSH limitato;
- [ ] no password SSH;
- [ ] key-based access;
- [ ] porta PostgreSQL non pubblica;
- [ ] solo 80/443 pubbliche;
- [ ] 22 limitata se necessaria;
- [ ] automatic security updates;
- [ ] fail2ban opzionale;
- [ ] root login disabilitato.

---

# 465. Security Group

Inbound:

```text
80/tcp   public
443/tcp  public
22/tcp   restricted/admin only
```

NON:

```text
5432/tcp public
```

---

# 466. EC2 Hardening

- non-root application user;
- Docker group controllato;
- update OS;
- log rotation;
- disk monitoring;
- unattended upgrades valutati.

---

# 467. Secrets Rotation

Documentare:

- JWT secret;
- DB password;
- cloud credentials;
- email credentials.

---

# 468. Disaster Recovery Lite

Scenario:

```text
EC2 destroyed
```

Recovery:

1. nuova VM;
2. install Docker;
3. repository/images;
4. restore `.env` securely;
5. restore DB;
6. DNS update;
7. health check.

---

# 469. Disaster Recovery Test

Simulare almeno una volta prima di considerare produzione stabile.

---

# 470. AWS-to-Other-Provider Migration

Scenario:

```text
AWS
↓
generic VPS
```

Serve solo:

- container images;
- environment variables;
- DB dump;
- persistent files;
- DNS.

---

# 471. Local-to-AWS Consistency

Controllare che:

- Node version;
- PostgreSQL version;
- env names;
- migration process;
- build process;

siano equivalenti.

---

# 472. Production Image Principle

Build once:

```text
image
```

promote same artifact:

```text
staging
↓
production
```

Non rebuildare codice diverso in produzione se evitabile.

---

# 473. Container Version Pinning

Evitare:

```text
postgres:latest
node:latest
```

Usare versioni specifiche.

---

# 474. Database Version Pinning

Esempio:

```text
postgres:17.x
```

Upgrade intenzionale e testato.

---

# 475. Dependency Updates

Usare tool automatici opzionali:

- Dependabot;
- Renovate.

PR automatiche ma merge controllato.

---

# 476. AWS SDK Isolation

Se usato:

solo in:

```text
infrastructure/aws/
```

o adapter dedicati.

---

# 477. Observability Correlation

Generare:

```text
request_id
```

per ogni richiesta.

Propagare nei log.

---

# 478. CloudWatch Log Groups

Separare:

```text
/volleystack/web
/volleystack/api
```

Se ECS.

---

# 479. Deployment Acceptance Criteria — EC2

EC2 beta considerata pronta se:

- [ ] HTTPS;
- [ ] app raggiungibile;
- [ ] DB persistente;
- [ ] backup funzionante;
- [ ] restore testato;
- [ ] budget alert;
- [ ] security group corretto;
- [ ] health check;
- [ ] deploy documentato;
- [ ] rollback documentato.

---

# 480. Deployment Acceptance Criteria — ECS/RDS

Avanzato pronto se:

- [ ] ECR;
- [ ] task definitions;
- [ ] ECS services;
- [ ] ALB;
- [ ] RDS;
- [ ] secrets;
- [ ] metrics;
- [ ] logs;
- [ ] backup;
- [ ] Terraform;
- [ ] rolling deployment;
- [ ] rollback.

---

# 481. Updated Project Roadmap

Nuova roadmap complessiva:

```text
DISCOVERY
↓
SURVEY
↓
INTERVIEWS
↓
REQUIREMENTS
↓
USER STORIES
↓
LOW-FI PROTOTYPE
↓
USABILITY TEST
↓
HIGH-FI PROTOTYPE
↓
VALIDATION
↓
DOCKER FOUNDATION
↓
CORE DEVELOPMENT
↓
LOCAL BETA
↓
AWS EC2 BETA
↓
USER EVALUATION
↓
ITERATION
↓
ECR / ECS / RDS OPTIONAL
↓
MOBILE APP
```

---

# 482. Parallel Workstreams

Il progetto può procedere su tre binari:

## Product / UX

```text
research
stories
prototype
testing
```

## Software Engineering

```text
domain
API
frontend
tests
```

## DevOps / Cloud

```text
Docker
CI
EC2
Terraform
ECS
```

Le tre aree devono convergere nelle milestone.

---

# 483. Milestone M0 — Research

Deliverables:

- discovery survey;
- interviews;
- findings;
- proto-personas;
- prioritized needs.

---

# 484. Milestone M1 — Prototype

Deliverables:

- low-fi;
- usability test;
- findings;
- high-fi;
- validated main flows.

---

# 485. Milestone M2 — Docker Foundation

Deliverables:

```text
docker compose up
```

avvia:

- web;
- api;
- postgres.

---

# 486. Milestone M3 — Local MVP

Funzioni:

- auth;
- team;
- events;
- RSVP;
- attendance;
- Tax;
- Paste;
- dashboard.

---

# 487. Milestone M4 — Local Beta

Intera squadra può usare l'app in ambiente controllato.

---

# 488. Milestone M5 — AWS EC2 Beta

Deliverables:

- EC2;
- Docker Compose production;
- Caddy;
- HTTPS;
- backup;
- monitoring;
- cost alert.

---

# 489. Milestone M6 — Validation

Dopo almeno 2 settimane:

- beta survey;
- usage analysis;
- interview;
- backlog revision.

---

# 490. Milestone M7 — AWS Advanced

Solo se giustificato:

- ECR;
- ECS;
- RDS;
- CloudWatch;
- Terraform.

---

# 491. Milestone M8 — Mobile

React Native/Expo client sullo stesso backend.

---

# 492. Academic/Portfolio Narrative aggiornata

VolleyStack può dimostrare:

```text
User-Centered Design
+
Requirements Engineering
+
Software Architecture
+
Advanced Programming
+
Testing
+
Containerization
+
CI/CD
+
Cloud Deployment
+
Infrastructure as Code
```

---

# 493. Portfolio Architecture Story

Possibile narrazione:

```text
Phase 1:
Validated user needs through surveys and usability tests.

Phase 2:
Built a containerized modular web application.

Phase 3:
Deployed the same artifacts to AWS EC2.

Phase 4:
Evolved infrastructure toward ECS/RDS using Terraform.

Phase 5:
Reused backend for a mobile client.
```

---

# 494. Updated Technology Stack

## Product

- user research;
- user stories;
- Figma;
- usability testing.

## Frontend

- React;
- TypeScript;
- Vite;
- Tailwind;
- PWA.

## Backend

- Node.js;
- Fastify;
- TypeScript;
- Prisma.

## Database

- PostgreSQL.

## DevOps

- Docker;
- Docker Compose;
- GitHub Actions.

## AWS

- EC2;
- EBS;
- IAM;
- Security Groups;
- CloudWatch;
- ECR;
- ECS;
- RDS;
- S3 optional;
- Route 53 optional.

## IaC

- Terraform.

## Mobile future

- React Native;
- Expo.

---

# 495. Cost Philosophy

VolleyStack deve essere progettato per funzionare con costi minimi.

Regola:

```text
Do not introduce paid infrastructure
before a validated product need exists.
```

Durante prototipo/beta:

preferire free tier/credits o alternative gratuite.

---

# 496. Cloud Cost as Non-Functional Requirement

```text
NFR-COST-001
L'architettura beta deve minimizzare il costo operativo
e deve poter essere disattivata senza perdere i dati.
```

```text
NFR-COST-002
Ogni nuova risorsa cloud deve avere costo stimato documentato.
```

---

# 497. Architecture Review Gate

Prima di introdurre una nuova tecnologia chiedere:

1. quale problema risolve?
2. esiste già una soluzione nello stack?
3. aumenta il costo?
4. aumenta la manutenzione?
5. migliora davvero reliability/performance?
6. è coerente con lo scope attuale?

---

# 498. Technology Rejection Log

Documentare anche tecnologie valutate ma rifiutate.

Esempi:

```text
Kubernetes — rejected for V1
DynamoDB — rejected as primary DB
Redis — deferred
Kafka — rejected
Lambda backend rewrite — rejected
```

---

# 499. Architecture Principle — Boring Technology

Preferire tecnologia stabile e comprensibile.

VolleyStack non deve diventare un catalogo di buzzword.

Il valore principale resta il prodotto.

---

# 500. Nuovo obiettivo tecnico iniziale

Dopo la fase UX iniziale:

```text
git clone
↓
docker compose up
↓
web healthy
↓
api healthy
↓
postgres healthy
```

Poi:

```text
same repository
↓
same images
↓
AWS EC2
```

Questo diventa il principio operativo ufficiale del progetto.

---

# 501. Stato architetturale aggiornato

```text
Project: VolleyStack
Architecture: Docker-first
Primary DB: PostgreSQL
Cloud Strategy: AWS-deployable
Initial Cloud Target: EC2
Advanced Cloud Target: ECS + RDS
Infrastructure as Code: Terraform
Mobile Strategy: React Native / Expo
Backend Reuse: Required
Vendor Lock-in: Minimized
```

---

# 502. Decisione finale

VolleyStack sarà sviluppato come applicazione portabile e containerizzata.

Il percorso tecnico ufficiale è:

```text
Docker local
→
Docker production
→
AWS EC2
→
ECR/ECS/RDS if justified
→
React Native mobile client
```

La ricerca utenti e la validazione del prodotto restano parallele allo sviluppo.

L'infrastruttura deve supportare il prodotto, non guidarlo.

