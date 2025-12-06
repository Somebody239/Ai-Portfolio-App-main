import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/Atoms";
import { Button } from "@/components/ui/Button";
import { EssayManager } from "@/managers/EssayManager";
import { ApplicationEssay } from "@/lib/types";
import { EssayQuestionModal } from "@/components/modals/essays/EssayQuestionModal";
import { EssaySampleModal } from "@/components/modals/essays/EssaySampleModal";
import { FileText, Plus, Trash2, Edit, Sparkles, Edit2 } from "lucide-react";
import { EssayInlineForm } from "./EssayInlineForm";
import { AnimatePresence, motion } from "framer-motion";

interface ApplicationEssaysSectionProps {
    userId: string;
}

export function ApplicationEssaysSection({ userId }: ApplicationEssaysSectionProps) {
    const [essays, setEssays] = useState<ApplicationEssay[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const manager = new EssayManager();

    const loadEssays = useCallback(async () => {
        try {
            const data = await manager.getUserEssays(userId);
            setEssays(data);
        } catch (error) {
            console.error("Failed to load essays:", error);
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        loadEssays();
    }, [loadEssays]);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this essay?")) return;
        try {
            await manager.deleteEssay(id);
            loadEssays();
        } catch (error) {
            console.error("Failed to delete essay:", error);
            alert("Failed to delete essay. Please try again.");
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'complete':
                return 'bg-emerald-950/50 text-emerald-400 border-emerald-800/50';
            case 'reviewing':
                return 'bg-amber-950/50 text-amber-400 border-amber-800/50';
            case 'drafting':
                return 'bg-zinc-800/50 text-zinc-400 border-zinc-700/50';
            default:
                return 'bg-zinc-900/50 text-zinc-500 border-zinc-800/50';
        }
    };

    const getStatusLabel = (status: string) => {
        return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    const handleAddScale = async (data: Partial<ApplicationEssay>) => {
        try {
            await manager.createEssay(
                userId,
                data.question_text || '',
                data.question_source || 'Custom',
                data.word_limit
            );
            await loadEssays();
        } catch (error) { console.error(error); }
    };

    const handleUpdateScale = async (id: string, data: Partial<ApplicationEssay>) => {
        try {
            await manager.updateEssay(id, data);
            await loadEssays();
        } catch (error) { console.error(error); }
    };



    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const [sampleModalEssay, setSampleModalEssay] = useState<ApplicationEssay | null>(null);

    return (
        <Card className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-950/30 border border-emerald-900/50">
                        <FileText className="h-6 w-6 text-emerald-400" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-white">Application Essays</h2>
                        <p className="text-sm text-zinc-500">
                            Add essay questions and get AI assistance
                        </p>
                    </div>
                </div>
                <Button
                    onClick={() => setIsAdding(true)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Essay
                </Button>
            </div>

            <AnimatePresence>
                {isAdding && (
                    <motion.div
                        initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
                        exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    >
                        <EssayInlineForm
                            onSave={async (data) => {
                                await handleAddScale(data);
                                setIsAdding(false);
                            }}
                            onCancel={() => setIsAdding(false)}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {loading ? (
                <div className="text-center py-8 text-zinc-500">
                    Loading essays...
                </div>
            ) : essays.length === 0 ? (
                <div className="text-center py-12">
                    <FileText className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">No essays yet</h3>
                    <p className="text-sm text-zinc-500 mb-6 max-w-md mx-auto">
                        Add your application essay questions - Common App, supplementals, or custom questions.
                    </p>
                    <Button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Your First Essay
                    </Button>
                </div>
            ) : (
                <div className="space-y-4">
                    {essays.map((essay) => (
                        editingId === essay.id ? (
                            <div key={essay.id}>
                                <EssayInlineForm
                                    initialData={essay}
                                    onSave={async (data) => {
                                        await handleUpdateScale(essay.id, data);
                                        setEditingId(null);
                                    }}
                                    onCancel={() => setEditingId(null)}
                                />
                            </div>
                        ) : (
                            <div
                                key={essay.id}
                                className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800 hover:border-zinc-700 transition-colors"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-grow space-y-2">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="px-2 py-1 rounded text-xs font-medium bg-zinc-800/50 text-zinc-400 border border-zinc-700/50">
                                                {essay.question_source}
                                            </span>
                                            <span className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(essay.status)}`}>
                                                {getStatusLabel(essay.status)}
                                            </span>
                                            {essay.word_limit && (
                                                <span className="text-xs text-zinc-500">
                                                    {essay.word_limit} words
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-white line-clamp-2">
                                            {essay.question_text}
                                        </p>
                                        {essay.user_draft && (
                                            <p className="text-xs text-zinc-500 italic line-clamp-1">
                                                Draft: {essay.user_draft.substring(0, 100)}...
                                            </p>
                                        )}

                                        {/* AI Actions */}
                                        <div className="pt-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setSampleModalEssay(essay)}
                                                className="text-amber-400 hover:text-amber-300 hover:bg-amber-900/20 gap-1.5 h-8 px-2"
                                            >
                                                <Sparkles className="w-3.5 h-3.5" />
                                                Get Sample Response
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <button
                                            onClick={() => setEditingId(essay.id)}
                                            className="p-2 rounded-lg text-zinc-500 hover:text-emerald-400 hover:bg-emerald-950/20 transition-colors"
                                            title="Edit"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(essay.id)}
                                            className="p-2 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-950/20 transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )
                    ))}
                </div>
            )}

            <EssayQuestionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                userId={userId}
                onSuccess={() => {
                    loadEssays();
                    setIsModalOpen(false);
                }}
            />

            {sampleModalEssay && (
                <EssaySampleModal
                    isOpen={!!sampleModalEssay}
                    onClose={() => setSampleModalEssay(null)}
                    userId={userId}
                    question={sampleModalEssay.question_text}
                    wordLimit={sampleModalEssay.word_limit}
                />
            )}
        </Card>
    );
}
