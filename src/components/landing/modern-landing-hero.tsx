'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  TrendingUp, 
  Shield, 
  Zap, 
  ArrowRight,
  Users,
  Target,
  BarChart3,
  CheckCircle,
  Star,
  DollarSign,
  Calculator,
  BarChart,
  PiggyBank,
  Activity,
  CircleDot
} from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';

export function ModernLandingHero() {
  const { t } = useLanguage();
  
  // Enhanced floating icons array
  const floatingIcons = [
    Sparkles, DollarSign, TrendingUp, Shield, Target, Calculator,
    BarChart, PiggyBank, Zap, Star, ArrowRight, BarChart3,
    Activity, CircleDot, Users, CheckCircle
  ];

  const iconColors = [
    'text-blue-400', 'text-purple-400', 'text-green-400', 'text-yellow-400',
    'text-pink-400', 'text-indigo-400', 'text-cyan-400', 'text-orange-400',
    'text-red-400', 'text-emerald-400', 'text-violet-400', 'text-amber-400',
    'text-teal-400', 'text-rose-400', 'text-lime-400', 'text-sky-400'
  ];

  // Undraw illustrations for collage
  const illustrations = [
    {
      src: '/undraw_projections_fhch.png',
      alt: 'Financial Projections',
      position: { top: '60%', right: '5%', rotate: 8 },
      size: { width: 200, height: 140 }
    },
    {
      src: '/undraw_investment-data_frxx.png',
      alt: 'Investment Data Analytics',
      position: { top: '10%', left: '15%', rotate: -5 },
      size: { width: 200, height: 120 }
    },
    {
      src: '/undraw_statistic-chart_6s7z.png',
      alt: 'Getting Started',
      position: { bottom: '15%', left: '10%', rotate: -3 },
      size: { width: 200, height: 110 }
    },
    {
      src: '/undraw_wallet_diag.png',
      alt: 'Digital Wallet',
      position: { top: '25%', right: '10%', rotate: 12 },
      size: { width:200, height: 130 }
    }
  ];

  const features = [
    {
      icon: Shield,
      title: t('hero.features.security'),
      description: t('hero.features.securityDesc'),
      color: 'text-blue-500'
    },
    {
      icon: Zap,
      title: t('hero.features.ai'),
      description: t('hero.features.aiDesc'),
      color: 'text-yellow-500'
    },
    {
      icon: Target,
      title: t('hero.features.planning'),
      description: t('hero.features.planningDesc'),
      color: 'text-green-500'
    }
  ];

  const stats = [
    { number: '10K+', label: t('hero.stats.users'), color: 'text-blue-500' },
    { number: '99.9%', label: t('hero.stats.uptime'), color: 'text-green-500' },
    { number: '24/7', label: t('hero.stats.support'), color: 'text-purple-500' },
    { number: '150+', label: t('hero.stats.features'), color: 'text-orange-500' }
  ];

  return (
    <section className="container py-12 md:py-20 lg:py-28 relative overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
      
      {/* Enhanced Floating Animation Icons */}
      {floatingIcons.map((Icon, index) => {
        const delay = index * 0.3;
        const duration = 8 + (index % 4) * 2;
        const xOffset = 50 + (index % 7) * 80;
        const yOffset = 50 + (index % 5) * 100;
        
        return (
          <motion.div
            key={`floating-${index}`}
            className="absolute pointer-events-none"
            initial={{ 
              opacity: 0,
              x: xOffset,
              y: yOffset,
              scale: 0.5,
              rotate: 0
            }}
            animate={{
              opacity: [0, 0.8, 0.9, 0.7, 0],
              x: [xOffset, xOffset + 100, xOffset - 50, xOffset + 150, xOffset],
              y: [yOffset, yOffset - 80, yOffset + 60, yOffset - 120, yOffset],
              scale: [0.5, 1.2, 0.8, 1.5, 0.5],
              rotate: [0, 180, 270, 540, 720]
            }}
            transition={{
              duration: duration,
              delay: delay,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              left: `${5 + (index % 8) * 12}%`,
              top: `${10 + (index % 6) * 15}%`,
              zIndex: 1
            }}
          >
            <Icon className={`w-6 h-6 ${iconColors[index % iconColors.length]}`} />
          </motion.div>
        );
      })}

      {/* Additional Sparkle Effects */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={`sparkle-${i}`}
          className="absolute pointer-events-none"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            zIndex: 1
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0],
            rotate: [0, 360]
          }}
          transition={{
            duration: 3,
            delay: i * 0.2,
            repeat: Infinity,
            repeatDelay: 5
          }}
        >
          <Sparkles className="w-4 h-4 text-primary/60" />
        </motion.div>
      ))}

      <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-7 space-y-8">
          {/* Header Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="border-none shadow-lg bg-gradient-to-br from-card/90 to-card/50 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                    <Sparkles className="w-3 h-3 mr-1" />
                    AI-Powered Financial Intelligence
                  </Badge>
                </div>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-headline tracking-tighter mb-6 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
                  {t('hero.title')}
                </h1>
                
                <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                  {t('hero.subtitle')}
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild size="lg" className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">
                    <Link href="/dashboard" className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      {t('hero.dashboard')}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href="#services" className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      {t('hero.learnMore')}
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid md:grid-cols-3 gap-4"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <Card className="h-full border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-md group bg-card/95 backdrop-blur-sm">
                  <CardContent className="p-6 text-center">
                    <div className={`inline-flex p-3 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className={`w-6 h-6 ${feature.color}`} />
                    </div>
                    <h3 className="font-semibold mb-2 text-base text-foreground">{feature.title}</h3>
                    <p className="text-sm text-foreground/80 leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="border-border/50 bg-gradient-to-r from-muted/30 to-muted/10 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {stats.map((stat, index) => (
                    <motion.div
                      key={index}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                      className="text-center"
                    >
                      <div className={`text-2xl md:text-3xl font-bold ${stat.color} mb-1`}>
                        {stat.number}
                      </div>
                      <div className="text-xs text-muted-foreground font-medium">
                        {stat.label}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Right Column - Undraw Illustrations Collage */}
        <div className="lg:col-span-5">
          <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            {/* Collage Container */}
            <motion.div
              className="relative w-full h-96 md:h-[500px] bg-gradient-to-br from-primary/5 via-accent/5 to-muted/10 rounded-2xl overflow-hidden"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              {/* Background pattern */}
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-accent/10" />
              
              {/* Floating Animation Elements around collage */}
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={`collage-sparkle-${i}`}
                  className="absolute"
                  style={{
                    left: `${10 + (i % 4) * 25}%`,
                    top: `${10 + Math.floor(i / 4) * 30}%`,
                    zIndex: 5
                  }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: [0, 0.6, 0],
                    scale: [0, 1.2, 0],
                    y: [0, -50, -100],
                    rotate: [0, 180, 360]
                  }}
                  transition={{
                    duration: 4,
                    delay: i * 0.3,
                    repeat: Infinity,
                    repeatDelay: 2
                  }}
                >
                  <Sparkles className="w-4 h-4 text-primary/60" />
                </motion.div>
              ))}

              {/* Undraw Illustrations */}
              {illustrations.map((illustration, index) => (
                <motion.div
                  key={index}
                  className="absolute"
                  style={{
                    ...illustration.position,
                    transform: `rotate(${illustration.position.rotate}deg)`,
                  }}
                  initial={{ opacity: 0, scale: 0, rotate: 0 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1, 
                    rotate: illustration.position.rotate 
                  }}
                  transition={{ 
                    duration: 0.8, 
                    delay: 0.5 + index * 0.2,
                    type: "spring",
                    stiffness: 100
                  }}
                  whileHover={{ 
                    scale: 1.1, 
                    rotate: illustration.position.rotate + 5,
                    zIndex: 10,
                    transition: { duration: 0.2 }
                  }}
                >
                  <Image
                    src={illustration.src}
                    alt={illustration.alt}
                    width={illustration.size.width}
                    height={illustration.size.height}
                    className="drop-shadow-lg hover:drop-shadow-xl transition-all duration-300"
                    priority={index === 0}
                  />
                </motion.div>
              ))}

              {/* Floating Feature Cards */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="absolute top-4 right-4 z-20"
              >
                <Card className="bg-card/90 backdrop-blur-sm border-border/50 shadow-lg">
                  <CardContent className="p-3 flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-xs font-medium">Live Data</span>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1.0 }}
                className="absolute bottom-4 left-4 z-20"
              >
                <Card className="bg-card/90 backdrop-blur-sm border-border/50 shadow-lg">
                  <CardContent className="p-3 flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-xs font-medium">4.9/5 Rating</span>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
