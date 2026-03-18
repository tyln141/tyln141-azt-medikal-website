"use client";

import { useEffect, useState } from 'react';

interface Message {
    id: string;
    productName: string;
    name: string;
    phone: string;
    email: string;
    message: string;
    date: string;
}

export default function AdminMessages() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedMsg, setSelectedMsg] = useState<Message | null>(null);
    const [replyText, setReplyText] = useState('');
    const [sending, setSending] = useState(false);

    const loadMessages = () => {
        setLoading(true);
        fetch('/api/messages')
            .then(r => r.json())
            .then(d => {
                if (Array.isArray(d)) setMessages(d);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    };

    useEffect(() => { loadMessages(); }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('Bu mesajı silmek istediğinize emin misiniz?')) return;
        try {
            const res = await fetch(`/api/messages?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                setMessages(prev => prev.filter(m => m.id !== id));
                if (selectedMsg?.id === id) setSelectedMsg(null);
            }
        } catch (e) { alert('Silme hatası'); }
    };

    const handleReply = async () => {
        if (!selectedMsg || !replyText.trim()) return;
        setSending(true);
        try {
            const res = await fetch('/api/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'reply',
                    to: selectedMsg.email,
                    subject: selectedMsg.productName,
                    message: replyText
                })
            });
            if (res.ok) {
                alert('Yanıt başarıyla gönderildi.');
                setReplyText('');
            } else {
                alert('Yanıt gönderilemedi. SMTP ayarlarını kontrol edin.');
            }
        } catch (e) { alert('Hata oluştu'); }
        finally { setSending(false); }
    };

    return (
        <div className="animate-fade-in max-w-7xl mx-auto pb-20">
            <div className="mb-8">
                <h2 className="text-3xl font-extrabold text-dark tracking-tight mb-2">Gelen Mesajlar</h2>
                <p className="text-gray-500 font-medium">Kullanıcı taleplerini yönetin, yanıtlayın veya silin.</p>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden min-h-[400px]">
                {loading ? (
                    <div className="p-12 text-center text-gray-400">Yükleniyor...</div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 divide-x divide-gray-100 h-full">
                        {/* List Area */}
                        <div className="overflow-y-auto max-h-[700px]">
                            {messages.length === 0 ? (
                                <div className="p-12 text-center text-gray-400 font-medium">📭 Mesaj bulunamadı.</div>
                            ) : (
                                <div className="divide-y divide-gray-50">
                                    {messages.map(msg => (
                                        <div 
                                            key={msg.id} 
                                            onClick={() => setSelectedMsg(msg)}
                                            className={`p-6 cursor-pointer transition-all hover:bg-gray-50 group border-l-4 ${selectedMsg?.id === msg.id ? 'bg-primary/5 border-primary' : 'border-transparent'}`}
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                                    {new Date(msg.date).toLocaleDateString('tr-TR')}
                                                </span>
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); handleDelete(msg.id); }}
                                                    className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-500 transition-opacity p-1"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                            <div className="font-bold text-dark truncate mb-1">{msg.name}</div>
                                            <div className="text-xs font-bold text-primary mb-2 line-clamp-1 uppercase tracking-tight">
                                                {msg.productName}
                                            </div>
                                            <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed italic">
                                                "{msg.message || 'Boş mesaj'}"
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Detail Area */}
                        <div className="p-8 bg-gray-50/30 flex flex-col min-h-[500px]">
                            {selectedMsg ? (
                                <div className="flex flex-col h-full animate-fade-in">
                                    <div className="mb-8 border-b border-gray-100 pb-6">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white text-xl font-bold">
                                                {selectedMsg.name[0]}
                                            </div>
                                            <div>
                                                <h3 className="font-extrabold text-xl text-dark tracking-tight">{selectedMsg.name}</h3>
                                                <p className="text-sm text-gray-400 font-medium">{selectedMsg.email} | {selectedMsg.phone}</p>
                                            </div>
                                        </div>
                                        <div className="inline-block bg-white text-primary text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full border border-gray-100 shadow-sm">
                                            Konu: {selectedMsg.productName}
                                        </div>
                                    </div>

                                    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm mb-8 flex-1">
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Mesaj İçeriği</label>
                                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap font-medium">
                                            {selectedMsg.message || 'İçerik belirtilmemiş.'}
                                        </p>
                                    </div>

                                    <div className="mt-auto pt-6 border-t border-gray-100">
                                        <div className="flex justify-between gap-4">
                                            <button 
                                                onClick={() => handleDelete(selectedMsg.id)} 
                                                className="px-6 py-3 rounded-xl bg-red-50 text-red-500 font-bold hover:bg-red-500 hover:text-white transition-all text-sm"
                                            >
                                                Mesajı Sil
                                            </button>
                                            <a 
                                                href={`mailto:${selectedMsg.email}?subject=YNT: ${selectedMsg.productName}&body=Merhaba ${selectedMsg.name},%0D%0A%0D%0A...`}
                                                className="flex-1 btn btn-primary py-4 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:-translate-y-1 transition-all text-center"
                                            >
                                                Yanıtla (E-posta Uygulamasını Aç)
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-center opacity-50 grayscale">
                                    <div className="text-6xl mb-4">📬</div>
                                    <p className="font-bold text-gray-400 uppercase tracking-widest text-sm">Mesaj detaylarını görmek için bir kayıt seçin</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
