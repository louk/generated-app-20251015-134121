import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/use-auth-store';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import type { Product } from '@shared/types';
import { ProductGridSkeleton } from '@/components/ProductGridSkeleton';
import { AlertCircle, PackagePlus } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from '@/components/ui/sonner';
export default function ProfilePage() {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState(false);
  useEffect(() => {
    document.title = user ? `${user.name}-ийн профайл | Deals.mn` : 'Профайл | Deals.mn';
  }, [user]);
  const { data: userProducts, isLoading, error } = useQuery<Product[]>({
    queryKey: ['userProducts', user?.id],
    queryFn: () => api(`/api/users/${user?.id}/products`),
    enabled: !!user,
  });
  const handleDelete = async (productId: string) => {
    setIsDeleting(true);
    try {
      await api(`/api/products/${productId}`, { method: 'DELETE' });
      toast.success('Санал амжилттай у��тгагдлаа.');
      await queryClient.invalidateQueries({ queryKey: ['userProducts', user?.id] });
      await queryClient.invalidateQueries({ queryKey: ['products'] });
    } catch (err) {
      toast.error('Санал устгахад алдаа гарлаа.');
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };
  const renderContent = () => {
    if (isLoading) {
      return <ProductGridSkeleton />;
    }
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center text-center py-20 border-2 border-dashed rounded-lg border-destructive/50 bg-destructive/5">
          <AlertCircle className="w-16 h-16 text-destructive" />
          <h3 className="mt-4 text-xl font-semibold text-destructive">Алдаа гарлаа</h3>
          <p className="mt-2 text-muted-foreground">Таны оруулсан барааг татахад алдаа гарлаа.</p>
        </div>
      );
    }
    if (!userProducts || userProducts.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center text-center py-20 border-2 border-dashed rounded-lg">
          <PackagePlus className="w-16 h-16 text-muted-foreground" />
          <h3 className="mt-4 text-xl font-semibold">Та санал нэмээгүй байна</h3>
          <p className="mt-2 text-muted-foreground">Таны нэмсэн хямдралтай саналууд энд харагдана.</p>
          <Button asChild className="mt-6">
            <Link to="/submit-deal">Анхны саналаа ��эмэх</Link>
          </Button>
        </div>
      );
    }
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {userProducts.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onEdit={() => navigate(`/edit-deal/${product.id}`)}
            onDelete={() => handleDelete(product.id)}
            isDeleting={isDeleting}
          />
        ))}
      </div>
    );
  };
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8 md:py-10 lg:py-12">
            <div className="mb-8">
              <h1 className="text-4xl font-display font-bold">Миний профайл</h1>
              <p className="mt-2 text-muted-foreground">Сайн байна уу, {user?.name}! Таны нэмсэн ��аналууд.</p>
            </div>
            {renderContent()}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}