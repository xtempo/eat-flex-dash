import { useEffect, useState } from 'react';
import { Flame, Wheat, LeafyGreen, CakeSlice, Coffee, Soup } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCurrency } from '@/contexts/CurrencyContext';
import { supabase } from '@/integrations/supabase/client';

const features = [
  {
    icon: Flame,
    title: 'Fresh',
    description: 'Made with the freshest ingredients sourced daily from local markets',
    gradient: 'from-orange-500 to-red-500',
    categories: ['appetizers', 'salads'],
  },
  {
    icon: Wheat,
    title: 'Baked',
    description: 'Traditional Tibetan breads and pastries baked fresh in our clay ovens',
    gradient: 'from-amber-500 to-yellow-600',
    categories: ['breads'],
  },
  {
    icon: Soup,
    title: 'Soups',
    description: 'Warming Himalayan soups & broths perfect for every season',
    gradient: 'from-emerald-500 to-teal-600',
    categories: ['soups'],
  },
  {
    icon: LeafyGreen,
    title: 'Healthy',
    description: 'Nutritious meals packed with herbs, vegetables & wholesome grains',
    gradient: 'from-green-500 to-lime-600',
    categories: ['main_course', 'rice_dishes'],
  },
  {
    icon: CakeSlice,
    title: 'Desserts',
    description: 'Sweet Tibetan treats & fusion desserts to end your meal perfectly',
    gradient: 'from-pink-500 to-rose-500',
    categories: ['desserts'],
  },
  {
    icon: Coffee,
    title: 'Beverages',
    description: 'Butter tea, herbal infusions & specialty drinks from the mountains',
    gradient: 'from-violet-500 to-purple-600',
    categories: ['beverages', 'drinks'],
  },
];

const FeatureCards = () => {
  const { formatPrice } = useCurrency();
  const [minPrices, setMinPrices] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchPrices = async () => {
      const { data } = await supabase
        .from('menu_items')
        .select('category, price')
        .eq('available', true);

      if (!data) return;

      const prices: Record<string, number> = {};
      for (const feat of features) {
        const matching = data.filter(item => feat.categories.includes(item.category));
        if (matching.length > 0) {
          prices[feat.title] = Math.min(...matching.map(m => Number(m.price)));
        }
      }
      setMinPrices(prices);
    };
    fetchPrices();
  }, []);

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">What We Offer</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Authentic Himalayan flavors crafted with love, tradition, and the finest ingredients
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {features.map((feat) => (
            <Link
              to="/menu"
              key={feat.title}
              className="group relative rounded-2xl border border-border bg-card p-5 text-center transition-all hover:shadow-xl hover:-translate-y-1"
            >
              <div
                className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${feat.gradient} text-white shadow-lg transition-transform group-hover:scale-110`}
              >
                <feat.icon className="h-7 w-7" />
              </div>
              <h3 className="font-bold text-base mb-1">{feat.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed mb-2">
                {feat.description}
              </p>
              {minPrices[feat.title] != null && (
                <p className="text-sm font-semibold text-primary">
                  From {formatPrice(minPrices[feat.title])}
                </p>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureCards;
