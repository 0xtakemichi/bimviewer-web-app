// AuthContex.tsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { firebaseAuth, firestoreDb } from '../firebase/index';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

// Define la interfaz para los datos extendidos del usuario
interface User {
  uid: string;
  email: string | null;
  name?: string;
  lastName?: string;
  company?: string;
}

// Define la interfaz del contexto
interface AuthContextType {
  firebaseUser: FirebaseUser | null; // Usuario autenticado de Firebase
  userData: User | null;             // Datos extendidos del usuario
  loading: boolean;
}

// Crear el contexto con valores iniciales
const AuthContext = createContext<AuthContextType>({
  firebaseUser: null,
  userData: null,
  loading: true,
});

// Hook para acceder al contexto
export const useAuth = () => useContext(AuthContext);

// Proveedor del contexto
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
      setFirebaseUser(user);
      setLoading(true);

      if (user) {
        // Cargar los datos extendidos del usuario desde Firestore
        const userDocRef = doc(firestoreDb, 'Users', user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          setUserData(userDoc.data() as User);
        } else {
          console.error('No se encontraron datos del usuario en Firestore.');
          setUserData(null);
        }
      } else {
        setUserData(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ firebaseUser, userData, loading }}>
      {children}
    </AuthContext.Provider>
  );
};