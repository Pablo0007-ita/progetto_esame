import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const [rows] = await db.query(`SELECT destinazione, 
             SUM(km_percorsi) AS totale_km
      FROM viaggi
      GROUP BY destinazione
      ORDER BY totale_km DESC`);
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: 'Errore nella query al database' }, { status: 500 });
  }
}
// SELECT destinazione, SUM(km_percorsi) AS totale_km
// FROM viaggi
// GROUP BY destinazione
// ORDER BY totale_km DESC;

