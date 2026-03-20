
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star, Phone, MessageCircle } from 'lucide-react';

const Marketplace = () => {
  const listings = [
    {
      seller: 'Green Valley Farm',
      location: 'Karnataka, India',
      product: 'Free-range Chickens',
      quantity: '500 birds',
      price: '₹180/kg',
      rating: 4.8,
      verified: true,
      image: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=300&h=200&fit=crop'
    },
    {
      seller: 'Sunrise Poultry',
      location: 'Tamil Nadu, India',
      product: 'Fresh Chicken Meat',
      quantity: '200 kg',
      price: '₹220/kg',
      rating: 4.9,
      verified: true,
      image: 'https://images.unsplash.com/photo-1466721591366-2d5fba72006d?w=300&h=200&fit=crop'
    },
    {
      seller: 'Mountain Ridge Farm',
      location: 'Kerala, India',
      product: 'Organic Eggs',
      quantity: '1000 dozen',
      price: '₹8/piece',
      rating: 4.7,
      verified: true,
      image: 'https://images.unsplash.com/photo-1493962853295-0fd70327578a?w=300&h=200&fit=crop'
    }
  ];

  return (
    <section id="marketplace" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Direct Marketplace
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connect rural farmers directly with urban buyers. No middlemen, better prices, fresher products.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {listings.map((listing, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-gray-200 rounded-t-lg overflow-hidden">
                <img 
                  src={listing.image} 
                  alt={listing.product}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{listing.product}</CardTitle>
                  {listing.verified && (
                    <Badge className="bg-green-100 text-green-800">Verified</Badge>
                  )}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-1" />
                  {listing.location}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Seller:</span>
                    <span className="font-medium">{listing.seller}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Available:</span>
                    <span className="font-medium">{listing.quantity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price:</span>
                    <span className="font-bold text-green-600">{listing.price}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="ml-1 text-sm">{listing.rating}</span>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    Contact Seller
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">25%</div>
              <div className="text-gray-600">Higher prices for farmers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">48hrs</div>
              <div className="text-gray-600">Faster delivery to market</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">0</div>
              <div className="text-gray-600">Middleman commission</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Marketplace;
