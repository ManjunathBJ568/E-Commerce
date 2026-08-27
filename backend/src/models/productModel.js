const pool = require("../config/db");

// Get all products, with category name joined in
const getAllProducts = async () => {
    const [rows] = await pool.query(
        `SELECT p.*, c.name AS category_name,
                (SELECT pi.image_url FROM product_images pi 
                 WHERE pi.product_id = p.id AND pi.is_primary = 1 LIMIT 1) AS primary_image
         FROM products p
         JOIN categories c ON p.category_id = c.id
         WHERE p.status = 'active'
         ORDER BY p.created_at DESC`
    );
    return rows;
};

// Get one product by ID, with category name joined in
const getProductById = async (id) => {
    const [rows] = await pool.query(
        `SELECT p.*, c.name AS category_name
         FROM products p
         JOIN categories c ON p.category_id = c.id
         WHERE p.id = ?`,
        [id]
    );
    return rows[0];
};

// Get all images for a product
const getProductImages = async (productId) => {
    const [rows] = await pool.query(
        `SELECT * FROM product_images WHERE product_id = ?`,
        [productId]
    );
    return rows;
};
// Create a new product
const createProduct = async (data) => {
    const { category_id, name, description, sku, price, discount, stock, brand, status } = data;

    const [result] = await pool.query(
        `INSERT INTO products (category_id, name, description, sku, price, discount, stock, brand, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [category_id, name, description, sku, price, discount || 0, stock || 0, brand, status || 'active']
    );

    return result;
};

// Update an existing product
const updateProduct = async (id, data) => {
    const { category_id, name, description, sku, price, discount, stock, brand, status } = data;

    const [result] = await pool.query(
        `UPDATE products
         SET category_id = ?, name = ?, description = ?, sku = ?, price = ?, discount = ?, stock = ?, brand = ?, status = ?
         WHERE id = ?`,
        [category_id, name, description, sku, price, discount, stock, brand, status, id]
    );

    return result;
};

// Delete a product
const deleteProduct = async (id) => {
    const [result] = await pool.query(
        `DELETE FROM products WHERE id = ?`,
        [id]
    );

    return result;
};
const addProductImage = async (productId, imageUrl, isPrimary) => {
    const [result] = await pool.query(
        `INSERT INTO product_images (product_id, image_url, is_primary) VALUES (?, ?, ?)`,
        [productId, imageUrl, isPrimary ? 1 : 0]
    );
    return result;
};

const deleteProductImage = async (imageId) => {
    const [result] = await pool.query(
        `DELETE FROM product_images WHERE id = ?`,
        [imageId]
    );
    return result;
};
module.exports = {
    getAllProducts,
    getProductById,
    getProductImages,
    createProduct,
    updateProduct,
    deleteProduct,
    addProductImage,
    deleteProductImage
};