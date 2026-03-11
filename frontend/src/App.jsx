import { useEffect, useState } from "react";
import { FileText, Plus, Trash2, NotebookPen } from "lucide-react";
import { Button } from "./components/ui/button";
import { cn } from "./lib/utils";
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
    <div className="flex h-screen bg-background text-foreground font-sans antialiased">
      {/* Sidebar */}
      <aside className="w-56 bg-zinc-900 flex flex-col shrink-0">
        <div className="flex items-center gap-2 px-4 py-4 border-b border-zinc-800">
          <NotebookPen size={16} className="text-zinc-400" />
          <span className="text-sm font-semibold text-zinc-100">Notion Lite</span>
        </div>

        <div className="px-2 py-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={openNewForm}
            className="w-full justify-start gap-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
          >
            <Plus size={15} />
            New page
          </Button>
        </div>

        <nav className="flex-1 overflow-y-auto px-2 space-y-0.5">
          {pages.length === 0 && (
            <p className="px-3 py-2 text-xs text-zinc-600">No pages yet</p>
          )}
          {pages.map((page) => (
            <div
              key={page.id}
              onClick={() => openPage(page)}
              className={cn(
                "group flex items-center justify-between rounded-md px-3 py-1.5 cursor-pointer transition-colors",
                selected?.id === page.id
                  ? "bg-zinc-700 text-zinc-100"
                  : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
              )}
            >
              <div className="flex items-center gap-2 min-w-0">
                <FileText size={14} className="shrink-0" />
                <span className="text-sm truncate">
                  {page.title || "Untitled"}
                </span>
              </div>
              <Button
                variant="destructive"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(page.id);
                }}
                className="opacity-0 group-hover:opacity-100 shrink-0 h-6 w-6"
              >
                <Trash2 size={13} />
              </Button>
            </div>
          ))}
        </nav>
      </aside>

      {/* Editor */}
      <main className="flex-1 flex flex-col overflow-hidden bg-white">
        {!selected && !isNew ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-muted-foreground">
            <NotebookPen size={32} className="text-zinc-300" />
            <p className="text-sm">Select a page or create a new one</p>
            <Button
              variant="default"
              size="sm"
              onClick={openNewForm}
              className="gap-2"
            >
              <Plus size={15} />
              New page
            </Button>
          </div>
        ) : (
          <div className="flex-1 flex flex-col overflow-hidden max-w-3xl w-full mx-auto px-16 pt-14 pb-8">
            {error && (
              <div className="mb-6 text-sm text-destructive bg-red-50 border border-red-100 px-4 py-2.5 rounded-md">
                {error}
              </div>
            )}

            <input
              className="text-4xl font-bold text-foreground bg-transparent border-none outline-none placeholder:text-zinc-300 mb-8 w-full"
              placeholder="Untitled"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />

            <textarea
              className="flex-1 text-base leading-7 text-zinc-700 bg-transparent border-none outline-none resize-none placeholder:text-zinc-300 w-full"
              placeholder="Start writing..."
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
            />

            <div className="pt-5 border-t border-zinc-100 flex items-center gap-3 mt-4">
              <Button
                onClick={handleSave}
                disabled={loading || (!isNew && !hasChanges)}
                size="sm"
              >
                {loading ? "Saving..." : isNew ? "Create page" : "Save changes"}
              </Button>

              {!isNew && hasChanges && (
                <span className="text-xs text-muted-foreground">
                  Unsaved changes
                </span>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
