import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Heart, Menu, X, User, LogOut, Plus, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { hasRole, role, loading } = useUserRole();
  
  console.log('Navigation component - user:', user?.id, 'role:', role, 'loading:', loading, 'hasRole(superuser):', hasRole('superuser'));

  const navItems = [
    { href: '/', label: 'Artworks' },
    { href: '/artists', label: 'Artists' },
    { href: '/exhibitions', label: 'Exhibitions' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  const isActive = (href: string) => {
    if (href === '/' && location.pathname === '/') return true;
    if (href !== '/' && location.pathname.startsWith(href)) return true;
    return false;
  };

  return (
    <nav className="border-b border-gallery-border bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-light tracking-wider text-gallery-text hover:text-gallery-hover transition-colors">
            ARTELIER
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? 'text-gallery-text border-b border-gallery-text'
                    : 'text-gallery-accent hover:text-gallery-text'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Search className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Heart className="h-4 w-4" />
            </Button>
            {user ? (
              <div className="flex items-center gap-2">
                {hasRole('superuser') && (
                  <Button variant="ghost" size="sm" asChild className="flex items-center gap-2 text-yellow-600">
                    <Link to="/dashboard">
                      <Crown className="w-4 h-4" />
                      Dashboard
                    </Link>
                  </Button>
                )}
                <Button variant="outline" size="sm" asChild className="flex items-center gap-2">
                  <Link to="/add-artwork">
                    <Plus className="w-4 h-4" />
                    Add Artwork
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" asChild className="flex items-center gap-2">
                  <Link to="/artist-profile">
                    <User className="w-4 h-4" />
                    {user.email?.split('@')[0]}
                  </Link>
                </Button>
                <Button variant="link" size="sm" onClick={signOut} className="flex items-center gap-1">
                  <LogOut className="w-3 h-3" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button variant="link" className="text-sm" asChild>
                <Link to="/auth">Sign In</Link>
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gallery-border">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`block px-3 py-2 text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? 'text-gallery-text bg-gallery-accent/10'
                    : 'text-gallery-accent hover:text-gallery-text hover:bg-gallery-accent/5'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="border-t border-gallery-border pt-3 mt-3">
              {user ? (
                <div className="space-y-2">
                  {hasRole('superuser') && (
                    <Button variant="ghost" asChild className="w-full justify-start flex items-center gap-2 text-yellow-600">
                      <Link to="/dashboard">
                        <Crown className="w-4 h-4" />
                        Dashboard
                      </Link>
                    </Button>
                  )}
                  <Button variant="outline" asChild className="w-full justify-start flex items-center gap-2">
                    <Link to="/add-artwork">
                      <Plus className="w-4 h-4" />
                      Add Artwork
                    </Link>
                  </Button>
                  <Button variant="ghost" asChild className="w-full justify-start flex items-center gap-2">
                    <Link to="/artist-profile">
                      <User className="w-4 h-4" />
                      {user.email?.split('@')[0]}
                    </Link>
                  </Button>
                  <Button variant="link" onClick={signOut} className="w-full justify-start flex items-center gap-1">
                    <LogOut className="w-3 h-3" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Button variant="link" className="text-sm w-full justify-start" asChild>
                  <Link to="/auth">Sign In</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;