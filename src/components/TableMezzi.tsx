'use client';

import { useEffect, useState } from 'react';

interface Mezzo {
  id: number;
  targa: string;
  modello: string;
  consumo_std_l_100km: string;
}

export default function TableMezzi() {
  const [mezzi, setMezzi] = useState<Mezzo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [targa, setTarga] = useState('');
  const [modello, setModello] = useState('');
  const [consumo_std_l_100km, setConsumo_std_l_100km] = useState('');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

useEffect(() => {
  fetch('/api/mezzi')
    .then(res => {
      if (!res.ok) throw new Error('Errore nel caricamento dati');
      return res.json();
    })
    .then(data => {
      setMezzi(data);
      setLoading(false);
    })
    .catch(err => {
      setError(err.message);
      setLoading(false);
    });
}, []);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(null);

    if (!targa || !modello || !consumo_std_l_100km) {
      setSubmitError('Per favore, compila tutti i campi.');
      return;
    }

    try {
      const res = await fetch('/api/mezzi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targa, modello, consumo_std_l_100km: consumo_std_l_100km }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Errore durante l'inserimento");
      }

      setSubmitSuccess('Mezzo inserito con successo!');
      setTarga('');
      setModello('');
      setConsumo_std_l_100km('');

      // Ricarica i dati
      const updatedRes = await fetch('/api/mezzi');
      const updatedData = await updatedRes.json();
      setMezzi(updatedData);
    } catch (err: any) {
      setSubmitError(err.message);
    }
  };

  if (loading) return <p className="text-center mt-10">Caricamento dati...</p>;
  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;

  return (
    <>
      <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden mb-6">
        <thead className="bg-gray-100">
          <tr>
            <th className="border border-gray-300 px-4 py-2">TARGA</th>
            <th className="border border-gray-300 px-4 py-2">MODELLO</th>
            <th className="border border-gray-300 px-4 py-2">CONSUMO_STD</th>
          </tr>
        </thead>
        <tbody>
          {mezzi.map((mezzo) => (
            <tr key={mezzo.id} className="hover:bg-gray-50">
              <td className="border border-gray-300 px-4 py-2">{mezzo.targa}</td>
              <td className="border border-gray-300 px-4 py-2">{mezzo.modello}</td>
              <td className="border border-gray-300 px-4 py-2">{mezzo.consumo_std_l_100km}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 border border-gray-300 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Inserisci un nuovo mezzo</h2>

        {submitError && <p className="text-red-600 mb-2">{submitError}</p>}
        {submitSuccess && <p className="text-green-600 mb-2">{submitSuccess}</p>}

        <div className="mb-4">
          <label htmlFor="targa" className="block mb-1 font-medium">Targa</label>
          <input
            id="targa"
            type="text"
            value={targa}
            onChange={e => setTarga(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="modello" className="block mb-1 font-medium">Modello</label>
          <input
            id="modello"
            type="text"
            value={modello}
            onChange={e => setModello(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="consumo_std" className="block mb-1 font-medium">Consumo Standard</label>
          <input
            id="consumo_std"
            type="text"
            value={consumo_std_l_100km}
            onChange={e => setConsumo_std_l_100km(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-fleet-blue text-white px-4 py-2 rounded hover:bg-fleet-dark transition"
        >
          Inserisci Mezzo
        </button>
      </form>
    </>
  );
}