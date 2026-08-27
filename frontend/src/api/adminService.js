import axiosInstance from "./axiosInstance";

export const getDashboardStats = async () => {
    const response = await axiosInstance.get("/admin/dashboard");
    return response.data.stats;
};

export const getAllUsersAdmin = async () => {
    const response = await axiosInstance.get("/admin/users");
    return response.data.users;
};

export const getAllOrdersAdmin = async () => {
    const response = await axiosInstance.get("/admin/orders");
    return response.data.orders;
};
export const createProductAdmin = async (productData) => {
    const response = await axiosInstance.post("/products", productData);
    return response.data;
};

export const updateProductAdmin = async (id, productData) => {
    const response = await axiosInstance.put(`/products/${id}`, productData);
    return response.data;
};

export const deleteProductAdmin = async (id) => {
    const response = await axiosInstance.delete(`/products/${id}`);
    return response.data;
};
export const createCategoryAdmin = async (data) => {
    const response = await axiosInstance.post("/categories", data);
    return response.data;
};

export const updateCategoryAdmin = async (id, data) => {
    const response = await axiosInstance.put(`/categories/${id}`, data);
    return response.data;
};

export const deleteCategoryAdmin = async (id) => {
    const response = await axiosInstance.delete(`/categories/${id}`);
    return response.data;
};
export const updateOrderStatusAdmin = async (orderId, status) => {
    const response = await axiosInstance.put(`/orders/${orderId}/status`, { status });
    return response.data;
};
export const uploadProductImageAdmin = async (productId, file, isPrimary) => {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("isPrimary", isPrimary);

    const response = await axiosInstance.post(`/products/${productId}/images`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
    return response.data;
};

export const deleteProductImageAdmin = async (imageId) => {
    const response = await axiosInstance.delete(`/products/images/${imageId}`);
    return response.data;
};