"use client";

import { toast } from "sonner";
import {
    CircleCheck,
    CircleX,
    AlertTriangle,
    Info,
    Loader2,
} from "lucide-react";

/**
 * Notification utility for displaying toast notifications
 * Uses Sonner under the hood with custom styling
 *
 * @example
 * // Success notification
 * notify.success("Operation completed successfully");
 *
 * // Error notification
 * notify.error("Something went wrong");
 *
 * // Warning notification
 * notify.warning("Please review your input");
 *
 * // Info notification
 * notify.info("New update available");
 *
 * // Loading notification with promise
 * notify.promise(asyncFunction(), {
 *   loading: "Loading...",
 *   success: "Data loaded!",
 *   error: "Failed to load data"
 * });
 *
 * // Custom notification with action
 * notify.success("Item deleted", {
 *   action: {
 *     label: "Undo",
 *     onClick: () => handleUndo()
 *   }
 * });
 */

const defaultOptions = {
    duration: 4000,
    position: "top-right",
};

export const notify = {
    /**
     * Show a success notification
     * @param {string} message - The message to display
     * @param {object} options - Additional options (duration, action, description, etc.)
     */
    success: (message, options = {}) => {
        toast.success(message, {
            ...defaultOptions,
            ...options,
        });
    },

    /**
     * Show an error notification
     * @param {string} message - The message to display
     * @param {object} options - Additional options
     */
    error: (message, options = {}) => {
        toast.error(message, {
            ...defaultOptions,
            duration: 5000, // Errors stay longer
            ...options,
        });
    },

    /**
     * Show a warning notification
     * @param {string} message - The message to display
     * @param {object} options - Additional options
     */
    warning: (message, options = {}) => {
        toast.warning(message, {
            ...defaultOptions,
            ...options,
        });
    },

    /**
     * Show an info notification
     * @param {string} message - The message to display
     * @param {object} options - Additional options
     */
    info: (message, options = {}) => {
        toast.info(message, {
            ...defaultOptions,
            ...options,
        });
    },

    /**
     * Show a loading notification
     * @param {string} message - The message to display
     * @param {object} options - Additional options
     * @returns {string|number} Toast ID for dismissing or updating
     */
    loading: (message, options = {}) => {
        return toast.loading(message, {
            ...defaultOptions,
            duration: Infinity, // Loading stays until dismissed
            ...options,
        });
    },

    /**
     * Handle async operations with loading, success, and error states
     * @param {Promise} promise - The promise to track
     * @param {object} messages - Messages for each state { loading, success, error }
     * @param {object} options - Additional options
     */
    promise: (promise, messages, options = {}) => {
        return toast.promise(promise, messages, {
            ...defaultOptions,
            ...options,
        });
    },

    /**
     * Dismiss a specific toast or all toasts
     * @param {string|number} toastId - Optional toast ID to dismiss
     */
    dismiss: (toastId) => {
        if (toastId) {
            toast.dismiss(toastId);
        } else {
            toast.dismiss();
        }
    },

    /**
     * Show a custom notification with full control
     * @param {string|React.ReactNode} message - The message or component to display
     * @param {object} options - All available options
     */
    custom: (message, options = {}) => {
        toast(message, {
            ...defaultOptions,
            ...options,
        });
    },
};

// Export icons for use in custom notifications
export const NotificationIcons = {
    Success: CircleCheck,
    Error: CircleX,
    Warning: AlertTriangle,
    Info: Info,
    Loading: Loader2,
};

export default notify;
