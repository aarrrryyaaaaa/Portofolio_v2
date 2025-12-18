import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import { useLanguage } from '../lib/LanguageContext';
import MLDashboard from './MLDashboard';
import EcommerceSystem from './EcommerceSystem';

const SectionWrapper = ({ children, delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: "easeOut", delay }}
    >
        {children}
    </motion.div>
);

export default function Projects() {
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState('projects');
    const [iframeLoading, setIframeLoading] = useState(true);

    // Data States
    const [projects, setProjects] = useState([]);
    const [skills, setSkills] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (selectedProject) setIframeLoading(true);
    }, [selectedProject]);


    const certificates = [
        { title: "AWS Solutions (Coming Soon)", desc: "2028", img: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=500" },
        { title: "Google Cloud (Coming Soon)", desc: "2028", img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500" },
        { title: "Meta Front-End (Coming Soon)", desc: "2028", img: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=500" }
    ];

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const { data: p } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
            const { data: s } = await supabase.from('skills').select('*').order('level', { ascending: false });

            // MERGE DB DATA WITH FALLBACKS
            let finalProjects = p || [];
            let finalSkills = s || [];

            // SAFEGUARD: Ensure projects is an array
            if (!Array.isArray(finalProjects)) finalProjects = [];

            // Check if critical ML project is missing
            if (!finalProjects.find(pro => pro && pro.id === 'interactive_ml')) {
                const mlProject = {
                    id: 'interactive_ml',
                    title: 'Machine Learning Dashboard',
                    description: 'Real-time Neural Network Visualization',
                    image_url: 'https://plus.unsplash.com/premium_photo-1683121710572-7723bd2e235d?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                    details: 'An interactive dashboard allowing users to visualize and manipulate neural network parameters in real-time. Built with React, Three.js, and TensorFlow.js.',
                    link_url: '#',
                    code_url: '#'
                };
                finalProjects = [mlProject, ...finalProjects];
            }

            // CLEANED UP: No more forced injection of "Ecommerce" or "Legacy Portfolio".
            // Trust the DB.

            // Re-sort by created_at desc (or whatever logic preferred)
            finalProjects.sort((a, b) => {
                if (!a || !b) return 0;
                return (a.id === 'interactive_ml' ? -1 : 1);
            });

            // Check if skills are empty or too few (Overwrite fallback with FULL LIST)
            // Ensure skills is array
            if (!Array.isArray(finalSkills)) finalSkills = [];

            if (finalSkills.length < 5) {
                // ... (Fallback skills logic) ...
                finalSkills = [
                    // Frontend
                    { id: 101, name: "React", category: "fe", icon_url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
                    { id: 103, name: "Tailwind", category: "fe", icon_url: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg" },

                    // Backend
                    { id: 201, name: "Node.js", category: "be", icon_url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
                    { id: 202, name: "Express", category: "be", icon_url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg" },
                    { id: 203, name: "Python", category: "be", icon_url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
                    { id: 204, name: "PHP", category: "be", icon_url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg" },

                    // Database
                    { id: 302, name: "MySQL", category: "db", icon_url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" },
                    { id: 304, name: "Supabase", category: "db", icon_url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/supabase/supabase-original.svg" },

                    // Tools
                    { id: 401, name: "Figma", category: "tools", icon_url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg" },
                    { id: 402, name: "Git", category: "tools", icon_url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
                    { id: 403, name: "VS Code", category: "tools", icon_url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg" },
                    { id: 404, name: "Postman", category: "tools", icon_url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postman/postman-original.svg" },
                ];
            }

            setProjects(finalProjects);
            setSkills(finalSkills);

        } catch (error) {
            console.error("Error fetching projects/skills:", error);
            // Don't crash entirely, set empty arrays
            setProjects([]);
            setSkills([]);
        } finally {
            setLoading(false);
        }
    };

    // Helper to filter skills by category
    const getSkillsByCategory = (cat) => {
        if (!Array.isArray(skills)) return [];
        return skills.filter(s => s && (s.category === cat || (!s.category && cat === 'fe')));
    };

    const renderSkillGroup = (categoryKey, title) => {
        const groupSkills = getSkillsByCategory(categoryKey);
        if (groupSkills.length === 0) return null;

        return (
            <div className="mb-12 last:mb-0 w-full">
                <h3 className="text-xl font-bold text-cyan-400 mb-6 border-l-4 border-cyan-500 pl-4">{title}</h3>
                <div className="flex flex-wrap gap-6">
                    {groupSkills.map((s) => (
                        s ? (
                            <motion.div
                                key={s.id || Math.random()}
                                whileHover={{ scale: 1.1, y: -5, borderColor: '#06b6d4', backgroundColor: 'rgba(6,182,212,0.1)' }}
                                className="p-4 bg-gray-900/50 rounded-2xl border border-white/10 flex flex-col items-center gap-3 backdrop-blur-sm cursor-default shadow-lg hover:shadow-cyan-500/20 transition-all w-28 h-28 justify-center"
                            >
                                <img src={s.icon_url} alt={s.name || 'Skill'} className="w-10 h-10 object-contain" />
                                <span className="font-semibold text-gray-300 text-xs text-center">{s.name}</span>
                            </motion.div>
                        ) : null
                    ))}
                </div>
            </div>
        );
    };

    // Feature Detection Helpers - ROBUST CRASH PROOF
    const isInteractiveML = (p) => {
        if (!p) return false;
        try {
            const t = p.title ? p.title.toLowerCase() : '';
            return p.id === 'interactive_ml' || t.includes('interactive ml') || t.includes('machine learning');
        } catch (e) { return false; }
    };

    const isEcommerce = (p) => {
        if (!p) return false;
        try {
            const t = p.title ? p.title.toLowerCase() : '';
            return p.id === 'ecommerce_v2' || t.includes('e-commerce') || t.includes('ecommerce') || t.includes('toko') || t.includes('shop') || t.includes('market');
        } catch (e) { return false; }
    };

    const isLegacy = (p) => {
        if (!p) return false;
        try {
            const t = p.title ? p.title.toLowerCase() : '';
            const d = p.description ? p.description.toLowerCase() : '';
            return p.id === 'portfolio_v1' || t.includes('legacy') || t.includes('portfolio v1') || t.includes('old') || d.includes('previous') || t.includes('sebelumnya') || t.includes('lama');
        } catch (e) { return false; }
    };

    return (
        <section id="projects" className="relative w-full min-h-screen py-20">
            <div className="container mx-auto px-6">

                <SectionWrapper>
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-white mb-2">{t.projects_title || 'Projects'}</h2>
                        <p className="text-gray-500">{t.projects_subtitle || 'Showcase'}</p>
                    </div>
                </SectionWrapper>

                {/* Tab Switcher */}
                <SectionWrapper delay={0.1}>
                    <div className="flex justify-center mb-12">
                        <div className="flex bg-black/40 backdrop-blur-md p-1.5 rounded-full border border-white/10 relative">
                            {[
                                { id: 'projects', label: t.projects_tab_projects || 'Projects' },
                                { id: 'certificates', label: t.projects_tab_certs || 'Certificates' },
                                { id: 'skills', label: t.projects_tab_skills || 'Skills' }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`relative px-8 py-2.5 rounded-full text-sm font-bold transition-colors z-10 ${activeTab === tab.id ? "text-white" : "text-gray-400 hover:text-white"}`}
                                >
                                    {activeTab === tab.id && (
                                        <motion.div
                                            layoutId="active-pill"
                                            className="absolute inset-0 bg-gray-700/80 rounded-full shadow-inner border border-white/5 -z-10"
                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        />
                                    )}
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </SectionWrapper>

                {/* Content Grid */}
                <div className="min-h-[500px] w-full relative">
                    <AnimatePresence mode='wait'>

                        {/* PROJECTS TAB */}
                        {activeTab === 'projects' && (
                            <motion.div
                                key="projects-grid"
                                variants={{
                                    hidden: { opacity: 0 },
                                    show: {
                                        opacity: 1,
                                        transition: { staggerChildren: 0.15 }
                                    },
                                    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } }
                                }}
                                initial="hidden"
                                animate="show"
                                exit="exit"
                                className="grid grid-cols-1 md:grid-cols-3 gap-8"
                            >
                                {Array.isArray(projects) && projects.map((p) => (
                                    p ? (
                                        <motion.div
                                            key={p.id || Math.random()}
                                            variants={{
                                                hidden: { y: 30, opacity: 0 },
                                                show: { y: 0, opacity: 1 }
                                            }}
                                            whileHover={{ y: -8, scale: 1.02 }}
                                            onClick={() => setSelectedProject(p)}
                                            className="group relative h-80 bg-gray-900 rounded-2xl overflow-hidden cursor-pointer border border-white/5 shadow-xl transform transition-all duration-300"
                                        >
                                            <img src={p.image_url} alt={p.title || 'Project'} className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-700" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex flex-col justify-end p-6">
                                                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                                    <h3 className="text-xl font-bold text-white mb-2 drop-shadow-md">{p.title || 'Untitled'}</h3>
                                                    <p className="text-gray-300 text-sm line-clamp-2 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">{p.description || ''}</p>
                                                    <span className="inline-block px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-full shadow-lg transition-colors">
                                                        {t.projects_view_details || 'View Details'}
                                                    </span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ) : null
                                ))}
                            </motion.div>
                        )}

                        {/* CERTIFICATES TAB */}
                        {activeTab === 'certificates' && (
                            <motion.div
                                key="certs-grid"
                                variants={{
                                    hidden: { opacity: 0 },
                                    show: {
                                        opacity: 1,
                                        transition: { staggerChildren: 0.1 }
                                    },
                                    exit: { opacity: 0 }
                                }}
                                initial="hidden"
                                animate="show"
                                exit="exit"
                                className="grid grid-cols-1 md:grid-cols-3 gap-8"
                            >
                                {certificates.map((c, i) => (
                                    <motion.div
                                        key={i}
                                        variants={{
                                            hidden: { scale: 0.9, opacity: 0 },
                                            show: { scale: 1, opacity: 1 }
                                        }}
                                        whileHover={{ scale: 1.05 }}
                                        className="h-80 bg-gray-900 rounded-2xl border border-white/5 relative overflow-hidden group cursor-default shadow-lg transition-all"
                                    >
                                        <img src={c.img} className="w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500" />
                                        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-black/60 group-hover:bg-black/50 transition-all backdrop-blur-[2px] group-hover:backdrop-blur-none">
                                            <h3 className="font-bold text-xl text-white mb-2 drop-shadow-md text-center">{c.title}</h3>
                                            <span className="text-cyan-400 text-sm opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all font-mono bg-black/50 px-3 py-1 rounded-full">{c.desc}</span>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}

                        {/* SKILLS TAB - GROUPED */}
                        {activeTab === 'skills' && (
                            <motion.div
                                key="skills-grid"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.4 }}
                                className="flex flex-col items-start w-full max-w-5xl mx-auto"
                            >
                                {renderSkillGroup('fe', t.projects_skill_fe || 'Frontend')}
                                {renderSkillGroup('be', t.projects_skill_be || 'Backend')}
                                {renderSkillGroup('db', t.projects_skill_db || 'Database')}
                                {renderSkillGroup('tools', "Tools & DevOps")}
                            </motion.div>
                        )}

                    </AnimatePresence>
                </div>

                {/* MODAL OVERLAY */}
                <AnimatePresence>
                    {selectedProject && (
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 md:p-8"
                            onClick={() => setSelectedProject(null)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, y: 50 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 50 }}
                                className={`bg-[#0a0a0a] w-full max-w-7xl h-[85vh] overflow-hidden rounded-3xl border border-white/10 shadow-2xl relative flex flex-col`}
                                onClick={e => e.stopPropagation()}
                            >
                                <button onClick={() => setSelectedProject(null)} className="absolute top-4 right-4 z-50 w-10 h-10 bg-black/50 rounded-full text-white flex items-center justify-center hover:bg-red-500 transition-colors border border-white/10">✕</button>

                                {isInteractiveML(selectedProject) ? (
                                    <div className="w-full h-full p-2 md:p-6 overflow-hidden flex flex-col">
                                        <div className="flex-1 overflow-y-auto custom-scrollbar rounded-xl">
                                            <MLDashboard />
                                        </div>
                                    </div>
                                ) : isEcommerce(selectedProject) ? (
                                    <div className="w-full h-full relative overflow-hidden rounded-xl bg-gray-900 border border-white/10">
                                        <EcommerceSystem />
                                    </div>
                                ) : isLegacy(selectedProject) ? (
                                    <div className="w-full h-full flex flex-col relative bg-white">
                                        {/* Loading Spinner for Iframe */}
                                        {iframeLoading && (
                                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 z-10 transition-opacity duration-500">
                                                <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                                                <p className="text-gray-400 animate-pulse">Loading Legacy Site...</p>
                                            </div>
                                        )}

                                        <div className="flex-1 bg-white relative">
                                            <iframe
                                                src={selectedProject.link_url}
                                                className="w-full h-full border-0"
                                                title="Legacy Portfolio"
                                                onLoad={() => setIframeLoading(false)}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="overflow-y-auto h-full">
                                        <div className="h-64 w-full relative">
                                            <img src={selectedProject.image_url} className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
                                            <div className="absolute bottom-6 left-8">
                                                <h2 className="text-4xl font-bold text-white mb-2">{selectedProject.title}</h2>
                                                <p className="text-cyan-400 text-lg">{selectedProject.description}</p>
                                            </div>
                                        </div>

                                        <div className="p-8">
                                            <p className="text-gray-300 leading-relaxed text-lg mb-8">{selectedProject.details}</p>
                                            <div className="flex gap-4">
                                                {selectedProject.link_url && (
                                                    <a href={selectedProject.link_url} target="_blank" className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold transition-colors">
                                                        {t.projects_visit_site || 'Visit Site'}
                                                    </a>
                                                )}
                                                {selectedProject.code_url && (
                                                    <a href={selectedProject.code_url} target="_blank" className="px-6 py-3 border border-white/20 hover:bg-white/10 text-white rounded-xl font-bold transition-colors">
                                                        {t.projects_view_code || 'View Code'}
                                                    </a>
                                                )}
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
