import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const [rows] = await db.query('SELECT * FROM mezzi');
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: 'Errore nella query al database' }, { status: 500 });
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

