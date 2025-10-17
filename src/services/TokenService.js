import Cookies from "js-cookie";

const TOKEN_KEY = "user"; // ใช้ key เดิมเพื่อความเข้ากันได้

const getUser = () => {
  try {
    const raw = Cookies.get(TOKEN_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    Cookies.remove(TOKEN_KEY);
    return null;
  }
};

const setUser = (user) => {
  if (!user) {
    Cookies.remove(TOKEN_KEY, { path: "/" });
  } else {
    Cookies.set(TOKEN_KEY, JSON.stringify(user), {
      expires: 7, // 7 วัน
      secure: true, // ใช้เฉพาะ HTTPS
      sameSite: "Strict", // ป้องกัน cross-site request
      path: "/", // ใช้ได้ทุกหน้า
    });
  }
};

const getLocalAccessToken = () => {
  const user = getUser();
  return user?.token;
};

const removeUser = () => {
  Cookies.remove(TOKEN_KEY, { path: "/" });
};

const TokenService = {
  getLocalAccessToken,
  getUser,
  setUser,
  removeUser,
};

export default TokenService;
