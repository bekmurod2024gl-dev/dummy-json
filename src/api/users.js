import client from "./client";

// GET - barcha userlarni olish
export const getUsers = async () => {
  const res = await client.get("/users");
  return res.data;
};

// SEARCH - user qidirish
export const searchUsers = async (query) => {
  const res = await client.get("/users/search", {
    params: {
      q: query,
    },
  });

  return res.data;
};

// RANDOM - tasodifiy user olish
export const getRandomUser = async () => {
  const randomId =
    Math.floor(Math.random() * 208) + 1;

  const res = await client.get(`/users/${randomId}`);

  return res.data;
};

// POST - yangi user yaratish
export const createUser = async (user) => {
  const res = await client.post(
    "/users/add",
    user
  );

  return res.data;
};

// PUT - userni yangilash
export const updateUser = async (id, user) => {
  const res = await client.put(
    `/users/${id}`,
    user
  );

  return res.data;
};

// DELETE - userni o'chirish
export const deleteUser = async (id) => {
  const res = await client.delete(
    `/users/${id}`
  );

  return res.data;
};