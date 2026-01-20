"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function ProduzioneDettaglio() {
  const params = useParams();
  const id = params.id as string;

  const [produzione, setProduzione] = useState([]);
  const [nomeImpianto, setNomeImpianto] = useState("");

  // Form
  const [data, setData] = useState("");
  const [kwh, setKwh] = useState("");
  const [ore, setOre] = useState("");

  // Performance Ratio
  const [prMedio, setPrMedio] = useState(0);
  const [ultimaDataGuasto, setUltimaDataGuasto] = useState<string | null>(null);

  async function load() {
    // Produzione + PR
    const res = await fetch(`/api/produzione?id_impianto=${id}`);
    const data = await res.json();

    setProduzione(data.produzione);
    setPrMedio(data.performance_ratio_medio);
    setUltimaDataGuasto(data.ultima_data_guasto);

    // Nome impianto
    const resImp = await fetch(`/api/impianti`);
    const impianti = await resImp.json();
    const imp = impianti.find((i: any) => i.id == id);
    if (imp) setNomeImpianto(imp.nome_parco);
  }

  useEffect(() => {
    load();
  }, [id]);

  async function handleSubmit(e: any) {
    e.preventDefault();

    const body = {
      id_impianto: Number(id),
      data,
      kwh_prodotti: Number(kwh),
      ore_funzionamento: Number(ore),
    };

    const res = await fetch("/api/produzione", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      setData("");
      setKwh("");
      setOre("");
      load();
    }
  }

  // Stato impianto
  let stato = "OK";
  if (prMedio < 0.3) stato = "GUASTO";
  else if (prMedio < 0.7) stato = "BASSA";

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold">
        Produzione Impianto  – {nomeImpianto}
      </h1>

      {/* PERFORMANCE RATIO */}
      <div className="bg-white shadow p-4 rounded-lg border mb-6">
        <h2 className="text-xl font-semibold mb-2">Performance Ratio</h2>
        <p className="text-3xl font-bold text-green-700">
          {prMedio.toFixed(3)}
        </p>

        <p
          className={`text-lg font-bold mt-2 ${
            stato === "OK"
              ? "text-green-600"
              : stato === "BASSA"
              ? "text-yellow-600"
              : "text-red-600"
          }`}
        >
          {stato === "OK"
            ? "Produzione regolare"
            : stato === "BASSA"
            ? "Produzione bassa"
            : "Possibile guasto"}
        </p>

        {ultimaDataGuasto && (
          <p className="text-red-600 font-semibold mt-2">
            Ultimo guasto rilevato il: {ultimaDataGuasto}
          </p>
        )}
      </div>

      {/* FORM INSERIMENTO */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow p-6 rounded-lg border space-y-4"
      >
        <h2 className="text-xl font-semibold mb-2">Inserisci nuova lettura</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Data</label>
            <input
              type="date"
              value={data}
              onChange={(e) => setData(e.target.value)}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              kWh prodotti
            </label>
            <input
              type="number"
              step="0.01"
              value={kwh}
              onChange={(e) => setKwh(e.target.value)}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Ore funzionamento
            </label>
            <input
              type="number"
              step="0.1"
              value={ore}
              onChange={(e) => setOre(e.target.value)}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition"
        >
          Salva produzione
        </button>
      </form>

      {/* TABELLA PRODUZIONE */}
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-4 py-3">Data</th>
              <th className="px-4 py-3">kWh</th>
              <th className="px-4 py-3">Ore</th>
            </tr>
          </thead>
          <tbody>
            {produzione.map((r: any) => (
              <tr key={r.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">{r.data}</td>
                <td className="px-4 py-3">{r.kwh_prodotti}</td>
                <td className="px-4 py-3">{r.ore_funzionamento}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}