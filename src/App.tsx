import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PublicLayout } from './components/layouts/PublicLayout';
import { AdminLayout } from './components/layouts/AdminLayout';
import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { cn } from './lib/utils';
import { Button } from './components/ui/Button';

import { Home as HomeSection, Layers, Briefcase, ChevronRight, CheckCircle2 } from 'lucide-react';
import { LeadCaptureSection } from './components/sections/LeadCaptureSection';

// Public Pages
function Home() {
  return (
    <div className="space-y-32">
      <div className="section-container pt-24 space-y-32">
        <section className="flex flex-col lg:flex-row items-center gap-16">
          {/* ... Hero Content ... */}
          <div className="flex-1 space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-primary/5 border border-primary/10 rounded-full text-primary text-xs font-bold uppercase tracking-widest">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span>Extraordinariamente Digital</span>
            </div>
            <h1 className="text-5xl lg:text-7xl">
              Sistemas que <span className="text-primary italic">evoluem</span> seu negócio.
            </h1>
            <p className="text-gray-600 text-lg lg:text-xl max-w-2xl leading-relaxed">
              Na Life Dev, não criamos apenas sites. Construímos ativos digitais de alta performance, painéis administrativos eficientes e interfaces que encantam.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <a href="#contato-lead">
                <Button className="h-14 px-10 rounded-xl font-bold text-lg hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all active:scale-[0.98]">
                  Iniciar Projeto
                </Button>
              </a>
              <button className="bg-white text-dark border border-surface-border h-14 px-10 rounded-xl font-bold text-lg hover:bg-surface-low transition-all active:scale-[0.98]">
                Ver Portfólio
              </button>
            </div>
          </div>
          <div className="flex-1 w-full max-w-2xl">
            <div className="aspect-square bg-surface-low rounded-[40px] border border-surface-border relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-50" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-white rounded-2xl shadow-2xl border border-surface-border transform group-hover:scale-105 transition-transform duration-500 flex items-center justify-center font-display font-bold text-gray-200 text-8xl select-none">
                HERO
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: 'Sites Premium', desc: 'Interfaces de alto impacto que convertem visitantes em clientes fiéis.' },
            { title: 'Sistemas Internos', desc: 'Dashboards operacionais robustos para gestão completa do seu negócio.' },
            { title: 'UX Research', desc: 'Decisões baseadas em dados e comportamento humano para resultados reais.' },
          ].map((item, i) => (
            <div key={i} className="p-8 bg-white border border-surface-border rounded-3xl hover:border-primary/20 hover:shadow-xl transition-all group">
              <div className="w-14 h-14 bg-surface-low rounded-2xl mb-6 flex items-center justify-center group-hover:bg-primary/5 transition-colors">
                <span className="text-primary font-bold">{i + 1}</span>
              </div>
              <h3 className="text-2xl mb-4">{item.title}</h3>
              <p className="text-gray-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </section>
      </div>

      <LeadCaptureSection />
    </div>
  );
}

function PageNotFound() {
  return (
    <div className="h-[60vh] flex flex-center flex-col items-center justify-center text-center px-4">
      <h1 className="text-9xl text-gray-100 absolute -z-10 select-none">404</h1>
      <h2 className="text-3xl font-display font-bold mb-4">Opa! Nada por aqui.</h2>
      <p className="text-gray-500 mb-8 max-w-md">A página que você está procurando pode ter sido removida ou o link está incorreto.</p>
      <button 
        onClick={() => window.history.back()}
        className="bg-primary text-white h-12 px-8 rounded-xl font-bold"
      >
        Voltar para a Segurança
      </button>
    </div>
  );
}

// Admin Pages
function AdminLogin() {
  return (
    <div className="min-h-screen bg-surface-low flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-[32px] shadow-xl border border-surface-border p-10 space-y-8">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-primary rounded-2xl mx-auto flex items-center justify-center transform rotate-3">
            <span className="text-white font-bold text-xl -rotate-3">LD</span>
          </div>
          <h1 className="text-3xl font-display font-bold text-dark">Portal Admin</h1>
          <p className="text-gray-500 text-sm">Acesse a gestão central da Life Dev.</p>
        </div>
        
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-1">
            <label className="text-sm font-bold text-gray-700 ml-1">E-mail Corporativo</label>
            <input 
              type="email" 
              placeholder="admin@lifedev.com.br"
              className="w-full h-12 px-4 rounded-xl border border-surface-border focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-bold text-gray-700 ml-1">Senha de Acesso</label>
            <input 
              type="password" 
              placeholder="••••••••"
              className="w-full h-12 px-4 rounded-xl border border-surface-border focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
          </div>
          <button className="w-full bg-primary text-white h-12 rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-primary-hover transition-all">
            Entrar no Sistema
          </button>
        </form>
      </div>
    </div>
  );
}

function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl">Dashboard</h1>
        <p className="text-gray-500">Visão geral do ecossistema Life Dev hoje.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Leads Hoje', value: '12', change: '+20%', color: 'text-primary' },
          { label: 'Vendas (Mes)', value: 'R$ 45.200', change: '+5%', color: 'text-green-600' },
          { label: 'Projetos Ativos', value: '8', change: 'Estável', color: 'text-blue-600' },
          { label: 'Visitas Únicas', value: '2.4k', change: '+12%', color: 'text-purple-600' },
        ].map((stat, i) => (
          <div key={i} className="admin-card p-6 space-y-2">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{stat.label}</p>
            <div className="flex items-end justify-between">
              <p className="text-2xl font-display font-bold text-dark">{stat.value}</p>
              <span className={cn("text-xs font-bold", stat.color)}>{stat.change}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 admin-card h-96 flex items-center justify-center text-gray-300 font-display font-bold text-4xl">
          GRÁFICO DE CONVERSÃO
        </div>
        <div className="admin-card p-6">
          <h3 className="font-bold mb-6">Últimos Leads</h3>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-surface-low last:border-0">
                <div>
                  <p className="text-sm font-bold">Cliente Potential {i}</p>
                  <p className="text-[10px] text-gray-400">Interesse em E-commerce</p>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-[10px] font-bold">NOVO</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Surfaces */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/sobre" element={<section className="section-container py-20"><h1>Sobre Nós</h1></section>} />
          <Route path="/servicos" element={<section className="section-container py-20"><h1>Serviços</h1></section>} />
          <Route path="/portfolio" element={<section className="section-container py-20"><h1>Portfólio</h1></section>} />
          <Route path="/blog" element={<section className="section-container py-20"><h1>Blog</h1></section>} />
          <Route path="/contato" element={<section className="section-container py-20"><h1>Contato</h1></section>} />
          <Route path="*" element={<PageNotFound />} />
        </Route>

        {/* Admin Login (Isolated) */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Admin Surfaces (Protected) */}
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/crm/leads" element={<div className="admin-card p-8 font-bold">Gestão de Leads (CRM)</div>} />
          <Route path="/admin/conteudo/paginas" element={<div className="admin-card p-8 font-bold">Gestão de Páginas (CMS)</div>} />
          <Route path="/admin/financeiro/orders" element={<div className="admin-card p-8 font-bold">Financeiro & Pedidos</div>} />
          <Route path="/admin/config/settings" element={<div className="admin-card p-8 font-bold">Configurações do Sistema</div>} />
        </Route>

        {/* Initial Redirects */}
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
