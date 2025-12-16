import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MLDashboard from './MLDashboard';

const SectionWrapper = ({ children, delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.6, delay }}
    >
        {children}
    </motion.div>
);

export default function Projects() {
    const [activeTab, setActiveTab] = useState('projects');
    const [selectedProject, setSelectedProject] = useState(null);

    const projects = [
        { id: 1, title: "Portfolio V2", desc: "3D Interactive Showcase", img: "https://images.unsplash.com/photo-1550439062-609e1531270e?w=500", details: "Built with React, Three.js, and Framer Motion for a fully immersive web experience." },
        {
            id: 'interactive_ml', // Custom ID for special rendering
            title: "Machine Learning",
            desc: "Supervised & Unsupervised Models",
            img: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=500",
            details: "Interactive demonstration of Machine Learning algorithms including Linear Regression and K-Means clustering. Features real-time visualization of synthetic datasets."
        },
        { id: 3, title: "Design Sys", desc: "UI Components Library", img: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=500", details: "A comprehensive library of reusable UI components." }
    ];

    const certificates = [
        { title: "AWS Solutions", desc: "2028", img: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=500" },
        { title: "Google Cloud", desc: "2028", img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500" },
        { title: "Meta Front-End", desc: "2028", img: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=500" }
    ];

    const skills = [
        { name: "React", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
        { name: "Next.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" }, // Usually white, might need bg
        { name: "TypeScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
        { name: "Node.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
        { name: "Tailwind", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg" },
        { name: "Figma", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg" },
        { name: "Git", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" }
    ];

    return (
        <section id="projects" className="relative w-full min-h-screen py-20">
            <div className="container mx-auto px-6">
                {/* ... existing header code inside SectionWrapper ... */}
                <SectionWrapper>
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-white mb-2">Showcase</h2>
                        <p className="text-gray-500">My recent work, achievements, and technical skills.</p>
                    </div>
                </SectionWrapper>
                {/* ... wrapper ... */}

                {/* Gliding Toggle Switch - Zain Style */}
                <SectionWrapper delay={0.1}>
                    <div className="flex justify-center mb-12">
                        <div className="flex bg-black/40 backdrop-blur-md p-1.5 rounded-full border border-white/10 relative">
                            {['projects', 'certificates', 'skills'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`relative px-8 py-2.5 rounded-full text-sm font-bold transition-colors z-10 ${activeTab === tab ? "text-white" : "text-gray-400 hover:text-white"}`}
                                >
                                    {activeTab === tab && (
                                        <motion.div
                                            layoutId="active-pill"
                                            className="absolute inset-0 bg-gray-700/80 rounded-full shadow-inner border border-white/5 -z-10"
                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        />
                                    )}
                                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>
                </SectionWrapper>

                {/* Content Grid */}
                <div className="min-h-[400px]">
                    <AnimatePresence mode='wait'>
                        {/* ... projects tab ... */}
                        {activeTab === 'projects' && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                                className="grid grid-cols-1 md:grid-cols-3 gap-8"
                            >
                                {projects.map((p) => (
                                    <motion.div
                                        key={p.id}
                                        whileHover={{ y: -5 }}
                                        onClick={() => setSelectedProject(p)}
                                        className="group relative h-72 bg-gray-900 rounded-2xl overflow-hidden cursor-pointer border border-white/5 shadow-2xl"
                                    >
                                        <img src={p.img} alt={p.title} className="w-full h-full object-cover opacity-70 group-hover:scale-110 transition-transform duration-500" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col justify-end p-6">
                                            <h3 className="text-xl font-bold text-white mb-1">{p.title}</h3>
                                            <p className="text-gray-400 text-sm">{p.desc}</p>
                                            <span className="mt-2 text-cyan-400 text-xs font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0">View Details ↗</span>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}

                        {/* ... certificates tab ... */}
                        {activeTab === 'certificates' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {certificates.map((c, i) => (
                                    <motion.div
                                        key={i}
                                        whileHover={{ scale: 1.05 }}
                                        className="h-64 bg-gray-900 rounded-2xl border border-white/5 relative overflow-hidden group cursor-default shadow-lg hover:shadow-cyan-500/20 hover:border-cyan-500/50 transition-all"
                                    >
                                        <img src={c.img} className="w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500" />
                                        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-black/60 group-hover:bg-black/40 transition-all">
                                            <h3 className="font-bold text-xl text-white mb-1 drop-shadow-md">{c.title}</h3>
                                            <span className="text-cyan-400 text-sm opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all font-mono">{c.desc}</span>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}

                        {activeTab === 'skills' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap justify-center gap-6">
                                {skills.map((s, i) => (
                                    <motion.div
                                        key={i}
                                        whileHover={{ scale: 1.1, y: -5, borderColor: '#06b6d4', backgroundColor: 'rgba(6,182,212,0.1)' }}
                                        className="p-6 bg-gray-900/50 rounded-2xl border border-white/10 flex flex-col items-center gap-4 backdrop-blur-sm cursor-default shadow-lg hover:shadow-cyan-500/20 transition-all w-32 h-32 justify-center"
                                    >
                                        <img src={s.icon} alt={s.name} className="w-12 h-12 object-contain" />
                                        <span className="font-semibold text-gray-300 text-sm">{s.name}</span>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}

                    </AnimatePresence>
                </div>

                {/* RE-ADDED MODAL OVERLAY */}
                <AnimatePresence>
                    {selectedProject && (
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 md:p-8"
                            onClick={() => setSelectedProject(null)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, y: 50 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 50 }}
                                className={`bg-[#0a0a0a] w-full ${selectedProject.id === 'interactive_ml' ? 'max-w-7xl h-[90vh]' : 'max-w-4xl max-h-[90vh]'} overflow-hidden rounded-3xl border border-white/10 shadow-2xl relative flex flex-col`}
                                onClick={e => e.stopPropagation()}
                            >
                                {/* Close Button */}
                                <button onClick={() => setSelectedProject(null)} className="absolute top-4 right-4 z-50 w-10 h-10 bg-black/50 rounded-full text-white flex items-center justify-center hover:bg-red-500 transition-colors border border-white/10">✕</button>

                                {/* CONDITIONAL RENDERING FOR ML DASHBOARD */}
                                {selectedProject.id === 'interactive_ml' ? (
                                    <div className="w-full h-full p-6 pt-16 overflow-y-auto">
                                        <MLDashboard />
                                    </div>
                                ) : (
                                    // STANDARD PROJECT VIEW
                                    <div className="overflow-y-auto h-full">
                                        {/* Image Header */}
                                        <div className="h-64 w-full relative">
                                            <img src={selectedProject.img} className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
                                            <div className="absolute bottom-6 left-8">
                                                <h2 className="text-4xl font-bold text-white mb-2">{selectedProject.title}</h2>
                                                <p className="text-cyan-400 text-lg">{selectedProject.desc}</p>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="p-8">
                                            <p className="text-gray-300 leading-relaxed text-lg mb-8">{selectedProject.details}</p>
                                            <div className="flex gap-4">
                                                <button className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold transition-colors">Visit Site</button>
                                                <button className="px-6 py-3 border border-white/20 hover:bg-white/10 text-white rounded-xl font-bold transition-colors">View Code</button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </section>
    );
}
