const BASE = "/api/folders";

export async function getFolders() {
  const res = await fetch(BASE);
  const json = await res.json();
  return json.data;
}

export async function createFolder(name) {
  const res = await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  const json = await res.json();
  return json.data;
}

export async function updateFolderName(id, name) {
  const res = await fetch(`${BASE}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  const json = await res.json();
  return json.data;
}

export async function deleteFolder(id) {
  await fetch(`${BASE}/${id}`, { method: "DELETE" });
}
