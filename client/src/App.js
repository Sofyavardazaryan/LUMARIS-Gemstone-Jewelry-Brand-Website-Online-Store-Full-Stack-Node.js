import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import CartDrawer from './components/cart/CartDrawer';
import PrivateRoute from './components/auth/PrivateRoute';
import AdminRoute from './components/auth/AdminRoute';
import LoadingPage from './components/ui/LoadingPage';

// Lazy load pages for better performance
const HomePage        = lazy(() => import('./pages/HomePage'));
const ShopPage        = lazy(() => import('./pages/ShopPage'));
const ProductPage     = lazy(() => import('./pages/ProductPage'));
const CollectionsPage = lazy(() => import('./pages/CollectionsPage'));
const CollectionPage  = lazy(() => import('./pages/CollectionPage'));
const GemstonesPage   = lazy(() => import('./pages/GemstonesPage'));
const GemstonePage    = lazy(() => import('./pages/GemstonePage'));
const BlogPage        = lazy(() => import('./pages/BlogPage'));
const BlogPostPage    = lazy(() => import('./pages/BlogPostPage'));
const AboutPage       = lazy(() => import('./pages/AboutPage'));
const ContactPage     = lazy(() => import('./pages/ContactPage'));
const CheckoutPage    = lazy(() => import('./pages/CheckoutPage'));
const OrderSuccessPage = lazy(() => import('./pages/OrderSuccessPage'));
const LoginPage       = lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage    = lazy(() => import('./pages/auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('./pages/auth/ForgotPasswordPage'));
const ResetPasswordPage  = lazy(() => import('./pages/auth/ResetPasswordPage'));
const AccountPage     = lazy(() => import('./pages/account/AccountPage'));
const WishlistPage    = lazy(() => import('./pages/account/WishlistPage'));
const OrdersPage      = lazy(() => import('./pages/account/OrdersPage'));
const OrderDetailPage = lazy(() => import('./pages/account/OrderDetailPage'));
const AdminDashboard  = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminProducts   = lazy(() => import('./pages/admin/AdminProducts'));
const AdminOrders     = lazy(() => import('./pages/admin/AdminOrders'));
const AdminCustomers  = lazy(() => import('./pages/admin/AdminCustomers'));
const AdminCollections = lazy(() => import('./pages/admin/AdminCollections'));
const AdminGemstones  = lazy(() => import('./pages/admin/AdminGemstones'));
const AdminBlog       = lazy(() => import('./pages/admin/AdminBlog'));
const NotFoundPage    = lazy(() => import('./pages/NotFoundPage'));

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div className="app">
            <Navbar />
            <CartDrawer />

            <main>
              <Suspense fallback={<LoadingPage />}>
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/shop" element={<ShopPage />} />
                  <Route path="/shop/:slug" element={<ProductPage />} />
                  <Route path="/collections" element={<CollectionsPage />} />
                  <Route path="/collections/:slug" element={<CollectionPage />} />
                  <Route path="/gemstones" element={<GemstonesPage />} />
                  <Route path="/gemstones/:slug" element={<GemstonePage />} />
                  <Route path="/blog" element={<BlogPage />} />
                  <Route path="/blog/:slug" element={<BlogPostPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/order-success/:id" element={<OrderSuccessPage />} />

                  {/* Auth routes */}
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                  <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

                  {/* Protected user routes */}
                  <Route path="/account" element={<PrivateRoute><AccountPage /></PrivateRoute>} />
                  <Route path="/account/wishlist" element={<PrivateRoute><WishlistPage /></PrivateRoute>} />
                  <Route path="/account/orders" element={<PrivateRoute><OrdersPage /></PrivateRoute>} />
                  <Route path="/account/orders/:id" element={<PrivateRoute><OrderDetailPage /></PrivateRoute>} />

                  {/* Admin routes */}
                  <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                  <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
                  <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
                  <Route path="/admin/customers" element={<AdminRoute><AdminCustomers /></AdminRoute>} />
                  <Route path="/admin/collections" element={<AdminRoute><AdminCollections /></AdminRoute>} />
                  <Route path="/admin/gemstones" element={<AdminRoute><AdminGemstones /></AdminRoute>} />
                  <Route path="/admin/blog" element={<AdminRoute><AdminBlog /></AdminRoute>} />

                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </Suspense>
            </main>

            <Footer />
          </div>

          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                fontFamily: "'Jost', sans-serif",
                fontSize: '13px',
                letterSpacing: '0.5px',
                borderRadius: '0',
                background: '#2c2c2c',
                color: '#faf9f7'
              },
              success: {
                iconTheme: { primary: '#b8966a', secondary: '#faf9f7' }
              }
            }}
          />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
