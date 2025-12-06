import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/Atoms";
import { Button } from "@/components/ui/Button";
import { PersonalityManager } from "@/managers/PersonalityManager";
import { PersonalityInput } from "@/lib/types";
import { PersonalityQuestionModal } from "@/components/modals/personality/PersonalityQuestionModal";
import { Brain, CheckCircle2, Circle, Loader2, Sparkles } from "lucide-react";

interface PersonalitySectionProps {
    userId: string;
}

export function PersonalitySection({ userId }: PersonalitySectionProps) {
    const [answers, setAnswers] = useState<PersonalityInput[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedQuestion, setSelectedQuestion] = useState<string>("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [initialAnswer, setInitialAnswer] = useState("");
    const [isCustomQuestion, setIsCustomQuestion] = useState(false);

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
        const answer = getAnswerForQuestion(question);
        setSelectedQuestion(question);
        setInitialAnswer(answer?.answer || "");
        setIsCustomQuestion(false);
        setIsModalOpen(true);
    };

    const handleSuccess = () => {
        loadAnswers();
        setIsModalOpen(false);
        setIsCustomQuestion(false);
    };

    const [analyzingId, setAnalyzingId] = useState<string | null>(null);
    const [analysisResults, setAnalysisResults] = useState<Record<string, any>>({});
    const [error, setError] = useState<string | null>(null);

    const handleAnalyze = async (question: string, answer: string) => {
        setAnalyzingId(question);
        setError(null);
        try {
            // Client-side timeout to abort fetch if it takes too long (e.g., 65s)
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 65000);

            const response = await fetch('/api/ai/analyze-personality', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, text: answer, question }),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || 'Analysis failed');
            }

            const data = await response.json();
            setAnalysisResults(prev => ({
                ...prev,
                [question]: data.analysis
            }));
        } catch (error: any) {
            console.error("Analysis error:", error);
            setError(error.name === 'AbortError' ? 'Request timed out. Please try again.' : 'Failed to analyze. Please try again.');
        } finally {
            setAnalyzingId(null);
        }
    };

    const renderAnalysis = (question: string) => {
        const result = analysisResults[question];
        if (!result) return null;

        return (
            <div className="mt-4 p-4 rounded-lg bg-zinc-900/80 border border-zinc-800 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-start gap-4">
                    {/* Rating Circle */}
                    <div className="relative flex items-center justify-center w-16 h-16 shrink-0">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle
                                cx="32"
                                cy="32"
                                r="28"
                                stroke="currentColor"
                                strokeWidth="4"
                                fill="transparent"
                                className="text-zinc-800"
                            />
                            <circle
                                cx="32"
                                cy="32"
                                r="28"
                                stroke="currentColor"
                                strokeWidth="4"
                                fill="transparent"
                                strokeDasharray={175.93}
                                strokeDashoffset={175.93 - (175.93 * (result.rating || 0)) / 100}
                                className="text-emerald-500 transition-all duration-1000 ease-out"
                            />
                        </svg>
                        <span className="absolute text-sm font-bold text-white">
                            {result.rating || 0}
                        </span>
                    </div>

                    <div className="flex-grow space-y-3">
                        <div>
                            <h4 className="text-sm font-medium text-emerald-400 mb-1">Strengths</h4>
                            <div className="flex flex-wrap gap-2">
                                {result.strengths?.map((s: string, i: number) => (
                                    <span key={i} className="text-xs px-2 py-1 rounded-full bg-emerald-950/30 text-emerald-300 border border-emerald-900/50">
                                        {s}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {result.weaknesses?.length > 0 && (
                            <div>
                                <h4 className="text-sm font-medium text-amber-400 mb-1">Areas for Growth</h4>
                                <div className="flex flex-wrap gap-2">
                                    {result.weaknesses?.map((w: string, i: number) => (
                                        <span key={i} className="text-xs px-2 py-1 rounded-full bg-amber-950/30 text-amber-300 border border-amber-900/50">
                                            {w}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {result.improvements?.length > 0 && (
                            <div>
                                <h4 className="text-sm font-medium text-amber-400 mb-1">AI Suggestions</h4>
                                <ul className="list-disc list-inside text-xs text-zinc-400 space-y-1">
                                    {result.improvements?.map((imp: string, i: number) => (
                                        <li key={i}>{imp}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <Card className="space-y-6">
            <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-950/30 border border-amber-900/50">
                    <Brain className="h-6 w-6 text-amber-400" />
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
                        <div key={index} className="group">
                            <div
                                className="relative p-4 rounded-xl bg-zinc-900/40 border border-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer pr-16"
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

                                {/* Absolute positioned Analyze actions */}
                                {isAnswered && answer && (
                                    <div className="absolute top-4 right-4" onClick={(e) => e.stopPropagation()}>
                                        {analysisResults[question] ? (
                                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-950/50 border border-emerald-900/50 text-emerald-400" title="Analysis Ready">
                                                <Sparkles className="w-4 h-4" />
                                            </div>
                                        ) : analyzingId === question ? (
                                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-950/50 border border-amber-900/50">
                                                <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => handleAnalyze(question, answer.answer)}
                                                className="flex items-center justify-center w-8 h-8 rounded-full bg-zinc-800 hover:bg-amber-900/40 border border-zinc-700 hover:border-amber-500/50 text-zinc-400 hover:text-amber-400 transition-all"
                                                title="Analyze with AI"
                                            >
                                                <Sparkles className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Analysis Section Results Display (keep below content) */}
                            {isAnswered && answer && analysisResults[question] && (
                                <div className="px-4 pb-2">
                                    {renderAnalysis(question)}
                                </div>
                            )}
                            {/* Error display if any */}
                            {isAnswered && answer && error && analyzingId === null && !analysisResults[question] && (
                                <div className="px-4 pb-2 text-xs text-red-400 pl-12">
                                    {error}
                                </div>
                            )}
                        </div>
                    );
                })}

                {/* Render Custom Questions */}
                {/* Render Custom Questions */}
                {answers
                    .filter(a => a.is_custom)
                    .map((answer, index) => (
                        <div key={`custom-${index}`} className="group">
                            <div
                                className="relative p-4 rounded-xl bg-zinc-900/40 border border-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer pr-16"
                                onClick={() => handleOpenModal(answer.question)}
                            >
                                <div className="flex items-start gap-3">
                                    <div className="mt-1">
                                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                    </div>
                                    <div className="flex-grow">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs font-medium text-emerald-400 bg-emerald-950/30 px-2 py-0.5 rounded-full border border-emerald-900/50">
                                                Custom
                                            </span>
                                        </div>
                                        <p className="text-sm font-medium text-zinc-300">
                                            {answer.question}
                                        </p>
                                        <p className="mt-2 text-xs text-zinc-500 line-clamp-2 italic">
                                            &quot;{answer.answer}&quot;
                                        </p>
                                    </div>
                                </div>

                                {/* Absolute positioned Analyze actions */}
                                <div className="absolute top-4 right-4" onClick={(e) => e.stopPropagation()}>
                                    {analysisResults[answer.question] ? (
                                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-950/50 border border-emerald-900/50 text-emerald-400" title="Analysis Ready">
                                            <Sparkles className="w-4 h-4" />
                                        </div>
                                    ) : analyzingId === answer.question ? (
                                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-950/50 border border-amber-900/50">
                                            <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => handleAnalyze(answer.question, answer.answer)}
                                            className="flex items-center justify-center w-8 h-8 rounded-full bg-zinc-800 hover:bg-amber-900/40 border border-zinc-700 hover:border-amber-500/50 text-zinc-400 hover:text-amber-400 transition-all"
                                            title="Analyze with AI"
                                        >
                                            <Sparkles className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Analysis Section Results Display */}
                            {analysisResults[answer.question] && (
                                <div className="px-4 pb-2">
                                    {renderAnalysis(answer.question)}
                                </div>
                            )}
                        </div>
                    ))}
            </div>

            {/* Custom Question Button */}
            <button
                onClick={() => {
                    setSelectedQuestion("");
                    setInitialAnswer("");
                    setIsCustomQuestion(true);
                    setIsModalOpen(true);
                }}
                className="w-full py-3 px-4 border-2 border-dashed border-zinc-700 hover:border-emerald-500/50 bg-zinc-900/30 hover:bg-zinc-900/50 rounded-xl text-zinc-400 hover:text-emerald-400 transition-all duration-200 flex items-center justify-center gap-2 group"
            >
                <span className="text-xl">+</span>
                <span className="font-medium">Add Custom Question</span>
            </button>

            <PersonalityQuestionModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setIsCustomQuestion(false);
                }}
                userId={userId}
                question={selectedQuestion}
                initialAnswer={initialAnswer}
                isCustomQuestion={isCustomQuestion}
                onSuccess={handleSuccess}
            />
        </Card>
    );
}
