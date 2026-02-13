/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import { pool } from "@/lib/db";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function Report3Page(props: { searchParams: Promise<any> }) {
  const searchParams = await props.searchParams;
  const page = Number(searchParams.page) || 1;
  const LIMIT = 5;
  const offset = (page - 1) * LIMIT;

  const { rows } = await pool.query("SELECT * FROM view_3_inventory_risk ORDER BY product_name LIMIT $1 OFFSET $2", [LIMIT, offset]);
  
  const totalRes = await pool.query("SELECT COUNT(*) FROM view_3_inventory_risk");
  const totalPages = Math.ceil(Number(totalRes.rows[0].count) / LIMIT);

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <Link href="/" className="inline-flex items-center text-gray-400 hover:text-blue-400 mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Volver al Dashboard
      </Link>

      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">Riesgo de Inventario (Pág {page})</h1>
          <div className="flex gap-2">
             {page > 1 && <Link href={`/reports/3?page=${page - 1}`} className="bg-gray-700 text-white px-3 py-2 rounded"><ChevronLeft/></Link>}
             {page < totalPages && <Link href={`/reports/3?page=${page + 1}`} className="bg-blue-600 text-white px-3 py-2 rounded"><ChevronRight/></Link>}
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg shadow overflow-hidden border-t-4 border-blue-500">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-black text-white">
              <tr>
                <th className="px-6 py-3 text-left">Producto</th>
                <th className="px-6 py-3 text-left">Stock</th>
                <th className="px-6 py-3 text-left">Estado (CASE)</th>
                <th className="px-6 py-3 text-left">Ingreso Potencial</th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {rows.map((row: any, i: number) => (
                <tr key={i} className="hover:bg-gray-700">
                  <td className="px-6 py-4 font-bold text-white">{row.product_name}</td>
                  <td className="px-6 py-4 text-white">{row.stock}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${row.stock_status === 'CRITICAL LOW' ? 'bg-red-900 text-red-200' : 'bg-green-900 text-green-200'}`}>
                      {row.stock_status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-400">${Number(row.potential_revenue).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}