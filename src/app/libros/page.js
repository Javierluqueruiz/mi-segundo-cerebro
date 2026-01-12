'use client' // Lo convertimos a cliente para poder usar interactividad
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import BookForm from '@/components/BookForm';

export default function Home() {
  const [libros, setLibros] = useState([]);

  // Función para cargar los libros desde Supabase
  async function cargarLibros() {
    const { data } = await supabase
      .from('items')
      .select('*')
      .eq('categoria', 'Libro') // FILTRO: Solo traeme los que sean 'Libro'
      .order('created_at', { ascending: false }); // Los más nuevos primero
    
    if (data) setLibros(data);
  }

  // Esto se ejecuta una vez al entrar en la página
  useEffect(() => {
    cargarLibros();
  }, []);

  return (
    <div className="min-h-screen p-8 bg-slate-900 text-white">
      <h1 className="text-4xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
        📚 Mi Biblioteca
      </h1>

      {/* Aquí ponemos el formulario. Cuando se guarde un libro, recargamos la lista */}
      <div className="max-w-4xl mx-auto">
        <BookForm onBookAdded={cargarLibros} />

        {/* Lista de Libros */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {libros.map((libro) => (
            <div key={libro.id} className="bg-slate-800 p-6 rounded-xl border border-slate-700 flex flex-col justify-between">
              
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    {libro.autor || 'Autor desconocido'}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded 
                    ${libro.estado === 'Terminado' ? 'bg-green-900 text-green-300' : 
                      libro.estado === 'Leyendo' ? 'bg-yellow-900 text-yellow-300' : 
                      'bg-slate-700 text-gray-300'}`}>
                    {libro.estado}
                  </span>
                </div>
                <h2 className="text-2xl font-bold mb-2">{libro.titulo}</h2>
                
                {/* Si hay reseña, la mostramos */}
                {libro.resena && (
                  <p className="text-gray-400 italic text-sm mt-4">
                    "{libro.resena}"
                  </p>
                )}
              </div>

            </div>
          ))}
          
          {libros.length === 0 && (
            <p className="text-center text-gray-500 col-span-full">
              No tienes libros todavía. ¡Añade el primero arriba!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}