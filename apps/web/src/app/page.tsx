import { Header } from '@/components/Header';
import { ScrollStory } from '@/components/scroll-story/ScrollStory';
import { CommunitySection } from '@/components/community/CommunitySection';
import { FeaturesSection } from '@/components/features/FeaturesSection';
import { FinalCta } from '@/components/cta/FinalCta';
import { Footer } from '@/components/footer/Footer';

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <ScrollStory />
        <CommunitySection />
        <FeaturesSection />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
