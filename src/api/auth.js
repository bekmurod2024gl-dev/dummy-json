import client from "./client";

export const login = async (payload) => {
  const res = await client.post("/auth/login", payload);
  return res.data;
};

export const register = async (payload) => {
  const res = await client.post("/auth/register", payload);
  return res.data;
};
