"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search, X, TrendingUp, Clock, Loader2 } from "lucide-react";
import { cn } from "@/utils";
import { Button } from "@/components/ui/button";

interface SearchSuggestion {
  query: string;
  type: "product" | "category" | "brand" | "tag";
  count?: number;
}

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  className?: string;
  showSuggestions?: boolean;
  recentSearches?: string[];
  popularSearches?: string[];
}

export function SearchBar({
  placeholder = "Search products...",
  onSearch,
  className,
  showSuggestions = true,
  recentSearches = [],
  popularSearches = [],
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFocus = () => {
    if (showSuggestions && (recentSearches.length > 0 || popularSearches.length > 0)) {
      setIsOpen(true);
    }
  };

  const handleInputChange = (value: string) => {
    setQuery(value);
    if (showSuggestions && value.length >= 2) {
      // Debounced search suggestions would go here
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        setSuggestions([
          { query: value, type: "product" },
          { query: `${value} sale`, type: "product" },
          { query: `${value} new`, type: "product" },
        ]);
        setIsLoading(false);
      }, 150);
    } else if (value.length === 0) {
      setSuggestions([]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setIsOpen(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    onSearch(suggestion);
    setIsOpen(false);
  };

  const handleClear = () => {
    setQuery("");
    setSuggestions([]);
    inputRef.current?.focus();
  };

  return (
    <div ref={wrapperRef} className={cn("relative w-full", className)}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search
            className={cn(
              "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors",
              query || isOpen ? "text-primary" : "text-muted-foreground"
            )}
            aria-hidden="true"
          />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={handleFocus}
            placeholder={placeholder}
            className={cn(
              "w-full pl-12 pr-12 py-2.5 lg:py-3 rounded-full border transition-all duration-200",
              "bg-background text-foreground placeholder:text-muted-foreground",
              "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
              "hover:border-accent/50",
              isOpen ? "border-accent rounded-b-none" : "border-border"
            )}
            autoComplete="off"
            aria-label="Search"
            aria-expanded={isOpen}
            aria-controls="search-suggestions"
            role="combobox"
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-muted transition-colors"
              aria-label="Clear search"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
          {isLoading && (
            <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary animate-spin" />
          )}
        </div>

        {/* Suggestions Dropdown */}
        {isOpen && (suggestions.length > 0 || recentSearches.length > 0 || popularSearches.length > 0) && (
          <div
            id="search-suggestions"
            className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-xl shadow-xl overflow-hidden animate-slide-up z-50"
            role="listbox"
          >
            {suggestions.length > 0 && (
              <div className="p-3 border-b border-border">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                  Suggestions
                </p>
                <div className="space-y-1">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleSuggestionClick(suggestion.query)}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors text-left"
                      role="option"
                    >
                      <Search className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-foreground">{suggestion.query}</span>
                      <span className="ml-auto text-xs text-muted-foreground capitalize">{suggestion.type}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {recentSearches.length > 0 && (
              <div className="p-3 border-b border-border">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Recent Searches
                  </p>
                  <button
                    type="button"
                    className="text-xs text-primary hover:underline"
                    onClick={() => {
                      // Clear recent searches
                    }}
                  >
                    Clear all
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.slice(0, 5).map((search, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleSuggestionClick(search)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted text-sm text-foreground hover:bg-muted/80 transition-colors"
                      role="option"
                    >
                      <Clock className="w-3 h-3 text-muted-foreground" />
                      <span>{search}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {popularSearches.length > 0 && (
              <div className="p-3">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                  Popular Searches
                </p>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.slice(0, 6).map((search, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleSuggestionClick(search)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border text-sm text-foreground hover:bg-muted hover:border-accent transition-colors"
                      role="option"
                    >
                      <TrendingUp className="w-3 h-3 text-accent" />
                      <span>{search}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </form>
    </div>
  );
}