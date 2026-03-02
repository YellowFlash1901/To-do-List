import { useEffect, useState } from "react";
import { getPages, createPage, updatePage, deletePage } from "./api/pages";

const EMPTY_FORM = { title: "", content: "" };

export default function App() {
  const [pages, setPages] = useState([]);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [isNew, setIsNew] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadPages();
  }, []);

  async function loadPages() {
    try {
      const data = await getPages();
      setPages(data);
    } catch {
      setError("Failed to load pages.");
    }
  }

  function openPage(page) {
    setSelected(page);
    setForm({ title: page.title ?? "", content: page.content ?? "" });
    setIsNew(false);
    setError(null);
  }

  function openNewForm() {
    setSelected(null);
    setForm(EMPTY_FORM);
    setIsNew(true);
    setError(null);
  }

  async function handleSave() {
    if (!form.title.trim()) {
      setError("Title is required.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      if (isNew) {
        const created = await createPage(form.title, form.content);
        setPages((prev) => [created, ...prev]);
        setSelected(created);
        setIsNew(false);
      } else {
        const updated = await updatePage(selected.id, form.title, form.content);
        setPages((prev) =>
          prev.map((p) => (p.id === updated.id ? updated : p))
        );
        setSelected(updated);
      }
    } catch {
      setError("Save failed. Try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(pageId) {
    setLoading(true);
    try {
      await deletePage(pageId);
      setPages((prev) => prev.filter((p) => p.id !== pageId));
      if (selected?.id === pageId) {
        setSelected(null);
        setForm(EMPTY_FORM);
        setIsNew(false);
      }
    } catch {
      setError("Delete failed.");
    } finally {
      setLoading(false);
    }
  }

  const hasChanges =
    selected &&
    !isNew &&
    (form.title !== (selected.title ?? "") ||
      form.content !== (selected.content ?? ""));

  return (
    <div className="flex h-screen bg-white text-gray-900 font-sans">
      {/* Sidebar */}
      <aside className="w-60 bg-gray-50 border-r border-gray-200 flex flex-col shrink-0">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <span className="font-semibold text-sm text-gray-700">Notion Lite</span>
          <button
            onClick={openNewForm}
            className="text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded px-2 py-0.5 text-sm transition-colors cursor-pointer"
          >
            + New
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-2">
          {pages.length === 0 && (
            <p className="px-4 py-3 text-xs text-gray-400">No pages yet.</p>
          )}
          {pages.map((page) => (
            <div
              key={page.id}
              onClick={() => openPage(page)}
              className={`group flex items-center justify-between mx-2 px-3 py-1.5 rounded-md cursor-pointer text-sm transition-colors ${
                selected?.id === page.id
                  ? "bg-gray-200 text-gray-900"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <span className="truncate flex-1">
                {page.title || "Untitled"}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(page.id);
                }}
                className="opacity-0 group-hover:opacity-100 ml-2 text-gray-400 hover:text-red-500 transition-all shrink-0 cursor-pointer"
              >
                &times;
              </button>
            </div>
          ))}
        </nav>
      </aside>

      {/* Editor */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {!selected && !isNew ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-3">
            <p className="text-sm">Select a page or create a new one</p>
            <button
              onClick={openNewForm}
              className="text-sm text-gray-500 border border-gray-300 rounded-md px-4 py-2 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              + New page
            </button>
          </div>
        ) : (
          <div className="flex-1 flex flex-col overflow-hidden max-w-3xl w-full mx-auto px-16 py-12">
            {error && (
              <p className="text-red-500 text-sm mb-4 bg-red-50 px-3 py-2 rounded-md">
                {error}
              </p>
            )}

            <input
              className="text-4xl font-bold text-gray-900 bg-transparent border-none outline-none placeholder:text-gray-300 mb-6"
              placeholder="Untitled"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />

            <textarea
              className="flex-1 text-base leading-relaxed text-gray-700 bg-transparent border-none outline-none resize-none placeholder:text-gray-300"
              placeholder="Start writing..."
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
            />

            <div className="pt-4 border-t border-gray-100 flex items-center gap-3">
              <button
                onClick={handleSave}
                disabled={loading || (!isNew && !hasChanges)}
                className="px-4 py-2 bg-gray-900 text-white text-sm rounded-md hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                {loading ? "Saving..." : isNew ? "Create page" : "Save changes"}
              </button>

              {!isNew && hasChanges && (
                <span className="text-xs text-gray-400">Unsaved changes</span>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
