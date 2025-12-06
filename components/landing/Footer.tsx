"use client";

import Link from "next/link";

export function Footer() {
    return (
        <footer className="relative w-full border-t border-zinc-800 bg-black py-12">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid gap-8 md:grid-cols-3">
                    {/* Brand */}
                    <div>
                        <h3 className="mb-4 text-xl font-bold text-white">Path2Uni</h3>
                        <p className="text-sm text-zinc-400">
                            AI-powered university application portfolio management for ambitious students.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-400">
                            Quick Links
                        </h4>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    href="/login"
                                    className="text-sm text-zinc-400 transition-colors hover:text-white"
                                >
                                    Get Started
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/login"
                                    className="text-sm text-zinc-400 transition-colors hover:text-white"
                                >
                                    Features
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/login"
                                    className="text-sm text-zinc-400 transition-colors hover:text-white"
                                >
                                    Sign In
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Connect */}
                    <div>
                        <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-400">
                            Connect
                        </h4>
                        <p className="text-sm text-zinc-400">
                            Have questions? We&apos;re here to help you succeed.
                        </p>
                    </div>
                </div>

                <div className="mt-12 border-t border-zinc-800 pt-8 text-center">
                    <p className="text-xs text-zinc-500 font-mono">
                        © {new Date().getFullYear()} Path2Uni. Powered by AI, built for students.
                    </p>
                </div>
            </div>
        </footer>
    );
}
