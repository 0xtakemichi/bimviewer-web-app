// auth.ts
import { ref, firebaseAuth } from '../firebase/index';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail, 
  UserCredential 
} from 'firebase/auth';
import { set, child } from 'firebase/database';

// Definimos una interfaz para el usuario
interface User {
  uid: string;
  email: string | null;
}

// Modificamos `auth` para retornar `Promise<UserCredential>` sin problemas de tipo
export function auth(email: string, pw: string): Promise<UserCredential> {
  return createUserWithEmailAndPassword(firebaseAuth, email, pw)
    .then((userCredential) => {
      // Guardamos el usuario en la base de datos y luego devolvemos el `userCredential`
      return saveUser(userCredential.user).then(() => userCredential);
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
  // Creamos una referencia usando `child` y `ref`
  const userRef = child(ref, `users/${user.uid}/info`);
  return set(userRef, {
    email: user.email,
    uid: user.uid,
  }).then(() => user);
}
