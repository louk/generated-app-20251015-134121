import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from '@/components/ui/sonner';
import { api } from '@/lib/api-client';
import type { Product } from '@shared/types';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
const dealSchema = z.object({
  name: z.string().min(3, 'Нэр 3-аас дээш тэмдэгттэй байх ёстой'),
  description: z.string().min(10, 'Тайлбар 10-аас дээш тэмдэгттэй байх ёстой'),
  image: z.string().min(1, 'Зургийн URL оруулна уу').url('Зургийн URL буруу байна'),
  price: z.coerce.number().positive('Үнэ эерэг тоо байх ёстой'),
  originalPrice: z.coerce.number().positive('Анхны үнэ эерэг тоо байх ёстой'),
  category: z.string().min(1, 'Ангилал оруулна уу'),
  brand: z.string().min(1, 'Брэнд оруулна уу'),
}).refine(data => data.price < data.originalPrice, {
  message: "Хямдарсан үнэ анхны үнээс бага байх ёстой",
  path: ["price"],
});
type DealFormValues = z.infer<typeof dealSchema>;
const EditDealFormSkeleton = () => (
  <div className="mt-8 space-y-6 max-w-2xl mx-auto">
    <Skeleton className="h-10 w-full" />
    <Skeleton className="h-24 w-full" />
    <Skeleton className="h-10 w-full" />
    <div className="grid grid-cols-2 gap-6"><Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-full" /></div>
    <div className="grid grid-cols-2 gap-6"><Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-full" /></div>
    <Skeleton className="h-12 w-full" />
  </div>
);
export default function EditDealPage() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: product, isLoading, isError } = useQuery<Product>({
    queryKey: ['product', productId],
    queryFn: () => api(`/api/products/${productId}`),
    enabled: !!productId,
  });
  const form = useForm<DealFormValues>({
    resolver: zodResolver(dealSchema),
    defaultValues: {
      name: '',
      description: '',
      image: '',
      price: undefined,
      originalPrice: undefined,
      category: '',
      brand: '',
    },
  });
  useEffect(() => {
    if (product) {
      document.title = `Засварлах: ${product.name} | Deals.mn`;
      form.reset({
        name: product.name,
        description: product.description,
        image: product.image,
        price: product.price,
        originalPrice: product.originalPrice,
        category: product.category,
        brand: product.brand,
      });
    }
  }, [product, form]);
  const onSubmit = async (data: DealFormValues) => {
    try {
      await api<Product>(`/api/products/${productId}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
      toast.success('Амжилттай шинэчиллээ.');
      await queryClient.invalidateQueries({ queryKey: ['product', productId] });
      await queryClient.invalidateQueries({ queryKey: ['products'] });
      await queryClient.invalidateQueries({ queryKey: ['userProducts'] });
      navigate(`/product/${productId}`);
    } catch (error) {
      toast.error('Шинэчлэхэд алдаа гарлаа.');
      console.error(error);
    }
  };
  if (isError) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex items-center justify-center text-center px-4">
          <div>
            <AlertCircle className="w-16 h-16 text-destructive mx-auto" />
            <h1 className="mt-4 text-2xl md:text-4xl font-bold">404 - Олдсонгү��</h1>
            <p className="mt-4 text-muted-foreground">Таны хайсан бүтээгдэхүүн олдсонгүй.</p>
            <Button asChild className="mt-6"><Link to="/">Нүүр хуудас руу буцах</Link></Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8 md:py-10 lg:py-12">
            <div className="text-center">
              <h1 className="text-4xl font-display font-bold">Санал засварлах</h1>
              <p className="mt-2 text-muted-foreground">Барааны мэдээ��лийг шинэчлэнэ үү.</p>
            </div>
            {isLoading ? <EditDealFormSkeleton /> : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-6 max-w-2xl mx-auto">
                  <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem><FormLabel>Барааны нэр</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="description" render={({ field }) => (
                    <FormItem><FormLabel>Тайлбар</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="image" render={({ field }) => (
                    <FormItem><FormLabel>Зургийн URL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="originalPrice" render={({ field }) => (
                      <FormItem><FormLabel>Анхны үнэ (₮)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="price" render={({ field }) => (
                      <FormItem><FormLabel>Хямдарсан үнэ (₮)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="category" render={({ field }) => (
                      <FormItem><FormLabel>Ангилал</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="brand" render={({ field }) => (
                      <FormItem><FormLabel>Брэнд</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>
                  <Button type="submit" className="w-full" size="lg" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? 'Хадгалж байна...' : 'Хадгалах'}
                  </Button>
                </form>
              </Form>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}