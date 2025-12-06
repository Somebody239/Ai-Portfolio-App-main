import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Loader2, Sparkles, Copy, Check, RefreshCw } from "lucide-react";

interface EssaySampleModalProps {
    isOpen: boolean;
    onClose: () => void;
    userId: string;
    question: string;
    wordLimit?: number;
}

export function EssaySampleModal({
    isOpen,
    onClose,
    userId,
    question,
    wordLimit
}: EssaySampleModalProps) {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<any>(null);
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const generateSample = async () => {
        setLoading(true);
        setError(null);
        try {
            // Client-side timeout to abort fetch if it takes too long (e.g., 65s)
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 65000);

            const response = await fetch('/api/ai/generate-essay-sample', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, question, wordLimit }),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || 'Generation failed');
            }

            const result = await response.json();
            setData(result.result);
        } catch (error: any) {
            console.error("Generation error:", error);
            setError(error.name === 'AbortError' ? 'Request timed out. Please try again.' : 'Failed to generate sample. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen && !data) {
            generateSample();
        }
    }, [isOpen]);

    const handleCopy = () => {
        if (data?.sampleEssay) {
            navigator.clipboard.writeText(data.sampleEssay);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl max-h-[85vh] bg-zinc-950 border-zinc-800 text-white flex flex-col">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <Sparkles className="w-5 h-5 text-indigo-400" />
                        AI Essay Assistant
                    </DialogTitle>
                </DialogHeader>

                <div className="flex-grow overflow-hidden relative">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-64 space-y-4">
                            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                            <p className="text-zinc-400 animate-pulse">Generating personalized sample...</p>
                        </div>
                    ) : data ? (
                        <div className="h-[60vh] overflow-y-auto pr-4 custom-scrollbar">
                            <div className="space-y-6">
                                {/* Sample Essay */}
                                {data.sampleEssay && (
                                    <div className="bg-zinc-900/50 rounded-lg p-6 border border-zinc-800">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="font-semibold text-indigo-300">Sample Response</h3>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={handleCopy}
                                                className="text-zinc-400 hover:text-white"
                                            >
                                                {copied ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
                                                {copied ? "Copied" : "Copy"}
                                            </Button>
                                        </div>
                                        <div className="prose prose-invert prose-sm max-w-none whitespace-pre-wrap text-zinc-300 font-serif leading-relaxed">
                                            {data.sampleEssay}
                                        </div>
                                    </div>
                                )}

                                {/* Outline */}
                                {data.outline && (
                                    <div className="space-y-4">
                                        <h3 className="font-semibold text-emerald-400">Structure & Outline</h3>
                                        <div className="space-y-3 text-sm">
                                            <div className="p-3 bg-zinc-900/30 rounded border border-zinc-800">
                                                <span className="text-emerald-500 font-medium">Hook:</span>
                                                <p className="text-zinc-300 mt-1">{data.outline.hook}</p>
                                            </div>
                                            {data.outline.bodyParagraphs?.map((p: any, i: number) => (
                                                <div key={i} className="p-3 bg-zinc-900/30 rounded border border-zinc-800">
                                                    <span className="text-emerald-500 font-medium">Body {i + 1}: {p.theme}</span>
                                                    <p className="text-zinc-300 mt-1">{p.content}</p>
                                                </div>
                                            ))}
                                            <div className="p-3 bg-zinc-900/30 rounded border border-zinc-800">
                                                <span className="text-emerald-500 font-medium">Conclusion:</span>
                                                <p className="text-zinc-300 mt-1">{data.outline.conclusion}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Tips */}
                                {data.tips && (
                                    <div className="bg-amber-950/20 rounded-lg p-4 border border-amber-900/30">
                                        <h3 className="font-semibold text-amber-400 mb-2">Key Tips</h3>
                                        <ul className="list-disc list-inside text-sm text-amber-200/80 space-y-1">
                                            {data.tips.map((tip: string, i: number) => (
                                                <li key={i}>{tip}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-64 text-zinc-500">
                            <p>{error || "Failed to load data."}</p>
                            <Button variant="ghost" onClick={generateSample} className="mt-2">Retry</Button>
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-zinc-800">
                    <Button variant="outline" onClick={onClose} className="border-zinc-700 hover:bg-zinc-800">
                        Close
                    </Button>
                    {!loading && (
                        <Button onClick={generateSample} className="bg-indigo-600 hover:bg-indigo-700">
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Regenerate
                        </Button>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
