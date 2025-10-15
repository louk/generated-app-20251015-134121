import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from '@/components/ui/sheet';
import { Filter } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useFilterStore } from '@/store/use-filter-store';
import { cn } from '@/lib/utils';
interface FiltersSidebarProps {
  categories: string[];
  brands: string[];
  colors: string[];
}
const FilterContent: React.FC<FiltersSidebarProps> = ({ categories, brands, colors }) => {
  const {
    selectedCategories,
    toggleCategory,
    selectedBrands,
    toggleBrand,
    selectedColors,
    toggleColor,
    priceRange,
    setPriceRange,
    clearFilters,
  } = useFilterStore();
  return (
    <div className="space-y-6">
      <Accordion type="multiple" defaultValue={['category', 'price', 'brand', 'color']} className="w-full">
        <AccordionItem value="category">
          <AccordionTrigger className="text-base font-semibold">Ангилал</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={`cat-${category}`}
                    checked={selectedCategories.includes(category)}
                    onCheckedChange={() => toggleCategory(category)}
                  />
                  <Label htmlFor={`cat-${category}`} className="font-normal cursor-pointer">{category}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="price">
          <AccordionTrigger className="text-base font-semibold">Үнэ</AccordionTrigger>
          <AccordionContent>
            <div className="px-1">
              <Slider
                value={priceRange}
                max={500000}
                step={10000}
                onValueChange={setPriceRange}
              />
              <div className="flex justify-between text-sm text-muted-foreground mt-2">
                <span>{priceRange[0].toLocaleString()}₮</span>
                <span>{priceRange[1].toLocaleString()}₮</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="brand">
          <AccordionTrigger className="text-base font-semibold">Брэнд</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {brands.map((brand) => (
                <div key={brand} className="flex items-center space-x-2">
                  <Checkbox
                    id={`brand-${brand}`}
                    checked={selectedBrands.includes(brand)}
                    onCheckedChange={() => toggleBrand(brand)}
                  />
                  <Label htmlFor={`brand-${brand}`} className="font-normal cursor-pointer">{brand}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="color">
          <AccordionTrigger className="text-base font-semibold">Өнгө</AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-wrap gap-2">
              {colors.map((color) => (
                <button
                  key={color}
                  className={cn(
                    'w-8 h-8 rounded-full border-2 transition-all',
                    selectedColors.includes(color) ? 'ring-2 ring-ring ring-offset-2' : 'border-transparent'
                  )}
                  style={{ backgroundColor: color }}
                  aria-label={color}
                  onClick={() => toggleColor(color)}
                />
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <Button variant="outline" className="w-full" onClick={clearFilters}>
        Бүх шүүлтүүр цэвэрлэх
      </Button>
    </div>
  );
};
export default function FiltersSidebar(props: FiltersSidebarProps) {
  const isMobile = useIsMobile();
  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span>Шүүлтүүр</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] sm:w-[400px] p-4 overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Бүтээгдэхүүн шүүх</SheetTitle>
            <SheetDescription className="sr-only">
              Бүтээгдэхүүнийг ангилал, үнэ, брэнд, өнгөөр шүүх.
            </SheetDescription>
          </SheetHeader>
          <div className="mt-4">
            <FilterContent {...props} />
          </div>
        </SheetContent>
      </Sheet>
    );
  }
  return (
    <aside>
      <h2 className="text-2xl font-bold font-display mb-4">Шүүлтүүр</h2>
      <FilterContent {...props} />
    </aside>
  );
}