import { motion } from 'framer-motion';
import { useState } from 'react';

const SystemNode = ({ label, icon, onClick, isActive, x, y }) => (
    <motion.div
        className={`absolute w-24 h-24 rounded-2xl flex flex-col items-center justify-center cursor-pointer border-2 shadow-2xl z-10 ${isActive ? 'bg-cyan-900/80 border-cyan-400 scale-110' : 'bg-gray-900 border-gray-700 hover:border-gray-500'}`}
        style={{ left: x, top: y }}
        onClick={onClick}
        whileHover={{ scale: 1.05 }}
    >
        <div className="text-3xl mb-2">{icon}</div>
        <div className="text-xs text-center font-bold text-gray-300">{label}</div>
    </motion.div>
);

const Connection = ({ start, end, active }) => {
    // Simplified connection line logic (purely decorative for this prototype)
    // In a real implementation this would calculate SVG paths based on coordinates
    return (
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            <line x1={start.x + 48} y1={start.y + 48} x2={end.x + 48} y2={end.y + 48} stroke="#334155" strokeWidth="2" />
            {active && (
                <motion.circle r="4" fill="#06b6d4">
                    <animateMotion dur="2s" repeatCount="indefinite" path={`M${start.x + 48},${start.y + 48} L${end.x + 48},${end.y + 48}`} />
                </motion.circle>
            )}
        </svg>
    );
};

export default function EcommerceSystem() {
    const [selectedNode, setSelectedNode] = useState(null);

    const nodes = [
        { id: 'client', label: 'Client App', icon: '💻', x: '10%', y: '10%', desc: "React/Next.js Frontend. Users browse products and manage carts here." },
        { id: 'api', label: 'API Gateway', icon: '🌐', x: '50%', y: '30%', desc: "Node.js/Express Server. Routes requests, handles auth, and rate limiting." },
        { id: 'auth', label: 'Auth Service', icon: '🔒', x: '80%', y: '10%', desc: "JWT Authentication & OAuth handling user sessions." },
        { id: 'db', label: 'Database', icon: '🗄️', x: '50%', y: '70%', desc: "PostgreSQL Database. Stores users, products, orders, and transactions." },
        { id: 'payment', label: 'Payment', icon: '💳', x: '20%', y: '50%', desc: "Stripe/Midtrans Gateway. Securely processes credit card and bank transfers." }
    ];

    return (
        <div className="w-full h-full bg-slate-950 relative overflow-hidden p-8 flex flex-col">
            <h2 className="text-2xl font-bold text-white mb-2">E-Commerce Architecture (Coming Soon)</h2>
            <p className="text-gray-400 text-sm mb-8">Interactive System Design Preview. Click nodes to trace data flow.</p>

            <div className="relative flex-1 bg-slate-900/50 rounded-xl border border-white/5 shadow-inner">
                {/* Manually placed for this demo, usually would use a library */}
                <SystemNode {...nodes[0]} onClick={() => setSelectedNode(nodes[0])} isActive={selectedNode?.id === 'client'} x="10%" y="10%" />
                <SystemNode {...nodes[1]} onClick={() => setSelectedNode(nodes[1])} isActive={selectedNode?.id === 'api'} x="45%" y="40%" />
                <SystemNode {...nodes[2]} onClick={() => setSelectedNode(nodes[2])} isActive={selectedNode?.id === 'auth'} x="75%" y="15%" />
                <SystemNode {...nodes[3]} onClick={() => setSelectedNode(nodes[3])} isActive={selectedNode?.id === 'db'} x="45%" y="75%" />
                <SystemNode {...nodes[4]} onClick={() => setSelectedNode(nodes[4])} isActive={selectedNode?.id === 'payment'} x="15%" y="60%" />

                {/* Decorative Lines (simplified for CSS absolute positioning) */}
                {/* Requires accurate X/Y which is hard in percentage, providing text description instead of lines for robust code generation without complex math libraries */}

                {selectedNode && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        className="absolute bottom-4 right-4 bg-black/80 backdrop-blur border border-cyan-500/30 p-4 rounded-xl max-w-sm text-white"
                    >
                        <h3 className="font-bold text-cyan-400 mb-1">{selectedNode.label}</h3>
                        <p className="text-sm text-gray-300">{selectedNode.desc}</p>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
