import { toast as sonnerToast } from "sonner";

/**
 * Toast notification utilities
 * Wrapper around sonner for consistent toast notifications
 */
export const toast = {
    success: (message: string, description?: string) => {
        sonnerToast.success(message, { description });
    },

    error: (message: string, description?: string) => {
        sonnerToast.error(message, { description });
    },

    loading: (message: string) => {
        return sonnerToast.loading(message);
    },

    promise: <T,>(
        promise: Promise<T>,
        {
            loading,
            success,
            error,
        }: {
            loading: string;
            success: string | ((data: T) => string);
            error: string | ((error: any) => string);
        }
    ) => {
        return sonnerToast.promise(promise, {
            loading,
            success,
            error,
        });
    },

    dismiss: (toastId?: string | number) => {
        sonnerToast.dismiss(toastId);
    },
};
