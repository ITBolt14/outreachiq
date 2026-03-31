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

export interface SavedLead {
    id: string;
    place_id: string;
    business_name: string;
    address: string;
    phone: string;
    website: string;
    rating: number;
    category: string;
    latitude: number;
    longitude: number;
    saved_at: string;
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

export interface HunterContact {
    first_name: string;
    last_name: string;
    title: string;
    email: string;
    confidence_score: number;
    linkedin_url?:string;
}

export interface HunterResult {
    domain: string;
    company: string;
    contacts: HunterContact[];
}