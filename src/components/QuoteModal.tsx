"use client";

import { useState } from 'react';
import { useAppContext, Product } from '@/context/AppProvider';
import { getValue } from '@/lib/i18n';

interface QuoteModalProps {
    product: Product;
    isOpen: boolean;
    onClose: () => void;
}

export default function QuoteModal({ product, isOpen, onClose }: QuoteModalProps) {
    const { t, language } = useAppContext();

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        message: ''
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const productName = getValue(product.name, language);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    productName
                })
            });

            if (res.ok) {
                setSuccess(true);
                setTimeout(() => {
                    onClose();
                    setSuccess(false);
                    setFormData({ name: '', phone: '', email: '', message: '' });
                }, 3000);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-dark/60 backdrop-blur-sm" onClick={onClose}></div>

            <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in">
                <div className="p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-2xl font-bold text-dark">{t("products.requestQuote")}</h3>
                        <button onClick={onClose} className="text-gray-400 hover:text-dark text-2xl leading-none">&times;</button>
                    </div>

                    {success ? (
                        <div className="bg-success/10 border-l-4 border-success p-6 rounded-lg">
                            <p className="text-success font-bold text-lg">{t("form.success")}</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Ürün</label>
                                <input type="text" value={productName} disabled className="w-full px-5 py-3.5 bg-gray-100 border border-gray-200 rounded-2xl text-dark cursor-not-allowed font-medium" />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">{t("form.name")}</label>
                                <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none text-dark font-medium shadow-sm" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">{t("form.phone")}</label>
                                    <input required type="text" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none text-dark font-medium shadow-sm" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">{t("form.email")}</label>
                                    <input required type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none text-dark font-medium shadow-sm" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">{t("form.message")}</label>
                                <textarea rows={3} value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none text-dark font-medium shadow-sm resize-none"></textarea>
                            </div>

                            <button disabled={loading} type="submit" className="w-full btn btn-primary text-lg py-4 border border-transparent hover:-translate-y-1 shadow-lg hover:shadow-primary/20 transition-all font-bold disabled:opacity-50">
                                {loading ? '...' : t("form.send")}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
