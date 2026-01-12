import "./globals.css";
import Link from 'next/link';

export const metadata = {
  title: "Mi Segundo Cerebro",
  description: "Organizador de vida personal",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="bg-slate-950 text-white min-h-screen flex">
        
        {/* --- MENÚ LATERAL (SIDEBAR) --- */}
        <aside className="w-64 bg-slate-900 border-r border-slate-800 hidden md:flex flex-col p-4 fixed h-full">
          <div className="mb-8 p-2">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
              🧠 Cerebro
            </h1>
          </div>
          
          <nav className="space-y-2">
            <Link href="/" className="block px-4 py-2 rounded-lg hover:bg-slate-800 text-gray-300 hover:text-white transition-colors">
              🏠 Inicio
            </Link>
            <Link href="/libros" className="block px-4 py-2 rounded-lg hover:bg-slate-800 text-gray-300 hover:text-white transition-colors">
              📚 Biblioteca
            </Link>
            {/* Aquí añadiremos más secciones en el futuro: Videojuegos, Regalos... */}
          </nav>

          <div className="mt-auto pt-4 border-t border-slate-800">
             <p className="text-xs text-gray-500">v1.0 - Alpha</p>
          </div>
        </aside>

        {/* --- CONTENIDO PRINCIPAL --- */}
        <main className="flex-1 md:ml-64 p-8">
          {children}
        </main>

      </body>
    </html>
  );
}