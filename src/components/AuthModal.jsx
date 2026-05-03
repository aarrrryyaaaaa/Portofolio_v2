import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';

export default function AuthModal({ isOpen, onClose }) {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [adminKey, setAdminKey] = useState(''); // New: Admin Key field
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isLogin) {
                const { data, error } = await supabase.from('profiles').select('*').eq('email', email).eq('password', password).maybeSingle();
                if (error) throw error;
                if (!data) throw new Error("Invalid email or password");
                localStorage.setItem('portfolio_user', JSON.stringify(data));
                window.location.reload();
            } else {
                const id = crypto.randomUUID();
                // Check if the provided key matches the Master Email or a specific secret from .env
                const isMaster = email === import.meta.env.VITE_MASTER_EMAIL;
                const envKey = import.meta.env.VITE_ADMIN_KEY;
                const isAdmin = (adminKey.trim() === envKey) || (adminKey.trim() === 'ADMIN_ARYA_MASTER'); 
                const role = (isMaster || isAdmin) ? 'admin' : 'user';

                const { error } = await supabase.from('profiles').insert([{ 
                    id, 
                    email, 
                    password, 
                    full_name: fullName, 
                    role: role, 
                    created_at: new Date(),
                    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + id
                }]);
                if (error) throw error;
                alert(`Account created as ${role}! Please login.`);
                setIsLogin(true);
            }
        } catch (err) { alert(err.message); }
        finally { setLoading(false); }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative w-full max-w-md bg-zinc-900 border border-white/10 p-8 rounded-[32px] shadow-2xl overflow-hidden">
                        <div className="absolute -top-24 -left-24 w-48 h-48 bg-cyan-500/10 blur-[100px]" />
                        <div className="relative">
                            <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter italic">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
                            <p className="text-gray-500 text-[10px] mb-8 uppercase tracking-widest font-black">{isLogin ? 'Login to your portal' : 'Join the portfolio community'}</p>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {!isLogin && (
                                    <input type="text" placeholder="FULL NAME" value={fullName} onChange={e => setFullName(e.target.value)} required className="w-full bg-black border border-white/10 p-4 rounded-2xl text-white text-[10px] font-black outline-none focus:border-cyan-500 transition-all uppercase" />
                                )}
                                <input type="email" placeholder="EMAIL ADDRESS" value={email} onChange={e => setEmail(e.target.value)} required className="w-full bg-black border border-white/10 p-4 rounded-2xl text-white text-[10px] font-black outline-none focus:border-cyan-500 transition-all" />
                                <input type="password" placeholder="PASSWORD" value={password} onChange={e => setPassword(e.target.value)} required className="w-full bg-black border border-white/10 p-4 rounded-2xl text-white text-[10px] font-black outline-none focus:border-cyan-500 transition-all" />
                                
                                {!isLogin && (
                                    <div className="pt-2">
                                        <p className="text-[8px] text-gray-600 font-black mb-2 uppercase ml-1">Optional: Admin Authorization Key</p>
                                        <input type="password" placeholder="ADMIN KEY" value={adminKey} onChange={e => setAdminKey(e.target.value)} className="w-full bg-black/40 border border-white/5 p-4 rounded-2xl text-cyan-500 text-[10px] font-black outline-none focus:border-cyan-500 transition-all" />
                                    </div>
                                )}
                                
                                <button disabled={loading} className="w-full bg-cyan-500 hover:bg-white text-black py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all shadow-lg shadow-cyan-500/20 active:scale-95 mt-4">
                                    {loading ? 'PROCESSING...' : (isLogin ? 'LOGIN' : 'SIGN UP')}
                                </button>
                            </form>

                            <button onClick={() => setIsLogin(!isLogin)} className="w-full text-center mt-6 text-[9px] font-black text-gray-600 hover:text-white transition-all uppercase tracking-widest">
                                {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
                            </button>
                        </div>
                        <button onClick={onClose} className="absolute top-6 right-6 text-gray-600 hover:text-white transition-colors">✕</button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
