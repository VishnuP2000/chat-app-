"use client";
import Cropper, { Area } from "react-easy-crop";
import React, { JSX, useState, useCallback } from "react";
import { Input } from "../components/ui/input";
import { cn } from "@/lib/utils";
import { IconBrandGoogle, IconEye, IconEyeOff, IconCamera } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import chatImage from "../assets/chat.png";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion, AnimatePresence } from "framer-motion";
import { signUpRequest } from "@/service/Api/auth.userApi";

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

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

type FormErrors = Partial<Record<keyof SignUpFormData, string>>;

function SignUpPage(): JSX.Element {
  const navigate = useNavigate();

  const [form, setForm] = useState<SignUpFormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  console.log("cropedArea", croppedAreaPixels);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const id = e.target.id as keyof SignUpFormData;
    setForm({ ...form, [id]: e.target.value });
    if (errors[id]) setErrors({ ...errors, [id]: undefined });
  };

  const validate = (): FormErrors => {
    const newErrors: FormErrors = {};
    if (!form.name || form.name.length < 2) newErrors.name = "Name is required.";
    if (!form.email || !form.email.includes("@"))
      newErrors.email = "Invalid email address.";
    if (!form.password || form.password.length < 6)
      newErrors.password = "Password must be at least 6 characters.";
    if (form.password !== form.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match.";
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const formData = new FormData();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    try {
      setIsLoading(true);
      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("password", form.password);
      formData.append("confirmPassword", form.confirmPassword);
      if (image) {
        formData.append("image", image);
      }
      const response = await signUpRequest(formData);
      console.log(response);
      if (response.data.data.success) navigate("/sign-in");
      else toast.error(response.data.data.message || "Sign up failed");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const onCropComplete = useCallback(
    (_croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const createImage = (url: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = url;
      image.onload = () => resolve(image);
      image.onerror = reject;
    });
  };

  const handleCropImage = async () => {
    if (!imagePreview || !croppedAreaPixels) return;
    try {
      const imageElement = await createImage(imagePreview);
      const canvas = document.createElement("canvas");
      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(
        imageElement,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );
      canvas.toBlob(
        (blob) => {
          if (!blob) return;
          const croppedFile = new File([blob], "profile-image.jpg", {
            type: "image/jpeg",
          });
          setImage(croppedFile);
          setImagePreview(URL.createObjectURL(croppedFile));
          setShowCropper(false);
          toast.success("Image cropped successfully");
        },
        "image/jpeg",
        0.95
      );
    } catch (error) {
      console.error("Crop error:", error);
      toast.error("Failed to crop image");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image");
      return;
    }
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    setShowCropper(true);
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 16 },
    visible: (i = 0) => ({
      opacity: 1,
      y: 0,
      transition: { delay: 0.06 * i, duration: 0.4, ease: "easeOut" },
    }),
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-slate-950 via-[#0d0d1a] to-[#0a0a14] text-white">
      {/* Ambient orbs */}
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
          <div className="flex w-full flex-col justify-center px-8 py-10 md:w-[52%] md:px-12">
            {/* Logo */}
            <motion.div
              variants={fadeInUp as any}
              initial="hidden"
              animate="visible"
              custom={0}
              className="mb-7 flex items-center gap-2.5"
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
              className="mb-6 space-y-1.5"
            >
              <h1 className="font-display text-[1.75rem] font-bold leading-tight text-white md:text-[2rem]">
                Create your account
              </h1>
              <p className="text-sm text-slate-400">
                Join TalkyTalky and start connecting instantly.
              </p>
            </motion.div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
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
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-white/8" />
                <span className="text-xs font-medium text-slate-500">or</span>
                <div className="h-px flex-1 bg-white/8" />
              </div>

              {/* Profile image upload */}
              <motion.div
                variants={fadeInUp as any}
                initial="hidden"
                animate="visible"
                custom={3}
                className="flex justify-center"
              >
                <label
                  htmlFor="profile-image-upload"
                  className="group relative cursor-pointer"
                  aria-label="Upload profile photo"
                >
                  <div
                    className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-2 border-dashed transition"
                    style={{
                      borderColor: imagePreview && !showCropper ? "#4F6EF7" : "rgba(79,110,247,0.35)",
                      background: "rgba(79,110,247,0.06)",
                    }}
                  >
                    {imagePreview && !showCropper ? (
                      <img
                        src={imagePreview}
                        alt="Profile preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-1 text-slate-500 group-hover:text-slate-300 transition">
                        <IconCamera className="h-6 w-6" />
                        <span className="text-[10px] font-medium">Photo</span>
                      </div>
                    )}
                    {/* Hover overlay */}
                    <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 transition group-hover:opacity-100">
                      <IconCamera className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <input
                    id="profile-image-upload"
                    className="hidden"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              </motion.div>

              <motion.div
                variants={fadeInUp as any}
                initial="hidden"
                animate="visible"
                custom={4}
                className="space-y-3"
              >
                {/* Name */}
                <LabelInputContainer>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Full name"
                    value={form.name}
                    onChange={handleChange}
                    className={cn(
                      "h-10 rounded-xl border bg-[#14141F] px-3.5 text-sm text-white placeholder:text-slate-500 transition focus:outline-none",
                      errors.name
                        ? "border-red-500/60 focus:border-red-500"
                        : "border-white/10 focus:border-[#4F6EF7]/60"
                    )}
                  />
                  <AnimatePresence>
                    {errors.name && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="flex items-center gap-1 text-xs text-red-400"
                      >
                        <span>⚠</span> {errors.name}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </LabelInputContainer>

                {/* Email */}
                <LabelInputContainer>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Email address"
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
                      {showPassword ? <IconEyeOff className="h-4 w-4" /> : <IconEye className="h-4 w-4" />}
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

                {/* Confirm Password */}
                <LabelInputContainer>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm password"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      className={cn(
                        "h-10 rounded-xl border bg-[#14141F] px-3.5 pr-10 text-sm text-white placeholder:text-slate-500 transition focus:outline-none",
                        errors.confirmPassword
                          ? "border-red-500/60 focus:border-red-500"
                          : "border-white/10 focus:border-[#4F6EF7]/60"
                      )}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-200"
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showConfirmPassword ? <IconEyeOff className="h-4 w-4" /> : <IconEye className="h-4 w-4" />}
                    </button>
                  </div>
                  <AnimatePresence>
                    {errors.confirmPassword && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="flex items-center gap-1 text-xs text-red-400"
                      >
                        <span>⚠</span> {errors.confirmPassword}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </LabelInputContainer>
              </motion.div>

              {/* Submit */}
              <motion.button
                variants={fadeInUp as any}
                initial="hidden"
                animate="visible"
                custom={5}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={isLoading}
                className="mt-1 flex h-10 w-full items-center justify-center rounded-xl text-sm font-semibold text-white transition disabled:opacity-60"
                style={{ background: "linear-gradient(135deg, #4F6EF7, #3B56D4)", boxShadow: "0 4px 20px rgba(79,110,247,0.3)" }}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                    </svg>
                    Creating account…
                  </span>
                ) : (
                  "Create account"
                )}
              </motion.button>
            </form>

            <p className="mt-5 text-center text-sm text-slate-400">
              Already have an account?{" "}
              <a
                href="/sign-in"
                className="font-semibold text-[#4F6EF7] transition hover:text-[#7c9ffd]"
              >
                Sign in
              </a>
            </p>
          </div>

          {/* ── Right: Illustration ── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            className="relative hidden flex-col items-center justify-center overflow-hidden bg-[#080810] md:flex md:w-[48%]"
          >
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(79,110,247,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(79,110,247,0.04) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-[#4F6EF7]/10 via-transparent to-[#0FC8C8]/8" />
            <motion.img
              src={chatImage}
              alt="Chat illustration"
              className="relative z-10 w-full max-w-[320px] drop-shadow-2xl"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            />
            <div
              className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 rounded-full border border-white/10 px-4 py-2 text-xs font-medium text-slate-400 backdrop-blur-sm"
              style={{ background: "rgba(15,15,26,0.8)" }}
            >
              Seamless onboarding · Instant sync · Welcome aboard
            </div>
          </motion.div>
        </motion.div>
      </main>

      {/* Image crop modal */}
      <AnimatePresence>
        {showCropper && imagePreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0F0F1A] p-6 shadow-2xl"
            >
              <h2 className="mb-1 text-lg font-bold text-white">Crop your photo</h2>
              <p className="mb-5 text-sm text-slate-400">
                Adjust and crop your profile picture.
              </p>

              <div className="relative h-72 w-full overflow-hidden rounded-xl bg-black">
                <Cropper
                  image={imagePreview}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  cropShape="rect"
                  showGrid={false}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                />
              </div>

              <div className="mt-4">
                <div className="mb-1.5 flex justify-between text-xs text-slate-400">
                  <span>Zoom</span>
                  <span>{zoom.toFixed(1)}×</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={1}
                  step={0.1}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full cursor-pointer accent-[#4F6EF7]"
                />
              </div>

              <div className="mt-5 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowCropper(false);
                    setImagePreview(null);
                  }}
                  className="rounded-xl border border-white/15 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCropImage}
                  className="rounded-xl px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
                  style={{ background: "linear-gradient(135deg, #4F6EF7, #3B56D4)" }}
                >
                  Crop & save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        toastStyle={{ background: "#14141F", color: "#E2E8F0", border: "1px solid rgba(79,110,247,0.2)" }}
      />
    </div>
  );
}

export default SignUpPage;