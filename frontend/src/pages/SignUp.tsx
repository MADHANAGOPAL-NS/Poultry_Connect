
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Mail, Lock, User, Phone, ArrowLeft, ShoppingBag, Tractor, MapPin, Building2, Loader2, Eye, EyeOff } from 'lucide-react';
// Using custom backend for auth
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const SignUp = () => {
  const navigate = useNavigate();
  const { user, signIn } = useAuth();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'buyer' as 'buyer' | 'seller',
    agreeToTerms: false,
    // Buyer fields
    location: '',
    businessName: '',
    preferredProducts: '',
    // Seller fields
    farmName: '',
    farmLocation: '',
    farmSize: '',
    poultryTypes: '',
    experienceYears: '',
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.agreeToTerms) {
      toast({
        title: "Terms required",
        description: "Please agree to the terms of service to continue.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const profileData = formData.role === 'buyer'
        ? {
          fullName: formData.fullName,
          phone: formData.phone || null,
          location: formData.location || null,
          businessName: formData.businessName || null,
          preferredProducts: formData.preferredProducts || null,
        }
        : {
          fullName: formData.fullName,
          phone: formData.phone || null,
          farmName: formData.farmName || null,
          farmLocation: formData.farmLocation || null,
          farmSize: formData.farmSize || null,
          poultryTypes: formData.poultryTypes || null,
          experienceYears: formData.experienceYears ? parseInt(formData.experienceYears) : null,
        };

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          role: formData.role,
          profileData
        })
      });

      const data = await response.json();

      if (!response.ok) {
        toast({
          title: "Sign up failed",
          description: data.message || "An error occurred during registration.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      if (data.token) {
        if (!data.user?.isVerified) {
          toast({
            title: "Check your email!",
            description: "We sent a verification link. Please verify your email before signing in.",
          });
          navigate('/signin');
        } else {
          signIn(data.token, data.user);
          toast({
            title: "🎉 Account created!",
            description: "Welcome to Poultry Connect! You are now signed in.",
          });
          navigate('/dashboard');
        }
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast({
        title: "Sign up failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link to="/" className="inline-flex items-center text-green-600 hover:text-green-700 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <img
            src="/lovable-uploads/fb536fca-43f9-4b55-b779-0502499b7ab3.png"
            alt="Poultry Connect Logo"
            className="h-16 w-auto mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-gray-900">Join Poultry Connect</h1>
          <p className="text-gray-600">Create your account to get started</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Create Account</CardTitle>
            <CardDescription>
              Fill in your details to create your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    className="pl-10"
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="pl-10"
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="pl-10"
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label>I am a</Label>
                <RadioGroup
                  value={formData.role}
                  onValueChange={(value) => handleInputChange('role', value)}
                  className="flex gap-4"
                  disabled={isSubmitting}
                >
                  <div className="flex-1">
                    <label
                      htmlFor="role-buyer"
                      className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${formData.role === 'buyer' ? 'border-green-600 bg-green-50' : 'border-muted'
                        }`}
                    >
                      <RadioGroupItem value="buyer" id="role-buyer" />
                      <ShoppingBag className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium">Buyer</p>
                        <p className="text-xs text-muted-foreground">Purchase poultry products</p>
                      </div>
                    </label>
                  </div>
                  <div className="flex-1">
                    <label
                      htmlFor="role-seller"
                      className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${formData.role === 'seller' ? 'border-green-600 bg-green-50' : 'border-muted'
                        }`}
                    >
                      <RadioGroupItem value="seller" id="role-seller" />
                      <Tractor className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium">Seller</p>
                        <p className="text-xs text-muted-foreground">Sell poultry & products</p>
                      </div>
                    </label>
                  </div>
                </RadioGroup>
              </div>

              {/* Role-specific fields */}
              {formData.role === 'buyer' ? (
                <div className="space-y-4 p-4 rounded-lg bg-green-50 border border-green-200">
                  <h3 className="font-semibold text-green-800 flex items-center gap-2">
                    <ShoppingBag className="h-4 w-4" /> Buyer Details
                  </h3>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="location"
                        placeholder="Your city/town"
                        value={formData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        className="pl-10"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Business Name (Optional)</Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="businessName"
                        placeholder="Your business name"
                        value={formData.businessName}
                        onChange={(e) => handleInputChange('businessName', e.target.value)}
                        className="pl-10"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="preferredProducts">Preferred Products</Label>
                    <Input
                      id="preferredProducts"
                      placeholder="e.g., Broilers, Eggs, Chicks"
                      value={formData.preferredProducts}
                      onChange={(e) => handleInputChange('preferredProducts', e.target.value)}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4 p-4 rounded-lg bg-amber-50 border border-amber-200">
                  <h3 className="font-semibold text-amber-800 flex items-center gap-2">
                    <Tractor className="h-4 w-4" /> Seller / Farm Details
                  </h3>
                  <div className="space-y-2">
                    <Label htmlFor="farmName">Farm Name</Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="farmName"
                        placeholder="Your farm name"
                        value={formData.farmName}
                        onChange={(e) => handleInputChange('farmName', e.target.value)}
                        className="pl-10"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="farmLocation">Farm Location</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="farmLocation"
                        placeholder="Farm address/location"
                        value={formData.farmLocation}
                        onChange={(e) => handleInputChange('farmLocation', e.target.value)}
                        className="pl-10"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="farmSize">Farm Size</Label>
                      <Input
                        id="farmSize"
                        placeholder="e.g., 5000 birds"
                        value={formData.farmSize}
                        onChange={(e) => handleInputChange('farmSize', e.target.value)}
                        disabled={isSubmitting}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="experienceYears">Experience (years)</Label>
                      <Input
                        id="experienceYears"
                        type="number"
                        placeholder="e.g., 5"
                        value={formData.experienceYears}
                        onChange={(e) => handleInputChange('experienceYears', e.target.value)}
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="poultryTypes">Poultry Types</Label>
                    <Input
                      id="poultryTypes"
                      placeholder="e.g., Broilers, Layers, Desi"
                      value={formData.poultryTypes}
                      onChange={(e) => handleInputChange('poultryTypes', e.target.value)}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password (min 6 characters)"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="pl-10 pr-10"
                    required
                    minLength={6}
                    disabled={isSubmitting}
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className="pl-10 pr-10"
                    required
                    disabled={isSubmitting}
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={formData.agreeToTerms}
                  onCheckedChange={(checked) => handleInputChange('agreeToTerms', checked)}
                  disabled={isSubmitting}
                />
                <Label htmlFor="terms" className="text-sm">
                  I agree to the{' '}
                  <Link to="/terms" className="text-green-600 hover:text-green-700">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-green-600 hover:text-green-700">
                    Privacy Policy
                  </Link>
                </Label>
              </div>

              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={!formData.agreeToTerms || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/signin" className="text-green-600 hover:text-green-700 font-medium">
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignUp;
