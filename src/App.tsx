import { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { StoreProvider } from './context/StoreContext';
import { ThemeProvider } from './context/ThemeContext';
import { AdminLayout } from './layouts/AdminLayout';
import { StoreLayout } from './layouts/StoreLayout';
import { AboutPage } from './pages/AboutPage';
import { AccountPage } from './pages/AccountPage';
import { BrandsPage } from './pages/BrandsPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { ComparePage } from './pages/ComparePage';
import { ContactPage } from './pages/ContactPage';
import { FaqPage } from './pages/FaqPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { MyOrdersPage } from './pages/MyOrdersPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { PolicyPage } from './pages/PolicyPage';
import { ProductDetailsPage } from './pages/ProductDetailsPage';
import { RegisterPage } from './pages/RegisterPage';
import { SearchResultsPage } from './pages/SearchResultsPage';
import { ShopPage } from './pages/ShopPage';
import { WishlistPage } from './pages/WishlistPage';
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage';
import { AdminCustomersPage } from './pages/admin/AdminCustomersPage';
import { AdminInventoryPage } from './pages/admin/AdminInventoryPage';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';
import { AdminOverviewPage } from './pages/admin/AdminOverviewPage';
import { AdminProductsPage } from './pages/admin/AdminProductsPage';

function ScrollToTop() {
  const { pathname, search } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [pathname, search]);
  return null;
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <StoreProvider>
            <ScrollToTop />
            <Routes>
              {/* Storefront Routes */}
              <Route element={<StoreLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/shop" element={<ShopPage collectionPreset="all" />} />
                <Route path="/collections/men" element={<ShopPage collectionPreset="men" />} />
                <Route path="/collections/women" element={<ShopPage collectionPreset="women" />} />
                <Route
                  path="/collections/running"
                  element={<ShopPage collectionPreset="running" />}
                />
                <Route
                  path="/collections/sports"
                  element={<ShopPage collectionPreset="sports" />}
                />
                <Route
                  path="/collections/new-arrivals"
                  element={<ShopPage collectionPreset="new-arrivals" />}
                />
                <Route
                  path="/collections/best-sellers"
                  element={<ShopPage collectionPreset="best-sellers" />}
                />
                <Route
                  path="/collections/trending"
                  element={<ShopPage collectionPreset="trending" />}
                />
                <Route path="/collections/sale" element={<ShopPage collectionPreset="sale" />} />

                <Route path="/brands" element={<BrandsPage />} />
                <Route path="/brands/:brandSlug" element={<BrandsPage />} />
                <Route path="/compare" element={<ComparePage />} />

                <Route path="/product/:slug" element={<ProductDetailsPage />} />
                <Route path="/search" element={<SearchResultsPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route
                  path="/order-confirmation/:orderNumber"
                  element={<OrderConfirmationPage />}
                />
                <Route path="/wishlist" element={<WishlistPage />} />

                {/* Auth & Account */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/account" element={<AccountPage />} />
                <Route path="/account/orders" element={<MyOrdersPage />} />
                <Route path="/my-orders" element={<Navigate to="/account/orders" replace />} />

                {/* Information & Policies */}
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/faq" element={<FaqPage />} />
                <Route path="/privacy-policy" element={<PolicyPage type="privacy" />} />
                <Route path="/terms" element={<PolicyPage type="terms" />} />
                <Route path="/return-policy" element={<PolicyPage type="returns" />} />
                <Route path="/shipping-policy" element={<PolicyPage type="shipping" />} />
              </Route>

              {/* Protected Admin Dashboard Routes */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminOverviewPage />} />
                <Route path="products" element={<AdminProductsPage />} />
                <Route path="inventory" element={<AdminInventoryPage />} />
                <Route path="categories" element={<AdminCategoriesPage />} />
                <Route path="orders" element={<AdminOrdersPage />} />
                <Route path="customers" element={<AdminCustomersPage />} />
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </StoreProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}
