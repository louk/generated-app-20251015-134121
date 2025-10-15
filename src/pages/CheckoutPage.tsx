import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useCartStore } from '@/store/use-cart-store';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/sonner';
const checkoutSchema = z.object({
  name: z.string().min(2, 'Нэр 2-оос дээш тэмдэгттэй байх ёстой.'),
  address: z.string().min(10, 'Хаяг 10-аас дээш тэмдэгттэй байх ёстой.'),
  phone: z.string().regex(/^\d{8}$/, 'Утасны дугаар 8 оронтой байх ёстой.'),
});
type CheckoutFormValues = z.infer<typeof checkoutSchema>;
export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, clearCart } = useCartStore();
  const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0);
  useEffect(() => {
    document.title = '��ооцоо хийх | Deals.mn';
    if (items.length === 0) {
      navigate('/');
    }
  }, [items, navigate]);
  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { name: '', address: '', phone: '' },
  });
  const onSubmit = (data: CheckoutFormValues) => {
    console.log('Order submitted:', data);
    toast.success('Захиалга амжилттай!');
    clearCart();
    navigate('/order-success');
  };
  return (
    <div className="flex flex-col min-h-screen bg-secondary/50">
      <Header />
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8 md:py-10 lg:py-12">
            <h1 className="text-4xl font-display font-bold text-center mb-8">Тооцоо хийх</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Хүргэлтийн мэдээлэл</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} id="checkout-form" className="space-y-4">
                        <FormField control={form.control} name="name" render={({ field }) => (
                          <FormItem><FormLabel>Нэр</FormLabel><FormControl><Input placeholder="Таны нэр" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="address" render={({ field }) => (
                          <FormItem><FormLabel>Хүргүүлэх хаяг</FormLabel><FormControl><Input placeholder="Дүүрэг, хороо, байр, тоот" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="phone" render={({ field }) => (
                          <FormItem><FormLabel>Утасны дугаар</FormLabel><FormControl><Input type="tel" placeholder="99XXXXXX" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </div>
              <div className="lg:col-span-1">
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle>Таны захиалга</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {items.map(item => (
                      <div key={item.id} className="flex justify-between items-center text-sm">
                        <p className="truncate pr-2">{item.name} <span className="text-muted-foreground">x{item.quantity}</span></p>
                        <p className="font-medium whitespace-nowrap">{(item.price * item.quantity).toLocaleString()}₮</p>
                      </div>
                    ))}
                    <Separator />
                    <div className="flex justify-between items-center font-bold text-lg">
                      <p>Нийт д��н:</p>
                      <p>{totalPrice.toLocaleString()}₮</p>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" form="checkout-form" className="w-full" size="lg" disabled={form.formState.isSubmitting}>
                      Захиалах
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}