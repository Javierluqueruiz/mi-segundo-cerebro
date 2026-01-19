'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function EditBookModal({ book, onClose, onUpdate }) {
  const [loading, setLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    estado: book.estado || 'Pendiente',
    resena: book.resena || '',
    // CAMBIO IMPORTANTE: Si no tiene puntuación, es 0 (no 5)
    puntuacion: book.puntuacion || 0
  })

  async function handleSave() {
    setLoading(true)
    const { error } = await supabase
      .from('items')
      .update({
        estado: formData.estado,
        resena: formData.resena,
        puntuacion: formData.puntuacion
      })
      .eq('id', book.id)

    if (error) {
      console.error(error)
      alert('Error al actualizar')
    } else {
      onUpdate()
      onClose()
    }
    setLoading(false)
  }

  async function handleDelete() {
    if(!confirm("¿Seguro que quieres borrar este libro?")) return;
    const { error } = await supabase.from('items').delete().eq('id', book.id)
    if (!error) {
      onUpdate()
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-700 p-6 rounded-xl w-full max-w-md shadow-2xl">
        
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-bold text-white line-clamp-1 pr-4">{book.titulo}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white bg-slate-800 rounded-full w-8 h-8 flex items-center justify-center transition-colors">✕</button>
        </div>

        <div className="space-y-6">
          
          {/* 1. Selector de Estado */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Estado</label>
            <select 
              className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-white focus:border-blue-500 outline-none"
              value={formData.estado}
              onChange={(e) => setFormData({...formData, estado: e.target.value})}
            >
              <option value="Pendiente">📅 Pendiente</option>
              <option value="Leyendo">📖 Leyendo</option>
              <option value="Terminado">✅ Terminado</option>
              <option value="Abandonado">❌ Abandonado</option>
            </select>
          </div>

          {/* 2. Puntuación (Lógica nueva: Botón vs Slider) */}
          <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm text-gray-400">Puntuación</label>
              
              {/* Si hay puntuación (>0), mostramos el valor y el botón de quitar */}
              {formData.puntuacion > 0 ? (
                <div className="flex items-center gap-3">
                  <span className="text-xl font-bold text-yellow-400">★ {formData.puntuacion}</span>
                  <button 
                    onClick={() => setFormData({...formData, puntuacion: 0})}
                    className="text-xs text-red-400 hover:text-red-300 underline"
                  >
                    Quitar nota
                  </button>
                </div>
              ) : (
                <span className="text-sm text-gray-500 italic">Sin calificar</span>
              )}
            </div>

            {/* CONDICIONAL: Si puntuacion > 0 mostramos slider, si no, botón de activar */}
            {formData.puntuacion > 0 ? (
              <>
                <input 
                  type="range" 
                  min="1" 
                  max="10" 
                  value={formData.puntuacion}
                  onChange={(e) => setFormData({...formData, puntuacion: parseInt(e.target.value)})}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1 px-1">
                  <span>1</span>
                  <span>5</span>
                  <span>10</span>
                </div>
              </>
            ) : (
              <button 
                onClick={() => setFormData({...formData, puntuacion: 5})} // Al activar empieza en 5
                className="w-full py-2 border border-dashed border-slate-600 text-slate-400 rounded hover:bg-slate-800 hover:text-yellow-400 transition-colors flex items-center justify-center gap-2"
              >
                <span>⭐</span> Añadir valoración
              </button>
            )}
          </div>

          {/* 3. Reseña */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Tu reseña personal</label>
            <textarea 
              rows="4"
              className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-white focus:border-blue-500 outline-none"
              placeholder="¿Qué te ha parecido?..."
              value={formData.resena}
              onChange={(e) => setFormData({...formData, resena: e.target.value})}
            />
          </div>

        </div>

        <div className="flex justify-between mt-8 pt-4 border-t border-slate-800">
          <button onClick={handleDelete} className="text-red-400 text-sm hover:text-red-300 transition-colors">Borrar libro</button>
          <button onClick={handleSave} disabled={loading} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-bold transition-all shadow-lg shadow-blue-900/20">
            {loading ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>

      </div>
    </div>
  )
}