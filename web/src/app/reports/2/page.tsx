/* eslint-disable @typescript-eslint/no-explicit-any */

import Link from "next/link";
import { pool } from "@/lib/db";
import { ArrowLeft, Search } from "lucide-react";
import { z } from "zod";

export const dynamic = "force-dynamic";

const searchSchema = z.object({ q: z.string().optional() });

export default async function Report2Page(props: { searchParams: Promise<any> }) {
  const searchParams = await props.searchParams;
  const parsed = searchSchema.safeParse(searchParams);
  const query = parsed.success && parsed.data.q ? parsed.data.q : "";

  let rows: any[] = [];
  try {
    if (query) {
      // NOMBRE NUEVO DE LA VISTA
      const res = await pool.query("SELECT * FROM view_2_vip_fans WHERE fan_name ILIKE $1", [`%${query}%`]);
      rows = res.rows;
    } else {
      const res = await pool.query("SELECT * FROM view_2_vip_fans");
      rows = res.rows;
    }
  } catch (e) { console.error(e); }

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <Link href="/" className="inline-flex items-center text-gray-400 hover:text-yellow-400 mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Volver al Dashboard
      </Link>
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">🏆 Ranking VIP (CASE + HAVING)</h1>
          <form className="flex gap-2">
            <input name="q" placeholder="Buscar fan..." defaultValue={query} className="bg-gray-800 text-white border border-gray-700 rounded px-3 py-2" />
            <button type="submit" className="bg-yellow-600 text-white p-2 rounded"><Search className="w-5 h-5" /></button>
          </form>
        </div>
        <div className="bg-gray-800 rounded-lg shadow overflow-hidden border-t-4 border-yellow-500">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-black text-white">
              <tr>
                <th className="px-6 py-3 text-left">Fan</th>
                <th className="px-6 py-3 text-left">Email</th>
                <th className="px-6 py-3 text-left">Nivel (CASE)</th>
                <th className="px-6 py-3 text-left">Gasto Total</th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {rows.map((row: any, i: number) => (
                <tr key={i} className="hover:bg-gray-700">
                  <td className="px-6 py-4 font-bold text-white">{row.fan_name}</td>
                  <td className="px-6 py-4 text-gray-400">{row.email}</td>
                  <td className="px-6 py-4"><span className="px-2 py-1 rounded bg-yellow-900 text-yellow-200 text-xs font-bold">{row.loyalty_level}</span></td>
                  <td className="px-6 py-4 text-green-400 font-bold">${Number(row.total_spent).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}