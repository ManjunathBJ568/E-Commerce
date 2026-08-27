import axiosInstance from "./axiosInstance";

export const getAddresses = async () => {
    const response = await axiosInstance.get("/addresses");
    return response.data.addresses;
};

export const addAddress = async (addressData) => {
    const response = await axiosInstance.post("/addresses", addressData);
    return response.data;
};