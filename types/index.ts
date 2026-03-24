export interface Business {
    place_id: string;
    business_name: string;
    address: string;
    phone: string;
    website: string;
    rating: number;
    total_ratings: number;
    category: string;
    latitude: number;
    longitude: number;
    open_now?: boolean;
    photos?: string[];
}

export interface Contact {
    id?:string;
    lead_id?: string;
    first_name: string;
    last_name: string;
    title: string;
    email: string;
    confidence_score: number;
    source: string;
}

export interface SearchFilters {
    keyword: string;
    location: string;
    radius: number;
    category: string;
}

export interface SearchResult {
    businesses: Business[];
    location: {
        lat: number;
        lng: number;
    };
}