import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from '@/components/ui/sonner';
import { api } from '@/lib/api-client';
import type { Product } from '@shared/types';
import { useAuthStore } from '@/store/use-auth-store';
const dealSchema = z.object({
  name: z.string().min(3, 'Нэр 3-аас дээш тэ��дэгттэй байх ёстой'),
  description: z.string().min(10, 'Тайлбар 10-аас дээш тэмдэгттэй байх ёстой'),
  image: z.string().min(1, 'Зургий�� URL оруулна уу').url('Зургийн URL буруу байна'),
  price: z.coerce.number().positive('Үнэ эерэг тоо байх ёстой'),
  originalPrice: z.coerce.number().positive('Анхны үнэ эерэг тоо байх ёстой'),
  category: z.string().min(1, 'Ангилал оруулна уу'),
  brand: z.string().min(1, 'Брэнд оруулна уу'),
}).refine(data => data.price < data.originalPrice, {
  message: "Хямдарсан үнэ анхны үнээс бага байх ёстой",
  path: ["price"],
});
type DealFormValues = z.infer<typeof dealSchema>;
export default function SubmitDealPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
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
  const onSubmit = async (data: DealFormValues) => {
    if (!user) {
      toast.error('Та нэвтэрсэн байх шаардлагатай.');
      return;
    }
    try {
      const payload = { ...data, submittedBy: user.id };
      const newProduct = await api<Product>('/api/products', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      toast.success('Амжилттай! Таны бараа нэмэгдлээ.');
      navigate(`/product/${newProduct.id}`);
    } catch (error) {
      toast.error('Бараа нэмэхэд алдаа гар��аа. Дахин оролдоно уу.');
      console.error(error);
    }
  };
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8 md:py-10 lg:py-12">
            <div className="text-center">
              <h1 className="text-4xl font-display font-bold">Шинэ ��анал нэмэх</h1>
              <p className="mt-2 text-muted-foreground">Өөрийн санал болгох барааг оруулна уу.</p>
            </div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-6 max-w-2xl mx-auto">
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem><FormLabel>Барааны нэр</FormLabel><FormControl><Input placeholder="Гоёмсог цамц" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="description" render={({ field }) => (
                  <FormItem><FormLabel>Тайлбар</FormLabel><FormControl><Textarea placeholder="Энэхүү цамц нь..." {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="image" render={({ field }) => (
                  <FormItem><FormLabel>Зургийн URL</FormLabel><FormControl><Input placeholder="https://source.unsplash.com/random/400x400" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField control={form.control} name="originalPrice" render={({ field }) => (
                    <FormItem><FormLabel>Анхны үнэ (₮)</FormLabel><FormControl><Input type="number" placeholder="100000" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="price" render={({ field }) => (
                    <FormItem><FormLabel>Хямдарсан үнэ (₮)</FormLabel><FormControl><Input type="number" placeholder="75000" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField control={form.control} name="category" render={({ field }) => (
                    <FormItem><FormLabel>Ангилал</FormLabel><FormControl><Input placeholder="Хувцас" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="brand" render={({ field }) => (
                    <FormItem><FormLabel>Брэнд</FormLabel><FormControl><Input placeholder="Nike" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
                <Button type="submit" className="w-full" size="lg" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? 'Илгээж байна...' : 'Санал илгээх'}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}