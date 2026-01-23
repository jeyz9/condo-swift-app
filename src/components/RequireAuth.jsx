import {Navigate} from "react-router-dom"
import { useAuthContext } from "../context/AuthContext"

const RequireAuth = ({children}) => {
    const {user} = useAuthContext();
    
   if (!user) {
        // Redirect them to the / page if they are not logged in.
        return <Navigate to='/' />;
    }

    return children;
}

export default RequireAuth;
