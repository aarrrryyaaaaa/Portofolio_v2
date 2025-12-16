import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Squares from './components/Squares'; // New BG
import Preloader from './components/Preloader';
import VisitorTracker from './components/VisitorTracker';

export default function App() {
    const [start, setStart] = useState(false);

    return (
        <>
            <AnimatePresence mode="wait">
                {!start && <Preloader onEnter={() => setStart(true)} />}
            </AnimatePresence>

            <VisitorTracker />

            {/* Squares Background - 2D Canvas based, no R3F Canvas needed here */}
            <div className="fixed inset-0 z-0 w-full h-full bg-[#060606]">
                <Squares
                    direction="diagonal"
                    speed={0.5}
                    borderColor="#222"
                    hoverFillColor="#353535ff"
                    squareSize={40}
                />
            </div>

            {start && (
                <div className="relative z-10 bg-transparent min-h-screen text-white font-sans selection:bg-cyan-500 selection:text-black">
                    <Navbar />
                    <main className="flex flex-col">
                        <Hero />
                        <About />
                        <Projects />
                        <Contact />
                    </main>

                    <footer className="py-8 text-center text-gray-500 text-sm border-t border-gray-800/50 backdrop-blur">
                        © 2028 Arya Toni Saputra. Built with React, Tailwind CSS, and PHP.
                    </footer>
                </div>
            )}
        </>
    );
}
