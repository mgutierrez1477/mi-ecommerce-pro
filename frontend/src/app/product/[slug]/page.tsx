import api from '@/lib/api';
import { Product } from '@/types';
import Image from 'next/image';
import { ShoppingCart, ArrowLeft, ShieldCheck, Truck } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import AddToCartButton from '@/components/AddToCartButton';

async function getProduct(slug: string): Promise<Product | null> {
  try {
    const response = await api.get(`/products/${slug}/`);
    return response.data;
  } catch (error) {
    return null;
  }
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const {slug} = await params;

  const product = await getProduct(slug)

  if (!product) {
    notFound(); // Redirige a una página 404 si el slug no existe
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Botón Volver */}
      <Link href="/" className="flex items-center text-sm text-gray-500 hover:text-indigo-600 mb-8 transition">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Volver al catálogo
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Lado Izquierdo: Imagen */}
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 border">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">Sin imagen</div>
          )}
        </div>

        {/* Lado Derecho: Información */}
        <div className="flex flex-col">
          <span className="text-indigo-600 font-semibold tracking-wide uppercase text-sm">
            {product.category.name}
          </span>
          <h1 className="text-4xl font-bold text-gray-900 mt-2">{product.name}</h1>
          <p className="text-3xl text-gray-900 mt-4 font-light">${product.price}</p>
          
          <div className="mt-8">
            <h3 className="text-sm font-medium text-gray-900">Descripción</h3>
            <p className="text-gray-600 mt-4 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Estado del Stock */}
          <div className="mt-6 flex items-center">
            <div className={`h-2.5 w-2.5 rounded-full mr-2 ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm text-gray-600">
              {product.stock > 0 ? `${product.stock} unidades disponibles` : 'Agotado'}
            </span>
          </div>

          {/* Botón de Compra */}
          <AddToCartButton product={product} />

          {/* Beneficios Extra */}
          <div className="mt-10 grid grid-cols-1 gap-4 border-t pt-8">
            <div className="flex items-start">
              <Truck className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900">Envío Gratis</p>
                <p className="text-sm text-gray-500">En pedidos superiores a $50.00</p>
              </div>
            </div>
            <div className="flex items-start">
              <ShieldCheck className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900">Garantía TechNova</p>
                <p className="text-sm text-gray-500">12 meses contra defectos de fábrica.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}