import {Navigate} from "react-router"
import { useAuthContext } from "../context/AuthContext"

const RequireRole = ({children}) => {
    const {user} = useAuthContext();
    const roles = user?.roles
    console.log("user roles in RequireRole:", roles);
   if (!user) {
        return <Navigate to='/signin' />;
    }

    if (roles?.includes('ROLE_ADMIN')) {
        return children;
    }
    return <Navigate to="/forbidden"/>
}

export default RequireRole