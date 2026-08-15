"use client";

import React, { useState } from "react";
import { Mail, ArrowRight, Loader2, Check } from "lucide-react";
import { cn } from "@/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface NewsletterSectionProps {
  title?: string;
  subtitle?: string;
  description?: string;
  placeholder?: string;
  buttonText?: string;
  variant?: "default" | "dark" | "accent";
  className?: string;
}

export function NewsletterSection({
  title = "Join Our Community",
  subtitle = "Subscribe for exclusive access",
  description = "Be the first to know about new collections, sales, and styling inspiration.",
  placeholder = "Enter your email address",
  buttonText = "Subscribe",
  variant = "default",
  className,
}: NewsletterSectionProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || status === "loading") return;

    setStatus("loading");
    setMessage("");

    try {
      // In a real app, this would call an API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setStatus("success");
      setMessage("Thanks for subscribing! Check your inbox for a welcome offer.");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  };

  const variantStyles = {
    default: "bg-muted/30",
    dark: "bg-primary text-primary-foreground",
    accent: "bg-accent/10 border border-accent/20",
  };

  return (
    <section
      className={cn(
        "py-12 lg:py-16 rounded-2xl lg:rounded-3xl overflow-hidden",
        variantStyles[variant],
        className
      )}
      aria-labelledby="newsletter-heading"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 id="newsletter-heading" className="font-display text-2xl lg:text-3xl font-semibold tracking-tight mb-2">
            {title}
          </h2>
          {subtitle && (
            <p className={cn("text-base font-medium mb-1", variant === "dark" ? "text-accent" : "text-muted-foreground")}>
              {subtitle}
            </p>
          )}
          {description && (
            <p className={cn("text-sm mb-8", variant === "dark" ? "text-primary-foreground/70" : "text-muted-foreground")}>
              {description}
            </p>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto" noValidate>
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <Input
              id="newsletter-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={placeholder}
              className={cn(
                "flex-1 px-4 py-3 rounded-full",
                "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                variant === "dark" ? "bg-primary-foreground/10 border-border" : "bg-background border-border"
              )}
              required
              disabled={status === "loading" || status === "success"}
              aria-describedby={status !== "idle" ? "newsletter-message" : undefined}
            />
            <Button
              type="submit"
              className="rounded-full px-6 py-3 gap-2"
              disabled={status === "loading" || status === "success"}
              loading={status === "loading"}
              loadingText="Subscribing..."
            >
              {status === "success" ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Subscribed</span>
                </>
              ) : (
                <>
                  {status === "loading" ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                  <span>{buttonText}</span>
                </>
              )}
            </Button>
          </form>

          {status !== "idle" && (
            <p
              id="newsletter-message"
              className={cn(
                "mt-4 text-sm",
                status === "success" ? "text-success" : "text-danger"
              )}
              role="alert"
              aria-live="polite"
            >
              {message}
            </p>
          )}

          <p className={cn("mt-4 text-xs", variant === "dark" ? "text-primary-foreground/50" : "text-muted-foreground")}>
            By subscribing you agree to our <a href="/privacy" className="underline hover:text-primary">Privacy Policy</a> and consent to receive updates.
          </p>
        </div>
      </div>
    </section>
  );
}