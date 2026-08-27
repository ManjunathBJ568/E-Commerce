import axiosInstance from "./axiosInstance";

export const getCart = async () => {
    const response = await axiosInstance.get("/cart");
    return response.data;
};

export const addToCart = async (productId, quantity = 1) => {
    const response = await axiosInstance.post("/cart/add", { productId, quantity });
    return response.data;
};

export const updateCartItem = async (itemId, quantity) => {
    const response = await axiosInstance.put(`/cart/update/${itemId}`, { quantity });
    return response.data;
};

export const removeCartItem = async (itemId) => {
    const response = await axiosInstance.delete(`/cart/remove/${itemId}`);
    return response.data;
};