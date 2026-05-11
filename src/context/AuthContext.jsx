import React, { Children, createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null)

    const decodeJWT = (token) => {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
                window.atob(base64).split('').map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
            );
            return JSON.parse(jsonPayload);
        } catch (error) {
            console.error("Error al decodificar el token:", error);
            return null;
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedUser = decodeJWT(token);
            if (decodedUser) {
                setIsAuthenticated(true);
                setUser(decodedUser); // Esto guardará { sub: "email...", rol: "ADMIN", id: 1, exp: ... }
            } else {
                logout(); // Si el token es inválido o está corrupto, limpiamos todo
            }
        }
    }, [])

    const login = (token) => {
        localStorage.setItem('token', token);
        const decodedUser = decodeJWT(token);

        if (decodedUser) {
            setIsAuthenticated(true);
            setUser(decodedUser);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
