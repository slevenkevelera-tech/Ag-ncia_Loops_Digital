import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });
googleProvider.addScope('email');
googleProvider.addScope('profile');

export function getGoogleAuthErrorMessage(error: unknown): string {
  const code = typeof error === 'object' && error && 'code' in error
    ? String((error as { code?: string }).code)
    : '';

  if (code === 'auth/unauthorized-domain') {
    return 'Este dominio nao esta autorizado no Firebase. Em Authentication > Settings > Authorized domains, adicione o dominio do seu site (ex.: loops-digital.onrender.com).';
  }
  if (code === 'auth/popup-blocked') {
    return 'O navegador bloqueou o popup do Google. Permita popups para este site e tente novamente.';
  }
  if (code === 'auth/popup-closed-by-user') {
    return 'Login cancelado. Abra novamente o botao Google Sign-In para autenticar.';
  }
  if (code === 'auth/operation-not-allowed') {
    return 'O provedor Google nao esta habilitado. No Firebase Console, ative Authentication > Sign-in method > Google.';
  }
  if (code === 'auth/cancelled-popup-request') {
    return 'Uma tentativa de login anterior ainda estava aberta. Tente de novo.';
  }
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return 'Nao foi possivel concluir o login com Google.';
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path,
  };
  console.error('Firestore Error:', JSON.stringify(errInfo));
  return errInfo;
}

// Test connection on boot
export async function testFirestoreConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firestore offline or initial connect check.');
    }
  }
}
