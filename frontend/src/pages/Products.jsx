import { useEffect, useState } from "react";
import { getAllProducts } from "../api/productService";
import ProductCard from "../components/ProductCard";

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedCategory, setSelectedCategory] = useState("All");
    const [sortOption, setSortOption] = useState("default");

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await getAllProducts();
                setProducts(data);
            } catch (err) {
                console.error("Failed to load products", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Get categories
    const categories = [
        "All",
        ...new Set(
            products
                .map((product) => product.category_name)
                .filter(Boolean)
        ),
    ];

    // Category filter
    let filteredProducts =
        selectedCategory === "All"
            ? [...products]
            : products.filter(
                  (product) =>
                      product.category_name === selectedCategory
              );

    // Price sorting
    if (sortOption === "low-high") {
        filteredProducts.sort(
            (a, b) => Number(a.price) - Number(b.price)
        );
    }

    if (sortOption === "high-low") {
        filteredProducts.sort(
            (a, b) => Number(b.price) - Number(a.price)
        );
    }

    if (loading) {
        return (
            <div className="products-page">
                <div className="products-container">
                    <p>Loading products...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="products-page">

            <div className="products-container">

                {/* HEADER */}
                <div className="products-header">

                    <div>
                        <span className="products-eyebrow">
                            OUR COLLECTION
                        </span>

                        <h1>All Products</h1>

                        <p>
                            Discover products you'll love.
                        </p>
                    </div>

                    <span className="products-count">
                        {filteredProducts.length} Products
                    </span>

                </div>


                {/* FILTERS */}
                <div className="products-filter">

                    {/* CATEGORY */}
                    <div className="filter-group">

                        <label htmlFor="category">
                            Category
                        </label>

                        <select
                            id="category"
                            value={selectedCategory}
                            onChange={(e) =>
                                setSelectedCategory(e.target.value)
                            }
                        >
                            {categories.map((category) => (
                                <option
                                    key={category}
                                    value={category}
                                >
                                    {category}
                                </option>
                            ))}
                        </select>

                    </div>


                    {/* SORT */}
                    <div className="filter-group">

                        <label htmlFor="sort">
                            Sort By
                        </label>

                        <select
                            id="sort"
                            value={sortOption}
                            onChange={(e) =>
                                setSortOption(e.target.value)
                            }
                        >
                            <option value="default">
                                Default
                            </option>

                            <option value="low-high">
                                Price: Low to High
                            </option>

                            <option value="high-low">
                                Price: High to Low
                            </option>
                        </select>

                    </div>

                </div>


                {/* PRODUCTS */}
                {filteredProducts.length === 0 ? (

                    <div className="products-empty">

                        <h2>No products found</h2>

                        <p>
                            There are currently no products in this
                            category.
                        </p>

                    </div>

                ) : (

                    <div className="grid grid-products">

                        {filteredProducts.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                            />
                        ))}

                    </div>

                )}

            </div>

        </div>
    );
};

export default Products;