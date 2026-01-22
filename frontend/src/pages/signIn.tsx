"use client";

import React, { JSX, useState } from "react";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { cn } from "@/lib/utils";
import { IconBrandGoogle } from "@tabler/icons-react";
import { publicAxios } from "@/service/axiosInstance/userInstance";
import { useNavigate } from "react-router-dom";
import chatImage from "../assets/chat.png";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion, AnimatePresence } from "framer-motion";
import { signInRequest } from "@/service/Api/auth.userApi";

const LabelInputContainer = ({children,className,}: {children: React.ReactNode;className?: string;}): JSX.Element => (
  <div className={cn("mb-3 flex w-full flex-col space-y-2", className)}>
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

  const [form, setForm] = useState<FormData>({ email: "", password: "" });
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const id = e.target.id as keyof FormData;
    setForm({ ...form, [id]: e.target.value });
  };

  const validate = (): FormErrors => {
    const newErrors: FormErrors = {};
    if (!form.email || !form.email.includes("@"))
      newErrors.email = "Invalid email address";
    if (!form.password || form.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    try {
      const payload = { email: form.email, password: form.password };
      const response = await signInRequest(payload);
      console.log('accs++++++',response.data.accessToken)
      localStorage.setItem("access-token", response.data.accessToken);
      if (response.data.success) navigate("/dashboard");
      else toast.error(response.data.message || "Invalid credentials");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 24 },
    visible: (i = 0) => ({
      opacity: 1,
      y: 0,
      transition: { delay: 0.08 * i, duration: 0.55, ease: "easeOut" },
    }),
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-900 text-white">
      {/* Ambient animated orbs */}
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          className="absolute -left-24 -top-32 h-80 w-80 rounded-full bg-purple-500/25 blur-3xl"
          animate={{ scale: [1, 1.08, 1], opacity: [0.4, 0.65, 0.4] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[-120px] right-[-60px] h-96 w-96 rounded-full bg-indigo-400/20 blur-3xl"
          animate={{ scale: [1.05, 0.95, 1.05], opacity: [0.45, 0.7, 0.45] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <main className="relative flex min-h-screen items-center justify-center px-4 py-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex w-full max-w-6xl overflow-hidden rounded-3xl bg-white/10 shadow-2xl shadow-purple-900/40 backdrop-blur-2xl ring-1 ring-white/10"
        >
          {/* Left: Form */}
          <div className="w-full max-w-xl space-y-7 p-8 md:w-1/2 md:p-12">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp as any}
              custom={0}
              className="space-y-2"
            >
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-purple-200 ring-1 ring-white/10">
                Sign In
              </span>
              <h1 className="text-4xl font-black leading-tight text-white md:text-5xl">
                Welcome back to your conversations
              </h1>
              <p className="text-sm text-slate-200/80">
                Stay synced across devices with a secure, beautifully fast
                experience.
              </p>
            </motion.div>

            <form onSubmit={handleSubmit} className="space-y-5 pt-2">
              <motion.button
                type="button"
                variants={fadeInUp as any}
                initial="hidden"
                animate="visible"
                custom={1}
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 18px 40px rgba(168, 85, 247, 0.35)",
                }}
                whileTap={{ scale: 0.98 }}
                className="group relative flex h-11 w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 px-4 text-sm font-semibold text-white shadow-lg"
              >
                <IconBrandGoogle className="h-4 w-4" />
                <span>Continue with Google</span>
                <span className="absolute inset-0 rounded-full bg-white/0 transition group-hover:bg-white/10" />
              </motion.button>

              <motion.div
                variants={fadeInUp as any}
                initial="hidden"
                animate="visible"
                custom={2}
                className="flex items-center gap-3 text-slate-300/70"
              >
                <div className="h-px flex-1 bg-white/15" />
                <span className="text-xs font-semibold">OR</span>
                <div className="h-px flex-1 bg-white/15" />
              </motion.div>

              <motion.div
                variants={fadeInUp as any}
                initial="hidden"
                animate="visible"
                custom={3}
                className="space-y-4"
              >
                <LabelInputContainer>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Email"
                    autoComplete="email"
                    value={form.email}
                    onChange={handleChange}
                    className="rounded-2xl border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-300/60 shadow-sm transition focus:border-purple-400 focus:ring-purple-400"
                  />
                  <AnimatePresence>
                    {errors.email && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="text-xs text-rose-300"
                      >
                        {errors.email}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </LabelInputContainer>

                <LabelInputContainer>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Password"
                    autoComplete="current-password"
                    value={form.password}
                    onChange={handleChange}
                    className="rounded-2xl border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-300/60 shadow-sm transition focus:border-purple-400 focus:ring-purple-400"
                  />
                  <AnimatePresence>
                    {errors.password && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="text-xs text-rose-300"
                      >
                        {errors.password}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </LabelInputContainer>
              </motion.div>

              <motion.button
                variants={fadeInUp as any}
                initial="hidden"
                animate="visible"
                custom={4}
                whileHover={{
                  scale: 1.015,
                  boxShadow: "0 20px 45px rgba(79, 70, 229, 0.35)",
                }}
                whileTap={{ scale: 0.985 }}
                className="relative mt-2 inline-flex h-11 w-full items-center justify-center overflow-hidden rounded-full bg-indigo-500 px-6 text-sm font-semibold text-white shadow-xl transition"
                type="submit"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 opacity-80" />
                <span className="relative">Log In</span>
              </motion.button>
            </form>

            <motion.div
              variants={fadeInUp as any}
              initial="hidden"
              animate="visible"
              custom={5}
              className="flex items-center justify-between text-sm text-slate-200/80"
            >
              <a
                href="#"
                className="transition hover:text-white hover:underline"
              >
                Forgot Password?
              </a>
              <span>
                New here?{" "}
                <a
                  href="/sign-up"
                  className="font-semibold text-purple-200 hover:text-white hover:underline"
                >
                  Create account
                </a>
              </span>
            </motion.div>
          </div>

          {/* Right: Illustration */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            className="relative hidden w-1/2 items-center justify-center bg-gradient-to-br from-indigo-700 via-purple-700 to-slate-900 p-10 md:flex"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.08),transparent_28%),radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.07),transparent_25%),radial-gradient(circle_at_50%_70%,rgba(255,255,255,0.06),transparent_30%)]" />
            <motion.img
              src={chatImage}
              alt="Chat"
              className="relative z-10 w-full max-w-md drop-shadow-2xl"
              initial={{ scale: 0.94, rotate: -2 }}
              animate={{
                scale: 1,
                rotate: 0,
                y: [0, -8, 0],
              }}
              transition={{
                duration: 4.5,
                ease: "easeInOut",
                repeat: Infinity,
              }}
            />
            <motion.div
              className="absolute bottom-8 right-8 z-10 rounded-2xl bg-white/10 px-4 py-3 text-xs text-white backdrop-blur"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              Instant sync. Reliable delivery. Beautifully fast.
            </motion.div>
          </motion.div>
        </motion.div>
      </main>
      <ToastContainer />
    </div>
  );
}

export default LoginPage;