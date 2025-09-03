'use client';

import { CommandCenterLayout } from '@/components/layout/command-center-layout';
import { AppTour } from '@/components/shared/app-tour';

export function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <CommandCenterLayout>
      {children}
      <AppTour />
    </CommandCenterLayout>
  );
}
