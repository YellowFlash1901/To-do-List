# Notion Lite

A stripped-down Notion clone I built to learn full-stack development with FastAPI and React. Create pages, organize them into folders, and build content using draggable blocks — text or headings — that can be reordered by dragging.

## Stack

- **Backend** — FastAPI + PostgreSQL + SQLAlchemy
- **Frontend** — React + Vite + Tailwind CSS + dnd-kit
- **Infrastructure** — Docker + Docker Compose

## Running it

Make sure you have Docker installed, then:

```bash
docker compose up --build
```

Frontend runs on `http://localhost:3000`, backend on `http://localhost:80`, and Adminer (DB admin UI) on `http://localhost:8080`.

You'll need a `.env` file in the root:

```
DATABASE_URL=postgresql://postgres:<your_password>@db:5432/postgres
POSTGRES_PASSWORD=<your_password>
```

## API

### Pages

| Method | Endpoint | What it does |
|--------|----------|--------------|
| GET | `/pages` | list all pages |
| POST | `/pages` | create a page |
| GET | `/pages/{id}` | get one page |
| PATCH | `/pages/{id}` | update title or content |
| DELETE | `/pages/{id}` | delete a page |

### Folders

| Method | Endpoint | What it does |
|--------|----------|--------------|
| GET | `/folders` | list all folders |
| POST | `/folders` | create a folder |
| GET | `/folders/{id}` | get one folder |
| GET | `/folders/{id}/pages` | list pages in a folder |
| PATCH | `/folders/{id}` | rename a folder |
| DELETE | `/folders/{id}` | delete a folder |

### Blocks

| Method | Endpoint | What it does |
|--------|----------|--------------|
| POST | `/blocks` | create a block |
| GET | `/blocks/page/{page_id}` | get all blocks for a page |
| PATCH | `/blocks/{id}` | update a block |
| DELETE | `/blocks/{id}` | delete a block |

## Project structure

```
app/
  main.py         # app init and router registration
  config.py       # env config
  database.py     # db session setup
  models/
    base.py       # shared SQLAlchemy Base
    page.py       # Page model (has optional folder_id FK)
    folder.py     # Folder model
    block.py      # Block model (linked to Page via page_id)
  schemas/
    page.py       # Pydantic schemas for pages
    folder.py     # Pydantic schemas for folders
    block.py      # Pydantic schemas for blocks
  routes/
    pages.py      # page endpoints
    folders.py    # folder endpoints
    blocks.py     # block endpoints
  services/
    page.py       # page business logic
    folder.py     # folder business logic
    block.py      # block business logic
frontend/
  src/
    api/
      pages.js    # page fetch calls
      folders.js  # folder fetch calls
      blocks.js   # block fetch calls
    components/
      BlockEditor.jsx  # draggable block editor
      ui/
        button.jsx     # reusable button component
        input.jsx      # reusable input component
        textarea.jsx   # reusable textarea component
    lib/
      utils.js    # utility helpers (cn for class merging)
    App.jsx       # main UI and state
    main.jsx      # entry point
```
