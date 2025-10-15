import React, { useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FiltersSidebar from '@/components/FiltersSidebar';
import ProductCard from '@/components/ProductCard';
import type { Product, SortOption } from '@shared/types';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ChevronDown, Frown, AlertCircle } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useFilterStore } from '@/store/use-filter-store';
import { useShallow } from 'zustand/react/shallow';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { ProductGridSkeleton } from '@/components/ProductGridSkeleton';
const HeroSection: React.FC = () => (
  <div className="bg-secondary">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-16 md:py-24 text-center">
        <h1 className="text-4xl md:text-6xl font-display font-bold text-primary tracking-tight">
          Өдөр тутмын <span className="text-accent">онцгой</span> хямдрал
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Таны хайж буй бүх зүйл нэг дор, хамгийн хямд үнээр.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Link to="/submit-deal">Бүтээгдэхүүн нэмэх</Link>
          </Button>
          <Button size="lg" variant="outline">Онцлох</Button>
        </div>
      </div>
    </div>
  </div>
);
const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'rating-desc', label: 'Хамгийн өндөр үнэлгээтэй' },
  { value: 'price-asc', label: 'Үнэ: Ба��аас их рүү' },
  { value: 'price-desc', label: 'Үнэ: Ихээс бага руу' },
  { value: 'newest', label: 'Хамгийн сүүлд нэмэгд��эн' },
];
export default function HomePage() {
  useEffect(() => {
    document.title = 'Нүүр хуудас | Deals.mn';
  }, []);
  const isMobile = useIsMobile();
  const {
    searchTerm,
    selectedCategories,
    selectedBrands,
    selectedColors,
    priceRange,
    sortOption,
    setSortOption,
  } = useFilterStore(
    useShallow((state) => ({
      searchTerm: state.searchTerm,
      selectedCategories: state.selectedCategories,
      selectedBrands: state.selectedBrands,
      selectedColors: state.selectedColors,
      priceRange: state.priceRange,
      sortOption: state.sortOption,
      setSortOption: state.setSortOption,
    }))
  );
  const { data: products, isLoading, error } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: () => api('/api/products'),
  });
  const filterOptions = useMemo(() => {
    if (!products) return { categories: [], brands: [], colors: [] };
    const categories = [...new Set(products.map(p => p.category))];
    const brands = [...new Set(products.map(p => p.brand))];
    const colors = [...new Set(products.flatMap(p => p.colors))];
    return { categories, brands, colors };
  }, [products]);
  const filteredAndSortedProducts = useMemo(() => {
    if (!products) return [];
    let filtered: Product[] = [...products];
    filtered = filtered.filter(p => {
      const searchMatch = searchTerm.trim() === '' ||
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase());
      const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(p.category);
      const brandMatch = selectedBrands.length === 0 || selectedBrands.includes(p.brand);
      const colorMatch = selectedColors.length === 0 || p.colors.some(c => selectedColors.includes(c));
      const priceMatch = p.price >= priceRange[0] && p.price <= priceRange[1];
      return searchMatch && categoryMatch && brandMatch && colorMatch && priceMatch;
    });
    switch (sortOption) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating-desc':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        // Mocking 'newest' by reversing the original array order (assuming API returns newest first)
        filtered.reverse();
        break;
    }
    return filtered;
  }, [products, searchTerm, selectedCategories, selectedBrands, selectedColors, priceRange, sortOption]);
  const currentSortLabel = sortOptions.find(opt => opt.value === sortOption)?.label;
  const renderProductContent = () => {
    if (isLoading) {
      return <ProductGridSkeleton />;
    }
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center text-center py-20 border-2 border-dashed rounded-lg border-destructive/50 bg-destructive/5">
          <AlertCircle className="w-16 h-16 text-destructive" />
          <h3 className="mt-4 text-xl font-semibold text-destructive">Алдаа гарлаа</h3>
          <p className="mt-2 text-muted-foreground">Бүтээгдэхүүн татахад алдаа гарлаа. Дахин оролдон�� уу.</p>
        </div>
      );
    }
    if (filteredAndSortedProducts.length > 0) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredAndSortedProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      );
    }
    return (
      <div className="flex flex-col items-center justify-center text-center py-20 border-2 border-dashed rounded-lg">
        <Frown className="w-16 h-16 text-muted-foreground" />
        <h3 className="mt-4 text-xl font-semibold">Тохирох бүтээгдэхүүн олдсонгүй</h3>
        <p className="mt-2 text-muted-foreground">��аны шүүлтүүрт тохирох бараа байхгүй байна. <br />Шүүлтүүрээ цэвэрлэж дахин оролдоно уу.</p>
      </div>
    );
  };
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        <HeroSection />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8 md:py-10 lg:py-12">
            <div className="flex flex-col lg:flex-row">
              <div className="lg:w-1/4 lg:pr-8">
                <FiltersSidebar
                  categories={filterOptions.categories}
                  brands={filterOptions.brands}
                  colors={filterOptions.colors}
                />
              </div>
              <div className="w-full lg:w-3/4 lg:pl-8 mt-8 lg:mt-0">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold font-display">
                    {isMobile ? "Бүтээгдэхүүн" : `Бүтээгдэхүүн (${filteredAndSortedProducts.length})`}
                  </h2>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="flex items-center gap-2">
                        {currentSortLabel}
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {sortOptions.map(option => (
                        <DropdownMenuItem key={option.value} onSelect={() => setSortOption(option.value)}>
                          {option.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                {renderProductContent()}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}