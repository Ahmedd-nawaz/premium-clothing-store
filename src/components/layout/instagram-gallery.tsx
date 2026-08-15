"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Camera, ExternalLink } from "lucide-react";
import { cn } from "@/utils";

interface InstagramPost {
  id: string;
  image: string;
  alt: string;
  url: string;
  likes?: number;
  comments?: number;
}

interface InstagramGalleryProps {
  title?: string;
  subtitle?: string;
  posts: InstagramPost[];
  columns?: 4 | 5 | 6;
  showFollowButton?: boolean;
  followUrl?: string;
  className?: string;
}

export function InstagramGallery({
  title = "Follow Us on Instagram",
  subtitle = "Tag @auraandco for a chance to be featured",
  posts,
  columns = 5,
  showFollowButton = true,
  followUrl = "https://instagram.com",
  className,
}: InstagramGalleryProps) {
  const columnClasses = {
    4: "grid-cols-2 sm:grid-cols-4",
    5: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5",
    6: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6",
  };

  return (
    <section className={cn("py-12 lg:py-16", className)} aria-labelledby="instagram-heading">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 lg:mb-12">
          <div>
            <h2 id="instagram-heading" className="font-display text-2xl lg:text-3xl font-semibold tracking-tight">
              {title}
            </h2>
            {subtitle && (
              <p className="text-muted-foreground text-sm mt-1">{subtitle}</p>
            )}
          </div>
          {showFollowButton && (
            <a
              href={followUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-border hover:bg-muted transition-colors text-sm font-medium self-end mb-1"
            >
              <Camera className="w-4 h-4" />
              <span>Follow Us</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>

        <div
          className={`${columnClasses[columns]} gap-2 lg:gap-3`}
          role="list"
          aria-label="Instagram feed"
        >
          {posts.map((post) => (
            <article key={post.id} className="group relative aspect-square overflow-hidden rounded-lg">
              <a
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block h-full w-full"
                aria-label={`View Instagram post${post.likes ? ` with ${post.likes} likes` : ""}`}
              >
                <Image
                  src={post.image}
                  alt={post.alt}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="flex gap-4 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
                    {post.likes !== undefined && (
                      <span className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-sm">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                        {post.likes.toLocaleString()}
                      </span>
                    )}
                    {post.comments !== undefined && (
                      <span className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-sm">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        {post.comments.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}