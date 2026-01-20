import { db } from '@/lib/db';
import { NextResponse } from 'next/server';



// ======================================================
// GET /api/impianti
// Restituisce la lista degli impianti dal DB MySQL
// ======================================================
export async function GET() {
  try {
    // Query per recuperare tutti gli impianti
    const [rows] = await db.query(`
      SELECT id, nome_parco, latitudine, longitudine, capacita_max_kw
      FROM impianti
      ORDER BY nome_parco ASC
    `);

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Errore GET /api/impianti:", error);
    return NextResponse.json(
      { error: "Errore interno del server" },
      { status: 500 }
    );
  }
}


export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { modello, targa, consumo_std_l_100km } = body;

    const [result] = await db.query(
      'INSERT INTO mezzi (modello, targa, consumo_std_l_100km) VALUES (?, ?, ?)',
      [modello, targa, consumo_std_l_100km]
    );

    return NextResponse.json({
      message: 'Mezzo inserito',
      id: (result as any).insertId
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Errore nell'inserimento del mezzo" },
      { status: 500 }
    );
  }
}

