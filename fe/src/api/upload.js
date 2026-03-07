import useAuthStore from "@/store/authStore";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export async function uploadFileRequest(file) {
    try {
        const { token } = useAuthStore.getState();
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch(`${API_BASE}/upload`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });

        let responseData;
        try {
            responseData = await res.json();
        } catch (parseError) {
            throw new Error("Server response is invalid parsing upload. Please try again later.");
        }

        if (!res.ok) {
            throw new Error(
                responseData?.message || `File upload failed${res.status ? ` (${res.status})` : ""}`
            );
        }

        return responseData.data?.url;
    } catch (err) {
        if (err instanceof Error) {
            throw err;
        }
        throw new Error(
            err?.message || "Network error. Please check your connection and try again."
        );
    }
}
