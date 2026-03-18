"use client";

import { useState, useEffect } from 'react';
import { useAppContext } from '@/context/AppProvider';
import { getValue } from '@/lib/i18n';

export default function AdminDashboard() {
    const { products } = useAppContext();
    const totalProducts = products.length;

    const [messages, setMessages] = useState<any[]>([]);

    const [categories, setCategories] = useState<any[]>([]);

    useEffect(() => {
        if (typeof window !== 'undefined') (window as any).__adminIsDirty = false;
        fetch('/api/messages')
            .then(r => r.json())
            .then(d => {
                if (Array.isArray(d)) setMessages(d);
            })
            .catch(e => console.error(e));
            
        fetch('/api/data/categories')
            .then(r => r.json())
            .then(d => {
                if (Array.isArray(d)) setCategories(d);
            })
            .catch(e => console.error(e));
    }, []);

    // Sort products by date (from ID)
    const recentProducts = [...products].sort((a, b) => {
        const timeA = parseInt(a.id.split('-')[1]) || 0;
        const timeB = parseInt(b.id.split('-')[1]) || 0;
        return timeB - timeA;
    }).slice(0, 5);

    return (
        <div className="animate-fade-in max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-dark tracking-tight mb-2">Genel Bakış</h1>
                <p className="text-gray-500 font-medium">Hoş geldiniz, işte genel sistem özeti.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-6 group hover:shadow-md transition-shadow">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                        📦
                    </div>
                    <div>
                        <h3 className="text-3xl font-extrabold text-dark">{totalProducts}</h3>
                        <p className="text-gray-500 text-sm font-medium mt-1">Toplam Ürün</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-6 group hover:shadow-md transition-shadow">
                    <div className="w-16 h-16 rounded-2xl bg-success/10 text-success flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                        ✉️
                    </div>
                    <div>
                        <h3 className="text-3xl font-extrabold text-dark">{messages.length}</h3>
                        <p className="text-gray-500 text-sm font-medium mt-1">Gelen Mesaj</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-6 group hover:shadow-md transition-shadow">
                    <div className="w-16 h-16 rounded-2xl bg-accent/10 text-accent flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                        🏷️
                    </div>
                    <div>
                        <h3 className="text-3xl font-extrabold text-dark">{categories.length}</h3>
                        <p className="text-gray-500 text-sm font-medium mt-1">Aktif Kategori</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/50">
                    <h3 className="text-xl font-bold text-dark">Son Eklenen Ürünler</h3>
                </div>

                <div className="p-0 overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[700px]">
                        <thead>
                            <tr className="border-b border-gray-100 bg-white">
                                <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Ürün Adı</th>
                                <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Kategori</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {recentProducts.map(product => (
                                <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-8 py-4 font-semibold text-dark">
                                        {getValue(product.name, 'tr') || product.id}
                                    </td>
                                    <td className="px-8 py-4">
                                        <span className="bg-primary/5 text-primary text-xs font-bold px-3 py-1.5 rounded-full border border-primary/10 tracking-wide uppercase">
                                            {product.category}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {products.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="px-8 py-12 text-center text-gray-500 font-medium">
                                        Henüz ürün eklenmemiş.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
