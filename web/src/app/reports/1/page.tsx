/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import { pool } from "@/lib/db";
import { ArrowLeft, DollarSign, TrendingUp } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function Report1Page() {
  const { rows } = await pool.query("SELECT * FROM vw_sales_by_category");

  const totalVentas = rows.reduce((acc: number, row: any) => acc + Number(row.ventas_totales || 0), 0);
  const totalItems = rows.reduce((acc: number, row: any) => acc + Number(row.total_items_vendidos || 0), 0);

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <Link href="/" className="inline-flex items-center text-gray-400 hover:text-red-400 mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Volver al Dashboard
      </Link>

      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2">Reporte 1: Ventas por Categoría</h1>
        <p className="text-gray-400 mb-8">Desglose de ingresos generados por cada línea de negocio.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-lg shadow border-l-4 border-green-500 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-400">Ingresos Totales</p>
              <p className="text-2xl font-bold text-white">${totalVentas.toLocaleString()}</p>
            </div>
            <DollarSign className="h-10 w-10 text-green-400 bg-gray-700 rounded-full p-2" />
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow border-l-4 border-blue-500 flex justify-between items-center">
             <div>
              <p className="text-sm text-gray-400">Items Vendidos</p>
              <p className="text-2xl font-bold text-white">{totalItems}</p>
            </div>
            <TrendingUp className="h-10 w-10 text-blue-400 bg-gray-700 rounded-full p-2" />
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-black text-white">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Categoría</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Items Vendidos</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Total Ventas ($)</th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {rows.map((row: any, index: number) => (
                <tr key={index} className="hover:bg-gray-700">
                  <td className="px-6 py-4 font-medium text-white">{row.categoria}</td>
                  <td className="px-6 py-4 text-gray-400">{row.total_items_vendidos}</td>
                  <td className="px-6 py-4 text-green-400 font-bold">
                    ${Number(row.ventas_totales).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}