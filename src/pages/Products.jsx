import { useEffect, useState } from "react";

import {
  getProducts,
  searchProducts,
  getCategories,
  getProductsByCategory,
} from "../api/products";

function Products({
  products,
  setProducts,
  addToCart,
  liked,
  toggleLike,
}) {
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [sort, setSort] = useState("default");

  // Buy bosilganda chiqadigan xabar
  const [buyMessage, setBuyMessage] = useState("");

  const loadCategories = async () => {
    const list = await getCategories();
    setCategories(list || []);
  };

  const loadProducts = async () => {
    setLoading(true);

    const data = await getProducts();

    setProducts(data.products || []);

    setLoading(false);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleSearch = async () => {
    if (!query) {
      return loadProducts();
    }

    setLoading(true);

    const data = await searchProducts(query);

    setProducts(data.products || []);

    setLoading(false);
  };

  const handleCategory = async (value) => {
    setCategory(value);

    if (!value) {
      return loadProducts();
    }

    setLoading(true);

    const data = await getProductsByCategory(value);

    setProducts(data.products || []);

    setLoading(false);
  };

  const sortProducts = (sortType) => {
    let sorted = [...products];

    switch (sortType) {
      case "price-asc":
        sorted.sort((a, b) => a.price - b.price);
        break;

      case "price-desc":
        sorted.sort((a, b) => b.price - a.price);
        break;

      case "name-asc":
        sorted.sort((a, b) =>
          a.title.localeCompare(b.title)
        );
        break;

      case "name-desc":
        sorted.sort((a, b) =>
          b.title.localeCompare(a.title)
        );
        break;

      case "rating-high":
        sorted.sort(
          (a, b) =>
            (b.rating || 0) -
            (a.rating || 0)
        );
        break;

      case "rating-low":
        sorted.sort(
          (a, b) =>
            (a.rating || 0) -
            (b.rating || 0)
        );
        break;

      case "discount-high":
        sorted.sort(
          (a, b) =>
            (b.discountPercentage || 0) -
            (a.discountPercentage || 0)
        );
        break;

      default:
        break;
    }

    setProducts(sorted);
    setSort(sortType);
  };

  // Buy tugmasi bosilganda ishlaydi
  const handleBuy = (product) => {
    // Mahsulot cartga qo'shiladi
    addToCart(product);

    // Xabar chiqadi
    setBuyMessage(
      `"${product.title}" savatga qo'shildi 🛒`
    );

    // 3 sekunddan keyin xabar yo'qoladi
    setTimeout(() => {
      setBuyMessage("");
    }, 3000);
  };

  return (
    <div>

      {/* Buy bosilganda chiqadigan xabar */}
      {buyMessage && (
        <div className="buy-message">
          {buyMessage}
        </div>
      )}

      <div className="page-header">
        <h2 className="section-title">
          Products
        </h2>
      </div>

      <div className="card controls">

        {/* Search */}
        <input
          value={query}
          onChange={(e) =>
            setQuery(e.target.value)
          }
          placeholder="Search products..."
        />

        <button onClick={handleSearch}>
          Search
        </button>

        {/* Category */}
        <select
          value={category}
          onChange={(e) =>
            handleCategory(e.target.value)
          }
        >
          <option value="">
            All categories
          </option>

          {categories.map((cat, idx) => {
            const isString =
              typeof cat === "string";

            const value = isString
              ? cat
              : cat?.slug ||
                cat?.name ||
                JSON.stringify(cat);

            const label = isString
              ? cat
              : cat?.name ||
                cat?.slug ||
                JSON.stringify(cat);

            return (
              <option
                key={value || idx}
                value={value}
              >
                {label}
              </option>
            );
          })}
        </select>

        {/* Sort */}
        <select
          value={sort}
          onChange={(e) =>
            sortProducts(e.target.value)
          }
        >
          <option value="default">
            Tartibi
          </option>

          <option value="price-asc">
            Narx: Kam → Ko'p
          </option>

          <option value="price-desc">
            Narx: Ko'p → Kam
          </option>

          <option value="name-asc">
            Nomi: A → Z
          </option>

          <option value="name-desc">
            Nomi: Z → A
          </option>

          <option value="rating-high">
            Rating: Yuqori
          </option>

          <option value="rating-low">
            Rating: Past
          </option>

          <option value="discount-high">
            Chegirma: Ko'p
          </option>
        </select>

      </div>

      {/* Loading */}
      {loading && (
        <div className="loading">
          Loading products...
        </div>
      )}

      <div className="products-layout">

        <div className="grid grid-3">

          {products.map((product) => (

            <div
              key={product.id}
              className="card list-item"
            >

              {/* Product image */}
              <img
                src={
                  product.thumbnail ||
                  product.images?.[0]
                }
                alt={product.title}
                className="product-image"
              />

              {/* Product title */}
              <h3>
                {product.title}
              </h3>

              {/* Product details */}
              <div className="product-details">

                <div>
                  ${product.price}
                </div>

                {product.rating && (
                  <div>
                    ⭐ {product.rating}
                  </div>
                )}

                {product.discountPercentage && (
                  <div className="discount">
                    -{product.discountPercentage}%
                  </div>
                )}

              </div>

              {/* Buttons */}
              <div className="actions">

                {/* Like button */}
                <button
                  className={`like-btn ${
                    liked?.has(product.id)
                      ? "liked"
                      : ""
                  }`}
                  onClick={() =>
                    toggleLike(product.id)
                  }
                >
                  {liked?.has(product.id)
                    ? "♥ Liked"
                    : "♡ Like"}
                </button>

                {/* Buy button */}
                <button
                  className="buy-btn"
                  onClick={() =>
                    handleBuy(product)
                  }
                >
                  Buy
                </button>

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}

export default Products;