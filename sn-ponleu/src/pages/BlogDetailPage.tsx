import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { graphqlRequest } from '../services/api.ts';
import { BlogPost } from '../types/index.ts';
import { ArrowLeft, Clock, Eye, Calendar, User, Share2, Check, Copy } from 'lucide-react';

export const BlogDetailPage: React.FC<{ slug: string }> = ({ slug }) => {
  const { lang, t, navigate, toast } = useApp();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [related, setRelated] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadPost() {
      try {
        const query = `
          query GetPost($slug: String!) {
            getBlogPostBySlug(slug: $slug) {
              id category_id category_name title_en title_km slug cover_image summary_en summary_km content_en content_km author_name read_time_minutes views_count published_at tags
            }
            getBlogPosts(onlyPublished: true) {
              id title_en title_km slug cover_image read_time_minutes
            }
          }
        `;
        const res = await graphqlRequest(query, { slug });
        setPost(res.getBlogPostBySlug || null);
        setRelated((res.getBlogPosts || []).filter((b: BlogPost) => b.slug !== slug).slice(0, 2));
      } catch (err) {
        console.error('Failed to load blog detail:', err);
      } finally {
        setLoading(false);
      }
    }
    loadPost();
  }, [slug]);

  if (loading) {
    return <div className="max-w-3xl mx-auto py-16 text-center text-slate-500">Loading tutorial...</div>;
  }

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Article not found</h2>
        <button onClick={() => navigate('blog')} className="px-4 py-2 text-xs font-semibold text-white bg-[#1677FF] rounded-md cursor-pointer">
          Back to Tutorials
        </button>
      </div>
    );
  }

  const title = lang === 'km' ? post.title_km : post.title_en;
  const content = lang === 'km' ? post.content_km : post.content_en;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast('Link copied to clipboard!', 'info');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Back Link */}
      <button
        onClick={() => navigate('blog')}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{t.btn_back}</span>
      </button>

      {/* Article Header */}
      <header className="space-y-4">
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-mono">
          <span className="uppercase text-[#42ADF5] font-semibold">{post.category_name || 'ICT Tutorial'}</span>
          <span aria-hidden="true">·</span>
          <span>{post.published_at}</span>
          <span aria-hidden="true">·</span>
          <span>{post.read_time_minutes} {t.blog_read_time}</span>
          <span aria-hidden="true">·</span>
          <span className="tabular-nums">{post.views_count} {t.blog_views}</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white leading-[1.2] font-display text-balance">
          {title}
        </h1>

        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#1677FF] text-white flex items-center justify-center font-bold text-[10px]">
              SP
            </span>
            <span className="font-medium text-slate-700 dark:text-slate-300">{post.author_name}</span>
          </div>
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-slate-700 dark:text-slate-300 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Share Tutorial'}</span>
          </button>
        </div>
      </header>

      {/* Featured Cover Image */}
      <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md">
        <img
          src={post.cover_image}
          alt={title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Article Body Content */}
      <div className="bg-white dark:bg-[#0B1220] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-10 shadow-sm">
        <div className="prose dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 text-base leading-relaxed space-y-4 whitespace-pre-line font-sans">
          {content}
        </div>

        {post.tags && post.tags.length > 0 && (
          <div className="pt-8 mt-8 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Tags:</span>
            {post.tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-xs font-mono text-slate-600 dark:text-slate-300"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Related Tutorials */}
      {related.length > 0 && (
        <section className="pt-8 border-t border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">
            Recommended Walkthroughs
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {related.map((rel) => (
              <div
                key={rel.id}
                onClick={() => navigate('blog-detail', rel.slug)}
                className="p-5 bg-white dark:bg-[#0B1220] border border-slate-200 dark:border-slate-800 rounded-xl cursor-pointer hover:border-[#42ADF5]/50 transition-colors space-y-2 flex flex-col justify-between"
              >
                <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                  {lang === 'km' ? rel.title_km : rel.title_en}
                </h4>
                <div className="text-xs text-slate-400 font-mono">
                  {rel.read_time_minutes} min read →
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </article>
  );
};
