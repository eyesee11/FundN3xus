"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  Shield, 
  Calculator, 
  BarChart, 
  Target, 
  PiggyBank, 
  ArrowRight, 
  Sparkles,
  CheckCircle,
  Users,
  Zap,
  DollarSign,
  Activity,
  Brain,
  Lock,
  Lightbulb
} from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useLanguage } from "@/contexts/language-context";
import Link from "next/link";

const ModernServicesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const { t } = useLanguage();

  const services = [
    {
      title: t('services.investment.title'),
      description: t('services.investment.description'),
      icon: TrendingUp,
      badge: "Most Popular",
      gradient: "from-blue-500/10 via-indigo-500/10 to-purple-500/10",
      iconBg: "bg-gradient-to-br from-blue-500 to-indigo-600",
      features: [
        "AI Portfolio Analysis", 
        "Risk Assessment", 
        "Performance Tracking", 
        "Smart Rebalancing"
      ],
      stats: { metric: "Portfolio Growth", value: "+23.4%", period: "avg yearly" }
    },
    {
      title: t('services.affordability.title'),
      description: t('services.affordability.description'),
      icon: Calculator,
      badge: "Essential",
      gradient: "from-green-500/10 via-emerald-500/10 to-teal-500/10",
      iconBg: "bg-gradient-to-br from-green-500 to-emerald-600",
      features: [
        "Budget Planning", 
        "Expense Tracking", 
        "Goal Setting", 
        "Savings Optimization"
      ],
      stats: { metric: "Money Saved", value: "₹2.5L", period: "avg yearly" }
    },
    {
      title: t('services.scenario.title'),
      description: t('services.scenario.description'),
      icon: Target,
      badge: "Advanced",
      gradient: "from-purple-500/10 via-violet-500/10 to-pink-500/10",
      iconBg: "bg-gradient-to-br from-purple-500 to-violet-600",
      features: [
        "Future Planning", 
        "What-if Analysis", 
        "Risk Modeling", 
        "Decision Support"
      ],
      stats: { metric: "Better Decisions", value: "95%", period: "user rate" }
    },
  ];

  const additionalFeatures = [
    {
      icon: Brain,
      title: "AI-Powered Insights",
      description: "Get personalized recommendations based on your unique financial situation and goals"
    },
    {
      icon: Lock,
      title: "Bank-Level Security",
      description: "Military-grade encryption protects your sensitive financial data at all times"
    },
    {
      icon: Activity,
      title: "Real-Time Monitoring",
      description: "Track your financial health with live updates, alerts, and instant notifications"
    },
    {
      icon: Lightbulb,
      title: "Smart Automation",
      description: "Automate savings, investments, and bill payments with intelligent algorithms"
    },
    {
      icon: Users,
      title: "Expert Support",
      description: "Access to certified financial advisors and 24/7 customer support team"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Process transactions and generate reports in milliseconds, not minutes"
    },
    {
      icon: DollarSign,
      title: "Cost Effective",
      description: "Save more with our transparent fee structure and no hidden charges"
    },
    {
      icon: CheckCircle,
      title: "Proven Results",
      description: "Join thousands of users who have improved their financial health with us"
    }
  ];

  return (
    <motion.section 
      ref={ref}
      id="services"
      className="py-16 md:py-20 lg:py-24 bg-gradient-to-br from-background via-muted/20 to-background relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent/5 rounded-full blur-3xl animate-pulse delay-1000" />
        
        {/* Floating Icons */}
        {[DollarSign, TrendingUp, Shield, Target].map((Icon, i) => (
          <motion.div
            key={i}
            className="absolute opacity-[0.03] text-foreground"
            style={{
              left: `${20 + i * 25}%`,
              top: `${10 + i * 20}%`,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 5, 0],
            }}
            transition={{
              duration: 6,
              delay: i * 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Icon size={80} />
          </motion.div>
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header Section */}
        <motion.div 
          className="text-center mb-16 max-w-3xl mx-auto"
          initial={{ y: 30, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex justify-center mb-6">
            <Badge variant="secondary" className="px-4 py-2 text-sm">
              <Sparkles className="w-4 h-4 mr-2" />
              Comprehensive Financial Services
            </Badge>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
            {t('services.title')}
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Empower your financial journey with AI-driven insights, personalized strategies, and comprehensive tools designed to help you achieve your financial goals.
          </p>
        </motion.div>

        {/* Main Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ y: 50, opacity: 0, scale: 0.95 }}
              animate={isInView ? { y: 0, opacity: 1, scale: 1 } : { y: 50, opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.15 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="group h-full"
            >
              <Card className={`relative overflow-hidden border-border/50 hover:border-primary/30 transition-all duration-500 ease-out h-full backdrop-blur-sm bg-gradient-to-br ${service.gradient} hover:shadow-xl hover:shadow-primary/10 group-hover:scale-[1.02]`}>
                
                {/* Badge */}
                <div className="absolute top-4 right-4 z-20">
                  <Badge 
                    variant={index === 0 ? "default" : "secondary"} 
                    className={`${index === 0 ? 'bg-primary text-primary-foreground shadow-lg' : 'bg-card/80 backdrop-blur-sm'} text-xs font-medium`}
                  >
                    {service.badge}
                  </Badge>
                </div>

                {/* Background Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-card/95 via-card/90 to-card/95 group-hover:from-card/90 group-hover:via-card/85 group-hover:to-card/90 transition-all duration-500" />

                <CardHeader className="relative z-10 pb-4">
                  {/* Service Icon */}
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-4 rounded-2xl ${service.iconBg} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <service.icon className="w-8 h-8" />
                    </div>
                  </div>

                  <CardTitle className="text-xl font-bold mb-3 group-hover:text-primary transition-colors duration-300 pr-12">
                    {service.title}
                  </CardTitle>
                  <CardDescription className="text-sm leading-relaxed text-muted-foreground mb-4">
                    {service.description}
                  </CardDescription>

                  {/* Stats Card */}
                  <div className="bg-muted/30 rounded-lg p-3 mb-4 backdrop-blur-sm border border-border/20">
                    <div className="text-center">
                      <div className="text-lg font-bold text-primary">{service.stats.value}</div>
                      <div className="text-xs text-muted-foreground">{service.stats.metric}</div>
                      <div className="text-xs text-muted-foreground opacity-75">{service.stats.period}</div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="relative z-10 pt-0">
                  {/* Features List */}
                  <div className="space-y-3 mb-6">
                    {service.features.map((feature, featureIndex) => (
                      <motion.div
                        key={featureIndex}
                        initial={{ opacity: 0, x: -20 }}
                        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                        transition={{ duration: 0.4, delay: 0.5 + index * 0.1 + featureIndex * 0.05 }}
                        className="flex items-center gap-3"
                      >
                        <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                        <span className="text-sm font-medium text-foreground/90">{feature}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 bg-card/50 backdrop-blur-sm hover:bg-primary hover:text-primary-foreground border-border/50 hover:border-primary transition-all duration-300"
                    >
                      Learn More
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </Button>
                    
                    <Link href="/login" className="flex-1">
                      <Button 
                        size="sm"
                        className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-md hover:shadow-lg transition-all duration-300"
                      >
                        <Users className="w-4 h-4 mr-2" />
                        Start Now
                      </Button>
                    </Link>
                  </div>
                </CardContent>

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-accent/8 rounded-lg" />
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Additional Features Section */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mb-12"
        >
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-4">
            Why Choose FundN3xus?
          </h3>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Experience the future of financial management with our comprehensive suite of intelligent tools and features.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {additionalFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ y: 20, opacity: 0 }}
                animate={isInView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
                transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="h-full"
              >
                <Card className="h-full border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg group bg-card/80 backdrop-blur-sm">
                  <CardContent className="p-6 text-center h-full flex flex-col">
                    <div className="inline-flex p-3 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 mb-4 group-hover:scale-110 transition-transform duration-300 mx-auto">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h4 className="font-semibold mb-3 text-sm">{feature.title}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed flex-grow">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12 pt-8 border-t border-border/50"
          >
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-primary mb-1">10K+</div>
              <div className="text-sm text-muted-foreground">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-green-500 mb-1">₹50Cr+</div>
              <div className="text-sm text-muted-foreground">Managed Assets</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-blue-500 mb-1">99.9%</div>
              <div className="text-sm text-muted-foreground">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-purple-500 mb-1">4.9★</div>
              <div className="text-sm text-muted-foreground">User Rating</div>
            </div>
          </motion.div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          <Card className="bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 border-border/50 backdrop-blur-sm overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-accent/10" />
            
            <CardContent className="relative z-10 p-8 md:p-12 text-center">
              <div className="max-w-2xl mx-auto">
                <h3 className="text-2xl md:text-3xl font-bold mb-4">
                  Ready to Transform Your Financial Future?
                </h3>
                <p className="text-muted-foreground mb-8 leading-relaxed">
                  Join thousands of users who trust FundN3xus for their financial planning and investment decisions. Start your journey to financial freedom today.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/login">
                    <Button 
                      size="lg"
                      className="bg-gradient-to-r from-primary via-primary to-accent hover:from-primary/90 hover:via-primary/95 hover:to-accent/90 text-primary-foreground shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 px-8"
                    >
                      <Sparkles className="w-5 h-5 mr-2" />
                      Start Your Journey
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                  
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="bg-card/50 backdrop-blur-sm border-border/50 hover:bg-muted/50 px-8"
                  >
                    <Users className="w-5 h-5 mr-2" />
                    Schedule Demo
                  </Button>
                </div>
                
                <div className="mt-8 flex items-center justify-center gap-8 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Free 30-day trial</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>No credit card required</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Cancel anytime</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default ModernServicesSection;
