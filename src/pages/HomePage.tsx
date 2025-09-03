import { HeroSection } from '@/components/HeroSection';
import { BrandCarousel } from '@/components/BrandCarousel';
import { BestSellerSection } from '@/components/BestSellerSection';
import { CategoryGrid } from '@/components/CategoryGrid';
import { FeaturedProducts } from '@/components/FeaturedProducts';

export const HomePage = () => {
  return (
    <div>
      <HeroSection />
      <BrandCarousel />
      <BestSellerSection />
      <CategoryGrid />
      <FeaturedProducts />
    </div>
  );
};