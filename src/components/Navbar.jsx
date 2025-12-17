import React, { useState, useEffect } from 'react';
import { useLanguage } from '../lib/LanguageContext';
import BorderBeam from './BorderBeam';

export default function Navbar() {
    const { t, language, toggleLanguage } = useLanguage();
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
                    {[
                        { id: 'home', label: t.nav_home },
                        { id: 'about', label: t.nav_about },
                        { id: 'projects', label: t.nav_projects },
                        { id: 'contact', label: t.nav_contact }
                    ].map((item) => {
                        const isActive = activeSection === item.id;

                        return (
                            <button
                                key={item.id}
                                onClick={() => scrollToSection(item.id)}
                                className={`px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-medium rounded-full transition-all duration-300 ${isActive
                                    ? 'bg-cyan-500 text-black shadow-[0_0_20px_rgba(6,182,212,0.4)] font-bold'
                                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                                    }`}
                            >
                                {item.label}
                            </button>
                        );
                    })}


                    {/* Language Toggle */}
                    <div className="pl-2 border-l border-white/10 ml-2">
                        <button
                            onClick={toggleLanguage}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 transition-all text-[10px] font-bold"
                        >
                            <span className={language === 'id' ? 'text-cyan-400' : 'text-gray-500'}>ID</span>
                            <span className="text-gray-600">/</span>
                            <span className={language === 'en' ? 'text-cyan-400' : 'text-gray-500'}>EN</span>
                        </button>
                    </div>
                </div>
            </nav>
        </div>
    );
}
