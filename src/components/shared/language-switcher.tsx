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
        <Button variant="outline" size="sm" className="gap-2 min-w-[100px]">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">{currentLanguage?.flag}</span>
          <span className="text-xs">{currentLanguage?.code.toUpperCase()}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="flex items-center gap-2">
          <Globe className="h-4 w-4" />
          Select Language
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {/* Primary Languages */}
        <div className="p-1">
          {availableLanguages.slice(0, 2).map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={`flex items-center gap-3 p-3 cursor-pointer rounded-md ${
                language === lang.code ? 'bg-primary/10 text-primary' : 'hover:bg-muted/50'
              }`}
            >
              <span className="text-lg">{lang.flag}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{lang.name}</span>
                  {language === lang.code && <Check className="h-4 w-4 text-primary" />}
                </div>
                <span className="text-sm text-muted-foreground">{lang.nativeName}</span>
              </div>
              {(lang.code === 'en' || lang.code === 'hi') && (
                <Badge variant="secondary" className="text-xs">Complete</Badge>
              )}
            </DropdownMenuItem>
          ))}
        </div>

        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-xs text-muted-foreground px-3">
          Additional Languages
        </DropdownMenuLabel>
        
        {/* Additional Languages */}
        <div className="p-1">
          {availableLanguages.slice(2).map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={`flex items-center gap-3 p-3 cursor-pointer rounded-md ${
                language === lang.code ? 'bg-primary/10 text-primary' : 'hover:bg-muted/50'
              }`}
            >
              <span className="text-lg">{lang.flag}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{lang.name}</span>
                  {language === lang.code && <Check className="h-4 w-4 text-primary" />}
                </div>
                <span className="text-sm text-muted-foreground">{lang.nativeName}</span>
              </div>
              <Badge variant="outline" className="text-xs">
                Basic
              </Badge>
            </DropdownMenuItem>
          ))}
        </div>
        
        <DropdownMenuSeparator />
        <div className="p-2 text-center">
          <p className="text-xs text-muted-foreground">
            More languages coming soon
          </p>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
