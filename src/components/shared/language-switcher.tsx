'use client';

import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/language-context';
import { Globe, Check } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

export function LanguageSwitcher() {
  const { language, setLanguage, availableLanguages } = useLanguage();
  const currentLanguage = availableLanguages.find(lang => lang.code === language);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full border border-brand-orange/40 bg-brand-card hover:bg-brand-orange/10 transition-all shadow-md w-10 h-10 flex items-center justify-center">
          <span className="sr-only">Change language</span>
          <span className="text-xl">{currentLanguage?.flag}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72 bg-brand-card border border-brand-orange/20 shadow-xl rounded-xl p-2">
        <DropdownMenuLabel className="flex items-center gap-2 text-brand-orange text-base font-bold mb-2">
          <Globe className="h-5 w-5" />
          Select Language
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="grid grid-cols-2 gap-2 p-2">
          {availableLanguages.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={`flex flex-col items-center gap-1 px-2 py-3 rounded-lg cursor-pointer border border-transparent transition-all ${
                language === lang.code ? 'bg-brand-orange/10 border-brand-orange text-brand-orange' : 'hover:bg-brand-dark/40 text-white/80'
              }`}
            >
              <span className="text-2xl mb-1">{lang.flag}</span>
              <span className="font-semibold text-sm">{lang.name}</span>
              <span className="text-xs text-slate-400">{lang.nativeName}</span>
              {language === lang.code && <Check className="h-4 w-4 text-brand-orange mt-1" />}
            </DropdownMenuItem>
          ))}
        </div>
        <DropdownMenuSeparator />
        <div className="p-2 text-center">
          <p className="text-xs text-slate-400">
            More languages coming soon
          </p>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
