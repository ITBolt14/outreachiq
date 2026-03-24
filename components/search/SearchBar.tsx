"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { toast } from "sonner";
import LocationDetector from "./LocationDetector";
import SearchFilters from "./SearchFilters";

export default function SearchBar() {
    const router = useRouter();
    const [keyword, setKeyword] = useState("");
    const [location, setLocation] = useState("");
    const [radius, setRadius] = useState(5000);
    const [category, setCategory] = useState("all");
    const [loading, setLoading] = useState(false);
    const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
        null
    );

    const handleLocationDetected = (
        address: string,
        lat: number,
        lng: number
    ) => {
        setLocation(address);
        setCoords({ lat, lng });
    };

    const handleSearch = async () => {
        if (!location.trim()) {
            toast.error("Please enter a location or use GPS detection");
            return;
        }

        setLoading(true);

        try {
            const params = new URLSearchParams({
                keyword: keyword.trim(),
                location: location.trim(),
                radius: radius.toString(),
                category,
                ...(coords && {
                    lat: coords.lat.toString(),
                    lng: coords.lng.toString(), 
                }),
            });

            router.push(`/results?${params.toString()}`);
        } catch {
            toast.error("Something went wrong, please try again");
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-6 w-full">

            {/* Main Search Inputs */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                    <Input
                      placeholder="What type of business? e.g. Accounting, Dental, IT..."
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
                      className="h-12 bg-white border-gray-200 text-gray-900 placeholder:text-gray-400"
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                </div>
                <div className="flex-1 flex gap-2">
                    <Input
                      placeholder="City, area or address..."
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="h-12 bg-white border-gray-200 text-gray-900 placeholder:text-gray-400"
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                    <LocationDetector onLocationDetected={handleLocationDetected} />
                </div>
                <Button
                  onClick={handleSearch}
                  disabled={loading}
                  className="h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                >
                    <Search className="h-4 w-4 mr-2" />
                    {loading ? "Searching..." : "Search"}
                </Button>
            </div>

            {/* Filters */}
            <SearchFilters
              radius={radius}
              category={category}
              onRadiusChange={setRadius}
              onCategoryChange={setCategory}
            />

        </div>
    );
}