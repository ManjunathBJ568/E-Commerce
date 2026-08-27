const {
    getAddressesByUser,
    getAddressById,
    createAddress,
    updateAddress,
    deleteAddress,
    clearDefaultForUser,
    setAsDefault
} = require("../models/addressModel");

// GET /api/addresses
const listAddresses = async (req, res) => {
    try {
        const userId = req.user.userId;
        const addresses = await getAddressesByUser(userId);
        res.status(200).json({ addresses });
    } catch (error) {
        console.error("List addresses error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// GET /api/addresses/:id
const getAddress = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { id } = req.params;

        const address = await getAddressById(id);

        if (!address) {
            return res.status(404).json({ message: "Address not found" });
        }

        // Ownership check
        if (address.user_id !== userId) {
            return res.status(403).json({ message: "You do not have access to this address" });
        }

        res.status(200).json({ address });
    } catch (error) {
        console.error("Get address error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// POST /api/addresses
const addAddress = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { full_name, phone, address_line1, city, state, postal_code } = req.body;

        if (!full_name || !phone || !address_line1 || !city || !state || !postal_code) {
            return res.status(400).json({
                message: "full_name, phone, address_line1, city, state and postal_code are required"
            });
        }

        const result = await createAddress(userId, req.body);

        // If this is marked default, clear other defaults first
        if (req.body.is_default) {
            await clearDefaultForUser(userId);
            await setAsDefault(result.insertId);
        }

        res.status(201).json({
            message: "Address added successfully",
            addressId: result.insertId
        });
    } catch (error) {
        console.error("Add address error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// PUT /api/addresses/:id
const editAddress = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { id } = req.params;

        const existingAddress = await getAddressById(id);

        if (!existingAddress) {
            return res.status(404).json({ message: "Address not found" });
        }

        if (existingAddress.user_id !== userId) {
            return res.status(403).json({ message: "You do not have access to this address" });
        }

        await updateAddress(id, req.body);

        res.status(200).json({ message: "Address updated successfully" });
    } catch (error) {
        console.error("Update address error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// DELETE /api/addresses/:id
const removeAddress = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { id } = req.params;

        const existingAddress = await getAddressById(id);

        if (!existingAddress) {
            return res.status(404).json({ message: "Address not found" });
        }

        if (existingAddress.user_id !== userId) {
            return res.status(403).json({ message: "You do not have access to this address" });
        }

        await deleteAddress(id);

        res.status(200).json({ message: "Address deleted successfully" });
    } catch (error) {
        console.error("Delete address error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// PUT /api/addresses/:id/default
const makeDefault = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { id } = req.params;

        const existingAddress = await getAddressById(id);

        if (!existingAddress) {
            return res.status(404).json({ message: "Address not found" });
        }

        if (existingAddress.user_id !== userId) {
            return res.status(403).json({ message: "You do not have access to this address" });
        }

        await clearDefaultForUser(userId);
        await setAsDefault(id);

        res.status(200).json({ message: "Default address updated" });
    } catch (error) {
        console.error("Set default address error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    listAddresses,
    getAddress,
    addAddress,
    editAddress,
    removeAddress,
    makeDefault
};