import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { HiMenu, HiX, HiSun, HiMoon } from 'react-icons/hi';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() =>
    document.documentElement.classList.contains('dark')
  );
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // On mount: check for token
  useEffect(() => {
    const token = localStorage.getItem('token'); // Adjust key name if needed
    setIsLoggedIn(!!token);
  }, []);

  // Handle dark mode toggle
  const toggleDarkMode = () => {
    document.documentElement.classList.toggle('dark');
    setDarkMode(!darkMode);
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Chat', path: '/chat' },
    { name: 'Notes', path: '/notes' },
    { name: 'News', path: '/news' },
    { name: 'Todo', path: '/todo' },
    { name: 'Resume', path: '/resume' },
    { name: 'Search', path: '/search' },
  ];

  return (
    <header className="fixed w-full top-0 z-50 bg-white dark:bg-gray-900 shadow-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <span className="text-2xl transition-transform duration-300 group-hover:rotate-12">🌟</span>
            <span className="text-xl font-bold text-gray-800 dark:text-white tracking-wide">IntelliHelper</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-gray-700 dark:text-gray-300">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className="hover:text-teal-600 dark:hover:text-teal-400 transition"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right-side actions */}
          <div className="hidden md:flex items-center space-x-3 text-sm">
            <button
              onClick={toggleDarkMode}
              className="text-xl text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 transition"
            >
              {darkMode ? <HiSun /> : <HiMoon />}
            </button>

            {isLoggedIn ? (
              <Link
                to="/profile"
                className="text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 transition"
              >
                Profile
              </Link>
            ) : (
              <>
                <Link
                  to="/auth/login"
                  className="text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 transition"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-teal-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-teal-700 transition"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-2xl text-gray-800 dark:text-white">
              {mobileMenuOpen ? <HiX /> : <HiMenu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-2 pb-4 space-y-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-2 py-1 hover:text-teal-600 dark:hover:text-teal-400"
              >
                {link.name}
              </Link>
            ))}
            {isLoggedIn ? (
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-2 py-1 hover:text-teal-600 dark:hover:text-teal-400"
              >
                Profile
              </Link>
            ) : (
              <>
                <Link
                  to="/auth/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-2 py-1 hover:text-teal-600 dark:hover:text-teal-400"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block bg-teal-600 text-white text-center px-4 py-2 rounded-md mx-2"
                >
                  Sign Up
                </Link>
              </>
            )}
            {/* Dark Mode Toggle */}
            <div className="flex justify-center pt-2">
              <button
                onClick={toggleDarkMode}
                className="text-xl text-gray-800 dark:text-gray-300"
              >
                {darkMode ? <HiSun /> : <HiMoon />}
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
