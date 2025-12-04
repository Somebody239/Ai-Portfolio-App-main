import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/Atoms";
import { Button } from "@/components/ui/Button";
import { PersonalityManager } from "@/managers/PersonalityManager";
import { PersonalityInput } from "@/lib/types";
import { PersonalityQuestionModal } from "@/components/modals/personality/PersonalityQuestionModal";
import { Brain, CheckCircle2, Circle } from "lucide-react";

interface PersonalitySectionProps {
    userId: string;
}

export function PersonalitySection({ userId }: PersonalitySectionProps) {
    const [answers, setAnswers] = useState<PersonalityInput[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const manager = useState(() => new PersonalityManager())[0];
    const questions = manager.getQuestions();

    const loadAnswers = useCallback(async () => {
        try {
            const data = await manager.getUserAnswers(userId);
            setAnswers(data);
        } catch (error) {
            console.error("Failed to load personality answers:", error);
        } finally {
            setLoading(false);
        }
    }, [userId, manager]);

    useEffect(() => {
        loadAnswers();
    }, [loadAnswers]);

    const getAnswerForQuestion = (question: string) => {
        return answers.find((a) => a.question === question);
    };

    const handleOpenModal = (question: string) => {
        setSelectedQuestion(question);
        setIsModalOpen(true);
    };

    return (
        <Card className="space-y-6">
            <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-950/30 border border-purple-900/50">
                    <Brain className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-white">Personality & Values</h2>
                    <p className="text-sm text-zinc-500">
                        Share your thoughts on &quot;What motivates you?&quot; or other prompts.
                    </p>
                </div>
            </div>

            <div className="space-y-3">
                {questions.map((question, index) => {
                    const answer = getAnswerForQuestion(question);
                    const isAnswered = !!answer;

                    return (
                        <div
                            key={index}
                            className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer group"
                            onClick={() => handleOpenModal(question)}
                        >
                            <div className="flex items-start gap-3">
                                <div className="mt-1">
                                    {isAnswered ? (
                                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                    ) : (
                                        <Circle className="w-5 h-5 text-zinc-600 group-hover:text-zinc-400" />
                                    )}
                                </div>
                                <div className="flex-grow">
                                    <p className={`text-sm font-medium ${isAnswered ? "text-zinc-300" : "text-white"}`}>
                                        {question}
                                    </p>
                                    {isAnswered && answer && (
                                        <p className="mt-2 text-xs text-zinc-500 line-clamp-2 italic">
                                            &quot;{answer.answer}&quot;
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {selectedQuestion && (
                <PersonalityQuestionModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    userId={userId}
                    question={selectedQuestion}
                    initialAnswer={getAnswerForQuestion(selectedQuestion)?.answer}
                    onSuccess={() => {
                        loadAnswers();
                        setIsModalOpen(false);
                    }}
                />
            )}
        </Card>
    );
}
