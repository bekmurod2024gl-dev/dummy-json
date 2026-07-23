import client from "./client";

export const getRecipes = async () => {
  const res = await client.get("/recipes");
  return res.data;
};

export const searchRecipes = async (query) => {
  const res = await client.get("/recipes/search", { params: { q: query } });
  return res.data;
};
