import axiosInstance from "./axiosInstance";

export const placeOrder = async (addressId, couponCode) => {
    const response = await axiosInstance.post("/orders", { addressId, couponCode });
    return response.data;
};

export const getMyOrders = async () => {
    const response = await axiosInstance.get("/orders");
    return response.data.orders;
};

export const getOrderById = async (id) => {
    const response = await axiosInstance.get(`/orders/${id}`);
    return response.data.order;
};

export const cancelOrder = async (id) => {
    const response = await axiosInstance.put(`/orders/${id}/cancel`);
    return response.data;
};