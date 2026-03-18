"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from '@/components/Logo';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    return (
        <div className="flex h-screen overflow-hidden bg-gray-50/50">
            <aside className="w-72 flex flex-col bg-white border-r border-gray-100 shadow-soft z-10">
                <div className="p-6 border-b border-gray-100 flex items-center justify-center">
                    <Logo />
                </div>

                <nav className="p-4 flex flex-col gap-2 flex-1">
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-4 mb-2 mt-4">Menü</div>
                    <Link
                        href="/secure-admin-login/dashboard"
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${pathname === '/secure-admin-login/dashboard'
                            ? 'bg-primary/10 text-primary font-bold shadow-sm'
                            : 'text-gray-500 hover:bg-gray-50 hover:text-dark'
                            }`}
                    >
                        <span className="text-xl">📊</span> Dashboard
                    </Link>
                    <Link
                        href="/secure-admin-login/dashboard/products"
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${pathname?.startsWith('/secure-admin-login/dashboard/products')
                            ? 'bg-primary/10 text-primary font-bold shadow-sm'
                            : 'text-gray-500 hover:bg-gray-50 hover:text-dark'
                            }`}
                    >
                        <span className="text-xl">📦</span> Ürün Yönetimi
                    </Link>
                    <Link
                        href="/secure-admin-login/dashboard/categories"
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${pathname?.startsWith('/secure-admin-login/dashboard/categories')
                            ? 'bg-primary/10 text-primary font-bold shadow-sm'
                            : 'text-gray-500 hover:bg-gray-50 hover:text-dark'
                            }`}
                    >
                        <span className="text-xl">🏷️</span> Kategori Yönetimi
                    </Link>
                    <Link
                        href="/secure-admin-login/dashboard/messages"
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${pathname?.startsWith('/secure-admin-login/dashboard/messages')
                            ? 'bg-primary/10 text-primary font-bold shadow-sm'
                            : 'text-gray-500 hover:bg-gray-50 hover:text-dark'
                            }`}
                    >
                        <span className="text-xl">✉️</span> Gelen Mesajlar
                    </Link>
                    <Link
                        href="/secure-admin-login/dashboard/pages"
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${pathname?.startsWith('/secure-admin-login/dashboard/pages')
                            ? 'bg-primary/10 text-primary font-bold shadow-sm'
                            : 'text-gray-500 hover:bg-gray-50 hover:text-dark'
                            }`}
                    >
                        <span className="text-xl">📝</span> Sayfa Düzenleyici
                    </Link>
                    <Link
                        href="/secure-admin-login/dashboard/site-content"
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${pathname?.startsWith('/secure-admin-login/dashboard/site-content')
                            ? 'bg-primary/10 text-primary font-bold shadow-sm'
                            : 'text-gray-500 hover:bg-gray-50 hover:text-dark'
                            }`}
                    >
                        <span className="text-xl">🏠</span> Site İçeriği
                    </Link>
                </nav>

                <div className="p-6 border-t border-gray-100">
                    <Link href="/" className="btn btn-outline w-full py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-50 hover:text-dark border-gray-200 text-gray-500">
                        <span className="text-xl">🚪</span> Siteye Dön
                    </Link>
                </div>
            </aside>

            <main className="flex-1 flex flex-col overflow-y-auto">
                <header className="flex justify-between items-center px-8 py-5 bg-white border-b border-gray-100 sticky top-0 z-10 shadow-sm">
                    <div className="w-80">
                        <input type="text" placeholder="Ara..." className="w-full px-5 py-2.5 bg-gray-50 border border-gray-200 rounded-full focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none font-medium text-dark shadow-inner text-sm" />
                    </div>
                    <div className="flex items-center gap-4 cursor-pointer hover:bg-gray-50 p-1.5 rounded-full pr-4 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent text-white flex items-center justify-center font-bold shadow-md">
                            A
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-sm text-dark">AZT Yönetici</span>
                            <span className="text-xs text-gray-400 font-medium">Sistem Yöneticisi</span>
                        </div>
                        <button
                            onClick={() => {
                                const isDirty = (window as any).__adminIsDirty;
                                if (isDirty) {
                                    const confirmLogout = confirm("Kaydedilmemiş değişiklikleriniz var. Çıkış yapmak istediğinize emin misiniz?");
                                    if (!confirmLogout) return;
                                }
                                document.cookie = "admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
                                window.location.href = "/secure-admin-login";
                            }}
                            className="ml-4 text-xs font-bold text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors border border-red-100"
                        >
                            Çıkış Yap
                        </button>
                    </div>
                </header>

                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
