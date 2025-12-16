import { motion } from 'framer-motion';

const logos = [
    { name: "React", icon: "⚛️" },
    { name: "Next", icon: "N" },
    { name: "Node", icon: "🟩" },
    { name: "JS", icon: "🟨" },
    { name: "TS", icon: "🟦" },
    { name: "Tailwind", icon: "🌊" },
    { name: "Three", icon: "🧊" },
    { name: "Figma", icon: "🎨" },
    { name: "Git", icon: "🐙" },
    { name: "AWS", icon: "☁️" }
];

export default function LogoWall() {
    return (
        <div className="relative flex overflow-x-hidden group bg-cyan-900/10 backdrop-blur-sm border-y border-cyan-500/10 py-6">
            <div className="animate-marquee whitespace-nowrap flex space-x-12">
                {[...logos, ...logos, ...logos].map((logo, index) => (
                    <div key={index} className="flex items-center space-x-2 text-gray-400 font-bold text-xl uppercase opacity-70 hover:opacity-100 hover:text-cyan-400 transition-all cursor-default">
                        <span className="text-2xl">{logo.icon}</span>
                        <span>{logo.name}</span>
                    </div>
                ))}
            </div>

            {/* Duplicate for seamless loop - CSS animation is safer for simple infinite scrollers than Framer Motion sometimes */}
            <div className="absolute top-0 py-6 animate-marquee2 whitespace-nowrap flex space-x-12">
                {[...logos, ...logos, ...logos].map((logo, index) => (
                    <div key={index} className="flex items-center space-x-2 text-gray-400 font-bold text-xl uppercase opacity-70 hover:opacity-100 hover:text-cyan-400 transition-all cursor-default">
                        <span className="text-2xl">{logo.icon}</span>
                        <span>{logo.name}</span>
                    </div>
                ))}
            </div>
            <style jsx>{`
                .animate-marquee {
                    animation: marquee 25s linear infinite;
                }
                .animate-marquee2 {
                    animation: marquee2 25s linear infinite;
                    margin-left: 0; /* Adjust overlaps if needed */
                }
                @keyframes marquee {
                    0% { transform: translateX(0%); }
                    100% { transform: translateX(-100%); }
                }
                @keyframes marquee2 {
                    0% { transform: translateX(100%); }
                    100% { transform: translateX(0%); }
                }
            `}</style>
        </div>
    );
}
