# DevTinder frontend

React client for the Node/Express service in `../DevTinder-backend`. The backend stays untouched.

## Local development

1. Start the API: `cd ../DevTinder-backend && pnpm start`
2. Start the client: `cd ../DevTinder-frontend && pnpm dev`
3. Open the localhost URL printed by Vite.

Vite proxies frontend `/api/*` requests to `http://127.0.0.1:7777`, which is the current backend port. This preserves the backend's cookie-based login locally.

## API integration

All implemented backend endpoints are called from `src/api.js`:

- `POST /signup`, `POST /login`, `POST /logout`
- `GET /profile/view`, `PATCH /profile/edit`
- `GET /feed?page=&limit=`
- `POST /request/send/:status/:toUserId`
- `GET /user/request/received`, `POST /request/review/:status/:requestId`
- `GET /user/connections`

## Frontend pages

- `/sign-in`, `/sign-up`
- `/discover`, `/requests`, `/connections`, `/profile`

The client pages deliberately avoid `/login` and `/signup`, because those remain backend API routes.

## Deploying separately

Set `VITE_API_URL=/api` before building. The browser then requests `/api/signup`, `/api/login`, and so on; Nginx forwards them to the Node API on port `7777` while removing the `/api` prefix. The frontend sends cookies with every protected API request, without requiring CORS.

`VITE_API_PROXY_TARGET` is for `pnpm dev` only. It does not configure a deployed static build.

For Nginx-hosted single-page-app routing, include `try_files $uri $uri/ /index.html;` in the frontend location so opening or refreshing `/discover` and other client routes still serves the React app.
