import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import SectionWrapper from './SectionWrapper';

export default function Experience() {
    const [experiences, setExperiences] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchExperiences = async () => {
            const { data, error } = await supabase
                .from('experiences')
                .select('*')
                .order('start_date', { ascending: false });
            
            if (error) {
                console.error("Error fetching experiences:", error);
            } else {
                setExperiences((data || []).filter(item => item.is_visible !== false));
            }
            setLoading(false);
        };
        fetchExperiences();
    }, []);

    return (
        <SectionWrapper id="experience">
            <div className="relative max-w-4xl mx-auto px-4 md:px-0 mt-24 mb-24">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic mb-4">
                        Work <span className="text-cyan-500">Experience</span>
                    </h2>
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">
                        My Professional Journey & Internships
                    </p>
                </motion.div>

                {loading ? (
                    <div className="text-center text-cyan-500 font-bold animate-pulse">Loading Timeline...</div>
                ) : experiences.length === 0 ? (
                    <div className="text-center text-gray-500 font-bold">No experiences to show yet.</div>
                ) : (
                    <div className="relative">
                        {/* Vertical Timeline Line */}
                        <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 w-[2px] bg-white/10 h-full top-0"></div>

                        {experiences.map((exp, index) => (
                            <motion.div
                                key={exp.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className={`relative flex flex-col md:flex-row items-start md:items-center justify-between w-full mb-12 ${
                                    index % 2 === 0 ? 'md:flex-row-reverse' : ''
                                }`}
                            >
                                {/* Timeline Dot */}
                                <div className="absolute left-4 md:left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-cyan-500 border-4 border-[#060606] z-10"></div>

                                {/* Content Box */}
                                <div className={`w-full pl-12 md:pl-0 md:w-5/12 ${
                                    index % 2 === 0 ? 'md:text-left' : 'md:text-right'
                                }`}>
                                    <div className="bg-black/40 border border-white/5 p-6 rounded-3xl hover:border-cyan-500/30 transition-all group shadow-lg hover:shadow-cyan-500/10">
                                        <div className={`text-cyan-500 font-bold text-xs uppercase mb-2 inline-block px-3 py-1 bg-cyan-500/10 rounded-full`}>
                                            {exp.start_date} - {exp.end_date}
                                        </div>
                                        <h3 className="text-xl font-black text-white uppercase mb-1 mt-2">
                                            {exp.role}
                                        </h3>
                                        <h4 className="text-sm text-gray-400 font-bold uppercase mb-4">
                                            {exp.company}
                                        </h4>
                                        <p className="text-gray-500 text-sm leading-relaxed whitespace-pre-line">
                                            {exp.description}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </SectionWrapper>
    );
}
