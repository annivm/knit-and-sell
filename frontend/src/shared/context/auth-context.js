import { createContext, useContext } from "react";

export const AuthContext = createContext({
    isLoggedIn: false,
    token: null,
    userId: null,
    login: () => {},
    logout: () => {}
})

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if(!context) {
        throw new Error('useAuthContext must be used iwth AuthContextProvider');
    }
    return context;
}