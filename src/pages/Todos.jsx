import { useEffect, useState } from "react";
import { getTodos } from "../api/todos";

function Todos() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await getTodos();
      setTodos(data.todos || []);
      setLoading(false);
    };
    load();
  }, []);

  const addTodo = (e) => {
    e?.preventDefault?.();
    if (!text.trim()) return;
    const newTodo = {
      id: Date.now(),
      todo: text.trim(),
      userId: 1,
      completed: false,
    };
    setTodos((s) => [newTodo, ...s]);
    setText("");
  };

  const deleteTodo = (id) => {
    setTodos((s) => s.filter((t) => t.id !== id));
  };

  const startEdit = (t) => {
    setEditingId(t.id);
    setEditingText(t.todo);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingText("");
  };

  const saveEdit = (id) => {
    if (!editingText.trim()) return;
    setTodos((s) => s.map((t) => (t.id === id ? { ...t, todo: editingText.trim() } : t)));
    cancelEdit();
  };

  const toggleComplete = (id) => {
    setTodos((s) => s.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  return (
    <div>
      <div className="page-header">
        <h2 className="section-title">Todos</h2>
      </div>

      <div className="card todo-panel">
        <form className="todo-form" onSubmit={addTodo}>
          <input
            className="todo-input"
            placeholder="Add a new todo..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button type="submit" className="todo-add-btn">
            Add
          </button>
        </form>

        {loading && <div className="loading">Loading todos...</div>}

        <div className="todo-list">
          {todos.map((todo) => (
            <div key={todo.id} className="todo-list-item">
              <div className="todo-left">
                <input
                  type="checkbox"
                  checked={!!todo.completed}
                  onChange={() => toggleComplete(todo.id)}
                />

                {editingId === todo.id ? (
                  <input
                    className="edit-input"
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                  />
                ) : (
                  <div className="todo-text">{todo.todo}</div>
                )}
              </div>

              <div className="todo-actions">
                {editingId === todo.id ? (
                  <>
                    <button className="todo-btn" onClick={() => saveEdit(todo.id)}>
                      Save
                    </button>
                    <button className="todo-btn" onClick={cancelEdit}>
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button className="todo-btn" onClick={() => startEdit(todo)}>
                      Edit
                    </button>
                    <button className="todo-btn danger" onClick={() => deleteTodo(todo.id)}>
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Todos;
