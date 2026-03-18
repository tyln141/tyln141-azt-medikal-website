"use client";

import { useState, useEffect } from 'react';

interface Message {
    id: string;
    name: string;
    email: string;
    phone: string;
    message: string;
    productName?: string;
    createdAt: string;
}

export default function AdminMessages() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const res = await fetch('/api/messages');
                const data = await res.json();
                if (Array.isArray(data)) {
                    // Sort by date descending
                    setMessages(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchMessages();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center p-20">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="animate-fade-in max-w-7xl mx-auto pb-20">
            <div className="mb-8">
                <h2 className="text-3xl font-extrabold text-dark tracking-tight mb-2">Gelen Mesajlar</h2>
                <p className="text-gray-500 font-medium">İletişim formundan gelen tüm talepler burada listelenir.</p>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[1000px]">
                        <thead>
                            <tr className="border-b border-gray-100 bg-gray-50/50">
                                <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Tarih</th>
                                <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Gönderen</th>
                                <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">İletişim</th>
                                <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Mesaj</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {messages.map((msg) => (
                                <tr key={msg.id} className="hover:bg-gray-50/30 transition-colors">
                                    <td className="px-8 py-6 align-top">
                                        <div className="text-sm font-bold text-dark">
                                            {new Date(msg.createdAt).toLocaleDateString('tr-TR')}
                                        </div>
                                        <div className="text-xs text-gray-400">
                                            {new Date(msg.createdAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 align-top">
                                        <div className="font-bold text-dark">{msg.name}</div>
                                        {msg.productName && (
                                            <div className="text-xs text-primary font-bold mt-1 uppercase tracking-tighter bg-primary/5 inline-block px-2 py-0.5 rounded-md">
                                                {msg.productName}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-8 py-6 align-top">
                                        <div className="text-sm font-medium text-gray-600">{msg.email}</div>
                                        <div className="text-sm font-medium text-gray-400 mt-1">{msg.phone}</div>
                                    </td>
                                    <td className="px-8 py-6 align-top">
                                        <p className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed max-w-lg">
                                            {msg.message}
                                        </p>
                                    </td>
                                </tr>
                            ))}
                            {messages.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-8 py-20 text-center text-gray-500 font-medium">
                                        <span className="text-6xl mb-4 block opacity-30">📩</span>
                                        Henüz mesaj bulunmuyor.
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
