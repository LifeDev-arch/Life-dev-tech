import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getPublishedPageBySlug } from '@/src/data/public';
import type { PageWithContent } from '@/src/types';

export function DynamicPage() {
  const { slug } = useParams<{ slug: string }>();
  const [page, setPage] = useState<PageWithContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadPage = async () => {
      if (!slug) return;
      
      try {
        setLoading(true);
        const data = await getPublishedPageBySlug(slug);
        if (data) {
          setPage(data);
        } else {
          setError(true);
        }
      } catch (err) {
        setError(true);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadPage();
  }, [slug]);

  if (loading) {
    return (
      <div className="section-container py-20">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          Carregando...
        </div>
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="section-container py-20">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Página não encontrada</h1>
          <p className="text-gray-600">A página que você está procurando não existe ou não está publicada.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="section-container py-20">
      <article className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{page.title}</h1>
          {page.summary && (
            <p className="text-xl text-gray-600">{page.summary}</p>
          )}
        </header>
        
        <div 
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: page.content ?? '' }}
        />
      </article>
    </div>
  );
}