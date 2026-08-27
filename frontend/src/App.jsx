import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import Orders from "./pages/Orders";
import AdminRoute from "./components/AdminRoute";
import AdminLayout from "./components/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminReturns from "./pages/admin/AdminReturns";
import Home from "./pages/Home";

function App() {
    return (
        <AuthProvider>
            <CartProvider>
                <BrowserRouter>
                    <Navbar />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/products" element={<Products />} />
                        <Route path="/products/:id" element={<ProductDetail />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/wishlist" element={<Wishlist />} />
                        <Route path="/checkout" element={<Checkout />} />
                        <Route path="/order-confirmation/:id" element={<OrderConfirmation />} />
                        <Route path="/orders" element={<Orders />} />

                        <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
                            <Route index element={<Dashboard />} />
                           
                          <Route path="products" element={<AdminProducts />} />
                          <Route path="categories" element={<AdminCategories />} />
                          <Route path="orders" element={<AdminOrders />} />
                          
                          
                          <Route path="returns" element={<AdminReturns />} />
                        
                      </Route>
                        
                    </Routes>
                    <Footer />
                </BrowserRouter>
            </CartProvider>
        </AuthProvider>
    );
}

export default App;