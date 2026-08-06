import {
  createContext,
  useContext,
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

  // useEffect(() => {
  //   const userId = localStorage.getItem("token");
  //   console.log(userId);

  //   if (userId) {
  //     setCurrentUser(userId);
  //   }
  // }, []);

  const value: AuthContextType = {
    currentUser,
    setCurrentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
