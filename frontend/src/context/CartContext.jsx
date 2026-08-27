import { createContext, useState, useContext, useEffect } from "react";
import { getCart } from "../api/cartService";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState({ items: [], subtotal: 0 });
    const { user } = useAuth();

    const refreshCart = async () => {
        if (!user) {
            setCart({ items: [], subtotal: 0 });
            return;
        }
        try {
            const data = await getCart();
            setCart(data);
        } catch (err) {
            console.error("Failed to load cart", err);
        }
    };

    // Reload cart whenever the logged-in user changes (login/logout)
    useEffect(() => {
        refreshCart();
    }, [user]);

    return (
        <CartContext.Provider value={{ cart, refreshCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);