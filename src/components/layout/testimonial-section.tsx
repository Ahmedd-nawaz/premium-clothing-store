"use client";

import React from "react";
import { Star, Quote } from "lucide-react";
import { cn } from "@/utils";
import { Button } from "@/components/ui/button";

interface Testimonial {
  id: string;
  content: string;
  author: string;
  role?: string;
  avatar?: string;
  rating: number;
  verified?: boolean;
}

interface TestimonialSectionProps {
  title: string;
  subtitle?: string;
  testimonials: Testimonial[];
  className?: string;
  autoplay?: boolean;
  interval?: number;
}

export function TestimonialSection({
  title,
  subtitle,
  testimonials,
  className,
  autoplay = true,
  interval = 5000,
}: TestimonialSectionProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [direction, setDirection] = React.useState(1);

  React.useEffect(() => {
    if (!autoplay) return;
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, interval);
    return () => clearInterval(timer);
  }, [autoplay, interval, testimonials.length]);

  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  const testimonial = testimonials[currentIndex];

  return (
    <section className={cn("py-12 lg:py-16 bg-muted/30", className)} aria-labelledby="testimonials-heading">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12 lg:mb-16">
          <h2 id="testimonials-heading" className="font-display text-2xl lg:text-3xl font-semibold tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-muted-foreground text-base mt-2">{subtitle}</p>
          )}
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              role="region"
              aria-label="Customer testimonials"
            >
              {testimonials.map((t, i) => (
                <div
                  key={t.id}
                  className="w-full flex-shrink-0 px-4"
                  style={{
                    opacity: i === currentIndex ? 1 : 0,
                    pointerEvents: i === currentIndex ? "auto" : "none",
                    position: i === currentIndex ? "relative" : "absolute",
                    width: "100%",
                  }}
                >
                  <article className="bg-card border border-border rounded-2xl p-8 lg:p-12 text-center relative">
                    <Quote className="w-10 h-10 text-accent/30 mx-auto mb-6" aria-hidden="true" />
                    <blockquote className="text-lg lg:text-xl text-foreground leading-relaxed mb-8 font-medium">
                      "{t.content}"
                    </blockquote>
                    <div className="flex items-center justify-center gap-1 mb-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={cn("w-5 h-5", star <= t.rating ? "fill-current text-accent" : "text-muted-foreground")}
                          aria-hidden="true"
                        />
                      ))}
                    </div>
                    <div className="flex items-center justify-center gap-3">
                      {t.avatar && (
                        <img
                          src={t.avatar}
                          alt=""
                          className="w-10 h-10 rounded-full object-cover"
                          aria-hidden="true"
                        />
                      )}
                      <div className="text-left">
                        <p className="font-semibold text-sm">{t.author}</p>
                        {t.role && <p className="text-xs text-muted-foreground">{t.role}</p>}
                        {t.verified && (
                          <p className="text-xs text-success flex items-center gap-1">
                            <span className="w-3 h-3 rounded-full bg-success" aria-hidden="true" />
                            Verified Purchase
                          </p>
                        )}
                      </div>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center gap-2 mt-8" role="tablist" aria-label="Select testimonial">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => goToSlide(i)}
                className={cn(
                  "w-2.5 h-2.5 rounded-full transition-all duration-300",
                  i === currentIndex ? "bg-primary w-8" : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                )}
                role="tab"
                aria-selected={i === currentIndex}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>

          {/* Previous/Next Arrows */}
          <button
            onClick={() => goToSlide((currentIndex - 1 + testimonials.length) % testimonials.length)}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-12 p-2 rounded-full bg-background/80 backdrop-blur-sm border border-border hover:bg-background hover:shadow-md transition-all duration-200"
            aria-label="Previous testimonial"
            role="button"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => goToSlide((currentIndex + 1) % testimonials.length)}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-12 p-2 rounded-full bg-background/80 backdrop-blur-sm border border-border hover:bg-background hover:shadow-md transition-all duration-200"
            aria-label="Next testimonial"
            role="button"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}