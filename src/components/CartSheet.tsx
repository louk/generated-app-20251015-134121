import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetTrigger,
  SheetClose,
  SheetDescription,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/use-cart-store';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trash2, Plus, Minus, ShoppingCart } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useShallow } from 'zustand/react/shallow';
import { Link } from 'react-router-dom';
const CartItem = ({ item }: { item: import('@shared/types').CartItem }) => {
const updateQuantity = useCartStore((state) => state.updateQuantity);
const removeItem = useCartStore((state) => state.removeItem);
  return (
    <div className="flex items-start gap-4 py-4">
      <img
        src={item.image}
        alt={item.name}
        className="w-20 h-20 object-cover rounded-md"
      />
      <div className="flex-1">
        <h3 className="font-semibold text-sm leading-tight">{item.name}</h3>
        <p className="text-muted-foreground text-sm mt-1">{item.price.toLocaleString()}₮</p>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center border rounded-md">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" onClick={() => removeItem(item.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
export function CartSheet({ children }: { children: React.ReactNode }) {
  const items = useCartStore((state) => state.items);
  const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0);
  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Таны са��с</SheetTitle>
          <SheetDescription>
            Таны сагсанд нэмэг��сэн бараанууд.
          </SheetDescription>
        </SheetHeader>
        {items.length > 0 ? (
          <>
            <ScrollArea className="flex-1 -mx-6">
              <div className="px-6">
                {items.map((item, index) => (
                  <div key={item.id}>
                    <CartItem item={item} />
                    {index < items.length - 1 && <Separator />}
                  </div>
                ))}
              </div>
            </ScrollArea>
            <SheetFooter className="mt-auto">
              <div className="w-full space-y-4">
                <Separator />
                <div className="flex justify-between items-center font-semibold">
                  <span>Нийт дүн:</span>
                  <span>{totalPrice.toLocaleString()}₮</span>
                </div>
                <SheetClose asChild>
                  <Button asChild className="w-full">
                    <Link to="/checkout">Тооцоо хийх</Link>
                  </Button>
                </SheetClose>
              </div>
            </SheetFooter>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <ShoppingCart className="w-16 h-16 text-muted-foreground" />
            <h3 className="mt-4 text-xl font-semibold">Таны сагс хоосон байна</h3>
            <p className="mt-2 text-muted-foreground">Худалда�� авалт хийж эхлээрэй!</p>
            <SheetClose asChild>
              <Button asChild className="mt-6">
                <Link to="/">Дэлгүүр хэсэх</Link>
              </Button>
            </SheetClose>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}