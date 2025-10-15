import { create } from 'zustand';
import type { SortOption } from '@shared/types';
interface FilterState {
  searchTerm: string;
  selectedCategories: string[];
  selectedBrands: string[];
  selectedColors: string[];
  priceRange: [number, number];
  sortOption: SortOption;
  setSearchTerm: (term: string) => void;
  toggleCategory: (category: string) => void;
  toggleBrand: (brand: string) => void;
  toggleColor: (color: string) => void;
  setPriceRange: (range: [number, number]) => void;
  setSortOption: (option: SortOption) => void;
  clearFilters: () => void;
}
const initialState = {
  searchTerm: '',
  selectedCategories: [],
  selectedBrands: [],
  selectedColors: [],
  priceRange: [0, 500000] as [number, number],
  sortOption: 'rating-desc' as SortOption,
};
export const useFilterStore = create<FilterState>((set, get) => ({
  ...initialState,
  setSearchTerm: (term) => set({ searchTerm: term }),
  toggleCategory: (category) =>
    set((state) => ({
      selectedCategories: state.selectedCategories.includes(category)
        ? state.selectedCategories.filter((c) => c !== category)
        : [...state.selectedCategories, category],
    })),
  toggleBrand: (brand) =>
    set((state) => ({
      selectedBrands: state.selectedBrands.includes(brand)
        ? state.selectedBrands.filter((b) => b !== brand)
        : [...state.selectedBrands, brand],
    })),
  toggleColor: (color) =>
    set((state) => ({
      selectedColors: state.selectedColors.includes(color)
        ? state.selectedColors.filter((c) => c !== color)
        : [...state.selectedColors, color],
    })),
  setPriceRange: (range) => set({ priceRange: range }),
  setSortOption: (option) => set({ sortOption: option }),
  clearFilters: () => set({ ...initialState, sortOption: get().sortOption }),
}));