"use client";

import { useEffect, useRef } from "react";
import { PlaceResult } from "@/lib/google-places";

interface MapViewProps {
    businesses: PlaceResult[];
    center: { lat: number; lng: number };
    onMarkerClick: (business: PlaceResult) => void;
}

export default function MapView({
    businesses,
    center,
    onMarkerClick,
}: MapViewProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<google.maps.Map | null>(null);
    const markersRef = useRef<google.maps.Marker[]>([]);

    useEffect(() => {
        const initMap = async () => {
            try {
                if (!window.google || !window.google.maps) {
                    await new Promise<void>((resolve, reject) => {
                        const script = document.createElement("script");
                        script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries-places`;
                        script.async = true;
                        script.defer = true;
                        script.onload = () => resolve();
                        script.onerror = () => reject(new Error("Failed to load Google Maps"));
                        document.head.appendChild(script);
                    });
                }

                if (!mapRef.current) return;

                const mapCenter = { lat: center.lat, lng: center.lng };

                const map = new google.maps.Map(mapRef.current, {
                    center: mapCenter,
                    zoom: 13,
                    styles: [
                        {
                            featureType: "poi",
                            elementType: "labels",
                            stylers: [{ visibility: "off" }],
                        },
                    ],
                    mapTypeControl: false,
                    streetViewControl: false,
                    fullscreenControl: true,
                });

                mapInstanceRef.current = map;

                // Clear existing markers
                markersRef.current.forEach((marker) => marker.setMap(null));
                markersRef.current = [];

                // Add a marker for each business
                businesses.forEach((business) => {
                    const marker = new google.maps.Marker({
                        position: {
                            lat: business.latitude,
                            lng: business.longitude,
                        },
                        map,
                        title: business.business_name,
                        icon: {
                            url:
                              "data:image/svg+xml;charset=UTF-8," +
                              encodeURIComponent(`
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
                                  <circle cx="16" cy="16" r="12" fill="#2563eb" stroke="white" stroke-width="2" />
                                  <circle cx="16" cy="16" r="5" fill="white"/>
                                </svg>
                              `),
                              scaledSize: new google.maps.Size(32, 32),
                        },
                    });

                    marker.addListener("click", () => {
                        onMarkerClick(business);
                    });

                    markersRef.current.push(marker);
                });
            } catch (error) {
                console.error("Map initialization error:", error);
            }
        };

        initMap();
    }, [businesses, center]);

    return (
        <div
          ref={mapRef}
          className="w-full h-full rounded-xl border border-gray-100"
          style={{ minHeight: "500px" }}
        />
    );
}