import TableViaggi from "@/components/TableViaggi";


export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Elenco Viaggi</h1>
      <TableViaggi />
    </main>
  );
}