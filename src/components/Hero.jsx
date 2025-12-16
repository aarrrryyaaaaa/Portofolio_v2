import { useState, useEffect } from 'react';
import VelocityText from './VelocityText';
import LogoWall from './LogoWall';
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

export default function Hero() {
    const [text, setText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [loopNum, setLoopNum] = useState(0);
    const [delta, setDelta] = useState(100);

    const toRotate = ["Front End Developer", "UI/UX Enthusiast", "Creative Coder"];
    const period = 2000;

    useEffect(() => {
        let ticker = setInterval(() => {
            tick();
        }, delta);
        return () => clearInterval(ticker);
    }, [text, delta]);

    const tick = () => {
        let i = loopNum % toRotate.length;
        let fullText = toRotate[i];
        let updatedText = isDeleting ? fullText.substring(0, text.length - 1) : fullText.substring(0, text.length + 1);
        setText(updatedText);
        if (isDeleting) { setDelta(prevDelta => prevDelta / 2); }
        if (!isDeleting && updatedText === fullText) { setIsDeleting(true); setDelta(period); }
        else if (isDeleting && updatedText === '') { setIsDeleting(false); setLoopNum(loopNum + 1); setDelta(100); }
        else { setDelta(100); }
    };

    return (
        <section id="home" className="relative w-full min-h-screen flex flex-col pt-32 pb-10 overflow-hidden">

            {/* Scroll Velocity Text - Re-positioned and fully visible */}
            <div className="absolute top-32 left-0 w-full z-0 opacity-100 mix-blend-normal">
                <VelocityText />
            </div>

            {/* Content Container */}
            <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-10 items-center flex-grow relative z-10 mt-20">

                {/* Left: Text */}
                <SectionWrapper>
                    <div className="text-left z-20">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="inline-block px-3 py-1 mb-4 rounded-full border border-cyan-500/30 bg-cyan-900/20 text-cyan-400 text-xs font-mono animate-pulse cursor-default"
                        >
                            ✨ Innovation For the Future
                        </motion.div>

                        <h1 className="text-5xl font-black tracking-tighter text-white mb-4 leading-tight">
                            WELCOME TO <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
                                MY PORTFOLIO
                            </span>
                        </h1>

                        <div className="text-xl font-mono text-gray-400 mb-6 h-8 flex items-center">
                            <span>I'm a </span>
                            <span className="ml-2 text-white font-bold border-r-2 border-cyan-400 pr-1 animate-pulse">
                                {text}
                            </span>
                        </div>

                        <p className="max-w-md text-gray-500 mb-8 leading-relaxed text-sm">
                            I craft responsive and visually engaging websites using React, Tailwind CSS, and modern web technologies.
                        </p>

                        <div className="flex space-x-4">
                            {/* Animated Border Button with Robust Implementation */}
                            <div className="relative group rounded-lg inline-block">
                                <a
                                    href="/CV%20Arya%20Toni%20Saputra.pdf"
                                    download="CV_Arya_Toni_Saputra.pdf"
                                    className="relative z-20 rounded-lg bg-gray-900 text-white font-bold px-8 py-3 overflow-hidden border border-transparent block"
                                >
                                    Download CV
                                </a>
                                {/* Border Beam Wrapper */}
                                <div className="absolute -inset-[2px] rounded-xl z-10">
                                    <BorderBeam />
                                </div>
                            </div>
                        </div>
                    </div>
                </SectionWrapper>

                {/* Right: Tilt Image */}
                <SectionWrapper delay={0.2}>
                    <div className="h-full w-full flex items-center justify-center relative z-10">
                        <TiltImage
                            src="/1.png"
                            alt="Arya Toni Saputra"
                        />
                    </div>
                </SectionWrapper>
            </div>

            {/* Logo Wall (Loops) */}
            <div className="relative z-20 w-full overflow-hidden mt-8 border-t border-white/5 bg-black/20 backdrop-blur-sm">
                <LogoWall />
            </div>

        </section>
    );
}
