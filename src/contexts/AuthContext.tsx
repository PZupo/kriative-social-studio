import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  getAuth, 
  onAuthStateChanged, 
  User,
  signInWithCustomToken,
  signOut as firebaseSignOut,
  setPersistence,
  browserLocalPersistence
} from "firebase/auth";
import { getFirestore, doc, onSnapshot } from "firebase/firestore";
import { app } from "../lib/firebase"; 

interface UserData {
  tier?: string;
  activeApps?: string[];
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  signInWithToken: (token: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  
  const auth = getAuth(app);
  const db = getFirestore(app);

  // Essencial para o satélite manter a conexão que o HUB iniciou
  useEffect(() => {
    setPersistence(auth, browserLocalPersistence);
  }, [auth]);

  const signInWithToken = async (token: string) => {
    try {
      setLoading(true);
      await signInWithCustomToken(auth, token);
    } catch (error) {
      console.error("Erro no SSO do Satélite:", error);
      throw error;
    }
  };

  const logout = async () => {
    await firebaseSignOut(auth);
    setUserData(null);
    window.location.href = "https://afiliattuz.mydigitaldropp.com"; // Volta pro HUB
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // O Satélite apenas ESCUTA o Firestore que o HUB gerencia
        const userRef = doc(db, "users", currentUser.uid);
        const unsubData = onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
            setUserData(docSnap.data() as UserData);
          }
          setLoading(false);
        });
        return () => unsubData();
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [auth, db]);

  return (
    <AuthContext.Provider value={{ user, userData, loading, signInWithToken, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};