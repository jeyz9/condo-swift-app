// src/utils/roleUtils.js
export const parseUserRoles = (user) => {
    if (!user?.roles) {
        return [];
    }

    if (Array.isArray(user.roles)) {
        if (user.roles.length > 0 && typeof user.roles[0] === 'object' && user.roles[0] !== null) {
            if (user.roles[0].roleName) {
                return user.roles.map(r => r.roleName);
            }
            if (user.roles[0].authority) {
                return user.roles.map(r => r.authority);
            }
            return user.roles.map(String);
        }
        return user.roles; // Array of strings
    }

    if (typeof user.roles === 'string') {
        return user.roles.split(/, ?/);
    }

    return [];
};
