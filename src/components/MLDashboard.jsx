import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- SYNTHETIC DATA GENERATORS ---
const generateLinearData = () => Array.from({ length: 20 }, (_, i) => ({
    x: i + 1,
    y: 2000 + (i * 1000) + (Math.random() * 1000 - 500) // Salary based on Exp
}));

const generateClusterData = () => {
    const c1 = Array.from({ length: 10 }, () => ({ x: 10 + Math.random() * 20, y: 10 + Math.random() * 20, c: '#fbbf24' })); // Yellow Cluster
    const c2 = Array.from({ length: 10 }, () => ({ x: 60 + Math.random() * 20, y: 70 + Math.random() * 20, c: '#06b6d4' })); // Cyan Cluster
    const c3 = Array.from({ length: 10 }, () => ({ x: 70 + Math.random() * 20, y: 20 + Math.random() * 20, c: '#f472b6' })); // Pink Cluster
    return [...c1, ...c2, ...c3];
};

// --- CODE SNIPPETS ---
const snippets = {
    linear: `import pandas as pd
from sklearn.linear_model import LinearRegression

# Load Dataset
data = pd.read_csv('salary_data.csv')
X = data[['YearsExperience']]
y = data[['Salary']]

# Train Model
model = LinearRegression()
model.fit(X, y)

# Predict
prediction = model.predict([[5.5]])`,

    forest: `from sklearn.ensemble import RandomForestRegressor

# Initialize Model
rf_model = RandomForestRegressor(n_estimators=100)

# Train
rf_model.fit(X_train, y_train)

# Feature Importance
importances = rf_model.feature_importances_`,

    clustering: `from sklearn.cluster import KMeans
from sklearn.decomposition import PCA

# Unsupervised - No Labels
kmeans = KMeans(n_clusters=3)
clusters = kmeans.fit_predict(X_scaled)

# PCA for Visualization (Dims reduction)
pca = PCA(n_components=2)
reduced = pca.fit_transform(X_scaled)`
};

export default function MLDashboard() {
    const [mode, setMode] = useState('supervised'); // supervised | unsupervised
    const [algo, setAlgo] = useState('linear'); // linear | forest | clustering | pca

    // Dataset States
    const [linearData] = useState(generateLinearData());
    const [clusterData] = useState(generateClusterData());

    return (
        <div className="w-full h-full flex flex-col">
            {/* Top Navigation: Learning Type */}
            <div className="flex gap-4 mb-6 border-b border-white/10 pb-4">
                <button
                    onClick={() => { setMode('supervised'); setAlgo('linear'); }}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${mode === 'supervised' ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/30' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
                >
                    Supervised Learning
                </button>
                <button
                    onClick={() => { setMode('unsupervised'); setAlgo('clustering'); }}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${mode === 'unsupervised' ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
                >
                    Unsupervised (PCA/Clustering)
                </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 flex-grow overflow-hidden">

                {/* LEFT: Controls & Code */}
                <div className="w-full lg:w-1/3 flex flex-col gap-6">
                    {/* Algorithm Selector */}
                    <div className="bg-black/30 p-4 rounded-xl border border-white/5">
                        <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-3">Select Algorithm</h3>
                        <div className="flex flex-col gap-2">
                            {mode === 'supervised' ? (
                                <>
                                    <button onClick={() => setAlgo('linear')} className={`p-3 rounded-lg text-left text-sm font-semibold transition-all border ${algo === 'linear' ? 'border-cyan-500 bg-cyan-900/20 text-cyan-400' : 'border-transparent hover:bg-white/5 text-gray-400'}`}>
                                        📊 Linear Regression
                                    </button>
                                    <button onClick={() => setAlgo('forest')} className={`p-3 rounded-lg text-left text-sm font-semibold transition-all border ${algo === 'forest' ? 'border-green-500 bg-green-900/20 text-green-400' : 'border-transparent hover:bg-white/5 text-gray-400'}`}>
                                        🌲 Random Forest
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button onClick={() => setAlgo('clustering')} className={`p-3 rounded-lg text-left text-sm font-semibold transition-all border ${algo === 'clustering' ? 'border-pink-500 bg-pink-900/20 text-pink-400' : 'border-transparent hover:bg-white/5 text-gray-400'}`}>
                                        🎯 K-Means Clustering
                                    </button>
                                    <button onClick={() => setAlgo('pca')} className={`p-3 rounded-lg text-left text-sm font-semibold transition-all border ${algo === 'pca' ? 'border-purple-500 bg-purple-900/20 text-purple-400' : 'border-transparent hover:bg-white/5 text-gray-400'}`}>
                                        📉 PCA (Dim Reduction)
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Code Snippet */}
                    <div className="bg-[#1e1e1e] rounded-xl border border-white/10 overflow-hidden flex-grow flex flex-col">
                        <div className="bg-[#2d2d2d] px-4 py-2 flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500" />
                            <div className="w-3 h-3 rounded-full bg-green-500" />
                            <span className="ml-2 text-xs text-gray-400 font-mono">model_training.py</span>
                        </div>
                        <div className="p-4 overflow-x-auto">
                            <pre className="font-mono text-xs md:text-sm text-gray-300 leading-relaxed">
                                <code>
                                    {algo === 'linear' && snippets.linear}
                                    {algo === 'forest' && snippets.forest}
                                    {(algo === 'clustering' || algo === 'pca') && snippets.clustering}
                                </code>
                            </pre>
                        </div>
                    </div>
                </div>

                {/* RIGHT: Visualizations */}
                <div className="w-full lg:w-2/3 bg-[#0f172a] rounded-2xl border border-white/5 p-8 relative flex flex-col shadow-inner">

                    {/* Header */}
                    <div className="mb-6 z-10">
                        <h2 className="text-xl md:text-3xl font-bold text-white mb-2 flex items-center gap-3">
                            {algo === 'linear' && <span className="text-cyan-400">📈</span>}
                            {algo === 'forest' && <span className="text-green-400">🌲</span>}
                            {algo === 'clustering' && <span className="text-pink-400">🎯</span>}
                            {algo === 'pca' && <span className="text-purple-400">📉</span>}

                            {algo === 'linear' && 'Linear Regression: Salary Prediction'}
                            {algo === 'forest' && 'Random Forest: Feature Importance'}
                            {algo === 'clustering' && 'K-Means Clustering'}
                            {algo === 'pca' && 'Principal Component Analysis'}
                        </h2>
                        <p className="text-gray-400 max-w-xl">
                            {algo === 'linear' && 'Fitting a linear equation to observed data. The red line minimizes the sum of squared residuals between observed and predicted salary.'}
                            {algo === 'forest' && 'An ensemble learning method that operates by constructing a multitude of decision trees. Shows which features impact the model most.'}
                            {algo === 'clustering' && 'Partitioning n observations into k clusters in which each observation belongs to the cluster with the nearest mean (centroid).'}
                            {algo === 'pca' && 'Dimensionality reduction that projects data onto principal components to maximize variance and reveal hidden structures.'}
                        </p>
                    </div>

                    {/* CHART CANVAS */}
                    <div className="flex-grow w-full relative bg-gray-900/50 rounded-xl border border-white/5 overflow-hidden">
                        {/* Grid Background */}
                        <div className="absolute inset-0 opacity-10"
                            style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
                        </div>

                        {/* 1. LINEAR REGRESSION CHART */}
                        {algo === 'linear' && (
                            <div className="relative w-full h-full p-8 flex items-end">
                                {/* Axes */}
                                <div className="absolute left-10 top-8 bottom-10 w-0.5 bg-gray-600"></div> {/* Y Axis */}
                                <div className="absolute left-10 right-8 bottom-10 h-0.5 bg-gray-600"></div> {/* X Axis */}

                                <div className="absolute -left-8 top-1/2 -rotate-90 text-xs text-cyan-500 font-mono tracking-widest">SALARY ($)</div>
                                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-cyan-500 font-mono tracking-widest">YEARS EXPERIENCE</div>

                                {/* Plot Area */}
                                <div className="relative w-full h-full ml-4 mb-2">
                                    {linearData.map((pt, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ scale: 0, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="absolute w-3 h-3 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.5)] border border-white/20 z-10 hover:scale-150 transition-transform cursor-pointer"
                                            style={{ left: `${(pt.x / 20) * 90}%`, bottom: `${((pt.y - 1500) / 25000) * 90}%` }}
                                        >
                                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 px-2 py-1 rounded text-[10px] text-white opacity-0 hover:opacity-100 whitespace-nowrap pointer-events-none">
                                                ${Math.round(pt.y).toLocaleString()} / {pt.x}yr
                                            </div>
                                        </motion.div>
                                    ))}

                                    {/* Trend Line (SVG) */}
                                    <svg className="absolute inset-0 pointer-events-none w-full h-full overflow-visible">
                                        <motion.line
                                            x1="5%" y1="90%" x2="90%" y2="10%"
                                            stroke="#ef4444" strokeWidth="4"
                                            strokeLinecap="round"
                                            initial={{ pathLength: 0 }}
                                            animate={{ pathLength: 1 }}
                                            transition={{ duration: 1.5, delay: 0.5, ease: "easeInOut" }}
                                            style={{ filter: 'drop-shadow(0 0 5px rgba(239,68,68,0.5))' }}
                                        />
                                        {/* Residuals Lines (Connecting dots to line) - Visual Polish */}
                                        {linearData.map((pt, i) => (
                                            <motion.line
                                                key={i}
                                                x1={`${(pt.x / 20) * 90}%`}
                                                y1={`${100 - ((pt.y - 1500) / 25000) * 90}%`}
                                                x2={`${(pt.x / 20) * 90}%`}
                                                y2={`${90 - ((pt.x / 20) * 80)}%`} // Approximate line equation fit visually
                                                stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="4 2"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 1.5 + (i * 0.05) }}
                                            />
                                        ))}
                                    </svg>
                                </div>
                            </div>
                        )}

                        {/* 2. RANDOM FOREST (Bar Chart) */}
                        {algo === 'forest' && (
                            <div className="w-full h-full flex flex-col justify-end px-12 pb-12 pt-8">
                                <div className="absolute left-10 top-8 bottom-12 w-0.5 bg-gray-600"></div> {/* Y Axis */}
                                <div className="absolute left-10 right-8 bottom-12 h-0.5 bg-gray-600"></div> {/* X Axis */}

                                <div className="flex items-end justify-around w-full h-full gap-8">
                                    {[
                                        { label: 'Experience', val: 0.85, color: 'from-green-400 to-green-600' },
                                        { label: 'Education', val: 0.65, color: 'from-emerald-400 to-emerald-600' },
                                        { label: 'Skill Level', val: 0.92, color: 'from-teal-400 to-teal-600' },
                                        { label: 'Location', val: 0.45, color: 'from-cyan-400 to-cyan-600' },
                                        { label: 'Gender', val: 0.15, color: 'from-slate-400 to-slate-600' }
                                    ].map((bar, i) => (
                                        <div key={i} className="flex flex-col items-center gap-3 flex-1 h-full justify-end group">
                                            <div className="font-bold text-white text-lg opacity-0 group-hover:opacity-100 transition-opacity -translate-y-2">{Math.round(bar.val * 100)}%</div>
                                            <motion.div
                                                initial={{ height: 0 }}
                                                animate={{ height: `${bar.val * 100}%` }}
                                                transition={{ type: "spring", stiffness: 100, damping: 15, delay: i * 0.1 }}
                                                className={`w-full rounded-t-lg bg-gradient-to-t ${bar.color} opacity-80 hover:opacity-100 transition-all shadow-lg hover:shadow-green-500/30 relative overflow-hidden`}
                                            >
                                                <div className="absolute inset-0 bg-white/10 skew-y-12 translate-y-full group-hover:translate-y-0 transition-transform duration-700"></div>
                                            </motion.div>
                                            <div className="text-xs md:text-sm font-bold text-gray-300 uppercase tracking-wide">{bar.label}</div>
                                        </div>
                                    ))}
                                </div>
                                <div className="absolute left-4 top-1/2 -rotate-90 text-xs text-green-500 font-bold tracking-widest">IMPORTANCE SCORE</div>
                            </div>
                        )}

                        {/* 3. CLUSTERING / PCA (Scatter Plot) */}
                        {(algo === 'clustering' || algo === 'pca') && (
                            <div className="relative w-full h-full">
                                {/* Centroids (Only for Clustering) */}
                                {algo === 'clustering' && [
                                    { x: 20, y: 20, c: '#fbbf24' },
                                    { x: 70, y: 80, c: '#06b6d4' },
                                    { x: 80, y: 30, c: '#f472b6' }
                                ].map((centroid, i) => (
                                    <motion.div
                                        key={`c-${i}`}
                                        initial={{ scale: 0 }}
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                        className="absolute w-6 h-6 border-4 rounded-full z-0 transform -translate-x-1/2 -translate-y-1/2"
                                        style={{ left: `${centroid.x}%`, top: `${centroid.y}%`, borderColor: centroid.c, boxShadow: `0 0 20px ${centroid.c}` }}
                                    >
                                        <div className="absolute inset-0 bg-white/20 rounded-full animate-ping"></div>
                                    </motion.div>
                                ))}

                                {/* Data Points */}
                                {clusterData.map((pt, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ x: 0, y: 0, opacity: 0 }}
                                        animate={{
                                            left: `${pt.x}%`,
                                            top: `${pt.y}%`,
                                            opacity: 1,
                                            scale: 1
                                        }}
                                        transition={{ duration: 0.8, delay: i * 0.01, type: "spring" }}
                                        className="absolute w-3 h-3 rounded-full border border-black/50 shadow-sm z-10"
                                        style={{ backgroundColor: algo === 'pca' ? (pt.x > 50 ? '#a855f7' : '#d8b4fe') : pt.c }}
                                    />
                                ))}

                                {/* PCA Arrows */}
                                {algo === 'pca' && (
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                        <svg className="w-full h-full overflow-visible">
                                            {/* Vector 1 */}
                                            <motion.line
                                                x1="50%" y1="50%" x2="80%" y2="20%"
                                                stroke="#a855f7" strokeWidth="4"
                                                markerEnd="url(#arrowhead)"
                                                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1 }}
                                            />
                                            {/* Vector 2 */}
                                            <motion.line
                                                x1="50%" y1="50%" x2="60%" y2="70%"
                                                stroke="#e9d5ff" strokeWidth="2"
                                                strokeDasharray="4 2"
                                                markerEnd="url(#arrowhead-small)"
                                                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 0.5 }}
                                            />
                                            <defs>
                                                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
                                                    <polygon points="0 0, 10 3.5, 0 7" fill="#a855f7" />
                                                </marker>
                                                <marker id="arrowhead-small" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
                                                    <polygon points="0 0, 10 3.5, 0 7" fill="#e9d5ff" />
                                                </marker>
                                            </defs>
                                        </svg>
                                        <div className="absolute top-[20%] right-[20%] text-purple-400 font-bold">PC1 (Max Variance)</div>
                                    </div>
                                )}

                                {/* Axis Labels for Unsupervised */}
                                <div className="absolute bottom-4 right-4 text-xs text-gray-500 font-mono">FEATURE 1 →</div>
                                <div className="absolute top-4 left-4 text-xs text-gray-500 font-mono rotate-90 origin-left">← FEATURE 2</div>
                            </div>
                        )}

                    </div>

                </div>
            </div>
        </div>
    );
}

