import { useEffect, useState } from "react";
import { FileText, Plus, Trash2, NotebookPen, PanelLeft, Folder, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "./components/ui/button";
import { cn } from "./lib/utils";
import { getPages, getPage, createPage, updatePage, deletePage } from "./api/pages";
import { getFolders, createFolder, deleteFolder } from "./api/folders";
import { getBlocksByPage } from "./api/blocks";
import BlockEditor from "./components/BlockEditor";

export default function App() {
  const [pages, setPages] = useState([]);
  const [folders, setFolders] = useState([]);
  const [expandedFolders, setExpandedFolders] = useState({});
  const [selected, setSelected] = useState(null);
  const [blocks, setBlocks] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newFolderId, setNewFolderId] = useState(null);
  const [isNew, setIsNew] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    Promise.all([getPages(), getFolders()])
      .then(([p, f]) => { setPages(p); setFolders(f); })
      .catch(() => setError("Failed to load data."));
  }, []);

  async function openPage(pageId) {
    setPageLoading(true);
    setIsNew(false);
    setError(null);
    try {
      const [page, pageBlocks] = await Promise.all([
        getPage(pageId),
        getBlocksByPage(pageId),
      ]);
      setSelected(page);
      setBlocks(pageBlocks);
    } catch {
      setError("Failed to load page.");
    } finally {
      setPageLoading(false);
    }
  }

  function openNewForm(folderId = null) {
    setSelected(null);
    setBlocks([]);
    setNewTitle("");
    setNewContent("");
    setNewFolderId(folderId);
    setIsNew(true);
    setError(null);
  }

  async function handleCreate() {
    if (!newTitle.trim()) {
      setError("Title is required.");
      return;
    }
    setError(null);
    try {
      const created = await createPage(newTitle, newContent, newFolderId);
      setPages((prev) => [created, ...prev]);
      setSelected(created);
      setBlocks([]);
      setIsNew(false);
    } catch {
      setError("Failed to create page.");
    }
  }

  async function handleAddFolder() {
    const name = prompt("Folder name:");
    if (!name?.trim()) return;
    try {
      const folder = await createFolder(name.trim());
      setFolders((prev) => [...prev, folder]);
    } catch {
      setError("Failed to create folder.");
    }
  }

  async function handleDeleteFolder(folderId) {
    try {
      await deleteFolder(folderId);
      setFolders((prev) => prev.filter((f) => f.id !== folderId));
      setPages((prev) => prev.map((p) => p.folder_id === folderId ? { ...p, folder_id: null } : p));
    } catch {
      setError("Failed to delete folder.");
    }
  }

  async function handleTitleBlur() {
    if (!selected || isNew) return;
    try {
      const updated = await updatePage(selected.id, selected.title, selected.content ?? "");
      setPages((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      setSelected(updated);
    } catch {
      setError("Failed to save.");
    }
  }

  async function handleDelete(pageId) {
    try {
      await deletePage(pageId);
      setPages((prev) => prev.filter((p) => p.id !== pageId));
      if (selected?.id === pageId) {
        setSelected(null);
        setBlocks([]);
        setIsNew(false);
      }
    } catch {
      setError("Delete failed.");
    }
  }

  function toggleFolder(folderId) {
    setExpandedFolders((prev) => ({ ...prev, [folderId]: !prev[folderId] }));
  }

  const unassignedPages = pages.filter((p) => !p.folder_id);

  return (
    <div className="flex h-screen bg-background text-foreground font-sans antialiased">

      {/* Sidebar */}
      <aside className={cn(
        "bg-zinc-900 flex flex-col shrink-0 transition-all duration-300 ease-in-out overflow-hidden",
        sidebarOpen ? "w-64" : "w-12"
      )}>
        <div className="flex items-center h-12 border-b border-zinc-800 px-2 gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen((prev) => !prev)}
            className="shrink-0 h-8 w-8 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
          >
            <PanelLeft size={16} />
          </Button>
          {sidebarOpen && (
            <div className="flex items-center gap-2 min-w-0">
              <NotebookPen size={15} className="text-zinc-400 shrink-0" />
              <span className="text-sm font-semibold text-zinc-100 truncate">Notion Lite</span>
            </div>
          )}
        </div>

        {sidebarOpen && (
          <div className="flex gap-1 py-3 px-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => openNewForm()}
              className="flex-1 justify-start gap-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
            >
              <Plus size={15} /> New page
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleAddFolder}
              className="justify-start gap-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 px-2"
              title="New folder"
            >
              <Folder size={15} />
            </Button>
          </div>
        )}

        <nav className="flex-1 overflow-y-auto px-2 space-y-1">
          {/* Folders */}
          {sidebarOpen && folders.map((folder) => {
            const folderPages = pages.filter((p) => p.folder_id === folder.id);
            const isExpanded = expandedFolders[folder.id];
            return (
              <div key={folder.id}>
                <div
                  className="group flex items-center justify-between rounded-md px-2 py-1.5 cursor-pointer text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                  onClick={() => toggleFolder(folder.id)}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {isExpanded ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
                    <Folder size={13} className="shrink-0" />
                    <span className="text-sm truncate">{folder.name}</span>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100">
                    <button
                      onClick={(e) => { e.stopPropagation(); openNewForm(folder.id); }}
                      className="text-zinc-400 hover:text-zinc-100 p-0.5"
                      title="Add page to folder"
                    >
                      <Plus size={12} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDeleteFolder(folder.id); }}
                      className="text-zinc-400 hover:text-red-400 p-0.5"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>

                {isExpanded && folderPages.map((page) => (
                  <div
                    key={page.id}
                    onClick={() => openPage(page.id)}
                    className={cn(
                      "group flex items-center justify-between rounded-md pl-8 pr-2 py-1.5 cursor-pointer transition-colors",
                      selected?.id === page.id
                        ? "bg-zinc-700 text-zinc-100"
                        : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                    )}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText size={13} className="shrink-0" />
                      <span className="text-sm truncate">{page.title || "Untitled"}</span>
                    </div>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={(e) => { e.stopPropagation(); handleDelete(page.id); }}
                      className="opacity-0 group-hover:opacity-100 shrink-0 h-5 w-5"
                    >
                      <Trash2 size={11} />
                    </Button>
                  </div>
                ))}
              </div>
            );
          })}

          {/* Unassigned pages */}
          {sidebarOpen && unassignedPages.length > 0 && folders.length > 0 && (
            <p className="px-2 pt-2 text-xs text-zinc-600">Pages</p>
          )}
          {unassignedPages.map((page) => (
            <div
              key={page.id}
              onClick={() => openPage(page.id)}
              title={!sidebarOpen ? (page.title || "Untitled") : undefined}
              className={cn(
                "group flex items-center justify-between rounded-md px-2 py-1.5 cursor-pointer transition-colors",
                selected?.id === page.id
                  ? "bg-zinc-700 text-zinc-100"
                  : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
              )}
            >
              <div className="flex items-center gap-2 min-w-0">
                <FileText size={14} className="shrink-0" />
                {sidebarOpen && (
                  <span className="text-sm truncate">{page.title || "Untitled"}</span>
                )}
              </div>
              {sidebarOpen && (
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={(e) => { e.stopPropagation(); handleDelete(page.id); }}
                  className="opacity-0 group-hover:opacity-100 shrink-0 h-6 w-6"
                >
                  <Trash2 size={13} />
                </Button>
              )}
            </div>
          ))}

          {sidebarOpen && pages.length === 0 && folders.length === 0 && (
            <p className="px-3 py-2 text-xs text-zinc-600">No pages yet</p>
          )}
        </nav>
      </aside>

      {/* Editor */}
      <main className="flex-1 flex flex-col overflow-hidden bg-white">
        {!selected && !isNew ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-muted-foreground">
            <NotebookPen size={32} className="text-zinc-300" />
            <p className="text-sm">Select a page or create a new one</p>
            <Button variant="default" size="sm" onClick={() => openNewForm()} className="gap-2">
              <Plus size={15} /> New page
            </Button>
          </div>
        ) : pageLoading ? (
          <div className="flex-1 flex items-center justify-center text-sm text-zinc-400">
            Loading...
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-3xl w-full mx-auto px-16 pt-14 pb-8">
              {error && (
                <div className="mb-6 text-sm text-destructive bg-red-50 border border-red-100 px-4 py-2.5 rounded-md">
                  {error}
                </div>
              )}

              {isNew ? (
                <>
                  {newFolderId && (
                    <p className="text-xs text-zinc-400 mb-4">
                      In folder: <span className="text-zinc-300">{folders.find(f => f.id === newFolderId)?.name}</span>
                    </p>
                  )}
                  <input
                    className="text-4xl font-bold text-foreground bg-transparent border-none outline-none placeholder:text-zinc-300 mb-4 w-full"
                    placeholder="Untitled"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                    autoFocus
                  />
                  <textarea
                    className="w-full text-base leading-7 text-zinc-700 bg-transparent border-none outline-none resize-none placeholder:text-zinc-300 mb-8 min-h-[80px]"
                    placeholder="Add a description or content... (press Enter on title to create)"
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                  />
                </>
              ) : (
                <>
                  {selected.folder_id && (
                    <p className="text-xs text-zinc-400 mb-4">
                      In folder: <span className="text-zinc-300">{folders.find(f => f.id === selected.folder_id)?.name}</span>
                    </p>
                  )}
                  <input
                    className="text-4xl font-bold text-foreground bg-transparent border-none outline-none placeholder:text-zinc-300 mb-4 w-full"
                    placeholder="Untitled"
                    value={selected.title ?? ""}
                    onChange={(e) => setSelected((prev) => ({ ...prev, title: e.target.value }))}
                    onBlur={handleTitleBlur}
                  />
                  <textarea
                    className="w-full text-base leading-7 text-zinc-700 bg-transparent border-none outline-none resize-none placeholder:text-zinc-300 mb-8 min-h-[80px]"
                    placeholder="Add a description or content..."
                    value={selected.content ?? ""}
                    onChange={(e) => setSelected((prev) => ({ ...prev, content: e.target.value }))}
                    onBlur={handleTitleBlur}
                  />
                  <div className="border-t border-zinc-100 pt-6">
                    <BlockEditor
                      pageId={selected.id}
                      blocks={blocks}
                      setBlocks={setBlocks}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
