import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft, Eye } from 'lucide-react';
import { createPage, getPageById, updatePage } from '@/src/data/admin';
import type { Page } from '@/src/types';
import { Button } from './ui/Button';
import { Input } from './ui/Input';

export function PageForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    status: 'draft' as 'draft' | 'published' | 'archived'
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isEditing) {
      loadPage();
    }
  }, [id]);

  const loadPage = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const page = await getPageById(id);
      setFormData({
        title: page.title,
        slug: page.slug,
        excerpt: page.excerpt,
        content: page.content,
        status: page.status
      });
    } catch (err) {
      setError('Erro ao carregar página');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Auto-generate slug from title if not editing
    if (field === 'title' && !isEditing) {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setFormData(prev => ({ ...prev, slug }));
    }
  };

  const handleSubmit = async (e: React.FormEvent, publish = false) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.slug.trim()) {
      setError('Título e slug são obrigatórios');
      return;
    }

    try {
      setSaving(true);
      setError(null);
      
      const dataToSave = {
        ...formData,
        status: publish ? 'published' : formData.status
      };

      if (isEditing && id) {
        await updatePage(id, dataToSave);
      } else {
        await createPage(dataToSave);
      }
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/admin/conteudo/paginas');
      }, 1500);
      
    } catch (err) {
      setError('Erro ao salvar página');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate('/admin/conteudo/paginas')}
            className="p-2 hover:bg-surface-low rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold">Carregando...</h1>
          </div>
        </div>
        <div className="admin-card p-8 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate('/admin/conteudo/paginas')}
            className="p-2 hover:bg-surface-low rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold">
              {isEditing ? 'Editar Página' : 'Nova Página'}
            </h1>
            <p className="text-gray-500">
              {isEditing ? 'Atualize o conteúdo da página' : 'Crie uma nova página para o site'}
            </p>
          </div>
        </div>
        
        {isEditing && formData.status === 'published' && (
          <Button
            variant="outline"
            onClick={() => window.open(`/${formData.slug}`, '_blank')}
          >
            <Eye className="w-4 h-4 mr-2" />
            Visualizar
          </Button>
        )}
      </div>

      <form onSubmit={(e) => handleSubmit(e)} className="space-y-6">
        {error && (
          <div className="admin-card p-4 bg-red-50 border-red-200 text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="admin-card p-4 bg-green-50 border-green-200 text-green-700">
            Página salva com sucesso! Redirecionando...
          </div>
        )}

        <div className="admin-card p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Título *</label>
              <Input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Digite o título da página"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Slug *</label>
              <Input
                type="text"
                value={formData.slug}
                onChange={(e) => handleInputChange('slug', e.target.value)}
                placeholder="url-amigavel"
                required
              />
              <p className="text-xs text-gray-500">Será acessível em: /{formData.slug}</p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Descrição Curta</label>
            <Input
              type="text"
              value={formData.excerpt}
              onChange={(e) => handleInputChange('excerpt', e.target.value)}
              placeholder="Breve descrição da página"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Conteúdo</label>
            <textarea
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              placeholder="Conteúdo completo da página (suporta HTML)"
              className="w-full h-64 px-4 py-3 rounded-xl border border-surface-border focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-vertical"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Status</label>
            <select
              value={formData.status}
              onChange={(e) => handleInputChange('status', e.target.value as any)}
              className="w-full h-12 px-4 rounded-xl border border-surface-border focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            >
              <option value="draft">Rascunho</option>
              <option value="published">Publicado</option>
              <option value="archived">Arquivado</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/admin/conteudo/paginas')}
          >
            Cancelar
          </Button>
          
          <div className="flex space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={(e) => handleSubmit(e, false)}
              disabled={saving}
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Salvando...' : 'Salvar Rascunho'}
            </Button>
            
            <Button
              type="button"
              onClick={(e) => handleSubmit(e, true)}
              disabled={saving}
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Publicando...' : 'Salvar e Publicar'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}