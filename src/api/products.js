import client from "./client";

export const getProducts = async () => {
  const res = await client.get("/products");
  return res.data;
};

export const getProductById = async (id) => {
  const res = await client.get(`/products/${id}`);
  return res.data;
};

export const searchProducts = async (query) => {
  const res = await client.get("/products/search", {
    params: { q: query },
  });

  return res.data;
};

export const getCategories = async () => {
  const res = await client.get("/products/categories");
  return res.data;
};

export const getProductsByCategory = async (category) => {
  const res = await client.get(
    `/products/category/${category}`
  );

  return res.data;
};