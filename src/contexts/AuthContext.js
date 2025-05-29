import { createContext, useContext, useState, useEffect } from 'react';
import { 
  GoogleAuthProvider,
  GithubAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  signOut
} from 'firebase/auth';
import { auth } from '../firebase';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const { email, displayName, photoURL, providerData } = firebaseUser;
          const provider = providerData[0].providerId.split('.')[0];
          
          const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/social-login`, {
            email,
            name: displayName,
            picture: photoURL,
            provider,
            providerId: providerData[0].uid
          });

          const { token, user } = response.data;
          setToken(token);
          setUser(user);
          localStorage.setItem('token', token);
        } catch (error) {
          console.error('Error during authentication:', error);
        }
      } else {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const socialSignIn = async (provider) => {
    console.log('Attempting social sign-in with provider:', provider);
    const authProvider = {
      google: new GoogleAuthProvider(),
      github: new GithubAuthProvider(),
      facebook: new FacebookAuthProvider()
    }[provider];

    try {
      console.log('Using auth provider:', authProvider);
      const result = await signInWithPopup(auth, authProvider);
      console.log('Sign-in successful:', result);
    } catch (error) {
      console.error('Detailed sign-in error:', {
        code: error.code,
        message: error.message,
        email: error.email,
        credential: error.credential
      });
      console.error('Social sign-in error:', error);
      throw error;
    }
  };

  const logout = () => {
    return signOut(auth);
  };

  const value = {
    user,
    token,
    loading,
    socialSignIn,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
