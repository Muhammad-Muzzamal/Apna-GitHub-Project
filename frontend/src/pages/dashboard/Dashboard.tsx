import LeftSidebar from "./LeftSidebar";
import Navbar from "./Navbar";
import RepositoryList from "./RepositoryList";
import RightSidebar from "./RightSidebar";
import api from "../../config/api.config";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { useEffect } from "react";
import { useState } from "react";

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [repository, setRepository] = useState([]);
  const [suggestedRepository, setSuggestedRepository] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState([]);

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
        console.log("Error : ", error);
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

  useEffect(() => {
    const query = searchQuery.toLowerCase().trim().replace(/\s+/g, "-");

    if (!query) {
      setSearchResult(repository);
      return;
    }

    const filteredRepositories = repository.filter((repo) =>
      repo.name.toLowerCase().includes(query),
    );

    setSearchResult(filteredRepositories);
  }, [repository, searchQuery]);

  return (
    <main className="min-h-screen bg-[#0D1117] text-white">
      <Navbar
        username={"Muhammad Muzzamal"}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchResult={searchResult}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          <LeftSidebar suggestedRepository={suggestedRepository} />
          <RepositoryList repository={repository} />
          {/* <RightSidebar /> */}
        </div>
      </div>
    </main>
  );
};
export default Dashboard;
