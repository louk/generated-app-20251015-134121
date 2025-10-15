import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
export default function OrderSuccessPage() {
  useEffect(() => {
    document.title = 'Захиалга амжилттай | Deals.mn';
  }, []);
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow flex items-center justify-center text-center px-4">
        <div className="py-16">
          <CheckCircle2 className="w-24 h-24 text-green-500 mx-auto animate-scale-in" />
          <h1 className="mt-6 text-4xl font-display font-bold">Баярлалаа!</h1>
          <p className="mt-4 text-lg text-muted-foreground">Таны захиалга амжилттай хийгдлээ.</p>
          <p className="text-muted-foreground">Бид тантай удахг��й холбогдох болно.</p>
          <Button asChild className="mt-8" size="lg">
            <Link to="/">Нүүр хуудас руу буцах</Link>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}