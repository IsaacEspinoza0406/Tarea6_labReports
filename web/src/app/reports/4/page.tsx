/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import { pool } from "@/lib/db";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function Report4Page() {
  // NUEVA VISTA: view_4_price_performance
  const { rows } = await pool.query("SELECT * FROM view_4_price_performance");

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <Link href="/" className="inline-flex items-center text-gray-400 hover:text-purple-400 mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Volver al Dashboard
      </Link>

      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2">💎 Comparativa de Precios (CTE)</h1>
        <p className="text-gray-400 mb-8">Uso de Common Table Expressions para comparar vs promedio global.</p>
        
        <div className="bg-gray-800 rounded-lg shadow overflow-hidden border-t-4 border-purple-500">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-black text-white">
              <tr>
                <th className="px-6 py-3 text-left">Producto</th>
                <th className="px-6 py-3 text-left">Precio</th>
                <th className="px-6 py-3 text-left">Promedio Global</th>
                <th className="px-6 py-3 text-left">Performance</th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {rows.map((row: any, i: number) => (
                <tr key={i} className="hover:bg-gray-700">
                  <td className="px-6 py-4 font-bold text-white">{row.name}</td>
                  <td className="px-6 py-4 text-white">${row.price}</td>
                  <td className="px-6 py-4 text-gray-400">${row.global_avg_order}</td>
                  <td className="px-6 py-4 font-bold text-purple-400">{row.performance_check}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}