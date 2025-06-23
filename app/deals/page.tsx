import { Metadata } from 'next';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Special Deals & Offers | Sulthana Fitness',
  description: 'Discover amazing deals and special offers on fitness equipment and accessories.',
};

const deals = [
  {
    id: 1,
    title: 'Summer Sale - Up to 50% Off',
    description: 'Get fit this summer with our massive discount on selected fitness equipment.',
    discount: '50% OFF',
    validUntil: '2024-08-31',
    category: 'Equipment',
    image: '/placeholder.jpg',
  },
  {
    id: 2,
    title: 'New Customer Special',
    description: 'First-time buyers get 20% off their entire order with code WELCOME20.',
    discount: '20% OFF',
    validUntil: '2024-12-31',
    category: 'All Products',
    image: '/placeholder.jpg',
  },
  {
    id: 3,
    title: 'Bundle & Save',
    description: 'Buy any 3 items and get the cheapest one absolutely free!',
    discount: 'FREE ITEM',
    validUntil: '2024-07-15',
    category: 'Bundles',
    image: '/placeholder.jpg',
  },
];

export default function DealsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Special Deals & Offers</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Don't miss out on these amazing deals! Limited time offers on premium fitness equipment and accessories.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {deals.map((deal) => (
          <Card key={deal.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative">
              <img
                src={deal.image}
                alt={deal.title}
                className="w-full h-48 object-cover"
              />
              <Badge className="absolute top-4 right-4 bg-red-500 text-white">
                {deal.discount}
              </Badge>
            </div>
            <CardHeader>
              <CardTitle className="text-xl">{deal.title}</CardTitle>
              <CardDescription>{deal.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <Badge variant="secondary">{deal.category}</Badge>
                <span className="text-sm text-gray-500">
                  Valid until: {new Date(deal.validUntil).toLocaleDateString()}
                </span>
              </div>
              <Button asChild className="w-full">
                <Link href="/shop">Shop Now</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-8 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">Subscribe for More Deals</h2>
        <p className="text-lg mb-6">
          Be the first to know about new offers and exclusive deals!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-4 py-2 rounded-md text-gray-900"
          />
          <Button variant="secondary" className="whitespace-nowrap">
            Subscribe
          </Button>
        </div>
      </div>
    </div>
  );
} 