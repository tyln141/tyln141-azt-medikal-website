import { NextResponse } from 'next/server';
import { readCollection as readJson } from '@/lib/jsonStore';
import { writeDoc, writeCollection } from '@/lib/firestoreStore';
import fs from 'fs';
import path from 'path';

export async function GET() {
    try {
        console.log('Starting migration...');
        
        // 1. Migrate Products
        const products = readJson('products', []);
        if (products.length > 0) {
            await writeCollection('products', products);
            console.log('Migrated products');
        }

        // 2. Migrate Categories
        const categories = readJson('categories', []);
        if (categories.length > 0) {
            await writeCollection('categories', categories);
            console.log('Migrated categories');
        }

        // 3. Migrate Site Content (Homepage)
        const siteContent = readJson('site-content', {});
        if (Object.keys(siteContent).length > 0) {
            await writeDoc('siteContent', 'main', siteContent);
            console.log('Migrated siteContent/main');
        }

        // 4. Migrate Settings
        const generalSettings = readJson('settings', {});
        if (Object.keys(generalSettings).length > 0) {
            await writeDoc('settings', 'general', generalSettings);
        }

        const pagesSettings = readJson('pages', {});
        if (Object.keys(pagesSettings).length > 0) {
            await writeDoc('settings', 'pages', pagesSettings);
        }

        const themeSettings = readJson('theme', {});
        if (Object.keys(themeSettings).length > 0) {
            await writeDoc('settings', 'theme', themeSettings);
        }
        
        const siteSettings = readJson('siteSettings', {});
        if (Object.keys(siteSettings).length > 0) {
            await writeDoc('settings', 'site', siteSettings);
        }
        console.log('Migrated settings');

        // 5. Migrate Translations
        const localesDir = path.join(process.cwd(), 'locales');
        if (fs.existsSync(localesDir)) {
            const files = fs.readdirSync(localesDir);
            for (const file of files) {
                if (file.endsWith('.json')) {
                    const lang = file.replace('.json', '');
                    const content = JSON.parse(fs.readFileSync(path.join(localesDir, file), 'utf8'));
                    await writeDoc('translations', lang, content);
                    console.log(`Migrated translation: ${lang}`);
                }
            }
        }

        return NextResponse.json({ success: true, message: 'Migration completed successfully' });
    } catch (error: any) {
        console.error('Migration failed:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
