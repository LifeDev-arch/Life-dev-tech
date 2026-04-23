import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Settings, 
  BarChart3, 
  Layers, 
  LogOut,
  Bell,
  Search,
  ChevronRight,
  Database,
  Image as ImageIcon,
  MessageSquare,
  CreditCard,
  Briefcase
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/src/lib/supabase';
import { cn } from '@/src/lib/utils';

export function AdminLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { label: 'Overview', icon: LayoutDashboard, href: '/admin/dashboard', group: 'Geral' },
    { label: 'Páginas', icon: Layers, href: '/admin/conteudo/paginas', group: 'Conteúdo' },
    { label: 'Serviços', icon: Briefcase, href: '/admin/conteudo/servicos', group: 'Conteúdo' },
    { label: 'Blog', icon: FileText, href: '/admin/conteudo/blog', group: 'Conteúdo' },
    { label: 'Leads', icon: Users, href: '/admin/crm/leads', group: 'Comercial' },
    { label: 'Vendas/Pedidos', icon: CreditCard, href: '/admin/financeiro/orders', group: 'Financeiro' },
    { label: 'Mídia', icon: ImageIcon, href: '/admin/midia/files', group: 'Infra' },
    { label: 'Logs', icon: Database, href: '/admin/observabilidade/audit-logs', group: 'Infra' },
    { label: 'Configurações', icon: Settings, href: '/admin/config/settings', group: 'Config' },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  const menuGroups = Array.from(new Set(menuItems.map(item => item.group)));

  return (
    <div className="flex h-screen bg-surface-low overflow-hidden">
      {/* Sidebar */}
      <aside className={cn(
        "bg-dark text-white transition-all duration-300 flex flex-col",
        isSidebarOpen ? "w-64" : "w-20"
      )}>
        <div className="h-20 flex items-center px-6 border-b border-white/5">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="font-bold">L</span>
          </div>
          {isSidebarOpen && (
            <span className="ml-3 font-display font-bold tracking-tight">Life Admin</span>
          )}
        </div>

        <nav className="flex-grow py-6 overflow-y-auto custom-scrollbar">
          {menuGroups.map(group => (
            <div key={group} className="mb-6">
              {isSidebarOpen && (
                <p className="px-6 text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2">
                  {group}
                </p>
              )}
              <div className="space-y-1">
                {menuItems.filter(item => item.group === group).map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={cn(
                      "flex items-center px-6 py-2.5 text-sm font-medium transition-all group",
                      pathname.startsWith(item.href) 
                        ? "text-white bg-primary/10 border-r-4 border-primary" 
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <item.icon className={cn("w-5 h-5", isSidebarOpen ? "mr-4" : "mx-auto")} />
                    {isSidebarOpen && <span>{item.label}</span>}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-6 border-t border-white/5">
          <button 
            onClick={handleLogout}
            className="flex items-center text-gray-400 hover:text-red-400 transition-colors w-full group"
          >
            <LogOut className={cn("w-5 h-5", isSidebarOpen ? "mr-4" : "mx-auto")} />
            {isSidebarOpen && <span>Sair</span>}
          </button>
        </div>
      </aside>

      {/* Main Column */}
      <div className="flex-grow flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-20 bg-white border-b border-surface-border flex items-center justify-between px-8">
          <div className="flex items-center flex-grow max-w-xl">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Buscar em todo o sistema..." 
                className="w-full pl-10 pr-4 py-2 bg-surface-low border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <button className="relative p-2 text-gray-500 hover:bg-surface-low rounded-lg transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-white" />
            </button>
            <div className="h-8 w-[1px] bg-surface-border" />
            <div className="flex items-center space-x-3 group cursor-pointer">
              <div className="text-right">
                <p className="text-xs font-bold text-dark">Admin Master</p>
                <p className="text-[10px] text-gray-500">admin@lifedev.com.br</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-surface-low border border-surface-border flex items-center justify-center font-bold text-primary group-hover:border-primary transition-all">
                AM
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-grow overflow-y-auto p-8 bg-surface-low/50">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
