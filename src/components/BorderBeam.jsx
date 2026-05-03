export default function BorderBeam({
    className = "",
    size = 100 // Unused in this robust version but kept for prop compat
}) {
    return (
        <div className={`absolute inset-0 z-0 overflow-hidden rounded-[inherit] pointer-events-none ${className}`}>
            {/* Spinning Gradient */}
            <div className="absolute -inset-[100%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#00000000_50%,#06b6d4_50%,#00000000_100%)] opacity-100" />

            {/* Mask to make it a border */}
            <div className="absolute inset-[1px] bg-gray-900 rounded-[inherit] z-10" />
        </div>
    );
}
