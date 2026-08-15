"use client";

import React, { JSX, useState } from "react";
import { Input } from "../components/ui/input";
import { cn } from "@/lib/utils";
import { IconBrandGoogle, IconEye, IconEyeOff } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion, AnimatePresence } from "framer-motion";
import { signInRequest } from "@/service/Api/auth.userApi";
import { useAuth } from "@/context/AuthContext";
import chatImage from "../assets/chat.png";

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}): JSX.Element => (
  <div className={cn("flex w-full flex-col gap-1.5", className)}>
    {children}
  </div>
);

interface FormData {
  email: string;
  password: string;
}

type FormErrors = Partial<Record<keyof FormData, string>>;

function LoginPage(): JSX.Element {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const [form, setForm] = useState<FormData>({ email: "", password: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const id = e.target.id as keyof FormData;
    setForm({ ...form, [id]: e.target.value });
    if (errors[id]) setErrors({ ...errors, [id]: undefined });
  };

  const validate = (): FormErrors => {
    const newErrors: FormErrors = {};
    if (!form.email || !form.email.includes("@"))
      newErrors.email = "Invalid email address";
    if (!form.password || form.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    return newErrors;
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    try {
      setIsLoading(true);
      const payload = { email: form.email, password: form.password };
      const response = await signInRequest(payload);
      const { accessToken, user } = response.data;
      console.log("response", response.data.user);
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("userId", user.id);
      setUser(response.data.user);
      console.log("userId", user.id);
      if (response.data.success) {
        navigate("/showUsers", { replace: true });
      } else toast.error(response.data.message || "Invalid credentials");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 16 },
    visible: (i = 0) => ({
      opacity: 1,
      y: 0,
      transition: { delay: 0.07 * i, duration: 0.45, ease: "easeOut" },
    }),
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-slate-950 via-[#0d0d1a] to-[#0a0a14] text-white">
      {/* Subtle ambient orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-72 w-72 rounded-full bg-[#4F6EF7]/10 blur-3xl" />
        <div className="absolute bottom-[-80px] right-[-40px] h-96 w-96 rounded-full bg-[#0FC8C8]/8 blur-3xl" />
      </div>

      <main className="relative flex min-h-screen items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex w-full max-w-5xl overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0F0F1A]/80 shadow-2xl shadow-black/60 backdrop-blur-2xl"
        >
          {/* ── Left: Form ── */}
          <div className="flex w-full flex-col justify-center px-8 py-12 md:w-[52%] md:px-12">
            {/* Logo mark */}
            <motion.div
              variants={fadeInUp as any}
              initial="hidden"
              animate="visible"
              custom={0}
              className="mb-8 flex items-center gap-2.5"
            >
              <div
                className="flex h-8 w-8 items-center justify-center rounded-[9px]"
                style={{ background: "linear-gradient(135deg, #4F6EF7, #0FC8C8)", boxShadow: "0 0 14px rgba(79,110,247,0.4)" }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <span className="font-display text-[1.05rem] font-bold tracking-tight text-slate-100">
                Talky<span style={{ color: "#0FC8C8" }}>Talky</span>
              </span>
            </motion.div>

            {/* Heading */}
            <motion.div
              variants={fadeInUp as any}
              initial="hidden"
              animate="visible"
              custom={1}
              className="mb-7 space-y-1.5"
            >
              <h1 className="font-display text-[1.75rem] font-bold leading-tight text-white md:text-[2rem]">
                Welcome back
              </h1>
              <p className="text-sm text-slate-400">
                Sign in to continue your conversations.
              </p>
            </motion.div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Google button */}
              <motion.button
                type="button"
                variants={fadeInUp as any}
                initial="hidden"
                animate="visible"
                custom={2}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 text-sm font-medium text-slate-300 transition hover:border-white/20 hover:bg-white/10"
              >
                <IconBrandGoogle className="h-4 w-4" />
                <span>Continue with Google</span>
              </motion.button>

              {/* Divider */}
              <motion.div
                variants={fadeInUp as any}
                initial="hidden"
                animate="visible"
                custom={3}
                className="flex items-center gap-3"
              >
                <div className="h-px flex-1 bg-white/8" />
                <span className="text-xs font-medium text-slate-500">or</span>
                <div className="h-px flex-1 bg-white/8" />
              </motion.div>

              {/* Fields */}
              <motion.div
                variants={fadeInUp as any}
                initial="hidden"
                animate="visible"
                custom={4}
                className="space-y-3"
              >
                {/* Email */}
                <LabelInputContainer>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Email address"
                    autoComplete="email"
                    value={form.email}
                    onChange={handleChange}
                    className={cn(
                      "h-10 rounded-xl border bg-[#14141F] px-3.5 text-sm text-white placeholder:text-slate-500 transition focus:outline-none",
                      errors.email
                        ? "border-red-500/60 focus:border-red-500"
                        : "border-white/10 focus:border-[#4F6EF7]/60"
                    )}
                  />
                  <AnimatePresence>
                    {errors.email && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="flex items-center gap-1 text-xs text-red-400"
                      >
                        <span>⚠</span> {errors.email}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </LabelInputContainer>

                {/* Password */}
                <LabelInputContainer>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      autoComplete="current-password"
                      value={form.password}
                      onChange={handleChange}
                      className={cn(
                        "h-10 rounded-xl border bg-[#14141F] px-3.5 pr-10 text-sm text-white placeholder:text-slate-500 transition focus:outline-none",
                        errors.password
                          ? "border-red-500/60 focus:border-red-500"
                          : "border-white/10 focus:border-[#4F6EF7]/60"
                      )}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-200"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <IconEyeOff className="h-4 w-4" />
                      ) : (
                        <IconEye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  <AnimatePresence>
                    {errors.password && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="flex items-center gap-1 text-xs text-red-400"
                      >
                        <span>⚠</span> {errors.password}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </LabelInputContainer>
              </motion.div>

              {/* Forgot password */}
              <motion.div
                variants={fadeInUp as any}
                initial="hidden"
                animate="visible"
                custom={5}
                className="flex justify-end"
              >
                <a
                  href="#"
                  className="text-xs text-slate-400 transition hover:text-slate-200"
                >
                  Forgot password?
                </a>
              </motion.div>

              {/* Submit */}
              <motion.button
                variants={fadeInUp as any}
                initial="hidden"
                animate="visible"
                custom={6}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={isLoading}
                className="relative mt-1 flex h-10 w-full items-center justify-center overflow-hidden rounded-xl text-sm font-semibold text-white transition disabled:opacity-60"
                style={{ background: "linear-gradient(135deg, #4F6EF7, #3B56D4)", boxShadow: "0 4px 20px rgba(79,110,247,0.3)" }}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                    </svg>
                    Signing in…
                  </span>
                ) : (
                  "Sign in"
                )}
              </motion.button>
            </form>

            {/* Sign up link */}
            <motion.p
              variants={fadeInUp as any}
              initial="hidden"
              animate="visible"
              custom={7}
              className="mt-6 text-center text-sm text-slate-400"
            >
              Don't have an account?{" "}
              <a
                href="/sign-up"
                className="font-semibold text-[#4F6EF7] transition hover:text-[#7c9ffd]"
              >
                Create one
              </a>
            </motion.p>
          </div>

          {/* ── Right: Illustration ── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            className="relative hidden flex-col items-center justify-center overflow-hidden bg-[#080810] md:flex md:w-[48%]"
          >
            {/* Subtle grid */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(79,110,247,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(79,110,247,0.04) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />
            {/* Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#4F6EF7]/10 via-transparent to-[#0FC8C8]/8" />

            <motion.img
              src={chatImage}
              alt="Chat illustration"
              className="relative z-10 w-full max-w-[340px] drop-shadow-2xl"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Bottom tagline chip */}
            <div
              className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 rounded-full border border-white/10 px-4 py-2 text-xs font-medium text-slate-400 backdrop-blur-sm"
              style={{ background: "rgba(15,15,26,0.8)" }}
            >
              Instant sync · Reliable delivery · Beautifully fast
            </div>
          </motion.div>
        </motion.div>
      </main>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        toastStyle={{ background: "#14141F", color: "#E2E8F0", border: "1px solid rgba(79,110,247,0.2)" }}
      />
    </div>
  );
}

export default LoginPage;
