import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminDashboard() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [activeTab, setActiveTab] = useState('comments');

    // Data States
    const [comments, setComments] = useState([]);
    const [messages, setMessages] = useState([]);
    const [visitors, setVisitors] = useState([]);
    const [projects, setProjects] = useState([]);
    const [blogs, setBlogs] = useState([]);

    // CMS Form States
    const [showProjectModal, setShowProjectModal] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [newProject, setNewProject] = useState({ title: '', description: '', image_url: '', details: '', link_url: '', code_url: '' });

    const [showBlogModal, setShowBlogModal] = useState(false);
    const [newBlog, setNewBlog] = useState({ title: '', excerpt: '', content: '', image_url: '' });

    const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;

    const [newAdminComment, setNewAdminComment] = useState('');

    useEffect(() => {
        document.title = "ADMIN - ARYA TONI SAPUTRA";
        // DEVICE LOCK CHECK
        const isTrusted = localStorage.getItem('ATS_TRUSTED_DEVICE') === 'true';
        if (!isTrusted) {
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.get('setup') === 'secure123') {
                localStorage.setItem('ATS_TRUSTED_DEVICE', 'true');
                alert("Device Authorized Successfully!");
                window.location.href = '/admin-panel-secret';
            }
        }
        return () => { document.title = "ARYA TONI SAPUTRA"; };
    }, []);

    const handleLogin = (e) => {
        e.preventDefault();
        if (localStorage.getItem('ATS_TRUSTED_DEVICE') !== 'true') {
            alert("This device is NOT authorized to access Admin Panel.");
            return;
        }
        if (password === ADMIN_PASSWORD) {
            setIsAuthenticated(true);
            fetchData();
        } else {
            alert('Access Denied!');
        }
    };

    const fetchData = async () => {
        const { data: c } = await supabase.from('comments').select('*').order('created_at', { ascending: false });
        const { data: m } = await supabase.from('messages').select('*').order('created_at', { ascending: false });
        const { data: v } = await supabase.from('visitors').select('*').order('created_at', { ascending: false }).limit(200);
        const { data: p } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
        const { data: b } = await supabase.from('blogs').select('*').order('created_at', { ascending: false });

        if (c) setComments(c);
        if (m) setMessages(m);
        if (v) setVisitors(v);
        if (p) setProjects(p);
        if (b) setBlogs(b);
    };

    // --- CMS ACTIONS ---
    const handleProjectSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingProject) {
                // UPDATE EXISTING
                const { error } = await supabase.from('projects').update(newProject).eq('id', editingProject.id);
                if (error) throw error;
                alert("Project Updated!");
            } else {
                // INSERT NEW
                const { error } = await supabase.from('projects').insert([newProject]);
                if (error) throw error;
                alert("Project Added!");
            }

            setShowProjectModal(false);
            setEditingProject(null);
            setNewProject({ title: '', description: '', image_url: '', details: '', link_url: '', code_url: '' });
            fetchData();
        } catch (err) {
            console.error(err);
            alert("Error saving project: " + err.message);
        }
    };

    const openEditModal = (project) => {
        setEditingProject(project);
        setNewProject({
            title: project.title,
            description: project.description,
            image_url: project.image_url,
            details: project.details,
            link_url: project.link_url,
            code_url: project.code_url
        });
        setShowProjectModal(true);
    };

    const handleAddBlog = async (e) => {
        e.preventDefault();
        try {
            const { error } = await supabase.from('blogs').insert([{ ...newBlog, is_published: true }]);
            if (error) throw error;
            setShowBlogModal(false);
            setNewBlog({ title: '', excerpt: '', content: '', image_url: '' });
            fetchData();
            alert("Blog Post Added!");
        } catch (err) {
            console.error(err);
            alert("Error adding blog: " + err.message);
        }
    };

    const deleteItem = async (table, id) => {
        if (!confirm('Delete this item? Used/Legacy items might reappear if they are fallbacks.')) return;
        await supabase.from(table).delete().eq('id', id);
        fetchData();
    };

    const togglePin = async (id, currentStatus) => {
        await supabase.from('comments').update({ is_pinned: !currentStatus }).eq('id', id);
        fetchData();
    };

    const toggleLike = async (id, currentStatus) => {
        try {
            await supabase.from('comments').update({ is_liked_by_admin: !currentStatus }).eq('id', id);
            fetchData();
        } catch (error) {
            console.error("Error toggling like:", error);
            alert("Failed to toggle like. Check DB schema.");
        }
    };

    const handleReply = async (id, replyText) => {
        if (!replyText) return;
        try {
            await supabase.from('comments').update({ admin_reply: replyText }).eq('id', id);
            fetchData();
        } catch (error) {
            console.error("Error replying:", error);
            alert("Failed to save reply. Check DB schema.");
        }
    };


    // --- VISUALIZATION HELPERS ---
    const getDeviceStats = () => {
        let mobile = 0;
        let desktop = 0;
        visitors.forEach(v => {
            if (/Mobi|Android/i.test(v.user_agent)) mobile++;
            else desktop++;
        });
        const total = mobile + desktop || 1;
        return { mobile, desktop, mobilePct: (mobile / total) * 100, desktopPct: (desktop / total) * 100 };
    };

    const getPageStats = () => {
        const stats = visitors.reduce((acc, v) => {
            let label = "Unknown Action";
            if (v.page_visited === '/') label = "Viewed Home";
            else if (v.page_visited === '/#projects') label = "Browsed Projects";
            else if (v.page_visited === '/#about') label = "Read About Me";
            else if (v.page_visited === '/#contact') label = "Visited Contact";
            else if (v.page_visited.includes('admin')) label = "Admin Attempt";
            else label = `Visited ${v.page_visited}`;

            acc[label] = (acc[label] || 0) + 1;
            return acc;
        }, {});
        // Find max for scaling
        const max = Math.max(...Object.values(stats), 1);
        return { stats, max };
    };

    // --- VIEW ---
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center text-white">
                <form onSubmit={handleLogin} className="bg-gray-900 p-8 rounded-xl border border-gray-700 shadow-2xl">
                    <h1 className="text-2xl font-bold mb-4">Admin Access</h1>
                    <input type="password" placeholder="Enter PIN" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-black/50 border border-gray-600 p-3 rounded w-full mb-4 text-white outline-none focus:border-cyan-500" />
                    <button className="w-full bg-cyan-600 p-3 rounded font-bold hover:bg-cyan-500 transition-colors">Unlock</button>
                    {!ADMIN_PASSWORD && <p className="text-red-500 text-xs mt-2">Warning: VITE_ADMIN_PASSWORD not set in .env</p>}
                </form>
            </div>
        );
    }

    const deviceStats = getDeviceStats();
    const pageStats = getPageStats();

    return (
        <div className="min-h-screen bg-black text-white p-6 font-sans">
            <header className="flex flex-col md:flex-row justify-between items-center mb-10 border-b border-gray-800 pb-4 gap-4">
                <h1 className="text-3xl font-bold text-cyan-400 tracking-wider">COMMAND CENTER</h1>
                <div className="flex flex-wrap justify-center gap-3">
                    {['comments', 'messages', 'visitors', 'content'].map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab)} className={`px-5 py-2 rounded-lg font-bold transition-all ${activeTab === tab ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/30' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                    <button onClick={() => setIsAuthenticated(false)} className="px-5 py-2 rounded-lg bg-red-900/50 hover:bg-red-700 text-red-200 border border-red-800">Logout</button>
                </div>
            </header>

            <div className="max-w-7xl mx-auto">
                {/* --- COMMENTS TAB --- */}
                {activeTab === 'comments' && (
                    <div className="grid gap-4">
                        <div className="bg-cyan-900/10 border border-cyan-500/30 p-4 rounded-xl mb-4">
                            <h3 className="text-cyan-400 font-bold mb-3 flex items-center gap-2">📢 Post Official Announcement</h3>
                            <form onSubmit={(e) => { e.preventDefault(); /* Use existing logic logic from previous file if needed, reusing simplified here */ }} className="flex gap-2">
                                <input placeholder="Feature coming soon..." disabled className="flex-grow bg-black/50 border border-gray-700 rounded px-4 py-3 text-gray-500 cursor-not-allowed" />
                            </form>
                        </div>
                        {comments.map(c => (
                            <div key={c.id} className={`p-5 rounded-xl border ${c.is_pinned ? 'bg-yellow-500/5 border-yellow-500/30' : 'bg-gray-900/50 border-gray-800'}`}>
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="font-bold text-white text-lg">{c.name}</span>
                                            <span className="text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded">{new Date(c.created_at).toLocaleDateString()}</span>
                                            {c.is_pinned && <span className="text-[10px] bg-yellow-500 text-black px-2 py-0.5 rounded font-bold">PINNED</span>}
                                            {c.is_liked_by_admin && <span className="text-[10px] bg-pink-500 text-white px-2 py-0.5 rounded font-bold">LIKED</span>}
                                        </div>
                                        <p className="text-gray-300 mb-3">{c.message}</p>

                                        {/* Reply Display */}
                                        {c.admin_reply && (
                                            <div className="mb-2 text-sm text-cyan-400 bg-cyan-900/10 p-2 rounded border border-cyan-900/50">
                                                <span className="font-bold">Replied: </span> {c.admin_reply}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex gap-2">
                                        <button onClick={() => toggleLike(c.id, c.is_liked_by_admin)} className={`p-2 rounded text-xs transition-colors ${c.is_liked_by_admin ? 'bg-pink-600 text-white' : 'bg-gray-700 text-gray-400 hover:bg-gray-600'}`}>
                                            {c.is_liked_by_admin ? 'Unlike' : 'Like'}
                                        </button>
                                        <button onClick={() => togglePin(c.id, c.is_pinned)} className="p-2 bg-yellow-700/50 hover:bg-yellow-600 rounded text-xs text-white">
                                            {c.is_pinned ? 'Unpin' : 'Pin'}
                                        </button>
                                        <button onClick={() => deleteItem('comments', c.id)} className="text-white bg-red-900 hover:bg-red-700 text-xs px-3 rounded">Delete</button>
                                    </div>
                                </div>

                                {/* Reply Input */}
                                <form
                                    className="mt-2 flex gap-2"
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        const input = e.target.elements.replyInput;
                                        handleReply(c.id, input.value);
                                        input.value = '';
                                    }}
                                >
                                    <input
                                        name="replyInput"
                                        type="text"
                                        placeholder="Write a reply..."
                                        className="flex-grow bg-black/30 border border-gray-700 rounded px-3 py-2 text-sm text-white focus:border-cyan-500 outline-none"
                                    />
                                    <button type="submit" className="bg-cyan-700 hover:bg-cyan-600 text-white px-4 py-2 rounded text-xs font-bold">
                                        Reply
                                    </button>
                                </form>
                            </div>
                        ))}
                    </div>
                )}

                {/* --- MESSAGES TAB --- */}
                {activeTab === 'messages' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {messages.map(m => (
                            <div key={m.id} className="p-6 rounded-2xl border border-gray-800 bg-gray-900/50 hover:border-cyan-500/30 transition-colors">
                                <h3 className="text-xl font-bold text-white mb-1">{m.name}</h3>
                                <p className="text-cyan-400 text-sm mb-4">{m.email}</p>
                                <div className="bg-black/40 p-4 rounded-xl text-gray-300 text-sm min-h-[100px] mb-4">{m.message}</div>
                                <div className="flex justify-between items-center text-xs text-gray-500">
                                    <span>{new Date(m.created_at).toLocaleDateString()}</span>
                                    <button onClick={() => deleteItem('messages', m.id)} className="text-red-500 hover:text-red-400">Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* --- VISITORS TAB (VISUALIZATION) --- */}
                {activeTab === 'visitors' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* CHART 1: DEVICE TYPE (PIE CHART) */}
                        <div className="bg-gray-900/50 p-8 rounded-3xl border border-gray-800 flex flex-col items-center justify-center">
                            <h3 className="text-xl font-bold text-cyan-400 mb-8 w-full text-center border-b border-gray-800 pb-4">Device Layout</h3>

                            <div className="relative w-64 h-64 rounded-full shadow-2xl" style={{
                                background: `conic-gradient(#0891b2 0% ${deviceStats.mobilePct}%, #3b0764 ${deviceStats.mobilePct}% 100%)`
                            }}>
                                <div className="absolute inset-4 bg-gray-900 rounded-full flex items-center justify-center flex-col">
                                    <span className="text-3xl font-bold text-white">{visitors.length}</span>
                                    <span className="text-xs text-gray-500 uppercase tracking-widest">Total Visits</span>
                                </div>
                            </div>

                            <div className="flex gap-8 mt-8 w-full justify-center">
                                <div className="text-center">
                                    <div className="w-3 h-3 bg-cyan-600 rounded-full mx-auto mb-2"></div>
                                    <div className="font-bold text-2xl">{deviceStats.mobile}</div>
                                    <div className="text-xs text-gray-500 uppercase">Mobile</div>
                                </div>
                                <div className="text-center">
                                    <div className="w-3 h-3 bg-purple-900 rounded-full mx-auto mb-2"></div>
                                    <div className="font-bold text-2xl">{deviceStats.desktop}</div>
                                    <div className="text-xs text-gray-500 uppercase">Desktop</div>
                                </div>
                            </div>
                        </div>

                        {/* CHART 2: USER ACTIONS (VERTICAL BAR) */}
                        <div className="bg-gray-900/50 p-8 rounded-3xl border border-gray-800">
                            <h3 className="text-xl font-bold text-cyan-400 mb-8 border-b border-gray-800 pb-4 text-center">User Activity Log</h3>
                            <div className="flex items-end justify-center gap-4 h-64 w-full px-4">
                                {Object.entries(pageStats.stats).map(([label, count]) => {
                                    const heightPct = (count / pageStats.max) * 100;
                                    return (
                                        <div key={label} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                                            {/* Tooltip */}
                                            <div className="absolute -top-10 opacity-0 group-hover:opacity-100 bg-gray-800 text-white text-xs px-2 py-1 rounded transition-opacity whitespace-nowrap z-10 pointer-events-none border border-gray-600">
                                                {label}: {count}
                                            </div>

                                            <motion.div
                                                initial={{ height: 0 }}
                                                animate={{ height: `${heightPct}%` }}
                                                className="w-full max-w-[40px] bg-gradient-to-t from-cyan-900 to-cyan-500 rounded-t-lg hover:brightness-110 transition-all min-h-[4px]"
                                            />
                                            <span className="text-[10px] text-gray-500 mt-2 truncate w-full text-center">{label.split(' ')[0]}...</span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        {/* RAW DATA TABLE */}
                        <div className="lg:col-span-2 bg-gray-900/50 p-6 rounded-3xl border border-gray-800 overflow-hidden">
                            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-6">Recent Traffic Source</h3>
                            <table className="w-full text-left text-sm text-gray-400">
                                <thead className="bg-black/40 text-gray-200">
                                    <tr>
                                        <th className="p-4">Time</th>
                                        <th className="p-4">Activity</th>
                                        <th className="p-4">Source</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {visitors.slice(0, 10).map(v => (
                                        <tr key={v.id} className="border-b border-gray-800 hover:bg-white/5 transition-colors">
                                            <td className="p-4">{new Date(v.created_at).toLocaleTimeString()}</td>
                                            <td className="p-4 text-cyan-400 font-medium">{v.page_visited}</td>
                                            <td className="p-4 max-w-[200px] truncate">{v.referrer || 'Direct'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* --- CMS TAB (FUNCTIONAL) --- */}
                {activeTab === 'content' && (
                    <div className="flex flex-col gap-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* PROJECTS MANAGEMENT */}
                            <div className="bg-gray-900 p-6 rounded-2xl border border-gray-700 h-full flex flex-col">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-bold text-cyan-400">Projects ({projects.length})</h2>
                                    <button onClick={() => { setEditingProject(null); setNewProject({ title: '', description: '', image_url: '', details: '', link_url: '', code_url: '' }); setShowProjectModal(true); }} className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-lg font-bold text-sm">+ Add New</button>
                                </div>
                                <div className="space-y-3 flex-1 overflow-y-auto max-h-[500px] pr-2 custom-scrollbar">
                                    {projects.map(p => (
                                        <div key={p.id} className="p-4 bg-black/40 rounded-xl border border-gray-800 flex justify-between items-center group hover:border-cyan-500/30 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <img src={p.image_url} className="w-10 h-10 rounded bg-gray-800 object-cover" />
                                                <div>
                                                    <div className="font-bold text-white text-sm">{p.title}</div>
                                                    <div className="text-xs text-gray-500 truncate max-w-[200px]">{p.description}</div>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button onClick={() => openEditModal(p)} className="text-cyan-500 hover:text-cyan-400 text-xs bg-cyan-900/10 p-2 rounded hover:bg-cyan-900/30 transition-colors">Edit</button>
                                                <button onClick={() => deleteItem('projects', p.id)} className="text-red-500 hover:text-red-400 text-xs bg-red-900/10 p-2 rounded hover:bg-red-900/30 transition-colors">Delete</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* BLOG MANAGEMENT */}
                            <div className="bg-gray-900 p-6 rounded-2xl border border-gray-700 h-full flex flex-col">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-bold text-purple-400">Blog Posts ({blogs.length})</h2>
                                    <button onClick={() => setShowBlogModal(true)} className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg font-bold text-sm">+ Add Post</button>
                                </div>
                                <div className="space-y-3 flex-1 overflow-y-auto max-h-[500px] pr-2 custom-scrollbar">
                                    {blogs.map(b => (
                                        <div key={b.id} className="p-4 bg-black/40 rounded-xl border border-gray-800 flex justify-between items-center group hover:border-purple-500/30 transition-colors">
                                            <div>
                                                <div className="font-bold text-white text-sm">{b.title}</div>
                                                <div className="text-xs text-gray-500">{new Date(b.created_at).toLocaleDateString()}</div>
                                            </div>
                                            <button onClick={() => deleteItem('blogs', b.id)} className="text-red-500 hover:text-red-400 text-xs bg-red-900/10 p-2 rounded hover:bg-red-900/30 transition-colors">Delete</button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* MODALS */}
            <AnimatePresence>
                {showProjectModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-gray-900 w-full max-w-lg p-6 rounded-2xl border border-gray-700 shadow-2xl">
                            <h2 className="text-xl font-bold mb-4 text-white">{editingProject ? "Edit Project" : "Add New Project"}</h2>
                            <form onSubmit={handleProjectSubmit} className="space-y-3">
                                <input required placeholder="Title" className="w-full bg-black/50 border border-gray-700 p-3 rounded text-white" value={newProject.title} onChange={e => setNewProject({ ...newProject, title: e.target.value })} />
                                <input required placeholder="Short Description" className="w-full bg-black/50 border border-gray-700 p-3 rounded text-white" value={newProject.description} onChange={e => setNewProject({ ...newProject, description: e.target.value })} />
                                <input required placeholder="Image URL (Unsplash/Imgur)" className="w-full bg-black/50 border border-gray-700 p-3 rounded text-white" value={newProject.image_url} onChange={e => setNewProject({ ...newProject, image_url: e.target.value })} />
                                <textarea required placeholder="Full Details" rows="3" className="w-full bg-black/50 border border-gray-700 p-3 rounded text-white" value={newProject.details} onChange={e => setNewProject({ ...newProject, details: e.target.value })}></textarea>
                                <div className="flex gap-2">
                                    <input placeholder="Link URL (Optional)" className="flex-1 bg-black/50 border border-gray-700 p-3 rounded text-white" value={newProject.link_url} onChange={e => setNewProject({ ...newProject, link_url: e.target.value })} />
                                    <input placeholder="Code URL (Optional)" className="flex-1 bg-black/50 border border-gray-700 p-3 rounded text-white" value={newProject.code_url} onChange={e => setNewProject({ ...newProject, code_url: e.target.value })} />
                                </div>
                                <div className="flex gap-2 pt-4">
                                    <button type="button" onClick={() => setShowProjectModal(false)} className="flex-1 py-3 rounded font-bold bg-gray-800 text-gray-300 hover:bg-gray-700">Cancel</button>
                                    <button type="submit" className="flex-1 py-3 rounded font-bold bg-cyan-600 text-white hover:bg-cyan-500">
                                        {editingProject ? "Update Project" : "Save Project"}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}

                {showBlogModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-gray-900 w-full max-w-lg p-6 rounded-2xl border border-gray-700 shadow-2xl">
                            <h2 className="text-xl font-bold mb-4 text-white">Add Blog Post</h2>
                            <form onSubmit={handleAddBlog} className="space-y-3">
                                <input required placeholder="Title" className="w-full bg-black/50 border border-gray-700 p-3 rounded text-white" value={newBlog.title} onChange={e => setNewBlog({ ...newBlog, title: e.target.value })} />
                                <input required placeholder="Excerpt (Short summary)" className="w-full bg-black/50 border border-gray-700 p-3 rounded text-white" value={newBlog.excerpt} onChange={e => setNewBlog({ ...newBlog, excerpt: e.target.value })} />
                                <input required placeholder="Image URL (Unsplash/Imgur)" className="w-full bg-black/50 border border-gray-700 p-3 rounded text-white" value={newBlog.image_url} onChange={e => setNewBlog({ ...newBlog, image_url: e.target.value })} />
                                <textarea required placeholder="Content (Supports simple text)" rows="6" className="w-full bg-black/50 border border-gray-700 p-3 rounded text-white" value={newBlog.content} onChange={e => setNewBlog({ ...newBlog, content: e.target.value })}></textarea>
                                <div className="flex gap-2 pt-4">
                                    <button type="button" onClick={() => setShowBlogModal(false)} className="flex-1 py-3 rounded font-bold bg-gray-800 text-gray-300 hover:bg-gray-700">Cancel</button>
                                    <button type="submit" className="flex-1 py-3 rounded font-bold bg-purple-600 text-white hover:bg-purple-500">Publish Post</button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
