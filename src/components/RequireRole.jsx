import {Navigate} from "react-router-dom"
import { useAuthContext } from "../context/AuthContext"
import { parseUserRoles } from "../utils/roleUtils"

const RequireRole = ({children, allowedRoles = ['ROLE_ADMIN']}) => {
    const {user} = useAuthContext();

    if (!user) {
        return <Navigate to='/' />;
    }

    let userRoles = parseUserRoles(user);

    if (userRoles.length === 0 && user?.authorities) {
        if (Array.isArray(user.authorities)) {
            userRoles = user.authorities.map((authority) => {
                if (typeof authority === 'string') return authority;
                if (authority?.authority) return authority.authority;
                if (authority?.roleName) return authority.roleName;
                return String(authority);
            });
        } else if (typeof user.authorities === 'string') {
            userRoles = user.authorities.split(/, ?/);
        }
    }

    if (userRoles.length === 0 && user?.role) {
        userRoles = Array.isArray(user.role)
            ? user.role.map(String)
            : [String(user.role)];
    }

    const hasRequiredRole = userRoles.some(role => allowedRoles.includes(role));

    if (hasRequiredRole) {
        return children;
    }
    
    return <Navigate to="/forbidden"/>
}

export default RequireRole