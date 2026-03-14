const BASE = "/api/blocks";

export async function getBlocksByPage(pageId) {
  const res = await fetch(`${BASE}/page/${pageId}`);
  const json = await res.json();
  return json.data;
}

export async function createBlock(pageId, type, content, position) {
  const res = await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ page_id: pageId, type, content, position }),
  });
  const json = await res.json();
  return json.data;
}

export async function updateBlock(blockId, fields) {
  const res = await fetch(`${BASE}/${blockId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(fields),
  });
  const json = await res.json();
  return json.data;
}

export async function deleteBlock(blockId) {
  await fetch(`${BASE}/${blockId}`, { method: "DELETE" });
}
