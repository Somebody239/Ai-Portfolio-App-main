import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { Input } from "@/components/ui/Input";
import { EssayManager } from "@/managers/EssayManager";
import { Loader2, Sparkles } from "lucide-react";

interface EssayQuestionModalProps {
    isOpen: boolean;
    onClose: () => void;
    userId: string;
    onSuccess: () => void;
}

export function EssayQuestionModal({
    isOpen,
    onClose,
    userId,
    onSuccess,
}: EssayQuestionModalProps) {
    const [question, setQuestion] = useState("");
    const [source, setSource] = useState("Custom");
    const [wordLimit, setWordLimit] = useState<number>(650);
    const [loading, setLoading] = useState(false);
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const manager = new EssayManager();

    const handleAskAI = async () => {
        setIsAiLoading(true);
        // Simulate AI delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        const suggestions = [
            "Describe a topic, idea, or concept you find so engaging that it makes you lose all track of time. Why does it captivate you?",
            "Reflect on a time when you questioned or challenged a belief or idea. What prompted your thinking? What was the outcome?",
            "Share an essay on any topic of your choice. It can be one you've already written, one that responds to a different prompt, or one of your own design."
        ];

        const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
        setQuestion(prev => prev ? `${prev}\n\nAI Suggestion: ${randomSuggestion}` : randomSuggestion);
        setIsAiLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!manager.validateEssayQuestion(question)) {
            setError("Question must be between 10 and 1000 characters");
            setLoading(false);
            return;
        }

        if (wordLimit && !manager.validateWordLimit(wordLimit)) {
            setError("Word limit must be between 1 and 10,000");
            setLoading(false);
            return;
        }

        try {
            await manager.createEssay(userId, question, source, wordLimit);
            onSuccess();
            onClose();
            // Reset form
            setQuestion("");
            setSource("Custom");
            setWordLimit(650);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to save essay question");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Essay Question</DialogTitle>
                    <DialogDescription>
                        Add any application essay question - Common App, supplemental, or custom.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-zinc-400">
                                Essay Question *
                            </label>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={handleAskAI}
                                disabled={isAiLoading || loading}
                                className="h-6 text-xs text-indigo-400 hover:text-indigo-300 hover:bg-indigo-900/20 gap-1.5"
                            >
                                {isAiLoading ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                                Ask AI for Ideas
                            </Button>
                        </div>
                        <Textarea
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            placeholder="Enter your essay question (10-1000 characters)"
                            className="min-h-[100px]"
                            required
                            minLength={10}
                            maxLength={1000}
                        />
                        <p className="text-xs text-zinc-500">
                            {question.length}/1000 characters
                        </p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-400">
                            Source
                        </label>
                        <select
                            value={source}
                            onChange={(e) => setSource(e.target.value)}
                            className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="Custom">Custom</option>
                            <option value="Common App">Common App</option>
                            <option value="Coalition App">Coalition App</option>
                            <option value="UC Application">UC Application</option>
                            <option value="Supplemental">University Supplemental</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-400">
                            Word Limit (Optional)
                        </label>
                        <Input
                            type="number"
                            value={wordLimit}
                            onChange={(e) => setWordLimit(parseInt(e.target.value))}
                            placeholder="650"
                            min={1}
                            max={10000}
                            className="w-full"
                        />
                    </div>

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <div className="flex justify-end gap-3 pt-4">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading} className="min-w-[100px]">
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add Essay"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
