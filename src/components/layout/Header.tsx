import { Package2, Search, ShoppingCart, User, LogOut, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { useFilterStore } from '@/store/use-filter-store';
import { CartSheet } from '@/components/CartSheet';
import { useCartStore } from '@/store/use-cart-store';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/store/use-auth-store';
import { Link, useNavigate } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
export default function Header() {
  const searchTerm = useFilterStore((state) => state.searchTerm);
  const setSearchTerm = useFilterStore((state) => state.setSearchTerm);
  const cartItems = useCartStore((state) => state.items);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2">
              <Package2 className="h-6 w-6 text-accent" />
              <span className="font-bold text-lg font-display">Deals.mn</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
              <Link to="/" className="text-foreground transition-colors hover:text-foreground/80">Нүүр</Link>
              <a href="#" className="text-muted-foreground transition-colors hover:text-foreground">Хямдралтай</a>
              {user &&
              <Link to="/submit-deal" className="text-muted-foreground transition-colors hover:text-foreground">Санал нэмэх</Link>
              }
            </nav>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <div className="relative hidden sm:block">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Хайх..."
                className="pl-8 sm:w-[200px] md:w-[300px] bg-secondary"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            {user ?
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="hidden md:inline-flex rounded-full">
                    <User className="h-5 w-5" />
                    <span className="sr-only">Профайл</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={() => navigate('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Миний профайл</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => navigate('/submit-deal')}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    <span>Санал нэмэх</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Гарах</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu> :
            <div className="hidden md:flex items-center gap-2">
                <Button variant="ghost" asChild><Link to="/login">Нэвтрэх</Link></Button>
                <Button asChild><Link to="/register">Бүртгүүлэх</Link></Button>
              </div>
            }
            <CartSheet>
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 &&
                <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 justify-center rounded-full p-0 text-xs">
                    {totalItems}
                  </Badge>
                }
                <span className="sr-only">С��гс</span>
              </Button>
            </CartSheet>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Цэс нээх</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <nav className="grid gap-6 text-lg font-medium">
                  <Link to="/" className="flex items-center gap-2 text-lg font-semibold">
                    <Package2 className="h-6 w-6 text-accent" />
                    <span>Deals.mn</span>
                  </Link>
                  <Link to="/" className="hover:text-foreground">Нүүр</Link>
                  <a href="#" className="text-muted-foreground hover:text-foreground">Хямдралтай</a>
                  {user && <Link to="/submit-deal" className="text-muted-foreground hover:text-foreground">Санал нэмэх</Link>}
                  <Separator />
                  {user ?
                  <Button variant="ghost" onClick={handleLogout} className="justify-start">Гарах</Button> :
                  <>
                      <Link to="/login" className="text-muted-foreground hover:text-foreground">Нэвтрэх</Link>
                      <Link to="/register" className="text-muted-foreground hover:text-foreground">Бүртгүүлэх</Link>
                    </>
                  }
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>);
}