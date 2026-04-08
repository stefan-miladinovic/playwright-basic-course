import fs from 'fs';
import path from 'path';

type Translations = Record<string, string>;

export function getTranslations(locale: string): Translations {
    const filePath = path.resolve(__dirname, `../src/locales/${locale}.json`);
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}