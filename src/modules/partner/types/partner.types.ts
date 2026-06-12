export interface Partner {
    id: string;
    name: string;
    age: number;
    gender: string;
    bio: string;
    location: string;
    rating: string;
    verified: boolean;
    distance: string;
    image: string;
    banner?: string;
    reviews: Review[];
    gallery: Gallery[];
    pricing: Pricing;
}

export interface Pricing {
    oneHour: number;
    twoHours: number;
    threeHours: number;
    fourHours: number;
    fiveHours: number;
    eightHours: number;
}

export interface Review {
    id: string;
    name: string;
    role: string;
    text: string;
    image: string;
    rating: number;
}

export interface Gallery {
    id: string;
    image: string;
}
