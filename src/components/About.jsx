import TiltImage from './TiltImage';
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
    return (
        <section id="about" className="relative w-full min-h-screen flex items-center py-20">
            {/* Removing bg-[#020617] to let global grid show through. Using Backdrop blur if needed or just transparency */}

            <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

                {/* Left: Tilt Image (Replaced Lanyard) */}
                <SectionWrapper>
                    <div className="h-[500px] w-full flex items-center justify-center relative">
                        <TiltImage
                            src="public/2.png"
                            alt="Coding Setup"
                        />
                        <div className="absolute bottom-10 left-0 w-full text-center text-gray-500 text-sm pointer-events-none">
                            Hover for 3D Effect
                        </div>
                    </div>
                </SectionWrapper>

                {/* Right: Description */}
                <SectionWrapper delay={0.2}>
                    <div className="text-left">
                        <h2 className="text-5xl font-bold text-white mb-8">
                            ABOUT <span className="text-cyan-400">ME</span>
                        </h2>

                        <p className="text-gray-400 text-lg leading-relaxed mb-6">
                            I am a student of Informatics at Institut Teknologi Sains Bandung with a huge interest in Front-End Development, Modern Web Technologies and there are many more of my interests...
                        </p>

                        <motion.blockquote
                            whileHover={{ x: 10, borderLeftColor: "#22d3ee" }}
                            className="border-l-4 border-cyan-500 pl-4 py-2 italic text-gray-300 mb-8 bg-cyan-900/10 rounded-r cursor-pointer transition-all"
                        >
                            "Whoever strives shall succeed."
                        </motion.blockquote>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-4">
                            {[
                                { num: "13", lbl: "TOTAL PROJECTS" },
                                { num: "13", lbl: "CERTIFICATES" },
                                { num: "3", lbl: "YEARS EXP" }
                            ].map((stat, i) => (
                                <motion.div
                                    key={i}
                                    whileHover={{ scale: 1.05, borderColor: "#06b6d4" }}
                                    className="p-4 bg-gray-900/50 border border-gray-800 rounded-lg text-center transition-all cursor-default"
                                >
                                    <div className="text-3xl font-bold text-white">{stat.num}</div>
                                    <div className="text-xs text-gray-500 mt-1">{stat.lbl}</div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </SectionWrapper>

            </div>
        </section>
    );
}
