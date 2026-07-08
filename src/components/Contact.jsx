import { useState, useEffect } from 'react';
import { useLanguage } from '../lib/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';

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

const Avatar = ({ name, url }) => {
    if (url) return <img src={url} className="w-10 h-10 rounded-full object-cover shadow-lg" alt={name} />;
    const initial = name ? name.charAt(0).toUpperCase() : '?';
    return (
        <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-black font-black text-sm shadow-lg">
            {initial}
        </div>
    );
};

const SocialIcon = ({ href, path, label, colorClass }) => (
    <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.05, y: -5 }}
        whileTap={{ scale: 0.95 }}
        className={`bg-gray-900/80 p-4 rounded-2xl border border-white/10 ${colorClass} transition-colors backdrop-blur-md shadow-lg group flex items-center justify-center gap-3`}
    >
        <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 group-hover:text-white transition-colors">
            {path}
        </svg>
        <span className="text-xs font-bold text-gray-400 group-hover:text-white uppercase tracking-widest">{label}</span>
    </motion.a>
);

export default function Contact({ onOpenAuth }) {
    const { t } = useLanguage();
    const [comments, setComments] = useState([]);
    const [name, setName] = useState('');
    const [msg, setMsg] = useState('');
    const [contactName, setContactName] = useState('');
    const [contactEmail, setContactEmail] = useState('');
    const [contactMsg, setContactMsg] = useState('');
    const [status, setStatus] = useState('');
    const [currentUser, setCurrentUser] = useState(null);
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyMsg, setReplyMsg] = useState('');

    useEffect(() => {
        fetchComments();
        
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
                if (profile) setCurrentUser(profile);
            }
        };
        checkUser();
    }, []);

    const fetchComments = async () => {
        const { data } = await supabase.from('comments').select('*').order('created_at', { ascending: true });
        if (data) setComments(data);
    };

    const handleCommentSubmit = async (e, parentId = null) => {
        e.preventDefault();
        const finalName = currentUser?.full_name || name || 'Anonymous';
        const messageText = parentId ? replyMsg : msg;
        
        const { error } = await supabase.from('comments').insert([{ 
            name: finalName, 
            message: messageText, 
            user_id: currentUser?.id,
            avatar_url: currentUser?.avatar_url,
            parent_id: parentId
        }]);
        
        if (!error) { 
            if (parentId) {
                setReplyMsg('');
                setReplyingTo(null);
            } else {
                setMsg(''); 
                setName(''); 
            }
            fetchComments(); 
        }
    };

    const handleLike = async (comment) => {
        if (!currentUser) return alert('Please login to like comments!');
        
        const likedBy = comment.liked_by || [];
        const hasLiked = likedBy.includes(currentUser.id);
        
        let newLikedBy = [];
        let newLikesCount = comment.likes_count || 0;
        
        if (hasLiked) {
            newLikedBy = likedBy.filter(id => id !== currentUser.id);
            newLikesCount = Math.max(0, newLikesCount - 1);
        } else {
            newLikedBy = [...likedBy, currentUser.id];
            newLikesCount += 1;
        }

        const { error } = await supabase.from('comments').update({
            liked_by: newLikedBy,
            likes_count: newLikesCount
        }).eq('id', comment.id);

        if (!error) fetchComments();
    };

    // Organized Comments
    const mainComments = comments.filter(c => !c.parent_id).sort((a, b) => {
        if (a.is_pinned === b.is_pinned) return new Date(b.created_at) - new Date(a.created_at);
        return a.is_pinned ? -1 : 1;
    });

    const handleContactSubmit = async (e) => {
        e.preventDefault();
        setStatus('Sending...');
        const { error } = await supabase.from('messages').insert([{ name: contactName, email: contactEmail, message: contactMsg }]);
        if (!error) {
            setStatus('Sent!');
            setContactName(''); setContactEmail(''); setContactMsg('');
            setTimeout(() => setStatus(''), 3000);
        } else { setStatus('Failed'); }
    };

    return (
        <section id="contact" className="relative w-full min-h-screen py-20 bg-black">
            <div className="container mx-auto px-6">
                <SectionWrapper>
                    <div className="text-center mb-16">
                        <h2 className="text-5xl font-black text-white uppercase italic tracking-tighter">Get In <span className="text-orange-500">Touch</span></h2>
                        <p className="text-gray-500 mt-4 uppercase text-xs font-bold tracking-widest">{t.contact_subtitle}</p>
                    </div>
                </SectionWrapper>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* LEFT: FORM & SOCIALS */}
                    <div className="h-[600px]">
                        <SectionWrapper delay={0.2}>
                            <div className="flex flex-col h-full">
                                <div className="bg-zinc-900/50 p-8 rounded-[32px] border border-white/5 backdrop-blur-xl flex-1 flex flex-col justify-center mb-6">
                                    <h3 className="text-xl font-black uppercase mb-6 italic">Send Message</h3>
                                    {currentUser ? (
                                        <form onSubmit={handleContactSubmit} className="space-y-4">
                                            <input placeholder="NAME" value={contactName} onChange={e => setContactName(e.target.value)} className="w-full bg-black border border-white/10 p-4 rounded-xl text-white text-xs font-bold outline-none focus:border-orange-500 transition-all" required />
                                            <input placeholder="EMAIL" type="email" value={contactEmail} onChange={e => setContactEmail(e.target.value)} className="w-full bg-black border border-white/10 p-4 rounded-xl text-white text-xs font-bold outline-none focus:border-orange-500 transition-all" required />
                                            <textarea placeholder="MESSAGE" rows="4" value={contactMsg} onChange={e => setContactMsg(e.target.value)} className="w-full bg-black border border-white/10 p-4 rounded-xl text-white text-xs font-bold outline-none focus:border-orange-500 transition-all resize-none" required />
                                            <button className="w-full bg-gradient-to-r from-cyan-500 to-orange-500 text-white py-4 rounded-xl font-black uppercase text-xs tracking-widest hover:from-cyan-400 hover:to-orange-400 transition-all shadow-lg shadow-orange-500/20">
                                                {status || 'SEND MESSAGE'}
                                            </button>
                                        </form>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center space-y-4 py-8">
                                            <p className="text-xs font-bold text-gray-500 uppercase text-center">You must be logged in to send a direct message.</p>
                                            <button onClick={onOpenAuth} className="bg-white text-black px-8 py-3 rounded-xl font-black uppercase text-xs hover:bg-orange-500 transition-all w-full md:w-auto">Login to Send Message</button>
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <SocialIcon href="#" label="TikTok" path={<><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></>} colorClass="hover:border-white/50 hover:shadow-white/20" />
                                    <SocialIcon href="#" label="Instagram" path={<><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></>} colorClass="hover:border-pink-500/50 hover:shadow-pink-500/20" />
                                    <SocialIcon href="#" label="LinkedIn" path={<><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></>} colorClass="hover:border-blue-500/50 hover:shadow-blue-500/20" />
                                    <SocialIcon href="#" label="GitHub" path={<><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></>} colorClass="hover:border-white/50 hover:shadow-white/20" />
                                </div>
                            </div>
                        </SectionWrapper>
                    </div>

                    {/* RIGHT: COMMENT BOARD */}
                    <SectionWrapper delay={0.4}>
                        <div className="bg-zinc-900/50 p-8 rounded-[32px] border border-white/5 backdrop-blur-xl h-[600px] flex flex-col">
                            <h3 className="text-xl font-black uppercase mb-6 italic">Comment Board</h3>
                            
                            <div className="flex-1 overflow-y-auto space-y-4 mb-6 pr-2 custom-scrollbar">
                                {mainComments.map(c => (
                                    <div key={c.id} className="space-y-3">
                                        <div className={`p-4 rounded-2xl flex gap-4 border ${c.is_pinned ? 'bg-orange-900/10 border-orange-500/30 shadow-[0_0_15px_rgba(249,115,22,0.1)]' : 'bg-black/40 border-white/5'}`}>
                                            <Avatar name={c.name} url={c.avatar_url} />
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-xs font-black text-white uppercase">{c.name}</span>
                                                    {c.is_pinned && <span className="bg-orange-500 text-black text-[8px] font-black uppercase px-2 py-0.5 rounded-full">Pinned</span>}
                                                    <span className="text-[10px] text-gray-600 font-bold">{new Date(c.created_at).toLocaleDateString()}</span>
                                                </div>
                                                <p className="text-xs text-gray-400 font-bold leading-relaxed mb-3">{c.message}</p>
                                                
                                                {c.admin_reply && (
                                                    <div className="mt-2 mb-3 bg-orange-900/20 border border-orange-500/30 p-3 rounded-xl inline-block">
                                                        <p className="text-[10px] text-orange-400 font-bold leading-relaxed"><span className="text-orange-500 font-black uppercase">Admin Reply:</span> {c.admin_reply}</p>
                                                    </div>
                                                )}

                                                <div className="flex items-center gap-4">
                                                    <button onClick={() => handleLike(c)} className={`flex items-center gap-1.5 text-[10px] font-bold ${c.liked_by?.includes(currentUser?.id) ? 'text-pink-500' : 'text-gray-500 hover:text-white'} transition-colors`}>
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill={c.liked_by?.includes(currentUser?.id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                                                        {c.likes_count || 0}
                                                    </button>
                                                    <button onClick={() => setReplyingTo(replyingTo === c.id ? null : c.id)} className="text-[10px] font-bold text-gray-500 hover:text-white transition-colors uppercase">
                                                        Reply
                                                    </button>
                                                </div>

                                                {/* Reply Input */}
                                                <AnimatePresence>
                                                    {replyingTo === c.id && (
                                                        <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} onSubmit={(e) => handleCommentSubmit(e, c.id)} className="mt-4 flex gap-2 overflow-hidden">
                                                            <input placeholder="REPLY..." value={replyMsg} onChange={e => setReplyMsg(e.target.value)} className="flex-1 bg-black border border-white/10 p-2.5 rounded-xl text-white text-[10px] font-bold outline-none focus:border-orange-500" required autoFocus />
                                                            <button className="bg-white text-black px-4 rounded-xl font-black text-[9px] uppercase hover:bg-orange-500 transition-all">Send</button>
                                                        </motion.form>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </div>

                                        {/* Render Replies */}
                                        <div className="pl-14 space-y-3">
                                            {comments.filter(reply => reply.parent_id === c.id).map(reply => (
                                                <div key={reply.id} className="bg-black/20 border border-white/5 p-3 rounded-2xl flex gap-3">
                                                    <div className="scale-75 origin-top-left"><Avatar name={reply.name} url={reply.avatar_url} /></div>
                                                    <div className="flex-1 -ml-2">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="text-[10px] font-black text-gray-300 uppercase">{reply.name}</span>
                                                            <span className="text-[8px] text-gray-600 font-bold">{new Date(reply.created_at).toLocaleDateString()}</span>
                                                        </div>
                                                        <p className="text-[10px] text-gray-500 font-bold leading-relaxed mb-2">{reply.message}</p>
                                                        {reply.admin_reply && (
                                                            <div className="mt-1 mb-2 bg-orange-900/20 border border-orange-500/30 p-2 rounded-lg inline-block">
                                                                <p className="text-[9px] text-orange-400 font-bold leading-relaxed"><span className="text-orange-500 font-black uppercase">Admin Reply:</span> {reply.admin_reply}</p>
                                                            </div>
                                                        )}
                                                        <button onClick={() => handleLike(reply)} className={`flex items-center gap-1.5 text-[9px] font-bold ${reply.liked_by?.includes(currentUser?.id) ? 'text-pink-500' : 'text-gray-600 hover:text-white'} transition-colors`}>
                                                            <svg width="12" height="12" viewBox="0 0 24 24" fill={reply.liked_by?.includes(currentUser?.id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                                                            {reply.likes_count || 0}
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <form onSubmit={(e) => handleCommentSubmit(e)} className="space-y-3 pt-4 border-t border-white/5">
                                {currentUser ? (
                                    <div className="flex gap-2">
                                        <input placeholder="WRITE A COMMENT..." value={msg} onChange={e => setMsg(e.target.value)} className="flex-1 bg-black border border-white/10 p-3 rounded-xl text-white text-[10px] font-bold outline-none focus:border-orange-500" required />
                                        <button className="bg-orange-500 text-black px-6 rounded-xl font-black text-[10px] uppercase hover:bg-white transition-all">POST</button>
                                    </div>
                                ) : (
                                    <button type="button" onClick={onOpenAuth} className="w-full bg-white text-black p-3 rounded-xl font-black text-[10px] uppercase hover:bg-orange-500 transition-all">LOGIN TO POST COMMENT</button>
                                )}
                            </form>
                        </div>
                    </SectionWrapper>
                </div>
            </div>
        </section>
    );
}
