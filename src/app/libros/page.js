'use client'
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import BookForm from '@/components/BookForm';
import EditBookModal from '@/components/EditBookModal';

export default function LibraryPage() {
  const [libros, setLibros] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  
  // Novedades: Estados para el buscador y la vista
  const [busqueda, setBusqueda] = useState('');
  const [vistaAutores, setVistaAutores] = useState(false);

  async function cargarLibros() {
    const { data } = await supabase
      .from('items')
      .select('*')
      .eq('categoria', 'Libro')
      .order('created_at', { ascending: false });
    
    if (data) setLibros(data);
  }

  useEffect(() => {
    cargarLibros();
  }, []);

  // 1. FILTRADO (Buscador)
  const librosFiltrados = libros.filter(libro => 
    libro.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
    libro.autor.toLowerCase().includes(busqueda.toLowerCase())
  );

  // 2. AGRUPACIÓN (Por Autor)
  const librosPorAutor = librosFiltrados.reduce((acc, libro) => {
    const autor = libro.autor || 'Desconocido';
    if (!acc[autor]) acc[autor] = [];
    acc[autor].push(libro);
    return acc;
  }, {});

  // Componente pequeño para renderizar una tarjeta (para no repetir código)
  const BookCard = ({ libro }) => (
    <div 
      onClick={() => setSelectedBook(libro)}
      className="group relative aspect-[2/3] bg-slate-800 rounded-xl overflow-hidden cursor-pointer shadow-xl transition-all hover:scale-105 hover:shadow-2xl hover:z-10"
    >
      {libro.imagen_url ? (
        <img src={libro.imagen_url} alt={libro.titulo} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center p-4 text-center">
          <span className="text-slate-500 font-bold">Sin Portada</span>
        </div>
      )}
      
      {/* Estado flotante */}
      <div className="absolute top-2 right-2">
         <span className={`text-[10px] font-bold px-2 py-1 rounded shadow-sm
            ${libro.estado === 'Terminado' ? 'bg-green-500 text-black' : 
              libro.estado === 'Leyendo' ? 'bg-yellow-400 text-black' : 
              'bg-black/50 text-white backdrop-blur-md'}`}>
            {libro.estado}
          </span>
      </div>

      {/* Info Hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
        <h3 className="text-white font-bold leading-tight mb-1">{libro.titulo}</h3>
        <p className="text-gray-300 text-xs">{libro.autor}</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Mi Biblioteca</h1>
        <p className="text-gray-400">Gestiona tu colección personal.</p>
      </header>

      <BookForm onBookAdded={cargarLibros} />

      {/* --- BARRA DE HERRAMIENTAS --- */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-8 mb-6 bg-slate-900/50 p-4 rounded-xl border border-slate-800">
        
        {/* Buscador */}
        <div className="relative w-full md:w-96">
          <span className="absolute left-3 top-2.5 text-gray-500">🔍</span>
          <input 
            type="text"
            placeholder="Buscar por título o autor..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2 pl-10 pr-4 text-white focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Toggle Vista */}
        <div className="flex bg-slate-950 rounded-lg p-1 border border-slate-700">
          <button 
            onClick={() => setVistaAutores(false)}
            className={`px-4 py-1.5 rounded-md text-sm transition-colors ${!vistaAutores ? 'bg-blue-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
          >
            Todo
          </button>
          <button 
            onClick={() => setVistaAutores(true)}
            className={`px-4 py-1.5 rounded-md text-sm transition-colors ${vistaAutores ? 'bg-blue-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
          >
            Por Autores
          </button>
        </div>
      </div>

      {/* --- CONTENIDO PRINCIPAL --- */}
      
      {/* VISTA A: Agrupado por Autores */}
      {vistaAutores ? (
        <div className="space-y-12">
          {Object.entries(librosPorAutor).map(([autor, librosDelAutor]) => (
            <section key={autor} className="bg-slate-900/30 p-6 rounded-2xl border border-slate-800/50">
              <h2 className="text-2xl font-bold text-blue-400 mb-6 flex items-center gap-3">
                <span className="w-8 h-1 bg-blue-500 rounded-full inline-block"></span>
                {autor} 
                <span className="text-sm font-normal text-gray-500 ml-auto bg-slate-800 px-3 py-1 rounded-full">{librosDelAutor.length} libros</span>
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {librosDelAutor.map(libro => <BookCard key={libro.id} libro={libro} />)}
              </div>
            </section>
          ))}
        </div>
      ) : (
        // VISTA B: Cuadrícula normal (Grid)
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {librosFiltrados.map(libro => <BookCard key={libro.id} libro={libro} />)}
        </div>
      )}

      {/* Modal de Edición */}
      {selectedBook && (
        <EditBookModal 
          book={selectedBook} 
          onClose={() => setSelectedBook(null)} 
          onUpdate={cargarLibros} 
        />
      )}
    </div>
  );
}