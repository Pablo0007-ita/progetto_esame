This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

# 🚚 progetto_esame Monitor — MVP Roadmap

Questo documento definisce la tabella di marcia per l’MVP di **progetto solar**, una piattaforma per monitorare mezzi, viaggi, consumi e ottimizzare le rotte tramite analisi statistiche e integrazioni esterne.

---

## 🎯 Obiettivo dell’MVP

Realizzare un dashboard funzionante che permetta di:

- visualizzare impianti e produzione
- analizzare i chilometri percorsi per destinazione
- integrare dati meteo in tempo reale
- fornire insight utili per l’ottimizzazione logistica

---

## 🧱 Architettura MVP

- **Frontend:** Next.js (App Router), React, Tailwind CSS  
- **Backend:** API Routes Next.js  
- **Database:** MySQL  
- **Integrazioni:** Open‑Meteo (geocoding + meteo attuale)  
- **Linguaggio:** TypeScript  

---

## 🗂️ Roadmap MVP

### ✔ Completato
- Setup progetto Next.js + Tailwind  
- Connessione MySQL e configurazione DB  
- Tabella `impianti` + inserimento tramite form  
- Tabella `produzione`  
- API `/api/produzione` (GET + POST)  
- API `/api/impianti` con aggregazione km per destinazione  
- Integrazione meteo Open‑Meteo per ogni destinazione  
- Refactor componenti base  

---

### 🚧 In corso
- Dashboard con sidebar e navigazione modulare  
- KPI principali ( consumi, media km/l)  
- Miglioramento UI tabelle e layout responsive  
- Caching meteo per ridurre chiamate API  

---

### 📅 Da implementare
- Grafici (Chart.js) per analisi visive  
- Filtri avanzati (mezzo, data, destinazione)  
- Calcolo costi carburante  
- Autenticazione utenti (NextAuth)  
- Ruoli e permessi (admin / operatore)  
- Deploy su Vercel  
- Documentazione API completa  

---

## 📊 KPI previsti nell’MVP

- Totale km percorsi  
- Km per destinazione  
- Consumo medio (km/l)  
- Litri totali consumati  
- Meteo destinazioni (supporto decisionale)  

---

## 📝 Note tecniche

- Le API sono implementate tramite route handlers (`app/api/.../route.ts`)  
- Il meteo viene caricato client‑side per evitare rate limit  
- Possibile ottimizzazione futura: caching server-side  
- Struttura modulare per facilitare estensioni future  

---
