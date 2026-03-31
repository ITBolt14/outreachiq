"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { getBusinessDetails } from "@/lib/google-places";
import { SavedLead } from "@/types";
import ContactEnrichment from "@/components/contacts/ContactEnrichment";
import SaveLeadButton from "@/components/leads/SaveLeadButton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
    MapPin,
    Phone,
    Globe,
    Star,
    ArrowLeft,
    Building2,
} from "lucide-react";
import { toast } from "sonner";

export default function LeadDetailPage() {
    const params = useParams();
    const router = useRouter();
    const placeId = params.id as string;

    const [lead, setLead] = useState<SavedLead | null>(null);
    const [business, setBusiness] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        if (placeId) {
            fetchLeadData();
        }
    }, [placeId]);

    const fetchLeadData = async () => {
        setLoading(true);
        try {
            // Check if already saved in Supabase
            const { data: savedData } = await supabase
              .from("saved_leads")
              .select("*")
              .eq("place_id", placeId)
              .single()

            if (savedData) {
                setLead(savedData)
                setIsSaved(true);
            }

            // Fetch full busibess details from Google Places
            const businessDetails = await getBusinessDetails(placeId);
            if (businessDetails) {
                setBusiness(businessDetails);
            } else if (savedData) {
                setBusiness(savedData);
            } else {
                toast.error("Could not load business details");
                router.push("/leads");
            }
        } catch {
            toast.error("Failed to load business details");
        } finally {
            setLoading(false);
        }
    };

    const formatCategory = (category: string) => {
        if (!category) return "";
        return category
          .replace(/_/g, " ")
          .replace(/\b\w/g, (l) => l.toUpperCase());
    };

    if (loading) {
        return (
            <div className="flex flex-col gap-6 max-w-4xl mx-auto">
                <Skeleton className="h-8 w-32" />
                <div className="bg-white rounded-2xl border border-gray-100 p-8 flex flex-col gap-4">
                    <Skeleton className="h-8 w-2/3" />
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-1/2" />
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 p-8 flex flex-col gap-4">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-10 w-40" />
                </div>
            </div>
        );
    }

    if (!business) return null;

    return (
        <div className="flex flex-col gap-6 max-w-4xl mx-auto">

            {/* Back Button */}
            <Button 
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="text-gray-500 ml-2 self-start"
            >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
            </Button>

            {/* Business Details Card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 flex flex-col gap-5">

                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 shrink-0">
                                <Building2 className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    {business.business_name}
                                </h1>
                                {business.category && (
                                    <Badge 
                                      variant="secondary"
                                      className="mt-1 bg-blue-50 text-blue-700"
                                    >
                                        {formatCategory(business.category)}
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Save Lead Button */}
                    <SaveLeadButton
                      business={business}
                      isSaved={isSaved}
                      onSave={() => setIsSaved(true)}
                    />
                </div>

                {/* Divider */}
                <div className="border-t border-gray-100" />

                {/* Business Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                    {/* Rating */}
                    {business.rating > 0 && (
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-yellow-50">
                                <Star className="h-4 w-4 text-yellow-500" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400">Rating</p>
                                <p className="text-sm font-medium text-gray-700">
                                    {business.rating}
                                    {business.total_ratings > 0 && (
                                        <span className="text-gray-400 font-normal">
                                            {" "}({business.total_ratings.toLocaleString()} reviews)
                                        </span>
                                    )}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Address */}
                    {business.address && (
                        <div className="flex items-centergap-3">
                            <div className="flex h-9 w-9 items-center justify-center reounded-lg bg-gray-50">
                                <MapPin className="h-4 w-4 text-gray-500" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400">Address</p>
                                <p className="text-sm font-medium text-gray-700">
                                    {business.address}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Phone */}
                    {business.phone && (
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-50">
                                <Phone className="h-4 w-4 text-gray-500" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400">Phone</p>
                                  <a
                                    href={`tel:${business.phone}`}
                                    className="text-sm font-medium text-blue-600 hover:underline"
                                >
                                    {business.phone}
                                </a>
                            </div>
                        </div>
                    )}

                    {/* Website */}
                    {business.website && (
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-50">
                                <Globe className="h-4 w-4 text-gray-500" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400">Website</p>
                                  <a
                                    href={business.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm font-medium text-blue-600 hover:underline truncate"
                                >
                                    {business.website.replace(/^https?:\/\//, "")}
                                </a>
                            </div>
                        </div>
                    )}

                </div>
            </div>

            {/* Contact Enrichment Card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                <ContactEnrichment
                  website={business.website || ""}
                  company={business.business_name}
                  leadId={lead?.id}
                />
            </div>

        </div>
    );
}