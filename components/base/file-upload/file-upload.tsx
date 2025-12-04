"use client";

import type { ComponentProps, ComponentPropsWithRef } from "react";
import { useId, useRef, useState } from "react";
import { File, FileText, Image, CheckCircle, Trash2, UploadCloud, XCircle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/base/buttons/button";
import { ButtonUtility } from "@/components/base/buttons/button-utility";
import { ProgressBar } from "@/components/base/progress-indicators/progress-indicators";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { cx } from "@/utils/cx";

/**
 * Returns a human-readable file size.
 * @param bytes - The size of the file in bytes.
 * @returns A string representing the file size in a human-readable format.
 */
export const getReadableFileSize = (bytes: number) => {
    if (bytes === 0) return "0 KB";

    const suffixes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(1024));

    return Math.floor(bytes / Math.pow(1024, i)) + " " + suffixes[i];
};

interface FileUploadDropZoneProps {
    /** The class name of the drop zone. */
    className?: string;
    /**
     * A hint text explaining what files can be dropped.
     */
    hint?: string;
    /**
     * Disables dropping or uploading files.
     */
    isDisabled?: boolean;
    /**
     * Specifies the types of files that the server accepts.
     * Examples: "image/*", ".pdf,image/*", "image/*,video/mpeg,application/pdf"
     */
    accept?: string;
    /**
     * Allows multiple file uploads.
     */
    allowsMultiple?: boolean;
    /**
     * Maximum file size in bytes.
     */
    maxSize?: number;
    /**
     * Callback function that is called with the list of dropped files
     * when files are dropped on the drop zone.
     */
    onDropFiles?: (files: FileList) => void;
    /**
     * Callback function that is called with the list of unaccepted files
     * when files are dropped on the drop zone.
     */
    onDropUnacceptedFiles?: (files: FileList) => void;
    /**
     * Callback function that is called with the list of files that exceed
     * the size limit when files are dropped on the drop zone.
     */
    onSizeLimitExceed?: (files: FileList) => void;
}

export const FileUploadDropZone = ({
    className,
    hint,
    isDisabled,
    accept,
    allowsMultiple = true,
    maxSize,
    onDropFiles,
    onDropUnacceptedFiles,
    onSizeLimitExceed,
}: FileUploadDropZoneProps) => {
    const id = useId();
    const inputRef = useRef<HTMLInputElement>(null);
    const [isInvalid, setIsInvalid] = useState(false);
    const [isDraggingOver, setIsDraggingOver] = useState(false);

    const isFileTypeAccepted = (file: File): boolean => {
        if (!accept) return true;

        // Split the accept string into individual types
        const acceptedTypes = accept.split(",").map((type) => type.trim());

        return acceptedTypes.some((acceptedType) => {
            // Handle file extensions (e.g., .pdf, .doc)
            if (acceptedType.startsWith(".")) {
                const extension = `.${file.name.split(".").pop()?.toLowerCase()}`;
                return extension === acceptedType.toLowerCase();
            }

            // Handle wildcards (e.g., image/*)
            if (acceptedType.endsWith("/*")) {
                const typePrefix = acceptedType.split("/")[0];
                return file.type.startsWith(`${typePrefix}/`);
            }

            // Handle exact MIME types (e.g., application/pdf)
            return file.type === acceptedType;
        });
    };

    const handleDragIn = (event: React.DragEvent<HTMLDivElement>) => {
        if (isDisabled) return;

        event.preventDefault();
        event.stopPropagation();
        setIsDraggingOver(true);
    };

    const handleDragOut = (event: React.DragEvent<HTMLDivElement>) => {
        if (isDisabled) return;

        event.preventDefault();
        event.stopPropagation();
        setIsDraggingOver(false);
    };

    const processFiles = (files: File[]): void => {
        // Reset the invalid state when processing files.
        setIsInvalid(false);

        const acceptedFiles: File[] = [];
        const unacceptedFiles: File[] = [];
        const oversizedFiles: File[] = [];

        // If multiple files are not allowed, only process the first file
        const filesToProcess = allowsMultiple ? files : files.slice(0, 1);

        filesToProcess.forEach((file) => {
            // Check file size first
            if (maxSize && file.size > maxSize) {
                oversizedFiles.push(file);
                return;
            }

            // Then check file type
            if (isFileTypeAccepted(file)) {
                acceptedFiles.push(file);
            } else {
                unacceptedFiles.push(file);
            }
        });

        // Handle oversized files
        if (oversizedFiles.length > 0 && typeof onSizeLimitExceed === "function") {
            const dataTransfer = new DataTransfer();
            oversizedFiles.forEach((file) => dataTransfer.items.add(file));

            setIsInvalid(true);
            onSizeLimitExceed(dataTransfer.files);
        }

        // Handle accepted files
        if (acceptedFiles.length > 0 && typeof onDropFiles === "function") {
            const dataTransfer = new DataTransfer();
            acceptedFiles.forEach((file) => dataTransfer.items.add(file));
            onDropFiles(dataTransfer.files);
        }

        // Handle unaccepted files
        if (unacceptedFiles.length > 0 && typeof onDropUnacceptedFiles === "function") {
            const unacceptedDataTransfer = new DataTransfer();
            unacceptedFiles.forEach((file) => unacceptedDataTransfer.items.add(file));

            setIsInvalid(true);
            onDropUnacceptedFiles(unacceptedDataTransfer.files);
        }

        // Clear the input value to ensure the same file can be selected again
        if (inputRef.current) {
            inputRef.current.value = "";
        }
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        if (isDisabled) return;

        handleDragOut(event);
        processFiles(Array.from(event.dataTransfer.files));
    };

    const handleInputFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        processFiles(Array.from(event.target.files || []));
    };

    return (
        <div
            data-dropzone
            onDragOver={handleDragIn}
            onDragEnter={handleDragIn}
            onDragLeave={handleDragOut}
            onDragEnd={handleDragOut}
            onDrop={handleDrop}
            className={cx(
                "relative flex flex-col items-center gap-3 rounded-xl bg-background px-6 py-4 text-muted-foreground ring-1 ring-border transition duration-100 ease-linear ring-inset",
                isDraggingOver && "ring-2 ring-primary",
                isDisabled && "cursor-not-allowed bg-muted ring-muted",
                className,
            )}
        >
            <FeaturedIcon color="gray" theme="modern" size="md">
                <UploadCloud className="size-5" />
            </FeaturedIcon>

            <div className="flex flex-col gap-1 text-center">
                <div className="flex justify-center gap-1 text-center">
                    <input
                        ref={inputRef}
                        id={id}
                        type="file"
                        className="peer sr-only"
                        disabled={isDisabled}
                        accept={accept}
                        multiple={allowsMultiple}
                        onChange={handleInputFileChange}
                    />
                    <label htmlFor={id} className="flex cursor-pointer">
                        <Button variant="link" size="sm" disabled={isDisabled} onClick={() => inputRef.current?.click()} className="h-auto p-0">
                            Click to upload <span className="md:hidden">and attach files</span>
                        </Button>
                    </label>
                    <span className="text-sm max-md:hidden">or drag and drop</span>
                </div>
                <p className={cx("text-xs transition duration-100 ease-linear", isInvalid && "text-destructive")}>
                    {hint || "SVG, PNG, JPG or GIF (max. 800x400px)"}
                </p>
            </div>
        </div>
    );
};

export interface FileListItemProps {
    /** The name of the file. */
    name: string;
    /** The size of the file. */
    size: number;
    /** The upload progress of the file. */
    progress: number;
    /** Whether the file failed to upload. */
    failed?: boolean;
    /** The type of the file. */
    type?: string;
    /** The class name of the file list item. */
    className?: string;
    /** The function to call when the file is deleted. */
    onDelete?: () => void;
    /** The function to call when the file upload is retried. */
    onRetry?: () => void;
}

export const FileListItemProgressBar = ({ name, size, progress, failed, type, onDelete, onRetry, className }: FileListItemProps) => {
    const isComplete = progress === 100;
    const Icon = type?.includes('image') ? Image : FileText;

    return (
        <motion.li
            layout="position"
            className={cx(
                "relative flex gap-3 rounded-xl bg-background p-4 ring-1 ring-border transition-shadow duration-100 ease-linear ring-inset",
                failed && "ring-2 ring-destructive",
                className,
            )}
        >
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border bg-muted">
                <Icon className="size-5 text-muted-foreground" />
            </div>

            <div className="flex min-w-0 flex-1 flex-col items-start">
                <div className="flex w-full max-w-full min-w-0 flex-1">
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground">{name}</p>

                        <div className="mt-0.5 flex items-center gap-2">
                            <p className="truncate text-sm whitespace-nowrap text-muted-foreground">{getReadableFileSize(size)}</p>

                            <hr className="h-3 w-px rounded-t-full rounded-b-full border-none bg-border" />

                            <div className="flex items-center gap-1">
                                {isComplete && <CheckCircle className="size-4 stroke-[2.5px] text-emerald-600" />}
                                {isComplete && <p className="text-sm font-medium text-emerald-600">Complete</p>}

                                {!isComplete && !failed && <UploadCloud className="size-4 stroke-[2.5px] text-muted-foreground" />}
                                {!isComplete && !failed && <p className="text-sm font-medium text-muted-foreground">Uploading...</p>}

                                {failed && <XCircle className="size-4 text-destructive" />}
                                {failed && <p className="text-sm font-medium text-destructive">Failed</p>}
                            </div>
                        </div>
                    </div>

                    <ButtonUtility icon={Trash2} tooltip="Delete" className="-mt-2 -mr-2 self-start" onClick={onDelete} />
                </div>

                {!failed && (
                    <div className="mt-1 w-full">
                        <ProgressBar labelPosition="right" max={100} min={0} value={progress} />
                    </div>
                )}

                {failed && (
                    <Button variant="link" size="sm" onClick={onRetry} className="mt-1.5 h-auto p-0 text-destructive">
                        Try again
                    </Button>
                )}
            </div>
        </motion.li>
    );
};

const FileUploadRoot = (props: ComponentPropsWithRef<"div">) => (
    <div {...props} className={cx("flex flex-col gap-4", props.className)}>
        {props.children}
    </div>
);

const FileUploadList = (props: ComponentPropsWithRef<"ul">) => (
    <ul {...props} className={cx("flex flex-col gap-3", props.className)}>
        <AnimatePresence initial={false}>{props.children}</AnimatePresence>
    </ul>
);

export const FileUpload = {
    Root: FileUploadRoot,
    List: FileUploadList,
    DropZone: FileUploadDropZone,
    ListItemProgressBar: FileListItemProgressBar,
};
