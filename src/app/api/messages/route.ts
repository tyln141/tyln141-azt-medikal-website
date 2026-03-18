import { NextResponse } from 'next/server';
import { readCollection, writeCollection } from '@/lib/jsonStore';
import nodemailer from 'nodemailer';

export async function GET() {
    try {
        const data = readCollection('messages', []);
        return NextResponse.json(data);
    } catch (_error) {
        return NextResponse.json({ error: 'Failed to read messages' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

        const messages = readCollection('messages', []);
        const filtered = messages.filter((m: any) => m.id !== id);
        writeCollection('messages', filtered);

        return NextResponse.json({ success: true });
    } catch (_error) {
        return NextResponse.json({ error: 'Failed to delete message' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Check if this is a reply
        if (body.type === 'reply') {
            const { to, subject, message } = body;
            if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
                const transporter = nodemailer.createTransport({
                    host: process.env.SMTP_HOST,
                    port: Number(process.env.SMTP_PORT) || 587,
                    secure: Number(process.env.SMTP_PORT) === 465,
                    auth: {
                        user: process.env.SMTP_USER,
                        pass: process.env.SMTP_PASS,
                    },
                });

                await transporter.sendMail({
                    from: `"AZT Medikal" <${process.env.SMTP_USER}>`,
                    to,
                    replyTo: 'azt@aztmedikal.com.tr',
                    subject: `YNT: ${subject}`,
                    text: message,
                    html: `<p>${message.replace(/\n/g, '<br/>')}</p><hr/><p>AZT Medikal ekibi</p>`
                });
                return NextResponse.json({ success: true });
            }
            return NextResponse.json({ error: 'Email configuration missing' }, { status: 500 });
        }

        // Original message save logic
        const messages = readCollection('messages', []);
        const newMessage = {
            id: `msg-${Date.now()}`,
            productName: body.productName || '',
            name: body.name || '',
            phone: body.phone || '',
            email: body.email || '',
            message: body.message || '',
            date: new Date().toISOString(),
            read: false
        };

        messages.unshift(newMessage);
        writeCollection('messages', messages);

        // ... existing email notification logic ...
        if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
            try {
                const transporter = nodemailer.createTransport({
                    host: process.env.SMTP_HOST,
                    port: Number(process.env.SMTP_PORT) || 587,
                    secure: Number(process.env.SMTP_PORT) === 465,
                    auth: {
                        user: process.env.SMTP_USER,
                        pass: process.env.SMTP_PASS,
                    },
                });

                await transporter.sendMail({
                    from: `"AZT Medikal Web" <${process.env.SMTP_USER}>`,
                    to: 'azt@aztmedikal.com.tr',
                    subject: `Yeni Form Mesajı: ${newMessage.productName}`,
                    html: `
                        <h2>Yeni Form Mesajı</h2>
                        <p><strong>Konu/Ürün:</strong> ${newMessage.productName}</p>
                        <p><strong>İsim:</strong> ${newMessage.name}</p>
                        <p><strong>Telefon:</strong> ${newMessage.phone}</p>
                        <p><strong>E-posta:</strong> ${newMessage.email}</p>
                        <p><strong>Mesaj:</strong><br/>${newMessage.message.replace(/\n/g, '<br/>')}</p>
                    `
                });
            } catch (emailError) {
                console.error("Email gonderilemedi:", emailError);
            }
        }

        return NextResponse.json({ success: true, message: newMessage });
    } catch (_error) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
