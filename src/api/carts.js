import client from "./client";

export const getCarts = async () => {
  const res = await client.get("/carts");
  return res.data;
};

export const addCart = async (payload) => {
  // payload example: { userId: 1, products: [{ id: 1, quantity: 1 }] }
  const res = await client.post("/carts/add", payload);
  return res.data;
};

export const updateCart = async (id, payload) => {
  // payload example: { merge: true, products: [{ id: 1, quantity: 2 }] }
  const res = await client.put(`/carts/${id}`, payload);
  return res.data;
};

export const deleteCart = async (id) => {
  const res = await client.delete(`/carts/${id}`);
  return res.data;
};