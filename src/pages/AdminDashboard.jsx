import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminDashboard() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState('projects');

    // Data States
    const [projects, setProjects] = useState([]);
    const [skills, setSkills] = useState([]);
    const [certificates, setCertificates] = useState([]);
    const [blogs, setBlogs] = useState([]);
    const [comments, setComments] = useState([]);
    const [messages, setMessages] = useState([]);

    // CMS Form States
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({});
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        const savedUser = localStorage.getItem('portfolio_user');
        if (savedUser) {
            const userData = JSON.parse(savedUser);
            if (userData.role === 'admin') {
                setIsAuthenticated(true);
                setUser(userData);
                fetchData();
            } else { window.location.href = '/'; }
        } else { window.location.href = '/'; }
    }, []);

    const fetchData = async () => {
        const { data: p } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
        const { data: s } = await supabase.from('skills').select('*').order('level', { ascending: false });
        const { data: c } = await supabase.from('comments').select('*').order('created_at', { ascending: false });
        const { data: m } = await supabase.from('messages').select('*').order('created_at', { ascending: false });
        const { data: b } = await supabase.from('blogs').select('*').order('created_at', { ascending: false });
        // Assume certificates are stored in a separate table
        const { data: certs } = await supabase.from('certificates').select('*');

        if (p) setProjects(p);
        if (s) setSkills(s);
        if (c) setComments(c);
        if (m) setMessages(m);
        if (b) setBlogs(b);
        if (certs) setCertificates(certs);
    };

    const handleFileUpload = async (event, fieldName) => {
        try {
            setUploading(true);
            if (!event.target.files || event.target.files.length === 0) return;
            
            const file = event.target.files[0];
            if (file.size > 5 * 1024 * 1024) throw new Error('File is too large! Maximum size is 5MB.');

            const fileExt = file.name.split('.').pop();
            const fileName = `cms-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `cms_uploads/${fileName}`;

            const { error: uploadError } = await supabase.storage.from('portfolio_assets').upload(filePath, file);
            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage.from('portfolio_assets').getPublicUrl(filePath);

            setFormData(prev => ({...prev, [fieldName]: publicUrl}));
            alert("File uploaded successfully!");
        } catch (error) {
            alert(error.message);
        } finally {
            setUploading(false);
        }
    };

    const togglePin = async (comment) => {
        const { error } = await supabase.from('comments').update({ is_pinned: !comment.is_pinned }).eq('id', comment.id);
        if (!error) fetchData();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const table = activeTab;
            if (editingItem) {
                const { error } = await supabase.from(table).update(formData).eq('id', editingItem.id);
                if (error) throw error;
            } else {
                const { error } = await supabase.from(table).insert([formData]);
                if (error) throw error;
            }
            setShowModal(false);
            setEditingItem(null);
            setFormData({});
            fetchData();
            alert("Content updated successfully!");
        } catch (err) { alert(err.message); }
    };

    const deleteItem = async (table, id) => {
        if (!confirm('Are you sure you want to delete this item?')) return;
        await supabase.from(table).delete().eq('id', id);
        fetchData();
    };

    if (!isAuthenticated) return <div className="min-h-screen bg-black flex items-center justify-center text-white font-black tracking-widest uppercase">Checking Authorization...</div>;

    const TabButton = ({ id, label }) => (
        <button 
            onClick={() => setActiveTab(id)}
            className={`px-6 py-3 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === id ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20' : 'bg-white/5 text-gray-500 border border-white/5 hover:border-white/20'}`}
        >
            {label}
        </button>
    );

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="text-4xl font-black tracking-tighter italic uppercase">Admin <span className="text-cyan-500">Center</span></h1>
                        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">Total Control Portfolio CMS</p>
                    </div>
                    <button onClick={() => window.location.href = '/'} className="bg-white/5 border border-white/10 px-6 py-2 rounded-full text-[10px] font-black uppercase hover:bg-white hover:text-black transition-all">Exit Dashboard</button>
                </div>

                {/* NAVIGATION TABS */}
                <div className="flex flex-wrap gap-2 mb-8">
                    <TabButton id="projects" label="Projects" />
                    <TabButton id="certificates" label="Certificates" />
                    <TabButton id="skills" label="Skills" />
                    <TabButton id="blogs" label="Blogs" />
                    <TabButton id="comments" label="Comments" />
                    <TabButton id="messages" label="Inquiries" />
                </div>

                {/* CONTENT AREA */}
                <div className="bg-zinc-900 border border-white/5 rounded-[40px] p-8 shadow-2xl overflow-hidden min-h-[600px]">
                    <div className="flex justify-between items-center mb-8 pb-8 border-b border-white/5">
                        <h2 className="text-3xl font-black uppercase tracking-tighter italic">{activeTab} Management</h2>
                        {!['messages', 'comments'].includes(activeTab) && (
                            <button onClick={() => { setEditingItem(null); setFormData({}); setShowModal(true); }} className="bg-cyan-500 text-black px-6 py-2 rounded-full text-[10px] font-black uppercase hover:bg-white transition-all">Add New {activeTab}</button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        {/* PROJECTS RENDER */}
                        {activeTab === 'projects' && projects.map(p => (
                            <div key={p.id} className="bg-black/40 p-6 rounded-2xl border border-white/5 flex justify-between items-center group hover:border-cyan-500/30 transition-all">
                                <div>
                                    <h3 className="font-black text-sm uppercase text-white">{p.title}</h3>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase mt-1">{p.description}</p>
                                </div>
                                <div className="flex gap-4">
                                    <button onClick={() => { setEditingItem(p); setFormData(p); setShowModal(true); }} className="text-[10px] font-black text-cyan-500 uppercase">Edit</button>
                                    <button onClick={() => deleteItem('projects', p.id)} className="text-[10px] font-black text-red-500 uppercase">Delete</button>
                                </div>
                            </div>
                        ))}

                        {/* SKILLS RENDER */}
                        {activeTab === 'skills' && skills.map(s => (
                            <div key={s.id} className="bg-black/40 p-6 rounded-2xl border border-white/5 flex justify-between items-center group hover:border-cyan-500/30 transition-all">
                                <div className="flex items-center gap-4">
                                    <img src={s.icon_url} className="w-8 h-8 opacity-70" alt="" />
                                    <div>
                                        <h3 className="font-black text-sm uppercase text-white">{s.name}</h3>
                                        <p className="text-[10px] text-cyan-500/50 font-bold uppercase">Level: {s.level}%</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <button onClick={() => { setEditingItem(s); setFormData(s); setShowModal(true); }} className="text-[10px] font-black text-cyan-500 uppercase">Edit</button>
                                    <button onClick={() => deleteItem('skills', s.id)} className="text-[10px] font-black text-red-500 uppercase">Delete</button>
                                </div>
                            </div>
                        ))}

                        {/* CERTIFICATES RENDER */}
                        {activeTab === 'certificates' && certificates.map(c => (
                            <div key={c.id} className="bg-black/40 p-6 rounded-2xl border border-white/5 flex justify-between items-center group hover:border-cyan-500/30 transition-all">
                                <div>
                                    <h3 className="font-black text-sm uppercase text-white">{c.name}</h3>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase">{c.issuer} • {c.year}</p>
                                </div>
                                <div className="flex gap-4">
                                    <button onClick={() => { setEditingItem(c); setFormData(c); setShowModal(true); }} className="text-[10px] font-black text-cyan-500 uppercase">Edit</button>
                                    <button onClick={() => deleteItem('certificates', c.id)} className="text-[10px] font-black text-red-500 uppercase">Delete</button>
                                </div>
                            </div>
                        ))}

                        {/* COMMENTS MODERATION */}
                        {activeTab === 'comments' && comments.map(c => (
                            <div key={c.id} className={`p-6 rounded-2xl border transition-all ${c.is_pinned ? 'bg-cyan-900/10 border-cyan-500/30' : 'bg-black/40 border-white/5 group hover:border-yellow-500/30'}`}>
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-3">
                                        <h3 className="font-black text-xs uppercase text-white">{c.name}</h3>
                                        {c.is_pinned && <span className="bg-cyan-500 text-black text-[8px] font-black uppercase px-2 py-0.5 rounded-full">Pinned</span>}
                                        <span className="text-[9px] text-gray-500 font-bold">{new Date(c.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex gap-4">
                                        <button onClick={() => togglePin(c)} className={`text-[9px] font-black uppercase ${c.is_pinned ? 'text-gray-500' : 'text-cyan-500'}`}>{c.is_pinned ? 'Unpin' : 'Pin'}</button>
                                        <button onClick={() => deleteItem('comments', c.id)} className="text-[9px] font-black text-red-500 uppercase">Remove</button>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-400 font-bold leading-relaxed">{c.message}</p>
                                {c.admin_reply && <p className="text-[10px] text-cyan-500 mt-2 font-black italic uppercase">Reply: {c.admin_reply}</p>}
                                <button onClick={() => { setEditingItem(c); setFormData(c); setShowModal(true); }} className="text-[9px] font-black text-cyan-500 uppercase mt-4 block">Edit / Reply</button>
                            </div>
                        ))}

                        {/* MESSAGES INBOX */}
                        {activeTab === 'messages' && messages.map(m => (
                            <div key={m.id} className="bg-black/40 p-8 rounded-2xl border border-white/5">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h3 className="font-black text-sm uppercase text-white">{m.name}</h3>
                                        <p className="text-[10px] text-cyan-500 font-bold uppercase">{m.email}</p>
                                    </div>
                                    <button onClick={() => deleteItem('messages', m.id)} className="bg-red-500/10 text-red-500 px-4 py-1.5 rounded-full text-[9px] font-black uppercase">Archive</button>
                                </div>
                                <div className="bg-black/30 p-4 rounded-xl border border-white/5">
                                    <p className="text-xs text-gray-300 font-bold leading-relaxed">{m.message}</p>
                                </div>
                                <p className="text-[8px] text-gray-600 font-bold uppercase mt-4 text-right">{new Date(m.created_at).toLocaleString()}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* UNIFIED CMS MODAL */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="absolute inset-0 bg-black/90 backdrop-blur-md" />
                        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-zinc-900 border border-white/10 p-10 rounded-[40px] w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
                            <h2 className="text-3xl font-black uppercase tracking-tighter mb-8 italic">Managing <span className="text-cyan-500">{activeTab}</span></h2>
                            
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {activeTab === 'projects' && (
                                    <>
                                        <input placeholder="TITLE" value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-black border border-white/10 p-4 rounded-xl text-xs font-bold text-white outline-none focus:border-cyan-500" required />
                                        <textarea placeholder="DESCRIPTION" value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-black border border-white/10 p-4 rounded-xl text-xs font-bold text-white outline-none focus:border-cyan-500 h-24" required />
                                        <div className="w-full bg-black border border-white/10 p-4 rounded-xl">
                                            <label className="block text-[10px] text-gray-500 font-bold uppercase mb-2">PROJECT IMAGE (MAX 5MB)</label>
                                            <input type="file" accept="image/*,application/pdf" onChange={e => handleFileUpload(e, 'image_url')} className="w-full text-xs font-bold text-white outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-cyan-500 file:text-black hover:file:bg-white transition-all cursor-pointer" disabled={uploading} />
                                            {formData.image_url && <p className="text-[10px] text-cyan-500 mt-2 truncate">Current: {formData.image_url}</p>}
                                        </div>
                                        <textarea placeholder="DETAILS (EXTENDED CONTENT)" value={formData.details || ''} onChange={e => setFormData({...formData, details: e.target.value})} className="w-full bg-black border border-white/10 p-4 rounded-xl text-xs font-bold text-white outline-none focus:border-cyan-500 h-32" />
                                        <div className="grid grid-cols-2 gap-4">
                                            <input placeholder="LIVE LINK" value={formData.link_url || ''} onChange={e => setFormData({...formData, link_url: e.target.value})} className="w-full bg-black border border-white/10 p-4 rounded-xl text-xs font-bold text-white outline-none focus:border-cyan-500" />
                                            <input placeholder="SOURCE CODE LINK" value={formData.code_url || ''} onChange={e => setFormData({...formData, code_url: e.target.value})} className="w-full bg-black border border-white/10 p-4 rounded-xl text-xs font-bold text-white outline-none focus:border-cyan-500" />
                                        </div>
                                    </>
                                )}

                                {activeTab === 'skills' && (
                                    <>
                                        <input placeholder="SKILL NAME" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-black border border-white/10 p-4 rounded-xl text-xs font-bold text-white outline-none focus:border-cyan-500" required />
                                        <select value={formData.category || 'fe'} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-black border border-white/10 p-4 rounded-xl text-xs font-bold text-white outline-none focus:border-cyan-500">
                                            <option value="fe">Frontend</option>
                                            <option value="be">Backend</option>
                                            <option value="db">Database</option>
                                            <option value="tools">Tools / Others</option>
                                        </select>
                                        <input placeholder="ICON URL (SVG/PNG)" value={formData.icon_url || ''} onChange={e => setFormData({...formData, icon_url: e.target.value})} className="w-full bg-black border border-white/10 p-4 rounded-xl text-xs font-bold text-white outline-none focus:border-cyan-500" />
                                        <input type="number" placeholder="LEVEL (%)" value={formData.level || ''} onChange={e => setFormData({...formData, level: e.target.value})} className="w-full bg-black border border-white/10 p-4 rounded-xl text-xs font-bold text-white outline-none focus:border-cyan-500" />
                                        <label className="flex items-center gap-3 bg-black border border-white/10 p-4 rounded-xl cursor-pointer hover:border-cyan-500 transition-all">
                                            <input type="checkbox" checked={formData.show_on_about || false} onChange={e => setFormData({...formData, show_on_about: e.target.checked})} className="w-4 h-4 accent-cyan-500" />
                                            <span className="text-xs font-bold text-white uppercase">Tampilkan di Halaman About (Core Tech)</span>
                                        </label>
                                    </>
                                )}

                                {activeTab === 'certificates' && (
                                    <>
                                        <input placeholder="CERTIFICATE TITLE" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-black border border-white/10 p-4 rounded-xl text-xs font-bold text-white outline-none focus:border-cyan-500" required />
                                        <input placeholder="ISSUER" value={formData.issuer || ''} onChange={e => setFormData({...formData, issuer: e.target.value})} className="w-full bg-black border border-white/10 p-4 rounded-xl text-xs font-bold text-white outline-none focus:border-cyan-500" required />
                                        <input placeholder="YEAR" value={formData.year || ''} onChange={e => setFormData({...formData, year: e.target.value})} className="w-full bg-black border border-white/10 p-4 rounded-xl text-xs font-bold text-white outline-none focus:border-cyan-500" />
                                        <div className="w-full bg-black border border-white/10 p-4 rounded-xl">
                                            <label className="block text-[10px] text-gray-500 font-bold uppercase mb-2">CERTIFICATE IMAGE/PDF (MAX 5MB)</label>
                                            <input type="file" accept="image/*,application/pdf" onChange={e => handleFileUpload(e, 'image_url')} className="w-full text-xs font-bold text-white outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-cyan-500 file:text-black hover:file:bg-white transition-all cursor-pointer" disabled={uploading} />
                                            {formData.image_url && <p className="text-[10px] text-cyan-500 mt-2 truncate">Current: {formData.image_url}</p>}
                                        </div>
                                    </>
                                )}

                                {activeTab === 'comments' && (
                                    <>
                                        <p className="text-[10px] text-gray-500 font-bold uppercase mb-4">You are editing a comment by: {formData.name}</p>
                                        <textarea placeholder="COMMENT MESSAGE" value={formData.message || ''} onChange={e => setFormData({...formData, message: e.target.value})} className="w-full bg-black border border-white/10 p-4 rounded-xl text-xs font-bold text-white outline-none focus:border-cyan-500 h-32" required />
                                        <textarea placeholder="ADMIN REPLY" value={formData.admin_reply || ''} onChange={e => setFormData({...formData, admin_reply: e.target.value})} className="w-full bg-black border border-white/10 p-4 rounded-xl text-xs font-bold text-cyan-500 outline-none focus:border-cyan-500 h-24" />
                                    </>
                                )}

                                <button className="w-full bg-cyan-500 text-black py-5 rounded-2xl font-black uppercase text-xs tracking-widest mt-6 hover:bg-white transition-all shadow-xl shadow-cyan-500/20">Commit Changes</button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
