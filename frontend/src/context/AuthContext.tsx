import {
  createContext,
  useContext,
  useState,
  useEffect,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import api from "../config/api.config";

type UserProfile = {
  _id: string;
  username: string;
  email: string;
  repositories: string[];
  followedUsers: string[];
  starRepos: string[];
};

type AuthContextType = {
  currentUser: string | null;
  setCurrentUser: Dispatch<SetStateAction<string | null>>;
  currentUserID: string | null;
  setCurrentUserID: Dispatch<SetStateAction<string | null>>;
  userProfile: UserProfile | null;
  avatarDataUrl: string | null;
  setAvatarDataUrl: Dispatch<SetStateAction<string | null>>;
  refreshProfile: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<string | null>(() =>
    localStorage.getItem("token")
  );
  const [currentUserID, setCurrentUserID] = useState<string | null>(() =>
    localStorage.getItem("userID")
  );
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [avatarDataUrl, setAvatarDataUrl] = useState<string | null>(() =>
    localStorage.getItem("avatarDataUrl")
  );

  const fetchProfile = async () => {
    if (!currentUserID) return;
    try {
      const res = await api.get(`/userProfile/${currentUserID}`);
      setUserProfile(res.data?.data?.user ?? null);
    } catch {
      // silently fail if backend is offline
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [currentUserID]);

  // Persist avatar to localStorage whenever it changes
  useEffect(() => {
    if (avatarDataUrl) {
      localStorage.setItem("avatarDataUrl", avatarDataUrl);
    } else {
      localStorage.removeItem("avatarDataUrl");
    }
  }, [avatarDataUrl]);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        currentUserID,
        setCurrentUserID,
        userProfile,
        avatarDataUrl,
        setAvatarDataUrl,
        refreshProfile: fetchProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
