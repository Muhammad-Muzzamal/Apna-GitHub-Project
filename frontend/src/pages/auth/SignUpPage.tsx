import { FaGithub } from "react-icons/fa6";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../config/api.config.js";
import toast from "react-hot-toast";

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      if (
        !formData.username ||
        !formData.username.trim() ||
        !formData.email ||
        !formData.password
      ) {
        toast.error("Please fill in all fields.");
        return;
      }
      const response = await api.post("/signup", formData);
      toast.success(response.data.message);
      setFormData({ username: "", email: "", password: "" });
      return;
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

  return (
    <main className="bg-[#0D1117] min-h-screen text-[#F0F6FC]">
      <div>
        <FaGithub className="text-5xl" />
        <h2>Sign in to ApnaGithub</h2>
      </div>
      <form
        onSubmit={(event) => {
          handleSubmit(event);
        }}
      >
        {/* Username */}
        <div>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            name="username"
            id="username"
            value={formData.username}
            className="border"
            required
            onChange={(event) => {
              setFormData((prev) => ({
                ...prev,
                [event.target.name]: event.target.value,
              }));
            }}
          />
        </div>

        {/* email */}
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            className="border"
            required
            value={formData.email}
            onChange={(event) => {
              setFormData((prev) => ({
                ...prev,
                [event.target.name]: event.target.value,
              }));
            }}
          />
        </div>

        {/* password */}
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            className="border"
            value={formData.password}
            required
            onChange={(event) => {
              setFormData((prev) => ({
                ...prev,
                [event.target.name]: event.target.value,
              }));
            }}
          />
        </div>
        <button type="submit">Signup</button>
      </form>
      <div>
        New to GitHub? <Link to="/">Create an account</Link>
      </div>
    </main>
  );
};

export default SignUpPage;
