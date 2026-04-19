'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/language-context';
import { ArrowRight, BarChart3, Database, Shield, Zap } from 'lucide-react';
import Image from 'next/image';

export function ModernLandingHero() {
  const { t } = useLanguage();

  return (
    <section className="relative w-full overflow-hidden bg-brand-navy pt-24 pb-32">
      {/* Abstract Background Blob like JDoodle */}
      <div className="absolute top-1/4 left-0 -translate-x-1/2 -translate-y-1/2 opacity-20 hidden lg:block">
        <svg width="600" height="600" viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M482.5 159.5C536.9 217.1 578.8 285.3 561 346.5C543.2 407.7 465.7 460.7 391.8 501.9C317.9 543.1 247.6 572.5 186.2 553.1C124.8 533.7 72.3 465.5 39.8 387.9C7.3 310.3 -5.2 223.3 2.1 154.5C9.4 85.7 36.5 35.1 92.5 11.2C148.5 -12.7 233.4 4 309.2 27.2C385 50.4 428.1 101.9 482.5 159.5Z" fill="#1E293B"/>
        </svg>
      </div>

      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center text-center">
          
          {/* Main Heading styled like JDoodle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center max-w-4xl"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6 font-headline leading-tight">
              {t('hero.title') || 'Financial Intelligence For The AI Era'}
            </h1>
            
            {/* Logo Accent (JDoodle replacement) */}
            <div className="flex items-center gap-3 text-brand-orange text-3xl font-bold mb-8 relative">
              Fund <Database className="h-8 w-8 inline animate-pulse" /> N3xus
              
              {/* Hand-drawn style dashed arrow pointing to middle - SVG representation */}
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-60">
                 <svg width="100" height="40" viewBox="0 0 100 40" fill="none" className="stroke-brand-orange">
                  <path d="M10,10 Q50,-10 90,30" strokeWidth="2" strokeDasharray="4 4" fill="none" />
                  <path d="M85,20 L90,30 L80,32" strokeWidth="2" fill="none" />
                 </svg>
              </div>
            </div>

            <p className="text-lg md:text-xl text-slate-300 max-w-2xl mb-10 leading-relaxed">
              {t('hero.subtitle') || 'FundN3xus is a comprehensive financial intelligence platform where you can analyze, assess, predict, and optimize. Empowering individuals and institutions with AI-driven affordability risk models, RAG advisory, and instant live analytics.'}
            </p>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                asChild 
                size="lg" 
                className="bg-brand-orange hover:bg-brand-orange/90 text-white rounded-md font-semibold px-8 py-6 text-lg"
              >
                <Link href="/login" target="_blank">
                  {'View Dashboard'}
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Floating Cards (Side Elements mimicking JDoodle brain/code cards) */}
          <div className="relative w-full mt-24">
            
            {/* Left Card: AI/ML */}
            <motion.div 
              className="absolute left-0 -top-48 hidden lg:flex flex-col items-center"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="text-sm text-slate-400 max-w-[200px] mb-4 text-center">
                REST-based FastAPI to integrate ML models into your financial workflow.
              </div>
              <div className="mb-2 opacity-60">
                 <svg width="60" height="40" viewBox="0 0 60 40" fill="none" className="stroke-slate-400">
                  <path d="M30,0 Q10,20 10,40" strokeWidth="2" strokeDasharray="4 4" fill="none" />
                  <path d="M5,30 L10,40 L15,35" strokeWidth="2" fill="none" />
                 </svg>
              </div>
              <Card className="w-56 h-56 bg-brand-card border-white/10 flex items-center justify-center relative overflow-hidden group">
                {/* Abstract graphic decoration */}
                <div className="absolute left-2 top-12 bottom-12 w-2 rounded-full flex flex-col gap-2 opacity-30">
                  <div className="w-2 h-2 rounded-full bg-brand-orange"></div>
                  <div className="w-2 h-2 rounded-full bg-brand-orange"></div>
                  <div className="w-2 h-2 rounded-full bg-brand-orange"></div>
                  <div className="w-2 h-2 rounded-full bg-brand-orange"></div>
                  <div className="w-2 h-2 rounded-full bg-brand-orange"></div>
                </div>
                <CardContent className="p-0 flex items-center justify-center h-full w-full">
                  <Zap className="w-24 h-24 text-brand-orange group-hover:scale-110 transition-transform duration-500" />
                </CardContent>
              </Card>
            </motion.div>

            {/* Right Card: Assessment */}
            <motion.div 
              className="absolute right-0 -top-32 hidden lg:flex flex-col items-center"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <div className="text-sm text-slate-400 max-w-[200px] mb-4 text-center">
                Online Assessment and ML Analytics for Investment Risk.
              </div>
              <div className="mb-2 opacity-60">
                 <svg width="60" height="40" viewBox="0 0 60 40" fill="none" className="stroke-slate-400">
                  <path d="M30,0 Q50,20 50,40" strokeWidth="2" strokeDasharray="4 4" fill="none" />
                  <path d="M45,35 L50,40 L55,30" strokeWidth="2" fill="none" />
                 </svg>
              </div>
              <Card className="w-56 h-56 bg-brand-card border-white/10 flex items-center justify-center relative overflow-hidden group">
                <div className="absolute right-4 top-4 flex gap-2 opacity-30">
                   <div className="w-12 h-1 bg-brand-orange transform -rotate-45"></div>
                   <div className="w-12 h-1 bg-brand-orange transform -rotate-45 mt-4"></div>
                   <div className="w-12 h-1 bg-brand-orange transform -rotate-45 mt-8"></div>
                </div>
                <CardContent className="p-0 flex items-center justify-center h-full w-full">
                  <BarChart3 className="w-24 h-24 text-brand-orange group-hover:scale-110 transition-transform duration-500" />
                </CardContent>
              </Card>
            </motion.div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
