// AuthContext.tsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { firebaseAuth, firestoreDb } from '../firebase/index';
import { onAuthStateChanged, User as FirebaseUser, signOut } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { trackUserLogin } from '../helpers/analytics';

// Define la interfaz para los datos extendidos del usuario
interface User {
  uid: string;
  email: string | null;
  name?: string;
  lastName?: string;
  company?: string;
  jobTitle?: string;
  country?: string;
  role?: string;
  createdAt?: Date;
}

// Define la interfaz del contexto
interface AuthContextType {
  firebaseUser: FirebaseUser | null; // Usuario autenticado de Firebase
  userData: User | null;             // Datos extendidos del usuario
  loading: boolean;
  refreshUserData: () => Promise<void>;
}

// Crear el contexto con valores iniciales
const AuthContext = createContext<AuthContextType>({
  firebaseUser: null,
  userData: null,
  loading: true,
  refreshUserData: async () => {},
});

// Hook para acceder al contexto
export const useAuth = () => useContext(AuthContext);

// Proveedor del contexto
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async (uid: string) => {
    const userDocRef = doc(firestoreDb, 'Users', uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const userData = userDoc.data() as User;
      const currentEmail = firebaseAuth.currentUser?.email;
      setUserData({ ...userData, uid }); // Asegúrate de incluir el UID
      // Sincronizar el correo electrónico si es diferente
      if (userData.email !== currentEmail && currentEmail !== undefined) {
        await updateDoc(userDocRef, { email: currentEmail });
        userData.email = currentEmail; // Actualiza el valor local
      }
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
      setFirebaseUser(user);
      if (user) {
        await fetchUserData(user.uid);
        // Registrar inicio de sesión en Analytics
        trackUserLogin(user.uid);

        // Verificar si el correo no está verificado tras un cambio
        const userDocRef = doc(firestoreDb, 'Users', user.uid);
        try {
          await updateDoc(userDocRef, { lastLogin: new Date() }); // Actualiza lastLogin con la fecha actual
        } catch (error) {
          console.error('Error updating lastLogin:', error);
        }
        // Verificar si el correo no está verificado tras un cambio
        if (!user.emailVerified) {
          await signOut(firebaseAuth); // Cierra la sesión automáticamente
          alert('Please verify your email address to access your account.');
        }
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const refreshUserData = async () => {
    if (firebaseUser) {
      await fetchUserData(firebaseUser.uid);
    }
  };

  return (
    <AuthContext.Provider value={{ firebaseUser, userData, loading, refreshUserData }}>
      {children}
    </AuthContext.Provider>
  );
};