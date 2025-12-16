import { useRef, useEffect, useState } from 'react';

export default function Squares({
    direction = 'diagonal',
    speed = 0.5,
    borderColor = '#333',
    hoverFillColor = '#222',
    squareSize = 40
}) {
    const canvasRef = useRef(null);
    const requestRef = useRef(null);
    const numSquaresX = useRef();
    const numSquaresY = useRef();
    const gridOffset = useRef({ x: 0, y: 0 });
    const [hoveredSquare, setHoveredSquare] = useState(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            numSquaresX.current = Math.ceil(canvas.width / squareSize) + 1;
            numSquaresY.current = Math.ceil(canvas.height / squareSize) + 1;
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear

            const startX = Math.floor(gridOffset.current.x / squareSize) * squareSize;
            const startY = Math.floor(gridOffset.current.y / squareSize) * squareSize;

            for (let x = startX; x < canvas.width + squareSize; x += squareSize) {
                for (let y = startY; y < canvas.height + squareSize; y += squareSize) {
                    const squareX = x - (gridOffset.current.x % squareSize);
                    const squareY = y - (gridOffset.current.y % squareSize);

                    if (
                        hoveredSquare &&
                        Math.floor((x - startX) / squareSize) === hoveredSquare.x &&
                        Math.floor((y - startY) / squareSize) === hoveredSquare.y
                    ) {
                        ctx.fillStyle = hoverFillColor;
                        ctx.fillRect(squareX, squareY, squareSize, squareSize);
                    }

                    ctx.strokeStyle = borderColor;
                    ctx.strokeRect(squareX, squareY, squareSize, squareSize);
                }
            }

            // Move Grid
            const moveSpeed = speed;
            if (direction === 'right') gridOffset.current.x = (gridOffset.current.x - moveSpeed) % squareSize;
            else if (direction === 'left') gridOffset.current.x = (gridOffset.current.x + moveSpeed) % squareSize;
            else if (direction === 'up') gridOffset.current.y = (gridOffset.current.y + moveSpeed) % squareSize;
            else if (direction === 'down') gridOffset.current.y = (gridOffset.current.y - moveSpeed) % squareSize;
            else if (direction === 'diagonal') {
                gridOffset.current.x = (gridOffset.current.x - moveSpeed) % squareSize;
                gridOffset.current.y = (gridOffset.current.y - moveSpeed) % squareSize;
            }

            requestRef.current = requestAnimationFrame(draw);
        };

        const handleMouseMove = (e) => {
            const rect = canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            // Calculate grid aligned coordinates
            // This is an approximation for visual effect
            const startX = Math.floor(gridOffset.current.x / squareSize) * squareSize;
            const startY = Math.floor(gridOffset.current.y / squareSize) * squareSize;

            const hoveredX = Math.floor((mouseX + (gridOffset.current.x % squareSize)) / squareSize);
            const hoveredY = Math.floor((mouseY + (gridOffset.current.y % squareSize)) / squareSize);

            setHoveredSquare({ x: hoveredX, y: hoveredY });
        };

        const handleMouseLeave = () => {
            setHoveredSquare(null);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseleave', handleMouseLeave);
        requestRef.current = requestAnimationFrame(draw);

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseleave', handleMouseLeave);
            cancelAnimationFrame(requestRef.current);
        };
    }, [direction, speed, borderColor, hoverFillColor, squareSize, hoveredSquare]);

    return <canvas ref={canvasRef} className="w-full h-full border-0 block bg-[#060606]"></canvas>;
}
