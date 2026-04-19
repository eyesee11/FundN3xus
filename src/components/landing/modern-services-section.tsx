'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Calculator, ArrowRight, BrainCircuit, ActivitySquare } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';
import Link from 'next/link';

export default function ModernServicesSection() {
  const { t } = useLanguage();

  const services = [
    {
      id: 'affordability',
      title: 'Affordability Risk',
      description: 'AI-powered ML models to predict borrowing capacity and financial health instantly.',
      icon: Calculator,
      href: '/affordability'
    },
    {
      id: 'advisory',
      title: 'RAG Advisory',
      description: 'LLM-based personalized financial recommendations backed by real-time market data.',
      icon: BrainCircuit,
      href: '/scenarios'
    },
    {
      id: 'investments',
      title: 'Investment Automation',
      description: 'Rebalance risk and project returns seamlessly with advanced analytics and ML.',
      icon: ActivitySquare,
      href: '/investments'
    }
  ];

  // animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  return (
    <section id="services" className="w-full py-20 bg-brand-navy">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-headline text-white mb-4">
            Our Services
          </h2>
          <p className="text-slate-400 max-w-[600px]">
            Contains ML Predictions, RAG Connections And Our Intelligence Hub
          </p>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {services.map((service) => (
            <motion.div key={service.id} variants={itemVariants} className="h-full">
              <Link href={service.href} className="block h-full cursor-pointer group">
                <Card className="h-full min-h-[280px] bg-brand-card border-white/5 hover:border-brand-orange/50 transition-colors duration-300 relative overflow-hidden flex flex-col items-start p-8 text-left">
                  <div className="mb-6 flex items-center gap-3">
                    <service.icon className="h-8 w-8 text-brand-orange" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-3 font-headline group-hover:text-brand-orange transition-colors">
                    {service.title}
                  </h3>
                  
                  <p className="text-slate-400 text-sm leading-relaxed flex-grow">
                    {service.description}
                  </p>

                  {/* Bottom Right Decorative Arrow (JDoodle Style) */}
                  <div className="absolute bottom-0 right-0 w-20 h-20 overflow-hidden">
                    <div className="absolute bottom-[-10px] right-[-10px] w-20 h-20 rounded-tl-[40px] border-t-2 border-l-2 border-slate-600/30 group-hover:border-brand-orange transition-colors duration-300 flex items-center justify-center pt-4 pl-4">
                      <ArrowRight className="text-brand-orange w-5 h-5 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
