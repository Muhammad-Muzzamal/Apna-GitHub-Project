import {
  createContext,
  useContext,
  useEffect,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

type AuthProviderProps = {
  children: ReactNode;
};

type AuthContextType = {
  currentUser: string | null;
  setCurrentUser: Dispatch<SetStateAction<string | null>>;
  currentUserID: string | null;
  setCurrentUserID: Dispatch<SetStateAction<string | null>>;
  userName: string | null;
  setUserName: Dispatch<SetStateAction<string | null>>;
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
  const [currentUser, setCurrentUser] = useState<string | null>(() => {
    return localStorage.getItem("token");
  });
  const [currentUserID, setCurrentUserID] = useState<string | null>(() => {
    return localStorage.getItem("userID");
  });

  const [userName, setUserName] = useState<string | null>("");

  const value: AuthContextType = {
    currentUser,
    setCurrentUser,
    currentUserID,
    setCurrentUserID,
    userName,
    setUserName,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
