"use client";

import { PlaceResult } from "@/lib/google-places";
import BusinessCard from "./BusinessCard";
import { Building2 } from "lucide-react";

interface BusinessGridProps {
    businesses: PlaceResult[];
    onViewDetails: (business: PlaceResult) => void;
    onSave: (business: PlaceResult) => void;
    savedIds: string[];
}


export default function BusinessGrid({
    businesses,
    onViewDetails,
    onSave,
    savedIds,
}: BusinessGridProps) {
    if (businesses.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                    <Building2 className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                    No businesses found
                </h3>
                <p className="text-gray-500 text-sm text-center max-w-sm">
                    Try adjusting your search keywords, location or radius to find more 
                    results.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {businesses.map((business) => (
                <BusinessCard
                  key={business.place_id}
                  business={business}
                  onViewDetails={onViewDetails}
                  onSave={onSave}
                  isSaved={savedIds.includes(business.place_id)}
                />
            ))}
        </div>
    );
}