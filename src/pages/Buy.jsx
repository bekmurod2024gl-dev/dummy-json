function Buy({ cart, increaseQuantity, decreaseQuantity }) {
  return (
    <div>
      <div className="page-header">
        <h2 className="section-title">Buy</h2>
      </div>

      {cart.length ? (
        <div className="grid grid-3">
          {cart.map((item) => (
            <div key={item.id} className="card list-item">
              <img
                src={item.thumbnail || item.images?.[0]}
                alt={item.title}
                className="product-image"
              />

              <h3>{item.title}</h3>

              <div>Price: ${item.price}</div>

              <div>Qty: {item.quantity}</div>

              <div className="actions">
                <button
                  className="buy-btn"
                  onClick={() => increaseQuantity(item.id)}
                >
                  +
                </button>

                <button
                  className="buy-btn"
                  onClick={() => decreaseQuantity(item.id)}
                >
                  -
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="panel-empty">
          Your cart is empty
        </div>
      )}
    </div>
  );
}

export default Buy;