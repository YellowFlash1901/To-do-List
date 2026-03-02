const BASE = "/api/pages";

export async function getPages() {
  const res = await fetch(BASE);
  const json = await res.json();
  return json.data;
}

export async function getPage(id) {
  const res = await fetch(`${BASE}/${id}`);
  const json = await res.json();
  return json.data;
}

export async function createPage(title, content) {
  const res = await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, content }),
  });
  const json = await res.json();
  return json.data;
}

export async function updatePage(id, title, content) {
  const res = await fetch(`${BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, content }),
  });
  const json = await res.json();
  return json.data;
}

export async function deletePage(id) {
  await fetch(`${BASE}/${id}`, { method: "DELETE" });
}
