import React from "react";

function CartPanel({ cartItems, selectedProduct, onIncrease, onDecrease, onSelectProduct }) {
  return (
    <aside className="cart-panel">
      <div className="cart-panel-header">
        <h3>Cart Details</h3>
        <div>{cartItems.reduce((sum, item) => sum + item.quantity, 0)} pcs</div>
      </div>
      <div className="cart-items">
        {cartItems.length ? (
          cartItems.map((item) => (
            <button key={item.id} className="panel-item" onClick={() => onSelectProduct(item)}>
              <span>{item.title}</span>
              <span>{item.quantity}x</span>
            </button>
          ))
        ) : (
          <div className="panel-empty">Your cart is empty</div>
        )}
      </div>
      {selectedProduct ? (
        <div className="panel-section panel-detail">
          <h4>{selectedProduct.title}</h4>
          <div className="panel-detail-row">
            <strong>Price</strong>
            <span>${selectedProduct.price}</span>
          </div>
          <div className="panel-detail-row">
            <strong>Brand</strong>
            <span>{selectedProduct.brand}</span>
          </div>
          <div className="panel-detail-row">
            <strong>Qty</strong>
            <div className="qty-controls">
              <button onClick={() => onDecrease(selectedProduct.id)}>-</button>
              <span>{selectedProduct.quantity}</span>
              <button onClick={() => onIncrease(selectedProduct.id)}>+</button>
            </div>
          </div>
          <p>{selectedProduct.description}</p>
        </div>
      ) : (
        <div className="panel-empty">Select a cart item to edit</div>
      )}
    </aside>
  );
}

export default CartPanel;
