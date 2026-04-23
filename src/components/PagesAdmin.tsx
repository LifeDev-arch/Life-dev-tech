import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Eye, MoreHorizontal } from 'lucide-react';
import { getPages, updatePage, deletePage } from '@/src/data/admin';
import type { Page } from '@/src/types';
import { Button } from './ui/Button';
import { cn } from '@/src/lib/utils';

export function PagesAdmin() {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadPages();
  }, []);

  const loadPages = async () => {
    try {
      setLoading(true);
      const data = await getPages();
      setPages(data);
    } catch (err) {
      setError('Erro ao carregar páginas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (pageId: string, newStatus: 'draft' | 'published' | 'archived') => {
    try {
      await updatePage(pageId, { status: newStatus });
      await loadPages(); // Recarregar lista
    } catch (err) {
      setError('Erro ao atualizar status');
      console.error(err);
    }
  };

  const handleDelete = async (pageId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta página?')) return;
    
    try {
      await deletePage(pageId);
      await loadPages();
    } catch (err) {
      setError('Erro ao excluir página');
      console.error(err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'text-green-600 bg-green-100';
      case 'draft': return 'text-yellow-600 bg-yellow-100';
      case 'archived': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'published': return 'Publicado';
      case 'draft': return 'Rascunho';
      case 'archived': return 'Arquivado';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Gestão de Páginas</h1>
            <p className="text-gray-500">Gerencie o conteúdo das páginas do site</p>
          </div>
          <Button disabled>
            <Plus className="w-4 h-4 mr-2" />
            Nova Página
          </Button>
        </div>
        <div className="admin-card p-8 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          Carregando páginas...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Gestão de Páginas</h1>
            <p className="text-gray-500">Gerencie o conteúdo das páginas do site</p>
          </div>
          <Button onClick={() => navigate('/admin/conteudo/paginas/nova')}>
            <Plus className="w-4 h-4 mr-2" />
            Nova Página
          </Button>
        </div>
        <div className="admin-card p-8 text-center text-red-600">
          {error}
          <br />
          <button 
            onClick={loadPages}
            className="mt-4 text-primary hover:underline"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestão de Páginas</h1>
          <p className="text-gray-500">Gerencie o conteúdo das páginas do site</p>
        </div>
        <Button onClick={() => navigate('/admin/conteudo/paginas/nova')}>
          <Plus className="w-4 h-4 mr-2" />
          Nova Página
        </Button>
      </div>

      {pages.length === 0 ? (
        <div className="admin-card p-12 text-center">
          <div className="text-gray-400 mb-4">
            <Plus className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">Nenhuma página criada ainda</h3>
            <p className="text-sm">Comece criando sua primeira página para o site.</p>
          </div>
          <Button onClick={() => navigate('/admin/conteudo/paginas/nova')}>
            <Plus className="w-4 h-4 mr-2" />
            Criar Primeira Página
          </Button>
        </div>
      ) : (
        <div className="admin-card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-surface-border">
                <tr>
                  <th className="text-left p-4 font-bold text-sm uppercase tracking-wider">Título</th>
                  <th className="text-left p-4 font-bold text-sm uppercase tracking-wider">Slug</th>
                  <th className="text-left p-4 font-bold text-sm uppercase tracking-wider">Status</th>
                  <th className="text-left p-4 font-bold text-sm uppercase tracking-wider">Atualizado</th>
                  <th className="text-right p-4 font-bold text-sm uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody>
                {pages.map((page) => (
                  <tr key={page.id} className="border-b border-surface-low hover:bg-surface-low/50">
                    <td className="p-4">
                      <div className="font-medium">{page.title}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">{page.summary}</div>
                    </td>
                    <td className="p-4 text-sm text-gray-600">/{page.slug}</td>
                    <td className="p-4">
                      <span className={cn(
                        "px-2 py-1 rounded-full text-xs font-bold uppercase",
                        getStatusColor(page.status)
                      )}>
                        {getStatusLabel(page.status)}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                      {new Date(page.updated_at).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end space-x-2">
                        {page.status === 'published' && (
                          <button
                            onClick={() => window.open(`/${page.slug}`, '_blank')}
                            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                            title="Visualizar no site"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => navigate(`/admin/conteudo/paginas/${page.id}/editar`)}
                          className="p-1 text-gray-400 hover:text-primary transition-colors"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <div className="relative group">
                          <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                          <div className="absolute right-0 mt-1 w-32 bg-white border border-surface-border rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                            {page.status !== 'published' && (
                              <button
                                onClick={() => handleStatusChange(page.id, 'published')}
                                className="w-full text-left px-3 py-2 text-sm hover:bg-surface-low"
                              >
                                Publicar
                              </button>
                            )}
                            {page.status !== 'draft' && (
                              <button
                                onClick={() => handleStatusChange(page.id, 'draft')}
                                className="w-full text-left px-3 py-2 text-sm hover:bg-surface-low"
                              >
                                Rascunho
                              </button>
                            )}
                            {page.status !== 'archived' && (
                              <button
                                onClick={() => handleStatusChange(page.id, 'archived')}
                                className="w-full text-left px-3 py-2 text-sm hover:bg-surface-low"
                              >
                                Arquivar
                              </button>
                            )}
                            <hr className="border-surface-border" />
                            <button
                              onClick={() => handleDelete(page.id)}
                              className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                            >
                              Excluir
                            </button>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}