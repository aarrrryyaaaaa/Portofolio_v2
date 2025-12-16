import { motion } from 'framer-motion';

const logos = [
    { name: "React", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
    { name: "Node", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
    { name: "Tailwind", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg" },
    { name: "Figma", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg" },
    { name: "Git", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
    { name: "Docker", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" },
    { name: "AWS", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-plain-wordmark.svg" }
];

export default function LogoWall() {
    return (
        <div className="relative flex overflow-x-hidden group bg-cyan-900/10 backdrop-blur-sm border-y border-cyan-500/10 py-6">
            <div className="animate-marquee whitespace-nowrap flex space-x-12">
                {[...logos, ...logos, ...logos].map((logo, index) => (
                    <div key={index} className="flex items-center space-x-2 text-gray-400 font-bold text-xl uppercase opacity-70 hover:opacity-100 hover:text-cyan-400 transition-all cursor-default">
                        <img src={logo.icon} alt={logo.name} className="h-8 w-8 object-contain" />
                        <span>{logo.name}</span>
                    </div>
                ))}
            </div>

            {/* Duplicate for seamless loop */}
            <div className="absolute top-0 py-6 animate-marquee2 whitespace-nowrap flex space-x-12">
                {[...logos, ...logos, ...logos].map((logo, index) => (
                    <div key={index} className="flex items-center space-x-2 text-gray-400 font-bold text-xl uppercase opacity-70 hover:opacity-100 hover:text-cyan-400 transition-all cursor-default">
                        <img src={logo.icon} alt={logo.name} className="h-8 w-8 object-contain" />
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
