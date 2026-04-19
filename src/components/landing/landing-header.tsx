'use client';

import Link from 'next/link';
import { Menu } from 'lucide-react';
import { Logo } from '@/components/shared/logo';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { LanguageSwitcher } from '@/components/shared/language-switcher';
import { useLanguage } from '@/contexts/language-context';
import { motion } from 'framer-motion';

export function LandingHeader() {
  const { t } = useLanguage();
  
  const navLinks = [
    { href: '#services', label: t('footer.services') || 'Services' },
    { href: '#about', label: t('footer.about') || 'About' },
    { href: '#faq', label: t('footer.faq') || 'Docs' },
    { href: '#contact', label: t('nav.contact') || 'Contact' },
  ];

  return (
    <motion.header 
      className="sticky top-0 z-50 w-full border-b border-white/10 bg-brand-dark/95 backdrop-blur-md border-brand-orange/10/95 backdrop-blur-md border-brand-orange/10/95 backdrop-blur supports-[backdrop-filter]:bg-brand-dark/60 text-white"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="container flex h-16 items-center justify-between">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
        >
          <Link href="/" className="flex items-center gap-2">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="text-brand-orange"
            >
              <img src="/logo.png" alt="FundN3xus Logo" className="h-8 w-8 rounded-full shadow-md" />
            </motion.div>
            <span className="text-xl font-bold font-headline tracking-tight text-white">FundN3xus</span>
          </Link>
        </motion.div>

        {/* Desktop Navigation */}
        <motion.nav 
          className="hidden md:flex items-center justify-center gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {navLinks.map((link, index) => (
            <motion.div
              key={link.href}
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
            >
              <Link 
                href={link.href} 
                className="text-sm font-medium text-white/70 transition-colors hover:text-brand-orange"
              >
                {link.label}
              </Link>
            </motion.div>
          ))}
        </motion.nav>

        {/* Right Actions */}
        <motion.div 
          className="flex items-center gap-4"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
        >
          <div className="hidden md:flex items-center gap-2">
            <LanguageSwitcher />
            {/* <ThemeToggle /> */}
            <Button 
              asChild 
              className="ml-2 bg-brand-orange hover:bg-brand-orange/90 text-white border-0 rounded-md font-semibold px-6"
            >
              <Link href="/login" target="_blank" rel="noopener noreferrer">
                {t('nav.getStarted') || 'Get Started'}
              </Link>
            </Button>
          </div>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden text-white hover:bg-white/10">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-brand-dark/95 backdrop-blur-md border-brand-orange/10/95 backdrop-blur-md border-brand-orange/10 border-white/10 text-white">
              <div className="flex flex-col gap-6 pt-10">
                <Link href="/" className="flex items-center gap-2 text-brand-orange">
                  <Logo />
                  <span className="text-xl font-bold font-headline text-white">FundN3xus</span>
                </Link>
                <nav className="grid gap-4">
                  {navLinks.map(link => (
                    <Link 
                      key={link.href} 
                      href={link.href} 
                      className="text-white/70 transition-colors hover:text-brand-orange"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
                <div className="flex items-center gap-4 py-4">
                  <LanguageSwitcher />
                </div>
                <Button 
                  asChild
                  className="bg-brand-orange hover:bg-brand-orange/90 text-white w-full"
                >
                  <Link href="/login" target="_blank" rel="noopener noreferrer">
                    {t('nav.getStarted') || 'Get Started'}
                  </Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </motion.div>
      </div>
    </motion.header>
  );
}
