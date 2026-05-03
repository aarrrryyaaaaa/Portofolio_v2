import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import { useLanguage } from '../lib/LanguageContext';

const SectionWrapper = ({ children, delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay }}
    >
        {children}
    </motion.div>
);

export default function Blog({ isEmbedded = false }) {
    const { t } = useLanguage();
    const [posts, setPosts] = useState([]);
    const [selectedPost, setSelectedPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const { data, error } = await supabase
                .from('blogs')
                .select('*')
                .eq('is_published', true)
                .order('created_at', { ascending: false });

            if (data) setPosts(data);
        } catch (error) {
            console.error("Error fetching blog:", error);
        } finally {
            setLoading(false);
        }
    };

    const Content = () => (
        <div className={isEmbedded ? "" : "container mx-auto px-6"}>
            {selectedPost ? (
                // Single Post View
                <motion.div
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                    className="max-w-4xl mx-auto"
                >
                    <button
                        onClick={() => setSelectedPost(null)}
                        className="mb-8 flex items-center gap-2 text-cyan-400 hover:text-white transition-colors"
                    >
                        ← {t.blog_back}
                    </button>

                    <div className="bg-gray-900/50 border border-gray-800 rounded-3xl overflow-hidden p-8 md:p-12">
                        <h1 className="text-3xl md:text-5xl font-bold text-white mb-6">{selectedPost.title}</h1>
                        <div className="text-gray-500 text-sm mb-8">{new Date(selectedPost.created_at).toLocaleDateString()}</div>

                        {selectedPost.image_url && (
                            <img src={selectedPost.image_url} alt={selectedPost.title} className="w-full h-96 object-cover rounded-2xl mb-10" />
                        )}

                        <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed text-lg whitespace-pre-wrap">
                            {selectedPost.content}
                        </div>
                    </div>
                </motion.div>
            ) : (
                // List View
                <>
                    {!isEmbedded && (
                        <SectionWrapper>
                            <div className="text-center mb-16">
                                <h2 className="text-4xl font-bold text-white mb-2">{t.blog_title}</h2>
                                <p className="text-gray-500">{t.blog_subtitle}</p>
                            </div>
                        </SectionWrapper>
                    )}

                    <div className={isEmbedded ? "space-y-4" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"}>
                        {posts.map((post, index) => (
                            <SectionWrapper key={post.id} delay={index * 0.1}>
                                <div
                                    onClick={() => setSelectedPost(post)}
                                    className={`group cursor-pointer bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-cyan-500/50 transition-all hover:shadow-cyan-500/10 hover:shadow-xl flex ${isEmbedded ? 'flex-row h-32' : 'flex-col h-full'}`}
                                >
                                    <div className={`${isEmbedded ? 'w-32' : 'h-48'} overflow-hidden relative shrink-0`}>
                                        {post.image_url ? (
                                            <img src={post.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        ) : (
                                            <div className="w-full h-full bg-gray-800 flex items-center justify-center text-gray-600">No Image</div>
                                        )}
                                    </div>
                                    <div className="p-4 flex-1 flex flex-col justify-center">
                                        <h3 className={`${isEmbedded ? 'text-sm' : 'text-xl'} font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors line-clamp-2`}>{post.title}</h3>
                                        {!isEmbedded && <p className="text-gray-400 text-sm mb-4 flex-1 line-clamp-3">{post.excerpt}</p>}
                                        <span className="text-cyan-500 text-[10px] font-bold uppercase tracking-widest mt-auto">{t.blog_read_more} ↗</span>
                                    </div>
                                </div>
                            </SectionWrapper>
                        ))}
                    </div>
                </>
            )}
        </div>
    );

    if (isEmbedded) return <Content />;

    return (
        <section id="blog" className="relative w-full min-h-screen py-20 bg-black/50">
            <Content />
        </section>
    );
}
