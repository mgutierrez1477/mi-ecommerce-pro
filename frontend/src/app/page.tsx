// src/app/page.tsx

import api from '@/lib/api'; // Axios configurado para Django
import { Product } from '@/types'; // Tipos de productos
import ProductCard from '@/components/ProductCard'; // Tarjeta de producto

// Función para obtener productos desde la API
async function getProducts() {
    try {
        // Llamada al endpoint /api/products/
        const response = await api.get('/products/');

        // Soporta API paginada o no paginada
        return response.data.results || response.data;
    } catch (error) {
        // En caso de error, devolvemos un array vacío
        return [];
    }
}

// Página principal (/)
export default async function HomePage() {
    // Esperamos los productos antes de renderizar
    const products: Product[] = await getProducts();

    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            
            {/* Banner de bienvenida */}
            <section className="mb-12 py-12 border-b">
                <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight">
                    Hardware de <span className="text-indigo-600">Nueva Generación</span>
                </h1>

                <p className="mt-4 text-lg text-gray-600 max-w-2xl">
                    Explora nuestra colección de componentes gamer y tecnología de punta.
                    Calidad garantizada y envío rápido.
                </p>
            </section>

            {/* Grid de productos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {products.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                    />
                ))}
            </div>
        </main>
    );
}
