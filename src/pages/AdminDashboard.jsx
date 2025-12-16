import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { motion } from 'framer-motion';

export default function AdminDashboard() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [activeTab, setActiveTab] = useState('comments');

    // Data States
    const [comments, setComments] = useState([]);
    const [messages, setMessages] = useState([]);
    const [visitors, setVisitors] = useState([]);

    const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;

    useEffect(() => {
        document.title = "ADMIN - ARYA TONI SAPUTRA";
        return () => {
            document.title = "ARYA TONI SAPUTRA"; // Revert to default
        };
    }, []);

    const handleLogin = (e) => {
        e.preventDefault();
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
        // Fetch last 100 visitors
        const { data: v } = await supabase.from('visitors').select('*').order('created_at', { ascending: false }).limit(100);

        if (c) setComments(c);
        if (m) setMessages(m);
        if (v) setVisitors(v);
    };

    // --- ACTIONS ---

    const deleteComment = async (id) => {
        if (!confirm('Delete this comment?')) return;
        await supabase.from('comments').delete().eq('id', id);
        fetchData();
    };

    const togglePin = async (id, currentStatus) => {
        await supabase.from('comments').update({ is_pinned: !currentStatus }).eq('id', id);
        fetchData();
    };

    const deleteMessage = async (id) => {
        if (!confirm('Delete this message?')) return;
        await supabase.from('messages').delete().eq('id', id);
        fetchData();
    };

    // --- RENDER ---

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center text-white">
                <form onSubmit={handleLogin} className="bg-gray-900 p-8 rounded-xl border border-gray-700">
                    <h1 className="text-2xl font-bold mb-4">Admin Access</h1>
                    <input
                        type="password"
                        placeholder="Enter PIN"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-black/50 border border-gray-600 p-2 rounded w-full mb-4 text-white"
                    />
                    <button className="w-full bg-cyan-600 p-2 rounded font-bold hover:bg-cyan-500">Unlock</button>
                    {!ADMIN_PASSWORD && <p className="text-red-500 text-xs mt-2">Warning: VITE_ADMIN_PASSWORD not set in .env</p>}
                </form>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white p-8 pt-24 font-sans">
            <header className="flex justify-between items-center mb-10 border-b border-gray-800 pb-4">
                <h1 className="text-3xl font-bold text-cyan-400">COMMAND CENTER</h1>
                <div className="flex gap-4">
                    <button onClick={() => setActiveTab('comments')} className={`px-4 py-2 rounded ${activeTab === 'comments' ? 'bg-cyan-600' : 'bg-gray-800'}`}>Comments ({comments.length})</button>
                    <button onClick={() => setActiveTab('messages')} className={`px-4 py-2 rounded ${activeTab === 'messages' ? 'bg-cyan-600' : 'bg-gray-800'}`}>Messages ({messages.length})</button>
                    <button onClick={() => setActiveTab('visitors')} className={`px-4 py-2 rounded ${activeTab === 'visitors' ? 'bg-cyan-600' : 'bg-gray-800'}`}>Visitors</button>
                    <button onClick={() => setIsAuthenticated(false)} className="px-4 py-2 rounded bg-red-900 hover:bg-red-700">Logout</button>
                </div>
            </header>

            <div className="max-w-6xl mx-auto">
                {/* COMMENTS TAB */}
                {activeTab === 'comments' && (
                    <div className="grid gap-4">
                        {comments.map(c => (
                            <div key={c.id} className={`p-4 rounded-lg border flex justify-between items-center ${c.is_pinned ? 'bg-yellow-900/20 border-yellow-500' : 'bg-gray-900 border-gray-700'}`}>
                                <div>
                                    <div className="flex gap-2 items-end mb-1">
                                        <span className="font-bold text-lg">{c.name}</span>
                                        <span className="text-xs text-gray-500">{new Date(c.created_at).toLocaleString()}</span>
                                        {c.is_pinned && <span className="text-xs bg-yellow-500 text-black px-2 rounded font-bold">PINNED</span>}
                                    </div>
                                    <p className="text-gray-300">{c.message}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => togglePin(c.id, c.is_pinned)} className="p-2 bg-yellow-700/50 hover:bg-yellow-600 rounded text-xs">
                                        {c.is_pinned ? 'Unpin' : 'Pin'}
                                    </button>
                                    <button onClick={() => deleteComment(c.id)} className="p-2 bg-red-900/50 hover:bg-red-600 rounded text-xs">Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* MESSAGES TAB */}
                {activeTab === 'messages' && (
                    <div className="grid gap-4">
                        {messages.length === 0 && <p className="text-gray-500">No messages yet.</p>}
                        {messages.map(m => (
                            <div key={m.id} className="p-6 rounded-lg border border-gray-700 bg-gray-900">
                                <div className="flex justify-between mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-white">{m.name}</h3>
                                        <p className="text-cyan-400 text-sm">{m.email}</p>
                                    </div>
                                    <span className="text-xs text-gray-500">{new Date(m.created_at).toLocaleString()}</span>
                                </div>
                                <div className="bg-black/50 p-4 rounded text-gray-300 whitespace-pre-wrap">
                                    {m.message}
                                </div>
                                <div className="mt-4 flex justify-end">
                                    <button onClick={() => deleteMessage(m.id)} className="px-4 py-2 bg-red-900 hover:bg-red-600 rounded text-sm text-white">Delete Message</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* VISITORS TAB */}
                {activeTab === 'visitors' && (
                    <div className="bg-gray-900 rounded-lg border border-gray-700 overflow-hidden">
                        <table className="w-full text-left text-sm text-gray-400">
                            <thead className="bg-gray-800 text-gray-200 uppercase font-medium">
                                <tr>
                                    <th className="p-3">Time</th>
                                    <th className="p-3">Page</th>
                                    <th className="p-3">Referrer</th>
                                    <th className="p-3">User Agent</th>
                                </tr>
                            </thead>
                            <tbody>
                                {visitors.map(v => (
                                    <tr key={v.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                                        <td className="p-3">{new Date(v.created_at).toLocaleString()}</td>
                                        <td className="p-3 text-cyan-400">{v.page_visited}</td>
                                        <td className="p-3 truncate max-w-[150px]">{v.referrer || '-'}</td>
                                        <td className="p-3 truncate max-w-[200px]">{v.user_agent}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
