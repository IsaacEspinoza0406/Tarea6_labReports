/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import { pool } from "@/lib/db";
import { ArrowLeft, Gem } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function Report4Page() {
  const { rows } = await pool.query("SELECT * FROM vw_high_ticket_categories");

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <Link href="/" className="inline-flex items-center text-gray-400 hover:text-purple-400 mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Volver al Dashboard
      </Link>

      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2">Reporte 4: Categorías Premium</h1>
        <p className="text-gray-400 mb-8">Categorías donde el precio promedio supera los $50 USD.</p>

        <div className="bg-gray-800 rounded-lg shadow overflow-hidden border-t-4 border-purple-500">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-black text-white">
              <tr>
                <th className="px-6 py-3 text-left">Categoría</th>
                <th className="px-6 py-3 text-left">Productos</th>
                <th className="px-6 py-3 text-left">Precio Promedio</th>
                <th className="px-6 py-3 text-left">Más Caro</th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {rows.map((row: any, index: number) => (
                <tr key={index} className="hover:bg-gray-700">
                  <td className="px-6 py-4 font-bold text-white flex items-center">
                    <Gem className="w-4 h-4 mr-2 text-purple-400"/> {row.categoria}
                  </td>
                  <td className="px-6 py-4 text-gray-400">{row.cantidad_productos}</td>
                  <td className="px-6 py-4 text-green-400 font-bold">${Number(row.precio_promedio).toLocaleString()}</td>
                  <td className="px-6 py-4 text-white">${Number(row.producto_mas_caro).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}