import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import toast from 'react-hot-toast';

import apiClient, { setAuthHeader } from '../services/api';
import '../config/firebase';

const AuthContext = createContext(null);

const TOKEN_KEY = 'watchout:token';
const GOV_TOKEN_KEY = 'watchout:govToken';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [govToken, setGovToken] = useState(() => localStorage.getItem(GOV_TOKEN_KEY));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function hydrate() {
      if (govToken) {
        apiClient.defaults.headers.common.Authorization = `Bearer ${govToken}`;
      }
      if (!token) {
        setAuthHeader(null);
        setLoading(false);
        return;
      }
      try {
        setAuthHeader(token);
        const { data } = await apiClient.get('/auth/verify-token');
        setUser(data.user);
      } catch (error) {
        console.error(error);
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
        setUser(null);
        setAuthHeader(null);
      } finally {
        setLoading(false);
      }
    }
    hydrate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, govToken]);

  const login = async ({ email, password }) => {
    const { data } = await apiClient.post('/auth/login', { email, password });
    persistToken(data.token);
    setUser(data.user);
    toast.success('Logged in successfully');
    return data.user;
  };

  const signup = async (payload) => {
    try {
      const { data } = await apiClient.post('/auth/signup', payload);
      toast.success(data.message);
      return data;
    } catch (error) {
      console.error('Signup error:', error);
      const errorMessage = error.response?.data?.message
        || error.response?.data?.error
        || error.message
        || 'Signup failed';
      const errorHint = error.response?.data?.hint || '';
      throw new Error(errorHint ? `${errorMessage}. ${errorHint}` : errorMessage);
    }
  };

  const handleGoogleLogin = async ({ role, company }) => {
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();
      const { data } = await apiClient.post('/auth/google-login', {
        idToken,
        role,
        company
      });
      persistToken(data.token);
      setUser(data.user);
      toast.success('Logged in with Google');
      return data.user;
    } catch (error) {
      console.error('Google login error:', error);
      const errorMessage = error.response?.data?.message
        || error.response?.data?.error
        || error.message
        || 'Google login failed';
      const errorHint = error.response?.data?.hint || '';
      const fullError = errorHint ? `${errorMessage}. ${errorHint}` : errorMessage;
      toast.error(fullError);
      throw new Error(fullError);
    }
  };

  const governmentLogin = async (credentials) => {
    const { data } = await apiClient.post('/auth/government-login', credentials);
    persistGovernmentToken(data.token);
    toast.success('Government access granted');
    return data;
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
    setAuthHeader(null);
  };

  const logoutGovernment = () => {
    localStorage.removeItem(GOV_TOKEN_KEY);
    setGovToken(null);
    delete apiClient.defaults.headers.common.Authorization;
  };

  const persistToken = (value) => {
    setToken(value);
    setAuthHeader(value);
    localStorage.setItem(TOKEN_KEY, value);
  };

  const persistGovernmentToken = (value) => {
    setGovToken(value);
    localStorage.setItem(GOV_TOKEN_KEY, value);
    if (value) {
      apiClient.defaults.headers.common.Authorization = `Bearer ${value}`;
    } else {
      delete apiClient.defaults.headers.common.Authorization;
    }
  };

  const value = useMemo(() => ({
    user,
    token,
    govToken,
    loading,
    login,
    signup,
    googleLogin: handleGoogleLogin,
    governmentLogin,
    logout,
    logoutGovernment,
    setUser
  }), [user, token, govToken, loading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

