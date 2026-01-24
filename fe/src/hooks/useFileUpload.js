import { useState } from "react";
import useAuthStore from "@/store/authStore";

export default function useFileUpload() {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const { token } = useAuthStore();

    const uploadFile = async (file) => {
        setUploading(true);
        setError(null);
        try {
            const formData = new FormData();
            formData.append("file", file);

            const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

            const headers = {};
            if (token) {
                headers.Authorization = `Bearer ${token}`;
            }
            // Note: Content-Type is NOT set here so browser sets multipart/form-data boundary automatically

            const response = await fetch(`${API_BASE}/upload`, {
                method: "POST",
                headers: headers,
                body: formData,
            });

            let data;
            try {
                data = await response.json();
            } catch (e) {
                data = {};
            }

            if (!response.ok) {
                throw new Error(data?.message || "File upload failed");
            }

            return data.data; // Expected { url, filename, ... }
        } catch (err) {
            console.error("Upload failed", err);
            setError(err.message || "File upload failed");
            throw err;
        } finally {
            setUploading(false);
        }
    };

    return { uploadFile, uploading, error };
}
