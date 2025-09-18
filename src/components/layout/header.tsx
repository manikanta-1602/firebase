'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { SnapRecipeLogo } from '@/components/icons';
import { BookHeart, Sparkles } from 'lucide-react';

const navLinks = [
  { href: '/', label: 'Create Recipe', icon: Sparkles },
  { href: '/favorites', label: 'My Favorites', icon: BookHeart },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-gradient-to-r from-white via-gray-50 to-white shadow-sm backdrop-blur supports-[backdrop-filter]:bg-opacity-90">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <SnapRecipeLogo />
            <span className="hidden font-bold sm:inline-block font-headline text-lg bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              SnapRecipe
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'transition-colors hover:text-blue-600',
                  pathname === link.href
                    ? 'text-blue-600 font-semibold'
                    : 'text-gray-600 hover:text-blue-500'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          {/* Mobile Nav - centered */}
          <div className="flex-1 flex justify-center md:hidden">
            <nav className="flex items-center space-x-6 text-sm font-medium">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'transition-colors hover:text-foreground/80 p-2 rounded-md',
                    pathname === link.href
                      ? 'text-primary bg-primary/10'
                      : 'text-foreground/60'
                  )}
                  aria-label={link.label}
                >
                  <link.icon className="h-5 w-5" />
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
