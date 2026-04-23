import { Outlet, Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight, Github } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/src/components/ui/Button';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';

export function PublicLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { pathname } = useLocation();

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Serviços', href: '/servicos' },
    { name: 'Soluções', href: '/solucoes' },
    { name: 'Portfólio', href: '/portfolio' },
    { name: 'Planos', href: '/planos' },
    { name: 'Sobre', href: '/sobre' },
    { name: 'Blog', href: '/blog' },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-surface-border">
        <div className="section-container h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center transform rotate-3">
              <span className="text-white font-display font-bold text-xl -rotate-3">LD</span>
            </div>
            <span className="text-xl font-display font-bold tracking-tight hidden sm:block">
              Life Dev
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname === link.href ? "text-primary" : "text-gray-600"
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <Link to="/contato" className="hidden sm:block">
              <Button size="sm" variant="outline">Contato</Button>
            </Link>
            <Link to="/orcamento">
              <Button size="sm" className="hidden lg:flex group">
                Orçamento 
                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            
            <button 
              className="lg:hidden p-2 text-dark"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white border-b border-surface-border overflow-hidden"
            >
              <div className="px-4 py-6 space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-lg font-medium text-dark hover:text-primary"
                  >
                    {link.name}
                  </Link>
                ))}
                <div className="pt-4 flex flex-col space-y-4">
                  <Link to="/contato" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" className="w-full">Contato</Button>
                  </Link>
                  <Link to="/orcamento" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full">Pedir Orçamento</Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-dark text-white pt-20 pb-10">
        <div className="section-container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center transform rotate-3">
                  <span className="text-white font-display font-bold text-xl -rotate-3">LD</span>
                </div>
                <span className="text-xl font-display font-bold tracking-tight text-white">
                  Life Dev
                </span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Transformamos desafios complexos em soluções digitais extraordinárias. Especialistas em sites premium, sistemas sob medida e performance digital.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="p-2 bg-white/5 rounded-lg hover:bg-primary transition-colors">
                  <Github className="w-5 h-5" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-display font-bold mb-6 text-lg">Serviços</h4>
              <ul className="space-y-4 text-gray-400 text-sm">
                <li><Link to="/servicos/sites-institucionais" className="hover:text-primary transition-colors">Sites Institucionais</Link></li>
                <li><Link to="/servicos/ecommerce" className="hover:text-primary transition-colors">E-commerce de Alta Performance</Link></li>
                <li><Link to="/servicos/sistemas-web" className="hover:text-primary transition-colors">Sistemas Web Customizados</Link></li>
                <li><Link to="/servicos/aplicativos" className="hover:text-primary transition-colors">Aplicativos Mobile</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-display font-bold mb-6 text-lg">Plataforma</h4>
              <ul className="space-y-4 text-gray-400 text-sm">
                <li><Link to="/portfolio" className="hover:text-primary transition-colors">Portfólio</Link></li>
                <li><Link to="/cases" className="hover:text-primary transition-colors">Cases de Estudo</Link></li>
                <li><Link to="/processo" className="hover:text-primary transition-colors">Nosso Processo</Link></li>
                <li><Link to="/planos" className="hover:text-primary transition-colors">Planos e Preços</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-display font-bold mb-6 text-lg">Legal</h4>
              <ul className="space-y-4 text-gray-400 text-sm">
                <li><Link to="/legal/privacidade" className="hover:text-primary transition-colors">Privacidade</Link></li>
                <li><Link to="/legal/termos" className="hover:text-primary transition-colors">Termos de Uso</Link></li>
                <li><Link to="/legal/cookies" className="hover:text-primary transition-colors">Cookies</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-10 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <p className="text-gray-500 text-xs">
              © {new Date().getFullYear()} Life Dev | Sites & Sistemas. Todos os direitos reservados.
            </p>
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>Sistemas Online</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
