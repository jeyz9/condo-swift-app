import api from "./api"
import TokenService from "./TokenService";
const API_URL = import.meta.env.VITE_AUTH_API;


const register = async (usernameOrPayload, name, email, password) => {
    const payload =
        typeof usernameOrPayload === 'object' && usernameOrPayload !== null
            ? usernameOrPayload
            : { username: usernameOrPayload, name, email, password };
    return await api.post(API_URL+"/register", payload)
}

const login = async (email, password) => {
    const response = await api.post(API_URL+"/login",{email, password})
    //saving user data to local storage
    if(!response.data.token){
        return response
    }else{
        TokenService.setUser(response.data) 
        return response;
    }
}

const logout = () => {
    TokenService.removeUser();
}

const AuthService = {
    register,
    login,
    logout
}
export default AuthService
