import { Header } from '@/components/Header';
import { ScrollStory } from '@/components/scroll-story/ScrollStory';
import { CommunitySection } from '@/components/community/CommunitySection';
import { FeaturesSection } from '@/components/features/FeaturesSection';

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <ScrollStory />
        <CommunitySection />
        <FeaturesSection />
      </main>
    </>
  );
}
