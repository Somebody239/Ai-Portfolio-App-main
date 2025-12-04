
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { PersonalityManager } from "@/managers/PersonalityManager";
import { Loader2 } from "lucide-react";

interface PersonalityQuestionModalProps {
    isOpen: boolean;
    onClose: () => void;
    userId: string;
    question: string;
    initialAnswer?: string;
    onSuccess: () => void;
}

export function PersonalityQuestionModal({
    isOpen,
    onClose,
    userId,
    question,
    initialAnswer = "",
    onSuccess,
}: PersonalityQuestionModalProps) {
    const [answer, setAnswer] = useState(initialAnswer);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const manager = new PersonalityManager();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await manager.saveAnswer(userId, question, answer);
            onSuccess();
            onClose();
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
                    <DialogTitle>Personality Question</DialogTitle>
                    <DialogDescription>
                        Reflect on this question to help us understand you better.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <p className="text-lg font-medium text-white">{question}</p>
                        <Textarea
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            placeholder="Type your answer here..."
                            className="min-h-[150px]"
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
