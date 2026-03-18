export interface Product {
    id: string;
    name: { tr: string; en: string; de: string; fr: string; ar?: string; };
    description: { tr: string; en: string; de: string; fr: string; ar?: string; };
    category: string;
    image: string;
    features?: { tr: string[]; en: string[]; de: string[]; fr: string[]; ar?: string[]; };
}

export interface SiteSettings {
    contactEmail: string;
    contactPhone: string;
    address: string;
    workingHours: string;
    footerCredit: string;
    logo: string;
    favicon: string;
    headerLayout: string;
    footerText: string;
    poweredBy: string;
    primaryColor?: string;
    backgroundColor?: string;
    font?: string;
}

export interface ThemeSettings {
    primaryColor: string;
    backgroundColor: string;
    fontFamily: string;
    borderRadius: string;
    boxShadow: string;
    buttonStyles: {
        borderRadius: string;
        padding: string;
        fontSize: string;
    };
    productCard: {
        borderRadius: string;
        shadow: string;
        hoverAnimation: string;
        imageRatio: string;
    };
}
