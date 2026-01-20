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
- analizzare la produzione per ogni impianto
- integrare dati meteo Open-Meteo (Solare):


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
- Dashboard con CARD che vanno alla singolo impianto  
- KPI principali ( Kwh, ora_funzionamento)  
- Miglioramento UI tabelle e layout responsive  
- Caching meteo 

---

### 📅 Da implementare
- Filtri avanzati (mezzo, data, destinazione)  
- Deploy su Vercel  
- Documentazione API completa  

---

## 📊 KPI previsti nell’MVP

1. Totale kWh prodotti
Misura la quantità totale di energia generata da un impianto in un periodo.
- Calcolo: somma di kwh_prodotti per impianto
- Utilità: valutare la resa complessiva e confrontare impianti diversi

2. Performance Ratio (PR)
Indica l’efficienza dell’impianto rispetto al suo potenziale teorico.
Formula adottata nell’MVP:
PR=\frac{kWh\_ prodotti/ore\_ funzionamento}{capacita\_ max\_ kw}
- PR alto (0.75–1.0) → impianto efficiente
- PR medio (0.30–0.75) → produzione ridotta
- PR basso (< 0.30) → possibile guasto o anomalia

3. Radiazione solare (Open‑Meteo)
Valore di irraggiamento giornaliero recuperato tramite API.
- Serve per confrontare produzione vs potenziale solare
- Se radiazione alta + PR basso → allarme guasto

4. Ultima data di guasto
Data dell’ultima rilevazione in cui il PR è sceso sotto la soglia critica.
- Permette di monitorare la continuità operativa
- Utile per manutenzione e diagnosi

---

## 📝 Note tecniche

- Le API sono implementate tramite route handlers (`app/api/.../route.ts`)  
- Il meteo viene caricato client‑side per evitare rate limit  
- Possibile ottimizzazione futura: caching server-side  
- Struttura modulare per facilitare estensioni future  

---
