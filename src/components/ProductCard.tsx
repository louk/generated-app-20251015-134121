import { Star, Edit, Trash2, Loader2 } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Product } from '@shared/types';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
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
interface ProductCardProps {
  product: Product;
  onEdit?: () => void;
  onDelete?: () => void;
  isDeleting?: boolean;
}
export default function ProductCard({ product, onEdit, onDelete, isDeleting }: ProductCardProps) {
  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  const hasControls = onEdit && onDelete;

  return (
    <div className={cn(!hasControls && "group", "relative h-full")}>
      <Card className={cn("overflow-hidden transition-all duration-200 flex flex-col h-full", !hasControls && "group-hover:shadow-xl group-hover:-translate-y-1")}>
        <CardHeader className="p-0 relative">
          <div className="block aspect-[4/3] overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <Badge variant="destructive" className="absolute top-3 right-3">
            -{discount}%
          </Badge>
        </CardHeader>
        <CardContent className="p-4 flex-grow">
          <p className="text-sm text-muted-foreground">{product.category}</p>
          <h3 className="font-semibold text-lg mt-1 leading-tight truncate">
            {!hasControls ? (
              <Link to={`/product/${product.id}`} className="outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm">
                <span className="absolute inset-0 z-10" aria-hidden="true" />
                {product.name}
              </Link>
            ) : (
              product.name
            )}
          </h3>
          <div className="flex items-center mt-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    'h-4 w-4',
                    i < Math.round(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'
                  )}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground ml-2">({product.reviews})</span>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between items-end mt-auto">
          <div>
            <p className="text-2xl font-bold text-foreground">{product.price.toLocaleString()}₮</p>
            <p className="text-sm text-muted-foreground line-through">{product.originalPrice.toLocaleString()}₮</p>
          </div>
          {hasControls && (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={onEdit}><Edit className="h-4 w-4" /></Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="icon" disabled={isDeleting}>
                    {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Та итгэлтэй байна уу?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Энэ үйлдлийг буцаах боломжгүй. Энэ нь таны саналыг бүрмөсөн устгах болно.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Цуцлах</AlertDialogCancel>
                    <AlertDialogAction onClick={onDelete} className="bg-destructive hover:bg-destructive/90">Устгах</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}