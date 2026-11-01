# DevTinder frontend

React client for the Node/Express service in `../DevTinder-backend`. The backend stays untouched.

## Local development

1. Start the API: `cd ../DevTinder-backend && pnpm start`
2. Start the client: `cd ../DevTinder-frontend && pnpm dev`
3. Open the localhost URL printed by Vite.

Vite proxies the frontend's root API paths to `http://127.0.0.1:7777`, which is the current backend port. This preserves the backend's cookie-based login locally.

## API integration

All implemented backend endpoints are called from `src/api.js`:

- `POST /signup`, `POST /login`, `POST /logout`
- `GET /profile/view`, `PATCH /profile/edit`
- `GET /feed?page=&limit=`
- `POST /request/send/:status/:toUserId`
- `GET /user/request/received`, `POST /request/review/:status/:requestId`
- `GET /user/connections`

## Deploying separately

Copy `.env.example` to `.env.production` and set `VITE_API_URL` to the deployed backend origin. The frontend sends cookies with every protected API request.

Because the current backend does not configure CORS, a frontend hosted on a different origin will need the deployed backend to allow that frontend origin and credentialed requests. This repository does not make that backend change.
