import { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../config/api.config";

const Dashboard = () => {
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchRepositories = () => {
        // const response = api.get()
    }
  }, []);

  return <div>Dashboard</div>;
};

export default Dashboard;
