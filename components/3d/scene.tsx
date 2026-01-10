"use client";

import { Canvas } from "@react-three/fiber";

export default function Scene() {
    return (
        <div className="fixed inset-0 z-[-1] pointer-events-none opacity-40">
            <Canvas camera={{ position: [0, 0, 10], fov: 35 }}>
                <ambientLight intensity={0.5} />
                <mesh>
                    <boxGeometry args={[1, 1, 1]} />
                    <meshStandardMaterial color="#666" />
                </mesh>
            </Canvas>
        </div>
    );
}
