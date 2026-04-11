import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const ProviderContext = createContext(null);

export function ProviderProvider({ children }) {
  const [profile, setProfile] = useState(null);
  const [providerType, setProviderType] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadProviderProfile = useCallback(async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      setProfile(null);
      setProviderType('');
      setError('');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError('');

      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/providers/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = Array.isArray(res.data) ? res.data[0] : res.data;

      setProfile(data || null);
      setProviderType(data?.providerType || '');

    } catch (err) {

      setError(err.response?.data?.message || 'Failed to load provider profile');
      setProfile(null);
      setProviderType('');

    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProviderProfile();
  }, [loadProviderProfile]);

  return (
    <ProviderContext.Provider
      value={{
        profile,
        providerType,
        loading,
        error,
        setProfile,
        setProviderType,
        loadProviderProfile,
      }}
    >
      {children}
    </ProviderContext.Provider>
  );
}

export const useProvider = () => useContext(ProviderContext);