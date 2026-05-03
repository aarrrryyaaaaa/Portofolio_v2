import { useRef, useEffect } from 'react';

export default function SpotlightGrid() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        let mouse = { x: -1000, y: -1000 };

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        const handleMouseMove = (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        };

        window.addEventListener('resize', resize);
        window.addEventListener('mousemove', handleMouseMove);
        resize();

        const gridSize = 40;
        const dotSize = 2;

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw Dots
            for (let x = 0; x < canvas.width; x += gridSize) {
                for (let y = 0; y < canvas.height; y += gridSize) {

                    // Calculate distance to mouse
                    const dx = x - mouse.x;
                    const dy = y - mouse.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    // Opacity based on distance (Spotlight effect)
                    const maxDist = 300;
                    let alpha = Math.max(0, 1 - dist / maxDist);
                    alpha = Math.pow(alpha, 3); // sharper falloff

                    if (alpha > 0.01) {
                        ctx.fillStyle = `rgba(6, 182, 212, ${alpha})`; // Cyan color
                        ctx.beginPath();
                        ctx.arc(x, y, dotSize, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }
            }

            animationFrameId = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return <canvas ref={canvasRef} className="fixed inset-0 z-0 bg-[#020617]" />;
}
