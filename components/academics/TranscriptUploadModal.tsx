import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { TranscriptParser } from "@/managers/TranscriptParser";
import { TranscriptImporter } from "@/managers/TranscriptImporter";
import { ParsedTranscriptData, TranscriptImportResult } from "@/lib/types";
import { Upload, FileText, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

interface TranscriptUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    userId: string;
    onSuccess: () => void;
}

type UploadStep = 'upload' | 'parsing' | 'review' | 'importing' | 'complete';

export function TranscriptUploadModal({
    isOpen,
    onClose,
    userId,
    onSuccess,
}: TranscriptUploadModalProps) {
    const [step, setStep] = useState<UploadStep>('upload');
    const [file, setFile] = useState<File | null>(null);
    const [parsedData, setParsedData] = useState<ParsedTranscriptData | null>(null);
    const [importResult, setImportResult] = useState<TranscriptImportResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const parser = new TranscriptParser();
    const importer = new TranscriptImporter();

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        // Validate file type
        const validTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
        if (!validTypes.includes(selectedFile.type)) {
            setError("Please upload a PDF, PNG, or JPG file");
            return;
        }

        // Validate file size (10MB max)
        if (selectedFile.size > 10 * 1024 * 1024) {
            setError("File size must be less than 10MB");
            return;
        }

        setFile(selectedFile);
        setError(null);
    };

    const handleUpload = async () => {
        if (!file) return;

        setStep('parsing');
        setError(null);

        try {
            // Read file as text/base64
            const fileReader = new FileReader();
            fileReader.onload = async (e) => {
                const content = e.target?.result as string;

                // Extract text using OCR/Gemini Vision
                const extractedText = await parser.extractTextFromFile(content, file.type);

                // Parse transcript
                const parsed = await parser.parseTranscript(extractedText);
                setParsedData(parsed);

                if (parsed.courses.length === 0) {
                    setError("No courses found in transcript. Please check the file or try manual entry.");
                    setStep('upload');
                    return;
                }

                setStep('review');
            };

            fileReader.readAsDataURL(file);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to parse transcript");
            setStep('upload');
        }
    };

    const handleImport = async () => {
        if (!parsedData) return;

        setStep('importing');
        setError(null);

        try {
            const result = await importer.importCourses(userId, parsedData);
            setImportResult(result);
            setStep('complete');

            // Auto-close and refresh after successful import
            setTimeout(() => {
                onSuccess();
                handleClose();
            }, 2000);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to import courses");
            setStep('review');
        }
    };

    const handleClose = () => {
        setStep('upload');
        setFile(null);
        setParsedData(null);
        setImportResult(null);
        setError(null);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Import Transcript</DialogTitle>
                    <DialogDescription>
                        Upload your transcript (PDF or image) to automatically import your courses
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Upload Step */}
                    {step === 'upload' && (
                        <div className="space-y-4">
                            <div className="border-2 border-dashed border-zinc-700 rounded-xl p-8 text-center hover:border-indigo-500 transition-colors">
                                <input
                                    type="file"
                                    id="transcript-upload"
                                    accept=".pdf,.png,.jpg,.jpeg"
                                    onChange={handleFileSelect}
                                    className="hidden"
                                />
                                <label htmlFor="transcript-upload" className="cursor-pointer">
                                    <Upload className="w-12 h-12 text-zinc-500 mx-auto mb-4" />
                                    <p className="text-white font-medium mb-2">
                                        {file ? file.name : "Click to upload or drag and drop"}
                                    </p>
                                    <p className="text-sm text-zinc-500">
                                        PDF, PNG or JPG (max 10MB)
                                    </p>
                                </label>
                            </div>

                            {error && (
                                <div className="bg-red-950/20 border border-red-800/50 rounded-lg p-3 flex items-start gap-2">
                                    <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                                    <p className="text-sm text-red-400">{error}</p>
                                </div>
                            )}

                            {file && !error && (
                                <Button
                                    onClick={handleUpload}
                                    className="w-full bg-indigo-600 hover:bg-indigo-700"
                                >
                                    <FileText className="w-4 h-4 mr-2" />
                                    Parse Transcript
                                </Button>
                            )}
                        </div>
                    )}

                    {/* Parsing Step */}
                    {step === 'parsing' && (
                        <div className="text-center py-8">
                            <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mx-auto mb-4" />
                            <p className="text-white font-medium mb-2">Parsing transcript...</p>
                            <p className="text-sm text-zinc-500">
                                Using AI to extract courses and grades
                            </p>
                        </div>
                    )}

                    {/* Review Step */}
                    {step === 'review' && parsedData && (
                        <div className="space-y-4">
                            <div className="bg-zinc-900/40 rounded-lg p-4">
                                <h3 className="text-white font-medium mb-2">
                                    Found {parsedData.courses.length} courses
                                </h3>
                                <div className="space-y-2 max-h-64 overflow-y-auto">
                                    {parsedData.courses.slice(0, 10).map((course, i) => (
                                        <div key={i} className="flex justify-between items-center text-sm py-2 border-b border-zinc-800 last:border-0">
                                            <span className="text-white">
                                                {course.name} ({course.year}th)
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-zinc-400">{course.grade}</span>
                                                <span className="text-xs px-2 py-0.5 rounded bg-indigo-950/50 text-indigo-400 border border-indigo-800/50">
                                                    {course.level}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                    {parsedData.courses.length > 10 && (
                                        <p className="text-xs text-zinc-500 text-center pt-2">
                                            ...and {parsedData.courses.length - 10} more
                                        </p>
                                    )}
                                </div>
                            </div>

                            {parsedData.parsingWarnings && parsedData.parsingWarnings.length > 0 && (
                                <div className="bg-amber-950/20 border border-amber-800/50 rounded-lg p-3">
                                    <p className="text-sm text-amber-400 font-medium mb-1">Warnings:</p>
                                    {parsedData.parsingWarnings.map((warning, i) => (
                                        <p key={i} className="text-xs text-amber-400/80">• {warning}</p>
                                    ))}
                                </div>
                            )}

                            <div className="flex gap-3">
                                <Button
                                    onClick={() => setStep('upload')}
                                    variant="ghost"
                                    className="flex-1"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleImport}
                                    className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                                >
                                    Import {parsedData.courses.length} Courses
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Importing Step */}
                    {step === 'importing' && (
                        <div className="text-center py-8">
                            <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mx-auto mb-4" />
                            <p className="text-white font-medium mb-2">Importing courses...</p>
                            <p className="text-sm text-zinc-500">
                                Adding courses to your profile
                            </p>
                        </div>
                    )}

                    {/* Complete Step */}
                    {step === 'complete' && importResult && (
                        <div className="text-center py-8">
                            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
                            <p className="text-white font-medium mb-2">Import complete!</p>
                            <div className="text-sm text-zinc-400 space-y-1">
                                <p>✓ Imported: {importResult.imported.length} courses</p>
                                {importResult.duplicates.length > 0 && (
                                    <p>⊘ Skipped {importResult.duplicates.length} duplicates</p>
                                )}
                                {importResult.errors.length > 0 && (
                                    <p>⚠ {importResult.errors.length} errors</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
