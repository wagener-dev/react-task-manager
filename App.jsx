import { useState, useEffect } from "react";

export default function App() {
  const [input, setInput] = useState("");

  const [tasks, setTasks] = useState(() => {
    const stored = localStorage.getItem("tasks");
    return stored ? JSON.parse(stored) : [];
  });

  const [filter, setFilter] = useState("all");
  const [editingIndex, setEditingIndex] = useState(null);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  function addTask() {
    if (!input.trim()) return;

    setTasks((prev) => [
      ...prev,
      { text: input.trim(), completed: false },
    ]);

    setInput("");
  }

  function deleteTask(index) {
    setTasks((prev) => prev.filter((_, i) => i !== index));
  }

  function toggleTask(index) {
    setTasks((prev) =>
      prev.map((task, i) =>
        i === index ? { ...task, completed: !task.completed } : task
      )
    );
  }

  function clearCompleted() {
    setTasks((prev) => prev.filter((task) => !task.completed));
  }

  const filteredTasks = tasks.filter((task) => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Task Manager</h1>

        <div style={styles.inputRow}>
          <input
            style={styles.input}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") addTask();
            }}
            placeholder="Add a task..."
          />

          <button style={styles.addBtn} onClick={addTask}>
            + Add
          </button>
        </div>

        <div style={styles.filterRow}>
          <button style={styles.filterBtn} onClick={() => setFilter("all")}>
            All
          </button>
          <button style={styles.filterBtn} onClick={() => setFilter("active")}>
            Active
          </button>
          <button
            style={styles.filterBtn}
            onClick={() => setFilter("completed")}
          >
            Completed
          </button>
        </div>

        <button style={styles.clearBtn} onClick={clearCompleted}>
          Clear Completed
        </button>

        <ul style={styles.list}>
          {filteredTasks.length === 0 ? (
            <li style={{ textAlign: "center", color: "#888", padding: "10px" }}>
              No tasks yet. Add one above 👆
            </li>
          ) : (
            filteredTasks.map((task, index) => (
              <li key={index} style={styles.item}>
                {editingIndex === index ? (
                  <input
                    value={task.text}
                    onChange={(e) => {
                      const updated = [...tasks];
                      updated[index].text = e.target.value;
                      setTasks(updated);
                    }}
                    onBlur={() => setEditingIndex(null)}
                    autoFocus
                  />
                ) : (
                  <span
                    onClick={() => toggleTask(index)}
                    onDoubleClick={() => setEditingIndex(index)}
                    style={{
                      cursor: "pointer",
                      textDecoration: task.completed
                        ? "line-through"
                        : "none",
                      opacity: task.completed ? 0.6 : 1,
                    }}
                  >
                    {task.text}
                  </span>
                )}

                <button
                  style={styles.deleteBtn}
                  onClick={() => deleteTask(index)}
                >
                  ✕
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    background: "#f5f7fb",
    paddingTop: "60px",
    fontFamily: "Arial",
  },

  card: {
    width: "420px",
    background: "white",
    padding: "25px",
    borderRadius: "14px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
  },

  title: {
    marginBottom: "20px",
    fontSize: "26px",
    fontWeight: "700",
  },

  inputRow: {
    display: "flex",
    gap: "10px",
    marginBottom: "15px",
  },

  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    outline: "none",
  },

  addBtn: {
    padding: "10px 14px",
    border: "none",
    borderRadius: "8px",
    background: "#4f46e5",
    color: "white",
    cursor: "pointer",
    fontWeight: "600",
    transition: "0.2s",
  },

  filterRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px",
  },

  filterBtn: {
    flex: 1,
    margin: "0 4px",
    padding: "8px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    background: "#fafafa",
    cursor: "pointer",
    fontSize: "12px",
  },

  list: {
    listStyle: "none",
    padding: 0,
    marginTop: "10px",
  },

  item: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px",
    marginBottom: "10px",
    background: "#f9fafb",
    borderRadius: "10px",
    border: "1px solid #eee",
    transition: "0.2s",
  },

  clearBtn: {
    marginTop: "10px",
    marginBottom: "10px",
    padding: "8px",
    border: "none",
    borderRadius: "8px",
    background: "#ef4444",
    color: "white",
    cursor: "pointer",
  },

  deleteBtn: {
    border: "none",
    background: "transparent",
    color: "#ef4444",
    cursor: "pointer",
    fontSize: "16px",
  },
};