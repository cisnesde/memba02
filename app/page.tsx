import { HeroSection } from "@/components/home/HeroSection";
import { TrendingResources } from "@/components/home/TrendingResources";
import { SourcesSection } from "@/components/home/SourcesSection";
import { CallToAction } from "@/components/home/CallToAction";
import { query } from "@/lib/db";

export default async function Home() {
  // Fetch featured resources from the database
  let featuredResources: any[] = [];
  try {
    featuredResources = await query(
      `SELECT * FROM "resource" WHERE "featured" = true ORDER BY "createdAt" DESC LIMIT 4`
    );
  } catch {
    // Table might not exist yet — show empty
    featuredResources = [];
  }

  return (
    <div className="w-full flex flex-col items-center">
      <HeroSection />
      <TrendingResources resources={featuredResources} />
      <SourcesSection />
      <CallToAction />
    </div>
  );
}
