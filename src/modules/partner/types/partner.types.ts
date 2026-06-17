export interface Partner {
    id: string;
    name: string;
    age: number;
    gender: string;
    bio: string;
    location: string;
    rating: number;
    verified: boolean;
    distance: number;
    image: string;
    banner?: string;
    reviews: Review[];
    gallery: Gallery[];
    pricing: Pricing;
    tags?: string[];
    interests?: string;
    languages?: string;
    videos?: string[];
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
    videoUrl?: string;
}

export interface Gallery {
    id: string;
    image: string;
}
