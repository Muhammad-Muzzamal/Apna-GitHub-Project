import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { CgSpinner } from "react-icons/cg";
import { FaGithub } from "react-icons/fa6";
import { MdLockOutline, MdAlternateEmail, MdPersonOutline } from "react-icons/md";
import api from "../../config/api.config";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

const SignUpPage = () => {
  const { setCurrentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    try {
      if (!formData.username.trim() || !formData.email || !formData.password) {
        toast.error("Please fill in all fields.");
        return;
      }
      const response = await api.post("/signup", formData);
      localStorage.setItem("token", response?.data?.data?.token);
      setCurrentUser(response?.data?.data?.token);
      toast.success(response.data.message);
      navigate("/");
      setFormData({ username: "", email: "", password: "" });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Something went wrong.");
      } else {
        toast.error("Unexpected Error.");
      }
    } finally {
      setLoading(false); // ✅ fixed: was setLoading(true)
    }
  };

  return (
    <main className="min-h-screen bg-[#0d1117] flex flex-col items-center justify-center px-4 py-12">
      {/* Logo */}
      <div className="flex flex-col items-center mb-6">
        <FaGithub className="text-[52px] text-white mb-5" />
        <h1 className="text-[20px] font-semibold text-[#e6edf3]">
          Create your account
        </h1>
      </div>

      {/* Card */}
      <div className="w-full max-w-[340px] bg-[#161b22] border border-[#30363d] rounded-xl px-6 py-6 shadow-2xl shadow-black/50">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-[#e6edf3] mb-1.5">
              Username
            </label>
            <div className="relative">
              <MdPersonOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8b949e] text-sm pointer-events-none" />
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                autoComplete="username"
                className="w-full bg-[#0d1117] border border-[#30363d] rounded-md pl-9 pr-3 py-1.5 text-sm text-[#e6edf3] placeholder-[#6e7681] outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff]/40 transition"
                placeholder="yourhandle"
              />
            </div>
          </div>

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
            <label htmlFor="password" className="block text-sm font-medium text-[#e6edf3] mb-1.5">
              Password
            </label>
            <div className="relative">
              <MdLockOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8b949e] text-sm pointer-events-none" />
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete="new-password"
                className="w-full bg-[#0d1117] border border-[#30363d] rounded-md pl-9 pr-3 py-1.5 text-sm text-[#e6edf3] placeholder-[#6e7681] outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff]/40 transition"
                placeholder="Minimum 8 characters"
              />
            </div>
            <p className="text-[11px] text-[#8b949e] mt-1.5">
              Must be at least 8 characters including a number.
            </p>
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
              "Create account"
            )}
          </button>
        </form>
      </div>

      {/* Footer */}
      <div className="w-full max-w-[340px] mt-4 border border-[#30363d] rounded-xl px-6 py-4 text-center text-sm text-[#8b949e]">
        Already have an account?{" "}
        <Link to="/login" className="text-[#58a6ff] hover:underline font-medium">
          Sign in
        </Link>
      </div>
    </main>
  );
};

export default SignUpPage;
