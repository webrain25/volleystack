# Guida al Deployment su AWS EC2 (Milestone M5)

Questa guida illustra come effettuare il deploy di VolleyStack su una singola istanza AWS EC2 usando `docker-compose`.

## 1. Provisioning dell'Istanza EC2

1. Accedi alla console AWS.
2. Crea una nuova istanza EC2 (**Ubuntu 22.04 o 24.04 LTS**).
3. Scegli un'istanza adeguata per la fase Beta (es. `t3.micro` o `t3.small` per restare nel Free Tier o a basso costo).
4. Configura il **Security Group** per consentire il traffico in ingresso sulle porte:
   - `22` (SSH) - Preferibilmente solo dal tuo IP.
   - `80` (HTTP) - Ovunque (0.0.0.0/0).
   - `443` (HTTPS) - Ovunque (0.0.0.0/0).
5. Scarica la chiave SSH `.pem` per accedere all'istanza.

## 2. Configurazione del Server (SSH)

Collegati alla macchina EC2:
```bash
ssh -i "tua-chiave.pem" ubuntu@<IP_PUBBLICO_EC2>
```

Installa Docker e Docker Compose:
```bash
# Aggiorna i pacchetti
sudo apt-get update
sudo apt-get upgrade -y

# Installa Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Aggiungi il tuo utente al gruppo docker
sudo usermod -aG docker ubuntu
```
*(Chiudi la connessione SSH e rientra affinché i permessi abbiano effetto).*

## 3. Preparazione del Progetto

1. Clona il repository del progetto (o usa scp per trasferire i file).
```bash
git clone <URL_DEL_TUO_REPO> VolleyStack
cd VolleyStack
```

2. Configura le variabili d'ambiente di produzione:
```bash
cp .env.example .env
nano .env
```
Assicurati di impostare:
- `JWT_SECRET`: usa una stringa crittografata forte e unica.
- `POSTGRES_PASSWORD`: password complessa per il DB.

3. Configura il dominio nel `Caddyfile`:
Apri il file `Caddyfile` e sostituisci `localhost` con il tuo dominio pubblico (es. `app.volleystack.it`) e inserisci il tuo indirizzo email in cima al file. Questo permetterà a Caddy di negoziare automaticamente i certificati SSL con Let's Encrypt.

## 4. Avvio dell'Infrastruttura

Avvia i container in background:
```bash
docker compose -f docker-compose.prod.yml up -d --build
```
Al primo avvio, Docker compilerà le immagini per l'API (eseguendo `prisma generate`) e per il frontend Web (eseguendo `npm run build`).

Puoi controllare i log con:
```bash
docker compose -f docker-compose.prod.yml logs -f
```

## 5. Migrazione del Database

Al primo avvio, il database sarà vuoto. Devi lanciare le migrazioni Prisma tramite il container dell'API:
```bash
docker compose -f docker-compose.prod.yml exec api npx prisma db push
```
*(Usa `db push` per il beta o `migrate deploy` se stai usando i file di migrazione SQL).*

## 6. Backup e Monitoring

1. Rendi eseguibile lo script di backup:
```bash
chmod +x scripts/backup.sh
```

2. Configura un Cronjob per il backup notturno:
```bash
crontab -e
```
Aggiungi in fondo al file:
```text
0 3 * * * /home/ubuntu/VolleyStack/scripts/backup.sh >> /home/ubuntu/backup.log 2>&1
```

3. (Consigliato) Configura un **AWS Billing Alarm** in CloudWatch per ricevere un'email se la spesa stimata del mese supera $5, coerentemente con il *Cost Philosophy* del Master Plan.
Puoi usare lo script fornito:
```bash
chmod +x scripts/setup_cost_alert.sh
./scripts/setup_cost_alert.sh tua-email@example.com 5.0
```
(Assicurati di aver configurato `aws-cli` sull'istanza o di eseguirlo dal tuo computer locale con le credenziali corrette).

4. Configura il Monitoring:
Rendi eseguibile lo script di monitoring:
```bash
chmod +x scripts/monitoring.sh
```
Puoi eseguirlo manualmente per controllare lo stato dell'istanza o aggiungerlo a cron per salvare l'output periodicamente.
```bash
./scripts/monitoring.sh
```
