import {Navigate} from "react-router"
import { useAuthContext } from "../context/AuthContext"

const RequireRole = ({children, allowedRoles = ['ROLE_ADMIN']}) => {
    const {user} = useAuthContext();
    
    // Handle roles being a string (e.g., "ROLE_USER,ROLE_ADMIN") or an array.
    let userRoles = [];
    if (user?.roles) {
        if (Array.isArray(user.roles)) {
            userRoles = user.roles;
        } else if (typeof user.roles === 'string') {
            userRoles = user.roles.split(/, ?/); // Split by comma with optional space
        }
    }
    
   if (!user) {
        // Redirect them to the / page if they are not logged in.
        return <Navigate to='/' />;
    }

    const hasRequiredRole = userRoles.some(role => allowedRoles.includes(role));

    if (hasRequiredRole) {
        return children;
    }
    
    // Redirect to a 'forbidden' page if they don't have the required role
    return <Navigate to="/forbidden"/>
}

export default RequireRole