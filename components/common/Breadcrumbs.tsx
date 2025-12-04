import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";

interface BreadcrumbItem {
    label: string;
    href?: string;
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
    return (
        <nav className="flex items-center gap-2 text-sm text-zinc-400 mb-6">
            <Link href="/dashboard" className="hover:text-white transition flex items-center">
                <Home size={16} />
            </Link>
            {items.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                    <ChevronRight size={14} className="text-zinc-600" />
                    {item.href ? (
                        <Link href={item.href} className="hover:text-white transition">
                            {item.label}
                        </Link>
                    ) : (
                        <span className="text-white font-medium">{item.label}</span>
                    )}
                </div>
            ))}
        </nav>
    );
}
