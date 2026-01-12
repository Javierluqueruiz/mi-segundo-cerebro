import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Hola, Javier 👋</h1>
      <p className="text-gray-400 mb-8">¿Qué quieres organizar hoy?</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Tarjeta de Acceso a Libros */}
        <Link href="/libros" className="group block">
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-blue-500 transition-all hover:-translate-y-1">
            <div className="h-12 w-12 bg-blue-900/50 rounded-lg flex items-center justify-center mb-4 text-2xl group-hover:bg-blue-600 transition-colors">
              📚
            </div>
            <h2 className="text-xl font-bold mb-2">Biblioteca</h2>
            <p className="text-sm text-gray-400">Gestiona tus lecturas, pendientes y reseñas.</p>
          </div>
        </Link>

        {/* Tarjeta de Futura Sección (Videojuegos) - Aún no funciona */}
        <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 opacity-50 cursor-not-allowed">
          <div className="h-12 w-12 bg-slate-700/50 rounded-lg flex items-center justify-center mb-4 text-2xl">
            🎮
          </div>
          <h2 className="text-xl font-bold mb-2">Videojuegos</h2>
          <p className="text-sm text-gray-400">Próximamente...</p>
        </div>

         {/* Tarjeta de Futura Sección (Ideas) */}
         <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 opacity-50 cursor-not-allowed">
          <div className="h-12 w-12 bg-slate-700/50 rounded-lg flex items-center justify-center mb-4 text-2xl">
            💡
          </div>
          <h2 className="text-xl font-bold mb-2">Ideas & Regalos</h2>
          <p className="text-sm text-gray-400">Próximamente...</p>
        </div>

      </div>
    </div>
  );
}