# Notion Lite

A stripped-down Notion clone I built to learn full-stack development with FastAPI and React. Create pages, add a title and description, then build content using draggable blocks — text or headings — that can be reordered by dragging.

## Stack

- **Backend** — FastAPI + PostgreSQL + SQLAlchemy
- **Frontend** — React + Vite + Tailwind CSS + dnd-kit
- **Infrastructure** — Docker + Docker Compose

## Running it

Make sure you have Docker installed, then:

```bash
docker compose up --build
```

Frontend runs on `http://localhost:3000`, backend on `http://localhost:80`.

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
  config.py       # env config
  database.py     # db session setup
  models/
    base.py       # shared SQLAlchemy Base
    page.py       # Page model
    block.py      # Block model (linked to Page via page_id)
  schemas/
    page.py       # Pydantic schemas for pages
    block.py      # Pydantic schemas for blocks
  routes/
    pages.py      # page endpoints
    blocks.py     # block endpoints
  services/
    page.py       # page business logic
    block.py      # block business logic
frontend/
  src/
    api/
      pages.js    # page fetch calls
      blocks.js   # block fetch calls
    components/
      BlockEditor.jsx  # draggable block editor
    App.jsx       # main UI and state
```
