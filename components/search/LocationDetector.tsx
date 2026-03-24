"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MapPin, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface LocationDetectorProps {
    onLocationDetected: (location: string, lat: number, lng: number) => void;
}

export default function LocationDetector({
    onLocationDetected,
}: LocationDetectorProps) {
    const [detecting, setDetecting] = useState(false);

    const detectLocation = () => {
        if (!navigator.geolocation) {
            toast.error("Geolocation is not supported by your browser");
            return;
        }

        setDetecting(true);

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;

                try {
                    const response = await fetch(
                        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
                    );
                    const data = await response.json();

                    if (data.results && data.results[0]) {
                        const address = data.results[0].formatted_address;
                        onLocationDetected(address, latitude, longitude);
                        toast.success("Location detected successfully");
                    }
                } catch {
                    toast.error("Could not get your address, please enter it manually");
                } finally {
                    setDetecting(false);
                }
            },
            () => {
                toast.error("Unable to detect location, plase enter it manually");
                setDetecting(false);
            }
        );
    };

    return (
        <Button
          type="button"
          variant="outline"
          onClick={detectLocation}
          disabled={detecting}
          className="flex items-center gap-2 border-blue-200 text-blue-600 hover:bg-blue-50"
        >
            {detecting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
                <MapPin className="h-4 w-4" />
            )}
            {detecting ? "Detecting..." : "Use My Location"}
        </Button>
    );
}