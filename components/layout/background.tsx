"use client";

export default function Background() {
    return (
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
            {/* Base gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-950 to-black" />

            {/* Animated orbs */}
            <div className="absolute top-0 -left-40 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] animate-pulse"
                style={{ animationDuration: '8s' }} />
            <div className="absolute bottom-0 -right-40 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] animate-pulse"
                style={{ animationDuration: '10s', animationDelay: '2s' }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-600/5 rounded-full blur-[100px] animate-pulse"
                style={{ animationDuration: '12s', animationDelay: '4s' }} />

            {/* Grain overlay for texture */}
            <div className="absolute inset-0 opacity-[0.015]"
                style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }} />
        </div>
    );
}

