import Cookies from "js-cookie";

const TOKEN_KEY = "user";

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
    // 🧠 รองรับทั้ง accessToken และ token เผื่อ backend ส่งชื่อไม่ตรง
    const tokenData = {
      ...user,
      token: user.accessToken || user.token, 
    };

    // ❗ ปิด secure ตอน dev, เปิดเฉพาะโปรดักชัน
    const isProd = window.location.protocol === "https:";

    Cookies.set(TOKEN_KEY, JSON.stringify(tokenData), {
      expires: 7,
      secure: isProd,
      sameSite: "Strict",
      path: "/",
    });
  }
};

const getLocalAccessToken = () => {
  const user = getUser();
  // ✅ รองรับทั้งชื่อ token และ accessToken
  return user?.token || user?.accessToken || null;
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
