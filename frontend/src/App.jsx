import { useEffect, useState } from "react";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  // Load todos on mount
  useEffect(() => {
    setLoading(true);
    fetch("/api/todos")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load todos");
        return res.json();
      })
      .then((data) => setTodos(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // Create a new todo
  const addTodo = async (e) => {
    e.preventDefault();
    const clean = text.trim();
    if (!clean) return;
    setError(null);
    const res = await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: clean, completed: false }),
    });
    if (!res.ok) {
      setError("Failed to create todo");
      return;
    }
    const created = await res.json();
    setTodos((t) => [created, ...t]);
    setText("");
  };

  const toggleStatus = (id) => {
    // Placeholder for toggling todo status
    setTodos((t) =>
      t.map((todo) =>
        todo._id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
    // Optionally, update the backend here to persist the change
    fetch(`/api/todos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        todos.find((todo) => todo._id === id).completed
          ? { completed: false }
          : { completed: true }
      ),
    });
  };

  const clearAllTodos = () => {
    setTodos([]);
  };

  const deleteTodo = (id) => {
    // Placeholder for deleting a todo
    // You can implement this function to delete a specific todo by its ID
    setTodos((t) => t.filter((todo) => todo._id !== id));
  };

  return (
    <>
      <main className="mx-auto max-w-xl p-6 font-sans">
        <div className="space-y-6">
          <header className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md">
              T
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Todo List
            </h1>
          </header>

          <form onSubmit={addTodo} className="flex gap-3">
            <input
              className="flex-1 rounded-md border border-gray-300 bg-white/90 px-4 py-2 text-sm shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-400/40"
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Add a new task..."
            />
            <button
              type="submit"
              className="rounded-md bg-blue-600 px-5 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-500 focus:ring-2 focus:ring-blue-400 focus:outline-none disabled:opacity-50"
              disabled={!text.trim()}
            >
              Add
            </button>
          </form>

          {error && (
            <div className="rounded-md border border-red-300 bg-red-50 px-4 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          <section className="rounded-lg border border-gray-200 bg-white/60 backdrop-blur-sm shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
              <h2 className="text-lg font-semibold">Tasks</h2>
              <span className="text-xs text-gray-500">
                {todos.length} total
              </span>
            </div>

            {loading ? (
              <div className="px-4 py-6 text-center text-sm text-gray-500">
                Loading...
              </div>
            ) : todos.length === 0 ? (
              <div className="px-4 py-6 text-center text-sm text-gray-500">
                No todos yet. Add one above!
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {todos.map((t) => (
                  <li
                    key={t._id}
                    className="group flex items-start gap-3 px-4 py-3 text-sm hover:bg-blue-50/40 transition"
                  >
                    <button
                      type="button"
                      onClick={() => toggleStatus(t._id)}
                      aria-label={
                        t.completed ? "Mark as incomplete" : "Mark as complete"
                      }
                      className={`mt-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border text-[10px] font-bold transition ${
                        t.completed
                          ? "border-green-500 bg-green-500 text-white"
                          : "border-gray-300 text-gray-400 hover:border-blue-400"
                      }`}
                    >
                      {t.completed ? "✓" : ""}
                    </button>

                    <p
                      className={`flex-1 leading-relaxed ${
                        t.completed
                          ? "text-gray-400 line-through"
                          : "text-gray-700"
                      }`}
                    >
                      {t.text}
                    </p>

                    <button
                      type="button"
                      aria-label="Delete todo"
                      className="opacity-60 transition hover:opacity-100 text-gray-400 hover:text-red-600 cursor-pointer"
                      onClick={() => deleteTodo(t._id)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="h-5 w-5"
                      >
                        <path
                          fillRule="evenodd"
                          d="M9.53 3.47A.75.75 0 0 1 10.06 3h3.88a.75.75 0 0 1 .53.22l.56.56h3.72a.75.75 0 0 1 0 1.5h-.68l-1.06 13.03A2.75 2.75 0 0 1 14.28 21H9.72a2.75 2.75 0 0 1-2.97-2.69L5.69 5.28H5a.75.75 0 0 1 0-1.5h3.72l.81-.81ZM7.21 5.28l1.04 12.8a1.25 1.25 0 0 0 1.47 1.14l.04-.01h4.56c.64 0 1.18-.49 1.24-1.14l1.04-12.8H7.21ZM10 9.25a.75.75 0 0 1 .75.75v6a.75.75 0 0 1-1.5 0v-6c0-.41.34-.75.75-.75Zm4 0c.41 0 .75.34.75.75v6a.75.75 0 0 1-1.5 0v-6c0-.41.34-.75.75-.75Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <div className="mt-4 flex justify-center">
            <button
              type="button"
              onClick={() => setShowConfirm(true)}
              className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-500 focus:ring-2 focus:ring-red-400 focus:outline-none"
            >
              Clear All
            </button>
          </div>
        </div>
      </main>
      {showConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-clear-title"
        >
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowConfirm(false)}
          />
          <div className="relative z-10 w-full max-w-sm rounded-xl bg-white p-6 shadow-xl ring-1 ring-black/5">
            <h3
              id="confirm-clear-title"
              className="text-lg font-semibold text-gray-900"
            >
              Clear all tasks?
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              This action cannot be undone. Are you sure you want to remove all
              todos?
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  // TODO: Hook your clear-all logic here (e.g., setTodos([]) and/or call your API)
                  clearAllTodos();
                  setShowConfirm(false);
                }}
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-400"
              >
                Yes, clear
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
