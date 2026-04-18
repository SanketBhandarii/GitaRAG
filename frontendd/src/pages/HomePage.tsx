import { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Share2, BookOpen, Sparkles, LogOut, Brain, RefreshCw, Loader2 } from "lucide-react";
import { religions, dailyWisdoms, getReligionColor } from "@/data/mockData";
import { getFaithIcon } from "@/components/FaithIcons";
import { ThemeToggle } from "@/components/ThemeToggle";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

type Insight = {
  archetype: string;
  raw_take: string;
  tags: string[];
  generated_at: string;
  can_regenerate: boolean;
};

function timeAgo(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return "just now";
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

const HomePage = () => {
  const [activeReligion, setActiveReligion] = useState(religions[0].id);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const [insight, setInsight] = useState<Insight | null>(null);
  const [insightLoading, setInsightLoading] = useState(false);
  const [insightError, setInsightError] = useState<string | null>(null);
  const [insightFetched, setInsightFetched] = useState(false);
  const [showInsightPanel, setShowInsightPanel] = useState(false);

  const token = localStorage.getItem("secularai-token");

  const activeRel = useMemo(() => religions.find((r) => r.id === activeReligion)!, [activeReligion]);
  const colorVar = activeRel.colorVar;

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const normalizedQuery = searchQuery.toLowerCase();
    const results: any[] = [];
    religions.forEach(rel => {
      rel.scriptures.forEach(scripture => {
        if (
          scripture.name.toLowerCase().includes(normalizedQuery) ||
          scripture.tagline.toLowerCase().includes(normalizedQuery) ||
          rel.name.toLowerCase().includes(normalizedQuery)
        ) {
          results.push({ ...scripture, relColor: rel.colorVar, relId: rel.id });
        }
      });
    });
    return results;
  }, [searchQuery]);

  // Silently fetch existing cached insight on mount (no Groq call)
  useEffect(() => {
    if (!token) return;
    fetch(`${BACKEND_URL}/api/insights/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => {
        if (data.insight) setInsight(data.insight);
        setInsightFetched(true);
      })
      .catch(() => setInsightFetched(true));
  }, []);

  const handleGenerateInsight = useCallback(async () => {
    if (!token) return;
    setInsightLoading(true);
    setInsightError(null);
    setShowInsightPanel(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/insights/generate`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.detail === "no_messages") {
          setInsightError("You haven't chatted enough yet. Ask at least 5 questions in any scripture chat first, then come back.");
        } else {
          setInsightError(data.detail || "Something went wrong. Try again.");
        }
      } else {
        setInsight(data.insight);
        setInsightError(null);
      }
    } catch {
      setInsightError("Couldn't connect to server. Check your connection.");
    } finally {
      setInsightLoading(false);
    }
  }, [token]);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <header className="sticky top-0 z-40 glass border-b border-border/50">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3 md:px-6">
          <button
            onClick={() => navigate("/")}
            className="text-xl font-bold tracking-tight hover:opacity-80 transition-opacity duration-150 cursor-pointer"
          >
            Secular<span className="">AI</span>
          </button>

          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search across all scriptures..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-10 pr-4 rounded-full bg-secondary/60 border border-border/50 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            {token ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate("/home")}
                  className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center"
                  title={localStorage.getItem("secularai-username") || "User"}
                >
                  <span className="text-xs font-bold text-primary">
                    {(localStorage.getItem("secularai-username") || "U")[0].toUpperCase()}
                  </span>
                </button>
                <button
                  onClick={() => {
                    localStorage.removeItem("secularai-token");
                    localStorage.removeItem("secularai-username");
                    navigate("/login");
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-all border border-red-100 dark:border-red-900/30"
                  title="Log Out"
                >
                  <LogOut size={14} />
                  <span className="hidden sm:inline">Log Out</span>
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-foreground hover:bg-secondary/80 transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-primary-foreground transition-all hover:opacity-90"
                  style={{ background: "hsl(var(--primary))" }}
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>

        <div className="md:hidden px-4 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search across all scriptures..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-full bg-secondary/60 border border-border/50 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
            />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 md:px-6 pb-16">
        {searchQuery.trim() ? (
          <section className="animate-fade-in mt-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Search className="h-4 w-4 text-primary" />
              Search Results for "{searchQuery}"
            </h2>
            {searchResults.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {searchResults.map((s) => (
                  <button
                    key={`${s.relId}-${s.id}`}
                    onClick={() => s.available && navigate(`/chat/${s.id}`)}
                    className="group relative text-left rounded-2xl border border-border/60 bg-card p-5 transition-all duration-300 hover:opacity-80 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                      style={{ background: `hsl(var(${s.relColor}) / 0.1)` }}
                    >
                      {(() => {
                        const rel = religions.find(r => r.id === s.relId);
                        return <img src={rel?.logo} alt={s.name} className="w-6 h-6 object-cover rounded-full flex-shrink-0" />;
                      })()}
                    </div>
                    <h3 className="text-base font-semibold mb-1">{s.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{s.tagline}</p>
                    {s.chapters && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-auto">
                        <span>{s.chapters} {s.unitType || 'chapters'}</span>
                        {s.verses && <span>• {s.verses.toLocaleString()} verses</span>}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 rounded-2xl border border-dashed border-border/60">
                <Search className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground">No scriptures found matching your search.</p>
              </div>
            )}
          </section>
        ) : (
          <>
            <div className="flex items-center gap-1 overflow-x-auto py-5 scrollbar-none -mx-4 px-4 md:mx-0 md:px-0">
              {religions.map((r) => {
                const isActive = r.id === activeReligion;
                return (
                  <button
                    key={r.id}
                    onClick={() => setActiveReligion(r.id)}
                    className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-300 ${isActive
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground/70"
                      }`}
                  >
                    <img src={r.logo} alt={r.name} className={`w-5 h-5 object-cover rounded-full flex-shrink-0 ${isActive ? "" : "opacity-40"}`} />
                    <span>{r.name}</span>
                    {isActive && (
                      <div
                        className="absolute bottom-0 left-2 right-2 h-[2px] rounded-full transition-all duration-500"
                        style={{
                          background: `hsl(var(${r.colorVar}))`,
                          boxShadow: `0 0 12px hsl(var(${r.colorVar}) / 0.5)`,
                        }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* How You Think — Eye-catching glowing strip ABOVE scripture grid */}
            {token && (
              <div
                className="relative my-2 mb-6 rounded-2xl overflow-hidden cursor-pointer"
                style={{
                  background: 'linear-gradient(135deg, hsl(var(--primary) / 0.10) 0%, hsl(var(--primary) / 0.04) 60%, transparent 100%)',
                  border: '1px solid hsl(var(--primary) / 0.30)',
                  boxShadow: '0 0 32px hsl(var(--primary) / 0.10), inset 0 1px 0 hsl(var(--primary) / 0.15)',
                }}
              >
                {/* Top glow line */}
                <div className="absolute top-0 left-0 right-0 h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, hsl(var(--primary) / 0.6), transparent)' }} />

                {!showInsightPanel && !insight ? (
                  /* Compact teaser strip */
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-5">
                    <div className="text-center sm:text-left">
                      <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                        <Brain className="h-3.5 w-3.5 text-primary" />
                        <span className="text-[11px] font-bold text-primary uppercase tracking-widest">How You Think</span>
                        <span className="text-[10px] text-muted-foreground/70 bg-secondary/60 px-2 py-0.5 rounded-full">1× per day</span>
                      </div>
                      <p className="text-[15px] font-semibold text-foreground">What do your questions actually say about you?</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Your patterns, what you keep going back to, how you really see things.</p>
                    </div>
                    <div className="relative shrink-0">
                      <div className="absolute inset-0 rounded-xl animate-ping opacity-25" style={{ background: 'hsl(var(--primary))' }} />
                      <button
                        onClick={handleGenerateInsight}
                        disabled={insightLoading}
                        className="relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                        style={{ background: 'hsl(var(--primary))', color: 'white', boxShadow: '0 4px 20px hsl(var(--primary) / 0.45)' }}
                      >
                        {insightLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                        See What My Chats Reveal
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Expanded result inside same card */
                  <div className="px-6 py-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Brain className="h-3.5 w-3.5 text-primary" />
                        <span className="text-[11px] font-bold text-primary uppercase tracking-widest">How You Think</span>
                      </div>
                      {insight && !insightLoading && (
                        <div className="flex items-center gap-3">
                          <span className="text-[11px] text-muted-foreground">{insight.generated_at === 'just_now' ? 'Just now' : timeAgo(insight.generated_at)}</span>
                          {insight.can_regenerate ? (
                            <button onClick={handleGenerateInsight} disabled={insightLoading} className="flex items-center gap-1 text-xs text-primary hover:opacity-70 transition-opacity">
                              <RefreshCw className="h-3 w-3" /> Refresh
                            </button>
                          ) : (
                            <span className="text-[11px] text-muted-foreground">Refreshes in ~24h</span>
                          )}
                        </div>
                      )}
                    </div>

                    {insightLoading && (
                      <div className="flex items-center gap-3 text-sm text-muted-foreground py-3">
                        <Loader2 className="h-4 w-4 animate-spin text-primary" />
                        Reading your conversations...
                      </div>
                    )}

                    {insightError && (
                      <div className="rounded-xl bg-secondary/40 border border-border/40 p-4 text-sm text-muted-foreground">
                        {insightError}
                      </div>
                    )}

                    {insight && !insightLoading && !insightError && (
                      <>
                        <div>
                          <p className="text-[11px] text-muted-foreground uppercase tracking-widest mb-1">Your Archetype</p>
                          <h3 className="text-2xl font-bold text-foreground">{insight.archetype}</h3>
                        </div>
                        <p className="text-[15px] font-medium text-foreground leading-relaxed border-l-2 border-primary/60 pl-4 py-1">{insight.raw_take}</p>
                        <div className="flex flex-wrap gap-2">
                          {insight.tags.map(tag => (
                            <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-medium">{tag}</span>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}

            <section className="animate-fade-in" key={activeReligion}>
              <h2 className="text-lg font-semibold mb-4">
                {activeRel.name} Scriptures
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeRel.scriptures.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => s.available && navigate(`/chat/${s.id}`)}
                    disabled={!s.available}
                    className="group relative text-left rounded-2xl border border-border/60 bg-card p-5 transition-all duration-300 hover:opacity-80 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors duration-300"
                      style={{
                        background: `hsl(var(${colorVar}) / 0.1)`,
                      }}
                    >
                      <img src={activeRel.logo} alt={activeRel.name} className="w-8 h-8 object-cover rounded-full flex-shrink-0" />
                    </div>

                    <h3 className="text-base font-semibold mb-1 text-card-foreground">{s.name}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{s.tagline}</p>

                    {s.chapters && (
                      <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
                        {s.chapters && <span>{s.chapters} {s.unitType || 'chapters'}</span>}
                        {s.verses && <span>• {s.verses.toLocaleString()} verses</span>}
                      </div>
                    )}

                    {!s.available && (
                      <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wide uppercase glass border border-border/50 text-muted-foreground">
                        Coming Soon
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </section>
          </>
        )}

<section className="mt-8">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Daily Wisdom</h2>
          </div>
          <div
            className="relative rounded-2xl border border-border/60 bg-card p-6 md:p-8 overflow-hidden shimmer"
          >
            <div className="relative z-10">
              <p className="font-serif text-lg md:text-xl italic leading-relaxed text-card-foreground mb-4">
                "{dailyWisdoms[activeReligion]?.verse || dailyWisdoms['buddhism'].verse}"
              </p>
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <span
                    className="text-sm font-semibold"
                    style={{ color: `hsl(var(${getReligionColor(dailyWisdoms[activeReligion]?.religionId || 'buddhism')}))` }}
                  >
                    {dailyWisdoms[activeReligion]?.reference || dailyWisdoms['buddhism'].reference}
                  </span>
                  <span className="text-sm text-muted-foreground ml-2">— {dailyWisdoms[activeReligion]?.religion || dailyWisdoms['buddhism'].religion}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-secondary/80 text-secondary-foreground hover:bg-secondary transition-colors">
                    <BookOpen className="h-3.5 w-3.5" />
                    Read Context
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-secondary/80 text-secondary-foreground hover:bg-secondary transition-colors">
                    <Share2 className="h-3.5 w-3.5" />
                    Share
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;
