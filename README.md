# 🎓 ScholarX

A modern platform for managing student exchange programs and scholarship applications.

---

## 🚀 Tech Stack

- **Frontend:** React + Vite (client-side)
- **Backend:** Node.js + Express (server-side)
- **Database:** MongoDB + Mongoose (models implemented)
- **File Handling:** Multer (for document/transcript uploads)

---

## 🛠️ Features

- **Unified Login System**
  - Role-based access for Students, Instructors, and Admins via a single portal.
  - Secure session management.

- **Student**
  - Register & login.
  - Browse available Exchange Programs and Scholarships.
  - Apply with document uploads (Transcripts, ID Cards, Recommendation Letters).
  - Track application status via a personal dashboard.

- **Instructor**
  - Review and manage student applications.
  - Departmental-level oversight.

- **Admin**
  - Manage Global University database.
  - Configure Program and Scholarship listings.
  - System-wide records management.

---

## 🏃 Run Locally

### 1. Install Dependencies

Run from the root directory:

```bash
npm install
```

### 2. Start Services

Run both frontend and backend concurrently:

```bash
npm run dev
```

- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:5000/api

---

## Demo Logins

- Student: `student@nust.edu.pk` / `student123`
- Instructor: `naeem.zafar@nust.edu.pk` / `instructor123`
- Admin: `admin@nust.edu.pk` / `admin123`
