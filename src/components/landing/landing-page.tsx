import { LandingHeader } from './landing-header';
import { ModernLandingHero } from './modern-landing-hero';
import ModernServicesSection from './modern-services-section';
import { AboutSection } from './about-section';
import { FaqSection } from './faq-section';
import { ContactSection } from './contact-section';
import { LandingFooter } from './landing-footer';
import { LandingFinancialChatWidget } from '@/components/shared/landing-financial-chat';

export function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <LandingHeader />
      <main className="flex-1">
        <ModernLandingHero />
        <ModernServicesSection />
        <AboutSection />
        <FaqSection />
        <ContactSection />
      </main>
      <LandingFooter />
      <LandingFinancialChatWidget />
    </div>
  );
}
