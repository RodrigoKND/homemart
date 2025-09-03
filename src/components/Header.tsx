import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { products } from '@/data/products';
import AuthModal from '@/components/AuthModal';
import AddProductForm from './AddProduct';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Inicio', href: '/' },
    { name: 'Catálogo', href: '/catalog' }
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const storedProducts = sessionStorage.getItem('products');
  let productsFromStorage = [];
  try {
    productsFromStorage = storedProducts ? JSON.parse(storedProducts) : [];
  } catch (error) {
    console.error('Error parsing stored products:', error);
    productsFromStorage = [];
  }

  const allProducts = [...products, ...productsFromStorage];
  // Filter products based on search query
  const searchSuggestions = allProducts.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 5);

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const getUserSessionTemp = sessionStorage.getItem('user');
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <div className='flex items-baseline'>
              {/* Logo */}
              <Link to="/" className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xl">H</span>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent">
                  HomeMart
                </span>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex ms-10 items-center">
                <nav className="flex items-center gap-8">
                  {navItems.map((item, index) => (
                    <Link
                      key={index}
                      to={item.href}
                      className={`text-md font-medium transition-colors hover:text-pink-500 ${isActive(item.href) ? 'text-pink-500' : 'text-gray-600'
                        }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                </nav>
              </div>
            </div>

            {/* Search Bar */}
            <div className="hidden lg:flex items-center space-x-4">
              <div className="relative">
                <div className='flex items-center space-x-4'>
                  <Search className="absolute left-7 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="search"
                    placeholder="Buscar productos..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowSuggestions(e.target.value.length > 0);
                    }}
                    onFocus={() => setShowSuggestions(searchQuery.length > 0)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    className="pl-10 w-64 bg-gray-50 border-gray-200 focus:bg-white focus:border-pink-300"
                  />
                  <Button className='bg-pink-500 hover:bg-pink-600 text-white'
                    onClick={() => getUserSessionTemp ? setIsPostModalOpen(true) : setIsLoginModalOpen(true)}
                  >
                    {getUserSessionTemp ? 'Publicar' : 'Iniciar Sesión'}
                  </Button>
                </div>
                {/* Search Suggestions */}
                {showSuggestions && searchSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 z-50">
                    {searchSuggestions.map((product) => (
                      <Link
                        key={product.id}
                        to={`/product/${product.id}`}
                        onClick={() => {
                          setSearchQuery('');
                          setIsMenuOpen(false);
                          setShowSuggestions(false);
                        }}
                        className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-10 h-10 object-cover rounded-lg mr-3"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 line-clamp-1">
                            {product.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {product.brand} • ${product.price}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="lg:hidden py-4 border-t border-gray-100">
              <div className="flex flex-col gap-4 items-start w-full px-4">

                {/* Enlaces de navegación */}
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`w-full text-left text-md font-medium transition-colors hover:text-pink-500 ${isActive(item.href) ? 'text-pink-500' : 'text-gray-600'
                      }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}

                {/* Input de búsqueda y botón */}
                <div className="w-full relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="search"
                    placeholder="Buscar productos..."
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowSuggestions(e.target.value.length > 0);
                    }}
                    className="w-full pl-10 bg-gray-50 border-gray-200 focus:bg-white focus:border-pink-300"
                  />
                  {showSuggestions && searchSuggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 z-50">
                      {searchSuggestions.map((product, index) => (
                        <Link
                          key={index}
                          to={`/product/${product.id}`}
                          onClick={() => {
                            setSearchQuery('');
                            setIsMenuOpen(false);
                            setShowSuggestions(false);
                          }}
                          className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                        >
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-10 h-10 object-cover rounded-lg mr-3"
                          />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 line-clamp-1">
                              {product.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {product.brand} • ${product.price}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* Botón de sesión */}
                {
                  <Button className="w-full bg-pink-500 hover:bg-pink-600 text-white"
                    onClick={() => getUserSessionTemp ? setIsPostModalOpen(true) : setIsLoginModalOpen(true)}
                  >
                    {getUserSessionTemp ? 'Publicar' : 'Iniciar Sesión'}
                  </Button>
                }
              </div>
            </div>

          )}
        </div>
      </header >
      {
        isLoginModalOpen && <AuthModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
      }
      {
        isPostModalOpen && <AddProductForm onClose={() => setIsPostModalOpen(false)} />
      }
    </>
  );
};