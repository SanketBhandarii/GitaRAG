import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

type Step = "login" | "forgot" | "otp" | "reset";

const LoginPage = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState<Step>("login");

    // Login state
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPwd, setShowPwd] = useState(false);

    // Forgot password state
    const [fpEmail, setFpEmail] = useState("");
    const [fpOtp, setFpOtp] = useState("");
    const [newPwd, setNewPwd] = useState("");
    const [showNewPwd, setShowNewPwd] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!username.trim() || !password.trim()) return;
        setLoading(true);
        setError("");
        try {
            const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.detail || "Login failed");
            localStorage.setItem("secularai-token", data.token);
            localStorage.setItem("secularai-username", data.username);
            navigate("/home");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleForgotSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!fpEmail.trim()) return;
        setLoading(true);
        setError("");
        try {
            const res = await fetch(`${BACKEND_URL}/api/auth/forgot-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: fpEmail }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.detail || "Failed to send code");
            setStep("otp");
            setSuccess("Reset code sent to your email.");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!fpOtp.trim() || !newPwd.trim()) return;
        setLoading(true);
        setError("");
        try {
            const res = await fetch(`${BACKEND_URL}/api/auth/reset-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: fpEmail, otp_code: fpOtp, new_password: newPwd }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.detail || "Reset failed");
            setSuccess("Password reset! Please log in.");
            setStep("login");
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
                    <p className="text-muted-foreground text-sm mt-1">Explore the wisdom of all traditions</p>
                </div>

                <div className="bg-card border border-border rounded-2xl p-7 shadow-sm">
                    {/* Login */}
                    {step === "login" && (
                        <>
                            <h2 className="text-xl font-semibold text-foreground mb-5">Welcome back</h2>
                            {error && <p className="text-destructive text-sm mb-4 p-3 bg-destructive/10 rounded-lg">{error}</p>}
                            {success && <p className="text-primary text-sm mb-4 p-3 bg-primary/10 rounded-lg">{success}</p>}
                            <form onSubmit={handleLogin} className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-foreground mb-1.5 block">Username or Email</label>
                                    <input
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        placeholder="Enter username or email"
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
                                            placeholder="Enter password"
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
                                    className="w-full h-10 rounded-xl text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
                                    style={{ background: "hsl(var(--primary))" }}
                                >
                                    {loading && <Loader2 size={15} className="animate-spin" />}
                                    Sign In
                                </button>
                            </form>
                            <button onClick={() => { setStep("forgot"); setError(""); setSuccess(""); }} className="mt-4 text-xs text-primary hover:underline block text-center">
                                Forgot password?
                            </button>
                            <p className="text-center text-sm text-muted-foreground mt-5">
                                No account?{" "}
                                <Link to="/register" className="text-primary font-medium hover:underline">Create one</Link>
                            </p>
                        </>
                    )}

                    {/* Forgot Password */}
                    {step === "forgot" && (
                        <>
                            <h2 className="text-xl font-semibold text-foreground mb-1">Reset password</h2>
                            <p className="text-sm text-muted-foreground mb-5">Enter your email and we'll send a code.</p>
                            {error && <p className="text-destructive text-sm mb-4 p-3 bg-destructive/10 rounded-lg">{error}</p>}
                            <form onSubmit={handleForgotSendOtp} className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-foreground mb-1.5 block">Email</label>
                                    <input
                                        type="email"
                                        value={fpEmail}
                                        onChange={(e) => setFpEmail(e.target.value)}
                                        placeholder="your@email.com"
                                        className="w-full h-10 px-3 rounded-xl bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                                    />
                                </div>
                                <button type="submit" disabled={loading} className="w-full h-10 rounded-xl text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2" style={{ background: "hsl(var(--primary))" }}>
                                    {loading && <Loader2 size={15} className="animate-spin" />}
                                    Send Reset Code
                                </button>
                            </form>
                            <button onClick={() => { setStep("login"); setError(""); }} className="mt-4 text-xs text-muted-foreground hover:text-foreground block text-center">← Back to login</button>
                        </>
                    )}

                    {/* Enter OTP + new password */}
                    {step === "otp" && (
                        <>
                            <h2 className="text-xl font-semibold text-foreground mb-1">Enter reset code</h2>
                            <p className="text-sm text-muted-foreground mb-5">Check your email for the 6-digit code.</p>
                            {error && <p className="text-destructive text-sm mb-4 p-3 bg-destructive/10 rounded-lg">{error}</p>}
                            {success && <p className="text-primary text-sm mb-4 p-3 bg-primary/10 rounded-lg">{success}</p>}
                            <form onSubmit={handleResetPassword} className="space-y-4">
                                <input
                                    value={fpOtp}
                                    onChange={(e) => setFpOtp(e.target.value)}
                                    placeholder="000000"
                                    maxLength={6}
                                    className="w-full h-10 px-3 rounded-xl bg-secondary border border-border text-sm text-center text-foreground tracking-widest placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                                />
                                <div className="relative">
                                    <input
                                        type={showNewPwd ? "text" : "password"}
                                        value={newPwd}
                                        onChange={(e) => setNewPwd(e.target.value)}
                                        placeholder="New password"
                                        className="w-full h-10 px-3 pr-10 rounded-xl bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                                    />
                                    <button type="button" onClick={() => setShowNewPwd(!showNewPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                        {showNewPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                                    </button>
                                </div>
                                <button type="submit" disabled={loading} className="w-full h-10 rounded-xl text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2" style={{ background: "hsl(var(--primary))" }}>
                                    {loading && <Loader2 size={15} className="animate-spin" />}
                                    Reset Password
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
