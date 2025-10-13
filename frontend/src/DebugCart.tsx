import React from 'react';
import { useCart } from './components/CartContext';

const DebugCart = () => {
  const { cart, addToCart, removeFromCart, getCartCount } = useCart();

  const testItem = {
    id: 999,
    name: "Test Product",
    price: 500,
    image: "https://via.placeholder.com/150",
    quantity: 1
  };

  const handleTestAdd = () => {
    addToCart(testItem);
  };

  const handleTestRemove = () => {
    removeFromCart(999);
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '20px' }}>
      <h2>Cart Debug Component</h2>
      <p>Cart Items: {cart.length}</p>
      <p>Cart Count: {getCartCount()}</p>
      <button onClick={handleTestAdd}>Add Test Item</button>
      <button onClick={handleTestRemove} style={{ marginLeft: '10px' }}>Remove Test Item</button>
      <div>
        <h3>Cart Contents:</h3>
        <pre>{JSON.stringify(cart, null, 2)}</pre>
      </div>
    </div>
  );
};

export default DebugCart;