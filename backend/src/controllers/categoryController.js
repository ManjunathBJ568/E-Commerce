const {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
} = require("../models/categoryModel");

// GET /api/categories
const listCategories = async (req, res) => {
    try {
        const categories = await getAllCategories();
        res.status(200).json({ categories });
    } catch (error) {
        console.error("Get categories error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// GET /api/categories/:id
const getCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const category = await getCategoryById(id);

        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        res.status(200).json({ category });
    } catch (error) {
        console.error("Get category error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// POST /api/categories (admin only)
const addCategory = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ message: "Category name is required" });
        }

        const result = await createCategory(req.body);

        res.status(201).json({
            message: "Category created successfully",
            categoryId: result.insertId
        });
    } catch (error) {
        console.error("Create category error:", error);

        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({ message: "Category name already exists" });
        }

        res.status(500).json({ message: "Server error" });
    }
};

// PUT /api/categories/:id (admin only)
const editCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const existingCategory = await getCategoryById(id);
        if (!existingCategory) {
            return res.status(404).json({ message: "Category not found" });
        }

        await updateCategory(id, req.body);

        res.status(200).json({ message: "Category updated successfully" });
    } catch (error) {
        console.error("Update category error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// DELETE /api/categories/:id (admin only)
const removeCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const existingCategory = await getCategoryById(id);
        if (!existingCategory) {
            return res.status(404).json({ message: "Category not found" });
        }

        await deleteCategory(id);

        res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
        console.error("Delete category error:", error);

        // If products reference this category, deleting will fail due to foreign key
        if (error.code === "ER_ROW_IS_REFERENCED_2") {
            return res.status(409).json({
                message: "Cannot delete category — products are still assigned to it"
            });
        }

        res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    listCategories,
    getCategory,
    addCategory,
    editCategory,
    removeCategory
};