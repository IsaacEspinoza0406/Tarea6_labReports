/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import { pool } from "@/lib/db";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function Report2Page() {
  let rows: any[] = [];
  let errorMsg = "";
  
  try {
      // Usamos la consulta directa para asegurar que jale
      const res = await pool.query("SELECT * FROM users"); 
      rows = res.rows;
  } catch (e: any) {
      errorMsg = "Error al cargar usuarios.";
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <Link href="/" className="inline-flex items-center text-gray-400 hover:text-yellow-400 mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Volver al Dashboard
      </Link>

      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2">Reporte 2: Ranking de Fans</h1>
        
        {errorMsg ? (
            <div className="p-4 bg-red-900 text-red-200 rounded">{errorMsg}</div>
        ) : (
            <div className="bg-gray-800 rounded-lg shadow overflow-hidden border-t-4 border-yellow-500">
            <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-black text-white">
                <tr>
                    <th className="px-6 py-3 text-left">ID</th>
                    <th className="px-6 py-3 text-left">Fan</th>
                    <th className="px-6 py-3 text-left">Email</th>
                    <th className="px-6 py-3 text-left">Equipo</th>
                </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                {rows.map((row: any, index: number) => (
                    <tr key={index} className="hover:bg-gray-700">
                    <td className="px-6 py-4 font-bold text-white">#{row.id}</td>
                    <td className="px-6 py-4 text-white">{row.name}</td>
                    <td className="px-6 py-4 text-gray-400">{row.email}</td>
                    <td className="px-6 py-4 font-bold text-red-400">{row.team_preference}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        )}
      </div>
    </div>
  );
}