/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import { pool } from "@/lib/db";
import { ArrowLeft, Calendar } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function Report5Page() {
  const { rows } = await pool.query("SELECT * FROM vw_monthly_metrics");

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <Link href="/" className="inline-flex items-center text-gray-400 hover:text-orange-400 mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Volver al Dashboard
      </Link>

      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2">Reporte 5: Métricas Mensuales</h1>
        <p className="text-gray-400 mb-8">Ingresos agrupados por mes de venta.</p>

        <div className="bg-gray-800 rounded-lg shadow overflow-hidden border-t-4 border-orange-500">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-black text-white">
              <tr>
                <th className="px-6 py-3 text-left">Mes</th>
                <th className="px-6 py-3 text-left">Total Órdenes</th>
                <th className="px-6 py-3 text-left">Ingresos ($)</th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {rows.map((row: any, index: number) => (
                <tr key={index} className="hover:bg-gray-700">
                  <td className="px-6 py-4 font-bold text-white flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-orange-400"/> {row.mes}
                  </td>
                  <td className="px-6 py-4 text-gray-400">{row.total_ordenes}</td>
                  <td className="px-6 py-4 text-green-400 font-bold">${Number(row.ingresos_mes).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}