import Navbar from "../dashboard/Navbar";
import type React from "react";
import api from "../../config/api.config";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const NewRepository = () => {
  const { currentUserID } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    visibility: true,
    owner: currentUserID,
  });
  const [loading, setLoading] = useState<Boolean>(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        owner: currentUserID,
      };
      const response = await api.post("/repo/create", payload);
      toast.success(response.data?.message);
      setFormData({
        name: "",
        description: "",
        visibility: true,
        owner: currentUserID,
      });
      navigate("/dashboard")
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Failed to create repository",
        );
      } else {
        toast.error("Something went wrong");
      }

      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D1117] text-gray-200">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-white">
            Create a new repository
          </h1>

          <p className="mt-2 text-sm text-gray-400">
            A repository contains all your project's files, including the
            revision history.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="rounded-lg">
          {/* Repository Name */}
          <div className="mb-6">
            <label
              htmlFor="name"
              className="block text-sm font-semibold text-gray-200 mb-2"
            >
              Repository name <span className="text-red-400">*</span>
            </label>

            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              required
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  [e.target.name]: e.target.value,
                }));
              }}
              placeholder="my-awesome-project"
              className="w-full bg-[#0D1117] border border-gray-600 rounded-md px-3 py-2 text-sm text-white outline-none focus:border-[#1F6FEB] focus:ring-1 focus:ring-[#1F6FEB] transition"
            />

            <p className="mt-2 text-xs text-gray-500">
              Choose a short and memorable name for your repository.
            </p>
          </div>

          {/* Description */}
          <div className="mb-7">
            <label
              htmlFor="description"
              className="block text-sm font-semibold text-gray-200 mb-2"
            >
              Description
              <span className="ml-2 font-normal text-gray-500">(optional)</span>
            </label>

            <textarea
              id="description"
              name="description"
              rows={3}
              value={formData.description}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  [e.target.name]: e.target.value,
                }));
              }}
              placeholder="Describe what this repository is about..."
              className="w-full resize-none bg-[#0D1117] border border-gray-600 rounded-md px-3 py-2 text-sm text-white outline-none focus:border-[#1F6FEB] focus:ring-1 focus:ring-[#1F6FEB] transition"
            />
          </div>

          {/* Divider */}
          <div className="border-t border-gray-700 my-7" />

          {/* Configuration */}
          <div>
            <h2 className="text-base font-semibold text-white">
              Configuration
            </h2>

            <p className="text-sm text-gray-400 mt-1 mb-5">
              Choose who can see and commit to this repository.
            </p>

            {/* Visibility */}
            <div>
              <label
                htmlFor="visibility"
                className="block text-sm font-semibold text-gray-200 mb-2"
              >
                Visibility <span className="text-red-400">*</span>
              </label>

              <select
                name="visibility"
                id="visibility"
                value={String(formData.visibility)}
                required
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    visibility: e.target.value === "true",
                  }));
                }}
                className="w-full bg-[#0D1117] border border-gray-600 rounded-md px-3 py-2 text-sm text-white outline-none focus:border-[#1F6FEB] focus:ring-1 focus:ring-[#1F6FEB] transition"
              >
                <option value="true">Public</option>
                <option value="false">Private</option>
              </select>

              <p className="mt-2 text-xs text-gray-500">
                {formData.visibility
                  ? "Anyone can see this repository."
                  : "Only you and people you give access to can see this repository."}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="border-t border-gray-700 mt-8 pt-6 flex items-center justify-end gap-3">
            {/* <button
              type="button"
              className="px-4 py-2 text-sm font-medium text-gray-300 border border-gray-600 rounded-md hover:bg-[#21262D] transition"
            >
              Cancel
            </button> */}

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-semibold text-white bg-[#238636] rounded-md hover:bg-[#2EA043] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating..." : "Create Repository"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default NewRepository;
