process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

export interface PlaceResult {
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
    photo_url?: string;
}

export interface GeocodeResult {
    lat: number;
    lng: number;
    formatted_address: string;
}

// Geocode an address to coordinates
export async function geocodeAddress(
    address: string
): Promise<GeocodeResult | null> {
    try {
        const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?address-${encodeURIComponent(
                address
            )}&key=${process.env.GOOGLE_PLACES_API_KEY}`
        );
        const data = await response.json();

        if (data.results && data.results[0]) {
            const { lat, lng } = data.results[0].geometry.location;
            return {
                lat,
                lng,
                formatted_address: data.results[0].formatted_address,
            };
        }
        return null;
    } catch {
        return null;
    }
}

// Search for nearby businesses
export async function searchNearbyBusinesses(
    lat: number,
    lng: number,
    radius: number,
    keyword: string,
    category: string
): Promise<PlaceResult[]> {
    try {
        const query =
          category !== "all" ? `${keyword} ${category}` : keyword || "business";

        const response = await fetch(
            `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
                query
            )}&location=${lat},${lng}&radius=${radius}&key=${
                process.env.GOOGLE_PLACES_API_KEY
            }`
        );
        const data = await response.json();

        if (!data.results) return [];

        return data.results.map((place: any) => ({
            place_id: place.place_id,
            business_name: place.name,
            address: place.formatted_address || "",
            phone: "",
            website: "",
            rating: place.rating || 0,total_ratings: place.user_ratings_total || 0,
            category: place.types?.[0] || category,
            latitude: place.geometry.location.lat,
            longitude: place.geometry.location.lng,
            open_now: place.opening_hours?.open_now,
            photo_url: place.photos?.[0]?.photo_reference
              ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${process.env.GOOGLE_PLACES_API_KEY}`
              : undefined,
        }));
    } catch {
        return [];
    }
}

// Get full details for a single business
export async function getBusinessDetails(
    placeId: string
): Promise<PlaceResult | null> {
    try {
        const fields =
          "place_id.name,formatted_address,formatted_phone_number,website,rating.user_ratings_total,types.geometry,opening_hours,photos";

        const response = await fetch(
            `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields}&key=${process.env.GOOGLE_PLACES_API_KEY}`
        );
        const data = await response.json();

        if (!data.result) return null;

        const place = data.result;

        return {
            place_id: place.place_id,
            business_name: place.name,
            address: place.formatted_address || "",
            phone: place.formatted_phone_number || "",
            website: place.website || "",
            rating: place.rating || 0,
            total_ratings: place.user_ratings_total || 0,
            category: place.types?.[0] || "",
            latitude: place.geometry.location.lat,
            longitude: place.geometry.location.lng,
            open_now: place.opening_hours?.open_now,
            photo_url: place.photos?.[0]?.photo_reference
              ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${process.env.GOOGLE_PLACES_API_KEY}`
              : undefined,
        };
    } catch {
        return null;
    }
}