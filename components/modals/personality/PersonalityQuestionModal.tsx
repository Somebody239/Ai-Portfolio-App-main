
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { Input } from "@/components/ui/Input";
import { PersonalityManager } from "@/managers/PersonalityManager";
// import { AchievementsManager } from "@/managers/AchievementsManager";
import { Loader2 } from "lucide-react";

interface PersonalityQuestionModalProps {
    isOpen: boolean;
    onClose: () => void;
    userId: string;
    question?: string;
    initialAnswer?: string;
    isCustomQuestion?: boolean;
    onSuccess: () => void;
}

export function PersonalityQuestionModal({
    isOpen,
    onClose,
    userId,
    question = "",
    initialAnswer = "",
    isCustomQuestion = false,
    onSuccess,
}: PersonalityQuestionModalProps) {
    const [customQuestion, setCustomQuestion] = useState("");
    const [answer, setAnswer] = useState(initialAnswer);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            setCustomQuestion("");
            setAnswer(initialAnswer);
            setError(null);
        }
    }, [isOpen, initialAnswer]);

    const manager = new PersonalityManager();
    // const achievementsManager = new AchievementsManager();

    const analyzeTextForAchievements = async (text: string) => {
        try {
            const response = await fetch('/api/ai/analyze-personality', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, text }),
            });

            if (!response.ok) {
                throw new Error('AI analysis failed');
            }

            const data = await response.json();
            return data.count || 0;
        } catch (error) {
            console.error("AI Analysis Error:", error);
            return 0;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const questionToSave = isCustomQuestion ? customQuestion : question;

        if (!questionToSave || questionToSave.trim().length < 10) {
            setError("Question must be at least 10 characters long");
            setLoading(false);
            return;
        }

        if (!answer || answer.trim().length === 0) {
            setError("Answer cannot be empty");
            setLoading(false);
            return;
        }

        try {
            await manager.saveAnswer(userId, questionToSave, answer, isCustomQuestion);

            // Trigger AI Analysis
            const extractedCount = await analyzeTextForAchievements(answer);
            // Achievements are extracted silently - could add toast notification later

            onSuccess();
            onClose();
            setCustomQuestion("");
            setAnswer("");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to save answer");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {isCustomQuestion ? "Add Custom Question" : "Personality Question"}
                    </DialogTitle>
                    <DialogDescription>
                        {isCustomQuestion
                            ? "Create your own question and answer to add to your portfolio."
                            : "Reflect on this question to help us understand you better."}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {isCustomQuestion && (
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-400">
                                Your Question
                            </label>
                            <Input
                                value={customQuestion}
                                onChange={(e) => setCustomQuestion(e.target.value)}
                                placeholder="Enter your question (min 10 characters)..."
                                className="w-full"
                                required
                                minLength={10}
                                maxLength={500}
                            />
                        </div>
                    )}

                    <div className="space-y-2">
                        {!isCustomQuestion && (
                            <p className="text-lg font-medium text-white">{question}</p>
                        )}
                        <label className="block text-sm font-medium mb-2 text-zinc-400">
                            Your Answer *
                        </label>
                        <textarea
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            rows={8}
                            className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
                            placeholder="Type your thoughtful response here... Take your time and express yourself fully."
                            required
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
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Answer"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
