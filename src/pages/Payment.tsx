
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CheckoutModal from '@/components/checkout/CheckoutModal';
import PaymentScreen from '@/components/checkout/PaymentScreen';
import { useCart } from '@/context/CartContext';

const Payment = () => {
  const [showModal, setShowModal] = useState(false);
  const [customerName, setCustomerName] = useState<string | null>(null);
  const { items, totalItems } = useCart();
  const navigate = useNavigate();

  // Check if cart has items when component mounts
  useEffect(() => {
    if (totalItems === 0) {
      navigate('/');
    } else {
      setShowModal(true);
    }
  }, [totalItems, navigate]);

  const handleConfirmOrder = (name: string) => {
    setCustomerName(name);
    setShowModal(false);
  };

  if (totalItems === 0) {
    return null; // Will redirect to home
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CheckoutModal
        isOpen={showModal}
        onClose={() => navigate('/')}
        onConfirm={handleConfirmOrder}
      />
      
      {customerName && (
        <PaymentScreen customerName={customerName} />
      )}
    </div>
  );
};

export default Payment;
