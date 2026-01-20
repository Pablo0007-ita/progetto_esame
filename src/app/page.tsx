"use client";

import SolarPanelCardGraph from "@/components/SolarPanelCard";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [impianti, setImpianti] = useState<any[]>([]);
  const [dati, setDati] = useState<any>({});

  useEffect(() => {
    async function load() {
      // 1. Recupero impianti
      const resImp = await fetch("/api/impianti");
      const lista = await resImp.json();
      setImpianti(lista);

      // 2. Per ogni impianto → produzione
      const temp: any = {};

      for (const imp of lista) {
        const resProd = await fetch(`/api/produzione?id_impianto=${imp.id}`);
        const prod = await resProd.json();

        temp[imp.id] = {
          totale: prod.produzione.reduce(
            (sum: number, r: any) => sum + Number(r.kwh_prodotti),
            0
          ),
          giornaliera: prod.produzione.map((r: any) => r.kwh_prodotti),
          date: prod.produzione.map((r: any) => r.data),
        };
      }

      setDati(temp);
    }

    load();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      {impianti.map((imp) => {
        const d = dati[imp.id];
        if (!d) return null;

        return (
          <SolarPanelCardGraph
            key={imp.id}
            id={imp.id}
            nomeParco={imp.nome_parco}
            totaleKwh={d.totale}
            produzioneGiornaliera={d.giornaliera}
            date={d.date}
          />
        );
      })}
    </div>
  );
}