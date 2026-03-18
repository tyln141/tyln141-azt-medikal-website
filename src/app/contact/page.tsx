"use client";

import { useState } from 'react';
import Container from '@/components/Container';
import SectionTitle from '@/components/SectionTitle';
import { useAppContext } from '@/context/AppProvider';

export default function ContactPage() {
    const { t } = useAppContext();

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        message: ''
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    productName: 'Genel İletişim',
                })
            });

            if (res.ok) {
                setSuccess(true);
                setTimeout(() => {
                    setSuccess(false);
                    setFormData({ name: '', phone: '', email: '', message: '' });
                }, 5000);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-40 pb-32 bg-gray-50/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-gradient-to-br from-primary/10 to-accent/10 blur-[120px] rounded-full -z-10" />

            <Container>
                <SectionTitle
                    title={t("contact.title")}
                    subtitle={t("contact.desc")}
                    center={true}
                    className="mb-20"
                />

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-0 bg-white rounded-[3rem] shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden">

                    {/* Info Side */}
                    <div className="lg:col-span-2 bg-dark p-12 lg:p-16 text-white relative overflow-hidden flex flex-col justify-between h-full min-h-[500px]">
                        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/20 rounded-full blur-[60px] translate-x-1/2 -translate-y-1/2 transition-transform duration-1000" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/20 rounded-full blur-[60px] -translate-x-1/2 translate-y-1/2 transition-transform duration-1000" />

                        <div className="relative z-10">
                            <h3 className="text-3xl font-extrabold mb-4 tracking-tight">{t("contact.title")}</h3>
                            <p className="text-gray-400 mb-16 leading-relaxed max-w-sm font-medium">{t("contact.desc")}</p>

                            <div className="space-y-10">
                                <div className="flex items-start gap-6 group">
                                    <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10 group-hover:bg-primary transition-colors duration-500 shadow-xl text-3xl">📍</div>
                                    <div>
                                        <h4 className="font-bold text-gray-400 text-xs tracking-widest uppercase mb-1">{t("contact.address")}</h4>
                                        <p className="text-lg font-medium leading-relaxed max-w-xs">{t("contact.addressText")}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-6 group">
                                    <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10 group-hover:bg-primary transition-colors duration-500 shadow-xl text-3xl">📞</div>
                                    <div>
                                        <h4 className="font-bold text-gray-400 text-xs tracking-widest uppercase mb-1">{t("contact.phone")}</h4>
                                        <p className="text-lg font-bold tracking-wider mt-1">{t("contact.phoneText")}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-6 group">
                                    <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10 group-hover:bg-primary transition-colors duration-500 shadow-xl text-3xl">✉️</div>
                                    <div>
                                        <h4 className="font-bold text-gray-400 text-xs tracking-widest uppercase mb-1">{t("contact.email")}</h4>
                                        <a href={`mailto:${t("contact.emailText")}`} className="text-lg font-medium block mt-1 hover:text-primary transition-colors">{t("contact.emailText")}</a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-6 group">
                                    <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10 group-hover:bg-primary transition-colors duration-500 shadow-xl text-3xl">⏰</div>
                                    <div>
                                        <h4 className="font-bold text-gray-400 text-xs tracking-widest uppercase mb-1">{t("contact.hours")}</h4>
                                        <p className="text-lg font-medium leading-relaxed max-w-xs">{t("contact.hoursText")}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form Side */}
                    <div className="lg:col-span-3 p-10 lg:p-20 flex flex-col justify-center">

                        {success ? (
                            <div className="h-full flex flex-col items-center justify-center text-center animate-fade-in">
                                <div className="w-24 h-24 bg-success/10 rounded-full flex items-center justify-center mb-8">
                                    <div className="w-12 h-12 bg-success rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-success/30">✓</div>
                                </div>
                                <h3 className="text-3xl font-extrabold text-dark mb-4">{t("form.success")}</h3>
                                <p className="text-gray-500 font-medium">Bize ulaştığınız için teşekkür ederiz.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div>
                                    <label className="block text-sm font-bold tracking-wide text-gray-700 mb-3">{t("form.name")}</label>
                                    <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none font-medium text-dark shadow-sm" />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <label className="block text-sm font-bold tracking-wide text-gray-700 mb-3">{t("form.phone")}</label>
                                        <input required type="text" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none font-medium text-dark shadow-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold tracking-wide text-gray-700 mb-3">{t("form.email")}</label>
                                        <input required type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none font-medium text-dark shadow-sm" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold tracking-wide text-gray-700 mb-3">{t("form.message")}</label>
                                    <textarea required rows={5} value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none resize-none font-medium text-dark shadow-sm"></textarea>
                                </div>
                                <button disabled={loading} type="submit" className="w-full min-w-[200px] btn btn-primary text-xl py-5 border border-transparent shadow-xl shadow-primary/20 hover:-translate-y-1 transition-all font-bold disabled:opacity-50 mt-10">
                                    {loading ? '...' : t("form.send")}
                                </button>
                            </form>
                        )}
                    </div>

                </div>
            </Container>
        </div>
    );
}
