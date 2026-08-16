import {
  createContext,
  useContext,
  useEffect,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import api from "../config/api.config";

type AuthProviderProps = {
  children: ReactNode;
};

type User = {
  _id: string;
  username: string;
  email: string;
};

type AuthContextType = {
  currentUser: User | null;
  setCurrentUser: Dispatch<SetStateAction<User | null>>;
  loading: boolean;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [loading, setLoading] = useState<boolean>(true);

  const checkAuth = async () => {
    try {
      const response = await api.get("/auth/me");
      setCurrentUser(response?.data?.data?.user ?? null);
    } catch {
      setCurrentUser(null); // no valid cookie / expired session
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // even if the request fails, clear local state
    } finally {
      setCurrentUser(null);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const value: AuthContextType = {
    currentUser,
    setCurrentUser,
    loading,
    checkAuth,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
