import { Package2, Twitter, Facebook, Instagram } from 'lucide-react';
export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="space-y-4 col-span-2 md:col-span-1">
            <a href="/" className="flex items-center gap-2">
              <Package2 className="h-6 w-6 text-accent" />
              <span className="font-bold text-lg font-display">Deals.mn</span>
            </a>
            <p className="text-sm text-muted-foreground">Монголын ө��өр ту��мын хямдралтай барааны зах зээл.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-foreground"><Twitter className="h-5 w-5" /></a>
              <a href="#" className="text-muted-foreground hover:text-foreground"><Facebook className="h-5 w-5" /></a>
              <a href="#" className="text-muted-foreground hover:text-foreground"><Instagram className="h-5 w-5" /></a>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Компани</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-foreground">Бидний тухай</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground">Ажлын байр</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground">Хэвлэл</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Тусламж</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-foreground">Холбоо барих</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground">Түгээмэл асуултууд</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground">Үйлчилгээний нө��цөл</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Хууль эрх зүй</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-foreground">Нууцлалын бодлого</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground">Күүки бодлого</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Deals.mn. Бүх эрх хуулиар хамгаалагдсан.</p>
          <p className="mt-1">Built with ❤️ at Cloudflare</p>
        </div>
      </div>
    </footer>
  );
}