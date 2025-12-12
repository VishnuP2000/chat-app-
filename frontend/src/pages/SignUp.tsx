"use client";

import React, { JSX, useState } from "react";
import { Label } from "../components/ui/label"; // Assuming this is your custom Label
import { Input } from "../components/ui/input"; // Assuming this is your custom Input
import { cn } from "@/lib/utils";
import { IconBrandGoogle } from "@tabler/icons-react";
import { publicAxios } from "@/service/axiosInstance/userInstance"; // Assuming you have a signUp endpoint
import { useNavigate } from "react-router-dom";
import chatImage from "../assets/Gemini_Generated_Image_yfhlqbyfhlqbyfhl.png"

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

// --- MAIN SIGN UP COMPONENT ---

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

type FormErrors = Partial<Record<keyof SignUpFormData, string>>;

function SignUpPage(): JSX.Element {
  const navigate = useNavigate();

  // Form state
  const [form, setForm] = useState<SignUpFormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const id = e.target.id as keyof SignUpFormData;
    const value = e.target.value;
    setForm({ ...form, [id]: value });
  };

  const validate = (): FormErrors => {
    const newErrors: FormErrors = {};

    if (!form.name || form.name.length < 2) newErrors.name = "Name is required.";
    if (!form.email || !form.email.includes("@")) newErrors.email = "Invalid email address.";
    if (!form.password || form.password.length < 6)
      newErrors.password = "Password must be at least 6 characters.";
    if (form.password !== form.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match.";

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    try {
      const payload = {
        name: form.name,
        email: form.email,
        password: form.password,
      };

      // NOTE: You must update the publicAxios path to your actual sign-up endpoint
      const response = await publicAxios.post("/user/signUp", payload); 
      
      // Assuming successful sign-up immediately logs the user in
      localStorage.setItem("access-token", response.data.accessToken); 
      
      if (response.data.success) {
        console.log("Sign Up Success:", response.data);
        navigate("/dashboard");
      }
    } catch (error) {
      console.log("Error during Sign Up:", error);
      // Handle and display error messages here
    }
  };

  return (
    <div className="min-h-screen w-full bg-white font-sans">

      {/* --- MAIN CONTENT AREA (Sign Up Form + Illustration) --- */}
<main className="flex min-h-screen items-center justify-center p-4 md:p-12 overflow-hidden h-[500px]">

  <div className="flex w-full max-w-7xl h-[650px] rounded-2xl bg-white p-6 shadow-2xl lg:p-12 overflow-hidden">

          {/* --- LEFT SIDE: SIGN UP FORM --- */}
          <div className="w-full max-w-lg space-y-6 p-4 md:w-1/2 md:p-10">
            <h1 className="text-4xl font-extrabold text-indigo-900">
              Create Account
            </h1>
            <p className="text-md text-gray-500">
              Join the conversation today!
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              {/* Google Sign Up Button */}
              <button
                type="button"
                className="group/btn relative flex h-10 w-full items-center justify-center space-x-2 rounded-full bg-purple-500 px-4 font-medium text-white shadow-md transition hover:bg-purple-600"
              >
                <IconBrandGoogle className="h-4 w-4 text-white" />
                <span className="text-sm">SIGN UP WITH GOOGLE</span>
              </button>

              {/* OR Divider */}
              <div className="flex items-center py-2">
                <div className="h-px flex-grow bg-gray-300" />
                <span className="px-3 text-xs font-semibold text-gray-500">
                  OR
                </span>
                <div className="h-px flex-grow bg-gray-300" />
              </div>

              {/* Name Input (New field for Sign Up) */}
              <LabelInputContainer>
                <Input
                  id="name"
                  type="text"
                  placeholder="Full Name"
                  value={form.name}
                  onChange={handleChange}
                  className="rounded-lg border-gray-300 px-4 py-2 focus:border-purple-500 focus:ring-purple-500"
                />
                {errors.name && (
                  <p className="text-xs text-red-500">{errors.name}</p>
                )}
              </LabelInputContainer>

              {/* Email Input */}
              <LabelInputContainer>
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
              
              {/* Confirm Password Input (New field for Sign Up) */}
              <LabelInputContainer>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm Password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="rounded-lg border-gray-300 px-4 py-2 focus:border-purple-500 focus:ring-purple-500"
                />
                {errors.confirmPassword && (
                  <p className="text-xs text-red-500">{errors.confirmPassword}</p>
                )}
              </LabelInputContainer>


              {/* Sign Up Button */}
              <button
                className="group/btn relative mt-6 block h-10 w-32 rounded-full bg-purple-500 font-medium text-white transition hover:bg-purple-600"
                type="submit"
              >
                SIGN UP
              </button>
            </form>

            {/* Already have account Link */}
            <a
              href="#"
              className="block text-sm text-gray-500 hover:text-purple-600 hover:underline"
            >
              Already have an account? Log In
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

export default SignUpPage;