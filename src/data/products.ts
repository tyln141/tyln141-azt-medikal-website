export interface Product {
    id: string;
    name: {
        tr: string;
        en: string;
    };
    description: {
        tr: string;
        en: string;
    };
    category: string;
    price: number;
    stock: number;
    image: string;
    featured: boolean;
}

export const initialProducts: Product[] = [
    {
        id: "p1",
        name: {
            tr: "Gelişmiş EKG Monitörü XC-100",
            en: "Advanced ECG Monitor XC-100"
        },
        description: {
            tr: "12 kanallı taşınabilir EKG cihazı. Yüksek çözünürlüklü dokunmatik ekran ve dahili batarya ile kesintisiz güç.",
            en: "12-channel portable ECG device. High resolution touch screen and built-in battery for uninterrupted power."
        },
        category: "monitoring",
        price: 12500,
        stock: 15,
        image: "/mock-ecg.png",
        featured: true
    },
    {
        id: "p2",
        name: {
            tr: "Dijital Ultrason Sistemi",
            en: "Digital Ultrasound System"
        },
        description: {
            tr: "Jinekoloji, kardiyoloji ve genel amaçlı kullanım için tasarlanmış yüksek frekanslı Doppler ultrason sistemi.",
            en: "High frequency Doppler ultrasound system designed for gynecology, cardiology, and general purpose use."
        },
        category: "diagnostic",
        price: 45000,
        stock: 3,
        image: "/mock-ultrasound.png",
        featured: true
    },
    {
        id: "p3",
        name: {
            tr: "Mikro Cerrahi Neşter Seti",
            en: "Micro Surgery Scalpel Set"
        },
        description: {
            tr: "Titanyum alaşımlı, paslanmaz ve hafif mikro cerrahi donanımı. 15 parçalık tam set.",
            en: "Titanium alloy, stainless and lightweight micro surgery equipment. 15-piece full set."
        },
        category: "surgical",
        price: 3200,
        stock: 50,
        image: "/mock-surgery.png",
        featured: false
    },
    {
        id: "p4",
        name: {
            tr: "Otomatik Kan Analiz Cihazı",
            en: "Automatic Blood Analyzer"
        },
        description: {
            tr: "Saatte 60 teste kadar analiz kapasitesi. Kompakt tasarım, kullanımı kolay arayüz.",
            en: "Analysis capacity up to 60 tests per hour. Compact design, easy to use interface."
        },
        category: "lab",
        price: 28000,
        stock: 7,
        image: "/mock-lab.png",
        featured: true
    }
];

// Helper for categories
export const categories = [
    { id: 'diagnostic', nameTr: 'Teşhis ve Tanı', nameEn: 'Diagnostics' },
    { id: 'surgical', nameTr: 'Cerrahi Ekipmanlar', nameEn: 'Surgical Equipment' },
    { id: 'monitoring', nameTr: 'Hasta Takip', nameEn: 'Patient Monitoring' },
    { id: 'lab', nameTr: 'Laboratuvar', nameEn: 'Laboratory' }
];
