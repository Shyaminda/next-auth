/**
 * An array of public routes that are accessible to all users.
 * These routes do not need authentication.
 * @types {string[]}
 */

export const publicRoutes = ["/"];

/**
 * An array of routes that are used for authentication.
 * These routes will redirect logged in users to /settings
 * @types {string[]}
 */

export const authRoutes = ["/auth/login", "/auth/register"];

/**
 * The prefix for all API routes.
 * Routes that start with this prefix are used for API authentication purposes
 * @types {string}
 */

export const apiAuthPrefix = "/api/auth";

/**
 * The default redirect path after logging in
 * @types {string}
 */

export const DEFAULT_LOGIN_REDIRECT = "/settings";
