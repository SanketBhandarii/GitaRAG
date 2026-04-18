"use client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";

const PARTICLES = Array.from({ length: 80 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 2 + 0.4,
  duration: Math.random() * 8 + 4,
  delay: Math.random() * 6,
  opacity: Math.random() * 0.5 + 0.1,
}));

const SCRIPTURES = [
  {
    name: "Bhagavad Gita",
    symbol: "ॐ",
    logo: "/glogo.jpg",
    color: "#F59E0B",
    colorClass: "text-amber-400",
    bgClass: "bg-amber-400/10",
    borderClass: "border-amber-400/30",
    glowClass: "shadow-amber-400/20",
    religion: "Hinduism",
    established: "~ 400 BCE",
    origin: "Ancient India",
    fact: "700 verses across 18 chapters, part of the Mahabharata. One of the most studied philosophical texts in human history.",
  },
  {
    name: "The Bible",
    symbol: "✝",
    logo: "/clogo.webp",
    color: "#60A5FA",
    colorClass: "text-blue-400",
    bgClass: "bg-blue-400/10",
    borderClass: "border-blue-400/30",
    glowClass: "shadow-blue-400/20",
    religion: "Christianity",
    established: "~ 1st Century CE",
    origin: "Middle East",
    fact: "66 books written over 1500 years by 40 authors. The most printed and translated book in history.",
  },
  {
    name: "The Quran",
    symbol: "☪",
    logo: "/ilogo.jpg",
    color: "#34D399",
    colorClass: "text-emerald-400",
    bgClass: "bg-emerald-400/10",
    borderClass: "border-emerald-400/30",
    glowClass: "shadow-emerald-400/20",
    religion: "Islam",
    established: "~ 610 CE",
    origin: "Arabia",
    fact: "114 chapters revealed over 23 years. Memorised verbatim by millions of people worldwide.",
  },
  {
    name: "Dhammapada",
    symbol: "☸",
    logo: "/dlogo.webp",
    color: "#C084FC",
    colorClass: "text-purple-400",
    bgClass: "bg-purple-400/10",
    borderClass: "border-purple-400/30",
    glowClass: "shadow-purple-400/20",
    religion: "Buddhism",
    established: "~ 563 BCE",
    origin: "Ancient India / Nepal",
    fact: "423 verses directly attributed to the Buddha. A practical guide to reducing suffering and living with clarity.",
  },
  {
    name: "Guru Granth Sahib",
    symbol: "ੴ",
    logo: "/slogo.svg",
    color: "#FB923C",
    colorClass: "text-orange-400",
    bgClass: "bg-orange-400/10",
    borderClass: "border-orange-400/30",
    glowClass: "shadow-orange-400/20",
    religion: "Sikhism",
    established: "~ 1469 CE",
    origin: "Punjab, India",
    fact: "Hymns from 36 contributors across different faiths and castes. Recognised as the living, eternal Guru.",
  },
  {
    name: "Torah",
    symbol: "✡",
    logo: "/jlogo.svg",
    color: "#38BDF8",
    colorClass: "text-sky-400",
    bgClass: "bg-sky-400/10",
    borderClass: "border-sky-400/30",
    glowClass: "shadow-sky-400/20",
    religion: "Judaism",
    established: "~ 1300 BCE",
    origin: "Ancient Israel",
    fact: "The five books of Moses that form the foundation of Jewish law, ethics, and identity.",
  },
];

export default function SplashScreen() {
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState(0);
  const [infoVisible, setInfoVisible] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const t = setInterval(() => {
      setInfoVisible(false);
      setTimeout(() => {
        setActive((p) => (p + 1) % SCRIPTURES.length);
        setInfoVisible(true);
      }, 500);
    }, 4000);
    return () => clearInterval(t);
  }, []);

  const handlePillClick = (i) => {
    if (i === active) return;
    setInfoVisible(false);
    setTimeout(() => { setActive(i); setInfoVisible(true); }, 300);
  };

  const s = SCRIPTURES[active];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans overflow-x-hidden relative flex flex-col transition-colors duration-1000">

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing: border-box; font-family: 'Inter', sans-serif; }
        
        :root {
          --grid-color: rgba(0,0,0,0.04);
          --pill-bg: rgba(0,0,0,0.04);
          --pill-border: rgba(0,0,0,0.1);
          --pill-text: rgba(0,0,0,0.5);
          --card-bg: rgba(0,0,0,0.02);
        }
        .dark {
          --grid-color: rgba(255,255,255,0.014);
          --pill-bg: rgba(255,255,255,0.025);
          --pill-border: rgba(255,255,255,0.07);
          --pill-text: rgba(255,255,255,0.28);
          --card-bg: rgba(255,255,255,0.022);
        }

        @keyframes twinkle {
          0%, 100% { opacity: 0.07; transform: scale(1); }
          50% { opacity: 0.65; transform: scale(1.5); }
        }
        @keyframes blob1 {
          0%, 100% { transform: translate(0,0) scale(1); }
          50% { transform: translate(4%, -5%) scale(1.1); }
        }
        @keyframes blob2 {
          0%, 100% { transform: translate(0,0) scale(1); }
          50% { transform: translate(-3%, 4%) scale(1.06); }
        }
        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(-16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeUp0 { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:translateY(0); } }
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .anim-nav { animation: fadeDown 0.7s ease forwards; opacity: 0; }
        .anim-1 { animation: fadeUp0 0.8s ease 0.1s forwards; opacity: 0; }
        .anim-2 { animation: fadeUp0 0.8s ease 0.25s forwards; opacity: 0; }
        .anim-3 { animation: fadeUp0 0.8s ease 0.4s forwards; opacity: 0; }
        .anim-4 { animation: fadeUp0 0.8s ease 0.55s forwards; opacity: 0; }
        .anim-5 { animation: fadeUp0 0.8s ease 0.7s forwards; opacity: 0; }
        .anim-6 { animation: fadeUp0 0.8s ease 0.9s forwards; opacity: 0; }
        .anim-7 { animation: fadeUp0 0.8s ease 1.1s forwards; opacity: 0; }
        .mobile-menu { animation: slideInRight 0.25s ease forwards; }

        .pill-btn:hover { border-color: rgba(0,0,0,0.2) !important; color: rgba(0,0,0,0.7) !important; }
        .dark .pill-btn:hover { border-color: rgba(255,255,255,0.2) !important; color: rgba(255,255,255,0.7) !important; }
        
        .nav-link:hover { color: rgba(0,0,0,0.88) !important; }
        .dark .nav-link:hover { color: rgba(255,255,255,0.88) !important; }

        .cta-ghost:hover { background: rgba(0,0,0,0.07) !important; color: rgba(0,0,0,0.85) !important; }
        .dark .cta-ghost:hover { background: rgba(255,255,255,0.07) !important; color: rgba(255,255,255,0.85) !important; }
        
        .cta-main:hover { filter: brightness(1.1); transform: translateY(-2px); }
        .cta-main { transition: all 0.25s ease; }
        .pills-scroll { scrollbar-width: none; -ms-overflow-style: none; }
        .pills-scroll::-webkit-scrollbar { display: none; }
      `}</style>

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute rounded-full"
          style={{
            top: "-20%", left: "-15%",
            width: "60%", height: "60%",
            background: `radial-gradient(circle, ${s.color}18 0%, transparent 70%)`,
            transition: "background 1.4s ease",
            animation: "blob1 14s ease-in-out infinite",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            bottom: "-20%", right: "-15%",
            width: "65%", height: "65%",
            background: `radial-gradient(circle, ${s.color}10 0%, transparent 70%)`,
            transition: "background 1.4s ease",
            animation: "blob2 18s ease-in-out infinite",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(var(--grid-color) 1px, transparent 1px), linear-gradient(90deg, var(--grid-color) 1px, transparent 1px)`,
            backgroundSize: "72px 72px",
          }}
        />
      </div>

      {mounted && PARTICLES.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-black dark:bg-white pointer-events-none"
          style={{
            left: `${p.x}%`, top: `${p.y}%`,
            width: `${p.size}px`, height: `${p.size}px`,
            opacity: p.opacity,
            animation: `twinkle ${p.duration}s ease-in-out infinite ${p.delay}s`,
          }}
        />
      ))}

      <nav className={`relative z-20 flex justify-between items-center px-5 sm:px-14 py-5 border-b border-black/5 dark:border-white/5 ${mounted ? "anim-nav" : "opacity-0"}`}>
        <div className="flex items-center gap-3">
          <span className="text-[20px] font-bold tracking-tight text-foreground/90">
            Secular<span style={{ color: s.color, transition: "color 0.8s" }}>AI</span>
          </span>
        </div>

        <div className="hidden md:flex gap-8 items-center">
          {["Features", "Scriptures", "About"].map((item) => (
            <a
              key={item}
              href="#"
              className="nav-link text-[13px] font-medium tracking-wide text-muted-foreground no-underline transition-colors duration-200"
            >
              {item}
            </a>
          ))}
          <ThemeToggle />
          {localStorage.getItem("secularai-token") ? (
            <button
              onClick={() => navigate("/home")}
              className="px-5 py-2 rounded-lg text-[13px] font-medium tracking-wide border transition-all duration-700 cursor-pointer"
              style={{
                background: `${s.color}12`,
                borderColor: `${s.color}35`,
                color: s.color,
              }}
            >
              Go to App
            </button>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="px-5 py-2 rounded-lg text-[13px] font-medium tracking-wide border transition-all duration-700 cursor-pointer"
              style={{
                background: `${s.color}12`,
                borderColor: `${s.color}35`,
                color: s.color,
              }}
            >
              Sign In
            </button>
          )}
        </div>

        <div className="md:hidden flex items-center gap-4">
          <ThemeToggle />
          <button
            className="flex flex-col justify-center gap-[5px] w-8 h-8 bg-transparent border-0 cursor-pointer z-50"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span
              className="block w-5 h-[1.5px] bg-black/60 dark:bg-white/60 transition-all duration-300 origin-center"
              style={{ transform: menuOpen ? "rotate(45deg) translate(4px, 4px)" : "none" }}
            />
            <span
              className="block w-5 h-[1.5px] bg-black/60 dark:bg-white/60 transition-all duration-300"
              style={{ opacity: menuOpen ? 0 : 1 }}
            />
            <span
              className="block w-5 h-[1.5px] bg-black/60 dark:bg-white/60 transition-all duration-300 origin-center"
              style={{ transform: menuOpen ? "rotate(-45deg) translate(4px, -4px)" : "none" }}
            />
          </button>
        </div>
      </nav>

      {menuOpen && (
        <>
          <div
            className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm md:hidden"
            onClick={() => setMenuOpen(false)}
          />
          <div
            className="mobile-menu fixed top-0 right-0 h-full w-[260px] z-40 md:hidden flex flex-col pt-20 pb-8 px-7 gap-6 border-l border-black/10 dark:border-white/8 bg-background/95 backdrop-blur-3xl"
          >
            <button
              className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-lg text-black/50 dark:text-white/50 cursor-pointer text-lg"
              onClick={() => setMenuOpen(false)}
            >
              ✕
            </button>
            <span className="text-[18px] font-bold tracking-tight text-foreground/90 mb-2">
              Secular<span style={{ color: s.color }}>AI</span>
            </span>
            {["Features", "Scriptures", "About"].map((item) => (
              <a
                key={item}
                href="#"
                className="text-[15px] font-medium text-black/40 dark:text-white/40 no-underline hover:text-black/80 dark:hover:text-white/80 transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {item}
              </a>
            ))}
            {localStorage.getItem("secularai-token") ? (
              <button
                onClick={() => { setMenuOpen(false); navigate("/home"); }}
                className="mt-2 px-5 py-2.5 rounded-lg text-[13px] font-medium tracking-wide border cursor-pointer w-fit"
                style={{
                  background: `${s.color}15`,
                  borderColor: `${s.color}40`,
                  color: s.color,
                }}
              >
                Go to App
              </button>
            ) : (
              <button
                onClick={() => { setMenuOpen(false); navigate("/login"); }}
                className="mt-2 px-5 py-2.5 rounded-lg text-[13px] font-medium tracking-wide border cursor-pointer w-fit"
                style={{
                  background: `${s.color}15`,
                  borderColor: `${s.color}40`,
                  color: s.color,
                }}
              >
                Sign In
              </button>
            )}
          </div>
        </>
      )}

      <main className="flex-1 relative z-10 flex flex-col items-center justify-center px-5 sm:px-6 pt-12 pb-6 text-center">

        <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-9 border border-black/10 dark:border-white/8 bg-black/[0.03] dark:bg-white/[0.03] ${mounted ? "anim-1" : "opacity-0"}`}>
          <span className="text-[11px] text-muted-foreground tracking-widest font-medium uppercase">
            Books from different religions
          </span>
        </div>

        <div className={`mb-5 ${mounted ? "anim-2" : "opacity-0"}`}>
          <h1 className="text-[clamp(36px,7.5vw,76px)] font-extrabold leading-[1.06] text-foreground tracking-[-0.03em] mb-1">
            What does your
          </h1>
          <h1 className="text-[clamp(36px,7.5vw,70px)] font-light leading-[1.06] text-gray-600 dark:text-gray-400 tracking-[-0.03em]">
            scripture actually say?
          </h1>
        </div>

        <p className={`text-[15px] sm:text-[18px] text-muted-foreground/80 max-w-[440px] leading-[1.4] mb-11 font-normal ${mounted ? "anim-3" : "opacity-0"}`}>
          Your scripture has an answer for almost everything. Finding it made easy for you
        </p>

        <div className={`flex gap-3 mb-14 ${mounted ? "anim-4" : "opacity-0"}`}>
          <button
            className="cta-main px-7 py-3 rounded-xl text-[15px] font-semibold tracking-wide cursor-pointer border-0"
            style={{
              background: s.color,
              color: "#05040e",
              boxShadow: `0 0 26px ${s.color}45, 0 4px 18px rgba(0,0,0,0.4)`,
              transition: "background 0.8s ease, box-shadow 0.8s ease",
            }}
            onClick={() => navigate("/home")}
          >
            Start interaction
          </button>
        </div>

        <div className={`w-full max-w-[600px] mb-11 ${mounted ? "anim-5" : "opacity-0"}`}>
          <div className="pills-scroll flex gap-2 overflow-x-auto sm:flex-wrap sm:justify-center px-2 sm:px-5 pb-1">
            {SCRIPTURES.map((sc, i) => (
              <button
                key={sc.name}
                className="pill-btn flex items-center gap-2 px-4 py-2 rounded-full text-[12px] font-medium tracking-wide cursor-pointer transition-all duration-300 whitespace-nowrap border flex-shrink-0"
                onClick={() => handlePillClick(i)}
                style={{
                  background: active === i ? `${sc.color}12` : "var(--pill-bg)",
                  borderColor: active === i ? `${sc.color}45` : "var(--pill-border)",
                  color: active === i ? sc.color : "var(--pill-text)",
                  boxShadow: active === i ? `0 0 12px ${sc.color}18` : "none",
                  fontWeight: active === i ? "600" : "400",
                }}
              >
                <img src={sc.logo} alt={sc.name} className="w-4 h-4 object-cover rounded-full flex-shrink-0" />
                {sc.name}
              </button>
            ))}
          </div>
        </div>

        <div
          className={`max-w-[500px] w-full rounded-2xl border p-5 sm:p-6 backdrop-blur-xl ${mounted ? "anim-6" : "opacity-0"}`}
          style={{
            background: "var(--card-bg)",
            borderColor: `${s.color}18`,
            opacity: infoVisible ? 1 : 0,
            transform: infoVisible ? "translateY(0)" : "translateY(10px)",
            transition: "opacity 0.45s ease, transform 0.45s ease, border-color 0.8s ease",
          }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center text-[17px] border transition-all duration-700 flex-shrink-0"
              style={{ background: `${s.color}14`, borderColor: `${s.color}28` }}
            >
              <img src={s.logo} alt={s.name} className="w-6 h-6 object-cover rounded-full flex-shrink-0" />
            </div>
            <div className="text-left min-w-0">
              <div className="text-[13.5px] font-semibold text-foreground/90 truncate">{s.name}</div>
              <div
                className="text-[11px] font-medium tracking-widest mt-0.5 uppercase transition-colors duration-700"
                style={{ color: s.color }}
              >
                {s.religion}
              </div>
            </div>
            <div className="ml-auto text-right flex-shrink-0">
              <div className="text-[10px] text-black/30 dark:text-white/18 tracking-widest uppercase mb-1">Established</div>
              <div className="text-[13px] font-semibold text-foreground/50">{s.established}</div>
            </div>
          </div>

          <div
            className="h-px mb-4"
            style={{ background: `linear-gradient(90deg, transparent, ${s.color}18, transparent)`, transition: "all 0.8s" }}
          />

          <p className="text-[12.5px] text-muted-foreground leading-[1.85] text-left mb-3 font-normal">
            {s.fact}
          </p>

          <div className="flex items-center gap-2">
            <span className="text-[10px] text-black/30 dark:text-white/18 tracking-widest uppercase">Origin</span>
            <span className="text-[12px] text-muted-foreground font-medium">{s.origin}</span>
          </div>
        </div>

      </main>

      <div className={`relative z-10 border-t border-black/[0.05] dark:border-white/[0.045] py-5 px-5 sm:px-14 flex justify-center gap-8 sm:gap-20 flex-wrap ${mounted ? "anim-7" : "opacity-0"}`}>
        {[
          { label: "Scriptures", value: "6" },
          { label: "Verses Indexed", value: "50,000+" },
          { label: "Religions", value: "6" },
          { label: "Free to Use", value: "Always" },
        ].map((stat) => (
          <div key={stat.label} className="text-center">
            <div
              className="text-[18px] font-bold transition-colors duration-700"
              style={{ color: s.color }}
            >
              {stat.value}
            </div>
            <div className="text-[10.5px] text-muted-foreground tracking-widest uppercase mt-1 font-medium">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}