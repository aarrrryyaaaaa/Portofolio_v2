import { useState, useEffect } from 'react';
import { useLanguage } from '../lib/LanguageContext';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import Blog from './Blog';

const SectionWrapper = ({ children, delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.8, delay }}
        className="h-full"
    >
        {children}
    </motion.div>
);

const Avatar = ({ name }) => {
    const initial = name ? name.charAt(0).toUpperCase() : '?';
    const bgColors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500', 'bg-yellow-500'];
    const randomColor = bgColors[name.length % bgColors.length];

    return (
        <div className={`w-10 h-10 rounded-full ${randomColor} flex items-center justify-center text-white font-bold text-sm shadow-lg`}>
            {initial}
        </div>
    );
};

// SVG Icons for Socials
const SocialIcon = ({ href, path, colorClass }) => (
    <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.1, y: -5 }}
        whileTap={{ scale: 0.95 }}
        className={`bg-gray-900/80 p-4 rounded-2xl border border-white/10 ${colorClass} transition-colors backdrop-blur-md shadow-lg group`}
    >
        <svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 group-hover:text-white transition-colors">
            {path}
        </svg>
    </motion.a>
);

export default function Contact() {
    const { t } = useLanguage();
    const [comments, setComments] = useState([]);

    // Comment Form State
    const [name, setName] = useState('');
    const [msg, setMsg] = useState('');

    // Contact Form State
    const [contactName, setContactName] = useState('');
    const [contactEmail, setContactEmail] = useState('');
    const [contactMsg, setContactMsg] = useState('');
    const [contactStatus, setContactStatus] = useState('');

    const [refresh, setRefresh] = useState(0);

    // Common card style to ensure unified look
    const cardStyle = "bg-gray-900/60 p-8 rounded-3xl border border-gray-700/50 backdrop-blur-xl shadow-2xl hover:shadow-cyan-500/10 transition-shadow h-full";

    useEffect(() => {
        fetchComments();
    }, [refresh]);

    const fetchComments = async () => {
        try {
            console.log("Supabase: Fetching comments...");
            let { data, error } = await supabase
                .from('comments')
                .select('*')
                .order('is_pinned', { ascending: false }) // Pinned first
                .order('created_at', { ascending: false }); // Then newest

            if (error) {
                console.error("Supabase Error:", error);
                setComments([]);
                throw error;
            }

            if (data) {
                setComments(data);
            }
        } catch (error) {
            console.error('Error fetching comments:', error.message);
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!name || !msg) return;

        try {
            // Public comments are NEVER admin
            const is_author = false;

            const { error } = await supabase
                .from('comments')
                .insert([{ name, message: msg, is_author }]);

            if (error) throw error;

            setMsg('');
            setName('');
            setRefresh(prev => prev + 1);
        } catch (err) {
            console.error('Error posting comment:', err.message);
        }
    };

    const handleContactSubmit = async (e) => {
        e.preventDefault();
        if (!contactName || !contactEmail || !contactMsg) return;
        setContactStatus(t.contact_btn_sending);

        try {
            const { error } = await supabase
                .from('messages')
                .insert([{ name: contactName, email: contactEmail, message: contactMsg }]);

            if (error) throw error;

            if (error) throw error;

            setContactStatus(t.contact_btn_sent);
            setContactName('');
            setContactEmail('');
            setContactMsg('');
            setTimeout(() => setContactStatus(''), 3000);
        } catch (err) {
            console.error('Error sending message:', err.message);
            setContactStatus(t.contact_btn_failed);
        }
    };

    return (
        <section id="contact" className="relative w-full min-h-screen py-20 flex flex-col justify-center">
            <div className="container mx-auto px-6">

                <SectionWrapper>
                    <div className="text-center mb-16">
                        <h2 className="text-5xl font-bold text-white">{t.contact_title} <span className="text-cyan-400">{t.contact_title_highlight}</span></h2>
                        <p className="text-gray-400 mt-4">{t.contact_subtitle}</p>
                    </div>
                </SectionWrapper>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

                    {/* LEFT COLUMN: Contact Form + Blog */}
                    <div className="flex flex-col gap-10">
                        {/* Contact Form */}
                        <SectionWrapper delay={0.2}>
                            <div className={cardStyle}>
                                <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                                    <span className="mr-2"></span> {t.contact_title} {t.contact_title_highlight}
                                </h3>
                                <form onSubmit={handleContactSubmit} className="space-y-4">
                                    <input
                                        type="text"
                                        placeholder={t.contact_form_name}
                                        value={contactName}
                                        onChange={e => setContactName(e.target.value)}
                                        className="w-full bg-white/5 border border-gray-600 rounded-xl p-4 text-white focus:border-cyan-500 focus:bg-white/10 outline-none transition-all placeholder:text-gray-500"
                                    />
                                    <input
                                        type="email"
                                        placeholder={t.contact_form_email}
                                        value={contactEmail}
                                        onChange={e => setContactEmail(e.target.value)}
                                        className="w-full bg-white/5 border border-gray-600 rounded-xl p-4 text-white focus:border-cyan-500 focus:bg-white/10 outline-none transition-all placeholder:text-gray-500"
                                    />
                                    <textarea
                                        rows="4"
                                        placeholder={t.contact_form_msg}
                                        value={contactMsg}
                                        onChange={e => setContactMsg(e.target.value)}
                                        className="w-full bg-white/5 border border-gray-600 rounded-xl p-4 text-white focus:border-cyan-500 focus:bg-white/10 outline-none transition-all placeholder:text-gray-500"
                                    ></textarea>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg"
                                    >
                                        {contactStatus || t.contact_btn_send}
                                    </motion.button>
                                </form>
                            </div>
                        </SectionWrapper>

                        {/* Blog Card (Embed) */}
                        <SectionWrapper delay={0.3}>
                            <div className="bg-gray-900/60 p-8 rounded-3xl border border-gray-700/50 backdrop-blur-xl shadow-2xl hover:shadow-purple-500/10 transition-shadow">
                                <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                                    <span className="mr-2">📝</span> {t.blog_title}
                                </h3>
                                <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                                    <Blog isEmbedded={true} />
                                </div>
                            </div>
                        </SectionWrapper>
                    </div>

                    {/* RIGHT COLUMN: Comment Board (Tall) */}
                    <SectionWrapper delay={0.4}>
                        <div className="bg-gray-900/60 p-8 rounded-3xl border border-gray-700/50 backdrop-blur-xl shadow-2xl hover:shadow-cyan-500/10 transition-shadow flex flex-col relative overflow-hidden h-full min-h-[500px]">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>

                            <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                                <span className="mr-2"></span> {t.contact_wall_title}
                            </h3>

                            {/* Scrollable Comments */}
                            <div className="flex-1 overflow-y-auto space-y-4 mb-6 pr-2 custom-scrollbar scroll-smooth">
                                {comments.length === 0 && (
                                    <div className="text-center text-gray-500 py-10">{t.contact_no_comments}</div>
                                )}
                                {comments.map((c) => (
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        key={c.id}
                                        className={`group flex gap-3 p-4 rounded-2xl border ${c.is_pinned ? 'bg-yellow-500/10 border-yellow-500' : c.is_author ? 'bg-cyan-900/10 border-cyan-500/30 ml-8' : 'bg-white/5 border-gray-700/50 mr-8'} hover:bg-white/10 transition-colors`}
                                    >
                                        <div className="shrink-0 pt-1">
                                            <Avatar name={c.name} />
                                        </div>
                                        <div>
                                            <div className="flex items-baseline gap-2 mb-1">
                                                <span className={`font-bold text-sm ${c.is_author ? 'text-cyan-400' : 'text-white'}`}>
                                                    {c.name}
                                                    {c.is_author && <span className="text-[10px] bg-cyan-500 text-black px-1 rounded ml-1">ADMIN</span>}
                                                    {c.is_pinned && <span className="text-[10px] bg-yellow-500 text-black px-1 rounded ml-1">📌 PINNED</span>}
                                                    {c.is_liked_by_admin && <span className="text-[10px] bg-pink-500 text-white px-1 rounded ml-1">❤️ LIKED</span>}
                                                </span>
                                                <span className="text-[10px] text-gray-500">{new Date(c.created_at).toLocaleDateString()}</span>
                                            </div>
                                            <p className="text-gray-300 text-sm leading-relaxed">{c.message}</p>

                                            {/* Admin Reply */}
                                            {c.admin_reply && (
                                                <div className="mt-2 p-3 bg-cyan-900/20 border-l-2 border-cyan-500 rounded-r text-sm">
                                                    <div className="text-cyan-400 font-bold text-xs mb-1">Admin Reply:</div>
                                                    <p className="text-gray-300">{c.admin_reply}</p>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Post Comment */}
                            <form onSubmit={handleCommentSubmit} className="space-y-3 pt-4 border-t border-gray-700/50">
                                <div className="relative">
                                    <input
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        placeholder={t.contact_form_name}
                                        className="w-full bg-black/40 border border-gray-600 rounded-lg p-3 text-sm text-white focus:border-cyan-500 outline-none"
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <input
                                        value={msg}
                                        onChange={e => setMsg(e.target.value)}
                                        placeholder={t.contact_post_placeholder}
                                        className="flex-1 bg-black/40 border border-gray-600 rounded-lg p-3 text-sm text-white focus:border-cyan-500 outline-none"
                                    />
                                    <button type="submit" className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 rounded-lg text-sm font-bold shadow-lg transition-all">
                                        {t.contact_btn_post}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </SectionWrapper>

                </div>

                {/* Social Links Row */}
                <SectionWrapper delay={0.6}>
                    <div className="flex justify-center gap-6 mt-16 flex-wrap">
                        {/* Github */}
                        <SocialIcon
                            href="https://github.com/aarrrryyaaaaa"
                            colorClass="hover:border-white/50 hover:bg-black/50"
                            path={<path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>}
                        />

                        {/* LinkedIn */}
                        <SocialIcon
                            href="https://www.linkedin.com/in/arya-toni-saputra-741878391/"
                            colorClass="hover:border-blue-500/50 hover:bg-blue-900/20 hover:text-blue-400"
                            path={<><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></>}
                        />

                        {/* Instagram */}
                        <SocialIcon
                            href="https://www.instagram.com/aarrrryyaaaaa_?igsh=N21wZ214MjB6NWZy&utm_source=qr"
                            colorClass="hover:border-pink-500/50 hover:bg-pink-900/20 hover:text-pink-400"
                            path={<><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></>}
                        />

                        {/* TikTok */}
                        <SocialIcon
                            href="https://www.tiktok.com/@aarrrryyaaaaa?is_from_webapp=1&sender_device=pc"
                            colorClass="hover:border-teal-400/50 hover:bg-teal-900/20 hover:text-teal-400"
                            path={<path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path>}
                        />
                    </div>
                </SectionWrapper>
            </div>
        </section>
    );
}
