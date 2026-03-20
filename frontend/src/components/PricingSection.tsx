import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Users, ShoppingBag, RefreshCcw, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

const PricingSection = () => {
  const { user, subscribed, subscriptionEnd, checkSubscription } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const features = [
    'Full marketplace access',
    'Direct seller-to-buyer transactions',
    'Real-time monitoring dashboard',
    'IoT sensor data access',
    'Mobile app access',
    'Priority customer support',
    'No intermediary fees',
    'Secure payment processing',
    'UPI payments (GPay, PhonePe, Paytm)'
  ];

  const handleSubscribe = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to subscribe.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Mock Checkout",
        description: "Payment gateway integration requires custom backend routes.",
      });
    }, 1000);
  };

  const handleManageSubscription = async () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Mock Portal",
        description: "Customer portal requires custom backend integration.",
      });
    }, 1000);
  };

  return (
    <section id="pricing" className="py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Simple, Affordable Pricing
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            One plan for everyone. Whether you're a seller or buyer, get full access to our platform.
          </p>
        </div>

        <Card className={`relative hover:shadow-xl transition-shadow ring-2 ${subscribed ? 'ring-blue-500' : 'ring-green-500'}`}>
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <Badge className={`${subscribed ? 'bg-blue-600' : 'bg-green-600'} text-white px-4 py-1`}>
              {subscribed ? (
                <>✅ Active Subscription</>
              ) : (
                <>
                  <Users className="h-3 w-3 mr-1" />
                  For Sellers & Buyers
                </>
              )}
            </Badge>
          </div>
          
          <CardHeader className="text-center pt-10">
            <CardTitle className="text-2xl mb-2">PoultryConnect Membership</CardTitle>
            <div className="mt-4">
              <span className="text-5xl font-bold text-gray-900">₹2</span>
              <span className="text-gray-600 text-lg">/month</span>
            </div>
            {subscribed && subscriptionEnd && (
              <p className="text-sm text-blue-600 mt-2">
                Active until {new Date(subscriptionEnd).toLocaleDateString()}
              </p>
            )}
            <p className="text-gray-600 mt-4 text-lg">
              Full access to all features for 1 month. Pay via UPI (GPay, PhonePe, Paytm) or Card.
            </p>
          </CardHeader>
          
          <CardContent className="pb-8">
            <div className="flex items-center justify-center gap-6 mb-8 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4 text-green-600" />
                <span>Sell & Buy</span>
              </div>
              <div className="flex items-center gap-2">
                <RefreshCcw className="h-4 w-4 text-green-600" />
                <span>Easy Renewal</span>
              </div>
            </div>
            
            <ul className="space-y-3 mb-8 max-w-md mx-auto">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <Check className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
            
            <div className="text-center space-y-3">
              {subscribed ? (
                <Button
                  className="w-full max-w-xs bg-blue-600 hover:bg-blue-700 text-lg py-6"
                  onClick={handleManageSubscription}
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : null}
                  Manage Subscription
                </Button>
              ) : (
                <Button
                  className="w-full max-w-xs bg-green-600 hover:bg-green-700 text-lg py-6"
                  onClick={handleSubscribe}
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : null}
                  Subscribe Now
                </Button>
              )}
              {user && !subscribed && (
                <Button variant="ghost" size="sm" onClick={checkSubscription}>
                  <RefreshCcw className="h-4 w-4 mr-1" /> Refresh Status
                </Button>
              )}
              <p className="text-sm text-gray-500 mt-4">
                Renew at the same price every month. Cancel anytime.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">Why Choose PoultryConnect?</h3>
          <p className="text-green-100 mb-6 max-w-2xl mx-auto">
            Join thousands of poultry farmers and buyers connecting directly. 
            No middlemen, no hidden fees - just ₹2/month for complete access.
          </p>
          <Button variant="secondary" size="lg">
            Contact Us
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
