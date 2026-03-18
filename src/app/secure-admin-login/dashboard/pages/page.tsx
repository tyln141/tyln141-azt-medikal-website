"use client";

import { useState, useEffect } from 'react';
import { getValue } from '@/lib/i18n';

const LANGUAGES = [
    { code: 'tr', name: 'TR' },
    { code: 'en', name: 'EN' },
    { code: 'de', name: 'DE' },
    { code: 'fr', name: 'FR' },
    
] as const;

const PAGES = [
    { id: 'home', name: 'Ana Sayfa' },
    { id: 'about', name: 'Hakkımızda' },
    { id: 'why-us', name: 'Neden Biz' },
    { id: 'footer', name: 'Alt Bilgi (Footer)' },
    { id: 'settings', name: 'Site Ayarları' },
] as const;

export default function AdminPages() {
    const [pagesData, setPagesData] = useState<any>(null);
    const [saving, setSaving] = useState(false);
    const [activePage, setActivePage] = useState<string>('home');
    const [activeLang, setActiveLang] = useState<string>('tr');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const contentRes = await fetch('/api/data/content');
            const contentData = await contentRes.json();
            
            const settingsRes = await fetch('/api/data/site-settings');
            const settingsData = await settingsRes.json();
            
            // Combine for the UI state
            setPagesData({ ...contentData, siteSettings: settingsData });
        } catch (e) {
            console.error("Failed to load data in admin", e);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const { siteSettings, ...contentData } = pagesData;
            
            const res = await fetch('/api/data/content', { 
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' }, 
                body: JSON.stringify(contentData) 
            });
            
            const result = await res.json();
            console.log("SAVE RESULT:", result);

            if (siteSettings) {
                await fetch('/api/data/site-settings', { 
                    method: 'POST', 
                    headers: { 'Content-Type': 'application/json' }, 
                    body: JSON.stringify(siteSettings) 
                });
            }
            
            if (result.success) {
                alert("Değişiklikler başarıyla kaydedildi!");
                window.location.reload();
            } else {
                alert("Save failed: " + (result.error || "Unknown error"));
            }
        } catch (e) {
            console.error("SAVE ERROR:", e);
            alert("Hata oluştu.");
        } finally {
            setSaving(false);
        }
    };

    const reorderSection = (page: string, index: number, direction: 'up' | 'down') => {
        const sections = [...pagesData[page]];
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= sections.length) return;

        const temp = sections[index];
        sections[index] = sections[newIndex];
        sections[newIndex] = temp;

        setPagesData({ ...pagesData, [page]: sections });
    };

    const updateContent = (page: string, index: number, field: string, value: any, subfield?: string, lang?: string) => {
        const sections = [...pagesData[page]];
        const section = { ...sections[index] };
        
        if (lang) {
            if (subfield) {
                if (!section.content[field]) section.content[field] = {};
                if (!section.content[field][subfield]) section.content[field][subfield] = {};
                section.content[field][subfield][lang] = value;
            } else {
                if (!section.content[field]) section.content[field] = {};
                section.content[field][lang] = value;
            }
        } else {
            section.content[field] = value;
        }

        sections[index] = section;
        setPagesData({ ...pagesData, [page]: sections });
    };

    const deleteSection = (page: string, index: number) => {
        if (!confirm('Bu bölümü silmek istediğinize emin misiniz?')) return;
        const sections = [...pagesData[page]];
        sections.splice(index, 1);
        setPagesData({ ...pagesData, [page]: sections });
    };

    const addSection = (page: string, type: string) => {
        const sections = pagesData[page] ? [...pagesData[page]] : [];
        const newSection = {
            id: `${type.toLowerCase()}-${Date.now()}`,
            type: type,
            content: { title: { tr: "Yeni Bölüm" }, subtitle: {}, description: {}, cards: [], features: [] }
        };
        sections.push(newSection);
        setPagesData({ ...pagesData, [page]: sections });
    };

    if (!pagesData) return <div className="p-8 text-center text-gray-500">Yükleniyor...</div>;

    const currentSections = activePage === 'settings' ? [] : (pagesData[activePage] || []);

    return (
        <div className="max-w-5xl mx-auto pb-20">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h2 className="text-3xl font-extrabold text-dark tracking-tight mb-2">Sayfa Düzenleyici</h2>
                    <p className="text-gray-500 font-medium">Sitedeki tüm bölümleri buradan yönetebilirsiniz.</p>
                </div>
                <div className="flex gap-4">
                    <button onClick={handleSave} disabled={saving} className="btn btn-primary px-10 py-4 shadow-xl shadow-primary/20 font-bold hover:-translate-y-1 transition-all">{saving ? 'Kaydediliyor...' : 'Değişiklikleri Yayınla'}</button>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8 mb-10">
                <div className="flex-1">
                    <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">Düzenlenecek Sayfa</label>
                    <div className="flex bg-gray-100 p-1.5 rounded-2xl overflow-x-auto">
                        {PAGES.map(page => (
                            <button key={page.id} onClick={() => setActivePage(page.id)} className={`px-6 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activePage === page.id ? 'bg-white text-primary shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>{page.name}</button>
                        ))}
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">Dil Seçimi</label>
                    <div className="flex bg-gray-100 p-1.5 rounded-2xl">
                        {LANGUAGES.map(lang => (
                            <button key={lang.code} onClick={() => setActiveLang(lang.code)} className={`px-4 py-3 rounded-xl text-xs font-bold transition-all ${activeLang === lang.code ? 'bg-white text-primary shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>{lang.name}</button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="space-y-8">
                {currentSections.map((section: any, idx: number) => {
                    return (
                        <div key={section.id} className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm">
                                <div className="flex justify-between items-center mb-8 pb-6 border-b border-gray-50">
                                <div className="flex items-center gap-4">
                                    <span className="bg-primary/10 text-primary px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest">{section.type}</span>
                                    <h3 className="font-bold text-dark text-lg">{section.id}</h3>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => reorderSection(activePage, idx, 'up')} disabled={idx === 0} className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center hover:bg-primary hover:text-white disabled:opacity-30 transition-all font-bold">↑</button>
                                    <button onClick={() => reorderSection(activePage, idx, 'down')} disabled={idx === currentSections.length - 1} className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center hover:bg-primary hover:text-white disabled:opacity-30 transition-all font-bold">↓</button>
                                    <button onClick={() => deleteSection(activePage, idx)} className="w-12 h-12 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all font-bold ml-2">✕</button>
                                </div>
                            </div>

                            <div className="space-y-8">
                                {(section.type === 'Hero' || section.type === 'AboutHero') && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-bold text-gray-400 mb-3 uppercase tracking-wider">Başlık ({activeLang.toUpperCase()})</label>
                                            <input type="text"  className="w-full px-6 py-4 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:border-primary transition-all outline-none font-bold text-lg" value={getValue(section.content.title, activeLang)} onChange={(e) => updateContent(activePage, idx, 'title', e.target.value, undefined, activeLang)} />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-bold text-gray-400 mb-3 uppercase tracking-wider">Alt Başlık ({activeLang.toUpperCase()})</label>
                                            <textarea rows={2}  className="w-full px-6 py-4 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:border-primary transition-all outline-none font-medium text-gray-600" value={getValue(section.content.subtitle, activeLang)} onChange={(e) => updateContent(activePage, idx, 'subtitle', e.target.value, undefined, activeLang)} />
                                        </div>
                                        {section.type === 'AboutHero' && (
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-bold text-gray-400 mb-3 uppercase tracking-wider">Açıklama ({activeLang.toUpperCase()})</label>
                                                <textarea rows={4}  className="w-full px-6 py-4 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:border-primary transition-all outline-none font-medium text-gray-600" value={getValue(section.content.description, activeLang)} onChange={(e) => updateContent(activePage, idx, 'description', e.target.value, undefined, activeLang)} />
                                            </div>
                                        )}
                                        {section.type === 'Hero' && (
                                            <>
                                                <div>
                                                    <label className="block text-sm font-bold text-gray-400 mb-3 uppercase tracking-wider">Buton Metni ({activeLang.toUpperCase()})</label>
                                                    <input type="text"  className="w-full px-6 py-4 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:border-primary transition-all outline-none font-bold" value={getValue(section.content.buttonText, activeLang)} onChange={(e) => updateContent(activePage, idx, 'buttonText', e.target.value, undefined, activeLang)} />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-bold text-gray-400 mb-3 uppercase tracking-wider">Buton Linki</label>
                                                    <input type="text" className="w-full px-6 py-4 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:border-primary transition-all outline-none font-medium" value={section.content.buttonLink} onChange={(e) => updateContent(activePage, idx, 'buttonLink', e.target.value)} />
                                                </div>
                                            </>
                                        )}
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-bold text-gray-400 mb-3 uppercase tracking-wider">Arka Plan Görsel URL</label>
                                            <div className="flex flex-col gap-4">
                                                <input type="text" className="w-full px-6 py-4 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:border-primary transition-all outline-none font-medium" value={section.content.backgroundImage || ''} onChange={(e) => updateContent(activePage, idx, 'backgroundImage', e.target.value)} placeholder="https://... (Örn: Unsplash URL)" />
                                                {section.content.backgroundImage && (
                                                    <div className="w-full h-40 rounded-2xl overflow-hidden border-4 border-white shadow-lg bg-gray-100 relative group">
                                                        <img src={section.content.backgroundImage} alt="Preview" className="w-full h-full object-cover" />
                                                        <button onClick={() => updateContent(activePage, idx, 'backgroundImage', '')} className="absolute inset-0 bg-red-500/80 text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity">KALDIR</button>
                                                    </div>
                                                )}
                                                <p className="text-[10px] text-gray-400 italic font-medium pl-2">* Lütfen harici bir görsel URL'si kullanın.</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {(section.type === 'InfoCards' || section.type === 'WhyUs') && (
                                    <div className="space-y-8">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                            <div>
                                                <label className="block text-sm font-bold text-gray-400 mb-3 uppercase tracking-wider">Ana Başlık ({activeLang.toUpperCase()})</label>
                                                <input type="text"  className="w-full px-6 py-4 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:border-primary transition-all outline-none font-bold" value={getValue(section.content.title, activeLang)} onChange={(e) => updateContent(activePage, idx, 'title', e.target.value, undefined, activeLang)} />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-gray-400 mb-3 uppercase tracking-wider">Alt Başlık ({activeLang.toUpperCase()})</label>
                                                <input type="text"  className="w-full px-6 py-4 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:border-primary transition-all outline-none font-bold" value={getValue(section.content.subtitle, activeLang)} onChange={(e) => updateContent(activePage, idx, 'subtitle', e.target.value, undefined, activeLang)} />
                                            </div>
                                        </div>
                                        <div className="space-y-6">
                                            {(section.content.cards || section.content.features || []).map((card: any, cidx: number) => (
                                                <div key={idx + '-' + cidx} className="p-8 bg-gray-50 rounded-3xl grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
                                                    <div className="md:col-span-1">
                                                        <label className="block text-xs font-bold text-gray-400 mb-3 uppercase tracking-wider">İkon / Görsel</label>
                                                        <input type="text" className="w-full px-4 py-3 bg-white border-transparent rounded-xl outline-none text-center text-2xl" value={card.icon} onChange={(e) => {
                                                            const key = section.content.cards ? 'cards' : 'features';
                                                            const newList = [...section.content[key]];
                                                            newList[cidx].icon = e.target.value;
                                                            updateContent(activePage, idx, key, newList);
                                                        }} />
                                                    </div>
                                                    <div className="md:col-span-3 space-y-4">
                                                        <input type="text"  className="w-full px-4 py-3 bg-white border-transparent rounded-xl outline-none font-bold" value={getValue(card.title, activeLang)} onChange={(e) => {
                                                            const key = section.content.cards ? 'cards' : 'features';
                                                            const newList = [...section.content[key]];
                                                            if (!newList[cidx].title || typeof newList[cidx].title !== 'object') newList[cidx].title = {};
                                                            newList[cidx].title[activeLang] = e.target.value;
                                                            updateContent(activePage, idx, key, newList);
                                                        }} />
                                                        <textarea rows={2}  className="w-full px-4 py-3 bg-white border-transparent rounded-xl outline-none text-sm font-medium text-gray-500" value={getValue((card.desc || card.description), activeLang)} onChange={(e) => {
                                                            const key = section.content.cards ? 'cards' : 'features';
                                                            const field = card.desc ? 'desc' : 'description';
                                                            const newList = [...section.content[key]];
                                                            if (!newList[cidx][field] || typeof newList[cidx][field] !== 'object') newList[cidx][field] = {};
                                                            newList[cidx][field][activeLang] = e.target.value;
                                                            updateContent(activePage, idx, key, newList);
                                                        }} />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {(section.type === 'ProductGrid' || section.type === 'Contact') && (
                                    <div>
                                        <label className="block text-sm font-bold text-gray-400 mb-3 uppercase tracking-wider">Başlık ({activeLang.toUpperCase()})</label>
                                        <input type="text"  className="w-full px-6 py-4 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:border-primary transition-all outline-none font-bold text-lg" value={getValue(section.content.title, activeLang)} onChange={(e) => updateContent(activePage, idx, 'title', e.target.value, undefined, activeLang)} />
                                    </div>
                                )}

                                {section.type === 'Footer' && (
                                    <div className="space-y-8">
                                        <textarea rows={3}  className="w-full px-6 py-4 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:border-primary transition-all outline-none font-medium text-gray-600" value={getValue(section.content.description, activeLang)} onChange={(e) => updateContent(activePage, idx, 'description', e.target.value, undefined, activeLang)} />
                                        <input type="text" className="w-full px-6 py-4 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:border-primary transition-all outline-none font-bold" value={section.content.poweredBy || ''} onChange={(e) => updateContent(activePage, idx, 'poweredBy', e.target.value)} placeholder="Powered By: LeverPlay" />
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {activePage === 'settings' && (
                <div className="mt-8 bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm">
                    <h3 className="text-xl font-bold text-dark mb-8 uppercase tracking-widest text-sm pb-6 border-b border-gray-50">Genel Site Ayarları</h3>
                    <div className="space-y-8">
                        <div className="flex flex-col gap-6 p-8 bg-gray-50 rounded-3xl border border-gray-100/50">
                            <div className="flex items-center gap-8">
                                <div className="w-32 h-32 bg-white rounded-2xl border border-gray-200 flex items-center justify-center overflow-hidden p-3 shadow-inner relative group">
                                    <img src={pagesData.siteSettings?.logo || '/logo.png'} alt="Preview" className="max-w-full max-h-full object-contain" />
                                    <button onClick={() => setPagesData({ ...pagesData, siteSettings: { ...pagesData.siteSettings, logo: '' } })} className="absolute inset-0 bg-red-500/80 text-white font-bold text-xs opacity-0 group-hover:opacity-100 transition-opacity">KALDIR</button>
                                </div>
                                <div className="flex-1 space-y-4">
                                    <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest">Logo URL</label>
                                    <input type="text" className="w-full px-6 py-4 bg-white border-gray-200 rounded-2xl focus:border-primary transition-all outline-none font-bold text-gray-700" value={pagesData.siteSettings?.logo || ''} onChange={(e) => setPagesData({ ...pagesData, siteSettings: { ...pagesData.siteSettings, logo: e.target.value } })} placeholder="https://.../logo.png" />
                                    <p className="text-[10px] text-gray-400 italic font-medium">* Logo dosyasının tam URL'sini girin.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activePage !== 'settings' && (
                <div className="mt-8 bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm text-center">
                    <h3 className="text-xl font-bold text-dark mb-6">Yeni Bölüm Ekle</h3>
                    <div className="flex flex-wrap justify-center gap-4">
                        {['Hero', 'AboutHero', 'InfoCards', 'WhyUs', 'ProductGrid', 'Contact', 'Footer'].map(type => (
                            <button
                                key={type}
                                onClick={() => addSection(activePage, type)}
                                className="btn btn-outline border-gray-200 text-dark hover:bg-gray-50 px-6 py-3 rounded-xl font-bold"
                            >
                                + {type}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
