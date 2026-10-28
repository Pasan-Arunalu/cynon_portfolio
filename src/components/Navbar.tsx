import { useEffect, useState } from 'react';
import { Link } from 'react-scroll';
import { Menu, X, Moon, Sun } from 'lucide-react';
import CynonLogoLightTheme from '../assets/cynon_black_icon.png';
import CynonLogoDarkTheme from '../assets/cynon_white_icon.png';

interface NavItem {
  name: string;
  to: string;
}

const navLinks: NavItem[] = [
  { name: 'Home', to: 'home' },
  { name: 'About', to: 'about' },
  { name: 'Services', to: 'services' },
  { name: 'Products', to: 'products' },
  { name: 'Contact', to: 'contact' },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isDark, setIsDark] = useState<boolean>(false);

  useEffect(() => {
    const root = document.documentElement;

    if (root.classList.contains('dark')) {
      setIsDark(true);
      return;
    }

    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      root.classList.add('dark');
      setIsDark(true);
    }
  }, []);

  const toggleTheme = (): void => {
    const root = document.documentElement;

    if (isDark) {
      root.classList.remove('dark');
      setIsDark(false);
    } else {
      root.classList.add('dark');
      setIsDark(true);
    }
  };

  const closeMobileMenu = (): void => {
    setIsOpen(false);
  };

  const baseLinkClasses =
    'font-medium cursor-pointer transition-colors duration-200';

  // Important utilities ensure the active color overrides the default text color.
  const activeLinkClasses =
    '!text-brand-accent dark:!text-brand-light';

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-theme-border bg-theme-surface/80 backdrop-blur-md transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Brand */}
          <a
            href="#home"
            aria-label="Cynon home"
            className="flex shrink-0 items-center gap-2 text-xl text-theme-text-primary"
          >
            <img
              src={isDark ? CynonLogoDarkTheme : CynonLogoLightTheme}
              alt=""
              className="h-8 w-auto"
            />

            <span>Cynon</span>
          </a>

          {/* Desktop navigation */}
          <div className="hidden items-center space-x-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                spy
                smooth
                offset={-80}
                duration={500}
                activeClass={activeLinkClasses}
                className={`${baseLinkClasses} text-theme-text-primary hover:text-brand-accent dark:hover:text-brand-light`}
              >
                {link.name}
              </Link>
            ))}

            <button
              type="button"
              onClick={toggleTheme}
              className="cursor-pointer rounded-full p-2 text-theme-text-primary transition-colors hover:bg-theme-surface-hover"
              aria-label={
                isDark ? 'Switch to light mode' : 'Switch to dark mode'
              }
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>

          {/* Mobile controls */}
          <div className="flex items-center space-x-3 md:hidden">
            <button
              type="button"
              onClick={toggleTheme}
              className="rounded-full p-2 text-theme-text-primary transition-colors hover:bg-theme-surface-hover"
              aria-label={
                isDark ? 'Switch to light mode' : 'Switch to dark mode'
              }
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <button
              type="button"
              onClick={() => setIsOpen((previous) => !previous)}
              className="text-theme-text-primary transition-colors hover:text-brand-accent"
              aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isOpen}
              aria-controls="mobile-navigation"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile navigation */}
      {isOpen && (
        <div
          id="mobile-navigation"
          className="border-b border-theme-border bg-theme-surface md:hidden"
        >
          <div className="space-y-1 px-4 pb-4 pt-2">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                spy
                smooth
                offset={-80}
                duration={500}
                activeClass={activeLinkClasses}
                onClick={closeMobileMenu}
                className={`${baseLinkClasses} block rounded-md px-3 py-3 text-base text-theme-text-secondary hover:bg-theme-surface-hover hover:text-brand-accent dark:hover:text-brand-light`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};