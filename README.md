# DevTinder frontend

React frontend for the Express/MongoDB backend in `../DevTinder-backend`.

## Run locally

1. Start the backend: `cd ../DevTinder-backend && pnpm start`
2. Start this app: `pnpm dev`
3. Open the localhost URL Vite prints.

The Vite development proxy routes API calls through the frontend origin, so the backend's `token` cookie works without enabling CORS. To connect to a hosted API instead, set `VITE_API_URL` and configure that server to accept credentialed cross-origin requests.

## Included flows

- Sign up, sign in, and sign out
- Discover feed and send `interested` / `ignore` requests
- Review incoming requests
- Browse accepted connections
- Edit age, gender, about, photo URL, and skills
