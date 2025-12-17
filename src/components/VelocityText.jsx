import { useRef } from "react";
import {
    motion,
    useScroll,
    useSpring,
    useTransform,
    useMotionValue,
    useVelocity,
    useAnimationFrame
} from "framer-motion";
import { wrap } from "@motionone/utils";

function ParallaxText({ children, baseVelocity = 100 }) {
    const baseX = useMotionValue(0);
    const { scrollY } = useScroll();
    const scrollVelocity = useVelocity(scrollY);
    const smoothVelocity = useSpring(scrollVelocity, {
        damping: 50,
        stiffness: 400
    });
    const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
        clamp: false
    });

    const x = useTransform(baseX, (v) => `${wrap(-20, -45, v)}%`);

    const directionFactor = useRef(1);
    useAnimationFrame((t, delta) => {
        let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

        if (velocityFactor.get() < 0) {
            directionFactor.current = -1;
        } else if (velocityFactor.get() > 0) {
            directionFactor.current = 1;
        }

        moveBy += directionFactor.current * moveBy * velocityFactor.get();

        baseX.set(baseX.get() + moveBy);
    });

    return (
        <div className="overflow-hidden m-0 whitespace-nowrap flex flex-nowrap w-full">
            <motion.div className="flex whitespace-nowrap flex-nowrap uppercase text-5xl md:text-6xl font-black tracking-tighter" style={{ x }}>
                {children}
                {children}
                {children}
                {children}
            </motion.div>
        </div>
    );
}

export default function VelocityText() {
    return (
        // Removed opacity/mix-blend-overlay to ensure visibility as requested
        <section className="py-8 relative z-10 w-full overflow-hidden pointer-events-none select-none">
            <ParallaxText baseVelocity={-2}>
                <span className="text-gray-800 mr-12 block">ARYA TONI SAPUTRA</span>
                <span className="text-cyan-900/50 mr-12 block">ARYA TONI SAPUTRA</span>
            </ParallaxText>
            <ParallaxText baseVelocity={2}>
                <span className="text-cyan-900/50 mr-12 block">ARYA TONI SAPUTRA</span>
                <span className="text-gray-800 mr-12 block">ARYA TONI SAPUTRA</span>
            </ParallaxText>
        </section>
    );
}
