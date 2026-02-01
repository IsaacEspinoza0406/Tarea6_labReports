import Link from "next/link";
import { BarChart3, Trophy, Package, Gem, Calendar } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-8">
      
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-red-500 flex items-center justify-center gap-3 mb-2">
          🏈 Super Bowl LX Dashboard
        </h1>
        <p className="text-gray-300 text-lg">Reportes exclusivos en tiempo real.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
        
        <Link href="/reports/1" className="group">
          <div className="bg-gray-800 p-8 rounded-xl shadow-lg border-t-4 border-red-500 hover:shadow-red-500/50 transition-all hover:-translate-y-1 cursor-pointer h-full">
            <div className="flex items-center mb-4 text-red-400">
              <BarChart3 className="w-8 h-8 mr-3" />
              <h2 className="text-2xl font-bold text-white group-hover:text-red-400">Ventas</h2>
            </div>
            <p className="text-gray-400">Ingresos desglosados por categoría.</p>
          </div>
        </Link>

        <Link href="/reports/2" className="group">
          <div className="bg-gray-800 p-8 rounded-xl shadow-lg border-t-4 border-yellow-500 hover:shadow-yellow-500/50 transition-all hover:-translate-y-1 cursor-pointer h-full">
            <div className="flex items-center mb-4 text-yellow-400">
              <Trophy className="w-8 h-8 mr-3" />
              <h2 className="text-2xl font-bold text-white group-hover:text-yellow-400">Top Fans</h2>
            </div>
            <p className="text-gray-400">Ranking de mejores clientes.</p>
          </div>
        </Link>

        <Link href="/reports/3" className="group">
          <div className="bg-gray-800 p-8 rounded-xl shadow-lg border-t-4 border-blue-500 hover:shadow-blue-500/50 transition-all hover:-translate-y-1 cursor-pointer h-full">
            <div className="flex items-center mb-4 text-blue-400">
              <Package className="w-8 h-8 mr-3" />
              <h2 className="text-2xl font-bold text-white group-hover:text-blue-400">Inventario</h2>
            </div>
            <p className="text-gray-400">Análisis de stock en bodega.</p>
          </div>
        </Link>

        <Link href="/reports/4" className="group">
          <div className="bg-gray-800 p-8 rounded-xl shadow-lg border-t-4 border-purple-500 hover:shadow-purple-500/50 transition-all hover:-translate-y-1 cursor-pointer h-full">
            <div className="flex items-center mb-4 text-purple-400">
              <Gem className="w-8 h-8 mr-3" />
              <h2 className="text-2xl font-bold text-white group-hover:text-purple-400">Premium</h2>
            </div>
            <p className="text-gray-400">Categorías de alto valor (Ticket Alto).</p>
          </div>
        </Link>

        <Link href="/reports/5" className="group">
          <div className="bg-gray-800 p-8 rounded-xl shadow-lg border-t-4 border-orange-500 hover:shadow-orange-500/50 transition-all hover:-translate-y-1 cursor-pointer h-full">
            <div className="flex items-center mb-4 text-orange-400">
              <Calendar className="w-8 h-8 mr-3" />
              <h2 className="text-2xl font-bold text-white group-hover:text-orange-400">Mensual</h2>
            </div>
            <p className="text-gray-400">Desempeño de ventas por mes.</p>
          </div>
        </Link>

      </div>
    </div>
  );
}