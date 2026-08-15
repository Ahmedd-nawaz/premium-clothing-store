import Link from "next/link";
import { MessageCircle, Camera, Send, Play, Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { config } from "@/config";

const footerLinks: Record<string, { label: string; href: string }[]> = {
  Shop: [
    { label: "New Arrivals", href: "/shop?filter=new" },
    { label: "Best Sellers", href: "/shop?filter=bestseller" },
    { label: "Sale", href: "/shop?filter=sale" },
    { label: "Gift Cards", href: "/gift-cards" },
  ],
  Support: [
    { label: "Contact Us", href: "/contact" },
    { label: "FAQs", href: "/faq" },
    { label: "Shipping Info", href: "/shipping" },
    { label: "Returns & Exchanges", href: "/returns" },
    { label: "Track Order", href: "/track-order" },
  ],
  Company: [
    { label: "About Us", href: "/about" },
    { label: "Sustainability", href: "/sustainability" },
    { label: "Careers", href: "/careers" },
    { label: "Press", href: "/press" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
  ],
};

const socialLinks = [
  { label: "Instagram", icon: Camera, href: "https://instagram.com" },
  { label: "Facebook", icon: MessageCircle, href: "https://facebook.com" },
  { label: "Twitter", icon: Send, href: "https://twitter.com" },
  { label: "YouTube", icon: Play, href: "https://youtube.com" },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted/50 border-t border-border">
      <div className="container mx-auto px-4 py-16 lg:py-24">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1 space-y-4">
            <Link href="/" className="inline-block" aria-label="AURA & CO. Homepage">
              <span className="font-display text-2xl lg:text-3xl font-semibold tracking-tight text-primary">
                AURA & CO.
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Modern luxury apparel designed with precision, simplicity, and elegance. Experience timeless fashion built with superior craftsmanship.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full border border-border hover:bg-muted hover:border-accent hover:text-accent transition-all duration-200"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <nav key={title} aria-label={title} className="space-y-3">
              <h3 className="font-medium text-sm uppercase tracking-wider text-primary">
                {title}
              </h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Newsletter */}
        <div className="mt-12 lg:mt-16 pt-12 lg:pt-16 border-t border-border">
          <div className="max-w-md mx-auto md:mx-0">
            <h3 className="font-display text-xl lg:text-2xl font-semibold text-center md:text-left mb-2">
              Join Our Community
            </h3>
            <p className="text-sm text-muted-foreground text-center md:text-left mb-6">
              Subscribe for exclusive access to new collections, sales, and styling inspiration.
            </p>
            <form className="flex flex-col sm:flex-row gap-2 max-w-sm mx-auto md:mx-0" action="/api/newsletter" method="POST">
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                type="email"
                id="newsletter-email"
                name="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-full border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-sm"
                required
              />
              <Button type="submit" className="rounded-full px-6 py-3 gap-2">
                <ArrowRight className="w-4 h-4" />
                <span className="hidden sm:inline">Subscribe</span>
              </Button>
            </form>
            <p className="text-xs text-muted-foreground text-center md:text-left mt-4">
              By subscribing you agree to our Privacy Policy and consent to receive updates.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 lg:mt-16 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              &copy; {currentYear} {config.app.name}. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-primary transition-colors">Terms</Link>
              <Link href="/cookies" className="hover:text-primary transition-colors">Cookies</Link>
            </div>
            <p className="text-sm text-muted-foreground text-center md:text-right">
              Made with care for modern living
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}