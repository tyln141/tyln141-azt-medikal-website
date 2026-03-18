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
    isRead: boolean;
}

export default function AdminMessages() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedMsg, setSelectedMsg] = useState<Message | null>(null);

    const fetchMessages = async () => {
        try {
            const res = await fetch('/api/messages');
            const data = await res.json();
            if (Array.isArray(data)) {
                setMessages(data);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    const handleRead = async (msg: Message) => {
        setSelectedMsg(msg);
        if (!msg.isRead) {
            try {
                await fetch('/api/messages', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: msg.id, isRead: true })
                });
                // Update local state without full refetch for speed
                setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, isRead: true } : m));
            } catch (e) {
                console.error(e);
            }
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Bu mesajı silmek istediğinize emin misiniz?')) return;
        try {
            const res = await fetch(`/api/messages?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                setMessages(prev => prev.filter(m => m.id !== id));
                if (selectedMsg?.id === id) setSelectedMsg(null);
            }
        } catch (e) {
            console.error(e);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-20">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const unreadCount = messages.filter(m => !m.isRead).length;

    return (
        <div className="animate-fade-in max-w-7xl mx-auto pb-20">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h2 className="text-3xl font-extrabold text-dark tracking-tight mb-2">Gelen Mesajlar</h2>
                    <p className="text-gray-500 font-medium">Müşterilerinizden gelen tüm talepleri buradan yönetin.</p>
                </div>
                {unreadCount > 0 && (
                    <div className="bg-red-500 text-white px-4 py-2 rounded-2xl font-bold text-sm shadow-lg shadow-red-200 animate-bounce">
                        {unreadCount} Okunmamış Mesaj
                    </div>
                )}
            </div>

            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[900px]">
                        <thead>
                            <tr className="border-b border-gray-100 bg-gray-50/50">
                                <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest w-20">Durum</th>
                                <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Tarih</th>
                                <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Gönderen</th>
                                <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Mesaj Özeti</th>
                                <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {messages.map((msg) => (
                                <tr 
                                    key={msg.id} 
                                    className={`hover:bg-gray-50/30 transition-colors cursor-pointer ${!msg.isRead ? 'bg-primary/5' : ''}`}
                                    onClick={() => handleRead(msg)}
                                >
                                    <td className="px-8 py-6">
                                        {!msg.isRead ? (
                                            <span className="w-3 h-3 bg-primary rounded-full block shadow-sm shadow-primary/40 animate-pulse"></span>
                                        ) : (
                                            <span className="w-3 h-3 bg-gray-200 rounded-full block focus-within:"></span>
                                        )}
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className={`text-sm tracking-tight ${!msg.isRead ? 'font-bold text-dark' : 'text-gray-500'}`}>
                                            {new Date(msg.createdAt).toLocaleDateString('tr-TR')}
                                        </div>
                                        <div className="text-[10px] text-gray-400 uppercase font-bold mt-0.5">
                                            {new Date(msg.createdAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className={`text-base ${!msg.isRead ? 'font-bold text-dark' : 'font-medium text-gray-600'}`}>{msg.name}</div>
                                        <div className="text-xs text-gray-400">{msg.email}</div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <p className="text-sm text-gray-500 truncate max-w-xs font-medium">
                                            {msg.message}
                                        </p>
                                    </td>
                                    <td className="px-8 py-6 text-right" onClick={e => e.stopPropagation()}>
                                        <div className="flex gap-2 justify-end">
                                            <button 
                                                onClick={() => handleRead(msg)}
                                                className="w-10 h-10 rounded-xl bg-gray-50 text-dark flex items-center justify-center hover:bg-white hover:shadow-md transition-all font-bold border border-transparent hover:border-gray-100"
                                            >
                                                👁
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(msg.id)}
                                                className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all font-bold"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {messages.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-8 py-24 text-center text-gray-500 font-medium">
                                        <div className="text-7xl mb-6 opacity-20">📥</div>
                                        <div className="text-xl font-bold text-dark mb-1">Kutu Boş</div>
                                        Henüz mesaj bulunmuyor.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Message Detail Modal */}
            {selectedMsg && (
                <div className="fixed inset-0 bg-dark/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in" onClick={() => setSelectedMsg(null)}>
                    <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-scale-in" onClick={e => e.stopPropagation()}>
                        <div className="p-10 md:p-14">
                            <div className="flex justify-between items-start mb-10">
                                <div>
                                    <h3 className="text-3xl font-black text-dark tracking-tight mb-2">{selectedMsg.name}</h3>
                                    <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">
                                        {new Date(selectedMsg.createdAt).toLocaleString('tr-TR')}
                                    </p>
                                </div>
                                <button onClick={() => setSelectedMsg(null)} className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-all font-bold text-xl">✕</button>
                            </div>

                            <div className="space-y-8">
                                <div className="grid grid-cols-2 gap-6 pb-8 border-b border-gray-100">
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">E-Posta</label>
                                        <a href={`mailto:${selectedMsg.email}`} className="text-primary font-bold hover:underline">{selectedMsg.email}</a>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Telefon</label>
                                        <span className="text-dark font-bold">{selectedMsg.phone || '-'}</span>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Mesaj İçeriği</label>
                                    <div className="bg-gray-50 p-8 rounded-3xl text-gray-600 font-medium leading-relaxed whitespace-pre-wrap min-h-[150px]">
                                        {selectedMsg.message}
                                    </div>
                                </div>

                                <div className="pt-8 flex gap-4">
                                    <a 
                                        href={`mailto:${selectedMsg.email}?subject=AZT Medikal İletişim&body=Sayın ${selectedMsg.name},%0D%0A%0D%0A`}
                                        className="flex-1 btn btn-primary py-5 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                                    >
                                        <span>✉</span> Yanıtla (E-posta)
                                    </a>
                                    <button 
                                        onClick={() => handleDelete(selectedMsg.id)}
                                        className="btn btn-outline border-red-100 text-red-500 hover:bg-red-500 hover:text-white px-8 py-5 rounded-2xl font-bold"
                                    >
                                        Sil
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
