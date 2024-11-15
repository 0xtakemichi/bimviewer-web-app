// auth.ts
import { firebaseAuth, firestoreDb } from '../firebase/index';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail, 
  UserCredential 
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore'


// Definimos una interfaz para el usuario
interface User {
  uid: string;
  email: string | null;
  name?: string;
  lastName?: string;
  company?: string;
}

// Modificamos `auth` para retornar `Promise<UserCredential>` sin problemas de tipo
export function auth(email: string, pw: string, additionalData: {name: string, lastName: string, company: string}): Promise<UserCredential> {
  return createUserWithEmailAndPassword(firebaseAuth, email, pw)
    .then((userCredential) => {
      // Guardamos el usuario en la base de datos y luego devolvemos el `userCredential`
      const user = userCredential.user;
      return saveUser({
        uid: user.uid,
        email: user.email,
        ...additionalData
      }).then(() => userCredential);
    });
}

export function logout(): Promise<void> {
  return signOut(firebaseAuth);
}

export function login(email: string, pw: string): Promise<UserCredential> {
  return signInWithEmailAndPassword(firebaseAuth, email, pw);
}

export function resetPassword(email: string): Promise<void> {
  return sendPasswordResetEmail(firebaseAuth, email);
}

export function saveUser(user: User): Promise<User> {
  // Guardar en Firestore bajo la colección `Users` con el UID como ID del documento
  //const userRef = child(ref, `users/${user.uid}/info`);
  const userRef = doc(firestoreDb, 'Users', user.uid);

  return setDoc(userRef, {
    email: user.email,
    name: user.name,
    lastName: user.lastName,
    company: user.company
  }).then(() => user);
}
