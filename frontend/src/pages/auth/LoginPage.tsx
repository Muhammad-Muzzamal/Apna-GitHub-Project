import { Link, useNavigate } from "react-router-dom";

import { CgSpinner } from "react-icons/cg";
import { FaGithub } from "react-icons/fa6";
import React from "react";
import api from "../../config/api.config";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";

const LoginPage = () => {
  const { setCurrentUser } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/login", formData);
      
      setCurrentUser(response?.data?.data?.user);
      toast.success(response.data.message);
      
      setFormData({ email: "", password: "" });
      navigate("/");
      return;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const serverMessage = error.response?.data?.message;
        toast.error(serverMessage || "Something went wrong. Please try again.");
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0D1117] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo & Heading */}
        <div className="flex flex-col items-center mb-4">
          <FaGithub className="text-5xl text-white mb-4" />
          <h2 className="text-xl font-semibold text-white">
            Login to ApnaGitHub
          </h2>
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          className="rounded-lg p-6 space-y-5 text-white"
        >
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={(event) =>
                setFormData((prev) => ({
                  ...prev,
                  [event.target.name]: event.target.value,
                }))
              }
              className="w-full rounded-md border border-gray-600 bg-[#0D1117] px-3 py-2 text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={(event) =>
                setFormData((prev) => ({
                  ...prev,
                  [event.target.name]: event.target.value,
                }))
              }
              className="w-full rounded-md border border-gray-600 bg-[#0D1117] px-3 py-2 text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-[#238636] py-2.5 font-medium text-white transition hover:bg-[#29903b]"
          >
            {loading ? (
              <CgSpinner className="animate-spin text-2xl m-auto" />
            ) : (
              "Login"
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 p-4 text-center text-sm text-white">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-400 hover:underline">
            Sign up
          </Link>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;
