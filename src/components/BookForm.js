'use client' // Esto avisa a Next.js que este trozo funciona en el navegador del usuario
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function BookForm({ onBookAdded }) {
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault() // Evita que la página se recargue sola
    setLoading(true)

    // Recogemos los datos del formulario
    const formData = new FormData(e.target)
    const nuevoLibro = {
      titulo: formData.get('titulo'),
      autor: formData.get('autor'),
      categoria: 'Libro', // Lo forzamos a que sea Libro
      estado: 'Por leer', // Estado inicial por defecto
    }

    // Guardamos en Supabase
    const { error } = await supabase.from('items').insert([nuevoLibro])

    if (error) {
      alert('Error guardando el libro')
      console.error(error)
    } else {
      // Limpiamos el formulario y avisamos a la página principal
      e.target.reset()
      if (onBookAdded) onBookAdded() 
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-slate-800 p-6 rounded-xl border border-slate-700 mb-8">
      <h3 className="text-xl font-bold mb-4 text-blue-400">📚 Añadir nuevo libro</h3>
      
      <div className="flex flex-col gap-4 md:flex-row">
        <input 
          name="titulo" 
          placeholder="Título del libro (Ej: Dune)" 
          required 
          className="flex-1 bg-slate-900 border border-slate-600 rounded p-2 text-white"
        />
        <input 
          name="autor" 
          placeholder="Autor (Ej: Frank Herbert)" 
          required 
          className="flex-1 bg-slate-900 border border-slate-600 rounded p-2 text-white"
        />
        <button 
          type="submit" 
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded transition-colors disabled:opacity-50"
        >
          {loading ? 'Guardando...' : 'Añadir'}
        </button>
      </div>
    </form>
  )
}