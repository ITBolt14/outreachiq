"use client";

import { SavedLead } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
    MapPin,
    Phone,
    Globe,
    Star,
    Trash2,
    Users,
    Building2,
    BookMarked,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface LeadsListProps {
    leads: SavedLead[];
    onDelete: (id: string, name: string) => void;
}

export default function LeadsList({ leads, onDelete }: LeadsListProps) {
    const router = useRouter();

    const formatCategory = (category: string) => {
        if (!category) return "";
        return category
          .replace(/_/g, " ")
          .replace(/\b\w/g, (l) => l.toUpperCase());
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-ZA", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    if (leads.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                    <BookMarked className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                    No saved leads yet
                </h3>
                <p className="text-gray-500 text-sm text-center max-w-sm">
                    Search for business and click the bookmark icon to save them
                    here.
                </p>
                <Button
                  onClick={() => router.push("/")}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                    Find Leads
                </Button>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {leads.map((lead) => (
                <Card
                  key={lead.id}
                  className="flex flex-col justify-between hover:shadow-md transition-shadow duration-200 border-gray-100"
                >
                    <CardContent className="pt-6 flex flex-col gap-3">

                        {/* Business Name & Category */}
                        <div className="flex items-start justify-between gap-2">
                            <h3 className="font-semibold text-gray-900 text-lg leading-tight">
                                {lead.business_name}
                            </h3>
                            {lead.category && (
                                <Badge
                                  variant="secondary"
                                  className="text-xs shrink-0 bg-blue-50 text-blue-700"
                                >
                                    {formatCategory(lead.category)}
                                </Badge>
                            )}
                        </div>

                        {/* Rating */}
                        {lead.rating > 0 && (
                            <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm font-madium text-gray-700">
                                    {lead.rating}
                                </span>
                            </div>
                        )}

                        {/* Address */}
                        {lead.address && (
                            <div className="flex items-start gap-2">
                                <MapPin className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
                                <span className="text-sm text-gray-500">{lead.address}</span>
                            </div>
                        )}

                        {/* Phone */}
                        {lead.phone && (
                            <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-gray-400 shrink-0" />
                                <span className="text-sm text-gray-500">{lead.phone}</span>
                            </div>
                        )}

                        {/* Website */}
                        {lead.website && (
                            <div className="flex items-center gap-2">
                                <Globe className="h-4 w-4 text-gray-400 shrink-0" />

                                <a
                                  href={lead.website}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-blue-600 hover:underline truncate"
                                >
                                    {lead.website.replace(/^https?:\/\//, "")}
                                </a>
                            </div>
                        )}

                        {/* Saved Date */}
                        <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-gray-400 shrink-0" />
                            <span className="text-xs text-gray-400">
                                Saved {formatDate(lead.saved_at)}
                            </span>
                        </div>

                    </CardContent>

                    <CardFooter className="flex gap-2 pt-4 border-t border-gray-50">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 text-blue-600 border-blue-200 hover:bg-blue-50"
                          onClick={() => router.push(`/leads/${lead.place_id}`)}
                        >
                            <Users className="h-4 w-4 mr-2" />
                              Find Contacts
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onDelete(lead.id, lead.business_name)}
                          className="border-red-200 text-red-500 hover:bg-red-50"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
}