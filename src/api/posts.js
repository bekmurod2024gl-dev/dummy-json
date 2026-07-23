import client from "./client";

// GET - barcha postlar
export const getPosts = async () => {
  const res = await client.get("/posts");
  return res.data;
};

// GET - bitta post
export const getPost = async (id) => {
  const res = await client.get(`/posts/${id}`);
  return res.data;
};

// POST - yangi post
export const createPost = async (post) => {
  const res = await client.post("/posts/add", post);
  return res.data;
};

// PUT - postni yangilash
export const updatePost = async (id, post) => {
  const res = await client.put(`/posts/${id}`, post);
  return res.data;
};

// DELETE - postni o'chirish
export const deletePost = async (id) => {
  const res = await client.delete(`/posts/${id}`);
  return res.data;
};

// SEARCH - post qidirish
export const searchPosts = async (query) => {
  const res = await client.get(`/posts/search?q=${query}`);
  return res.data;
};