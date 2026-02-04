import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Fuente optimizada de Google
import "./globals.css"; // Estilos globales (Tailwind, resets, etc.)
import Navbar from "@/components/Navbar"; // Navbar global

// Configuración de la fuente Inter
const inter = Inter({ subsets: ["latin"] });

// Metadata global del sitio (SEO)
export const metadata: Metadata = {
  title: "TechNova | Tu Tienda Tech",
  description: "El mejor hardware y gadgets de última generación",
};

// Layout raíz de la aplicación
export default function RootLayout({
  children,
}: {
  children: React.ReactNode; // Representa cada página (page.tsx)
}) {
  return (
    <html lang="es">
      <body
        className={`
          ${inter.className} 
          bg-gray-50 
          text-gray-900 
          antialiased
        `}
      >
        {/* Navbar visible en todas las páginas */}
        <Navbar />

        {/* Aquí se renderiza el contenido de cada página */}
        <div className="min-h-screen">
          {children}
        </div>

        {/* Footer global podría ir aquí */}
      </body>
    </html>
  );
}
