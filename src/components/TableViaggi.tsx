'use client';

import { useEffect, useState } from 'react';

interface StatDestinazione {
  destinazione: string;
  totale_km: number;
}

interface Meteo {
  temperatura: number | null;
  descrizione: string | null;
}

export default function TableViaggi() {
  const [stats, setStats] = useState<StatDestinazione[]>([]);
  const [meteo, setMeteo] = useState<Record<string, Meteo>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/viaggi')
      .then(res => {
        if (!res.ok) throw new Error('Errore nel caricamento dati');
        return res.json();
      })
      .then(async data => {
        setStats(data);
        setLoading(false);

        const meteoData: Record<string, Meteo> = {};

        for (const item of data) {
          const city = item.destinazione;

          try {
            const geoRes = await fetch(
              `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`
            );
            const geoJson = await geoRes.json();

            if (!geoJson.results || geoJson.results.length === 0) {
              meteoData[city] = { temperatura: null, descrizione: 'Località non trovata' };
              continue;
            }

            const { latitude, longitude } = geoJson.results[0];

            const meteoRes = await fetch(
              `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
            );
            const meteoJson = await meteoRes.json();

            meteoData[city] = {
              temperatura: meteoJson.current_weather?.temperature ?? null,
              descrizione: meteoJson.current_weather?.weathercode ?? null
            };
          } catch (err) {
            meteoData[city] = { temperatura: null, descrizione: 'Errore meteo' };
          }
        }

        setMeteo(meteoData);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center mt-10">Caricamento dati...</p>;
  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;

  return (
    <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">
      <thead className="bg-gray-100">
        <tr>
          <th className="border border-gray-300 px-4 py-2">Destinazione</th>
          <th className="border border-gray-300 px-4 py-2">Totale Km</th>
          <th className="border border-gray-300 px-4 py-2">Meteo</th>
        </tr>
      </thead>
      <tbody>
        {stats.map((item) => (
          <tr key={item.destinazione} className="hover:bg-gray-50">
            <td className="border border-gray-300 px-4 py-2">{item.destinazione}</td>
            <td className="border border-gray-300 px-4 py-2">{item.totale_km}</td>

            <td className="border border-gray-300 px-4 py-2">
              {meteo[item.destinazione]?.temperatura != null
                ? `${meteo[item.destinazione].temperatura}°C`
                : 'N/D'}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}