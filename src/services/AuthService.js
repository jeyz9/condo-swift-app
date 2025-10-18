import api from "./api";
import TokenService from "./TokenService";

const API_URL = import.meta.env.VITE_AUTH_API;

const register = async (usernameOrPayload, name, email, password) => {
  const payload =
    typeof usernameOrPayload === "object" && usernameOrPayload !== null
      ? usernameOrPayload
      : { username: usernameOrPayload, name, email, password };
  return await api.post(API_URL + "/register", payload);
};



const login = async (email, password) => {
    console.log("🧾 Payload before login:", { email, password });
    console.log("🧾 Payload before login:", { email, password });
  const response = await api.post(`${API_URL}/login`, { email, password }, { withCredentials: false });
  console.log("🟢 Login response:", response.data);


  // ✅ ตรวจว่า backend ส่ง accessToken กลับมาจริงไหม
  const { accessToken, tokenType, userId } = response.data;

  if (!accessToken) {
    throw new Error("ไม่พบ accessToken จาก backend");
  }

  // ✅ เก็บ token ใน cookie ผ่าน TokenService
  TokenService.setUser({
    accessToken,
    tokenType,
    userId,
  });

  return response;
};

const logout = () => {
  TokenService.removeUser();
};

const AuthService = { register, login, logout };
export default AuthService;
