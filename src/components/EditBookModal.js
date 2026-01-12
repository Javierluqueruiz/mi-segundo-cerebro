'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function EditBookModal({ book, onClose, onUpdate }) {
  const [loading, setLoading] = useState(false)
  
  // Guardamos los datos temporales del formulario
  const [formData, setFormData] = useState({
    estado: book.estado || 'Pendiente',
    resena: book.resena || '',
    puntuacion: book.puntuacion || 0
  })

  async function handleSave() {
    setLoading(true)
    
    // Actualizamos en Supabase
    const { error } = await supabase
      .from('items')
      .update({
        estado: formData.estado,
        resena: formData.resena,
        puntuacion: formData.puntuacion
      })
      .eq('id', book.id) // Busca el libro por su ID

    if (error) {
      console.error(error)
      alert('Error al actualizar')
    } else {
      onUpdate() // Recargamos la lista de fondo
      onClose()  // Cerramos la ventana
    }
    setLoading(false)
  }

  // Función para borrar el libro (por si te equivocas)
  async function handleDelete() {
    if(!confirm("¿Seguro que quieres borrar este libro?")) return;
    
    const { error } = await supabase.from('items').delete().eq('id', book.id)
    if (!error) {
      onUpdate()
      onClose()
    }
  }

  return (
    // Fondo oscuro transparente
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      
      {/* La caja blanca (o gris) del modal */}
      <div className="bg-slate-900 border border-slate-700 p-6 rounded-xl w-full max-w-md shadow-2xl">
        
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-bold text-white">{book.titulo}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
        </div>

        <div className="space-y-4">
          
          {/* 1. Selector de Estado */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">Estado</label>
            <select 
              className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-white"
              value={formData.estado}
              onChange={(e) => setFormData({...formData, estado: e.target.value})}
            >
              <option value="Pendiente">📅 Pendiente</option>
              <option value="Leyendo">📖 Leyendo</option>
              <option value="Terminado">✅ Terminado</option>
              <option value="Abandonado">❌ Abandonado</option>
            </select>
          </div>

          {/* 2. Puntuación (Solo si está terminado o leyendo) */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">Puntuación (1-5)</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setFormData({...formData, puntuacion: star})}
                  className={`text-2xl transition-transform hover:scale-110 ${
                    formData.puntuacion >= star ? 'text-yellow-400' : 'text-gray-700'
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          {/* 3. Reseña */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">Tu reseña personal</label>
            <textarea 
              rows="4"
              className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-white"
              placeholder="¿Qué te ha parecido?..."
              value={formData.resena}
              onChange={(e) => setFormData({...formData, resena: e.target.value})}
            />
          </div>

        </div>

        {/* Botones de acción */}
        <div className="flex justify-between mt-8 pt-4 border-t border-slate-800">
          <button 
            onClick={handleDelete}
            className="text-red-400 text-sm hover:text-red-300"
          >
            Borrar libro
          </button>
          
          <button 
            onClick={handleSave}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-bold"
          >
            {loading ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>

      </div>
    </div>
  )
}