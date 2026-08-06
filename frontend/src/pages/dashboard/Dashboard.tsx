import { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../config/api.config";

const Dashboard = () => {
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchRepositories = async () => {
      const response = await api.get("/repo/me", {
        headers: {
          Authorization: `Bearer ${currentUser}`,
        },
      });
      console.log(response.data);
    };

    fetchRepositories();
  }, []);

  return <div>Dashboard</div>;
};

export default Dashboard;
