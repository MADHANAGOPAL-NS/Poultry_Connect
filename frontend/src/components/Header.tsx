
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Bell, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold tracking-tight text-green-700">Poultry Connect</span>
            </Link>
          </div>

          <nav className="hidden md:flex space-x-8">
            <Link to="/dashboard" className="text-gray-600 hover:text-green-600 transition-colors">Dashboard</Link>
            <a href="#monitoring" className="text-gray-600 hover:text-green-600 transition-colors">Monitoring</a>
            <a href="#marketplace" className="text-gray-600 hover:text-green-600 transition-colors">Marketplace</a>
            <a href="#alerts" className="text-gray-600 hover:text-green-600 transition-colors">Alerts</a>
            <a href="#pricing" className="text-gray-600 hover:text-green-600 transition-colors">Pricing</a>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Button variant="ghost" size="sm">
                  <Bell className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="sm">
                  <User className="h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link to="/signin">
                  <Button variant="outline" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-green-600 hover:bg-green-700">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-2">
              <Link to="/dashboard" className="px-3 py-2 text-gray-600 hover:text-green-600">Dashboard</Link>
              <a href="#monitoring" className="px-3 py-2 text-gray-600 hover:text-green-600">Monitoring</a>
              <a href="#marketplace" className="px-3 py-2 text-gray-600 hover:text-green-600">Marketplace</a>
              <a href="#alerts" className="px-3 py-2 text-gray-600 hover:text-green-600">Alerts</a>
              <a href="#pricing" className="px-3 py-2 text-gray-600 hover:text-green-600">Pricing</a>
              <div className="flex flex-col space-y-2 mt-4 px-3">
                {user ? (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={handleSignOut}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                ) : (
                  <>
                    <Link to="/signin">
                      <Button variant="outline" size="sm" className="w-full">
                        Sign In
                      </Button>
                    </Link>
                    <Link to="/signup">
                      <Button className="bg-green-600 hover:bg-green-700 w-full">
                        Get Started
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
