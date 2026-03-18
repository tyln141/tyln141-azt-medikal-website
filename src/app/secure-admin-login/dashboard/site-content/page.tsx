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

    const fetchData = () => {
        setLoading(true);
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
    };

    useEffect(() => {
        if (typeof window !== 'undefined') (window as any).__adminIsDirty = false;
        fetchData();
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
            const result = await res.json();
            console.log("SAVE RESULT:", result);

            if (result.success) {
                if (typeof window !== 'undefined') (window as any).__adminIsDirty = false;
                alert('Değişiklikler başarıyla kaydedildi');
                window.location.reload();
            } else {
                alert('Save failed: ' + (result.error || 'Unknown error'));
            }
        } catch (err: any) {
            console.error("SAVE ERROR:", err);
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
        markDirty();
        const newStats = [...formData.about.stats, { value: '', label: emptyMultilingual() }];
        setFormData({ ...formData, about: { ...formData.about, stats: newStats } });
    };

    const removeStat = (index: number) => {
        if (!formData) return;
        markDirty();
        const newStats = formData.about.stats.filter((_, i) => i !== index);
        setFormData({ ...formData, about: { ...formData.about, stats: newStats } });
    };

    const updateStat = (index: number, field: 'value' | 'label', value: string | any, lang?: LangCode) => {
        if (!formData) return;
        markDirty();
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
        markDirty();
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
        markDirty();
        const newItems = [...formData.whyUs.items, { icon: '⭐', title: emptyMultilingual(), description: emptyMultilingual() }];
        setFormData({ ...formData, whyUs: { ...formData.whyUs, items: newItems } });
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

    const removeWhyUsItem = (index: number) => {
        if (!formData) return;
        markDirty();
        const newItems = formData.whyUs.items.filter((_, i) => i !== index);
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
                                <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Görsel URL (Harici)</label>
                                <div className="space-y-4">
                                    <input
                                        type="text"
                                        value={formData.about.image || ''}
                                        onChange={(e) => updateAboutImage(e.target.value)}
                                        className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-semibold"
                                        placeholder="https://... (Örn: Unsplash veya Firebase)"
                                    />
                                    {formData.about.image && (
                                        <div className="relative border-4 border-white shadow-xl rounded-2xl overflow-hidden bg-gray-100 mx-auto"
                                             style={{ 
                                                 width: formData.about.imageWidth || '100%', 
                                                 height: formData.about.imageHeight || '300px',
                                                 maxWidth: '100%'
                                             }}>
                                            <img 
                                                src={formData.about.image || "/placeholder.png"} 
                                                alt="Preview" 
                                                className="w-full h-full"
                                                style={{
                                                    objectFit: formData.about.imageFit || 'cover',
                                                    objectPosition: formData.about.imagePosition || 'center'
                                                }}
                                            />
                                            <button 
                                                onClick={() => updateAboutImage('')}
                                                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-lg text-xs font-bold"
                                            >
                                                KALDIR
                                            </button>
                                        </div>
                                    )}
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Genişlik</label>
                                            <input type="text" value={formData.about.imageWidth} onChange={e => updateAboutDimension('imageWidth', e.target.value)} className="w-full px-4 py-2 border rounded-xl" placeholder="100% veya 500px" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Yükseklik</label>
                                            <input type="text" value={formData.about.imageHeight} onChange={e => updateAboutDimension('imageHeight', e.target.value)} className="w-full px-4 py-2 border rounded-xl" placeholder="300px" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest">İstatistikler</label>
                                <button onClick={addStat} className="text-xs font-bold text-primary bg-primary/10 px-4 py-2 rounded-xl hover:bg-primary/20 transition-all font-black uppercase">+ Ekle</button>
                            </div>
                            <div className="space-y-4">
                                {formData.about.stats.map((stat, idx) => (
                                    <div key={idx} className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100 flex flex-col gap-4 relative group">
                                        <button onClick={() => removeStat(idx)} className="absolute -top-3 -right-3 w-8 h-8 bg-white text-red-500 rounded-full flex items-center justify-center shadow-md border border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
                                        <div className="grid grid-cols-3 gap-4">
                                            <input type="text" value={stat.value} onChange={e => updateStat(idx, 'value', e.target.value)} className="col-span-1 px-4 py-3 bg-white border border-gray-100 rounded-xl outline-none font-bold" placeholder="Değer" />
                                            <input type="text" value={stat.label[activeLang]} onChange={e => updateStat(idx, 'label', e.target.value, activeLang)} className="col-span-2 px-4 py-3 bg-white border border-gray-100 rounded-xl outline-none font-medium" placeholder={`Etiket (${activeLang})`} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* WHY US SECTION */}
                <section className="bg-white rounded-[3rem] p-12 border border-gray-100 shadow-xl relative overflow-hidden">
                    <div className="flex items-center justify-between mb-10">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center text-2xl text-accent">❓</div>
                            <h2 className="text-3xl font-extrabold text-dark tracking-tight">Neden Biz Bölümü</h2>
                        </div>
                    </div>

                    <div className="mb-12 w-full max-w-2xl">
                        <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Bölüm Başlığı ({activeLang})</label>
                        <input type="text" value={formData.whyUs.title[activeLang]} onChange={e => updateWhyUsTitle(activeLang, e.target.value)} className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-accent/10 focus:border-accent outline-none font-semibold" />
                    </div>

                    <div className="flex justify-between items-center mb-6">
                        <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest">Özellik Kartları</label>
                        <button onClick={addWhyUsItem} className="text-xs font-bold text-accent bg-accent/10 px-4 py-2 rounded-xl hover:bg-accent/20 transition-all font-black uppercase">+ Kart Ekle</button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {formData.whyUs.items.map((item, idx) => (
                            <div key={idx} className="p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100 relative group flex flex-col gap-6">
                                <button onClick={() => removeWhyUsItem(idx)} className="absolute -top-3 -right-3 w-8 h-8 bg-white text-red-500 rounded-full flex items-center justify-center shadow-md border border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity z-20">✕</button>
                                
                                <div className="flex flex-col gap-4">
                                    <div className="w-full aspect-square bg-white border border-gray-100 rounded-[2rem] flex items-center justify-center text-4xl shadow-sm overflow-hidden p-4">
                                        {item.icon && (item.icon.startsWith('/') || item.icon.startsWith('http')) ? (
                                            <img src={item.icon || "/placeholder.png"} alt="icon" className="w-full h-full object-contain" />
                                        ) : (
                                            <span>{item.icon || '⭐'}</span>
                                        )}
                                    </div>
                                    <input type="text" value={item.icon} onChange={e => updateWhyUsItem(idx, 'icon', e.target.value)} className="w-full bg-white border border-gray-100 rounded-lg py-2 px-3 text-center text-xs font-bold outline-none" placeholder="Emoji veya URL" />
                                </div>

                                <div className="space-y-4">
                                    <input type="text" value={item.title[activeLang]} onChange={e => updateWhyUsItem(idx, 'title', e.target.value, activeLang)} className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl font-bold" placeholder={`Başlık (${activeLang})`} />
                                    <textarea rows={3} value={item.description[activeLang]} onChange={e => updateWhyUsItem(idx, 'description', e.target.value, activeLang)} className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl font-medium text-sm" placeholder={`Açıklama (${activeLang})`} />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
