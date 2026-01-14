import { useState, useContext, createContext, useEffect } from "react";
import AuthService from "../services/AuthService";
import TokenService from "../services/TokenService";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getUserFromToken);

  //  ฟังก์ชัน login ใช้เวลามาจาก popup หรือหน้า Login
  const login = async (email, password) => {
    try {
      // AuthService.login handles saving the token via TokenService
      const response = await AuthService.login(email, password); 
      
      const loggedInUser = getUserFromToken();
      setUser(loggedInUser);

      return loggedInUser;
    } catch (error) {
      console.error("Login error:", error);
      // Ensure user state is cleared on failed login
      setUser(null); 
      throw error;
    }
  };

  //  ออกจากระบบ
  const logout = () => {
    AuthService.logout(); // This calls TokenService.removeUser()
    setUser(null);
  };

  //  โหลด user ตอนเปิดหน้าเว็บ (กรณีเคย login แล้ว)
  useEffect(() => {
    const currentUser = getUserFromToken();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  //  ฟังก์ชันดึง user จาก token ที่เก็บใน cookie ผ่าน TokenService
  function getUserFromToken() {
    const token = TokenService.getLocalAccessToken();
    if (!token) {
      return null;
    }

    try {
      const decoded = jwtDecode(token);

      // 💡 Check if the token is expired
      const isExpired = Date.now() >= decoded.exp * 1000;
      if (isExpired) {
        console.warn("Authentication token has expired.");
        TokenService.removeUser(); // Clean up expired token
        return null;
      }

      // Return a user object compatible with the rest of the app
      return { ...decoded, token };
    } catch (error) {
      console.error("Invalid token:", error);
      // If token is invalid, remove it
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

