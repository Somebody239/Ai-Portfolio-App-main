
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { User, CurriculumType } from "@/lib/types";
import { UserProfileManager } from "@/managers/UserProfileManager";
import { toast } from "@/lib/utils/toast";
import { Loader2 } from "lucide-react";

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: User;
    onSuccess: () => void;
}

export function EditProfileModal({
    isOpen,
    onClose,
    user,
    onSuccess,
}: EditProfileModalProps) {
    const [name, setName] = useState(user.name || "");
    const [intendedMajor, setIntendedMajor] = useState(user.intended_major || "");
    const [curriculumType, setCurriculumType] = useState<CurriculumType>(
        user.curriculum_type || null
    );
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const manager = new UserProfileManager();

    useEffect(() => {
        if (isOpen) {
            setName(user.name || "");
            setIntendedMajor(user.intended_major || "");
            setCurriculumType(user.curriculum_type || null);
            setError(null);
        }
    }, [isOpen, user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await manager.updateProfile(user.id, {
                name,
                intended_major: intendedMajor,
                curriculum_type: curriculumType,
            });
            toast.success("Profile updated successfully!");
            onSuccess();
            onClose();
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Failed to update profile";
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                    <DialogDescription>
                        Update your personal information and academic preferences.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="p-3 text-sm text-red-400 bg-red-950/30 border border-red-900/50 rounded-lg">
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-300">Full Name</label>
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. John Doe"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-300">
                            Intended Major
                        </label>
                        <Input
                            value={intendedMajor}
                            onChange={(e) => setIntendedMajor(e.target.value)}
                            placeholder="e.g. Computer Science"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-300">
                            Curriculum Type
                        </label>
                        <Select
                            value={curriculumType || ""}
                            onChange={(e) => setCurriculumType(e.target.value as CurriculumType)}
                            options={[
                                { value: "AP", label: "AP (Advanced Placement)" },
                                { value: "IB", label: "IB (International Baccalaureate)" },
                                { value: "Both", label: "Both AP & IB" },
                            ]}
                        />
                    </div>

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
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Changes"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
