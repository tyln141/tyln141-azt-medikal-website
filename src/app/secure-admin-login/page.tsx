"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Logo from '@/components/Logo';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (res.ok) {
                window.location.href = "/secure-admin-login/dashboard";
            } else {
                const data = await res.json();
                setError(data.error || 'Giriş başarısız');
            }
        } catch (err) {
            setError('Bir hata oluştu. Lütfen tekrar deneyin.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50/50 p-4">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-soft border border-gray-100 p-8">
                <div className="flex flex-col items-center mb-8">
                    <Logo />
                    <h1 className="mt-6 text-2xl font-extrabold text-dark tracking-tight">AZT Medikal Yönetim</h1>
                    <p className="text-gray-500 text-sm mt-2 text-center">
                        Devam etmek için lütfen giriş yapın
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-600 text-sm font-medium border border-red-100/50 flex items-center gap-3">
                        <span className="text-xl">⚠️</span> {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-dark mb-2 ml-1">
                            E-posta
                        </label>
                        <input
                            type="email"
                            required
                            autoComplete="off"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none font-medium text-dark"
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-dark mb-2 ml-1">
                            Şifre
                        </label>
                        <input
                            type="password"
                            required
                            autoComplete="off"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none font-medium text-dark"
                            disabled={loading}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 px-6 bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white rounded-2xl font-bold tracking-wide transition-all hover:-translate-y-1 shadow-md disabled:opacity-50 disabled:hover:translate-y-0 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
                        {!loading && <span>→</span>}
                    </button>
                </form>
            </div>
        </div>
    );
}
