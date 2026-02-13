/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import Link from "next/link";
import { pool } from "@/lib/db";
import { ArrowLeft, Search } from "lucide-react";
import { z } from "zod";

export const dynamic = "force-dynamic";

const searchSchema = z.object({
  q: z.string().optional(),
});

export default async function Report2Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const parsed = searchSchema.safeParse(searchParams);
  const query = parsed.success && parsed.data.q ? parsed.data.q : "";

  let rows = [];
  let errorMsg = "";

  try {
    if (query) {
      const res = await pool.query(
        "SELECT * FROM vw_vip_fans WHERE fan ILIKE $1",
        [`%${query}%`]
      );
      rows = res.rows;
    } else {
      const res = await pool.query("SELECT * FROM vw_vip_fans");
      rows = res.rows;
    }
  } catch (e: any) {
    errorMsg = "Error cargando datos.";
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <Link href="/" className="inline-flex items-center text-gray-400 hover:text-yellow-400 mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Volver al Dashboard
      </Link>

      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">Top Fans.</h1>
          
          {}
          <form className="flex gap-2">
            <input
              name="q"
              placeholder="Buscar fan..."
              defaultValue={query}
              className="bg-gray-800 text-white border border-gray-700 rounded px-3 py-2 focus:outline-none focus:border-yellow-500"
            />
            <button type="submit" className="bg-yellow-600 text-white p-2 rounded hover:bg-yellow-500">
              <Search className="w-5 h-5" />
            </button>
          </form>
        </div>
        
        {errorMsg ? (
            <div className="p-4 bg-red-900 text-red-200 rounded">{errorMsg}</div>
        ) : (
            <div className="bg-gray-800 rounded-lg shadow overflow-hidden border-t-4 border-yellow-500">
            <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-black text-white">
                <tr>
                    <th className="px-6 py-3 text-left">Ranking</th>
                    <th className="px-6 py-3 text-left">Fan</th>
                    <th className="px-6 py-3 text-left">Nivel</th>
                    <th className="px-6 py-3 text-left">Gasto Total</th>
                </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                {rows.length > 0 ? rows.map((row: any, index: number) => (
                    <tr key={index} className="hover:bg-gray-700">
                    <td className="px-6 py-4 font-bold text-white">#{row.ranking_vip || index + 1}</td>
                    <td className="px-6 py-4 text-white">{row.fan || row.name}</td>
                    <td className="px-6 py-4">
                        <span className="px-2 py-1 rounded bg-yellow-900 text-yellow-200 text-xs font-bold">
                            {row.nivel_lealtad || 'Fan'}
                        </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-green-400">
                        ${Number(row.gasto_total || 0).toLocaleString()}
                    </td>
                    </tr>
                )) : (
                    <tr><td colSpan={4} className="p-4 text-center text-gray-500">No se encontraron fans.</td></tr>
                )}
                </tbody>
            </table>
            </div>
        )}
      </div>
    </div>  
  );
}