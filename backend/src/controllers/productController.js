const {
    getAllProducts,
    getProductById,
    getProductImages,
    createProduct,
    updateProduct,
    deleteProduct,
    addProductImage,
    deleteProductImage
} = require("../models/productModel");

// GET /api/products
const listProducts = async (req, res) => {
    try {
        const products = await getAllProducts();
        res.status(200).json({ products });
    } catch (error) {
        console.error("Get products error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// GET /api/products/:id
const getProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await getProductById(id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const images = await getProductImages(id);

        res.status(200).json({
            product: {
                ...product,
                images
            }
        });
    } catch (error) {
        console.error("Get product error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
// POST /api/products (admin only)
const addProduct = async (req, res) => {
    try {
        const { category_id, name, sku, price } = req.body;

        // Basic validation
        if (!category_id || !name || !sku || !price) {
            return res.status(400).json({
                message: "category_id, name, sku and price are required"
            });
        }

        const result = await createProduct(req.body);

        res.status(201).json({
            message: "Product created successfully",
            productId: result.insertId
        });
    } catch (error) {
        console.error("Create product error:", error);

        // Handle duplicate SKU error specifically
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({ message: "SKU already exists" });
        }

        res.status(500).json({ message: "Server error" });
    }
};

// PUT /api/products/:id (admin only)
const editProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const existingProduct = await getProductById(id);
        if (!existingProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        await updateProduct(id, req.body);

        res.status(200).json({ message: "Product updated successfully" });
    } catch (error) {
        console.error("Update product error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// DELETE /api/products/:id (admin only)
const removeProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const existingProduct = await getProductById(id);
        if (!existingProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        await deleteProduct(id);

        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error("Delete product error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
// POST /api/products/:id/images (admin only)
const uploadProductImage = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await getProductById(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        if (!req.file) {
            return res.status(400).json({ message: "No image file uploaded" });
        }

        const imageUrl = `/uploads/products/${req.file.filename}`;
        const isPrimary = req.body.isPrimary === "true";

        const result = await addProductImage(id, imageUrl, isPrimary);

        res.status(201).json({
            message: "Image uploaded successfully",
            imageId: result.insertId,
            imageUrl
        });
    } catch (error) {
        console.error("Upload image error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// DELETE /api/products/images/:imageId (admin only)
const removeProductImage = async (req, res) => {
    try {
        const { imageId } = req.params;
        await deleteProductImage(imageId);
        res.status(200).json({ message: "Image deleted successfully" });
    } catch (error) {
        console.error("Delete image error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
module.exports = {
    listProducts,
    getProduct,
    addProduct,
    editProduct,
    removeProduct,
    uploadProductImage,
    removeProductImage
};