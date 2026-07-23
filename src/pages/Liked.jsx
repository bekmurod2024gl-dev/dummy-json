function Liked({ products, liked, toggleLike, addToCart }) {
  const likedProducts = products.filter((product) => liked.has(product.id));

  return (
    <div>
      <div className="page-header">
        <h2 className="section-title">Liked</h2>
      </div>
      <div className="grid grid-3">
        {likedProducts.length ? (
          likedProducts.map((product) => (
            <div key={product.id} className="card list-item">
              <img
                src={product.thumbnail || product.images?.[0]}
                alt={product.title}
                className="product-image"
              />
              <h3>{product.title}</h3>
              <div className="actions">
                <button className="buy-btn" onClick={() => addToCart(product)}>
                  Buy
                </button>
                <button className="like-btn liked" onClick={() => toggleLike(product.id)}>
                  Remove
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="panel-empty">No liked products yet</div>
        )}
      </div>
    </div>
  );
}

export default Liked;
