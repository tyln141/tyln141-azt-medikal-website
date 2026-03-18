"use client";

import { useState, useEffect } from 'react';
import { getValue } from '@/lib/i18n';

interface Category {
    id: string;
    name: { tr: string; en: string; de: string; fr: string; ar: string };
}

const LANGUAGES = [
    { code: 'tr', name: 'Türkçe' },
    { code: 'en', name: 'English' },
    { code: 'de', name: 'Deutsch' },
    { code: 'fr', name: 'Français' },
    { code: 'ar', name: 'العربية' },
] as const;

export default function AdminCategories() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [view, setView] = useState<'list' | 'form'>('list');
    const [editId, setEditId] = useState<string | null>(null);
    const [activeLang, setActiveLang] = useState<typeof LANGUAGES[number]['code']>('tr');

    const [formData, setFormData] = useState<Partial<Category>>({
        name: { tr: '', en: '', de: '', fr: '', ar: '' }
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const res = await fetch('/api/data/categories');
            const data = await res.json();
            if (Array.isArray(data)) setCategories(data);
        } catch (e) {
            console.error("Failed to load categories", e);
        }
    };

    const saveCategories = async (newCategories: Category[]) => {
        try {
            const res = await fetch('/api/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newCategories)
            });
            const result = await res.json();
            console.log("SAVE RESULT:", result);

            if (result.success) {
                alert('Kategoriler başarıyla kaydedildi');
                window.location.reload();
            } else {
                alert('Save failed: ' + (result.error || 'Unknown error'));
            }
        } catch (e: any) {
            console.error("Failed to save categories", e);
            alert('Kaydedilirken bir hata oluştu');
        }
    };

    const handleDelete = (id: string) => {
        if (confirm('Bu kategoriyi silmek istediğinize emin misiniz?')) {
            saveCategories(categories.filter(c => c.id !== id));
        }
    };

    const handleEdit = (category: Category) => {
        setFormData(category);
        setEditId(category.id);
        setView('form');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Base category save logic
        let newCategories = [];
        if (editId) {
            newCategories = categories.map(c => c.id === editId ? { ...formData, id: editId } as Category : c);
        } else {
            const newId = formData.id || `c-${Date.now()}`;
            newCategories = [...categories, { ...formData, id: newId } as Category];
        }

        await saveCategories(newCategories);
        setView('list');
        resetForm();
    };

    const resetForm = () => {
        setEditId(null);
        setFormData({ name: { tr: '', en: '', de: '', fr: '', ar: '' }});
    };

    if (view === 'form') {
        return (
            <div className="animate-fade-in max-w-4xl mx-auto pb-20">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-extrabold text-dark tracking-tight">
                        {editId ? 'Kategoriyi Düzenle' : 'Yeni Kategori Ekle'}
                    </h2>
                    <button
                        type="button"
                        className="btn btn-outline border-gray-200 text-dark hover:bg-gray-50 bg-white"
                        onClick={() => { setView('list'); resetForm(); }}
                    >
                        İptal
                    </button>
                </div>

                <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Language Tabs */}
                        <div className="flex bg-gray-50 p-1.5 rounded-2xl gap-1">
                            {LANGUAGES.map(lang => (
                                <button
                                    key={lang.code}
                                    type="button"
                                    onClick={() => setActiveLang(lang.code)}
                                    className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all ${activeLang === lang.code
                                        ? 'bg-white text-primary shadow-sm'
                                        : 'text-gray-400 hover:text-gray-600'
                                        }`}
                                >
                                    {lang.name}
                                </button>
                            ))}
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold tracking-wide text-gray-700 mb-2">Kategori ID (Anahtar)</label>
                                <input
                                    type="text"
                                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-primary/10 transition-all outline-none font-medium text-dark shadow-sm"
                                    value={formData.id || ''}
                                    onChange={e => setFormData({ ...formData, id: e.target.value })}
                                    disabled={!!editId}
                                    placeholder="örn: infusion"
                                    required
                                />
                                <p className="text-xs text-gray-500 mt-2 ml-2">Bu ID ürünlerde eşleştirme için kullanılır, değiştirilemez.</p>
                            </div>

                            <div>
                                <label className="block text-sm font-bold tracking-wide text-gray-700 mb-2">Kategori Adı ({activeLang.toUpperCase()})</label>
                                <input
                                    type="text"
                                    
                                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-primary/10 transition-all outline-none font-medium text-dark shadow-sm"
                                    value={formData.name?.[activeLang] || ''}
                                    onChange={e => setFormData({ ...formData, name: { ...formData.name!, [activeLang]: e.target.value } })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="pt-4 border-t border-gray-100 flex justify-end">
                            <button type="submit" className="btn btn-primary px-10 py-4 w-full md:w-auto text-lg shadow-xl shadow-primary/20 hover:-translate-y-1 font-bold">
                                {editId ? 'Güncelle' : 'Kaydet'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="animate-fade-in max-w-7xl mx-auto pb-20">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-extrabold text-dark tracking-tight mb-2">Kategori Yönetimi</h2>
                    <p className="text-gray-500 font-medium">Tüm kategorilerinizi buradan yönetebilirsiniz.</p>
                </div>
                <button
                    className="btn bg-dark text-white shadow-xl hover:-translate-y-1 hover:bg-gray-800 transition-all font-bold px-6 py-3"
                    onClick={() => { resetForm(); setView('form'); }}
                >
                    <span className="text-xl mr-2">+</span> Yeni Ekle
                </button>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                        <tr className="border-b border-gray-100 bg-gray-50/50">
                            <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">ID</th>
                            <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Kategori Adı</th>
                            <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {categories.map(category => (
                            <tr key={category.id} className="hover:bg-gray-50/50 transition-colors group">
                                <td className="px-8 py-4">
                                     <span className="bg-white border text-primary border-primary/20 text-xs font-bold px-4 py-2 rounded-full shadow-sm tracking-wide uppercase">
                                        {category.id}
                                    </span>
                                </td>
                                <td className="px-8 py-4">
                                    <div className="font-bold text-lg text-dark">{getValue(category.name, 'tr') || category.id}</div>
                                </td>
                                <td className="px-8 py-4 text-right">
                                    <div className="flex gap-2 justify-end">
                                        <button
                                            className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 border border-blue-100 flex items-center justify-center hover:bg-blue-500 hover:text-white transition-all transform hover:scale-110 shadow-sm font-medium"
                                            title="Düzenle"
                                            onClick={() => handleEdit(category)}
                                        >
                                            ✎
                                        </button>
                                        <button
                                            className="w-10 h-10 rounded-xl bg-red-50 text-red-500 border border-red-100 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all transform hover:scale-110 shadow-sm font-medium"
                                            title="Sil"
                                            onClick={() => handleDelete(category.id)}
                                        >
                                            ✕
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {categories.length === 0 && (
                            <tr>
                                <td colSpan={3} className="px-8 py-20 text-center text-gray-500 font-medium">
                                    <span className="text-6xl mb-4 block opacity-50">📂</span>
                                    Henüz kategori eklenmemiş. Yeni kategori eklemek için butona tıklayın.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
