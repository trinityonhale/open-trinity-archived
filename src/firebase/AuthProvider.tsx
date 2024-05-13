import {
    createContext,
    useEffect,
    useState
} from 'react';

import { onAuthStateChanged, getAuth } from 'firebase/auth';
import { signInWithPopup, GoogleAuthProvider, signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from './firebase';
import { uploadUserInfo } from './dao';

const provider = new GoogleAuthProvider();

export function signIn() {
  return signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);

      // const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      // IdP data available using getAdditionalUserInfo(result)
      console.log(user);
      // ...
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
    });
}

export function signOut () {
    return firebaseSignOut(auth);
}

export type User = {
  uid: string;
  displayName: string;
  photoURL: string;
  isAdmin: boolean;
};

export const AuthContext = createContext<User | null>(null);

export const AuthProvider = ({ children }: { children: any }) => {

  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    onAuthStateChanged(getAuth(), async (user) => {

      if (user) {
        const idToken = await user?.getIdTokenResult();

        const currentUser: User = {
            uid: user.uid,
            displayName: user.displayName ?? "",
            photoURL: user.photoURL ?? "",
            isAdmin: idToken?.claims.admin == true ? true : false 
        }

        uploadUserInfo(currentUser)
        setUser(currentUser)
        console.log("Signed in as", user)
      } else {
        setUser(null)
        // signIn()
      }
    })
  }, []);

  return (
    <AuthContext.Provider value={user}>
      {children}
    </AuthContext.Provider>
  )
}