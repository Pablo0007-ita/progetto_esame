import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// ======================================================
// GET /api/produzione?id_impianto=1
// Recupera la produzione di un impianto specifico + PR
// ======================================================

// --- Funzione Meteo ---
async function getRadiazioneSolare(lat: number, lon: number) {
  try {
    const url = `https://api.openmeteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=shortwave_radiation_sum&timezone=auto`;
    const res = await fetch(url);

    if (!res.ok) return 0;

    const meteo = await res.json();
    return meteo?.daily?.shortwave_radiation_sum?.[0] ?? 0;

  } catch (err) {
    console.error("Errore meteo:", err);
    return 0;
  }
}

// --- API GET ---
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id_impianto = searchParams.get("id_impianto");

    if (!id_impianto) {
      return NextResponse.json(
        { error: "Parametro id_impianto mancante" },
        { status: 400 }
      );
    }

    const [rows] = await db.query(
      `
      SELECT 
        p.id,
        p.data,
        p.kwh_prodotti,
        p.ore_funzionamento,
        i.capacita_max_kw,
        i.latitudine,
        i.longitudine
      FROM produzione p
      JOIN impianti i ON p.id_impianto = i.id
      WHERE p.id_impianto = ?
      ORDER BY p.data DESC
      `,
      [id_impianto]
    );

    const produzione = rows as any[];

    if (produzione.length === 0) {
      return NextResponse.json({
        id_impianto,
        produzione: [],
        performance_ratio_medio: 0,
        radiazione: 0,
        allarme_guasto: false,
        ultima_data_guasto: null,
      });
    }

    // --- Calcolo PR ---
    const pr_values = produzione.map((r) => {
      const kwh = Number(r.kwh_prodotti);
      const ore = Number(r.ore_funzionamento);
      const cap = Number(r.capacita_max_kw);

      if (ore === 0 || cap === 0) return 0;
      return (kwh / ore) / cap;
    });

    const performance_ratio_medio =
      pr_values.reduce((sum, v) => sum + v, 0) / pr_values.length;

    // --- Meteo ---
    const lat = produzione[0].latitudine;
    const lon = produzione[0].longitudine;
    const radiazione = await getRadiazioneSolare(lat, lon);

    // --- Ultimo guasto ---
    let ultima_data_guasto: string | null = null;
    for (let i = produzione.length - 1; i >= 0; i--) {
      if (pr_values[i] < 0.3) {
        ultima_data_guasto = produzione[i].data;
        break;
      }
    }

    // --- Allarme ---
    const allarme_guasto =
      radiazione > 10 && performance_ratio_medio < 0.3;

    return NextResponse.json({
      id_impianto,
      produzione,
      performance_ratio_medio,
      radiazione,
      allarme_guasto,
      ultima_data_guasto,
    });

  } catch (error) {
    console.error("Errore GET /api/produzione:", error);
    return NextResponse.json(
      { error: "Errore interno del server" },
      { status: 500 }
    );
  }
}


// ======================================================
// POST /api/production
// Inserisce una nuova lettura manuale nel DB
// ======================================================
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id_impianto, data, kwh_prodotti, ore_funzionamento } = body;

    if (!id_impianto || !data || !kwh_prodotti || !ore_funzionamento) {
      return NextResponse.json(
        { error: "Tutti i campi sono obbligatori" },
        { status: 400 }
      );
    }

    await db.query(
      `
      INSERT INTO produzione (id_impianto, data, kwh_prodotti, ore_funzionamento)
      VALUES (?, ?, ?, ?)
      `,
      [id_impianto, data, kwh_prodotti, ore_funzionamento]
    );

    return NextResponse.json({
      message: "Produzione inserita correttamente",
    });
  } catch (error) {
    console.error("Errore POST /api/production:", error);
    return NextResponse.json(
      { error: "Errore interno del server" },
      { status: 500 }
    );
  }
}