
import { Card } from "@/components/ui/Atoms";

interface SettingsSectionProps {
    title: string;
    description: string;
    children: React.ReactNode;
    danger?: boolean;
}

export function SettingsSection({
    title,
    description,
    children,
    danger = false,
}: SettingsSectionProps) {
    return (
        <Card className={danger ? "border-red-900/50 bg-red-950/10" : ""}>
            <div className="mb-6">
                <h2 className={`text-lg font-semibold ${danger ? "text-red-400" : "text-white"}`}>
                    {title}
                </h2>
                <p className="text-sm text-zinc-500">{description}</p>
            </div>
            <div className="space-y-4">{children}</div>
        </Card>
    );
}
