import client from "./client";

// GET - barcha comments
export const getComments = async () => {
  const res = await client.get("/comments");

  return res.data;
};

// GET - bitta comment
export const getComment = async (id) => {
  const res = await client.get(`/comments/${id}`);

  return res.data;
};

// POST - yangi comment
export const createComment = async (comment) => {
  const res = await client.post(
    "/comments/add",
    {
      body: comment.body,

      postId: 1,

      userId: 5,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return res.data;
};

// PUT - commentni yangilash
export const updateComment = async (id, comment) => {
  const res = await client.put(
    `/comments/${id}`,
    {
      body: comment.body,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return res.data;
};

// DELETE - commentni o'chirish
export const deleteComment = async (id) => {
  const res = await client.delete(
    `/comments/${id}`
  );

  return res.data;
};

// SEARCH - frontend orqali qidirish
export const searchComments = async (query) => {
  const res = await client.get("/comments");

  const comments = res.data.comments || [];

  const searchText = query.toLowerCase();

  const filteredComments = comments.filter(
    (comment) => {
      const body =
        comment.body?.toLowerCase() || "";

      const email =
        comment.email?.toLowerCase() || "";

      const username =
        comment.user?.username?.toLowerCase() || "";

      const fullName =
        comment.user?.fullName?.toLowerCase() || "";

      return (
        body.includes(searchText) ||
        email.includes(searchText) ||
        username.includes(searchText) ||
        fullName.includes(searchText)
      );
    }
  );

  return {
    comments: filteredComments,
  };
};