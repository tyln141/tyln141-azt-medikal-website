"use client";

import { useState } from 'react';
import Container from '@/components/Container';
import SectionTitle from '@/components/SectionTitle';
import { Language } from '@/lib/i18n';
import { useAppContext } from '@/context/AppProvider';

interface ContactProps {
    content: {
        title: Record<Language, string>;
    };
    language: Language;
}
export default function ContactSection({ content, language }: ContactProps) {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const { t } = useAppContext();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus('loading');
        
        const form = e.currentTarget;
        const data = {
            name: (form.elements.namedItem('name') as HTMLInputElement).value,
            email: (form.elements.namedItem('email') as HTMLInputElement).value,
            phone: (form.elements.namedItem('phone') as HTMLInputElement).value,
            message: (form.elements.namedItem('message') as HTMLTextAreaElement).value,
            productName: 'Genel İletişim / Teklif Talebi'
        };

        try {
            const res = await fetch('/api/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (res.ok) {
                setStatus('success');
                form.reset();
            } else {
                setStatus('error');
            }
        } catch (err) {
            setStatus('error');
        }
    };

    return (
        <section className="py-32 bg-gray-50/50" id="contact">
            <Container>
                <div className="max-w-4xl mx-auto bg-white rounded-[3rem] p-12 md:p-20 shadow-xl border border-gray-100">
                    <SectionTitle
                        title={content?.title?.[language] || content?.title?.['tr'] || ''}
                        center={true}
                        className="mb-12"
                    />
                    
                    {status === 'success' ? (
                        <div className="bg-green-50 text-green-700 p-8 rounded-[2rem] text-center border border-green-100 animate-fade-in">
                            <span className="text-4xl mb-4 block">✅</span>
                            <p className="font-bold text-lg">{t("form.success")}</p>
                            <button onClick={() => setStatus('idle')} className="mt-6 text-green-800 font-bold underline">Yeni Mesaj Gönder</button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <input name="name" type="text" placeholder={t("form.name")} required className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary outline-none" />
                            <input name="email" type="email" placeholder={t("form.email")} required className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary outline-none" />
                            <input name="phone" type="text" placeholder={t("form.phone")} required className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary outline-none md:col-span-2" />
                            <textarea name="message" placeholder={t("form.message")} required rows={4} className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary outline-none md:col-span-2"></textarea>
                            
                            {status === 'error' && <p className="md:col-span-2 text-red-500 text-sm font-bold">Hata oluştu, lütfen tekrar deneyin.</p>}
                            
                            <button type="submit" disabled={status === 'loading'} className="md:col-span-2 btn btn-primary py-5 text-lg font-bold shadow-lg shadow-primary/20 hover:-translate-y-1 disabled:opacity-50">
                                {status === 'loading' ? 'Gönderiliyor...' : t("form.send")}
                            </button>
                        </form>
                    )}
                </div>
            </Container>
        </section>
    );
}
