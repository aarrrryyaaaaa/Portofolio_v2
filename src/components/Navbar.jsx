import { useState, useEffect } from 'react';
import { useLanguage } from '../lib/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';

export default function Navbar({ onOpenAuth }) {
    const { t, language, toggleLanguage } = useLanguage();
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    
    useEffect(() => {
        const fetchSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                setUser(session.user);
                fetchProfile(session.user.id);
            }
        };
        fetchSession();
    }, []);

    const fetchProfile = async (userId) => {
        try {
            const { data } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
            if (data) setProfile(data);
        } catch (err) { console.error(err); }
    };

    const handleUploadAvatar = async (event) => {
        try {
            setUploading(true);
            if (!event.target.files || event.target.files.length === 0) throw new Error('You must select an image to upload.');
            
            const file = event.target.files[0];
            if (file.size > 5 * 1024 * 1024) throw new Error('File is too large! Maximum size is 5MB.');

            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}-${Math.random()}.${fileExt}`;
            const filePath = `avatars/${fileName}`;

            // Upload to Supabase Storage
            const { error: uploadError } = await supabase.storage.from('portfolio_assets').upload(filePath, file);
            if (uploadError) throw uploadError;

            // Get Public URL
            const { data: { publicUrl } } = supabase.storage.from('portfolio_assets').getPublicUrl(filePath);

            // Update Database
            const { error: updateError } = await supabase.from('profiles').update({ avatar_url: publicUrl }).eq('id', user.id);
            if (updateError) throw updateError;

            setProfile({ ...profile, avatar_url: publicUrl });
            alert("Profile Picture Updated!");
        } catch (error) {
            alert(error.message);
        } finally {
            setUploading(false);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        window.location.reload();
    };

    return (
        <div className="fixed top-8 left-0 w-full z-[9999] flex justify-center pointer-events-none px-4">
            <nav 
                className={`pointer-events-auto flex items-center border border-white/10 shadow-2xl backdrop-blur-xl transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] w-max max-w-full ${
                    isScrolled 
                    ? 'bg-black/95 py-2 px-4 md:px-6 rounded-[9999px] gap-2 md:gap-4' 
                    : 'bg-black/80 py-4 px-6 md:px-8 rounded-[32px] gap-4 md:gap-8'
                }`}
            >
                
                <div className="flex items-center pr-4 border-r border-white/10">
                    <span className="text-sm font-black tracking-tighter text-white">ATS<span className="text-orange-500">.</span></span>
                </div>

                <div className="hidden sm:flex items-center gap-0 md:gap-1">
                    {['home', 'about', 'experience', 'projects', 'contact'].map((item) => (
                        <a key={item} href={`#${item}`} className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-white/70 hover:text-white px-2 md:px-3 py-2 transition-all">{t[`nav_${item}`]}</a>
                    ))}
                </div>

                <div className="flex items-center gap-4 pl-4 border-l border-white/10">
                    <button onClick={toggleLanguage} className="text-[10px] font-black text-orange-400 uppercase">{language === 'id' ? 'ID' : 'EN'}</button>

                    <div className="relative">
                        {user ? (
                            <div className="flex items-center gap-3">
                                {profile?.role === 'admin' && (
                                    <button onClick={() => window.location.href = '/admin-panel-secret'} className="text-[9px] font-black uppercase text-orange-500 hover:text-white transition-colors">Admin</button>
                                )}
                                <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="w-8 h-8 rounded-full border border-white/20 overflow-hidden shadow-lg hover:border-orange-500 transition-all">
                                    <img src={profile?.avatar_url || 'https://via.placeholder.com/100'} className="w-full h-full object-cover" alt="User" />
                                </button>
                            </div>
                        ) : (
                            <button onClick={onOpenAuth} className="bg-white text-black px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-orange-500 transition-all">LOGIN</button>
                        )}
                        
                        <AnimatePresence>
                            {isProfileOpen && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute right-0 mt-4 w-56 bg-zinc-900 border border-white/10 rounded-2xl p-6 shadow-2xl backdrop-blur-2xl">
                                    <p className="text-[10px] font-black text-white uppercase truncate mb-1">{profile?.full_name}</p>
                                    <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest mb-4">{profile?.role}</p>
                                    
                                    <div className="mb-4">
                                        <label className="block text-[8px] font-black text-orange-500 uppercase cursor-pointer hover:text-white transition-colors">
                                            {uploading ? 'UPLOADING...' : 'CHANGE PHOTO (MAX 5MB)'}
                                            <input type="file" accept="image/*" className="hidden" onChange={handleUploadAvatar} disabled={uploading} />
                                        </label>
                                    </div>

                                    <hr className="border-white/5 mb-4" />
                                    <button onClick={handleLogout} className="w-full text-left text-red-500 text-[10px] font-black uppercase hover:text-red-400 transition-colors">Sign Out</button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </nav>
        </div>
    );
}
