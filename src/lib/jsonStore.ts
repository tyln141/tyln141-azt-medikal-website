import fs from 'fs';
import path from 'path';

export function getDbPath(collection: string) {
    return path.join(process.cwd(), `src/data/${collection}.json`);
}

export function readCollection(collection: string, defaultValue: any = []) {
    try {
        const filePath = getDbPath(collection);
        if (!fs.existsSync(filePath)) {
            // Write default if it doesn't exist
            fs.writeFileSync(filePath, JSON.stringify(defaultValue, null, 2), 'utf8');
            return defaultValue;
        }
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (e) {
        return defaultValue;
    }
}

export function writeCollection(collection: string, data: any) {
    try {
        const filePath = getDbPath(collection);
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
        return true;
    } catch (e) {
        console.error(`Error writing collection ${collection}:`, e);
        return false;
    }
}
