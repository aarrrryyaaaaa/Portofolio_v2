import React, { useState, useEffect } from 'react';
import BorderBeam from './BorderBeam';

export default function Navbar() {
    const [activeSection, setActiveSection] = useState('home');

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            setActiveSection(id);
        }
    };

    useEffect(() => {
        const sections = ['home', 'about', 'projects', 'contact'];

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            },
            {
                rootMargin: '-50% 0px -50% 0px' // Trigger when section is in the middle of viewport
            }
        );

        sections.forEach((id) => {
            const element = document.getElementById(id);
            if (element) observer.observe(element);
        });

        return () => observer.disconnect();
    }, []);

    return (
        <div className="fixed top-6 left-0 w-full z-50 flex justify-center pointer-events-none px-4">
            <nav className="relative pointer-events-auto flex items-center gap-2 p-3 pl-5 pr-5 rounded-full border border-white/10 bg-black/80 backdrop-blur-xl shadow-2xl transition-all hover:scale-105 overflow-hidden group">

                {/* Robust Border Beam */}
                <BorderBeam />

                {/* Content Buffer */}
                <div className="absolute inset-[1px] bg-gray-950 rounded-full z-0" />

                {/* Logo */}
                <div className="relative z-10 pr-6 border-r border-white/10">
                    <span className="text-xl font-bold tracking-tighter text-white">
                        ATS<span className="text-cyan-400">.</span>
                    </span>
                </div>

                {/* Links */}
                <div className="relative z-10 flex items-center gap-1 pl-2">
                    {['Home', 'About', 'Projects', 'Contact'].map((item) => {
                        const id = item.toLowerCase();
                        const isActive = activeSection === id;

                        return (
                            <button
                                key={item}
                                onClick={() => scrollToSection(id)}
                                className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 ${isActive
                                        ? 'bg-cyan-500 text-black shadow-[0_0_20px_rgba(6,182,212,0.4)] font-bold'
                                        : 'text-gray-400 hover:text-white hover:bg-white/10'
                                    }`}
                            >
                                {item}
                            </button>
                        );
                    })}
                </div>
            </nav>
        </div>
    );
}
