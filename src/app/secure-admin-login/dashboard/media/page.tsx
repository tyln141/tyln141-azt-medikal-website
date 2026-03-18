"use client";

import { useState, useEffect } from 'react';

export default function AdminMedia() {
    const [images, setImages] = useState<string[]>([]);
    const [uploading, setUploading] = useState(false);

    const loadImages = () => {
        fetch('/api/media')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setImages(data);
            })
            .catch(e => console.error(e));
    };

    useEffect(() => {
        loadImages();
    }, []);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;

        setUploading(true);
        const file = e.target.files[0];
        const data = new FormData();
        data.append('file', file);

        try {
            const res = await fetch('/api/media/upload', { method: 'POST', body: data });
            const result = await res.json();
            if (result.success) {
                loadImages();
            } else {
                alert('Yükleme başarısız: ' + result.error);
            }
        } catch (err) {
            alert('Yükleme hatası.');
        } finally {
            setUploading(false);
            e.target.value = '';
        }
    };

    const handleDelete = async (url: string) => {
        if (!confirm('Bu görseli silmek istediğinizden emin misiniz?')) return;

        try {
            const res = await fetch('/api/media/delete', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url })
            });
            const result = await res.json();
            if (result.success) {
                loadImages();
            } else {
                alert('Silinemedi: ' + result.error);
            }
        } catch (e) {
            alert('Silme sırasında hata oluştu.');
        }
    };

    return (
        <div className="animate-fade-in max-w-7xl mx-auto pb-20">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-extrabold text-dark tracking-tight mb-2">Medya Yöneticisi</h2>
                    <p className="text-gray-500 font-medium">Sitede kullanılan tüm görselleri yönetin.</p>
                </div>

                <div className="relative">
                    <label className="btn bg-dark text-white font-bold px-6 py-3 rounded-2xl shadow-xl hover:-translate-y-1 hover:bg-gray-800 transition-all cursor-pointer flex items-center gap-2">
                        {uploading ? (
                            <span>Yükleniyor...</span>
                        ) : (
                            <>
                                <span className="text-xl">+</span>
                                <span>Görsel Yükle</span>
                            </>
                        )}
                        <input
                            type="file"
                            accept="image/jpeg, image/png, image/webp, image/svg+xml"
                            className="hidden"
                            onChange={handleUpload}
                            disabled={uploading}
                        />
                    </label>
                </div>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                {images.length === 0 ? (
                    <div className="text-center py-20 text-gray-500 font-medium">
                        <span className="text-6xl mb-4 block opacity-50">🖼️</span>
                        Henüz hiç görsel yüklenmemiş.
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {images.map((url, idx) => (
                            <div key={idx} className="group relative rounded-2xl border border-gray-100 bg-gray-50 overflow-hidden aspect-square shadow-sm hover:shadow-md transition-all">
                                <img src={url} alt="Media" className="w-full h-full object-cover" />

                                <div className="absolute inset-0 bg-dark/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
                                    <button
                                        className="px-4 py-2 bg-white text-dark rounded-xl text-sm font-bold hover:scale-105 transition-transform"
                                        onClick={() => window.open(url, '_blank')}
                                    >
                                        Önizle
                                    </button>
                                    <button
                                        className="px-4 py-2 bg-red-500 text-white rounded-xl text-sm font-bold hover:scale-105 transition-transform"
                                        onClick={() => handleDelete(url)}
                                    >
                                        Sil
                                    </button>
                                </div>

                                <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm px-3 py-2 text-xs font-mono text-gray-500 truncate border-t border-gray-100">
                                    {url.split('/').pop()}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
