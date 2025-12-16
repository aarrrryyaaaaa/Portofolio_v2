import { useEffect } from 'react';
import { motion } from 'framer-motion';
import SpotlightGrid from './SpotlightGrid';

// Social Icons Data (SVGs)
const SocialIcons = () => (
    <div className="flex space-x-6 mt-8 z-50">
        {/* Github */}
        <a href="#" className="text-gray-400 hover:text-white hover:scale-110 transition-all">
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
        </a>
        {/* Instagram */}
        <a href="#" className="text-gray-400 hover:text-pink-500 hover:scale-110 transition-all">
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
        </a>
        {/* LinkedIn */}
        <a href="#" className="text-gray-400 hover:text-blue-500 hover:scale-110 transition-all">
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
        </a>
        {/* TikTok */}
        <a href="#" className="text-gray-400 hover:text-teal-400 hover:scale-110 transition-all">
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>
        </a>
    </div>
);

export default function Preloader({ onEnter }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onEnter();
        }, 3000);
        return () => clearTimeout(timer);
    }, [onEnter]);

    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#020617] text-white overflow-hidden"
        >
            {/* Background Layer: Spotlight Grid */}
            <div className="absolute inset-0 z-0">
                <SpotlightGrid />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
                className="text-center z-10 relative"
            >
                <h1 className="text-4xl md:text-6xl font-black tracking-widest mb-4 font-mono border-b-2 border-cyan-500 pb-2 drop-shadow-[0_0_15px_rgba(6,182,212,0.8)]">
                    ARYA TONI SAPUTRA
                </h1>

                <div className="flex flex-col items-center gap-4 mt-8">
                    <div className="flex items-center space-x-2 animate-pulse text-gray-400 text-sm tracking-widest uppercase">
                        <span>System Loading</span>
                        <span className="flex space-x-1">
                            <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0 }}>.</motion.span>
                            <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}>.</motion.span>
                            <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }}>.</motion.span>
                        </span>
                    </div>

                    <SocialIcons />
                </div>
            </motion.div>
        </motion.div>
    );
}
