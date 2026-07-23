import client from "./client";

// GET
export const getUsers = async () => {
  const response = await client.get("/users");
  return response.data;
};

// SEARCH
export const searchUsers = async (query) => {
  const response = await client.get(
    `/users/search?q=${query}`
  );
  return response.data;
};

// RANDOM
export const getRandomUser = async () => {
  const randomId =
    Math.floor(Math.random() * 100) + 1;

  const response = await client.get(
    `/users/${randomId}`
  );

  return response.data;
};

// CREATE
export const createUser = async (userData) => {
  const response = await client.post(
    "/users/add",
    userData
  );

  return response.data;
};

// UPDATE
export const updateUser = async (
  id,
  userData
) => {
  const response = await client.put(
    `/users/${id}`,
    userData
  );

  return response.data;
};

// DELETE
export const deleteUser = async (id) => {
  const response = await client.delete(
    `/users/${id}`
  );

  return response.data;
};