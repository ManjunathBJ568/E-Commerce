import axiosInstance from "./axiosInstance";

export const getWishlist = async () => {
    const response = await axiosInstance.get("/wishlist");
    return response.data;
};

export const addToWishlist = async (productId) => {
    const response = await axiosInstance.post("/wishlist/add", { productId });
    return response.data;
};

export const removeFromWishlist = async (itemId) => {
    const response = await axiosInstance.delete(`/wishlist/remove/${itemId}`);
    return response.data;
};