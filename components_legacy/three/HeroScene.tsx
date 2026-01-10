"use client";

export default function HeroScene() {
  return (
    <div className="absolute inset-0 -z-10">
      {/* Ambient background shapes using CSS */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-studio-accent/5 rounded-full blur-3xl animate-drift-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-studio-gold/5 rounded-full blur-3xl animate-drift-slower" />
      <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-studio-velvet/5 rounded-full blur-3xl animate-drift" />
    </div>
  );
}