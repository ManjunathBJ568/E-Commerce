import { useState } from "react";
import { addAddress } from "../api/addressService";

const AddressForm = ({ onAddressAdded }) => {
    const [formData, setFormData] = useState({
        full_name: "",
        phone: "",
        address_line1: "",
        address_line2: "",
        city: "",
        state: "",
        postal_code: "",
        address_type: "home"
    });
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            await addAddress(formData);
            onAddressAdded();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to add address");
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ border: "1px solid #ddd", padding: "1rem", marginTop: "1rem" }}>
            <h4>Add New Address</h4>
            {error && <p style={{ color: "red" }}>{error}</p>}

            <input name="full_name" placeholder="Full Name" value={formData.full_name} onChange={handleChange} required style={{ display: "block", width: "100%", padding: "0.5rem", marginBottom: "0.5rem" }} />
            <input name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} required style={{ display: "block", width: "100%", padding: "0.5rem", marginBottom: "0.5rem" }} />
            <input name="address_line1" placeholder="Address Line 1" value={formData.address_line1} onChange={handleChange} required style={{ display: "block", width: "100%", padding: "0.5rem", marginBottom: "0.5rem" }} />
            <input name="address_line2" placeholder="Address Line 2 (optional)" value={formData.address_line2} onChange={handleChange} style={{ display: "block", width: "100%", padding: "0.5rem", marginBottom: "0.5rem" }} />
            <input name="city" placeholder="City" value={formData.city} onChange={handleChange} required style={{ display: "block", width: "100%", padding: "0.5rem", marginBottom: "0.5rem" }} />
            <input name="state" placeholder="State" value={formData.state} onChange={handleChange} required style={{ display: "block", width: "100%", padding: "0.5rem", marginBottom: "0.5rem" }} />
            <input name="postal_code" placeholder="Postal Code" value={formData.postal_code} onChange={handleChange} required style={{ display: "block", width: "100%", padding: "0.5rem", marginBottom: "0.5rem" }} />

            <button type="submit" style={{ padding: "0.5rem 1rem" }}>Save Address</button>
        </form>
    );
};

export default AddressForm;