import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Bookmark, Share2, Play, Pause } from "lucide-react";
import { religions } from "@/data/mockData";
import { getFaithIcon } from "@/components/FaithIcons";
import { ThemeToggle } from "@/components/ThemeToggle";

const leftPanel = {
  religionId: "buddhism",
  scripture: "Dhammapada",
  scriptureId: "dhammapada",
  reference: "Dhammapada 1.1-2",
  verse: "Mind is the forerunner of all actions. All deeds are led by mind, created by mind. If one speaks or acts with a corrupt mind, suffering follows, as the wheel follows the hoof of an ox.",
  interpretation: {
    title: "The Power of Mental Intention",
    text: "This foundational teaching establishes that all of our experiences — suffering and happiness alike — originate in the mind. Our thoughts shape our reality, making mental discipline the most important spiritual practice.",
  },
};

const rightPanel = {
  religionId: "christianity",
  scripture: "Bible",
  scriptureId: "bible",
  reference: "Proverbs 23:7",
  verse: "For as he thinketh in his heart, so is he: Eat and drink, saith he to thee; but his heart is not with thee.",
  interpretation: {
    title: "Thoughts Define Character",
    text: "This proverb speaks to the same truth — our inner thoughts define who we truly are, regardless of outward appearances. Authentic character is revealed through the quality of our thinking, not our words.",
  },
};

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

const SynthesisPage = () => {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [leftAnswer, setLeftAnswer] = useState<string | null>(null);
  const [rightAnswer, setRightAnswer] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const LeftIcon = getFaithIcon(leftPanel.religionId);
  const RightIcon = getFaithIcon(rightPanel.religionId);
  const leftRel = religions.find((r) => r.id === leftPanel.religionId)!;
  const rightRel = religions.find((r) => r.id === rightPanel.religionId)!;

  const handleSynthesize = async () => {
    if (!prompt.trim() || isLoading) return;
    setIsLoading(true);
    setLeftAnswer(null);
    setRightAnswer(null);
    setError(null);

    try {
      const [leftRes, rightRes] = await Promise.all([
        fetch(`${BACKEND_URL}/query`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_query: prompt.trim(),
            religion: leftPanel.religionId,
            scripture: leftPanel.scriptureId,
          }),
        }),
        fetch(`${BACKEND_URL}/query`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_query: prompt.trim(),
            religion: rightPanel.religionId,
            scripture: rightPanel.scriptureId,
          }),
        }),
      ]);

      if (!leftRes.ok || !rightRes.ok) throw new Error("Server error");

      const [leftData, rightData] = await Promise.all([leftRes.json(), rightRes.json()]);
      setLeftAnswer(leftData.answer);
      setRightAnswer(rightData.answer);
    } catch {
      setError("Could not connect to the server. Please make sure the backend is running.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-border/50">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/home")} className="p-2 rounded-lg hover:bg-secondary/60 transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <span className="font-semibold text-sm">Cross-Faith Synthesis</span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Panels */}
      <div className="flex-1 max-w-6xl mx-auto w-full px-4 md:px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { data: leftPanel, Icon: LeftIcon, rel: leftRel, answer: leftAnswer },
            { data: rightPanel, Icon: RightIcon, rel: rightRel, answer: rightAnswer },
          ].map(({ data, Icon, rel, answer }, idx) => (
            <div key={idx} className="space-y-4">
              {/* Religion label */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `hsl(var(${rel.colorVar}) / 0.15)` }}>
                  <Icon size={16} color={`hsl(var(${rel.colorVar}))`} />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">{rel.name}</p>
                  <p className="text-sm font-semibold">{data.scripture}</p>
                </div>
              </div>

              {/* Verse card */}
              <div
                className="rounded-2xl border border-border/60 bg-card p-6"
                style={{ borderLeft: `3px solid hsl(var(${rel.colorVar}))` }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider" style={{ color: `hsl(var(${rel.colorVar}))` }}>
                    {data.reference}
                  </span>
                  <div className="flex gap-1">
                    <button className="p-1.5 rounded-lg hover:bg-secondary/60 transition-colors">
                      <Bookmark className="h-4 w-4 text-muted-foreground" />
                    </button>
                    <button className="p-1.5 rounded-lg hover:bg-secondary/60 transition-colors">
                      <Share2 className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </div>
                </div>
                <p className="font-serif text-base italic leading-relaxed text-card-foreground">
                  "{data.verse}"
                </p>
              </div>

              {/* AI Answer (shown after synthesis) */}
              {answer && (
                <div
                  className="rounded-xl p-5 border border-border/40 animate-fade-in"
                  style={{ background: `hsl(var(${rel.colorVar}) / 0.05)`, borderLeft: `3px solid hsl(var(${rel.colorVar}))` }}
                >
                  <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: `hsl(var(${rel.colorVar}))` }}>
                    AI Response
                  </p>
                  <p className="text-sm text-card-foreground leading-relaxed whitespace-pre-wrap">{answer}</p>
                </div>
              )}

              {/* Loading per panel */}
              {isLoading && !answer && (
                <div className="rounded-xl p-5 border border-border/40" style={{ background: `hsl(var(${rel.colorVar}) / 0.05)` }}>
                  <div className="flex gap-1.5 items-center">
                    <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}

              {/* Interpretation */}
              <div className="rounded-xl bg-secondary/40 p-5">
                <h4 className="text-sm font-semibold mb-2 text-foreground">{data.interpretation.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{data.interpretation.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="mt-6 p-4 rounded-xl bg-destructive/10 border border-destructive/30 text-sm text-destructive text-center">
            {error}
          </div>
        )}

        {/* Audio player */}
        <div className="mt-8 rounded-2xl border border-border/60 bg-card p-4 flex items-center gap-4">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0 transition-transform hover:scale-105"
          >
            {isPlaying ? <Pause className="h-4 w-4 text-primary-foreground" /> : <Play className="h-4 w-4 text-primary-foreground ml-0.5" />}
          </button>
          <div className="flex-1">
            <p className="text-xs font-medium text-foreground mb-1.5">Listen to Synthesis</p>
            <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
              <div className="h-full rounded-full bg-primary/60 w-1/3 transition-all duration-300" />
            </div>
          </div>
          <span className="text-xs text-muted-foreground">2:45</span>
        </div>
      </div>

      {/* Bottom synthesis bar */}
      <div className="sticky bottom-0 p-4 pb-6 glass border-t border-border/50">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-3">
            {[leftRel, rightRel].map((r) => {
              const I = getFaithIcon(r.id);
              return (
                <div key={r.id} className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-border/60 bg-card text-xs font-medium">
                  <I size={12} color={`hsl(var(${r.colorVar}))`} />
                  <span>{r.name}</span>
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSynthesize()}
              placeholder="Ask SecularAI to synthesize these perspectives..."
              disabled={isLoading}
              className="flex-1 h-11 px-4 rounded-full bg-secondary/60 border border-border/50 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all disabled:opacity-50"
            />
            <button
              onClick={handleSynthesize}
              disabled={!prompt.trim() || isLoading}
              className="px-6 py-2.5 rounded-full text-sm font-semibold text-primary-foreground transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(280 70% 50%))" }}
            >
              {isLoading ? "Synthesizing..." : "Synthesize"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SynthesisPage;
