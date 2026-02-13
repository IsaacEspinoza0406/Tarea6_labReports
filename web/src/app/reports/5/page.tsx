/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import { pool } from "@/lib/db";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function Report5Page() {
  const { rows } = await pool.query("SELECT * FROM view_5_sales_running_total ORDER BY created_at DESC LIMIT 20");

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <Link href="/" className="inline-flex items-center text-gray-400 hover:text-orange-400 mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Volver al Dashboard
      </Link>

      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2">Ventas Acumuladas (Window Fn)</h1>
        <p className="text-gray-400 mb-8">Suma acumulativa usando Window Functions.</p>

        <div className="bg-gray-800 rounded-lg shadow overflow-hidden border-t-4 border-orange-500">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-black text-white">
              <tr>
                <th className="px-6 py-3 text-left">Fecha</th>
                <th className="px-6 py-3 text-left">Monto Orden</th>
                <th className="px-6 py-3 text-left">Acumulado Histórico</th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {rows.map((row: any, i: number) => (
                <tr key={i} className="hover:bg-gray-700">
                  <td className="px-6 py-4 text-gray-400">{new Date(row.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-white font-bold">${row.total}</td>
                  <td className="px-6 py-4 text-orange-400 font-bold">${Number(row.running_total_revenue).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}