# Guida al Deployment a Budget 0 € (Zero Cost Architecture)

VolleyStack è progettato per funzionare a **0 € di costo fisso e variabile**, sfruttando i migliori Free Tier "Always Free" del settore cloud.

---

## 🏛️ L'Architettura Consigliata: "Zero Server, Zero Costi"

| Componente | Provider | Piano / Free Tier | Costo Mensile | Vantaggi |
| :--- | :--- | :--- | :--- | :--- |
| **Database PostgreSQL** | **Neon** | Free Tier (EU Frankfurt) | **0 €** | 0.5 GB di storage, scale-to-zero, branching, backup e pooler integrato. |
| **Backend API (Fastify)** | **Google Cloud Run** *(oppure Render)* | Always Free (2M req/mese) | **0 €** | Scala a 0 quando l'app non è usata: zero consumo di risorse = zero addebito. |
| **Frontend Web (React/Vite)** | **Cloudflare Pages** *(oppure Vercel)* | Free Tier | **0 €** | CDN globale, SSL HTTPS automatico, deploy continuo da GitHub ad ogni commit. |
| **Intelligenza Artificiale** | **Google AI Studio (Gemini)** | Free Tier (`gemini-1.5-flash`) | **0 €** | 15 req/min e 1.500 req/giorno gratis (ideale per paste e annunci). |

---

## 1. Database: Neon PostgreSQL (Già Configurato e Migrato ✅)

Il tuo database è già attivo su Neon nel progetto `still-haze-33820233`:
- **Branch**: `production`
- **Regione**: `eu-central-1` (Francoforte)
- **Tabelle create**: 15 tabelle del modello relazionale (Users, Teams, Events, Fines, Payments, Roles, etc.)
- **Dati iniziali**: Inseriti con successo tramite `pnpm run db:seed` (Utente Coach demo: `coach@volleystack.it`, Password: `Password123!`).

### Variabili d'ambiente Database
Nel tuo file `.env` e nel server di produzione:
```bash
# Connessione con pooler (porta 6543) per le richieste dell'API:
DATABASE_URL="postgresql://neondb_owner:npg_5Jz2SXhrBupk@ep-flat-cake-bave4n5y-pooler.c-8.eu-central-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require"

# Connessione diretta (porta 5432) per migrazioni Prisma:
DATABASE_URL_UNPOOLED="postgresql://neondb_owner:npg_5Jz2SXhrBupk@ep-flat-cake-bave4n5y.c-8.eu-central-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require"
```

---

## 2. Frontend Web: Deploy su Cloudflare Pages o Vercel (0 €)

### Opzione A: Cloudflare Pages (Consigliata)
1. Vai su [dash.cloudflare.com](https://dash.cloudflare.com/) → **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**.
2. Seleziona il repository GitHub `webrain25/volleystack`.
3. Configura le impostazioni di Build:
   - **Framework preset**: `Vite`
   - **Root directory**: `apps/web`
   - **Build command**: `pnpm build`
   - **Build output directory**: `dist`
4. Nella sezione **Environment variables**, aggiungi:
   - `VITE_API_URL`: L'URL del tuo backend (es. `https://volleystack-api-xxxx-ew.a.run.app` o il tuo dominio).
5. Clicca **Save and Deploy**. 
   *(Il file `apps/web/public/_redirects` incluso nel repository gestisce automaticamente il routing SPA senza errori 404 sui refresh).*

### Opzione B: Vercel
1. Vai su [vercel.com](https://vercel.com/) → **Add New Project** → Importa `webrain25/volleystack`.
2. Imposta:
   - **Root Directory**: `apps/web`
   - **Framework Preset**: `Vite`
   - **Environment Variables**: `VITE_API_URL` con l'indirizzo del backend.
3. Clicca **Deploy**. *(Il file `apps/web/vercel.json` gestisce automaticamente i rewrite).*

---

## 3. Backend API: Deploy su Google Cloud Run (0 €)

Google Cloud Run consente di eseguire container Docker pagando **solo per i millisecondi in cui il server elabora una richiesta**. Se non ci sono richieste, le istanze scalano a zero e il costo è esattamente **0,00 €**.

### Passo 1: Autenticazione Google Cloud
Assicurati di avere la CLI `gcloud` installata sul tuo computer (oppure usa la Cloud Shell sul browser):
```bash
gcloud auth login
gcloud config set project IL_TUO_PROJECT_ID_GCP
```

### Passo 2: Build e Deploy dell'API
Dalla cartella principale del progetto:
```bash
gcloud run deploy volleystack-api \
  --source . \
  --region europe-west1 \
  --platform managed \
  --allow-unauthenticated \
  --set-env-vars NODE_ENV=production,PORT=8080 \
  --set-env-vars DATABASE_URL="postgresql://neondb_owner:npg_5Jz2SXhrBupk@ep-flat-cake-bave4n5y-pooler.c-8.eu-central-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require" \
  --set-env-vars DATABASE_URL_UNPOOLED="postgresql://neondb_owner:npg_5Jz2SXhrBupk@ep-flat-cake-bave4n5y.c-8.eu-central-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require" \
  --set-env-vars JWT_SECRET="un_segreto_molto_lungo_e_sicuro_12345" \
  --set-env-vars GEMINI_API_KEY="tua_chiave_google_ai_studio" \
  --min-instances 0 \
  --max-instances 2
```
> [!TIP]
> Il parametro `--min-instances 0` è ciò che garantisce che il servizio scali a zero quando non riceve traffico, azzerando completamente i costi.

Al termine del comando, Google ti restituirà un URL pubblico HTTPS come `https://volleystack-api-xxxx.a.run.app`. Inserisci questo URL come `VITE_API_URL` nel Frontend!

---

## 4. Deploy Alternativo con Docker (Su VM Always Free)

Se preferisci mantenere tutto in un unico server Linux (es. istanza **Oracle Cloud Always Free** o **GCP Compute Engine e2-micro**):

1. Clona il repo sul server:
   ```bash
   git clone https://github.com/webrain25/volleystack.git
   cd volleystack
   cp .env.example .env
   nano .env  # Inserisci le tue stringhe Neon e il JWT_SECRET
   ```
2. Modifica il dominio nel `Caddyfile` se hai un dominio personalizzato (es. `app.volleystack.it`).
3. Avvia lo stack:
   ```bash
   docker compose -f docker-compose.prod.yml up -d --build
   ```
> [!NOTE]
> Poiché il database è ospitato su Neon in cloud, il container PostgreSQL locale è stato rimosso da `docker-compose.prod.yml`. Il consumo di RAM sul server scende a meno di **150 MB**, rendendo il sistema fluido e stabile anche sulle macchine virtuali gratuite più piccole.

---

## 5. Manutenzione e Comandi Utili

```bash
# Eseguire il seed iniziale o ripristinare i dati di default su Neon:
pnpm run db:seed

# Verificare lo stato o sincronizzare modifiche allo schema Prisma:
pnpm prisma db push

# Aprire l'interfaccia visuale Prisma Studio per navigare i dati di Neon:
pnpm prisma studio
```
