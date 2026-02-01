/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import { pool } from "@/lib/db";
import { ArrowLeft, AlertTriangle, CheckCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function Report3Page() {
  const { rows } = await pool.query("SELECT * FROM products");

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <Link href="/" className="inline-flex items-center text-gray-400 hover:text-blue-400 mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Volver al Dashboard
      </Link>

      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2">Reporte 3: Inventario</h1>
        <p className="text-gray-400 mb-8">Estado actual del stock en bodega.</p>

        <div className="bg-gray-800 rounded-lg shadow overflow-hidden border-t-4 border-blue-500">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-black text-white">
              <tr>
                <th className="px-6 py-3 text-left">Producto</th>
                <th className="px-6 py-3 text-left">Precio</th>
                <th className="px-6 py-3 text-left">Stock</th>
                <th className="px-6 py-3 text-left">Estado</th>
                <th className="px-6 py-3 text-left">Valor Total ($)</th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {rows.map((row: any, index: number) => {
                const valorTotal = row.price * row.stock;
                const esCritico = row.stock < 50;

                return (
                  <tr key={index} className="hover:bg-gray-700">
                    <td className="px-6 py-4 font-medium text-white">{row.name}</td>
                    <td className="px-6 py-4 text-gray-400">${Number(row.price).toLocaleString()}</td>
                    <td className="px-6 py-4 font-bold text-white">{row.stock}</td>
                    <td className="px-6 py-4">
                      {esCritico ? (
                        <span className="flex items-center text-red-200 text-xs font-bold uppercase bg-red-900/50 px-2 py-1 rounded-full w-fit">
                          <AlertTriangle className="w-3 h-3 mr-1"/> Bajo Stock
                        </span>
                      ) : (
                        <span className="flex items-center text-green-200 text-xs font-bold uppercase bg-green-900/50 px-2 py-1 rounded-full w-fit">
                          <CheckCircle className="w-3 h-3 mr-1"/> OK
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-white font-bold">
                      ${valorTotal.toLocaleString()}
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