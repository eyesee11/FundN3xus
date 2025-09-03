'use client'

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { CommandCenterDashboard } from '@/components/dashboard/command-center-dashboard';
import { AppTour } from '@/components/shared/app-tour';

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const shouldStartTour = searchParams.get('tour') === 'true';

  return (
    <>
      <CommandCenterDashboard />
      <AppTour 
        autoStart={shouldStartTour}
        onTourComplete={() => {
          // Remove tour param from URL after completion
          if (typeof window !== 'undefined') {
            const url = new URL(window.location.href);
            url.searchParams.delete('tour');
            window.history.replaceState({}, '', url.toString());
          }
        }}
      />
    </>
  );
}
