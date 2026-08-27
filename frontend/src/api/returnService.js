import axiosInstance from "./axiosInstance";

export const getAllReturnsAdmin = async () => {
    const response = await axiosInstance.get("/returns/all");
    return response.data.returns;
};

export const updateReturnStatusAdmin = async (returnId, status) => {
    const response = await axiosInstance.put(`/returns/${returnId}/status`, { status });
    return response.data;
};