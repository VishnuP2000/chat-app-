"use client";
import Cropper, { Area } from "react-easy-crop";
import React, { JSX, useState, useCallback } from "react";
import { Input } from "../components/ui/input";
import { cn } from "@/lib/utils";
import { IconBrandGoogle, IconEye, IconEyeOff, IconCamera } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
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
    <div 
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden font-sans"
      style={{
        background: `
          radial-gradient(circle at top right, rgba(35, 83, 71, 0.22), transparent 45%),
          radial-gradient(circle at bottom left, rgba(142, 182, 155, 0.08), transparent 40%),
          #051F20
        `
      }}
    >
      <main className="relative flex w-full flex-col items-center justify-center px-4 py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-[460px] rounded-[18px] p-6 md:p-9 shadow-[0_20px_60px_rgba(0,0,0,0.3)]"
          style={{
            background: "#0B2B26",
            border: "1px solid rgba(142, 182, 155, 0.12)",
            width: "calc(100% - 2rem)"
          }}
        >
          {/* Logo mark */}
          <motion.div
            variants={fadeInUp as any}
            initial="hidden"
            animate="visible"
            custom={0}
            className="mb-6 flex items-center gap-2.5 justify-center"
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
            className="mb-8 text-center space-y-1.5"
          >
            <h1 className="font-display font-bold leading-tight text-[#DAF1DE]" style={{ fontSize: "clamp(1.8rem, 3vw, 2.3rem)" }}>
              Create an account
            </h1>
            <p className="text-sm" style={{ color: "rgba(142, 182, 155, 0.75)" }}>
              Join TalkyTalky and start connecting instantly.
            </p>
          </motion.div>

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
              className="flex h-[48px] w-full items-center justify-center gap-2 rounded-xl text-sm font-medium transition"
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

            {/* Profile image upload */}
            <motion.div
              variants={fadeInUp as any}
              initial="hidden"
              animate="visible"
              custom={3}
              className="flex justify-center mb-2"
            >
              <label
                htmlFor="profile-image-upload"
                className="group relative cursor-pointer"
                aria-label="Upload profile photo"
              >
                <div
                  className="relative flex h-[72px] w-[72px] items-center justify-center overflow-hidden rounded-full border-2 border-dashed transition-all"
                  style={{
                    borderColor: imagePreview && !showCropper ? "#8EB69B" : "rgba(142, 182, 155, 0.35)",
                    background: "rgba(142, 182, 155, 0.06)",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#8EB69B")}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = imagePreview && !showCropper ? "#8EB69B" : "rgba(142, 182, 155, 0.35)")}
                >
                  {imagePreview && !showCropper ? (
                    <img
                      src={imagePreview}
                      alt="Profile preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-1 transition" style={{ color: "rgba(142, 182, 155, 0.6)" }}>
                      <IconCamera className="h-5 w-5 " />
                      <span className="text-[10px] font-medium">Photo</span>
                    </div>
                  )}
                  {/* Hover overlay */}
                  <div className="absolute inset-0 flex items-center justify-center rounded-full opacity-0 transition group-hover:opacity-100" style={{ background: "rgba(5, 31, 32, 0.5)" }}>
                    <IconCamera className="h-5 w-5" style={{ color: "#DAF1DE" }} />
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
              className="space-y-4"
            >
              {/* Name */}
              <LabelInputContainer>
                <label htmlFor="name" className="text-sm font-medium pl-1" style={{ color: "#8EB69B" }}>
                  Full name
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter name"
                  value={form.name}
                  onChange={handleChange}
                  style={{
                    background: "#051F20",
                    border: errors.name ? "1px solid #e67a7a" : "1px solid rgba(142, 182, 155, 0.16)",
                    color: "#DAF1DE",
                    height: "48px",
                    boxShadow: "none",
                  }}
                  className="rounded-[10px] px-4 text-sm transition-all focus:outline-none placeholder-[rgba(142,182,155,0.5)] focus:border-[#8EB69B] focus:ring-[3px] focus:ring-[rgba(142,182,155,0.08)]"
                />
                <AnimatePresence>
                  {errors.name && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="flex items-center gap-1 text-xs mt-1 pl-1"
                      style={{ color: "#e67a7a" }}
                    >
                      <span>⚠</span> {errors.name}
                    </motion.p>
                  )}
                </AnimatePresence>
              </LabelInputContainer>

              {/* Email */}
              <LabelInputContainer>
                <label htmlFor="email" className="text-sm font-medium pl-1" style={{ color: "#8EB69B" }}>
                  Email address
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email"
                  value={form.email}
                  onChange={handleChange}
                  style={{
                    background: "#051F20",
                    border: errors.email ? "1px solid #e67a7a" : "1px solid rgba(142, 182, 155, 0.16)",
                    color: "#DAF1DE",
                    height: "48px",
                    boxShadow: "none",
                  }}
                  className="rounded-[10px] px-4 text-sm transition-all focus:outline-none placeholder-[rgba(142,182,155,0.5)] focus:border-[#8EB69B] focus:ring-[3px] focus:ring-[rgba(142,182,155,0.08)]"
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
                    placeholder="Create a password"
                    value={form.password}
                    onChange={handleChange}
                    style={{
                      background: "#051F20",
                      border: errors.password ? "1px solid #e67a7a" : "1px solid rgba(142, 182, 155, 0.16)",
                      color: "#DAF1DE",
                      height: "48px",
                      boxShadow: "none",
                    }}
                    className="rounded-[10px] px-4 pr-11 text-sm transition-all focus:outline-none placeholder-[rgba(142,182,155,0.5)] focus:border-[#8EB69B] focus:ring-[3px] focus:ring-[rgba(142,182,155,0.08)]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 transition"
                    style={{ color: "#8EB69B" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#DAF1DE")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#8EB69B")}
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
                      className="flex items-center gap-1 text-xs mt-1 pl-1"
                      style={{ color: "#e67a7a" }}
                    >
                      <span>⚠</span> {errors.password}
                    </motion.p>
                  )}
                </AnimatePresence>
              </LabelInputContainer>

              {/* Confirm Password */}
              <LabelInputContainer>
                <label htmlFor="confirmPassword" className="text-sm font-medium pl-1" style={{ color: "#8EB69B" }}>
                  Confirm Password
                </label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    style={{
                      background: "#051F20",
                      border: errors.confirmPassword ? "1px solid #e67a7a" : "1px solid rgba(142, 182, 155, 0.16)",
                      color: "#DAF1DE",
                      height: "48px",
                      boxShadow: "none",
                    }}
                    className="rounded-[10px] px-4 pr-11 text-sm transition-all focus:outline-none placeholder-[rgba(142,182,155,0.5)] focus:border-[#8EB69B] focus:ring-[3px] focus:ring-[rgba(142,182,155,0.08)]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 transition"
                    style={{ color: "#8EB69B" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#DAF1DE")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#8EB69B")}
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
                      className="flex items-center gap-1 text-xs mt-1 pl-1"
                      style={{ color: "#e67a7a" }}
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
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className=" cursor-pointer relative mt-2 flex h-[50px] w-full items-center justify-center overflow-hidden rounded-[10px] text-[15px] font-semibold transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
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
                <span className="flex items-center gap-2 cursor-pointer">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5 ">
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                  </svg>
                  Creating account…
                </span>
              ) : (
                "Create account"
              )}
            </motion.button>
          </form>

          {/* Sign in link */}
          <motion.p
            variants={fadeInUp as any}
            initial="hidden"
            animate="visible"
            custom={6}
            className="mt-6 text-center text-sm"
            style={{ color: "rgba(142, 182, 155, 0.7)" }}
          >
            Already have an account?{" "}
            <a
              href="/sign-in"
              className="font-semibold transition"
              style={{ color: "#8EB69B" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#DAF1DE")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#8EB69B")}
            >
              Sign in
            </a>
          </motion.p>
        </motion.div>
      </main>

      {/* Image crop modal */}
      <AnimatePresence>
        {showCropper && imagePreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
            style={{ background: "rgba(5, 31, 32, 0.85)" }}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="w-full max-w-md rounded-[18px] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.4)]"
              style={{
                background: "#0B2B26",
                border: "1px solid rgba(142, 182, 155, 0.12)"
              }}
            >
              <h2 className="mb-1 text-lg font-bold" style={{ color: "#DAF1DE" }}>Crop your photo</h2>
              <p className="mb-5 text-sm" style={{ color: "rgba(142, 182, 155, 0.75)" }}>
                Adjust and crop your profile picture.
              </p>

              <div className="relative h-72 w-full overflow-hidden rounded-xl" style={{ background: "#051F20" }}>
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
                <div className="mb-1.5 flex justify-between text-xs font-medium" style={{ color: "#8EB69B" }}>
                  <span>Zoom</span>
                  <span>{zoom.toFixed(1)}×</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.1}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full cursor-pointer"
                  style={{ accentColor: "#8EB69B" }}
                />
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowCropper(false);
                    setImagePreview(null);
                  }}
                  className=" cursor-pointer rounded-xl px-4 py-2 text-sm font-medium transition"
                  style={{ 
                    border: "1px solid rgba(142, 182, 155, 0.16)",
                    color: "#DAF1DE",
                    background: "transparent"
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(142, 182, 155, 0.08)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCropImage}
                  className="cursor-pointer rounded-[10px] px-5 py-2 text-sm font-semibold transition-all hover:opacity-90 shadow-[0_4px_12px_rgba(142,182,155,0.15)]"
                  style={{ 
                    background: "linear-gradient(135deg, #8EB69B, #235347)", 
                    color: "#051F20"
                  }}
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

export default SignUpPage;