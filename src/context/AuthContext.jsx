import { useState, useContext, createContext, useEffect } from "react";
import AuthService from "../services/AuthService";
import TokenService from "../services/TokenService";
import * as jwtDecodeModule from "jwt-decode";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getUserFromToken);

  const login = async (email, password) => {
    try {
      const response = await AuthService.login(email, password); 
      
      const loggedInUser = getUserFromToken();
      setUser(loggedInUser);

      return loggedInUser;
    } catch (error) {
      console.error("Login error:", error);
      setUser(null); 
      throw error;
    }
  };

  const logout = () => {
    AuthService.logout();
    setUser(null);
  };

  useEffect(() => {
    const currentUser = getUserFromToken();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  function getUserFromToken() {
    const token = TokenService.getLocalAccessToken();
    if (!token) {
      return null;
    }

    try {
      const decodeFn = jwtDecodeModule.default ?? jwtDecodeModule.jwtDecode ?? jwtDecodeModule;
      const decoded = decodeFn(token);

      const isExpired = Date.now() >= decoded.exp * 1000;
      if (isExpired) {
        console.warn("Authentication token has expired.");
        TokenService.removeUser();
        return null;
      }

      return { ...decoded, token };
    } catch (error) {
      console.error("Invalid token:", error);
      TokenService.removeUser();
      return null;
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);

