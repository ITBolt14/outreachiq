"use client";

import {
    Select, 
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface SearchFiltersProps {
    radius: number;
    category: string;
    onRadiusChange: (radius: number) => void;
    onCategoryChange: (category: string) => void;
}

const categories = [
    { value: "all", label: "All Categories" },
    { value: "accounting", label: "Accounting & Finance" },
    { value: "attorney", label: "Attorney & Legal" },
    { value: "construction", label: "Construction" },
    { value: "dentist", label: "Dental & Medical" },
    { value: "education", label: "Education & Training" },
    { value: "gym", label: "Fitness & Wellness" },
    { value: "restaurant", label: "Food & Restaurant" },
    { value: "hospital", label: "Healthcare" },
    { value: "hotel", label: "Hospitality & Tourism" },
    { value: "insurance", label: "Insurance" },
    { value: "real_estate_agency", label: "Real Estate" },
    { value: "car_dealer", label: "Motor & Automotive" },
    { value: "store", label: "Retail & Shopping" },
    { value: "technology", label: "Technology & IT" },
    { value: "travel_agency", label: "Travel & Tourism" },
];

const radiusOptions = [
    { value: 1000, label: "1 km" },
    { value: 2000, label: "2 km" },
    { value: 3000, label: "3 km" },
    { value: 5000, label: "5 km" },
    { value: 10000, label: "10 km" },
    { value: 20000, label: "20 km" },
    { value: 50000, label: "50 km" },
];

export default function SearchFilters({
    radius,
    category,
    onRadiusChange,
    onCategoryChange,
}: SearchFiltersProps) {
    return (
        <div className="flex flex-wrap gap-4">
            {/* Category Filter */}
            <div className="flex flex-col gap-1 min-w-[200px]">
                <Label className="text-sm text-gray-600">Industry / Category</Label>
                <Select value={category} onValueChange={onCategoryChange}>
                    <SelectTrigger className="bg-white border-gray-200">
                        <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                        {categories.map((cat) => (
                            <SelectItem key={cat.value} value={cat.value}>
                                {cat.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Radius Filter */}
            <div className="flex flex-col gap-1 min-w-[140px]">
                <Label className="text-sm text-gray-600">Search Radius</Label>
                <Select
                  value={radius.toString()}
                  onValueChange={(val) => onRadiusChange(Number(val))}
                >
                    <SelectTrigger className="bg-white border-gray-200">
                        <SelectValue placeholder="Select radius" />
                    </SelectTrigger>
                    <SelectContent>
                        {radiusOptions.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value.toString()}>
                                {opt.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}