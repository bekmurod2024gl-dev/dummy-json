import client from "./client";

export const getTodos = async () => {
  const res = await client.get("/todos");
  return res.data;
};
