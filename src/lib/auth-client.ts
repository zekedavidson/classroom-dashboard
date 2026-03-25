import { createAuthClient } from "better-auth/react"

const rawBaseUrl = import.meta.env.VITE_BACKEND_BASE_URL || "http://localhost:8000";
const authBaseUrl = rawBaseUrl.replace(/\/api\/?$/, "");

export const authClient = createAuthClient({
    baseURL: authBaseUrl
})
