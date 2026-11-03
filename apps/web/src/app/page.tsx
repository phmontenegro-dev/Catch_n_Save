import { Header } from '@/components/Header';
import { Hero } from '@/components/hero/Hero';
import { DashboardPreview } from '@/components/dashboard-preview/DashboardPreview';

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <DashboardPreview />
      </main>
    </>
  );
}
