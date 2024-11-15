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
  verifyBeforeUpdateEmail, // Importamos el método correcto
  getAuth, 
  UserCredential,
  ActionCodeSettings // Importamos para configurar la acción
} from 'firebase/auth';
import { doc, setDoc, updateDoc } from 'firebase/firestore';

// Definimos una interfaz para el usuario
interface User {
  uid: string;
  email: string | null;
  name?: string;
  lastName?: string;
  company?: string;
}

// Función para registrar un nuevo usuario y enviar correo de verificación
export function auth(
  email: string, 
  pw: string, 
  additionalData: { name: string; lastName: string; company: string }
): Promise<UserCredential> {
  return createUserWithEmailAndPassword(firebaseAuth, email, pw)
    .then((userCredential) => {
      const user = userCredential.user;

      // Guardamos el usuario en la base de datos
      return saveUser({
        uid: user.uid,
        email: user.email,
        ...additionalData
      })
      .then(() => {
        // Envía el correo de verificación
        return sendEmailVerification(user)
          .then(() => {
            console.log('Correo de verificación enviado');
          })
          .catch((error) => {
            console.error('Error al enviar el correo de verificación:', error);
          });
      })
      .then(() => userCredential); // Retorna el UserCredential después de guardar y enviar el email
    })
    .catch((error) => {
      console.error('Error al crear el usuario:', error);
      throw error;
    });
}

// Función para actualizar la información del usuario en Firestore
export async function updateUserInfo(uid: string, data: { name: string; lastName: string; company: string }) {
  const userDocRef = doc(firestoreDb, 'Users', uid);
  return await updateDoc(userDocRef, data);
}

// Función para cerrar sesión
export function logout(): Promise<void> {
  return signOut(firebaseAuth);
}

// Función para iniciar sesión
export function login(email: string, pw: string): Promise<UserCredential> {
  return signInWithEmailAndPassword(firebaseAuth, email, pw);
}

// Función para restablecer la contraseña
export function resetPassword(email: string): Promise<void> {
  return sendPasswordResetEmail(firebaseAuth, email);
}

// Función para enviar un correo de verificación al usuario actual
export async function sendEmailVerificationToUser() {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    throw new Error("No hay un usuario autenticado actualmente.");
  }

  if (user.emailVerified) {
    throw new Error("El correo electrónico ya está verificado.");
  }

  return await sendEmailVerification(user);
}

// Función para actualizar el correo electrónico del usuario con verificación previa
export async function updateUserEmail(newEmail: string) {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    throw new Error("No hay un usuario autenticado actualmente.");
  }

  // Configuramos las opciones para la acción de verificación
  const actionCodeSettings: ActionCodeSettings = {
    url: 'https://bimviewer.vercel.app/', // URL a la que se redirigirá después de la verificación
    handleCodeInApp: true,
  };

  // Enviamos el correo de verificación al nuevo correo electrónico
  return await verifyBeforeUpdateEmail(user, newEmail, actionCodeSettings)
    .then(() => {
      console.log('Correo de verificación enviado al nuevo correo electrónico.');
      // Aquí puedes informar al usuario que revise su nuevo correo para completar el cambio
    })
    .catch((error) => {
      console.error('Error al enviar el correo de verificación al nuevo correo electrónico:', error);
      throw error;
    });
}

// Función para guardar el usuario en Firestore
export function saveUser(user: User): Promise<User> {
  const userRef = doc(firestoreDb, 'Users', user.uid);

  return setDoc(userRef, {
    email: user.email,
    name: user.name,
    lastName: user.lastName,
    company: user.company
  }).then(() => user);
}
