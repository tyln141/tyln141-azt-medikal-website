"use client";

import { useState, useEffect } from 'react';

type MultilingualText = {
    tr: string;
    en: string;
    de: string;
    fr: string;
};

type Stat = {
    value: string;
    label: MultilingualText;
};

type WhyUsItem = {
    icon: string;
    title: MultilingualText;
    description: MultilingualText;
};

type SiteContent = {
    about: {
        title: MultilingualText;
        description: MultilingualText;
        stats: Stat[];
        image: string;
        imageWidth: string;
        imageHeight: string;
        imageFit: 'cover' | 'contain' | 'fill';
        imagePosition: 'top' | 'center' | 'bottom';
    };
    whyUs: {
        title: MultilingualText;
        items: WhyUsItem[];
    };
};

const languages = [
    { code: 'tr', label: 'Türkçe', flag: '🇹🇷' },
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' }
] as const;

type LangCode = typeof languages[number]['code'];

const emptyMultilingual = (): MultilingualText => ({ tr: '', en: '', de: '', fr: '' });

export default function SiteContentAdmin() {
    const [activeLang, setActiveLang] = useState<LangCode>('tr');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState<SiteContent | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') (window as any).__adminIsDirty = false;
        fetch('/api/site-content')
            .then(res => res.json())
            .then(data => {
                setFormData(data);
                if (typeof window !== 'undefined') (window as any).__adminIsDirty = false;
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to load site content:', err);
                alert('İçerik yüklenemedi');
                setLoading(false);
            });
    }, []);

    const markDirty = () => {
        if (typeof window !== 'undefined') (window as any).__adminIsDirty = true;
    };

    const handleSave = async () => {
        if (!formData) return;
        setSaving(true);
        try {
            const res = await fetch('/api/site-content', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                if (typeof window !== 'undefined') (window as any).__adminIsDirty = false;
                alert('Değişiklikler başarıyla kaydedildi');
            } else {
                throw new Error('Save failed');
            }
        } catch (err) {
            alert('Kaydedilirken bir hata oluştu');
        } finally {
            setSaving(false);
        }
    };

    // About Helpers
    const updateAboutText = (field: 'title' | 'description', lang: LangCode, value: string) => {
        if (!formData) return;
        markDirty();
        setFormData({
            ...formData,
            about: {
                ...formData.about,
                [field]: { ...formData.about[field], [lang]: value }
            }
        });
    };

    const addStat = () => {
        if (!formData) return;
        const newStats = [...formData.about.stats, { value: '', label: emptyMultilingual() }];
        setFormData({ ...formData, about: { ...formData.about, stats: newStats } });
    };

    const removeStat = (index: number) => {
        if (!formData) return;
        const newStats = formData.about.stats.filter((_, i) => i !== index);
        setFormData({ ...formData, about: { ...formData.about, stats: newStats } });
    };

    const updateStat = (index: number, field: 'value' | 'label', value: string | any, lang?: LangCode) => {
        if (!formData) return;
        const newStats = [...formData.about.stats];
        if (field === 'value') {
            newStats[index].value = value;
        } else if (lang) {
            newStats[index].label[lang] = value;
        }
        setFormData({ ...formData, about: { ...formData.about, stats: newStats } });
    };

    // WhyUs Helpers
    const updateWhyUsTitle = (lang: LangCode, value: string) => {
        if (!formData) return;
        setFormData({
            ...formData,
            whyUs: {
                ...formData.whyUs,
                title: { ...formData.whyUs.title, [lang]: value }
            }
        });
    };

    const addWhyUsItem = () => {
        if (!formData) return;
        const newItems = [...formData.whyUs.items, { icon: '⭐', title: emptyMultilingual(), description: emptyMultilingual() }];
        setFormData({ ...formData, whyUs: { ...formData.whyUs, items: newItems } });
    };

    const handleImageUpload = async (file: File, callback: (url: string) => void) => {
        const formDataUpload = new FormData();
        formDataUpload.append('file', file);
        try {
            const res = await fetch('/api/media/upload', {
                method: 'POST',
                body: formDataUpload
            });
            const data = await res.json();
            if (data.url) {
                callback(data.url);
            } else {
                alert('Yükleme başarısız oldu.');
            }
        } catch (err) {
            alert('Görsel yüklenirken bir hata oluştu');
        }
    };

    const updateAboutImage = (url: string) => {
        if (!formData) return;
        markDirty();
        setFormData({ ...formData, about: { ...formData.about, image: url } });
    };

    const updateAboutDimension = (field: 'imageWidth' | 'imageHeight', value: string) => {
        if (!formData) return;
        markDirty();
        setFormData({ ...formData, about: { ...formData.about, [field]: value } });
    };

    const updateAboutStyle = (field: 'imageFit' | 'imagePosition', value: string) => {
        if (!formData) return;
        markDirty();
        setFormData({ ...formData, about: { ...formData.about, [field]: value as any } });
    };

    const updateWhyUsIcon = (index: number, url: string) => {
        if (!formData) return;
        markDirty();
        const newItems = [...formData.whyUs.items];
        newItems[index].icon = url;
        setFormData({ ...formData, whyUs: { ...formData.whyUs, items: newItems } });
    };

    const removeWhyUsItem = (index: number) => {
        if (!formData) return;
        markDirty();
        const newItems = formData.whyUs.items.filter((_, i) => i !== index);
        setFormData({ ...formData, whyUs: { ...formData.whyUs, items: newItems } });
    };

    const updateWhyUsItem = (index: number, field: keyof WhyUsItem, value: string, lang?: LangCode) => {
        if (!formData) return;
        markDirty();
        const newItems = [...formData.whyUs.items];
        if (field === 'icon') {
            newItems[index].icon = value;
        } else if (lang) {
            (newItems[index][field] as MultilingualText)[lang] = value;
        }
        setFormData({ ...formData, whyUs: { ...formData.whyUs, items: newItems } });
    };

    if (loading) return <div className="p-8 text-center font-bold text-gray-500">Yükleniyor...</div>;
    if (!formData) return <div className="p-8 text-center text-red-500">Veri bulunamadı.</div>;

    return (
        <div className="max-w-6xl mx-auto pb-20">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-4xl font-black text-dark tracking-tight">Site İçeriği Düzenleyici</h1>
                    <p className="text-gray-500 font-medium mt-1">Hakkımızda ve Neden Biz bölümlerini yönetin.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-primary hover:bg-primary-dark text-white px-10 py-4 rounded-2xl font-bold shadow-xl shadow-primary/20 transition-all disabled:opacity-50 flex items-center gap-3"
                >
                    {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
                    {!saving && <span>💾</span>}
                </button>
            </div>

            {/* Language Tabs */}
            <div className="flex gap-2 mb-10 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm w-fit">
                {languages.map(lang => (
                    <button
                        key={lang.code}
                        onClick={() => setActiveLang(lang.code)}
                        className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${activeLang === lang.code ? 'bg-primary text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        <span>{lang.flag}</span>
                        {lang.label}
                    </button>
                ))}
            </div>

            <div className="space-y-16">
                {/* ABOUT SECTION */}
                <section className="bg-white rounded-[3rem] p-12 border border-gray-100 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[60px] translate-x-1/2 -translate-y-1/2" />
                    
                    <div className="flex items-center gap-4 mb-10 relative z-10">
                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-2xl text-primary">ℹ️</div>
                        <h2 className="text-3xl font-extrabold text-dark tracking-tight">Hakkımızda Bölümü</h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
                        <div className="space-y-8">
                            <div>
                                <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Başlık ({activeLang})</label>
                                <input
                                    type="text"
                                    value={formData.about.title[activeLang] || ''}
                                    onChange={(e) => updateAboutText('title', activeLang, e.target.value)}
                                    className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-semibold"
                                    placeholder="Bölüm başlığı..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Açıklama ({activeLang})</label>
                                <textarea
                                    rows={6}
                                    value={formData.about.description[activeLang] || ''}
                                    onChange={(e) => updateAboutText('description', activeLang, e.target.value)}
                                    className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-medium leading-relaxed"
                                    placeholder="Hakkımızda metni..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Bölüm Görseli</label>
                                <div 
                                    onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('border-primary'); }}
                                    onDragLeave={(e) => { e.preventDefault(); e.currentTarget.classList.remove('border-primary'); }}
                                    onDrop={(e) => {
                                        e.preventDefault();
                                        e.currentTarget.classList.remove('border-primary');
                                        const file = e.dataTransfer.files[0];
                                        if (file) handleImageUpload(file, updateAboutImage);
                                    }}
                                    className="p-8 bg-gray-50 border-2 border-dashed border-gray-200 rounded-[2rem] flex flex-col items-center justify-center gap-6 group hover:border-primary/30 transition-all cursor-pointer relative"
                                >
                                    {formData.about.image ? (
                                        <div className="space-y-4 w-full">
                                            <div 
                                                className="relative border-4 border-white shadow-2xl rounded-3xl overflow-hidden bg-gray-100 mx-auto transition-all duration-300"
                                                style={{ 
                                                    width: formData.about.imageWidth ? (formData.about.imageWidth.includes('%') || formData.about.imageWidth.includes('px') ? formData.about.imageWidth : `${formData.about.imageWidth}px`) : '100%',
                                                    height: formData.about.imageHeight ? (formData.about.imageHeight.includes('%') || formData.about.imageHeight.includes('px') ? formData.about.imageHeight : `${formData.about.imageHeight}px`) : '400px',
                                                    maxWidth: '100%'
                                                }}
                                            >
                                                <img 
                                                    src={formData.about.image} 
                                                    alt="About preview" 
                                                    className="w-full h-full transition-all duration-300" 
                                                    style={{
                                                        objectFit: formData.about.imageFit || 'cover',
                                                        objectPosition: formData.about.imagePosition || 'center'
                                                    }}
                                                />
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); markDirty(); setFormData({ ...formData, about: { ...formData.about, image: '' } }); }}
                                                    className="absolute top-4 right-4 bg-red-500/80 backdrop-blur-md text-white p-2.5 rounded-xl shadow-xl hover:bg-red-600 transition-all"
                                                >
                                                    🗑️
                                                </button>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Genişlik (px)</label>
                                                    <input 
                                                        type="text" 
                                                        placeholder="Örn: 500 veya %100"
                                                        className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-sm font-medium"
                                                        value={formData.about.imageWidth || ''}
                                                        onChange={(e) => updateAboutDimension('imageWidth', e.target.value)}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Yükseklik (px)</label>
                                                    <input 
                                                        type="text" 
                                                        placeholder="Örn: 400"
                                                        className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-sm font-medium"
                                                        value={formData.about.imageHeight || ''}
                                                        onChange={(e) => updateAboutDimension('imageHeight', e.target.value)}
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-gray-100/50">
                                                <div className="space-y-3">
                                                    <label className="block text-[11px] font-black text-gray-400 uppercase tracking-tighter">Yerleşim (Fit)</label>
                                                    <div className="flex bg-white p-1 rounded-xl border border-gray-100 shadow-sm gap-1">
                                                        {[
                                                            { id: 'cover', label: 'Kırp (Doldur)' },
                                                            { id: 'contain', label: 'Sığdır (Tam)' }
                                                        ].map(fit => (
                                                            <button 
                                                                key={fit.id}
                                                                onClick={(e) => { e.preventDefault(); updateAboutStyle('imageFit', fit.id); }}
                                                                className={`flex-1 py-2 px-3 rounded-lg text-[10px] font-bold transition-all ${formData.about.imageFit === fit.id || (!formData.about.imageFit && fit.id === 'cover') ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'}`}
                                                            >
                                                                {fit.label}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="space-y-3">
                                                    <label className="block text-[11px] font-black text-gray-400 uppercase tracking-tighter">Odak Noktası (Crop)</label>
                                                    <div className="flex bg-white p-1 rounded-xl border border-gray-100 shadow-sm gap-1">
                                                        {[
                                                            { id: 'top', label: 'Üst' },
                                                            { id: 'center', label: 'Orta' },
                                                            { id: 'bottom', label: 'Alt' }
                                                        ].map(pos => (
                                                            <button 
                                                                key={pos.id}
                                                                onClick={(e) => { e.preventDefault(); updateAboutStyle('imagePosition', pos.id); }}
                                                                className={`flex-1 py-2 px-3 rounded-lg text-[10px] font-bold transition-all ${formData.about.imagePosition === pos.id || (!formData.about.imagePosition && pos.id === 'center') ? 'bg-accent text-white shadow-md shadow-accent/20' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'}`}
                                                            >
                                                                {pos.label}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            <p className="text-[10px] text-gray-400 text-center italic mt-2">İpucu: Genişliği boş bırakırsanız otomatik yayılır. Genişlik/Yükseklik için "px" veya "%" kullanabilirsiniz.</p>
                                        </div>
                                    ) : (
                                        <div className="text-center py-6">
                                            <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center text-4xl mb-4 mx-auto group-hover:scale-110 transition-transform">🖼️</div>
                                            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mb-2">Görseli Buraya Sürükleyin</p>
                                            <p className="text-gray-300 text-[9px] mb-4">veya seçmek için tıklayın</p>
                                            <input 
                                                type="file" 
                                                accept="image/*"
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) handleImageUpload(file, updateAboutImage);
                                                }}
                                            />
                                            <button className="bg-primary text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-primary/20 pointer-events-none">
                                                Görsel Seç
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest">İstatistikler</label>
                                <button
                                    onClick={addStat}
                                    className="text-xs font-bold text-primary bg-primary/10 px-4 py-2 rounded-xl hover:bg-primary/20 transition-all font-black uppercase tracking-tighter"
                                >
                                    + İstatistik Ekle
                                </button>
                            </div>
                            <div className="space-y-4">
                                {formData.about.stats.map((stat, idx) => (
                                    <div key={idx} className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100 flex flex-col gap-4 relative group">
                                        <button
                                            onClick={() => removeStat(idx)}
                                            className="absolute -top-3 -right-3 w-8 h-8 bg-white text-red-500 rounded-full flex items-center justify-center shadow-md border border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            ✕
                                        </button>
                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="col-span-1">
                                                <input
                                                    type="text"
                                                    value={stat.value}
                                                    onChange={(e) => updateStat(idx, 'value', e.target.value)}
                                                    className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl focus:border-primary outline-none font-bold"
                                                    placeholder="Değer (ör: 15+)"
                                                />
                                            </div>
                                            <div className="col-span-2">
                                                <input
                                                    type="text"
                                                    value={stat.label[activeLang] || ''}
                                                    onChange={(e) => updateStat(idx, 'label', e.target.value, activeLang)}
                                                    className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl focus:border-primary outline-none font-medium"
                                                    placeholder={`Etiket (${activeLang})`}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {formData.about.stats.length === 0 && (
                                    <div className="text-center py-10 bg-gray-50 rounded-[2rem] border border-dashed border-gray-200 text-gray-400 font-medium font-bold uppercase text-[10px] tracking-widest">
                                        Henüz istatistik eklenmemiş.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* WHY US SECTION */}
                <section className="bg-white rounded-[3rem] p-12 border border-gray-100 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-[60px] translate-x-1/2 -translate-y-1/2" />

                    <div className="flex items-center justify-between mb-10 relative z-10">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center text-2xl text-accent">❓</div>
                            <h2 className="text-3xl font-extrabold text-dark tracking-tight">Neden Biz Bölümü</h2>
                        </div>
                    </div>

                    <div className="mb-12 relative z-10 w-full max-w-2xl">
                        <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Merkezi Başlık ({activeLang})</label>
                        <input
                            type="text"
                            value={formData.whyUs.title[activeLang] || ''}
                            onChange={(e) => updateWhyUsTitle(activeLang, e.target.value)}
                            className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-accent/10 focus:border-accent outline-none transition-all font-semibold"
                            placeholder="Bölüm başlığı..."
                        />
                    </div>

                    <div className="flex justify-between items-center mb-6 relative z-10">
                        <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest">Özellik Kartları</label>
                        <button
                            onClick={addWhyUsItem}
                            className="text-xs font-bold text-accent bg-accent/10 px-4 py-2 rounded-xl hover:bg-accent/20 transition-all font-black uppercase tracking-tighter"
                        >
                            + Kart Ekle
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
                        {formData.whyUs.items.map((item, idx) => (
                            <div key={idx} className="p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100 relative group flex flex-col gap-6">
                                <button
                                    onClick={() => removeWhyUsItem(idx)}
                                    className="absolute -top-3 -right-3 w-8 h-8 bg-white text-red-500 rounded-full flex items-center justify-center shadow-md border border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity z-20"
                                >
                                    ✕
                                </button>

                                <div className="flex flex-col gap-4">
                                    <div 
                                        onClick={() => document.getElementById(`icon-upload-${idx}`)?.click()}
                                        onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('border-accent'); }}
                                        onDragLeave={(e) => { e.preventDefault(); e.currentTarget.classList.remove('border-accent'); }}
                                        onDrop={(e) => {
                                            e.preventDefault();
                                            e.currentTarget.classList.remove('border-accent');
                                            const file = e.dataTransfer.files[0];
                                            if (file) handleImageUpload(file, (url) => updateWhyUsIcon(idx, url));
                                        }}
                                        className="w-full aspect-square bg-white border border-gray-100 rounded-[2rem] flex flex-col items-center justify-center text-2xl shadow-sm outline-none cursor-pointer relative group/icon overflow-hidden border-2 border-dashed border-gray-200 hover:border-accent/30 transition-all font-bold"
                                    >
                                        {item.icon && (item.icon.startsWith('/') || item.icon.startsWith('http')) ? (
                                            <img src={item.icon} alt="icon" className="w-full h-full object-contain p-4" />
                                        ) : (
                                            <span className="text-4xl">{item.icon || '⭐'}</span>
                                        )}
                                        <div className="absolute inset-0 bg-accent/80 opacity-0 group-hover/icon:opacity-100 transition-opacity flex flex-col items-center justify-center text-[10px] text-white font-black uppercase tracking-widest text-center px-2">
                                            <span>Değiştir</span>
                                            <span className="text-[8px] opacity-60 mt-1">Sürükle veya Tıkla</span>
                                        </div>
                                        <input 
                                            id={`icon-upload-${idx}`}
                                            type="file" 
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) handleImageUpload(file, (url) => updateWhyUsIcon(idx, url));
                                            }}
                                        />
                                    </div>
                                    <div className="flex-1 text-center">
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">İkon/Emoji</label>
                                        <input 
                                            type="text" 
                                            value={item.icon} 
                                            onChange={(e) => updateWhyUsItem(idx, 'icon', e.target.value)}
                                            className="w-full bg-white border border-gray-100 rounded-lg py-1 px-2 text-center text-xs font-bold outline-none focus:border-accent"
                                            placeholder="Emoji girin..."
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <input
                                        type="text"
                                        value={item.title[activeLang] || ''}
                                        onChange={(e) => updateWhyUsItem(idx, 'title', e.target.value, activeLang)}
                                        className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl focus:border-accent outline-none font-bold placeholder:text-gray-200"
                                        placeholder={`Başlık (${activeLang})`}
                                    />
                                    <textarea
                                        rows={4}
                                        value={item.description[activeLang] || ''}
                                        onChange={(e) => updateWhyUsItem(idx, 'description', e.target.value, activeLang)}
                                        className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl focus:border-accent outline-none font-medium text-sm leading-relaxed placeholder:text-gray-200"
                                        placeholder={`Açıklama (${activeLang})`}
                                    />
                                    <button 
                                        onClick={() => removeWhyUsItem(idx)}
                                        className="w-full py-4 bg-red-50 text-red-500 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-red-500 hover:text-white transition-all border border-red-100"
                                    >
                                        🗑️ Kartı Kaldır
                                    </button>
                                </div>
                            </div>
                        ))}
                        {formData.whyUs.items.length === 0 && (
                            <div className="col-span-full py-20 text-center bg-gray-50 rounded-[3rem] border border-dashed border-gray-200 text-gray-300 font-bold uppercase tracking-widest text-xs">
                                Neden Biz kartı bulunamadı.
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}
