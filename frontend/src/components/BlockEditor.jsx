import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Plus, Trash2 } from "lucide-react";
import { createBlock, updateBlock, deleteBlock } from "../api/blocks";

function SortableBlock({ block, onChange, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-start gap-2 group">
      <button
        {...attributes}
        {...listeners}
        className="mt-2 text-zinc-300 hover:text-zinc-500 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 shrink-0"
      >
        <GripVertical size={16} />
      </button>

      {block.type === "heading" ? (
        <input
          className="flex-1 text-2xl font-bold text-foreground bg-transparent border-none outline-none placeholder:text-zinc-300"
          placeholder="Heading"
          value={block.content ?? ""}
          onChange={(e) => onChange(block.id, { content: e.target.value })}
        />
      ) : (
        <textarea
          className="flex-1 text-base leading-7 text-zinc-700 bg-transparent border-none outline-none resize-none placeholder:text-zinc-300 min-h-[2rem]"
          placeholder="Type something..."
          rows={2}
          value={block.content ?? ""}
          onChange={(e) => onChange(block.id, { content: e.target.value })}
        />
      )}

      <button
        onClick={() => onDelete(block.id)}
        className="mt-2 text-zinc-300 hover:text-red-400 opacity-0 group-hover:opacity-100 shrink-0"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}

export default function BlockEditor({ pageId, blocks, setBlocks }) {
  const sensors = useSensors(useSensor(PointerSensor));

  async function handleDragEnd(event) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = blocks.findIndex((b) => b.id === active.id);
    const newIndex = blocks.findIndex((b) => b.id === over.id);
    const reordered = arrayMove(blocks, oldIndex, newIndex);

    setBlocks(reordered);
    await Promise.all(
      reordered.map((block, index) => updateBlock(block.id, { position: index }))
    );
  }

  async function handleChange(blockId, fields) {
    setBlocks((prev) =>
      prev.map((b) => (b.id === blockId ? { ...b, ...fields } : b))
    );
    await updateBlock(blockId, fields);
  }

  async function handleDelete(blockId) {
    await deleteBlock(blockId);
    setBlocks((prev) => prev.filter((b) => b.id !== blockId));
  }

  async function addBlock(type) {
    const position = blocks.length;
    const block = await createBlock(pageId, type, "", position);
    setBlocks((prev) => [...prev, block]);
  }

  return (
    <div className="flex flex-col gap-2">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={blocks.map((b) => b.id)}
          strategy={verticalListSortingStrategy}
        >
          {blocks.map((block) => (
            <SortableBlock
              key={block.id}
              block={block}
              onChange={handleChange}
              onDelete={handleDelete}
            />
          ))}
        </SortableContext>
      </DndContext>

      <div className="flex gap-2 mt-2">
        <button
          onClick={() => addBlock("text")}
          className="flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-700 border border-zinc-200 hover:border-zinc-400 rounded px-2 py-1"
        >
          <Plus size={12} /> Text
        </button>
        <button
          onClick={() => addBlock("heading")}
          className="flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-700 border border-zinc-200 hover:border-zinc-400 rounded px-2 py-1"
        >
          <Plus size={12} /> Heading
        </button>
      </div>
    </div>
  );
}
