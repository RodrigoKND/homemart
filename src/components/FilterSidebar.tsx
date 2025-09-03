import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Separator } from '@/components/ui/separator';
import { Filters } from '@/hooks/useFilters';
import { categories, priceRanges } from '@/data/products';

interface FilterSidebarProps {
  filters: Filters;
  onFiltersChange: (filters: Partial<Filters>) => void;
  onClearFilters: () => void;
  className?: string;
}

export const FilterSidebar = ({
  filters,
  onFiltersChange,
  onClearFilters,
  className = ""
}: FilterSidebarProps) => {
  const [openSections, setOpenSections] = useState({
    search: true,
    brand: true,
    category: true,
    price: true
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleCategoryChange = (category: string, checked: boolean) => {
    const newCategories = checked
      ? [...filters.category, category]
      : filters.category.filter(c => c !== category);

    onFiltersChange({ category: newCategories });
  };

  const handlePriceRangeChange = (range: { min: number; max: number }) => {
    onFiltersChange({ priceRange: range });
  };

  const activeFiltersCount =
    filters.brand.length +
    filters.category.length +
    (filters.priceRange ? 1 : 0) +
    (filters.search ? 1 : 0);

  return (
    <div className={`bg-white rounded-lg border border-gray-200 md:p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-black">Filtros</h2>
        {activeFiltersCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClearFilters}
            className="text-gray-500 hover:text-black"
          >
            Limpiar ({activeFiltersCount})
          </Button>
        )}
      </div>

      <div className="space-y-6">
        {/* Search Filter */}
        <Collapsible open={openSections.search} onOpenChange={() => toggleSection('search')}>
          <CollapsibleTrigger className="flex items-center justify-between w-full">
            <span className="font-medium text-black">Búsqueda</span>
            {openSections.search ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3">
            <Input
              placeholder="Buscar productos..."
              value={filters.search}
              onChange={(e) => onFiltersChange({ search: e.target.value })}
              className="w-full"
            />
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        {/* Brand Filter */}
        <Collapsible open={openSections.brand} onOpenChange={() => toggleSection('brand')}>
          <CollapsibleTrigger className="flex items-center justify-between w-full">
            <span className="font-medium text-black">Marcas</span>
            {openSections.brand ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`brand-natura`}
                  checked={true}
                />
                <Label
                  htmlFor={`brand-natura`}
                  className="text-sm font-normal cursor-pointer"
                >
                  Natura
                </Label>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        {/* Category Filter */}
        <Collapsible open={openSections.category} onOpenChange={() => toggleSection('category')}>
          <CollapsibleTrigger className="flex items-center justify-between w-full">
            <span className="font-medium text-black">Categorías</span>
            {openSections.category ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3">
            <div className="space-y-3">
              {categories.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category}`}
                    checked={filters.category.includes(category)}
                    onCheckedChange={(checked) =>
                      handleCategoryChange(category, checked as boolean)
                    }
                  />
                  <Label
                    htmlFor={`category-${category}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {category}
                  </Label>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        {/* Price Range Filter */}
        <Collapsible open={openSections.price} onOpenChange={() => toggleSection('price')}>
          <CollapsibleTrigger className="flex items-center justify-between w-full">
            <span className="font-medium text-black">Precio</span>
            {openSections.price ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3">
            <div className="space-y-3">
              {priceRanges.map((range, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Checkbox
                    id={`price-${index}`}
                    checked={
                      filters.priceRange?.min === range.min &&
                      filters.priceRange?.max === range.max
                    }
                    onCheckedChange={(checked) => {
                      if (checked) {
                        handlePriceRangeChange(range);
                      } else {
                        onFiltersChange({ priceRange: null });
                      }
                    }}
                  />
                  <Label
                    htmlFor={`price-${index}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {range.label}
                  </Label>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};