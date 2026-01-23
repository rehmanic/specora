"use client";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertTriangle, Trash2, Info, HelpCircle } from "lucide-react";

/**
 * Confirmation Dialog Component
 * A reusable confirmation dialog built on top of shadcn's AlertDialog
 *
 * @example
 * // Basic usage
 * <Confirmation
 *   open={isOpen}
 *   onOpenChange={setIsOpen}
 *   title="Delete Item"
 *   description="Are you sure you want to delete this item?"
 *   onConfirm={() => handleDelete()}
 * />
 *
 * // With variant
 * <Confirmation
 *   open={isOpen}
 *   onOpenChange={setIsOpen}
 *   title="Delete Account"
 *   description="This action cannot be undone."
 *   variant="destructive"
 *   confirmText="Delete"
 *   onConfirm={() => handleDeleteAccount()}
 * />
 */

const variantConfig = {
    default: {
        icon: HelpCircle,
        iconClassName: "text-primary",
        actionClassName: "",
    },
    destructive: {
        icon: Trash2,
        iconClassName: "text-destructive",
        actionClassName:
            "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    },
    warning: {
        icon: AlertTriangle,
        iconClassName: "text-amber-500",
        actionClassName: "bg-amber-500 text-white hover:bg-amber-600",
    },
    info: {
        icon: Info,
        iconClassName: "text-blue-500",
        actionClassName: "bg-blue-500 text-white hover:bg-blue-600",
    },
};

export function Confirmation({
    open,
    onOpenChange,
    title = "Are you sure?",
    description = "This action cannot be undone.",
    confirmText = "Continue",
    cancelText = "Cancel",
    variant = "default",
    onConfirm,
    onCancel,
    loading = false,
    showIcon = true,
    children,
}) {
    const config = variantConfig[variant] || variantConfig.default;
    const IconComponent = config.icon;

    const handleConfirm = async () => {
        if (onConfirm) {
            await onConfirm();
        }
    };

    const handleCancel = () => {
        if (onCancel) {
            onCancel();
        }
        onOpenChange?.(false);
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            {children}
            <AlertDialogContent className="sm:max-w-[425px]">
                <AlertDialogHeader>
                    <div className="flex items-start gap-4">
                        {showIcon && (
                            <div
                                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted ${config.iconClassName}`}
                            >
                                <IconComponent className="h-5 w-5" />
                            </div>
                        )}
                        <div className="flex flex-col gap-1">
                            <AlertDialogTitle>{title}</AlertDialogTitle>
                            <AlertDialogDescription>{description}</AlertDialogDescription>
                        </div>
                    </div>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={handleCancel} disabled={loading}>
                        {cancelText}
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleConfirm}
                        disabled={loading}
                        className={config.actionClassName}
                    >
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                Processing...
                            </span>
                        ) : (
                            confirmText
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

/**
 * Confirmation Trigger - Use to wrap elements that should open the dialog
 * Re-export of AlertDialogTrigger for convenience
 */
export { AlertDialogTrigger as ConfirmationTrigger } from "@/components/ui/alert-dialog";

export default Confirmation;
