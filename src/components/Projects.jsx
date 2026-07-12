import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import { useLanguage } from '../lib/LanguageContext';


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
    const [certificates, setCertificates] = useState([]);
    const [settings, setSettings] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null);
    const [selectedCert, setSelectedCert] = useState(null);
    const [isLandscape, setIsLandscape] = useState(false);
    const [loading, setLoading] = useState(true);

    const handleProjectImageLoad = (e) => {
        const { naturalWidth, naturalHeight } = e.target;
        setIsLandscape(naturalWidth > naturalHeight);
    };

    useEffect(() => {
        if (selectedProject) setIframeLoading(true);
    }, [selectedProject]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const { data: p, error: pErr } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
            const { data: s, error: sErr } = await supabase.from('skills').select('*').order('level', { ascending: false });
            const { data: c, error: cErr } = await supabase.from('certificates').select('*');
            const { data: setts } = await supabase.from('site_settings').select('*').eq('id', 1).maybeSingle();

            if (cErr) console.error("Certificates fetch error:", cErr);

            // Filter out items where is_visible is explicitly false
            setProjects((p || []).filter(item => item.is_visible !== false));
            setSkills((s || []).filter(item => item.is_visible !== false));
            setCertificates((c || []).filter(item => item.is_visible !== false));
            
            if (setts) {
                setSettings(setts);
            }

        } catch (error) {
            console.error("Error fetching data:", error);
            setProjects([]);
            setSkills([]);
            setCertificates([]);
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
                <h3 className="text-xl font-bold text-orange-400 mb-6 border-l-4 border-orange-500 pl-4">{title}</h3>
                <div className="flex flex-wrap gap-6">
                    {groupSkills.map((s) => (
                        s ? (
                            <motion.div
                                key={s.id || Math.random()}
                                whileHover={{ scale: 1.1, y: -5, borderColor: '#f97316', backgroundColor: 'rgba(249,115,22,0.1)' }}
                                className="p-4 bg-gray-900/50 rounded-2xl border border-white/10 flex flex-col items-center gap-3 backdrop-blur-sm cursor-default shadow-lg hover:shadow-orange-500/20 transition-all w-28 h-28 justify-center"
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
                    {loading ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-12 h-12 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin"></div>
                        </div>
                    ) : (
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
                                                    <span className="inline-block px-4 py-2 bg-gradient-to-r from-cyan-600 to-orange-600 hover:from-cyan-500 hover:to-orange-500 text-white text-xs font-bold rounded-full shadow-lg transition-colors">
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
                                {certificates.map((c) => (
                                    <motion.div
                                        key={c.id}
                                        variants={{
                                            hidden: { scale: 0.9, opacity: 0 },
                                            show: { scale: 1, opacity: 1 }
                                        }}
                                        whileHover={{ y: -8, scale: 1.02 }}
                                        onClick={() => setSelectedCert(c)}
                                        className="h-80 bg-[#0a0a0a] rounded-2xl border border-white/5 relative overflow-hidden group cursor-pointer shadow-lg shadow-black/50 transition-all"
                                    >
                                        <img src={c.image_url} alt={c.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-6">
                                            <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                                <h3 className="font-bold text-lg text-white mb-1 drop-shadow-md">{c.name}</h3>
                                                <span className="text-orange-400 text-xs opacity-0 group-hover:opacity-100 transition-all font-mono font-bold">{c.issuer} • {c.year}</span>
                                            </div>
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
                    )}
                </div>

                {/* PROJECT MODAL */}
                <AnimatePresence>
                    {selectedProject && (
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 md:p-8"
                            onClick={() => setSelectedProject(null)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, y: 50 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 50 }}
                                className="bg-[#0a0a0a] w-full max-w-5xl h-[90vh] overflow-hidden rounded-3xl border border-white/10 shadow-2xl relative flex flex-col"
                                onClick={e => e.stopPropagation()}
                            >
                                <button onClick={() => setSelectedProject(null)} className="absolute top-4 right-4 z-50 w-10 h-10 bg-black/50 rounded-full text-white flex items-center justify-center hover:bg-red-500 transition-colors border border-white/10">✕</button>

                                {isLegacy(selectedProject) ? (
                                    <div className="w-full h-full flex flex-col relative bg-white">
                                        {iframeLoading && (
                                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 z-10">
                                                <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                                                <p className="text-gray-400 animate-pulse">Loading Legacy Site...</p>
                                            </div>
                                        )}
                                        <div className="flex-1 bg-white relative">
                                            <iframe src={selectedProject.link_url} className="w-full h-full border-0" title="Legacy Portfolio" onLoad={() => setIframeLoading(false)} />
                                        </div>
                                    </div>
                                ) : (
                                    isLandscape ? (
                                        /* LANDSCAPE: compact image on top, content below */
                                        <div className="overflow-y-auto h-full custom-scrollbar flex flex-col">
                                            <div className="w-full flex-shrink-0 bg-black flex items-center justify-center p-6 border-b border-white/5">
                                                <img
                                                    src={selectedProject.image_url}
                                                    className="max-h-64 w-auto rounded-xl object-contain shadow-xl"
                                                    alt={selectedProject.title}
                                                    onLoad={handleProjectImageLoad}
                                                />
                                            </div>
                                            <div className="p-8 flex flex-col gap-6">
                                                <div>
                                                    <h2 className="text-2xl md:text-3xl font-black text-white mb-2 leading-tight">{selectedProject.title}</h2>
                                                    <p className="text-orange-400 font-semibold text-sm">{selectedProject.description}</p>
                                                </div>
                                                {selectedProject.details && (
                                                    <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
                                                        <h3 className="text-xs font-black uppercase tracking-widest text-orange-400 mb-3">About This Project</h3>
                                                        <p className="text-gray-300 leading-relaxed text-sm">{selectedProject.details}</p>
                                                    </div>
                                                )}
                                                <div className="flex flex-wrap gap-4 pb-4">
                                                    {selectedProject.link_url && (
                                                        <a href={selectedProject.link_url} target="_blank" className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-600 to-orange-600 hover:from-cyan-500 hover:to-orange-500 text-white rounded-xl font-bold transition-all hover:scale-105 text-sm">
                                                            <span>🔗</span> {t.projects_visit_site || 'Visit Site'}
                                                        </a>
                                                    )}
                                                    {selectedProject.code_url && (
                                                        <a href={selectedProject.code_url} target="_blank" className="flex items-center gap-2 px-6 py-3 border border-white/20 hover:bg-white/10 text-white rounded-xl font-bold transition-all hover:scale-105 text-sm">
                                                            <span>💻</span> {t.projects_view_code || 'View Code'}
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        /* PORTRAIT: image fills left column at full height */
                                        <div className="flex h-full">
                                            <div className="w-1/2 flex-shrink-0 relative hidden md:block">
                                                <img src={selectedProject.image_url} className="w-full h-full object-cover" alt={selectedProject.title} onLoad={handleProjectImageLoad} />
                                                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0a0a0a]" />
                                            </div>
                                            <div className="flex-1 overflow-y-auto custom-scrollbar p-8 flex flex-col justify-start gap-6">
                                                <div className="md:hidden w-full h-52 relative rounded-2xl overflow-hidden flex-shrink-0">
                                                    <img src={selectedProject.image_url} className="w-full h-full object-cover" alt={selectedProject.title} />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
                                                </div>
                                                <div className="pt-4">
                                                    <h2 className="text-2xl md:text-3xl font-black text-white mb-2 leading-tight">{selectedProject.title}</h2>
                                                    <p className="text-orange-400 font-semibold text-sm">{selectedProject.description}</p>
                                                </div>
                                                {selectedProject.details && (
                                                    <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
                                                        <h3 className="text-xs font-black uppercase tracking-widest text-orange-400 mb-3">About This Project</h3>
                                                        <p className="text-gray-300 leading-relaxed text-sm">{selectedProject.details}</p>
                                                    </div>
                                                )}
                                                <div className="flex flex-wrap gap-4 pb-4">
                                                    {selectedProject.link_url && (
                                                        <a href={selectedProject.link_url} target="_blank" className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-600 to-orange-600 hover:from-cyan-500 hover:to-orange-500 text-white rounded-xl font-bold transition-all hover:scale-105 text-sm">
                                                            <span>🔗</span> {t.projects_visit_site || 'Visit Site'}
                                                        </a>
                                                    )}
                                                    {selectedProject.code_url && (
                                                        <a href={selectedProject.code_url} target="_blank" className="flex items-center gap-2 px-6 py-3 border border-white/20 hover:bg-white/10 text-white rounded-xl font-bold transition-all hover:scale-105 text-sm">
                                                            <span>💻</span> {t.projects_view_code || 'View Code'}
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                )}
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* CERTIFICATE LIGHTBOX MODAL */}
                <AnimatePresence>
                    {selectedCert && (
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 md:p-8"
                            onClick={() => setSelectedCert(null)}
                        >
                            <motion.div
                                initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.85, opacity: 0 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                className="relative w-full max-w-4xl flex flex-col items-center"
                                onClick={e => e.stopPropagation()}
                            >
                                <button onClick={() => setSelectedCert(null)} className="absolute -top-12 right-0 z-50 w-10 h-10 bg-white/10 rounded-full text-white flex items-center justify-center hover:bg-red-500 transition-colors border border-white/20 text-lg">✕</button>
                                {/* Full Certificate Image */}
                                <div className="w-full rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                                    <img
                                        src={selectedCert.image_url}
                                        alt={selectedCert.name}
                                        className="w-full h-auto object-contain"
                                    />
                                </div>
                                {/* Info Below */}
                                <div className="mt-6 text-center">
                                    <h2 className="text-2xl font-black text-white mb-2">{selectedCert.name}</h2>
                                    <p className="text-orange-400 font-mono font-bold text-sm">{selectedCert.issuer} &bull; {selectedCert.year}</p>
                                    {selectedCert.issuer && (
                                        <p className="text-gray-500 text-xs mt-2 uppercase tracking-widest">Tap outside to close</p>
                                    )}
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </section>
    );
}
