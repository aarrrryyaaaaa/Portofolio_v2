import { useState, Suspense, lazy } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Route, Switch } from "wouter";
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Squares from './components/Squares';
import Preloader from './components/Preloader';
import VisitorTracker from './components/VisitorTracker';

// Lazy Load Admin to keep bundle small
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

export default function App() {
    const [start, setStart] = useState(false);

    // Main Portfolio Content
    const PortfolioContent = () => (
        <>
            <AnimatePresence mode="wait">
                {!start && <Preloader onEnter={() => setStart(true)} />}
            </AnimatePresence>

            <VisitorTracker />

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
                        © 2028 Arya Toni Saputra. Built with React, Tailwind CSS, and Framer Motion.
                    </footer>
                </div>
            )}
        </>
    );

    return (
        <Suspense fallback={<div className="bg-black min-h-screen"></div>}>
            <Switch>
                <Route path="/" component={PortfolioContent} />
                <Route path="/admin-panel-secret" component={AdminDashboard} />
                {/* Fallback for unknown routes */}
                <Route component={PortfolioContent} />
            </Switch>
        </Suspense>
    );
}
