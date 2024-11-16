import { 
  firebaseAuth, 
  firestoreDb 
} from '../firebase/index';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail, 
  sendEmailVerification, 
  verifyBeforeUpdateEmail, 
  getAuth, 
  UserCredential,
  ActionCodeSettings 
} from 'firebase/auth';
import { doc, setDoc, updateDoc } from 'firebase/firestore';

// Definimos una interfaz para el usuario
interface User {
  uid: string;
  email: string | null;
  name?: string;
  lastName?: string;
  company?: string;
  jobTitle?: string;
  country?: string;
}

// Función para registrar un nuevo usuario y enviar correo de verificación
export async function auth(
  email: string, 
  pw: string, 
  additionalData: { name: string; lastName: string; company: string; jobTitle: string; country: string }
): Promise<UserCredential> {
  try {
    const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, pw);
    const user = userCredential.user;

    // Guardamos el usuario en la base de datos
    await saveUser({
      uid: user.uid,
      email: user.email,
      ...additionalData,
    });

    // Envía el correo de verificación
    await sendEmailVerification(user);
    console.log('Correo de verificación enviado');

    return userCredential; // Retorna el UserCredential después de guardar y enviar el email
  } catch (error) {
    console.error('Error al crear el usuario:', error);
    throw error;
  }
}

// Función para actualizar la información del usuario en Firestore
export async function updateUserInfo(uid: string, data: { name: string; lastName: string; company: string; jobTitle: string; country: string }) {
  try {
    const userDocRef = doc(firestoreDb, 'Users', uid);
    await updateDoc(userDocRef, data);
  } catch (error) {
    console.error('Error al actualizar la información del usuario:', error);
    throw error;
  }
}

// Función para cerrar sesión
export async function logout(): Promise<void> {
  try {
    await signOut(firebaseAuth);
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    throw error;
  }
}

// Función para iniciar sesión
export async function login(email: string, pw: string): Promise<UserCredential> {
  try {
    return await signInWithEmailAndPassword(firebaseAuth, email, pw);
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    throw error;
  }
}

// Función para restablecer la contraseña
export async function resetPassword(email: string): Promise<void> {
  try {
    await sendPasswordResetEmail(firebaseAuth, email);
  } catch (error) {
    console.error('Error al enviar el correo de restablecimiento de contraseña:', error);
    throw error;
  }
}

// Función para enviar un correo de verificación al usuario actual
export async function sendEmailVerificationToUser(): Promise<void> {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    throw new Error("No hay un usuario autenticado actualmente.");
  }

  if (user.emailVerified) {
    throw new Error("El correo electrónico ya está verificado.");
  }

  try {
    await sendEmailVerification(user);
    console.log('Correo de verificación enviado.');
  } catch (error) {
    console.error('Error al enviar el correo de verificación:', error);
    throw error;
  }
}

// Función para actualizar el correo electrónico del usuario con verificación previa
export async function updateUserEmail(newEmail: string): Promise<void> {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    throw new Error("No hay un usuario autenticado actualmente.");
  }

  const actionCodeSettings: ActionCodeSettings = {
    url: 'https://bimviewer.vercel.app/login', // URL para redirigir tras verificación
    handleCodeInApp: true,
  };

  try {
    await verifyBeforeUpdateEmail(user, newEmail, actionCodeSettings);
    console.log('Correo de verificación enviado al nuevo correo electrónico.');
  } catch (error) {
    console.error('Error al enviar el correo de verificación al nuevo correo:', error);
    throw error;
  }
}

// Función para sincronizar el correo electrónico con Firestore tras la verificación
export async function syncFirestoreEmail(uid: string): Promise<void> {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    console.error('No hay un usuario autenticado para sincronizar.');
    return;
  }

  try {
    const userDocRef = doc(firestoreDb, 'Users', uid);
    await updateDoc(userDocRef, { email: user.email });
    console.log('Correo actualizado en Firestore:', user.email);
  } catch (error) {
    console.error('Error al sincronizar el correo electrónico en Firestore:', error);
    throw error;
  }
}

// Función para guardar el usuario en Firestore
export async function saveUser(user: User): Promise<void> {
  try {
    const userRef = doc(firestoreDb, 'Users', user.uid);
    await setDoc(userRef, {
      email: user.email,
      name: user.name,
      lastName: user.lastName,
      company: user.company,
      jobTitle: user.jobTitle,
      country: user.country,
    });
  } catch (error) {
    console.error('Error al guardar el usuario en Firestore:', error);
    throw error;
  }
}