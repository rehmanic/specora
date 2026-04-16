"use client";

import { useEffect } from "react";
import { toast } from "sonner";

// Keep track of patch outside the component to avoid StrictMode double-patching problems
let isFetchPatched = false;

export function ClientErrorHandler() {
  useEffect(() => {
    // 1. Monkey-patch fetch to globally catch 403 permission required responses 
    // and show a toast, ensuring it appears even if a component catches the error later.
    if (!isFetchPatched && typeof window !== 'undefined') {
      const originalFetch = window.fetch;
      window.fetch = async (...args) => {
        try {
          const response = await originalFetch(...args);
          
          if (response.status === 403) {
            const clonedResponse = response.clone();
            try {
              const data = await clonedResponse.json();
              if (data?.message && data.message.includes("Missing required permissions")) {
                toast.error(data.message);
              }
            } catch (e) {
              // Ignore payload cloning error if response has no JSON body
            }
          }
          
          return response;
        } catch (error) {
          throw error;
        }
      };
      isFetchPatched = true;
    }

    // 2. Prevent unhandled promise rejections from crashing the app (white screen)
    const handleUnhandledRejection = (event) => {
      const error = event.reason || {};
      if (error && error.message && error.message.includes("Missing required permissions")) {
        event.preventDefault(); // Prevent next.js/react from crashing the UI
        // We do not show toast here to avoid double-toasts since the fetch patch handles it
      }
    };

    // 3. Prevent standard errors from crashing the app
    const handleError = (event) => {
      const error = event.error || {};
      if (error && error.message && error.message.includes("Missing required permissions")) {
        event.preventDefault();
      }
    };

    window.addEventListener("unhandledrejection", handleUnhandledRejection);
    window.addEventListener("error", handleError);

    return () => {
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
      window.removeEventListener("error", handleError);
    };
  }, []);

  return null;
}
