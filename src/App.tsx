
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CartProvider } from './context/CartContext';
import Index from './pages/Index';
import Payment from './pages/Payment';
import ProductDetails from './pages/ProductDetails';
import NotFound from './pages/NotFound';
import ScrollToTop from './components/layout/ScrollToTop';
import './App.css';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <Router>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
        <Toaster position="top-right" richColors />
      </CartProvider>
    </QueryClientProvider>
  );
}

export default App;
