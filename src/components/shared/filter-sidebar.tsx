"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, X, SlidersHorizontal } from "lucide-react";
import { cn } from "@/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

interface FilterGroup {
  key: string;
  label: string;
  options: FilterOption[];
  type: "checkbox" | "radio" | "range";
  multiple?: boolean;
}

interface PriceRange {
  min: number;
  max: number;
}

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterGroup[];
  priceRange?: PriceRange;
  onPriceRangeChange?: (range: PriceRange) => void;
  onFilterChange: (key: string, values: string[]) => void;
  activeFilters: Record<string, string[]>;
  onClearAll: () => void;
  hasActiveFilters: boolean;
}

export function FilterSidebar({
  isOpen,
  onClose,
  filters,
  priceRange,
  onPriceRangeChange,
  onFilterChange,
  activeFilters,
  onClearAll,
  hasActiveFilters,
}: FilterSidebarProps) {
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    filters.reduce((acc, filter) => ({ ...acc, [filter.key]: true }), {})
  );

  const toggleGroup = (key: string) => {
    setExpandedGroups((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleOptionChange = (filterKey: string, value: string, checked: boolean) => {
    const currentValues = activeFilters[filterKey] || [];
    const newValues = checked
      ? [...currentValues, value]
      : currentValues.filter((v) => v !== value);
    onFilterChange(filterKey, newValues);
  };

  const isOptionActive = (filterKey: string, value: string) => {
    return activeFilters[filterKey]?.includes(value) || false;
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm animate-fade-in lg:hidden"
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-full max-w-sm bg-background border-r border-border shadow-xl flex flex-col animate-slide-in",
          "lg:max-w-xs"
        )}
        role="dialog"
        aria-label="Product filters"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 lg:p-6 border-b border-border">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-primary" />
            <h2 className="font-display text-xl font-semibold">Filters</h2>
            {hasActiveFilters && (
              <span className="px-2 py-0.5 rounded-full bg-accent/20 text-accent text-xs font-medium">
                {Object.values(activeFilters).flat().length}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-muted transition-colors lg:hidden"
            aria-label="Close filters"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Clear All */}
        {hasActiveFilters && (
          <div className="p-4 border-b border-border">
            <Button variant="ghost" onClick={onClearAll} fullWidth className="text-sm">
              Clear All Filters
            </Button>
          </div>
        )}

        {/* Filters */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6">
          {/* Price Range */}
          {priceRange && onPriceRangeChange && (
            <div className="space-y-4">
              <h3 className="font-medium uppercase tracking-wider text-sm">Price</h3>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={priceRange.min}
                    onChange={(e) =>
                      onPriceRangeChange({ ...priceRange, min: parseInt(e.target.value) || 0 })
                    }
                    className="py-2"
                  />
                  <Input
                    type="number"
                    placeholder="Max"
                    value={priceRange.max}
                    onChange={(e) =>
                      onPriceRangeChange({ ...priceRange, max: parseInt(e.target.value) || 1000 })
                    }
                    className="py-2"
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Rs {priceRange.min}</span>
                  <span>Rs {priceRange.max}</span>
                </div>
              </div>
            </div>
          )}

          {/* Filter Groups */}
          {filters.map((filter) => (
            <div key={filter.key} className="border-b border-border pb-6 last:border-0 last:pb-0">
              <button
                onClick={() => toggleGroup(filter.key)}
                className="w-full flex items-center justify-between py-2"
                aria-expanded={expandedGroups[filter.key]}
              >
                <h3 className="font-medium uppercase tracking-wider text-sm">
                  {filter.label}
                  {activeFilters[filter.key]?.length && (
                    <span className="ml-2 px-1.5 py-0.5 rounded text-xs bg-muted text-muted-foreground">
                      {activeFilters[filter.key]!.length}
                    </span>
                  )}
                </h3>
                {expandedGroups[filter.key] ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                )}
              </button>

              {expandedGroups[filter.key] && (
                <div className="mt-4 space-y-3 animate-fade-in">
                  {filter.options.map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <input
                        type={filter.type === "radio" ? "radio" : "checkbox"}
                        checked={isOptionActive(filter.key, option.value)}
                        onChange={(e) =>
                          handleOptionChange(filter.key, option.value, e.target.checked)
                        }
                        className={cn(
                          "w-4 h-4 rounded border-border text-primary focus:ring-ring",
                          filter.type === "radio" && "rounded-full"
                        )}
                      />
                      <span className="text-sm text-foreground group-hover:text-primary transition-colors">
                        {option.label}
                      </span>
                      {option.count !== undefined && (
                        <span className="ml-auto text-xs text-muted-foreground">
                          ({option.count})
                        </span>
                      )}
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Apply Button */}
        <div className="p-4 lg:p-6 border-t border-border">
          <Button onClick={onClose} fullWidth size="lg" className="lg:hidden">
            Done
          </Button>
        </div>
      </aside>
    </>
  );
}