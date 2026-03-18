"use client";

import { useState, useEffect } from 'react';
import { useAppContext, Product } from '@/context/AppProvider';
import { getValue } from '@/lib/i18n';

const LANGUAGES = [
    { code: 'tr', name: 'Türkçe' },
    { code: 'en', name: 'English' },
    { code: 'de', name: 'Deutsch' },
    { code: 'fr', name: 'Français' },
] as const;

export default function AdminProducts() {
    const { products, addProduct, deleteProduct, updateProducts } = useAppContext();
    const [view, setView] = useState<'list' | 'form'>('list');
    const [editId, setEditId] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [activeLang, setActiveLang] = useState<typeof LANGUAGES[number]['code']>('tr');
    const [dynamicCategories, setDynamicCategories] = useState<any[]>([]);

    const markDirty = () => {
        if (typeof window !== 'undefined') (window as any).__adminIsDirty = true;
    };

    useEffect(() => {
        if (typeof window !== 'undefined') (window as any).__adminIsDirty = false;
        const loadCats = async () => {
            try {
                const res = await fetch('/api/data/categories');
                const data = await res.json();
                if (Array.isArray(data)) setDynamicCategories(data);
            } catch (e) {
                console.error(e);
            }
        };
        loadCats();
    }, []);

    const [formData, setFormData] = useState<Partial<Product>>({
        name: { tr: '', en: '', de: '', fr: '' },
        description: { tr: '', en: '', de: '', fr: '' },
        category: 'cerrahi',
        image: '',
        technicalSpecs: { tr: [], en: [], de: [], fr: [] },
        usageAreas: { tr: [], en: [], de: [], fr: [] },
        advantages: { tr: [], en: [], de: [], fr: [] },
        safetyStandards: { tr: [], en: [], de: [], fr: [] },
    });

    const updateArrayField = (field: keyof Product, lang: string, index: number, value: string) => {
        markDirty();
        setFormData(prev => {
            const current = (prev[field] as any)?.[lang] || [];
            const updated = [...current];
            if (index === -1) {
                updated.push(value);
            } else if (value === null) {
                updated.splice(index, 1);
            } else {
                updated[index] = value;
            }
            return {
                ...prev,
                [field]: {
                    ...(prev[field] as any || { tr: [], en: [], de: [], fr: [] }),
                    [lang]: updated
                }
            };
        });
    };

    const handleDelete = async (id: string) => {
        if (confirm('Bu ürünü silmek istediğinize emin misiniz?')) {
            const result = await deleteProduct(id);
            console.log("SAVE RESULT:", result);
            if (result.success) {
                alert('Ürün başarıyla silindi.');
                window.location.reload();
            } else {
                alert('Delete failed: ' + (result.error || 'Unknown error'));
            }
        }
    };

    const handleEdit = (product: Product) => {
        setFormData(product);
        setEditId(product.id);
        setView('form');
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        alert('Yerel dosya yükleme devre dışı bırakıldı. Lütfen Firestore veya harici bir URL kullanın.');
        console.warn('Local uploads are disabled as per new requirements.');
        e.target.value = '';
    };

    const handleRemoveImage = () => {
        setFormData(prev => ({ ...prev, image: "" }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (typeof window !== 'undefined') (window as any).__adminIsDirty = false;

        let result;
        if (editId) {
            const safeProducts = Array.isArray(products) ? products : [];
            const updated = safeProducts.map(p => p.id === editId ? { ...formData, id: editId } as Product : p);
            result = await updateProducts(updated);
        } else {
            result = await addProduct({
                ...formData,
                id: `p-${Date.now()}`
            } as Product);
        }

        console.log("SAVE RESULT:", result);
        if (result.success) {
            alert(editId ? 'Ürün başarıyla güncellendi.' : 'Ürün başarıyla eklendi.');
            window.location.reload();
        } else {
            alert('Save failed: ' + (result.error || 'Unknown error'));
        }

        setView('list');
        resetForm();
    };

    const resetForm = () => {
        setEditId(null);
        setFormData({
            name: { tr: '', en: '', de: '', fr: '' },
            description: { tr: '', en: '', de: '', fr: '' },
            category: 'cerrahi',
            image: '',
            technicalSpecs: { tr: [], en: [], de: [], fr: [] },
            usageAreas: { tr: [], en: [], de: [], fr: [] },
            advantages: { tr: [], en: [], de: [], fr: [] },
            safetyStandards: { tr: [], en: [], de: [], fr: [] },
        });
    };

    if (view === 'form') {
        return (
            <div className="animate-fade-in max-w-4xl mx-auto pb-20">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-extrabold text-dark tracking-tight">
                        {editId ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}
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

                        {/* Image Manager - URL Based */}
                        <div className="flex flex-col mb-4">
                            <label className="block text-sm font-bold tracking-wide text-gray-700 mb-2">
                                Ürün Görsel URL (Örn: https://...)
                            </label>
                            <div className="flex flex-col gap-4">
                                <input
                                    type="text"
                                    placeholder="https://images.unsplash.com/..."
                                    className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none font-medium text-dark shadow-sm"
                                    value={formData.image || ''}
                                    onChange={e => { markDirty(); setFormData({ ...formData, image: e.target.value }); }}
                                />
                                {formData.image && (
                                    <div className="relative group w-32 h-32 rounded-2xl bg-gray-50 border overflow-hidden shadow-sm">
                                        <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                                        <button 
                                            type="button" 
                                            onClick={handleRemoveImage}
                                            className="absolute inset-0 bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center font-bold text-xs"
                                        >
                                            KALDIR
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold tracking-wide text-gray-700 mb-2">Ürün Adı ({activeLang.toUpperCase()})</label>
                                <input
                                    type="text"
                                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none font-medium text-dark shadow-sm"
                                    value={formData.name?.[activeLang] || ''}
                                    onChange={e => { markDirty(); setFormData({ ...formData, name: { ...formData.name!, [activeLang]: e.target.value } }); }}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold tracking-wide text-gray-700 mb-2">Açıklama ({activeLang.toUpperCase()})</label>
                                <textarea
                                    rows={4}
                                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none font-medium text-dark shadow-sm resize-none"
                                    value={formData.description?.[activeLang] || ''}
                                    onChange={e => { markDirty(); setFormData({ ...formData, description: { ...formData.description!, [activeLang]: e.target.value } }); }}
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-gray-100">
                            {/* Array Editor Component Helper */}
                            {[
                                { id: 'technicalSpecs', label: 'Teknik Özellikler' },
                                { id: 'usageAreas', label: 'Kullanım Alanları' },
                                { id: 'advantages', label: 'Avantajlar' },
                                { id: 'safetyStandards', label: 'Güvenlik Standartları' }
                            ].map(field => (
                                <div key={field.id} className="space-y-4">
                                    <label className="block text-sm font-bold tracking-wide text-gray-700">
                                        {field.label} ({activeLang.toUpperCase()})
                                    </label>
                                    <div className="space-y-2">
                                        {((formData as any)[field.id]?.[activeLang] || []).map((item: string, idx: number) => (
                                            <div key={idx} className="flex gap-2">
                                                <input
                                                    type="text"
                                                    className="flex-1 px-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-sm font-medium"
                                                    value={item}
                                                    onChange={e => updateArrayField(field.id as any, activeLang, idx, e.target.value)}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => updateArrayField(field.id as any, activeLang, idx, null as any)}
                                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={() => updateArrayField(field.id as any, activeLang, -1, '')}
                                            className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                                        >
                                            + Yeni Satır Ekle
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="pt-6 border-t border-gray-100">
                            <label className="block text-sm font-bold tracking-wide text-gray-700 mb-2">Kategori</label>
                            <select
                                className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none font-medium text-dark shadow-sm appearance-none"
                                value={formData.category}
                                onChange={e => { markDirty(); setFormData({ ...formData, category: e.target.value }); }}
                            >
                                <option value="">Bir kategori seçin...</option>
                                {dynamicCategories.map(cat => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name?.tr || cat.id}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="pt-4 border-t border-gray-100 flex justify-end">
                            <button type="submit" disabled={uploading} className="btn btn-primary px-10 py-4 w-full md:w-auto text-lg shadow-xl shadow-primary/20 hover:-translate-y-1 font-bold disabled:opacity-50">
                                {editId ? 'Güncelle' : 'Kaydet'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    const safeProducts = Array.isArray(products) ? products : [];

    return (
        <div className="animate-fade-in max-w-7xl mx-auto pb-20">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-extrabold text-dark tracking-tight mb-2">CMS Ürün Yönetimi</h2>
                    <p className="text-gray-500 font-medium">Tüm ürünlerinizi buradan yönetebilirsiniz.</p>
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
                            <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Görsel</th>
                            <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Ürün Adı & Bilgi</th>
                            <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Kategori</th>
                            <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {safeProducts.map(product => (
                            <tr key={product.id} className="hover:bg-gray-50/50 transition-colors group">
                                <td className="px-8 py-4">
                                    <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 overflow-hidden flex items-center justify-center shadow-inner relative">
                                        {product.image && product.image !== '/mock-default.png' ? (
                                            <img src={`${product.image}?t=${Date.now()}`} alt={getValue(product.name, 'tr')} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-3xl opacity-30">📦</span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-8 py-4">
                                    <div className="font-bold text-lg text-dark mb-1">{product.name?.['tr'] || product.id}</div>
                                    <div className="text-sm text-gray-500 max-w-sm truncate">
                                        {product.description?.['tr'] || ''}
                                    </div>
                                </td>
                                <td className="px-8 py-4">
                                    <span className="bg-white border text-primary border-primary/20 text-xs font-bold px-4 py-2 rounded-full shadow-sm tracking-wide uppercase">
                                        {dynamicCategories.find(c => c.id === product.category)?.name?.[activeLang] || 
                                         dynamicCategories.find(c => c.id === product.category)?.name?.tr || 
                                         product.category}
                                    </span>
                                </td>
                                <td className="px-8 py-4 text-right">
                                    <div className="flex gap-2 justify-end">
                                        <button
                                            className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 border border-blue-100 flex items-center justify-center hover:bg-blue-500 hover:text-white transition-all transform hover:scale-110 shadow-sm font-medium"
                                            title="Düzenle"
                                            onClick={() => handleEdit(product)}
                                        >
                                            ✎
                                        </button>
                                        <button
                                            className="w-10 h-10 rounded-xl bg-red-50 text-red-500 border border-red-100 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all transform hover:scale-110 shadow-sm font-medium"
                                            title="Sil"
                                            onClick={() => handleDelete(product.id)}
                                        >
                                            ✕
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {safeProducts.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-8 py-20 text-center text-gray-500 font-medium">
                                    <span className="text-6xl mb-4 block opacity-50">📂</span>
                                    Henüz ürün eklenmemiş. Yeni ürün eklemek için butona tıklayın.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
