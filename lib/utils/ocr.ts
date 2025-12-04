import Tesseract, { createWorker } from 'tesseract.js';

export interface OCRProgress {
    status: string;
    progress: number;
}

export interface OCRResult {
    text: string;
    confidence: number;
    lines: Array<{
        text: string;
        confidence: number;
        bbox: {
            x0: number;
            y0: number;
            x1: number;
            y1: number;
        };
    }>;
}

/**
 * Extract text from an image file using Tesseract.js OCR
 * @param file - Image file (File or Blob)
 * @param onProgress - Optional progress callback
 * @returns Extracted text with confidence scores
 */
export async function extractTextFromImage(
    file: File | Blob,
    onProgress?: (progress: OCRProgress) => void
): Promise<OCRResult> {
    try {
        // Preprocess image
        const processedFile = await preprocessImage(file as File);

        // Create a worker
        const worker = await createWorker('eng', 1, {
            logger: (m) => {
                if (onProgress && m.status) {
                    onProgress({
                        status: m.status,
                        progress: m.progress || 0,
                    });
                }
            },
        });

        // Perform OCR
        const result = await worker.recognize(file);
        const data = result.data;
        const text = data.text;
        const confidence = data.confidence / 100; // Convert to 0-1

        // Terminate worker
        await worker.terminate();

        // Extract line-level data safely by accessing the raw data
        const rawData = data as any;
        const lines = rawData.lines?.map((line: any) => ({
            text: line.text,
            confidence: line.confidence / 100,
            bbox: line.bbox,
        })) || [];

        return {
            text: text,
            confidence: confidence,
            lines,
        };
    } catch (error) {
        console.error('OCR Error:', error);
        throw new Error(
            error instanceof Error
                ? `OCR failed: ${error.message}`
                : 'OCR failed: Unknown error'
        );
    }
}

/**
 * Preprocess image for better OCR accuracy
 * Converts to grayscale and increases contrast
 */
export async function preprocessImage(file: File): Promise<File> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const reader = new FileReader();

        reader.onload = (e) => {
            img.src = e.target?.result as string;
        };

        reader.onerror = reject;

        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            if (!ctx) {
                resolve(file);
                return;
            }

            canvas.width = img.width;
            canvas.height = img.height;

            // Draw original image
            ctx.drawImage(img, 0, 0);

            // Get image data
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;

            // Apply grayscale and contrast
            // Contrast factor (1.2 = 20% increase)
            const contrast = 1.2;
            const intercept = 128 * (1 - contrast);

            for (let i = 0; i < data.length; i += 4) {
                // Grayscale (weighted average)
                const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;

                // Apply contrast
                let newColor = gray * contrast + intercept;

                // Clamp values
                newColor = Math.min(255, Math.max(0, newColor));

                data[i] = newColor;     // Red
                data[i + 1] = newColor; // Green
                data[i + 2] = newColor; // Blue
                // Alpha remains unchanged
            }

            ctx.putImageData(imageData, 0, 0);

            // Convert back to file
            canvas.toBlob((blob) => {
                if (blob) {
                    const processedFile = new File([blob], file.name, {
                        type: file.type,
                        lastModified: Date.now(),
                    });
                    resolve(processedFile);
                } else {
                    resolve(file);
                }
            }, file.type);
        };

        reader.readAsDataURL(file);
    });
}

/**
 * Validate if file is a supported image type
 */
export function isValidImageFile(file: File): boolean {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    return validTypes.includes(file.type);
}

/**
 * Convert File to base64 string (useful for previews)
 */
export function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}
