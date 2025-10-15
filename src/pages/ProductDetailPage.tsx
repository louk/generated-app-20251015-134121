import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, ShoppingCart, ChevronLeft, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCartStore } from '@/store/use-cart-store';
import { Toaster, toast } from '@/components/ui/sonner';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import type { Product } from '@shared/types';
import { ProductDetailSkeleton } from '@/components/ProductDetailSkeleton';
export default function ProductDetailPage() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const addItemToCart = useCartStore((state) => state.addItem);
  const { data: product, isLoading, error, isError } = useQuery<Product>({
    queryKey: ['product', productId],
    queryFn: () => api(`/api/products/${productId}`),
    enabled: !!productId,
  });
  useEffect(() => {
    if (product) {
      document.title = `${product.name} | Deals.mn`;
    } else if (isError) {
      document.title = '��үтээгдэхүүн олдсонгүй | Deals.mn';
    } else {
      document.title = 'Ачааллаж байна... | Deals.mn';
    }
  }, [product, isError]);
  if (isError) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex items-center justify-center text-center px-4">
          <div>
            <AlertCircle className="w-16 h-16 text-destructive mx-auto" />
            <h1 className="mt-4 text-2xl md:text-4xl font-bold">404 - Олдсонгүй</h1>
            <p className="mt-4 text-muted-foreground">Уучлаарай, таны ��айсан бүтээгдэхүүн олдсонгүй.</p>
            <Button asChild className="mt-6">
              <Link to="/">Нүүр хууда�� руу буцах</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  const handleAddToCart = () => {
    if (product) {
      addItemToCart(product);
      toast.success(`${product.name} сагсанд нэмэгдлээ!`);
    }
  };
  const discount = product ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8 md:py-10 lg:py-12">
            <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Буцах
            </Button>
            {isLoading || !product ? (
              <ProductDetailSkeleton />
            ) : (
              <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                <div className="space-y-4">
                  <div className="aspect-square w-full overflow-hidden rounded-lg border">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div>
                  <Badge variant="outline">{product.category}</Badge>
                  <h1 className="text-3xl lg:text-4xl font-bold font-display mt-2">{product.name}</h1>
                  <div className="flex items-center mt-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            'h-5 w-5',
                            i < Math.round(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'
                          )}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground ml-2">({product.reviews} үнэлгээ)</span>
                  </div>
                  <div className="mt-6">
                    <p className="text-4xl font-bold text-foreground">{product.price.toLocaleString()}₮</p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-lg text-muted-foreground line-through">{product.originalPrice.toLocaleString()}₮</p>
                      <Badge variant="destructive">-{discount}%</Badge>
                    </div>
                  </div>
                  <div className="mt-6 prose prose-sm text-muted-foreground max-w-none">
                    <p>{product.description}</p>
                  </div>
                  <div className="mt-8">
                    <Button size="lg" className="w-full sm:w-auto" onClick={handleAddToCart}>
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      Сагсанд нэмэх
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
      <Toaster richColors closeButton />
    </div>
  );
}