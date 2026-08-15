"use client";

import { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";
import { FilterSidebar } from "@/components/shared/filter-sidebar";
import { Button } from "@/components/ui/button";
import type { ShopFacets } from "@/services/product-service";

interface ShopFiltersProps {
  facets: ShopFacets;
}

export function ShopFilters({ facets }: ShopFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  const activeFilters: { size: string[]; color: string[] } = {
    size: searchParams.get("size")?.split(",").filter(Boolean) ?? [],
    color: searchParams.get("color")?.split(",").filter(Boolean) ?? [],
  };

  const priceRange = {
    min: Number(searchParams.get("minPrice") ?? facets.priceRange.min),
    max: Number(searchParams.get("maxPrice") ?? facets.priceRange.max),
  };

  const hasActiveFilters =
    activeFilters.size.length > 0 ||
    activeFilters.color.length > 0 ||
    searchParams.has("minPrice") ||
    searchParams.has("maxPrice");

  function updateParams(mutate: (params: URLSearchParams) => void) {
    const params = new URLSearchParams(searchParams.toString());
    mutate(params);
    params.delete("page"); // any filter change resets pagination
    router.push(`${pathname}?${params.toString()}`);
  }

  const handleFilterChange = (key: string, values: string[]) => {
    updateParams((params) => {
      if (values.length > 0) params.set(key, values.join(","));
      else params.delete(key);
    });
  };

  const handlePriceRangeChange = (range: { min: number; max: number }) => {
    updateParams((params) => {
      params.set("minPrice", String(range.min));
      params.set("maxPrice", String(range.max));
    });
  };

  const handleClearAll = () => {
    updateParams((params) => {
      params.delete("size");
      params.delete("color");
      params.delete("minPrice");
      params.delete("maxPrice");
    });
  };

  return (
    <>
      <Button variant="outline" onClick={() => setIsOpen(true)} className="lg:hidden">
        <SlidersHorizontal className="w-4 h-4 mr-2" />
        Filters
        {hasActiveFilters && (
          <span className="ml-2 px-1.5 py-0.5 rounded-full bg-accent/20 text-accent text-xs font-medium">
            {activeFilters.size.length + activeFilters.color.length}
          </span>
        )}
      </Button>

      {/* Desktop: always visible, no drawer chrome needed since isOpen gates rendering
          in FilterSidebar — so on large screens we just force it open via CSS. */}
      <div className="hidden lg:block">
        <FilterSidebarDesktopWrapper
          facets={facets}
          activeFilters={activeFilters}
          priceRange={priceRange}
          hasActiveFilters={hasActiveFilters}
          onFilterChange={handleFilterChange}
          onPriceRangeChange={handlePriceRangeChange}
          onClearAll={handleClearAll}
        />
      </div>

      <div className="lg:hidden">
        <FilterSidebar
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          filters={[
            { key: "size", label: "Size", type: "checkbox", options: facets.sizes },
            { key: "color", label: "Color", type: "checkbox", options: facets.colors },
          ]}
          priceRange={priceRange}
          onPriceRangeChange={handlePriceRangeChange}
          onFilterChange={handleFilterChange}
          activeFilters={activeFilters}
          onClearAll={handleClearAll}
          hasActiveFilters={hasActiveFilters}
        />
      </div>
    </>
  );
}

// FilterSidebar is built as a full-screen/drawer overlay (fixed positioning,
// isOpen-gated). Reusing it inline for desktop needs a plain static wrapper
// instead, so this renders the same filter groups without the drawer chrome.
function FilterSidebarDesktopWrapper({
  facets,
  activeFilters,
  priceRange,
  hasActiveFilters,
  onFilterChange,
  onPriceRangeChange,
  onClearAll,
}: {
  facets: ShopFacets;
  activeFilters: Record<string, string[]>;
  priceRange: { min: number; max: number };
  hasActiveFilters: boolean;
  onFilterChange: (key: string, values: string[]) => void;
  onPriceRangeChange: (range: { min: number; max: number }) => void;
  onClearAll: () => void;
}) {
  return (
    <div className="w-64 shrink-0 space-y-6 pr-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold">Filters</h2>
        {hasActiveFilters && (
          <button onClick={onClearAll} className="text-xs text-muted-foreground hover:text-primary underline">
            Clear all
          </button>
        )}
      </div>

      <div className="space-y-4">
        <h3 className="font-medium uppercase tracking-wider text-sm">Price</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <input
            type="number"
            value={priceRange.min}
            onChange={(e) => onPriceRangeChange({ ...priceRange, min: Number(e.target.value) || 0 })}
            className="rounded-md border border-border px-2 py-1.5 w-full"
            aria-label="Minimum price"
          />
          <input
            type="number"
            value={priceRange.max}
            onChange={(e) => onPriceRangeChange({ ...priceRange, max: Number(e.target.value) || facets.priceRange.max })}
            className="rounded-md border border-border px-2 py-1.5 w-full"
            aria-label="Maximum price"
          />
        </div>
      </div>

      {([
        { key: "size", label: "Size", options: facets.sizes },
        { key: "color", label: "Color", options: facets.colors },
      ] as const).map((group) => (
        <div key={group.key} className="space-y-3 border-t border-border pt-4">
          <h3 className="font-medium uppercase tracking-wider text-sm">{group.label}</h3>
          {group.options.map((option) => (
            <label key={option.value} className="flex items-center gap-3 cursor-pointer text-sm">
              <input
                type="checkbox"
                checked={activeFilters[group.key]?.includes(option.value) ?? false}
                onChange={(e) => {
                  const current = activeFilters[group.key] ?? [];
                  const next = e.target.checked
                    ? [...current, option.value]
                    : current.filter((v) => v !== option.value);
                  onFilterChange(group.key, next);
                }}
                className="w-4 h-4 rounded border-border text-primary focus:ring-ring"
              />
              {option.label}
              <span className="ml-auto text-xs text-muted-foreground">({option.count})</span>
            </label>
          ))}
        </div>
      ))}
    </div>
  );
}
