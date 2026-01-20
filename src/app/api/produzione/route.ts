import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// ======================================================
// GET /api/produzione?id_impianto=1
// Recupera la produzione di un impianto specifico + PR
// ======================================================
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

    // Recupero produzione + capacità impianto
    const [rows] = await db.query(
      `
      SELECT 
        p.id,
        p.data,
        p.kwh_prodotti,
        p.ore_funzionamento,
        i.capacita_max_kw
      FROM produzione p
      JOIN impianti i ON p.id_impianto = i.id
      WHERE p.id_impianto = ?
      ORDER BY p.data DESC
      `,
      [id_impianto]
    );

    const produzione = rows as any[];

    // Se non ci sono dati → ritorno vuoto
    if (produzione.length === 0) {
      return NextResponse.json({
        id_impianto,
        produzione: [],
        performance_ratio_medio: 0,
      });
    }

    // Calcolo PR per ogni giorno
    const pr_values = produzione.map((r) => {
      const kwh = Number(r.kwh_prodotti);
      const ore = Number(r.ore_funzionamento);
      const cap = Number(r.capacita_max_kw);

      if (ore === 0 || cap === 0) return 0;

      return (kwh / ore) / cap;
    });

    // Media PR
    const performance_ratio_medio =
      pr_values.reduce((sum, v) => sum + v, 0) / pr_values.length;

    // Risposta finale
    return NextResponse.json({
      id_impianto,
      produzione,
      performance_ratio_medio,
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