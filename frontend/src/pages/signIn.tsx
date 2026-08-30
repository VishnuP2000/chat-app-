"use client";

import React, { JSX, useState } from "react";
import { Input } from "../components/ui/input";
import { cn } from "@/lib/utils";
import { IconBrandGoogle, IconEye, IconEyeOff } from "@tabler/icons-react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion, AnimatePresence } from "framer-motion";
import { signInRequest } from "@/service/Api/auth.userApi";
import { useAuth } from "@/context/AuthContext";

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
    <div 
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden font-sans"
      style={{
        background: `
          radial-gradient(circle at top left, rgba(35, 83, 71, 0.25), transparent 45%),
          radial-gradient(circle at bottom right, rgba(142, 182, 155, 0.08), transparent 40%),
          #051F20
        `
      }}
    >
      <main className="relative flex w-full flex-col items-center justify-center px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-[440px] rounded-[20px] p-6 md:p-10 shadow-[0_24px_60px_rgba(0,0,0,0.35)]"
          style={{
            background: "rgba(11, 43, 38, 0.95)",
            border: "1px solid rgba(142, 182, 155, 0.14)",
            width: "calc(100% - 2rem)"
          }}
        >
          {/* Logo mark */}
          <motion.div
            variants={fadeInUp as any}
            initial="hidden"
            animate="visible"
            custom={0}
            className="mb-8 flex items-center gap-2.5 justify-center"
          >
            <div
              className="flex h-8 w-8 items-center justify-center rounded-[9px]"
              style={{ background: "#235347", boxShadow: "0 4px 12px rgba(35, 83, 71, 0.4)" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#DAF1DE" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <span className="font-display text-xl font-bold tracking-tight text-[#DAF1DE]">
              Talky<span style={{ color: "#8EB69B" }}>Talky</span>
            </span>
          </motion.div>

          {/* Heading */}
          <motion.div
            variants={fadeInUp as any}
            initial="hidden"
            animate="visible"
            custom={1}
            className="mb-8 text-center space-y-2"
          >
            <h1 className="font-display text-[1.75rem] font-bold leading-tight text-[#DAF1DE]">
              Welcome back
            </h1>
            <p className="text-sm text-[rgba(142,182,155,0.7)]">
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
              className="flex h-[50px] w-full items-center justify-center gap-2 rounded-xl text-sm font-medium transition"
              style={{
                background: "rgba(142, 182, 155, 0.05)",
                border: "1px solid rgba(142, 182, 155, 0.16)",
                color: "#DAF1DE"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#8EB69B";
                e.currentTarget.style.background = "rgba(142, 182, 155, 0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(142, 182, 155, 0.16)";
                e.currentTarget.style.background = "rgba(142, 182, 155, 0.05)";
              }}
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
              className="flex items-center gap-3 py-1"
            >
              <div className="h-px flex-1" style={{ background: "rgba(142, 182, 155, 0.12)" }} />
              <span className="text-xs font-medium" style={{ color: "rgba(142, 182, 155, 0.55)" }}>or</span>
              <div className="h-px flex-1" style={{ background: "rgba(142, 182, 155, 0.12)" }} />
            </motion.div>

            {/* Fields */}
            <motion.div
              variants={fadeInUp as any}
              initial="hidden"
              animate="visible"
              custom={4}
              className="space-y-4"
            >
              {/* Email */}
              <LabelInputContainer>
                <label htmlFor="email" className="text-sm font-medium pl-1" style={{ color: "#8EB69B" }}>
                  Email address
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email"
                  autoComplete="email"
                  value={form.email}
                  onChange={handleChange}
                  style={{
                    background: "#051F20",
                    border: errors.email ? "1px solid #e67a7a" : "1px solid rgba(142, 182, 155, 0.16)",
                    color: "#DAF1DE",
                    height: "50px",
                    boxShadow: "none",
                  }}
                  className="rounded-xl px-4 text-sm transition-all focus:outline-none placeholder-[rgba(142,182,155,0.5)] focus:border-[#8EB69B] focus:ring-[3px] focus:ring-[rgba(142,182,155,0.1)]"
                />
                <AnimatePresence>
                  {errors.email && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="flex items-center gap-1 text-xs mt-1 pl-1"
                      style={{ color: "#e67a7a" }}
                    >
                      <span>⚠</span> {errors.email}
                    </motion.p>
                  )}
                </AnimatePresence>
              </LabelInputContainer>

              {/* Password */}
              <LabelInputContainer>
                <label htmlFor="password" className="text-sm font-medium pl-1" style={{ color: "#8EB69B" }}>
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    value={form.password}
                    onChange={handleChange}
                    style={{
                      background: "#051F20",
                      border: errors.password ? "1px solid #e67a7a" : "1px solid rgba(142, 182, 155, 0.16)",
                      color: "#DAF1DE",
                      height: "50px",
                      boxShadow: "none",
                    }}
                    className="rounded-xl px-4 pr-11 text-sm transition-all focus:outline-none placeholder-[rgba(142,182,155,0.5)] focus:border-[#8EB69B] focus:ring-[3px] focus:ring-[rgba(142,182,155,0.1)]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 transition"
                    style={{ color: "rgba(142, 182, 155, 0.7)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#DAF1DE")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(142, 182, 155, 0.7)")}
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
                      className="flex items-center gap-1 text-xs mt-1 pl-1"
                      style={{ color: "#e67a7a" }}
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
              className="flex justify-end pt-1"
            >
              <a
                href="#"
                className="text-[13px] font-medium transition"
                style={{ color: "#8EB69B" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#DAF1DE")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#8EB69B")}
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
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="cursor-pointer relative mt-2 flex h-[50px] w-full items-center justify-center overflow-hidden rounded-[10px] text-[15px] font-semibold transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
              style={{ 
                background: "linear-gradient(135deg, #8EB69B, #235347)", 
                color: "#051F20"
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow = "0 8px 24px rgba(142, 182, 155, 0.2)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }
              }}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
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
            className="mt-8 text-center text-sm"
            style={{ color: "rgba(142, 182, 155, 0.7)" }}
          >
            Don't have an account?{" "}
            <Link
              to="/sign-up"
              className="font-semibold transition"
              style={{ color: "#8EB69B" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#DAF1DE")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#8EB69B")}
            >
              Create one
            </Link>
          </motion.p>
        </motion.div>
      </main>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        toastStyle={{ 
          background: "#0B2B26", 
          color: "#DAF1DE", 
          border: "1px solid rgba(142, 182, 155, 0.14)",
          borderRadius: "12px",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)"
        }}
      />
    </div>
  );
}

export default LoginPage;
