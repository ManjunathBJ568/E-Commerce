import axiosInstance from "./axiosInstance";

export const validateCoupon = async (code, orderAmount) => {
    const response = await axiosInstance.post("/coupons/validate", { code, orderAmount });
    return response.data;
};