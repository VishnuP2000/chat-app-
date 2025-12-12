"use client";

import React, { JSX, useState } from "react";
import { Label } from "../components/ui/label"; // Assuming this is your custom Label
import { Input } from "../components/ui/input"; // Assuming this is your custom Input
import { cn } from "@/lib/utils";
import { IconBrandGoogle } from "@tabler/icons-react"; // Your existing Google Icon
import { publicAxios } from "@/service/axiosInstance/userInstance";
import { useNavigate } from "react-router-dom";
import chatImage from "../assets/Gemini_Generated_Image_yfhlqbyfhlqbyfhl.png";

// --- UTILITY COMPONENTS (Kept from your original code) ---

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}): JSX.Element => {
  return (
    <div className={cn("mb-4 flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
};

// --- MAIN LOGIN COMPONENT ---

interface FormData {
  email: string;
  password: string;
}

type FormErrors = Partial<Record<keyof FormData, string>>;

function LoginPage(): JSX.Element {
  const navigate = useNavigate();

  // Form state
  const [form, setForm] = useState<FormData>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const id = e.target.id as keyof FormData;
    const value = e.target.value;
    setForm({ ...form, [id]: value });
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
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    try {
      const payload = {
        email: form.email,
        password: form.password,
      };

      const response = await publicAxios.post("/user/signIn", payload);
      localStorage.setItem("access-token", response.data.accessToken);
      if (response.data.success) {
        console.log("Success:", response.data);
        navigate("/dashboard");
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white font-sans">
      {/* --- HEADER / NAVIGATION --- */}

      {/* --- MAIN CONTENT AREA (Login Form + Illustration) --- */}
      <main className="flex min-h-[calc(100vh-80px)] items-center justify-center p-4 md:p-12">
        <div className="flex w-full max-w-7xl rounded-2xl bg-white p-6 shadow-2xl lg:p-12">
          {/* --- LEFT SIDE: LOGIN FORM --- */}
          <div className="w-full max-w-lg space-y-6 p-4 md:w-1/2 md:p-10">
            <h1 className="text-4xl font-extrabold text-indigo-900">
              Welcome back!
            </h1>
            <p className="text-md text-gray-500">
              Log in to continue your conversation.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              {/* Google Login Button */}
              <button
                type="button"
                className="group/btn relative flex h-10 w-full items-center justify-center space-x-2 rounded-full bg-purple-500 px-4 font-medium text-white shadow-md transition hover:bg-purple-600"
              >
                <IconBrandGoogle className="h-4 w-4 text-white" />
                <span className="text-sm">LOG IN WITH GOOGLE</span>
              </button>

              {/* OR Divider */}
              <div className="flex items-center py-2">
                <div className="h-px flex-grow bg-gray-300" />
                <span className="px-3 text-xs font-semibold text-gray-500">
                  OR
                </span>
                <div className="h-px flex-grow bg-gray-300" />
              </div>

              {/* Email Input */}
              <LabelInputContainer>
                {/* Removed <Label> to match the image design, using only placeholder */}
                <Input
                  id="email"
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                  className="rounded-lg border-gray-300 px-4 py-2 focus:border-purple-500 focus:ring-purple-500"
                />
                {errors.email && (
                  <p className="text-xs text-red-500">{errors.email}</p>
                )}
              </LabelInputContainer>

              {/* Password Input */}
              <LabelInputContainer>
                {/* Removed <Label> to match the image design, using only placeholder */}
                <Input
                  id="password"
                  type="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  className="rounded-lg border-gray-300 px-4 py-2 focus:border-purple-500 focus:ring-purple-500"
                />
                {errors.password && (
                  <p className="text-xs text-red-500">{errors.password}</p>
                )}
              </LabelInputContainer>

              {/* Log In Button */}
              <button
                className="group/btn relative mt-6 block h-10 w-28 rounded-full bg-purple-500 font-medium text-white transition hover:bg-purple-600"
                type="submit"
              >
                LOGIN
              </button>
            </form>

            {/* Forgot Password Link */}
            <a
              href="#"
              className="mt-2 block text-sm text-gray-500 hover:text-purple-600 hover:underline"
            >
              Forgot Password?
            </a>
          </div>
          <div className="w-1/2 hidden lg:flex items-center justify-center">
            <img
              src={chatImage}
              alt="Chat"
              className="w-full h-full object-contain p-6"
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default LoginPage;
