import { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../config/api.config";
import toast from "react-hot-toast";
import { useState } from "react";

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [repository, setRepository] = useState([]);
  const [suggestedRepository, setSuggestedRepository] = useState([]);

  useEffect(() => {
    if (!currentUser) return;
    const fetchRepositories = async () => {
      try {
        const response = await api.get("/repo/user/me", {
          headers: {
            Authorization: `Bearer ${currentUser}`,
          },
        });
        setRepository(response.data?.data);
        console.log(response.data?.data);
        toast.success(response.data.message);
      } catch (error) {
        toast.error("Error while Fetching repository");
        console.log(error);
      }
    };

    const fetchSuggestedRepositories = async () => {
      try {
        const response = await api.get("/repo/all");
        setSuggestedRepository(response.data?.data);
      } catch (error) {
        toast.error("Error while Fetching Suggested repository");
        console.log(error);
      }
    };

    fetchRepositories();
    fetchSuggestedRepositories();
  }, []);
  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-12">
      {/* My Repositories */}
      <section>
        <h1 className="text-3xl font-bold mb-6">My Repositories</h1>

        <div className="flex flex-wrap gap-6">
          {repository.map((repo) => (
            <div
              key={repo._id}
              className="w-full md:w-[350px] bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">{repo.name}</h2>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    repo.visibility
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {repo.visibility ? "Public" : "Private"}
                </span>
              </div>

              <p className="text-gray-600 mb-4">{repo.description}</p>

              <div className="space-y-2 text-sm text-gray-700">
                <p>
                  <span className="font-semibold">Repository ID:</span>{" "}
                  {repo._id}
                </p>

                <p>
                  <span className="font-semibold">Owner:</span> {repo.owner}
                </p>

                <p>
                  <span className="font-semibold">Content:</span>{" "}
                  {repo.content.length} Files
                </p>

                <p>
                  <span className="font-semibold">Issues:</span>{" "}
                  {repo.issues.length} Open Issues
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Suggested Repositories */}
      <section>
        <h1 className="text-3xl font-bold mb-6">Suggested Repositories</h1>

        <div className="flex flex-wrap gap-6">
          {suggestedRepository.map((repo) => (
            <div
              key={repo._id}
              className="w-full md:w-[350px] bg-gray-900 text-white rounded-xl shadow-md p-5 hover:shadow-xl transition"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">{repo.name}</h2>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    repo.visibility
                      ? "bg-green-600 text-white"
                      : "bg-red-600 text-white"
                  }`}
                >
                  {repo.visibility ? "Public" : "Private"}
                </span>
              </div>

              <p className="text-gray-300 mb-4">{repo.description}</p>

              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-semibold">Repository ID:</span>{" "}
                  {repo._id}
                </p>

                <p>
                  <span className="font-semibold">Owner:</span> {repo.owner}
                </p>

                <p>
                  <span className="font-semibold">Content:</span>{" "}
                  {repo.content.length} Files
                </p>

                <p>
                  <span className="font-semibold">Issues:</span>{" "}
                  {repo.issues.length} Open Issues
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
export default Dashboard;
