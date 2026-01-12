// Importamos nuestra conexión a la base de datos
import { supabase } from '@/lib/supabase';

// Esta función ahora es "async" (asíncrona) porque tiene que esperar a internet
export default async function Home() {
  
  // 1. Pedimos los datos a Supabase
  // "Selecciona * (todo) de la tabla 'items'"
  const { data: misCosas, error } = await supabase
    .from('items')
    .select('*');

  // Si hay error, lo mostramos en la consola del servidor
  if (error) console.log('Error cargando cosas:', error);

  return (
    <div className="min-h-screen p-8 bg-slate-900 text-white">
      <h1 className="text-4xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
        🧠 Mi Segundo Cerebro
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Si 'misCosas' existe, hacemos el mapa. Si está vacío, no hace nada */}
        {misCosas?.map((cosa) => (
          <div key={cosa.id} className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-blue-500 transition-colors">
            
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                {cosa.categoria}
              </span>
              <span className={`text-xs px-2 py-1 rounded text-gray-300 bg-slate-700`}>
                {cosa.estado}
              </span>
            </div>

            <h2 className="text-xl font-semibold">{cosa.titulo}</h2>
            
          </div>
        ))}

      </div>
    </div>
  );
}