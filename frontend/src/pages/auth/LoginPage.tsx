import { Link, useNavigate } from "react-router-dom";
import { CgSpinner } from "react-icons/cg";
import { FaGithub } from "react-icons/fa6";
import { MdLockOutline, MdAlternateEmail } from "react-icons/md";
import React, { useState } from "react";
import api from "../../config/api.config";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

const LoginPage = () => {
  const { setCurrentUser, setCurrentUserID } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    try {
      if (!formData.email || !formData.password) {
        toast.error("Please fill in all fields.");
        return;
      }
      const response = await api.post("/login", formData);
      localStorage.setItem("token", response?.data?.data?.token);
      localStorage.setItem("userID", response?.data?.data?.user?._id);
      setCurrentUser(response?.data?.data?.token);
      setCurrentUserID(response?.data?.data?.user?._id);
      toast.success(response.data.message);
      setFormData({ email: "", password: "" });
      navigate("/");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Something went wrong. Please try again.");
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0d1117] flex flex-col items-center justify-center px-4 py-12">
      {/* Logo */}
      <div className="flex flex-col items-center mb-6">
        <FaGithub className="text-[52px] text-white mb-5" />
        <h1 className="text-[20px] font-semibold text-[#e6edf3]">
          Sign in to ApnaGitHub
        </h1>
      </div>

      {/* Card */}
      <div className="w-full max-w-[340px] bg-[#161b22] border border-[#30363d] rounded-xl px-6 py-6 shadow-2xl shadow-black/50">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[#e6edf3] mb-1.5">
              Email address
            </label>
            <div className="relative">
              <MdAlternateEmail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8b949e] text-sm pointer-events-none" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="email"
                className="w-full bg-[#0d1117] border border-[#30363d] rounded-md pl-9 pr-3 py-1.5 text-sm text-[#e6edf3] placeholder-[#6e7681] outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff]/40 transition"
                placeholder="you@example.com"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="password" className="text-sm font-medium text-[#e6edf3]">
                Password
              </label>
              <a href="#" className="text-xs text-[#58a6ff] hover:underline">
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <MdLockOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8b949e] text-sm pointer-events-none" />
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
                className="w-full bg-[#0d1117] border border-[#30363d] rounded-md pl-9 pr-3 py-1.5 text-sm text-[#e6edf3] placeholder-[#6e7681] outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff]/40 transition"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-1 py-1.5 rounded-md bg-[#238636] hover:bg-[#2ea043] text-sm font-semibold text-white transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <CgSpinner className="animate-spin text-xl" />
            ) : (
              "Sign in"
            )}
          </button>
        </form>
      </div>

      {/* Footer */}
      <div className="w-full max-w-[340px] mt-4 border border-[#30363d] rounded-xl px-6 py-4 text-center text-sm text-[#8b949e]">
        New to ApnaGitHub?{" "}
        <Link to="/signup" className="text-[#58a6ff] hover:underline font-medium">
          Create an account
        </Link>
      </div>
    </main>
  );
};

export default LoginPage;
