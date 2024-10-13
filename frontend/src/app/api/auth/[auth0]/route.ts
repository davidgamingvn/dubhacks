// app/api/auth/[auth0]/route.js
import { handleAuth, handleLogin } from "@auth0/nextjs-auth0";

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
export const GET = handleAuth({
  login: handleLogin({
    returnTo: "/home",
  }),
});
