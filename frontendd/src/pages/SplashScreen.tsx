import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getFaithIcon } from "@/components/FaithIcons";
import { religions } from "@/data/mockData";

const PARTICLE_COUNT = 50;

const particles = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
  id: i,
  left: Math.random() * 100,
  top: Math.random() * 100,
  size: Math.random() * 2.5 + 0.8,
  duration: Math.random() * 8 + 6,
  delay: Math.random() * 5,
  dx: (Math.random() - 0.5) * 200,
  dy: (Math.random() - 0.5) * 200,
}));

// Orbit duration — 5s per religion so they fly around fast
const ORBIT_DURATION = 5;

const orbitItems = religions.map((r, i) => ({
  religionId: r.id,
  // Stagger start: each icon offset equally around the circle
  delay: -i * (ORBIT_DURATION / religions.length),
}));

const SplashScreen = () => {
  const navigate = useNavigate();
  const [fadeOut, setFadeOut] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleBegin = useCallback(() => {
    setFadeOut(true);
    setTimeout(() => navigate("/home"), 600);
  }, [navigate]);

  const handleSkip = useCallback(() => {
    navigate("/home");
  }, [navigate]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden transition-opacity duration-600 ${fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      style={{
        background: "linear-gradient(180deg, hsl(220 22% 5%) 0%, hsl(215 25% 7%) 50%, hsl(220 22% 5%) 100%)",
      }}
    >
      {/* Sky-blue particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            background: `radial-gradient(circle, hsl(200 85% 70% / 0.7), transparent)`,
            animation: `particle-drift ${p.duration}s ease-in-out ${p.delay}s infinite`,
            "--dx": `${p.dx}px`,
            "--dy": `${p.dy}px`,
          } as React.CSSProperties}
        />
      ))}

      {/* Central glow — sky blue */}
      <div
        className="absolute w-[280px] h-[280px] md:w-[380px] md:h-[380px] rounded-full"
        style={{
          background: "radial-gradient(circle, hsl(200 85% 55% / 0.12) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      {/* Orbit ring */}
      <div
        className={`relative w-[240px] h-[240px] md:w-[320px] md:h-[320px] mb-10 transition-all duration-800 ${mounted ? "scale-100 opacity-100" : "scale-75 opacity-0"
          }`}
      >
        {/* Center orb — blackish with sky blue glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 md:w-18 md:h-18 rounded-full animate-pulse-glow"
          style={{
            background: "radial-gradient(circle, hsl(200 80% 55%) 0%, hsl(210 70% 30%) 100%)",
            width: "3.5rem",
            height: "3.5rem",
          }}
        />

        {/* Orbit circle outline — subtle sky blue */}
        <div
          className="absolute inset-0 rounded-full"
          style={{ border: "1px solid hsl(200 60% 50% / 0.2)" }}
        />

        {/* Orbiting icons — fast */}
        {orbitItems.map((item) => {
          const Icon = getFaithIcon(item.religionId);
          return (
            <div
              key={item.religionId}
              className="absolute top-1/2 left-1/2 w-0 h-0"
              style={{
                animation: `orbit ${ORBIT_DURATION}s linear ${item.delay}s infinite`,
                "--orbit-radius": "clamp(110px, 14vw, 148px)",
              } as React.CSSProperties}
            >
              <div
                className="flex items-center justify-center w-9 h-9 md:w-11 md:h-11 rounded-full -translate-x-1/2 -translate-y-1/2"
                style={{
                  background: "hsl(220 20% 8% / 0.85)",
                  border: "1px solid hsl(200 50% 40% / 0.35)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <Icon size={17} color="hsl(200, 80%, 68%)" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Text + buttons */}
      <div
        className={`flex flex-col items-center text-center px-6 transition-all duration-800 delay-200 ${mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
      >
        <h1
          className="text-4xl md:text-5xl font-bold tracking-tight mb-3"
          style={{ color: "hsl(210 20% 94%)" }}
        >
          Secular<span style={{ color: "hsl(200, 85%, 62%)" }}>AI</span>
        </h1>
        <p
          className="text-base md:text-lg mb-8 max-w-sm"
          style={{ color: "hsl(210 15% 60%)" }}
        >
          Explore the wisdom of all traditions
        </p>

        <button
          onClick={handleBegin}
          className="px-8 py-3.5 rounded-full text-sm font-semibold tracking-wide transition-all duration-200 hover:scale-105"
          style={{
            background: "linear-gradient(135deg, hsl(200, 85%, 45%), hsl(210, 80%, 55%))",
            color: "white",
            boxShadow: "0 0 30px hsl(200 85% 50% / 0.3)",
          }}
        >
          Begin Your Journey
        </button>

        <button
          onClick={handleSkip}
          className="mt-5 text-sm transition-colors duration-150 hover:opacity-70"
          style={{ color: "hsl(210 15% 48%)" }}
        >
          Skip
        </button>
      </div>
    </div>
  );
};

export default SplashScreen;
