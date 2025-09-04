'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  DollarSign, 
  TrendingUp, 
  Shield, 
  Target, 
  Calculator,
  BarChart,
  PiggyBank,
  Zap,
  Star,
  ArrowUpRight,
  TrendingDown,
  Activity,
  CircleDot
} from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';

export function LandingHero() {
  const { t } = useLanguage();
  
  // Reduced floating icons array
  const floatingIcons = [
    Sparkles, DollarSign, TrendingUp, Shield, Target, Calculator
  ];

  const iconColors = [
    'text-blue-400', 'text-purple-400', 'text-green-400', 'text-yellow-400',
    'text-pink-400', 'text-indigo-400'
  ];
  
  return (
    <section className="container grid lg:grid-cols-2 gap-12 items-center py-20 md:py-32 relative overflow-hidden">
      {/* Enhanced Background Floating Icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Large background icons - reduced from 25 to 8 */}
        {[...Array(8)].map((_, i) => {
          const Icon = floatingIcons[i % floatingIcons.length];
          const color = iconColors[i % iconColors.length];
          
          return (
            <motion.div
              key={`bg-icon-${i}`}
              className="absolute opacity-[0.08] hover:opacity-[0.12] transition-opacity duration-500"
              style={{
                left: `${10 + (i % 4) * 20}%`,
                top: `${10 + Math.floor(i / 4) * 40}%`,
                fontSize: `${60 + (i % 3) * 15}px`,
              }}
              animate={{
                y: [0, -30, 0],
                x: [0, 15, 0],
                rotate: [0, 5, -5, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 8 + (i % 3) * 2,
                repeat: Infinity,
                delay: i * 0.8,
                ease: "easeInOut"
              }}
            >
              <Icon className={`${color} w-full h-full`} />
            </motion.div>
          );
        })}

        {/* Medium floating icons - reduced from 35 to 12 */}
        {[...Array(12)].map((_, i) => {
          const Icon = floatingIcons[(i + 2) % floatingIcons.length];
          const color = iconColors[(i + 3) % iconColors.length];
          
          return (
            <motion.div
              key={`med-icon-${i}`}
              className="absolute opacity-[0.10]"
              style={{
                left: `${15 + (i % 4) * 20}%`,
                top: `${15 + (i % 3) * 25}%`,
                zIndex: 1,
              }}
              animate={{
                y: [0, -60, -120, -180],
                x: [0, 20, -10, 30],
                rotate: [0, 180, 360],
                scale: [0, 1, 1.2, 0],
                opacity: [0, 0.15, 0.10, 0],
              }}
              transition={{
                duration: 12 + (i % 4) * 2,
                repeat: Infinity,
                delay: i * 0.6,
                ease: [0.25, 0.46, 0.45, 0.94],
                repeatDelay: 4 + (i % 3) * 2,
              }}
            >
              <Icon className={`${color} w-8 h-8`} />
            </motion.div>
          );
        })}

        {/* Small sparkle effects - reduced from 50 to 15 */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={`sparkle-${i}`}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              zIndex: 2,
            }}
            animate={{
              scale: [0, 1.5, 0],
              opacity: [0, 0.8, 0],
              rotate: [0, 180],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 8,
              ease: "easeInOut",
              repeatDelay: 4 + Math.random() * 4,
            }}
          >
            <div className={`w-2 h-2 bg-gradient-to-r ${iconColors[i % iconColors.length].replace('text-', 'from-')} to-transparent rounded-full`} />
          </motion.div>
        ))}
      </div>
      <motion.div 
        className="space-y-6 text-center lg:text-left relative z-10"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.h1 
          className="text-4xl md:text-5xl lg:text-6xl font-bold font-headline tracking-tighter"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          {t('hero.title').split('AI की शक्ति')[0]}<span className="text-primary">{t('hero.title').split('AI की शक्ति')[1] ? 'AI की शक्ति' : 'AI-Powered Clarity'}</span>{t('hero.title').split('AI की शक्ति')[1]}
        </motion.h1>
        <motion.p 
          className="text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
        >
          {t('hero.subtitle')}
        </motion.p>
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
        >
          <Button asChild size="lg">
            <Link href="/login" target="_blank" rel="noopener noreferrer">{t('hero.dashboard')}</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="#services">{t('hero.learnMore')}</Link>
          </Button>
        </motion.div>
      </motion.div>
      
      <motion.div 
        className="flex justify-center relative overflow-hidden z-10"
        initial={{ opacity: 0, x: 50, scale: 0.8 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
        whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
      >
        {/* Enhanced cascade sparkles with varied icons - reduced from 20 to 8 */}
        {[...Array(8)].map((_, i) => {
          const Icon = floatingIcons[i % floatingIcons.length];
          const color = iconColors[i % iconColors.length];
          
          return (
            <motion.div
              key={`cascade-${i}`}
              className="absolute"
              style={{
                left: `${15 + (i % 4) * 20}%`,
                top: `-15%`,
                zIndex: 5
              }}
              initial={{ opacity: 0, scale: 0, y: -50 }}
              animate={{
                opacity: [0, 1, 0.6, 0],
                scale: [0, 1.2, 0.8, 0],
                y: [-50, 150, 300, 500],
                rotate: [0, 270, 450, 720]
              }}
              transition={{
                duration: 4 + (i % 2) * 0.5,
                delay: i * 0.4,
                repeat: Infinity,
                repeatDelay: 4 + (i % 3) * 1,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
            >
              <Icon 
                className={`w-4 h-4 ${color} fill-current`}
                style={{
                  filter: `drop-shadow(0 0 6px ${color.includes('purple') ? 'rgba(168, 85, 247, 0.8)' : 
                                                 color.includes('blue') ? 'rgba(59, 130, 246, 0.8)' :
                                                 color.includes('green') ? 'rgba(34, 197, 94, 0.8)' :
                                                 'rgba(139, 92, 246, 0.8)'})`
                }}
              />
            </motion.div>
          );
        })}
        
        {/* Enhanced floating sparkles around the image - reduced from 15 to 6 */}
        {[...Array(6)].map((_, i) => {
          const Icon = floatingIcons[(i + 2) % floatingIcons.length];
          const color = iconColors[(i + 1) % iconColors.length];
          
          return (
            <motion.div
              key={`float-${i}`}
              className="absolute"
              style={{
                left: `${10 + (i % 3) * 30}%`,
                top: `${15 + Math.floor(i / 3) * 40}%`,
                zIndex: 10
              }}
              initial={{ opacity: 0, scale: 0, y: 0 }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1.2, 0],
                y: [0, -120, -240],
                rotate: [0, 360],
              }}
              transition={{
                duration: 3 + (i % 2) * 0.5,
                delay: i * 0.4,
                repeat: Infinity,
                repeatDelay: 3 + (i % 2) * 1,
                ease: [0.4, 0, 0.2, 1]
              }}
            >
              <Icon 
                className={`w-5 h-5 ${color} fill-current`}
                style={{
                  filter: `drop-shadow(0 0 8px ${color.includes('blue') ? 'rgba(59, 130, 246, 0.6)' : 
                                                 color.includes('purple') ? 'rgba(168, 85, 247, 0.6)' :
                                                 color.includes('green') ? 'rgba(34, 197, 94, 0.6)' :
                                                 'rgba(168, 85, 247, 0.6)'})`
                }}
              />
            </motion.div>
          );
        })}
        
        <motion.div
          className="relative"
          whileHover={{ 
            rotateY: 5,
            rotateX: 2,
            transition: { duration: 0.3 }
          }}
          style={{ perspective: 1000 }}
        >
          <Image 
            src="/banner.png"
            alt="FundN3xus Financial Dashboard Preview"
            width={600}
            height={400}
            className="rounded-xl shadow-2xl"
            priority
          />
          <motion.div
            className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-purple-500/10 rounded-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
