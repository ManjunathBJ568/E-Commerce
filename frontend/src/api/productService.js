import axiosInstance from "./axiosInstance";

export const getAllProducts = async () => {
    const response = await axiosInstance.get("/products");
    return response.data.products;
};

export const getProductById = async (id) => {
    const response = await axiosInstance.get(`/products/${id}`);
    return response.data.product;
};

export const getProductReviews = async (productId) => {
    const response = await axiosInstance.get(`/products/${productId}/reviews`);
    return response.data.reviews;
};