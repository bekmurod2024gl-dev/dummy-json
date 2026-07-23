import { useEffect, useState } from "react";

import {
  getPosts,
  createPost,
  updatePost,
  deletePost,
  searchPosts,
} from "../api/posts";

function Posts() {
  const [posts, setPosts] = useState([]);

  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");

  const [title, setTitle] = useState("");

  const [body, setBody] = useState("");

  const [userId, setUserId] = useState(1);

  const [editingId, setEditingId] = useState(null);

  const [selectedEmoji, setSelectedEmoji] = useState("");

  const emojis = [
    "😀",
    "😂",
    "😍",
    "😎",
    "🔥",
    "❤️",
    "👍",
    "🎉",
    "🚀",
    "😢",
    "😡",
    "🤩",
  ];

  // =========================
  // GET POSTS
  // =========================

  const loadPosts = async () => {
    try {
      setLoading(true);

      const data = await getPosts();

      setPosts(data.posts || []);
    } catch (error) {
      console.log("Posts yuklashda xatolik:", error);
    } finally {
      setLoading(false);
    }
  };

  // Sahifa ochilganda postlarni olish
  useEffect(() => {
    loadPosts();
  }, []);

  // =========================
  // SEARCH POSTS
  // =========================

  const handleSearch = async (value) => {
    setSearch(value);

    // Search bo'sh bo'lsa barcha postlarni qayta yuklaymiz
    if (value.trim() === "") {
      loadPosts();
      return;
    }

    try {
      setLoading(true);

      const data = await searchPosts(value);

      setPosts(data.posts || []);
    } catch (error) {
      console.log("Search xatolik:", error);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // CREATE + UPDATE
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !body.trim()) {
      alert("Title va body to'ldirilishi kerak!");

      return;
    }

    const postData = {
      title: `${selectedEmoji} ${title}`,
      body: body,
      userId: Number(userId),
    };

    try {
      setLoading(true);

      // =========================
      // UPDATE - PUT
      // =========================

      if (editingId) {
        /*
          DummyJSON faqat 1-150 ID li
          haqiqiy postlarni serverda saqlaydi.

          Yangi postga esa Date.now()
          orqali katta ID beramiz.

          Shuning uchun:
          ID <= 150 => API PUT
          ID > 150  => lokal update
        */

        if (editingId <= 150) {
          const updatedPost = await updatePost(
            editingId,
            postData
          );

          setPosts((prevPosts) =>
            prevPosts.map((post) =>
              post.id === editingId
                ? {
                    ...post,
                    ...updatedPost,
                  }
                : post
            )
          );
        } else {
          // Yangi qo'shilgan postni lokal update qilish

          setPosts((prevPosts) =>
            prevPosts.map((post) =>
              post.id === editingId
                ? {
                    ...post,
                    ...postData,
                  }
                : post
            )
          );
        }

        setEditingId(null);
      }

      // =========================
      // CREATE - POST
      // =========================

      else {
        const newPost = await createPost(postData);

        const localPost = {
          ...newPost,

          /*
            DummyJSON yangi postga
            serverda doimiy ID bermaydi.

            Shuning uchun lokal ID yaratamiz.
          */

          id: Date.now(),
        };

        setPosts((prevPosts) => [
          localPost,
          ...prevPosts,
        ]);
      }

      // Formani tozalash

      setTitle("");

      setBody("");

      setUserId(1);

      setSelectedEmoji("");
    } catch (error) {
      console.log(
        "Post yuborishda xatolik:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // EDIT
  // =========================

  const handleEdit = (post) => {
    setEditingId(post.id);

    /*
      Agar title ichida emoji bo'lsa,
      uni alohida ko'rsatamiz.
    */

    const firstCharacter = post.title.charAt(0);

    if (emojis.includes(firstCharacter)) {
      setSelectedEmoji(firstCharacter);

      setTitle(
        post.title.substring(1).trim()
      );
    } else {
      setSelectedEmoji("");

      setTitle(post.title);
    }

    setBody(post.body);

    setUserId(post.userId);

    // Formaga scroll

    window.scrollTo({
      top: 0,

      behavior: "smooth",
    });
  };

  // =========================
  // DELETE
  // =========================

  const handleDelete = async (id) => {
    const confirmDelete = confirm(
      "Bu postni o'chirmoqchimisiz?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setLoading(true);

      /*
        Haqiqiy server postlari:
        1 dan 150 gacha

        Yangi lokal postlar:
        Date.now() orqali katta ID
      */

      if (id <= 150) {
        await deletePost(id);
      }

      // UI'dan o'chirish

      setPosts((prevPosts) =>
        prevPosts.filter(
          (post) => post.id !== id
        )
      );
    } catch (error) {
      console.log(
        "Delete xatolik:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // CANCEL EDIT
  // =========================

  const cancelEdit = () => {
    setEditingId(null);

    setTitle("");

    setBody("");

    setUserId(1);

    setSelectedEmoji("");
  };

  return (
    <div>
      {/* =========================
          HEADER
      ========================= */}

      <div className="page-header">
        <h2 className="section-title">
          Posts
        </h2>
      </div>

      {/* =========================
          SEARCH
      ========================= */}

      <div className="card">
        <input
          type="text"
          placeholder="Search posts..."
          value={search}
          onChange={(e) =>
            handleSearch(e.target.value)
          }
        />
      </div>

      {/* =========================
          CREATE / UPDATE FORM
      ========================= */}

      <div className="card">
        <h3>
          {editingId
            ? "Edit Post"
            : "Create New Post"}
        </h3>

        <form onSubmit={handleSubmit}>
          {/* TITLE */}

          <input
            type="text"
            placeholder="Post title"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
          />

          {/* BODY */}

          <textarea
            placeholder="Post body"
            value={body}
            onChange={(e) =>
              setBody(e.target.value)
            }
          />

          {/* USER ID */}

          <input
            type="number"
            placeholder="User ID"
            value={userId}
            onChange={(e) =>
              setUserId(e.target.value)
            }
          />

          {/* =========================
              EMOJI / STICKER
          ========================= */}

          <div
            style={{
              marginTop: "15px",
              marginBottom: "15px",
            }}
          >
            <p>
              Choose a sticker:
            </p>

            <div>
              {emojis.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() =>
                    setSelectedEmoji(
                      emoji
                    )
                  }
                  style={{
                    fontSize: "24px",

                    margin: "5px",

                    cursor: "pointer",

                    border:
                      selectedEmoji ===
                      emoji
                        ? "2px solid blue"
                        : "1px solid #ccc",

                    borderRadius: "8px",

                    background:
                      selectedEmoji ===
                      emoji
                        ? "#e5e7eb"
                        : "white",
                  }}
                >
                  {emoji}
                </button>
              ))}
            </div>

            {selectedEmoji && (
              <p>
                Selected sticker:{" "}
                <b>
                  {selectedEmoji}
                </b>
              </p>
            )}
          </div>

          {/* SUBMIT */}

          <button type="submit">
            {editingId
              ? "Update Post"
              : "Add Post"}
          </button>

          {/* CANCEL */}

          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              style={{
                marginLeft: "10px",
              }}
            >
              Cancel
            </button>
          )}
        </form>
      </div>

      {/* =========================
          LOADING
      ========================= */}

      {loading && (
        <div className="loading">
          Loading posts...
        </div>
      )}

      {/* =========================
          POSTS
      ========================= */}

      <div className="grid grid-3">
        {posts.map((post) => (
          <div
            key={post.id}
            className="card list-item"
          >
            {/* TITLE */}

            <h3>
              {post.title}
            </h3>

            {/* BODY */}

            <div>
              {post.body}
            </div>

            {/* AUTHOR */}

            <div>
              Author:{" "}
              {post.userId}
            </div>

            {/* BUTTONS */}

            <div
              style={{
                marginTop: "15px",
              }}
            >
              {/* EDIT */}

              <button
                onClick={() =>
                  handleEdit(post)
                }
              >
                Edit
              </button>

              {/* DELETE */}

              <button
                onClick={() =>
                  handleDelete(
                    post.id
                  )
                }
                style={{
                  marginLeft: "10px",

                  background: "red",

                  color: "white",
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Posts;