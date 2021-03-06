import axios from "axios";
import { urlServer } from "config";
import { createContext, useContext, useState } from "react";

const authContext = createContext();

export const ProvideAuth = ({ children }) => {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
};

export const useAuth = () => {
  return useContext(authContext);
};

export const useProvideAuth = () => {
  /// Recupera 'useInfo' desde localStorage
  const storage = localStorage.getItem('userInfo');
  const [user, setUser] = useState(storage !== null);
  /**
   * Servicio para iniciar sesión
   * @param {{username:string, password:string}} credentials 
   * @returns 
   */
  const signIn = async (credentials) => {
    const { username, password } = credentials;
    const endpoint = urlServer + `login/${username}/${password}`;
    try {
      const response = await axios.get(endpoint);
      if (response.status === 200 && response.data[0] !== undefined) {
        localStorage.setItem("userInfo", JSON.stringify(response.data[0]));
        setUser(true);
        return true;
      }
    } catch {
    }
    return false;
  };
  /**
   * Servicio para cerrar sesión
   */
  const signOut = async () => {
    try {
      await axios.delete(urlServer + 'login');
      localStorage.removeItem('userInfo');
      setUser(false);
    } catch {
      localStorage.removeItem('userInfo');
      setUser(false);
    }
  };
  return {
    user,
    signIn,
    signOut
  }
}