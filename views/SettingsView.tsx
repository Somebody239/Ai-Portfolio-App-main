
"use client";

import { useState, useEffect } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { SettingsSection } from "@/components/settings/SettingsSection";
import { useUser } from "@/hooks/useUser";
import { UserSettingsManager } from "@/managers/UserSettingsManager";
import { UserSettings } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { toast } from "@/lib/utils/toast";
import { Loader2, Download, Trash2, Bell, Shield, Mail } from "lucide-react";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";

export default function SettingsView() {
    const { user, loading: userLoading } = useUser();
    const [settings, setSettings] = useState<UserSettings | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const manager = new UserSettingsManager();

    useEffect(() => {
        if (user) {
            loadSettings();
        }
    }, [user]);

    const loadSettings = async () => {
        if (!user) return;
        try {
            const data = await manager.getSettings(user.id);
            setSettings(data);
        } catch (error) {
            console.error("Failed to load settings:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (updates: Partial<UserSettings>) => {
        if (!user || !settings) return;
        setSaving(true);
        try {
            const updated = await manager.updateSettings(user.id, updates);
            setSettings(updated);
            toast.success("Settings updated successfully!");
        } catch (error) {
            console.error("Failed to update settings:", error);
            toast.error("Failed to update settings");
        } finally {
            setSaving(false);
        }
    };

    const handleExportData = () => {
        if (!user) return;
        try {
            const dataStr = JSON.stringify({ user, settings }, null, 2);
            const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

            const exportFileDefaultName = 'user_data.json';

            const linkElement = document.createElement('a');
            linkElement.setAttribute('href', dataUri);
            linkElement.setAttribute('download', exportFileDefaultName);
            linkElement.click();

            toast.success("Data exported successfully!");
        } catch (error) {
            toast.error("Failed to export data");
        }
    };

    if (userLoading || loading) {
        return (
            <AppShell>
                <div className="flex h-full min-h-[300px] items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-white" />
                </div>
            </AppShell>
        );
    }

    return (
        <AppShell>
            <div className="max-w-4xl mx-auto space-y-8">
                <Breadcrumbs items={[{ label: "Settings" }]} />
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold text-white tracking-tight">
                        Settings
                    </h1>
                    <p className="text-zinc-400">
                        Manage your account preferences and data.
                    </p>
                </div>

                <div className="space-y-6">
                    <SettingsSection
                        title="Account Information"
                        description="Your basic account details."
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-3 rounded-lg bg-zinc-900/50 border border-zinc-800">
                                <span className="text-xs text-zinc-500 uppercase tracking-wide block mb-1">
                                    Email Address
                                </span>
                                <span className="text-zinc-200">{user?.email}</span>
                            </div>
                            <div className="p-3 rounded-lg bg-zinc-900/50 border border-zinc-800">
                                <span className="text-xs text-zinc-500 uppercase tracking-wide block mb-1">
                                    User ID
                                </span>
                                <span className="text-zinc-500 font-mono text-xs truncate">
                                    {user?.id}
                                </span>
                            </div>
                        </div>
                    </SettingsSection>

                    <SettingsSection
                        title="Notifications"
                        description="Manage how we communicate with you."
                    >
                        <div className="flex items-center justify-between p-4 rounded-lg bg-zinc-900/30 border border-zinc-800">
                            <div className="flex items-center gap-3">
                                <Bell className="text-zinc-400" size={20} />
                                <div>
                                    <p className="text-sm font-medium text-white">Email Notifications</p>
                                    <p className="text-xs text-zinc-500">Receive updates about your portfolio</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => handleUpdate({ notifications_enabled: !settings?.notifications_enabled })}
                                    disabled={saving}
                                    className="h-8 text-xs"
                                >
                                    {settings?.notifications_enabled ? "Enabled" : "Disabled"}
                                </Button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-lg bg-zinc-900/30 border border-zinc-800 mt-4">
                            <div className="flex items-center gap-3">
                                <Mail className="text-zinc-400" size={20} />
                                <div>
                                    <p className="text-sm font-medium text-white">Email Frequency</p>
                                    <p className="text-xs text-zinc-500">How often you want to receive digests</p>
                                </div>
                            </div>
                            <div className="w-32">
                                <Select
                                    value={settings?.email_frequency || "weekly"}
                                    onChange={(e) => handleUpdate({ email_frequency: e.target.value as any })}
                                    options={[
                                        { value: "daily", label: "Daily" },
                                        { value: "weekly", label: "Weekly" },
                                        { value: "never", label: "Never" },
                                    ]}
                                />
                            </div>
                        </div>
                    </SettingsSection>

                    <SettingsSection
                        title="Data & Privacy"
                        description="Manage your data and export options."
                    >
                        <div className="flex items-center justify-between p-4 rounded-lg bg-zinc-900/30 border border-zinc-800">
                            <div className="flex items-center gap-3">
                                <Download className="text-zinc-400" size={20} />
                                <div>
                                    <p className="text-sm font-medium text-white">Export Data</p>
                                    <p className="text-xs text-zinc-500">Download a copy of your data in JSON format</p>
                                </div>
                            </div>
                            <Button variant="outline" onClick={handleExportData}>
                                Download JSON
                            </Button>
                        </div>
                    </SettingsSection>

                    <SettingsSection
                        title="Danger Zone"
                        description="Irreversible actions for your account."
                        danger
                    >
                        <div className="flex items-center justify-between p-4 rounded-lg bg-red-950/20 border border-red-900/30">
                            <div className="flex items-center gap-3">
                                <Trash2 className="text-red-400" size={20} />
                                <div>
                                    <p className="text-sm font-medium text-red-200">Delete Account</p>
                                    <p className="text-xs text-red-400/70">Permanently delete your account and all data</p>
                                </div>
                            </div>
                            <Button variant="destructive" disabled>
                                Delete Account
                            </Button>
                        </div>
                    </SettingsSection>
                </div>
            </div>
        </AppShell>
    );
}
