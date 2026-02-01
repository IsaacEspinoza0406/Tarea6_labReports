/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import { pool } from "@/lib/db";
import { ArrowLeft, AlertTriangle, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function Report3Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const page = Number(searchParams.page) || 1;
  const LIMIT = 5;
  const offset = (page - 1) * LIMIT;

  const { rows } = await pool.query("SELECT * FROM products ORDER BY id ASC LIMIT $1 OFFSET $2", [LIMIT, offset]);
  
  const totalRes = await pool.query("SELECT COUNT(*) FROM products");
  const totalProducts = Number(totalRes.rows[0].count);
  const totalPages = Math.ceil(totalProducts / LIMIT);

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <Link href="/" className="inline-flex items-center text-gray-400 hover:text-blue-400 mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Volver al Dashboard
      </Link>

      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-white">Inventario (Pág {page})</h1>
            <div className="flex gap-2">
                {page > 1 && (
                    <Link href={`/reports/3?page=${page - 1}`} className="flex items-center bg-gray-700 text-white px-3 py-2 rounded hover:bg-gray-600">
                        <ChevronLeft className="w-4 h-4 mr-1"/> Anterior
                    </Link>
                )}
                {page < totalPages && (
                    <Link href={`/reports/3?page=${page + 1}`} className="flex items-center bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-500">
                        Siguiente <ChevronRight className="w-4 h-4 ml-1"/>
                    </Link>
                )}
            </div>
        </div>

        <div className="bg-gray-800 rounded-lg shadow overflow-hidden border-t-4 border-blue-500">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-black text-white">
              <tr>
                <th className="px-6 py-3 text-left">Producto</th>
                <th className="px-6 py-3 text-left">Precio</th>
                <th className="px-6 py-3 text-left">Stock</th>
                <th className="px-6 py-3 text-left">Estado</th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {rows.map((row: any, index: number) => {
                const esCritico = row.stock < 50;
                return (
                  <tr key={index} className="hover:bg-gray-700">
                    <td className="px-6 py-4 font-medium text-white">{row.name}</td>
                    <td className="px-6 py-4 text-gray-400">${Number(row.price).toLocaleString()}</td>
                    <td className="px-6 py-4 font-bold text-white">{row.stock}</td>
                    <td className="px-6 py-4">
                      {esCritico ? (
                        <span className="flex items-center text-red-200 text-xs font-bold uppercase bg-red-900/50 px-2 py-1 rounded-full w-fit">
                          <AlertTriangle className="w-3 h-3 mr-1"/> Bajo
                        </span>
                      ) : (
                        <span className="flex items-center text-green-200 text-xs font-bold uppercase bg-green-900/50 px-2 py-1 rounded-full w-fit">
                          <CheckCircle className="w-3 h-3 mr-1"/> OK
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}