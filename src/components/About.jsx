import { useLanguage } from '../lib/LanguageContext';
import TiltImage from './TiltImage';
import BorderBeam from './BorderBeam';
import { motion } from 'framer-motion';

const SectionWrapper = ({ children, delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, y: 50, rotateX: -10 }}
        whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.8, delay, type: "spring" }}
        style={{ perspective: "1000px" }}
    >
        {children}
    </motion.div>
);

export default function About() {
    const { t } = useLanguage();

    return (
        <section id="about" className="relative w-full min-h-screen flex items-center py-20">
            {/* Removing bg-[#020617] to let global grid show through. Using Backdrop blur if needed or just transparency */}

            <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

                {/* Left: Tilt Image (Replaced Lanyard) */}
                <SectionWrapper>
                    <div className="h-[500px] w-full flex items-center justify-center relative">
                        <TiltImage
                            src="/2.png"
                            alt="Arya"
                        />
                    </div>
                </SectionWrapper>

                {/* Right: Description */}
                <SectionWrapper delay={0.2}>
                    <div className="text-left">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 flex flex-col gap-2">
                            <span>{t.about_title}</span>
                            <span className="text-cyan-400">ARYA TONI SAPUTRA</span>
                        </h2>

                        <p className="text-gray-400 text-lg leading-relaxed mb-6">
                            {t.about_desc}
                        </p>

                        {/* Download CV Button Moved Here */}
                        <div className="mb-8 relative group rounded-lg inline-block">
                            <a
                                href="/CV%20Arya%20Toni%20Saputra.pdf"
                                download="CV_Arya_Toni_Saputra.pdf"
                                className="relative z-20 rounded-lg bg-gray-900 text-white font-bold px-8 py-4 text-lg overflow-hidden border border-transparent block shadow-lg hover:shadow-cyan-500/50 transition-shadow"
                            >
                                Download CV
                            </a>
                            {/* Border Beam Wrapper */}
                            <div className="absolute -inset-[2px] rounded-xl z-10">
                                <BorderBeam />
                            </div>
                        </div>

                        {/* Animated Quote */}
                        <motion.blockquote
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            className="border-l-4 border-cyan-500 pl-4 py-2 italic text-gray-300 mb-8 bg-cyan-900/10 rounded-r shadow-sm"
                        >
                            <span className="text-cyan-400 font-bold text-lg">"</span>
                            {t.about_quote}
                            <span className="text-cyan-400 font-bold text-lg">"</span>
                            <motion.div
                                initial={{ width: 0 }}
                                whileInView={{ width: '100%' }}
                                transition={{ duration: 2, ease: "easeOut" }}
                                className="h-0.5 bg-gradient-to-r from-cyan-500 to-transparent mt-2"
                            />
                        </motion.blockquote>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-4 mb-10">
                            {[
                                { num: "3", lbl: t.about_stats_projects },
                                { num: "3", lbl: t.about_stats_certs },
                                { num: "0", lbl: t.about_stats_exp }
                            ].map((stat, i) => (
                                <motion.div
                                    key={i}
                                    whileHover={{ scale: 1.05, borderColor: "#06b6d4" }}
                                    className="p-4 bg-gray-900/50 border border-gray-800 rounded-lg text-center transition-all cursor-default hover:shadow-lg hover:shadow-cyan-900/10"
                                >
                                    <div className="text-3xl md:text-4xl font-bold text-white">{stat.num}</div>
                                    <div className="text-[10px] md:text-xs text-gray-500 mt-1">{stat.lbl}</div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Tech Stack Icons */}
                        <div>
                            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-6 border-b border-gray-800 pb-2 inline-block">
                                {t.about_core_tech}
                            </h3>
                            <div className="flex flex-wrap gap-4 items-center">
                                {[
                                    { name: 'React', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
                                    { name: 'Vite', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vitejs/vitejs-original.svg' },
                                    { name: 'Tailwind', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg' },
                                    { name: 'Node.js', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg' },
                                    { name: 'Supabase', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/supabase/supabase-original.svg' },
                                    { name: 'Figma', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg' },
                                    { name: 'Git', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg' }
                                ].map((tech) => (
                                    <motion.div
                                        key={tech.name}
                                        whileHover={{ y: -5 }}
                                        className="w-12 h-12 md:w-14 md:h-14 bg-gray-900 border border-gray-800 rounded-xl flex items-center justify-center p-2.5 shadow-sm hover:shadow-cyan-500/20 hover:border-cyan-500/50 transition-all cursor-help relative group"
                                    >
                                        <img src={tech.url} alt={tech.name} className="w-full h-full object-contain" />

                                        {/* Tooltip */}
                                        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] bg-black text-white px-2 py-1 rounded whitespace-nowrap pointer-events-none border border-gray-700">
                                            {tech.name}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </SectionWrapper>

            </div>
        </section>
    );
}
