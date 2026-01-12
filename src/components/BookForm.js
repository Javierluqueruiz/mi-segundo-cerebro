'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function BookForm({ onBookAdded }) {
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.target)
    const nuevoLibro = {
      titulo: formData.get('titulo'),
      autor: formData.get('autor'),
      imagen_url: formData.get('imagen_url'), // <--- ¡Nuevo campo!
      categoria: 'Libro',
      estado: 'Por leer',
    }

    const { error } = await supabase.from('items').insert([nuevoLibro])

    if (error) {
      alert('Error guardando el libro')
      console.error(error)
    } else {
      e.target.reset()
      if (onBookAdded) onBookAdded() 
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-slate-800 p-6 rounded-xl border border-slate-700 mb-8 shadow-lg">
      <h3 className="text-xl font-bold mb-4 text-blue-400 flex items-center gap-2">
        <span>📚</span> Añadir nuevo libro
      </h3>
      
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row gap-4">
          <input 
            name="titulo" 
            placeholder="Título (Ej: El Imperio Final)" 
            required 
            className="flex-1 bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
          <input 
            name="autor" 
            placeholder="Autor (Ej: Brandon Sanderson)" 
            required 
            className="flex-1 bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
        </div>
        
        <div className="flex gap-4">
          <input 
            name="imagen_url" 
            placeholder="Pegar URL de la portada (Google Imágenes...)" 
            className="flex-1 bg-slate-900 border border-slate-600 rounded-lg p-3 text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
          <button 
            type="submit" 
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-8 rounded-lg transition-all hover:scale-105 disabled:opacity-50 whitespace-nowrap"
          >
            {loading ? '...' : 'Añadir Libro'}
          </button>
        </div>
      </div>
    </form>
  )
}