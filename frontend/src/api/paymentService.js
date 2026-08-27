import axiosInstance from "./axiosInstance";

export const createRazorpayOrder = async (orderId) => {
    const response = await axiosInstance.post("/payments/razorpay/create-order", { orderId });
    return response.data;
};

export const verifyRazorpayPayment = async (paymentData) => {
    const response = await axiosInstance.post("/payments/razorpay/verify", paymentData);
    return response.data;
};

export const payWithCod = async (orderId) => {
    const response = await axiosInstance.post("/payments/cod", { orderId });
    return response.data;
};