import { useState ,useContext,createContext, useEffect} from "react";
import AuthService from "../services/AuthService";
import TokenService from "../services/TokenService";

const AuthContext = createContext(null);

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(getUser);
//logout ไปแล้ว login มาใหม่ state เปลี่ยน ที่ user
    const login = (user) => setUser(user)

    const logout = () => {
        AuthService.logout();
        setUser(null);
    }

    useEffect(()=>{
        //update token user
        TokenService.setUser(user)
    },[user])

    function getUser() {
        const currentUser = TokenService.getUser();
        return currentUser;
    }

    return(
        <AuthContext.Provider value={{user,login,logout}}>
            {children} 
        </AuthContext.Provider>
    )
}
// eslint-disable-next-line react-refresh/only-export-components
export const useAuthContext = () => useContext(AuthContext)
