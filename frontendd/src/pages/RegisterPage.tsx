import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

type Step = "register" | "otp";

const RegisterPage = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState<Step>("register");

    // Register fields
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [fullName, setFullName] = useState("");
    const [password, setPassword] = useState("");
    const [showPwd, setShowPwd] = useState(false);

    // OTP
    const [otp, setOtp] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!username.trim() || !email.trim() || !password.trim()) return;
        setLoading(true);
        setError("");
        try {
            const res = await fetch(`${BACKEND_URL}/api/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username,
                    email,
                    password,
                    full_name: fullName || undefined,
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.detail || "Registration failed");
            setStep("otp");
            setSuccess("Verification code sent to your email!");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!otp.trim()) return;
        setLoading(true);
        setError("");
        try {
            const res = await fetch(`${BACKEND_URL}/api/auth/verify-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp_code: otp }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.detail || "Verification failed");
            setSuccess("Account created! Redirecting to login...");
            setTimeout(() => navigate("/login"), 1500);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await fetch(`${BACKEND_URL}/api/auth/resend-verification`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.detail || "Failed to resend");
            setSuccess("New code sent!");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4 transition-colors duration-200">
            <div className="absolute top-4 right-4">
                <ThemeToggle />
            </div>

            <div className="w-full max-w-sm">
                {/* Logo */}
                <div className="text-center mb-8">
                    <button onClick={() => navigate("/")} className="text-3xl font-bold tracking-tight hover:opacity-80 transition-opacity">
                        Secular<span className="text-primary">AI</span>
                    </button>
                    <p className="text-muted-foreground text-sm mt-1">Start your spiritual exploration</p>
                </div>

                <div className="bg-card border border-border rounded-2xl p-7 shadow-sm">

                    {/* Step 1: Register form */}
                    {step === "register" && (
                        <>
                            <h2 className="text-xl font-semibold text-foreground mb-5">Create account</h2>
                            {error && <p className="text-destructive text-sm mb-4 p-3 bg-destructive/10 rounded-lg">{error}</p>}
                            <form onSubmit={handleRegister} className="space-y-3.5">
                                <div>
                                    <label className="text-sm font-medium text-foreground mb-1.5 block">Full Name <span className="text-muted-foreground font-normal">(optional)</span></label>
                                    <input
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        placeholder="Sanket Bhandari"
                                        className="w-full h-10 px-3 rounded-xl bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-foreground mb-1.5 block">Username</label>
                                    <input
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        placeholder="sanket123"
                                        required
                                        className="w-full h-10 px-3 rounded-xl bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-foreground mb-1.5 block">Email</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@example.com"
                                        required
                                        className="w-full h-10 px-3 rounded-xl bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-foreground mb-1.5 block">Password</label>
                                    <div className="relative">
                                        <input
                                            type={showPwd ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Min 6 characters"
                                            required
                                            className="w-full h-10 px-3 pr-10 rounded-xl bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                                        />
                                        <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                            {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                                        </button>
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full h-10 rounded-xl text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2 mt-1"
                                    style={{ background: "hsl(var(--primary))" }}
                                >
                                    {loading && <Loader2 size={15} className="animate-spin" />}
                                    Create Account
                                </button>
                            </form>
                            <p className="text-center text-sm text-muted-foreground mt-5">
                                Already have an account?{" "}
                                <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
                            </p>
                        </>
                    )}

                    {/* Step 2: OTP Verification */}
                    {step === "otp" && (
                        <>
                            <div className="text-center mb-6">
                                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle2 className="text-primary" size={28} />
                                </div>
                                <h2 className="text-xl font-semibold text-foreground mb-1">Check your email</h2>
                                <p className="text-sm text-muted-foreground">
                                    We sent a 6-digit code to<br />
                                    <span className="text-foreground font-medium">{email}</span>
                                </p>
                            </div>

                            {error && <p className="text-destructive text-sm mb-4 p-3 bg-destructive/10 rounded-lg">{error}</p>}
                            {success && <p className="text-primary text-sm mb-4 p-3 bg-primary/10 rounded-lg">{success}</p>}

                            <form onSubmit={handleVerifyOtp} className="space-y-4">
                                <input
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                                    placeholder="000000"
                                    maxLength={6}
                                    className="w-full h-12 px-3 rounded-xl bg-secondary border border-border text-lg text-center text-foreground font-bold tracking-widest placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                                />
                                <button
                                    type="submit"
                                    disabled={loading || otp.length < 6}
                                    className="w-full h-10 rounded-xl text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
                                    style={{ background: "hsl(var(--primary))" }}
                                >
                                    {loading && <Loader2 size={15} className="animate-spin" />}
                                    Verify & Continue
                                </button>
                            </form>

                            <div className="flex items-center justify-between mt-4">
                                <button
                                    onClick={handleResend}
                                    disabled={loading}
                                    className="text-xs text-primary hover:underline disabled:opacity-50"
                                >
                                    Resend code
                                </button>
                                <button
                                    onClick={() => { setStep("register"); setError(""); setSuccess(""); setOtp(""); }}
                                    className="text-xs text-muted-foreground hover:text-foreground"
                                >
                                    ← Edit email
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
