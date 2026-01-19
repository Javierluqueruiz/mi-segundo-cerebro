'use client'
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import BookForm from '@/components/BookForm';
import EditBookModal from '@/components/EditBookModal';

export default function LibraryPage() {
  const [libros, setLibros] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  
  // Novedades: Ahora 'vista' puede ser 'todo', 'autor', 'estado' o 'valoracion'
  const [busqueda, setBusqueda] = useState('');
  const [vista, setVista] = useState('todo'); 

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
    // .trim() elimina espacios en blanco al principio y al final automáticamente
    const autor = libro.autor ? libro.autor.trim() : 'Desconocido';
    
    if (!acc[autor]) acc[autor] = [];
    acc[autor].push(libro);
    return acc;
  }, {});

  // 3. AGRUPACIÓN (Por Estado)
  const librosPorEstado = librosFiltrados.reduce((acc, libro) => {
    const estado = libro.estado || 'Sin estado';
    if (!acc[estado]) acc[estado] = [];
    acc[estado].push(libro);
    return acc;
  }, {});
  
  const ordenEstados = ['Pendiente', 'Leyendo', 'Terminado', 'Abandonado'];

  // 4. AGRUPACIÓN (Por Valoración) - TU LÓGICA MEJORADA
  const librosPorValoracion = librosFiltrados.reduce((acc, libro) => {
    // Si es 0 o null, lo agrupamos bajo la clave "Sin valorar"
    const puntuacion = libro.puntuacion ? libro.puntuacion.toString() : "Sin valorar";
    if (!acc[puntuacion]) acc[puntuacion] = [];
    acc[puntuacion].push(libro);
    return acc;
  }, {});

  // Lógica de Ordenación para Valoración (De 10 a 1, y luego "Sin valorar")
  const clavesValoracionOrdenadas = Object.keys(librosPorValoracion).sort((a, b) => {
    if (a === "Sin valorar") return 1; // "Sin valorar" va al final
    if (b === "Sin valorar") return -1;
    return Number(b) - Number(a); // Orden descendente numérico (10 antes que 9)
  });

  // Componente Tarjeta (BookCard)
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
      <div className="absolute top-2 right-2 flex flex-col items-end gap-1">
         <span className={`text-[10px] font-bold px-2 py-1 rounded shadow-sm
            ${libro.estado === 'Terminado' ? 'bg-green-500 text-black' : 
              libro.estado === 'Leyendo' ? 'bg-yellow-400 text-black' : 
              'bg-black/50 text-white backdrop-blur-md'}`}>
            {libro.estado}
          </span>
      </div>
      
      {/* Puntuación visible siempre si existe */}
      {libro.puntuacion > 0 && (
         <div className="absolute top-2 left-2">
            <span className="bg-black/60 backdrop-blur-md text-yellow-400 text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
              ★ {libro.puntuacion}
            </span>
         </div>
      )}

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
            placeholder="Buscar..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2 pl-10 pr-4 text-white focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Toggle Vista (4 botones) */}
        <div className="flex bg-slate-950 rounded-lg p-1 border border-slate-700 overflow-x-auto">
          <button 
            onClick={() => setVista('todo')}
            className={`px-4 py-1.5 rounded-md text-sm transition-colors whitespace-nowrap ${vista === 'todo' ? 'bg-blue-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
          >
            Todo
          </button>
          <button 
            onClick={() => setVista('autor')}
            className={`px-4 py-1.5 rounded-md text-sm transition-colors whitespace-nowrap ${vista === 'autor' ? 'bg-blue-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
          >
            Autores
          </button>
           <button 
            onClick={() => setVista('estado')}
            className={`px-4 py-1.5 rounded-md text-sm transition-colors whitespace-nowrap ${vista === 'estado' ? 'bg-blue-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
          >
            Estados
          </button>
          <button 
            onClick={() => setVista('valoracion')}
            className={`px-4 py-1.5 rounded-md text-sm transition-colors whitespace-nowrap ${vista === 'valoracion' ? 'bg-blue-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
          >
            Valoración
          </button>
        </div>
      </div>

      {/* --- CONTENIDO PRINCIPAL --- */}
      
      {/* VISTA 1: Por Autores */}
      {vista === 'autor' && (
        <div className="space-y-12">
          {Object.entries(librosPorAutor).map(([autor, librosDelAutor]) => (
            <section key={autor} className="bg-slate-900/30 p-6 rounded-2xl border border-slate-800/50">
              <h2 className="text-2xl font-bold text-blue-400 mb-6 flex items-center gap-3">
                <span className="w-8 h-1 bg-blue-500 rounded-full inline-block"></span>
                {autor} 
                <span className="text-sm font-normal text-gray-500 ml-auto bg-slate-800 px-3 py-1 rounded-full">{librosDelAutor.length}</span>
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {librosDelAutor.map(libro => <BookCard key={libro.id} libro={libro} />)}
              </div>
            </section>
          ))}
        </div>
      )}

      {/* VISTA 2: Por Estado */}
      {vista === 'estado' && (
        <div className="space-y-12">
          {ordenEstados.map(estado => {
             const librosDelEstado = librosPorEstado[estado];
             if (!librosDelEstado) return null;

             const colorTitulo = estado === 'Terminado' ? 'text-green-400' : 
                                 estado === 'Leyendo' ? 'text-yellow-400' : 'text-blue-400';

             return (
              <section key={estado} className="bg-slate-900/30 p-6 rounded-2xl border border-slate-800/50">
                <h2 className={`text-2xl font-bold ${colorTitulo} mb-6 flex items-center gap-3`}>
                  <span className={`w-8 h-1 rounded-full inline-block ${estado === 'Terminado' ? 'bg-green-500' : estado === 'Leyendo' ? 'bg-yellow-500' : 'bg-blue-500'}`}></span>
                  {estado} 
                  <span className="text-sm font-normal text-gray-500 ml-auto bg-slate-800 px-3 py-1 rounded-full">{librosDelEstado.length}</span>
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {librosDelEstado.map(libro => <BookCard key={libro.id} libro={libro} />)}
                </div>
              </section>
             )
          })}
        </div>
      )}

      {/* VISTA 3: Por Valoración (TU NUEVA VISTA ORDENADA) */}
      {vista === 'valoracion' && (
        <div className="space-y-12">
          {clavesValoracionOrdenadas.map(puntuacion => {
            const librosConPuntuacion = librosPorValoracion[puntuacion];
            // Estilo especial para la estrella
            const esSinValorar = puntuacion === 'Sin valorar';
            
            return (
              <section key={puntuacion} className="bg-slate-900/30 p-6 rounded-2xl border border-slate-800/50">
                <h2 className={`text-2xl font-bold mb-6 flex items-center gap-3 ${esSinValorar ? 'text-gray-500' : 'text-yellow-400'}`}>
                  {/* Icono de estrella solo si tiene nota */}
                  {!esSinValorar && <span>★</span>}
                  {puntuacion}
                  <span className="text-sm font-normal text-gray-500 ml-auto bg-slate-800 px-3 py-1 rounded-full">{librosConPuntuacion.length}</span>
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {librosConPuntuacion.map(libro => <BookCard key={libro.id} libro={libro} />)}
                </div>
              </section>
            )
          })}
        </div>
      )}

      {/* VISTA 4: Todo */}
      {vista === 'todo' && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {librosFiltrados.map(libro => <BookCard key={libro.id} libro={libro} />)}
        </div>
      )}

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