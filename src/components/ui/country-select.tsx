"use client";

import * as React from "react";
import { useState, useEffect, useMemo } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import api from "@/app/lib/axios";
import { useTranslation } from "react-i18next";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export interface Country {
  id: string;
  name: string;
  code: string;
}

export interface CountrySelectProps {
  label?: string;
  placeholder?: string;
  onSelect?: (country: Country | null) => void;
  defaultValue?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  error?: string;
}

export function CountrySelector({
  label,
  placeholder = "Select a country",
  onSelect,
  defaultValue,
  required = false,
  disabled = false,
  className,
  error,
}: CountrySelectProps) {
  const { t } = useTranslation();
  const [countries, setCountries] = useState<Country[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [open, setOpen] = useState(false);

  // Fetch countries on component mount
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setIsLoading(true);
        setErrorMessage(null);
        const { data } = await api.get('/countries');
        setCountries(data);
        
        // Set default selected country if defaultValue is provided
        if (defaultValue) {
          const country = data.find((c: Country) => c.id === defaultValue);
          if (country) {
            setSelectedCountry(country);
            onSelect?.(country);
          }
        }
      } catch (err) {
        console.error("Failed to fetch countries:", err);
        setErrorMessage(t("common.error.failedToLoadCountries", "Failed to load countries"));
      } finally {
        setIsLoading(false);
      }
    };

    if (countries.length === 0) {
        fetchCountries();
      }
  }, [countries.length, defaultValue, onSelect, t]);

  // Filter countries based on search term
  const filteredCountries = useMemo(() => {
    if (!searchTerm.trim()) return countries;
    
    return countries.filter((country) =>
      country.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [countries, searchTerm]);

  // Handle country selection
  const handleCountrySelect = (countryId: string) => {
    const country = countries.find((c) => c.id === countryId) || null;
    setSelectedCountry(country);
    onSelect?.(country);
    setOpen(false);
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      )}
      
      <Select
        open={open}
        onOpenChange={setOpen}
        value={selectedCountry?.id}
        onValueChange={handleCountrySelect}
        disabled={disabled || isLoading}
      >
        <SelectTrigger 
          className={cn(
            "w-full", 
            error && "border-destructive focus:ring-destructive"
          )}
        >
          <SelectValue placeholder={placeholder}>
            {selectedCountry && (
              <div className="flex items-center gap-2">
                {selectedCountry.code && (
                  <span className="font-mono text-xs bg-muted px-1 py-0.5 rounded">
                    {selectedCountry.code}
                  </span>
                )}
                {selectedCountry.name}
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
        
        <SelectContent className="max-h-[300px]">
          {isLoading ? (
            <div className="flex justify-center items-center py-4">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              <span className="ml-2 text-sm text-muted-foreground">
                {t("common.loading", "Loading...")}
              </span>
            </div>
          ) : errorMessage ? (
            <div className="flex justify-center items-center py-4 text-destructive text-sm">
              {errorMessage}
              <Button 
                variant="ghost" 
                size="sm" 
                className="ml-2 h-8" 
                onClick={(e) => {
                  e.stopPropagation();
                  setOpen(false);
                  // Re-fetch countries
                  setIsLoading(true);
                  setErrorMessage(null);
                  api.get('/countries')
                    .then(({ data }) => {
                      setCountries(data);
                      setIsLoading(false);
                    })
                    .catch((err) => {
                      console.error("Failed to fetch countries:", err);
                      setErrorMessage(t("common.error.failedToLoadCountries", "Failed to load countries"));
                      setIsLoading(false);
                    });
                }}
              >
                {t("common.retry", "Retry")}
              </Button>
            </div>
          ) : (
            <>
              <div className="p-2 border-b border-border/30 sticky top-0 bg-popover z-10">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground/70" />
                  <Input
                    placeholder={t("common.search", "Search...")}
                    className="pl-8 h-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <SelectGroup>
                {filteredCountries.length === 0 ? (
                  <div className="text-center py-2 text-sm text-muted-foreground">
                    {t("common.noResults", "No results found")}
                  </div>
                ) : (
                  filteredCountries.map((country) => (
                    <SelectItem
                      key={country.id}
                      value={country.id}
                      className="flex items-center cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        {country.code && (
                          <span className="font-mono text-xs bg-muted px-1 py-0.5 rounded">
                            {country.code}
                          </span>
                        )}
                        {country.name}
                      </div>
                    </SelectItem>
                  ))
                )}
              </SelectGroup>
            </>
          )}
        </SelectContent>
      </Select>

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}

// For backward compatibility
const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
    size?: "default" | "sm" | "lg" | "icon";
  }
>(({ className, variant = "default", size = "default", ...props }, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50";
  const variantStyles = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    outline: "border border-input hover:bg-accent hover:text-accent-foreground",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    link: "underline-offset-4 hover:underline text-primary"
  };
  const sizeStyles = {
    default: "h-10 px-4 py-2",
    sm: "h-9 px-3 rounded-md",
    lg: "h-11 px-8 rounded-md",
    icon: "h-10 w-10"
  };

  return (
    <button
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Button.displayName = "Button";

export { CountrySelector as CountrySelect };