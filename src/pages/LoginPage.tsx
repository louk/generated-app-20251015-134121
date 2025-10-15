import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useAuthStore } from '@/store/use-auth-store';
import { toast } from '@/components/ui/sonner';
import { Package2 } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
const loginSchema = z.object({
  name: z.string().min(1, { message: 'Нэвтрэх ��эр оруулна уу' }),
  password: z.string().min(6, { message: 'Нууц үг 6-а��с дээш тэмдэгттэй байх ёстой' }),
});
type LoginFormValues = z.infer<typeof loginSchema>;
export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((state) => state.login);
  const from = location.state?.from?.pathname || "/";
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      name: '',
      password: '',
    },
  });
  const onSubmit = async (data: LoginFormValues) => {
    try {
      await login(data);
      toast.success('Амжилттай нэвтэрлээ!');
      navigate(from, { replace: true });
    } catch (error) {
      toast.error('Нэвтрэх нэр эсвэл нууц үг буруу байна.');
      console.error(error);
    }
  };
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Link to="/" className="flex items-center gap-2">
                <Package2 className="h-8 w-8 text-accent" />
                <span className="font-bold text-2xl font-display">Deals.mn</span>
              </Link>
            </div>
            <CardTitle className="text-2xl">Нэвтрэх</CardTitle>
            <CardDescription>Бүртгэлтэй хэрэглэгч нэвтэр��э үү.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Нэвтрэх нэр</FormLabel>
                      <FormControl>
                        <Input placeholder="Таны нэвтрэх нэр" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Нууц үг</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Нууц үг" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? 'Нэвтэрч байна...' : 'Нэвтрэх'}
                </Button>
              </form>
            </Form>
            <div className="mt-4 text-center text-sm">
              Бүртгэлгүй юу?{' '}
              <Link to="/register" className="underline">
                Бүртгүүлэх
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}