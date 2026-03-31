"use client";

import { Badge } from "@/components/ui/badge";
import { Button} from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { PlaceResult } from "@/lib/google-places";
import {
    MapPin,
    Phone,
    Globe,
    Star,
    Users,
    ChevronRight,
    BookMarked,
} from "lucide-react";

interface BusinessCardProps {
    business: PlaceResult;
    onViewDetails: (business: PlaceResult) => void;
    onSave: (business: PlaceResult) => void;
    isSaved?: boolean;
}

export default function BusinessCard({
    business,
    onViewDetails,
    onSave,
    isSaved = false,
}: BusinessCardProps) {
    const formatCategory = (category: string) => {
        return category
          .replace(/_/g, " ")
          .replace(/\b\w/g, (l) => l.toUpperCase());
    };

    return (
        <Card className="flex flex-col justify-between hover:shadow-md transition-shadow duration-200 border-gray-100">
            <CardContent className="pt-6 flex flex-col gap-3">

                {/* Business Name & Category */}
                <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-gray-900 text-lg leading-tight">
                        {business.business_name}
                    </h3>
                    {business.category && (
                    <Badge
                      variant="secondary"
                      className="text-xs shrink-0 bg-blue-50 text-blue-700"
                    >
                        {formatCategory(business.category)}
                    </Badge>
                    )}
                </div>

                {/* Rating */}
                {business.rating > 0 && (
                    <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium text-gray-700">
                            {business.rating}
                        </span>
                        {business.total_ratings > 0 && (
                            <span className="text-sm text-gray-400">
                                ({business.total_ratings.toLocaleString()} reviews)
                            </span>
                        )}
                    </div>
                )}

                {/* Address */}
                {business.address && (
                    <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
                        <span className="text-sm text-gray-500">{business.address}</span>
                    </div>
                )}

                {/* Phone */}
                {business.phone && (
                    <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-400 shrink-0" />
                        <span className="text-sm text-gray-500">{business.phone}</span>
                    </div>
                )}

                {/* Website */}
                {business.website && (
                    <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-gray-400 shrink-0" />
                        <a
                          href={business.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline truncate"
                        >
                          {business.website
                            .replace("https://", "")
                            .replace("http://", "")}
                        </a>
                    </div>
                )}

                {/* Open Now Badge */}
                {business.open_now !== undefined && (
                    <div>
                        <Badge
                          variant="outline"
                          className={
                            business.open_now
                              ? "border-green-200 text-green-700 bg-green-50"
                              : "border-red-200 text-red-700 bg-red-50"
                          }
                        >
                            {business.open_now ? "Open Now" : "Closed"}
                        </Badge>
                    </div>
                )}

            </CardContent>

            <CardFooter className="flex gap-2 pt-4 border-t border-gray-50">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-blue-600 border-blue-200 hover:bg-blue-50"
                  onClick={() => onViewDetails(business)}
                >
                    <Users className="h-4 w-4 mr-2" />
                    Find Contacts
                    <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onSave(business)}
                  className={
                    isSaved
                      ? "border-green-200 text-green-700 bg-green-50"
                      : "border-gray-200 text-gray-600 hover:bg-gray-50"
                  }
                >
                    <BookMarked className="h-4 w-4" />
                </Button>
            </CardFooter>
        </Card>
    );
}