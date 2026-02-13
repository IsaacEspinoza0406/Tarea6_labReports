/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import { pool } from "@/lib/db";
import { ArrowLeft, DollarSign, TrendingUp } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function Report1Page() {
  const { rows } = await pool.query("SELECT * FROM view_1_sales_by_category");

  const totalVentas = rows.reduce((acc: number, row: any) => acc + Number(row.total_revenue || 0), 0);
  const totalItems = rows.reduce((acc: number, row: any) => acc + Number(row.total_items_sold || 0), 0);

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <Link href="/" className="inline-flex items-center text-gray-400 hover:text-red-400 mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Volver al Dashboard
      </Link>

      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2">Reporte 1: Ventas por Categoría</h1>
        <p className="text-gray-400 mb-8">Datos consolidados usando GROUP BY y JOIN.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-lg shadow border-l-4 border-green-500 flex items-center justify-between">
             <div>
                <p className="text-sm text-gray-400">Ingresos Totales</p>
                <p className="text-2xl font-bold text-white">${totalVentas.toLocaleString()}</p>
             </div>
             <div className="p-3 bg-green-900/30 rounded-full">
                <DollarSign className="w-8 h-8 text-green-400" />
             </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg shadow border-l-4 border-blue-500 flex items-center justify-between">
             <div>
                <p className="text-sm text-gray-400">Items Vendidos</p>
                <p className="text-2xl font-bold text-white">{totalItems}</p>
             </div>
             <div className="p-3 bg-blue-900/30 rounded-full">
                <TrendingUp className="w-8 h-8 text-blue-400" />
             </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-black text-white">
              <tr>
                <th className="px-6 py-3 text-left">Categoría</th>
                <th className="px-6 py-3 text-left">Items</th>
                <th className="px-6 py-3 text-left">Ticket Promedio</th>
                <th className="px-6 py-3 text-left">Total ($)</th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {rows.map((row: any, i: number) => (
                <tr key={i} className="hover:bg-gray-700">
                  <td className="px-6 py-4 font-bold text-white">{row.category_name}</td>
                  <td className="px-6 py-4 text-gray-400">{row.total_items_sold}</td>
                  <td className="px-6 py-4 text-gray-400">${Number(row.avg_ticket_price).toLocaleString()}</td>
                  <td className="px-6 py-4 text-green-400 font-bold">${Number(row.total_revenue).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}