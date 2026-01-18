import {Navigate} from "react-router"
import { useAuthContext } from "../context/AuthContext"

const RequireRole = ({children, allowedRoles = ['ROLE_ADMIN']}) => {
    const {user} = useAuthContext();
    
    // Handle roles being a string, an array of strings, or an array of objects.
    let userRoles = [];
    if (user?.roles) {
        if (Array.isArray(user.roles)) {
            if (user.roles.length > 0 && typeof user.roles[0] === 'object' && user.roles[0] !== null) {
                // Handle array of objects, e.g., [{roleName: 'ROLE_ADMIN'}]
                if (user.roles[0].roleName) {
                    userRoles = user.roles.map(r => r.roleName);
                } else if (user.roles[0].authority) { // A common alternative property name
                    userRoles = user.roles.map(r => r.authority);
                } else {
                    // Fallback for unexpected object structure
                    userRoles = user.roles.map(String);
                }
            } else {
                 userRoles = user.roles; // It's an array of strings
            }
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