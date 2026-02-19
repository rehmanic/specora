/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            // Proxy API requests to the backend container
            {
                source: "/api/:path*",
                destination: "http://specora-be:5000/api/:path*",
            },
            // Proxy Socket.IO traffic to the backend container
            {
                source: "/socket.io/:path*",
                destination: "http://specora-be:5000/socket.io/:path*",
            },
            // Proxy static file routes served by the backend
            {
                source: "/uploads/:path*",
                destination: "http://specora-be:5000/uploads/:path*",
            },
            {
                source: "/recordings/:path*",
                destination: "http://specora-be:5000/recordings/:path*",
            },
        ];
    },
};

export default nextConfig;