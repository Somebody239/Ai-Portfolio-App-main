
import { useState } from "react";
import { Card, Badge } from "@/components/ui/Atoms";
import { PersonalityManager } from "@/managers/PersonalityManager";
import { EssayPrompt } from "@/lib/types";
import { FileText, Copy, Check } from "lucide-react";

export function EssayPromptsSection() {
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const manager = new PersonalityManager();
    const prompts = manager.getEssayPrompts();

    const handleCopy = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <Card className="space-y-6">
            <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-950/30 border border-blue-900/50">
                    <FileText className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-white">Common App Essays</h2>
                    <p className="text-sm text-zinc-500">
                        2024-2025 Prompts. Choose one to write about (650 words).
                    </p>
                </div>
            </div>

            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {prompts.map((prompt, index) => (
                    <div
                        key={prompt.id}
                        className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800 relative group"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <Badge text={`Option ${index + 1}`} variant="neutral" />
                            <button
                                onClick={() => handleCopy(prompt.prompt_text, prompt.id)}
                                className="text-zinc-500 hover:text-white transition-colors"
                                title="Copy prompt"
                            >
                                {copiedId === prompt.id ? (
                                    <Check size={16} className="text-emerald-500" />
                                ) : (
                                    <Copy size={16} />
                                )}
                            </button>
                        </div>
                        <p className="text-sm text-zinc-300 leading-relaxed">
                            {prompt.prompt_text}
                        </p>
                    </div>
                ))}
            </div>
        </Card>
    );
}
