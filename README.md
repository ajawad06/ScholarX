# ScholarX MERN

ScholarX is now structured as a MERN-style project with:

- `client/`: React + Vite frontend.
- `server/`: Express API backend.
- `public/uploads/`: existing uploaded/static assets served by Express.
- `sql/`: old SQL dump kept only as a database reference for the next migration step.

The PHP pages have been removed from the running app. The current API uses an in-memory data store seeded with the original sample records so every page can be developed and tested before MongoDB is connected.

## Run Locally

```bash
npm install
npm run dev
```

Frontend: http://localhost:5173

Backend: http://localhost:5000/api/health

## Demo Logins

- Student: `student@nust.edu.pk` / `student123`
- Instructor: `naeem.zafar@nust.edu.pk` / `instructor123`

## Next Step

Replace `server/src/data/memoryStore.js` with MongoDB/Mongoose models and keep the route contracts stable.
