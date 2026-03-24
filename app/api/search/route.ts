import { NextRequest, NextResponse } from "next/server";
import { geocodeAddress, searchNearbyBusinesses } from "@/lib/google-places";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const keyword = searchParams.get("keyword") || "";
    const location = searchParams.get("location") || "";
    const radius = Number(searchParams.get("radius")) || 5000;
    const category = searchParams.get("category") || "all";
    const latParam = searchParams.get("lat");
    const lngParam = searchParams.get("lng");

    try {
        let lat: number;
        let lng: number;

        // Use provided coords or geocode the address
        if (latParam && lngParam) {
            lat = Number(latParam);
            lng = Number(lngParam);
        } else {
            if (!location) {
                return NextResponse.json(
                    { error: "Location is required" },
                    { status: 400 }
                );
            }
            const geocoded = await geocodeAddress(location);
            if (!geocoded) {
                return NextResponse.json(
                    { error: "Could not find that location,  please try again" },
                    { status: 400 }
                );
            }
            lat = geocoded.lat;
            lng = geocoded.lng;
        }

        const businesses = await searchNearbyBusinesses(
            lat,
            lng,
            radius,
            keyword,
            category
        );

        return NextResponse.json({
            businesses,
            total: businesses.length,
            location: { lat, lng },
        });
    } catch {
        return NextResponse.json(
            { error: "Something went wrong, please try again" },
            { status: 500 }
        );
    }
}