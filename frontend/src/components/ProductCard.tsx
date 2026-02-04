import Image from "next/image";
import Link from "next/link";
import { Product } from "../types";

export default function ProductCard({ product }: { product: Product}){
    return (
        <div className="group relative border rounded-lg p-4 hover:shadow-lg transition">
            <div className="aspect-square w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75">
                {product.image ? (
                    <Image
                        src={product.image}
                        alt={product.name}
                        width={500}
                        height={500}
                        className="h-full w-full object-cover object-center"
                    />
                ) : (
                    <div className="h-full w-full flex items-center justify-center bg-gray-100">Sin imagen</div>
                )}
            </div>
            <div className="mt-4 flex justify-between">
                <div>
                    <h3 className="text-sm text-gray-700 font-bold">
                        <Link href={`/product/${product.slug}`}>
                            <span aria-hidden="true" className="absolute inset-0" />
                            {product.name}
                        </Link>
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">{product.category.name}</p>
                </div>
                <p className="text-sm font-medium text-gray-900">${product.price}</p>
            </div>
        </div>
    );
}