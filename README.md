# Campus Register — Student Management System

A mini full-stack Student Management System built with **HTML, CSS, JavaScript** on the
frontend and **Node.js + Express.js** on the backend. No database — all data is stored in
a local JSON file (`data/students.json`) via the file system.

## Features

- **Student Registration** — add, edit, and delete students (name, roll no, branch, year,
  email, phone), with validation and duplicate roll-number checks.
- **Dashboard** — total students, branches, year groups, plus a
  branch/year breakdown and a "recently registered" list.
- **Marks & Grade Management** — enter subject-wise marks; total, percentage and grade
  (A+ down to F) are calculated automatically.
- **Search, Filter & Reports** — search by name or roll number, filter by branch/year, and
  open a full report for any student (personal details, marks and grade).

## Tech stack

| Layer     | Technology                    |
|-----------|--------------------------------|
| Structure | HTML                           |
| Styling   | CSS (custom, no framework)     |
| Frontend  | Vanilla JavaScript (fetch API) |
| Backend   | Node.js + Express.js           |
| Storage   | JSON file (`data/students.json`) — no database |

## Project structure

```
student-management-system/
├── server.js              # Express app entry point
├── package.json
├── data/
│   └── students.json       # temporary JSON "database"
├── utils/
│   └── dataStore.js        # all read/write + business logic (grade calc)
├── routes/
│   └── students.js         # REST API routes
└── public/                 # frontend (served statically by Express)
    ├── index.html           # Dashboard
    ├── register.html        # Registration
    ├── marks.html            # Marks & grade management
    ├── reports.html          # Search, filter & reports
    ├── css/style.css
    └── js/
        ├── common.js         # shared API + UI helpers
        ├── dashboard.js
        ├── register.js
        ├── marks.js
        └── reports.js
```

## Getting started

1. Make sure you have [Node.js](https://nodejs.org) (v16+) installed.
2. Open a terminal in this folder.
3. Install dependencies (skip this if `node_modules` is already included):
   ```
   npm install
   ```
4. Start the server:
   ```
   npm start
   ```
5. Open **http://localhost:3000** in your browser.

The server runs on port `3000` by default. To use a different port:
```
PORT=4000 npm start
```

## REST API reference

| Method | Endpoint                          | Description                          |
|--------|------------------------------------|---------------------------------------|
| GET    | `/api/dashboard/stats`             | Dashboard summary stats               |
| GET    | `/api/students?search=&branch=&year=` | List/search/filter students        |
| GET    | `/api/students/:id`                | Get one student                       |
| POST   | `/api/students`                    | Create a student                      |
| PUT    | `/api/students/:id`                | Update a student                      |
| DELETE | `/api/students/:id`                | Delete a student                      |
| POST   | `/api/students/:id/marks`          | Save marks `{subjects:[{subject,marks,maxMarks}]}` |

## Notes

- Data is kept in `data/students.json`, so it resets only if that file is cleared — it
  persists across server restarts, but is not a real database (by design, per the brief).
- Grade scale: A+ ≥90, A ≥80, B+ ≥70, B ≥60, C ≥50, D ≥40, F <40.
