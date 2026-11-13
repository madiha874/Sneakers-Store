import { Outlet } from 'react-router-dom';
import { CompareBar } from '../components/common/CompareBar';
import { FloatingWhatsApp } from '../components/common/FloatingWhatsApp';
import { SupabaseNoticeBanner } from '../components/common/SupabaseNoticeBanner';
import { ToastStack } from '../components/common/ToastStack';
import { CartDrawer } from '../components/layout/CartDrawer';
import { Footer } from '../components/layout/Footer';
import { Navbar } from '../components/layout/Navbar';
import { QuickViewModal } from '../components/product/QuickViewModal';

export function StoreLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F5F3ED] dark:bg-[#101114] text-[#101114] dark:text-[#F5F3ED] transition-colors duration-200">
      <Navbar />
      <SupabaseNoticeBanner context="storefront" />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      <QuickViewModal />
      <CompareBar />
      <FloatingWhatsApp />
      <ToastStack />
    </div>
  );
}
