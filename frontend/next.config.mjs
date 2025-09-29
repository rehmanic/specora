/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/dashboard",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

/* ---------------------------- COMMENTS ---------------------------- */
// Use false for 307 Temporary Redirect, true for 308 Permanent Redirect
// Use false while testing or if the redirect could change.
// Use true in production if this is a permanent rule (e.g., your homepage should always be /login).
