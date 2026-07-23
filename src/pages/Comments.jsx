import { useEffect, useState } from "react";

import {
  getComments,
  createComment,
  updateComment,
  deleteComment,
  searchComments,
} from "../api/comments";

function Comments() {
  const [comments, setComments] = useState([]);

  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");

  const [body, setBody] = useState("");

  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

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
    "👏",
    "💯",
    "✨",
    "🥳",
  ];

  // =========================
  // GET COMMENTS
  // =========================

  const loadComments = async () => {
    try {
      setLoading(true);

      const data = await getComments();

      setComments(data.comments || []);
    } catch (error) {
      console.log(
        "Comments yuklashda xatolik:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComments();
  }, []);

  // =========================
  // SEARCH
  // =========================

  const handleSearch = async (value) => {
    setSearch(value);

    if (value.trim() === "") {
      loadComments();

      return;
    }

    try {
      setLoading(true);

      const data = await searchComments(value);

      setComments(data.comments || []);
    } catch (error) {
      console.log(
        "Search xatolik:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // CREATE + UPDATE
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !name.trim() ||
      !body.trim() ||
      !email.trim()
    ) {
      alert(
        "Name, email va comment to'ldirilishi kerak!"
      );

      return;
    }

    // Sticker + comment
    const finalBody = selectedEmoji
      ? `${selectedEmoji} ${body}`
      : body;

    // API uchun to'g'ri format
    const commentData = {
      body: finalBody,

      postId: 1,

      userId: Number(userId),
    };

    try {
      setLoading(true);

      // =========================
      // UPDATE - PUT
      // =========================

      if (editingId) {
        // Haqiqiy API comment
        if (editingId <= 340) {
          const updatedComment =
            await updateComment(
              editingId,
              commentData
            );

          setComments((prevComments) =>
            prevComments.map((comment) =>
              comment.id === editingId
                ? {
                    ...comment,

                    ...updatedComment,

                    body: finalBody,

                    email: email,

                    user: {
                      ...comment.user,

                      id: Number(userId),

                      username: name,

                      fullName: name,
                    },
                  }
                : comment
            )
          );
        }

        // Lokal comment
        else {
          setComments((prevComments) =>
            prevComments.map((comment) =>
              comment.id === editingId
                ? {
                    ...comment,

                    body: finalBody,

                    email: email,

                    user: {
                      ...comment.user,

                      id: Number(userId),

                      username: name,

                      fullName: name,
                    },
                  }
                : comment
            )
          );
        }

        setEditingId(null);
      }

      // =========================
      // CREATE - POST
      // =========================

      else {
        const newComment =
          await createComment(
            commentData
          );

        // Frontend uchun to'liq comment
        const localComment = {
          ...newComment,

          // Yangi lokal ID
          id: Date.now(),

          body: finalBody,

          email: email,

          user: {
            id: Number(userId),

            username: name,

            fullName: name,
          },
        };

        setComments((prevComments) => [
          localComment,

          ...prevComments,
        ]);
      }

      // Formani tozalash

      setBody("");

      setName("");

      setEmail("");

      setUserId(1);

      setSelectedEmoji("");
    } catch (error) {
      console.log(
        "Comment yuborishda xatolik:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // EDIT
  // =========================

  const handleEdit = (comment) => {
    setEditingId(comment.id);

    setBody(comment.body);

    setEmail(comment.email || "");

    setName(
      comment.user?.fullName ||
        comment.user?.username ||
        comment.name ||
        ""
    );

    setUserId(
      comment.user?.id || 1
    );

    // Edit paytida emoji
    // body ichida qoladi
    setSelectedEmoji("");

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
      "Bu commentni o'chirmoqchimisiz?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setLoading(true);

      // Haqiqiy commentni serverdan o'chirish
      if (id <= 340) {
        await deleteComment(id);
      }

      // Frontenddan o'chirish
      setComments((prevComments) =>
        prevComments.filter(
          (comment) =>
            comment.id !== id
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

    setBody("");

    setName("");

    setEmail("");

    setUserId(1);

    setSelectedEmoji("");
  };

  return (
    <div>
      {/* HEADER */}

      <div className="page-header">
        <h2 className="section-title">
          Comments
        </h2>
      </div>

      {/* SEARCH */}

      <div className="card">
        <input
          type="text"
          placeholder="Search comments..."
          value={search}
          onChange={(e) =>
            handleSearch(
              e.target.value
            )
          }
        />
      </div>

      {/* FORM */}

      <div className="card">
        <h3>
          {editingId
            ? "Edit Comment"
            : "Create New Comment"}
        </h3>

        <form onSubmit={handleSubmit}>
          {/* NAME */}

          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
          />

          {/* EMAIL */}

          <input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

          {/* USER ID */}

          <input
            type="number"
            placeholder="User ID"
            value={userId}
            onChange={(e) =>
              setUserId(
                e.target.value
              )
            }
          />

          {/* STICKERS */}

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

          {/* COMMENT BODY */}

          <textarea
            placeholder="Write your comment..."
            value={body}
            onChange={(e) =>
              setBody(e.target.value)
            }
          />

          {/* SUBMIT */}

          <button type="submit">
            {editingId
              ? "Update Comment"
              : "Add Comment"}
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

      {/* LOADING */}

      {loading && (
        <div className="loading">
          Loading comments...
        </div>
      )}

      {/* COMMENTS */}

      <div className="grid grid-3">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="card list-item"
          >
            {/* USER NAME */}

            <h3>
              {comment.user?.fullName ||
                comment.user?.username ||
                comment.name ||
                "Unknown User"}
            </h3>

            {/* COMMENT */}

            <div>
              {comment.body}
            </div>

            {/* EMAIL */}

            <div>
              {comment.email ||
                "No email"}
            </div>

            {/* USER ID */}

            <div>
              User ID:{" "}
              {comment.user?.id ||
                comment.userId ||
                "Unknown"}
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
                  handleEdit(
                    comment
                  )
                }
              >
                Edit
              </button>

              {/* DELETE */}

              <button
                onClick={() =>
                  handleDelete(
                    comment.id
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

export default Comments;